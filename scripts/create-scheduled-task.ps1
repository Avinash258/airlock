# PowerShell script to automatically create Windows Scheduled Task
# Run this script as Administrator

param(
    [string]$ProjectPath = (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)),
    [string]$TaskName = "Kiosk Automation on Login",
    [int]$DelaySeconds = 30
)

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Windows Task Scheduler Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify project path
if (-not (Test-Path $ProjectPath)) {
    Write-Host "ERROR: Project path not found: $ProjectPath" -ForegroundColor Red
    exit 1
}

$scriptPath = Join-Path $ProjectPath "scripts\run-kiosk-automation.ps1"

if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: Script not found: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "Project Path: $ProjectPath" -ForegroundColor Green
Write-Host "Script Path: $scriptPath" -ForegroundColor Green
Write-Host "Task Name: $TaskName" -ForegroundColor Green
Write-Host ""

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "Task '$TaskName' already exists." -ForegroundColor Yellow
    $response = Read-Host "Do you want to delete and recreate it? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "Existing task deleted." -ForegroundColor Green
    } else {
        Write-Host "Cancelled. Exiting." -ForegroundColor Yellow
        exit 0
    }
}

try {
    # Create action
    $action = New-ScheduledTaskAction -Execute "powershell.exe" `
        -Argument "-ExecutionPolicy Bypass -NoProfile -File `"$scriptPath`"" `
        -WorkingDirectory $ProjectPath

    # Create trigger (on logon with delay)
    $trigger = New-ScheduledTaskTrigger -AtLogOn
    $trigger.Delay = "PT${DelaySeconds}S"  # Delay in seconds

    # Create settings
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable:$false `
        -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
        -RestartCount 3 `
        -RestartInterval (New-TimeSpan -Minutes 5)

    # Create principal (run as current user with highest privileges)
    $principal = New-ScheduledTaskPrincipal `
        -UserId "$env:USERDOMAIN\$env:USERNAME" `
        -LogonType Interactive `
        -RunLevel Highest

    # Register the task
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal `
        -Description "Automatically run kiosk automation when Windows logs in" `
        -Force | Out-Null

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Task created successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Task Details:" -ForegroundColor Cyan
    Write-Host "  Name: $TaskName" -ForegroundColor White
    Write-Host "  Trigger: At logon (with $DelaySeconds second delay)" -ForegroundColor White
    Write-Host "  Script: $scriptPath" -ForegroundColor White
    Write-Host ""
    Write-Host "To test the task:" -ForegroundColor Yellow
    Write-Host "  1. Open Task Scheduler" -ForegroundColor White
    Write-Host "  2. Find '$TaskName' in Task Scheduler Library" -ForegroundColor White
    Write-Host "  3. Right-click → Run" -ForegroundColor White
    Write-Host ""
    Write-Host "To view logs:" -ForegroundColor Yellow
    Write-Host "  Check: $ProjectPath\logs\" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to create scheduled task" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

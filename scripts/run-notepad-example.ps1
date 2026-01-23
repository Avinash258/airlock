# PowerShell script to run Notepad automation example

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Join-Path $scriptPath ".."
Set-Location $projectDir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Running Notepad Automation Example" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

& mvn exec:java "-Dexec.mainClass=com.kiosk.examples.NotepadAutomationImproved"

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

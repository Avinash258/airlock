# PowerShell script to run kiosk automation
# This script can be scheduled via Windows Task Scheduler

# Set the project directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Join-Path $scriptPath ".."
Set-Location $projectDir

# Log file with timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logDir = Join-Path $projectDir "logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}
$logFile = Join-Path $logDir "automation_$timestamp.log"

# Function to write log
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Out-File -FilePath $logFile -Append
    Write-Host $Message
}

try {
    Write-Log "========================================"
    Write-Log "Kiosk Automation Started"
    Write-Log "Project Directory: $projectDir"
    Write-Log "========================================"
    
    # Check if Maven is available
    $mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
    if (-not $mvnCmd) {
        throw "Maven (mvn) command not found. Please ensure Maven is installed and in PATH."
    }
    
    # Run the automation
    Write-Log "Executing kiosk automation..."
    $result = & mvn exec:java -Dexec.mainClass="com.kiosk.KioskAutomationRunner" -Dexec.classpathScope=compile 2>&1
    
    # Write output to log
    $result | ForEach-Object { Write-Log $_ }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "========================================"
        Write-Log "Automation completed successfully"
        Write-Log "========================================"
        exit 0
    } else {
        Write-Log "========================================"
        Write-Log "Automation failed with exit code: $LASTEXITCODE"
        Write-Log "========================================"
        exit $LASTEXITCODE
    }
} catch {
    Write-Log "========================================"
    Write-Log "Error: $($_.Exception.Message)"
    Write-Log "Stack Trace: $($_.ScriptStackTrace)"
    Write-Log "========================================"
    exit 1
}

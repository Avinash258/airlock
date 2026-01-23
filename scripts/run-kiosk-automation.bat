@echo off
REM Batch script to run kiosk automation
REM This script can be scheduled via Windows Task Scheduler

REM Set the project directory (adjust this path to your actual project location)
set PROJECT_DIR=%~dp0..
cd /d "%PROJECT_DIR%"

REM Set Java home (adjust if needed)
REM set JAVA_HOME=C:\Program Files\Java\jdk-11

REM Set Maven home (adjust if needed)
REM set MAVEN_HOME=C:\apache-maven-3.9.5

REM Log file with timestamp
set LOG_FILE=logs\automation_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.log
set LOG_FILE=%LOG_FILE: =0%

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Run the automation using Maven
echo ======================================== >> "%LOG_FILE%"
echo Kiosk Automation Started >> "%LOG_FILE%"
echo Date: %date% %time% >> "%LOG_FILE%"
echo ======================================== >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

call mvn exec:java -Dexec.mainClass="com.kiosk.KioskAutomationRunner" -Dexec.classpathScope=compile >> "%LOG_FILE%" 2>&1

REM Check exit code
if %ERRORLEVEL% EQU 0 (
    echo ======================================== >> "%LOG_FILE%"
    echo Automation completed successfully >> "%LOG_FILE%"
    echo Date: %date% %time% >> "%LOG_FILE%"
    echo ======================================== >> "%LOG_FILE%"
) else (
    echo ======================================== >> "%LOG_FILE%"
    echo Automation failed with error code: %ERRORLEVEL% >> "%LOG_FILE%"
    echo Date: %date% %time% >> "%LOG_FILE%"
    echo ======================================== >> "%LOG_FILE%"
)

exit /b %ERRORLEVEL%

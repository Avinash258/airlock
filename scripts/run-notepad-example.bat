@echo off
REM Script to run Notepad automation example

cd /d %~dp0..
echo Running Notepad Automation Example...
echo.

mvn exec:java -Dexec.mainClass="com.kiosk.examples.NotepadAutomationImproved"

pause

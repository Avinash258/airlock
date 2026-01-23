# Windows Task Scheduler Setup Guide

This guide explains how to set up Windows Task Scheduler to automatically run the kiosk automation script when Windows logs in.

## Prerequisites

1. Java JDK 11 or higher installed
2. Maven installed and in PATH
3. Project compiled (`mvn clean install`)

## Method 1: Using Windows Task Scheduler GUI

### Step 1: Open Task Scheduler

1. Press `Win + R` to open Run dialog
2. Type `taskschd.msc` and press Enter
3. Or search for "Task Scheduler" in Start menu

### Step 2: Create Basic Task

1. Click **"Create Basic Task"** in the right panel
2. Enter task name: `Kiosk Automation on Login`
3. Enter description: `Automatically run kiosk automation when Windows logs in`
4. Click **Next**

### Step 3: Set Trigger

1. Select **"When I log on"**
2. Click **Next**

### Step 4: Set Action

1. Select **"Start a program"**
2. Click **Next**

### Step 5: Configure Program

**For Batch Script:**
- Program/script: `C:\path\to\your\project\scripts\run-kiosk-automation.bat`
- Start in: `C:\path\to\your\project`

**For PowerShell Script:**
- Program/script: `powershell.exe`
- Add arguments: `-ExecutionPolicy Bypass -File "C:\path\to\your\project\scripts\run-kiosk-automation.ps1"`
- Start in: `C:\path\to\your\project`

Click **Next**

### Step 6: Review and Finish

1. Review the settings
2. Check **"Open the Properties dialog for this task when I click Finish"**
3. Click **Finish**

### Step 7: Configure Advanced Settings

In the Properties dialog:

1. **General Tab:**
   - Check **"Run whether user is logged on or not"** (if you want it to run even when locked)
   - Check **"Run with highest privileges"** (if needed)
   - Select **"Configure for: Windows 10"** (or your Windows version)

2. **Triggers Tab:**
   - Edit the trigger
   - Check **"Delay task for: 30 seconds"** (to allow system to fully load)
   - Click **OK**

3. **Conditions Tab:**
   - Uncheck **"Start the task only if the computer is on AC power"** (if you want it to run on battery)
   - Check **"Wake the computer to run this task"** (optional)

4. **Settings Tab:**
   - Check **"Allow task to be run on demand"**
   - Check **"Run task as soon as possible after a scheduled start is missed"**
   - Set **"If the task fails, restart every: 5 minutes"** with **"Attempt to restart up to: 3 times"**

5. Click **OK** to save

## Method 2: Using Command Line (schtasks)

### Create Task Using Command Prompt (Run as Administrator)

```cmd
schtasks /create /tn "Kiosk Automation on Login" /tr "C:\path\to\your\project\scripts\run-kiosk-automation.bat" /sc onlogon /rl highest /f
```

### Create Task for PowerShell Script

```cmd
schtasks /create /tn "Kiosk Automation on Login" /tr "powershell.exe -ExecutionPolicy Bypass -File \"C:\path\to\your\project\scripts\run-kiosk-automation.ps1\"" /sc onlogon /rl highest /f
```

### Parameters Explanation:
- `/tn` - Task name
- `/tr` - Task to run (program/script path)
- `/sc onlogon` - Trigger: when user logs on
- `/rl highest` - Run with highest privileges
- `/f` - Force (overwrite if task exists)

### Add Delay to Task

```cmd
schtasks /change /tn "Kiosk Automation on Login" /delay 0001:00:00
```
(This adds a 1-minute delay)

## Method 3: Using PowerShell

### Create Task with PowerShell (Run as Administrator)

```powershell
$action = New-ScheduledTaskAction -Execute "C:\path\to\your\project\scripts\run-kiosk-automation.ps1"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$trigger.Delay = "PT30S"  # 30 second delay
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest

Register-ScheduledTask -TaskName "Kiosk Automation on Login" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Automatically run kiosk automation when Windows logs in"
```

## Verify Task is Created

1. Open Task Scheduler
2. Navigate to **Task Scheduler Library**
3. Look for **"Kiosk Automation on Login"**
4. Right-click → **Run** to test manually

## Test the Task

1. Right-click on the task → **Run**
2. Check the logs in `logs/` directory
3. Verify automation executed successfully

## Troubleshooting

### Task Not Running

1. **Check Task History:**
   - In Task Scheduler, select your task
   - Click **"History"** tab
   - Look for errors

2. **Check Logs:**
   - Check `logs/` directory in project folder
   - Review log files for errors

3. **Verify Paths:**
   - Ensure all paths in the script are correct
   - Use absolute paths instead of relative paths

4. **Check Permissions:**
   - Ensure user has permission to run the task
   - Try running with "Run with highest privileges"

5. **Verify Java and Maven:**
   - Open Command Prompt
   - Run `java -version` and `mvn -version`
   - Ensure both are accessible

### Common Issues

- **"Maven not found"**: Add Maven to system PATH
- **"Java not found"**: Set JAVA_HOME environment variable
- **"Access denied"**: Run Task Scheduler as Administrator
- **"Task runs but nothing happens"**: Check log files for errors

## Disable/Delete Task

### Using GUI:
1. Open Task Scheduler
2. Find the task
3. Right-click → **Disable** or **Delete**

### Using Command Line:
```cmd
schtasks /delete /tn "Kiosk Automation on Login" /f
```

### Using PowerShell:
```powershell
Unregister-ScheduledTask -TaskName "Kiosk Automation on Login" -Confirm:$false
```

## Additional Triggers

You can also set up other triggers:

- **At startup**: `/sc onstart`
- **Daily at specific time**: `/sc daily /st HH:MM`
- **Weekly**: `/sc weekly /d MON /st HH:MM`
- **When idle**: `/sc onidle /i 10` (after 10 minutes of idle)

## Security Notes

⚠️ **Important:**
- The script contains credentials in `config.properties`
- Ensure the project directory has appropriate file permissions
- Consider using Windows Credential Manager for sensitive data
- Review and update `.gitignore` to exclude sensitive files

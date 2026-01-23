# Desktop Automation Examples

This document contains examples of using the DesktopAutomation utility.

## Notepad Automation Example

### Example 1: Basic Notepad Automation

Opens Notepad, types "hi avi", and saves to desktop.

**Run:**
```bash
mvn exec:java -Dexec.mainClass="com.kiosk.examples.NotepadAutomationExample"
```

**What it does:**
1. Opens Notepad using Windows Run dialog (Win+R)
2. Types "hi avi"
3. Opens Save dialog (Ctrl+S)
4. Navigates to Desktop and saves as "hi_avi.txt"
5. Closes Notepad

### Example 2: Improved Notepad Automation

More reliable version with error handling and backup method.

**Run:**
```bash
mvn exec:java -Dexec.mainClass="com.kiosk.examples.NotepadAutomationImproved"
```

**Features:**
- Uses Robot class for automation
- Includes direct file write as backup method
- Better error handling
- File verification

## Code Example

```java
import com.kiosk.utils.DesktopAutomation;
import java.awt.event.KeyEvent;

DesktopAutomation desktop = new DesktopAutomation();

// Open Notepad
desktop.openApplication("notepad");
desktop.delay(2000);

// Type text
desktop.typeText("hi avi");

// Save (Ctrl+S)
desktop.keyPress(KeyEvent.VK_CONTROL, KeyEvent.VK_S);
desktop.delay(1500);

// Type file path
String desktopPath = System.getProperty("user.home") + "\\Desktop";
desktop.typeText(desktopPath + "\\hi_avi.txt");
desktop.delay(500);

// Press Enter to save
desktop.pressEnter();
desktop.delay(1000);

// Close Notepad
desktop.closeWindow();
```

## Notes

- The automation uses screen coordinates and keyboard simulation
- Timing delays are important for reliability
- File paths use Windows format (`\\` for directory separators)
- Desktop path is obtained from `user.home` system property

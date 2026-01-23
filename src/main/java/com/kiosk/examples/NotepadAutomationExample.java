package com.kiosk.examples;

import com.kiosk.utils.DesktopAutomation;
import java.awt.event.KeyEvent;
import java.io.File;

/**
 * Example: Automate Notepad to write text and save to desktop
 * This demonstrates desktop automation using the DesktopAutomation utility.
 */
public class NotepadAutomationExample {
    
    public static void main(String[] args) {
        try {
            System.out.println("Starting Notepad automation...");
            
            DesktopAutomation desktop = new DesktopAutomation();
            
            // Step 1: Open Notepad using Windows Run dialog
            System.out.println("Opening Notepad...");
            desktop.openApplication("notepad");
            desktop.delay(2000); // Wait for Notepad to open
            
            // Step 2: Type the text
            System.out.println("Typing text...");
            desktop.typeText("hi avi");
            desktop.delay(500);
            
            // Step 3: Save the file (Ctrl+S)
            System.out.println("Opening Save dialog...");
            desktop.keyPress(KeyEvent.VK_CONTROL, KeyEvent.VK_S);
            desktop.delay(1500); // Wait for Save dialog to open
            
            // Step 4: Navigate to Desktop
            // Press Alt+N to focus on filename field, then type path
            System.out.println("Navigating to Desktop...");
            desktop.delay(500);
            
            // Get Desktop path
            String desktopPath = System.getProperty("user.home") + "\\Desktop";
            String fileName = "hi_avi.txt";
            String fullPath = desktopPath + "\\" + fileName;
            
            // Type the full path in the Save dialog
            // First, clear any existing text (Ctrl+A then type)
            desktop.keyPress(KeyEvent.VK_CONTROL, KeyEvent.VK_A);
            desktop.delay(200);
            desktop.typeText(fullPath);
            desktop.delay(500);
            
            // Step 5: Press Enter to save
            System.out.println("Saving file...");
            desktop.pressEnter();
            desktop.delay(1000);
            
            // Step 6: Close Notepad (Alt+F4)
            System.out.println("Closing Notepad...");
            desktop.closeWindow();
            desktop.delay(500);
            
            // Verify file was created
            File savedFile = new File(fullPath);
            if (savedFile.exists()) {
                System.out.println("✓ Success! File saved to: " + fullPath);
            } else {
                System.out.println("⚠ Warning: File may not have been saved. Check: " + fullPath);
            }
            
            System.out.println("Automation completed!");
            
        } catch (Exception e) {
            System.err.println("Error during automation: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

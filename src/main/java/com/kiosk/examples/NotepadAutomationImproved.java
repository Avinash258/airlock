package com.kiosk.examples;

import com.kiosk.utils.DesktopAutomation;
import java.awt.event.KeyEvent;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Improved Notepad Automation Example
 * This version uses a more reliable approach with better error handling.
 */
public class NotepadAutomationImproved {
    
    public static void main(String[] args) {
        try {
            System.out.println("========================================");
            System.out.println("Notepad Automation - Improved Version");
            System.out.println("========================================");
            System.out.println();
            
            DesktopAutomation desktop = new DesktopAutomation();
            
            // Get Desktop path
            String desktopPath = System.getProperty("user.home") + "\\Desktop";
            String fileName = "hi_avi.txt";
            String fullPath = desktopPath + "\\" + fileName;
            
            System.out.println("Target file: " + fullPath);
            System.out.println();
            
            // Method 1: Use Desktop Automation (Robot class)
            System.out.println("Method 1: Using Desktop Automation...");
            automateWithRobot(desktop, fullPath);
            
            // Alternative Method 2: Direct file write (more reliable)
            System.out.println();
            System.out.println("Method 2: Direct file write (backup method)...");
            writeFileDirectly(fullPath, "hi avi");
            
            System.out.println();
            System.out.println("========================================");
            System.out.println("Automation completed!");
            System.out.println("========================================");
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Automate Notepad using Robot class
     */
    private static void automateWithRobot(DesktopAutomation desktop, String filePath) {
        try {
            // Step 1: Open Notepad
            System.out.println("  → Opening Notepad...");
            desktop.openApplication("notepad");
            desktop.delay(2000);
            
            // Step 2: Type text
            System.out.println("  → Typing 'hi avi'...");
            desktop.typeText("hi avi");
            desktop.delay(500);
            
            // Step 3: Open Save dialog (Ctrl+S)
            System.out.println("  → Opening Save dialog...");
            desktop.keyPress(KeyEvent.VK_CONTROL, KeyEvent.VK_S);
            desktop.delay(2000);
            
            // Step 4: Type file path
            System.out.println("  → Entering file path...");
            desktop.delay(500);
            
            // Clear existing text and type full path
            desktop.keyPress(KeyEvent.VK_CONTROL, KeyEvent.VK_A);
            desktop.delay(200);
            desktop.typeText(filePath);
            desktop.delay(1000);
            
            // Step 5: Save (Enter)
            System.out.println("  → Saving file...");
            desktop.pressEnter();
            desktop.delay(2000);
            
            // Step 6: Handle "File already exists" dialog if it appears
            // Press Enter to confirm overwrite (if dialog appears)
            desktop.pressEnter();
            desktop.delay(1000);
            
            // Step 7: Close Notepad
            System.out.println("  → Closing Notepad...");
            desktop.closeWindow();
            desktop.delay(500);
            
            // Verify
            File file = new File(filePath);
            if (file.exists()) {
                System.out.println("  ✓ File saved successfully!");
            } else {
                System.out.println("  ⚠ File may not have been saved");
            }
            
        } catch (Exception e) {
            System.err.println("  ✗ Error in Robot automation: " + e.getMessage());
        }
    }
    
    /**
     * Direct file write method (more reliable backup)
     */
    private static void writeFileDirectly(String filePath, String content) {
        try {
            File file = new File(filePath);
            FileWriter writer = new FileWriter(file);
            writer.write(content);
            writer.close();
            System.out.println("  ✓ File written directly: " + filePath);
        } catch (IOException e) {
            System.err.println("  ✗ Error writing file: " + e.getMessage());
        }
    }
}

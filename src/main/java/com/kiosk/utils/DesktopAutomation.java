package com.kiosk.utils;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.io.File;
import java.io.IOException;

/**
 * Desktop Automation utility class for keyboard and mouse automation.
 * Uses Java Robot class for desktop automation tasks.
 */
public class DesktopAutomation {
    
    private Robot robot;
    private static final int DEFAULT_DELAY = 100; // milliseconds
    
    public DesktopAutomation() throws AWTException {
        this.robot = new Robot();
        this.robot.setAutoDelay(DEFAULT_DELAY);
    }
    
    /**
     * Type text using keyboard simulation
     */
    public void typeText(String text) {
        StringSelection stringSelection = new StringSelection(text);
        Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
        clipboard.setContents(stringSelection, null);
        
        // Use Ctrl+V to paste
        robot.keyPress(KeyEvent.VK_CONTROL);
        robot.keyPress(KeyEvent.VK_V);
        robot.keyRelease(KeyEvent.VK_V);
        robot.keyRelease(KeyEvent.VK_CONTROL);
        
        delay(200);
    }
    
    /**
     * Type text character by character (slower but more reliable)
     */
    public void typeTextSlow(String text) {
        for (char c : text.toCharArray()) {
            typeChar(c);
            delay(50);
        }
    }
    
    /**
     * Type a single character
     */
    public void typeChar(char character) {
        if (Character.isUpperCase(character)) {
            robot.keyPress(KeyEvent.VK_SHIFT);
        }
        
        int keyCode = getKeyCode(character);
        if (keyCode != -1) {
            robot.keyPress(keyCode);
            robot.keyRelease(keyCode);
        }
        
        if (Character.isUpperCase(character)) {
            robot.keyRelease(KeyEvent.VK_SHIFT);
        }
    }
    
    /**
     * Press Enter key
     */
    public void pressEnter() {
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.keyRelease(KeyEvent.VK_ENTER);
        delay(200);
    }
    
    /**
     * Press Tab key
     */
    public void pressTab() {
        robot.keyPress(KeyEvent.VK_TAB);
        robot.keyRelease(KeyEvent.VK_TAB);
        delay(100);
    }
    
    /**
     * Press Escape key
     */
    public void pressEscape() {
        robot.keyPress(KeyEvent.VK_ESCAPE);
        robot.keyRelease(KeyEvent.VK_ESCAPE);
        delay(100);
    }
    
    /**
     * Click at specific screen coordinates
     */
    public void click(int x, int y) {
        robot.mouseMove(x, y);
        delay(100);
        robot.mousePress(InputEvent.BUTTON1_DOWN_MASK);
        robot.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);
        delay(200);
    }
    
    /**
     * Double click at specific screen coordinates
     */
    public void doubleClick(int x, int y) {
        robot.mouseMove(x, y);
        delay(100);
        robot.mousePress(InputEvent.BUTTON1_DOWN_MASK);
        robot.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);
        delay(50);
        robot.mousePress(InputEvent.BUTTON1_DOWN_MASK);
        robot.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);
        delay(200);
    }
    
    /**
     * Right click at specific screen coordinates
     */
    public void rightClick(int x, int y) {
        robot.mouseMove(x, y);
        delay(100);
        robot.mousePress(InputEvent.BUTTON3_DOWN_MASK);
        robot.mouseRelease(InputEvent.BUTTON3_DOWN_MASK);
        delay(200);
    }
    
    /**
     * Move mouse to coordinates
     */
    public void moveMouse(int x, int y) {
        robot.mouseMove(x, y);
        delay(100);
    }
    
    /**
     * Scroll mouse wheel
     */
    public void scroll(int wheelAmt) {
        robot.mouseWheel(wheelAmt);
        delay(200);
    }
    
    /**
     * Press key combination (e.g., Ctrl+C, Alt+Tab)
     */
    public void keyPress(int... keyCodes) {
        for (int keyCode : keyCodes) {
            robot.keyPress(keyCode);
        }
        delay(100);
        for (int keyCode : keyCodes) {
            robot.keyRelease(keyCode);
        }
        delay(200);
    }
    
    /**
     * Take screenshot of entire screen
     */
    public void captureScreen(String filePath) throws IOException {
        Rectangle screenRect = new Rectangle(Toolkit.getDefaultToolkit().getScreenSize());
        java.awt.image.BufferedImage capture = robot.createScreenCapture(screenRect);
        javax.imageio.ImageIO.write(capture, "png", new File(filePath));
    }
    
    /**
     * Wait/delay
     */
    public void delay(int milliseconds) {
        robot.delay(milliseconds);
    }
    
    /**
     * Get key code for character
     */
    private int getKeyCode(char character) {
        switch (character) {
            case 'a': case 'A': return KeyEvent.VK_A;
            case 'b': case 'B': return KeyEvent.VK_B;
            case 'c': case 'C': return KeyEvent.VK_C;
            case 'd': case 'D': return KeyEvent.VK_D;
            case 'e': case 'E': return KeyEvent.VK_E;
            case 'f': case 'F': return KeyEvent.VK_F;
            case 'g': case 'G': return KeyEvent.VK_G;
            case 'h': case 'H': return KeyEvent.VK_H;
            case 'i': case 'I': return KeyEvent.VK_I;
            case 'j': case 'J': return KeyEvent.VK_J;
            case 'k': case 'K': return KeyEvent.VK_K;
            case 'l': case 'L': return KeyEvent.VK_L;
            case 'm': case 'M': return KeyEvent.VK_M;
            case 'n': case 'N': return KeyEvent.VK_N;
            case 'o': case 'O': return KeyEvent.VK_O;
            case 'p': case 'P': return KeyEvent.VK_P;
            case 'q': case 'Q': return KeyEvent.VK_Q;
            case 'r': case 'R': return KeyEvent.VK_R;
            case 's': case 'S': return KeyEvent.VK_S;
            case 't': case 'T': return KeyEvent.VK_T;
            case 'u': case 'U': return KeyEvent.VK_U;
            case 'v': case 'V': return KeyEvent.VK_V;
            case 'w': case 'W': return KeyEvent.VK_V;
            case 'x': case 'X': return KeyEvent.VK_X;
            case 'y': case 'Y': return KeyEvent.VK_Y;
            case 'z': case 'Z': return KeyEvent.VK_Z;
            case '0': return KeyEvent.VK_0;
            case '1': return KeyEvent.VK_1;
            case '2': return KeyEvent.VK_2;
            case '3': return KeyEvent.VK_3;
            case '4': return KeyEvent.VK_4;
            case '5': return KeyEvent.VK_5;
            case '6': return KeyEvent.VK_6;
            case '7': return KeyEvent.VK_7;
            case '8': return KeyEvent.VK_8;
            case '9': return KeyEvent.VK_9;
            case ' ': return KeyEvent.VK_SPACE;
            case '\n': return KeyEvent.VK_ENTER;
            case '\t': return KeyEvent.VK_TAB;
            default: return -1;
        }
    }
    
    /**
     * Open application using Windows Run dialog (Win+R)
     */
    public void openApplication(String appName) {
        keyPress(KeyEvent.VK_WINDOWS, KeyEvent.VK_R);
        delay(500);
        typeText(appName);
        delay(300);
        pressEnter();
        delay(1000);
    }
    
    /**
     * Switch to window using Alt+Tab
     */
    public void switchWindow() {
        keyPress(KeyEvent.VK_ALT, KeyEvent.VK_TAB);
        delay(500);
        robot.keyRelease(KeyEvent.VK_ALT);
    }
    
    /**
     * Close current window (Alt+F4)
     */
    public void closeWindow() {
        keyPress(KeyEvent.VK_ALT, KeyEvent.VK_F4);
        delay(500);
    }
    
    /**
     * Minimize all windows (Win+M)
     */
    public void minimizeAllWindows() {
        keyPress(KeyEvent.VK_WINDOWS, KeyEvent.VK_M);
        delay(500);
    }
    
    /**
     * Get screen dimensions
     */
    public Dimension getScreenSize() {
        return Toolkit.getDefaultToolkit().getScreenSize();
    }
}

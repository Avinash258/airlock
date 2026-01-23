package com.kiosk;

import com.kiosk.pages.LoginPage;
import com.kiosk.utils.ConfigReader;
import com.kiosk.utils.DriverManager;
import org.openqa.selenium.WebDriver;

/**
 * Main runner class for kiosk automation.
 * This class can be executed directly or scheduled via Windows Task Scheduler.
 */
public class KioskAutomationRunner {
    
    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("Kiosk Automation Runner");
        System.out.println("========================================");
        System.out.println("Started at: " + java.time.LocalDateTime.now());
        System.out.println();
        
        WebDriver driver = null;
        
        try {
            // Read configuration
            String kioskUrl = ConfigReader.getKioskUrl();
            String username = ConfigReader.getUsername();
            String browser = ConfigReader.getBrowser();
            boolean headless = ConfigReader.isHeadless();
            
            System.out.println("Configuration:");
            System.out.println("  Kiosk URL: " + kioskUrl);
            System.out.println("  Username: " + username);
            System.out.println("  Browser: " + browser);
            System.out.println("  Headless: " + headless);
            System.out.println();
            
            // Initialize driver
            System.out.println("Initializing WebDriver...");
            driver = DriverManager.initializeDriver(browser);
            System.out.println("WebDriver initialized successfully");
            System.out.println();
            
            // Navigate to kiosk
            System.out.println("Navigating to kiosk...");
            driver.get(kioskUrl);
            System.out.println("Navigation completed");
            System.out.println();
            
            // Initialize page objects
            LoginPage loginPage = new LoginPage(driver);
            
            // Wait for login form
            System.out.println("Waiting for login form...");
            loginPage.waitForLoginForm();
            System.out.println("Login form loaded");
            System.out.println();
            
            // Perform login
            System.out.println("Performing login...");
            loginPage.login(username, ConfigReader.getPassword());
            System.out.println("Login completed");
            System.out.println();
            
            // Wait for post-login page
            System.out.println("Waiting for page to load after login...");
            Thread.sleep(5000);
            
            String currentUrl = driver.getCurrentUrl();
            String pageTitle = driver.getTitle();
            
            System.out.println("Post-login status:");
            System.out.println("  Page Title: " + pageTitle);
            System.out.println("  Current URL: " + currentUrl);
            System.out.println();
            
            System.out.println("========================================");
            System.out.println("Automation completed successfully!");
            System.out.println("Completed at: " + java.time.LocalDateTime.now());
            System.out.println("========================================");
            
            // Keep browser open for a few seconds if not headless
            if (!headless) {
                System.out.println("Keeping browser open for 10 seconds...");
                Thread.sleep(10000);
            }
            
        } catch (Exception e) {
            System.err.println("Error during automation: " + e.getMessage());
            e.printStackTrace();
            
            // Take screenshot on error if possible
            if (driver != null) {
                try {
                    byte[] screenshot = ((org.openqa.selenium.TakesScreenshot) driver)
                        .getScreenshotAs(org.openqa.selenium.OutputType.BYTES);
                    java.nio.file.Files.write(
                        java.nio.file.Paths.get("error_screenshot_" + 
                            System.currentTimeMillis() + ".png"),
                        screenshot
                    );
                    System.out.println("Error screenshot saved");
                } catch (Exception screenshotException) {
                    System.err.println("Failed to save screenshot: " + screenshotException.getMessage());
                }
            }
            
            System.exit(1);
        } finally {
            // Close driver
            if (driver != null) {
                System.out.println("Closing browser...");
                DriverManager.quitDriver();
                System.out.println("Browser closed");
            }
        }
    }
}

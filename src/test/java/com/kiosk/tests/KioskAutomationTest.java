package com.kiosk.tests;

import com.kiosk.pages.LoginPage;
import com.kiosk.utils.ConfigReader;
import com.kiosk.utils.DriverManager;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

/**
 * Main automation test class for kiosk system.
 * This class demonstrates the complete automation flow.
 */
public class KioskAutomationTest {
    
    private WebDriver driver;
    private LoginPage loginPage;
    
    @BeforeClass
    public void setUp() {
        System.out.println("=== Starting Kiosk Automation Test ===");
        System.out.println("Browser: " + ConfigReader.getBrowser());
        System.out.println("Kiosk URL: " + ConfigReader.getKioskUrl());
        
        // Initialize driver
        driver = DriverManager.initializeDriver(ConfigReader.getBrowser());
        
        // Navigate to kiosk
        driver.get(ConfigReader.getKioskUrl());
        
        // Initialize page objects
        loginPage = new LoginPage(driver);
    }
    
    @Test(priority = 1, description = "Navigate to kiosk and verify page loads")
    public void testNavigateToKiosk() {
        System.out.println("\n--- Test: Navigate to Kiosk ---");
        
        // Wait for page to load
        loginPage.waitForPageLoad();
        
        // Verify page title
        String pageTitle = driver.getTitle();
        System.out.println("Page Title: " + pageTitle);
        
        // Verify current URL
        String currentUrl = driver.getCurrentUrl();
        System.out.println("Current URL: " + currentUrl);
        Assert.assertTrue(currentUrl.contains(ConfigReader.getKioskUrl()) || 
                         currentUrl.contains("8442"),
            "Should be on kiosk URL");
    }
    
    @Test(priority = 2, description = "Verify login form elements are present")
    public void testLoginFormElements() {
        System.out.println("\n--- Test: Verify Login Form Elements ---");
        
        // Wait for login form
        loginPage.waitForLoginForm();
        
        // Verify login page is displayed
        boolean isLoginPage = loginPage.isLoginPageDisplayed();
        System.out.println("Login page displayed: " + isLoginPage);
        Assert.assertTrue(isLoginPage, "Login page should be displayed");
    }
    
    @Test(priority = 3, description = "Perform login with valid credentials")
    public void testLogin() {
        System.out.println("\n--- Test: Perform Login ---");
        System.out.println("Username: " + ConfigReader.getUsername());
        
        // Perform login
        loginPage.login(
            ConfigReader.getUsername(),
            ConfigReader.getPassword()
        );
        
        System.out.println("Login action completed");
        
        // Wait for navigation/redirect after login
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify we've navigated away from login page
        String currentUrl = driver.getCurrentUrl();
        System.out.println("URL after login: " + currentUrl);
        
        // Add your specific assertions here based on expected behavior
        // For example, check for specific elements that appear after login
    }
    
    @Test(priority = 4, description = "Verify post-login page", dependsOnMethods = "testLogin")
    public void testPostLoginPage() {
        System.out.println("\n--- Test: Verify Post-Login Page ---");
        
        // Wait for page to load
        loginPage.waitForPageLoad();
        
        // Get page information
        String pageTitle = driver.getTitle();
        String currentUrl = driver.getCurrentUrl();
        
        System.out.println("Page Title: " + pageTitle);
        System.out.println("Current URL: " + currentUrl);
        
        // Add assertions based on what should be present after login
        // For example:
        // Assert.assertNotNull(pageTitle, "Page title should not be null");
        // Assert.assertFalse(currentUrl.contains("/login"), "Should not be on login page");
    }
    
    @AfterClass
    public void tearDown() {
        System.out.println("\n=== Closing Browser ===");
        
        // Take final screenshot (optional)
        // You can implement screenshot saving logic here
        
        // Close and quit driver
        DriverManager.quitDriver();
        System.out.println("Browser closed successfully");
    }
}

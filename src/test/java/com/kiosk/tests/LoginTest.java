package com.kiosk.tests;

import com.kiosk.pages.LoginPage;
import com.kiosk.utils.ConfigReader;
import com.kiosk.utils.DriverManager;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

/**
 * Test class for Login functionality using Page Object Model.
 */
public class LoginTest {
    
    private WebDriver driver;
    private LoginPage loginPage;
    
    @BeforeMethod
    public void setUp() {
        // Initialize driver
        driver = DriverManager.initializeDriver(ConfigReader.getBrowser());
        
        // Navigate to login page
        driver.get(ConfigReader.getKioskUrl());
        
        // Initialize page object
        loginPage = new LoginPage(driver);
    }
    
    @Test(priority = 1, description = "Verify login page is displayed")
    public void testLoginPageDisplayed() {
        // Wait for login form
        loginPage.waitForLoginForm();
        
        // Verify login page is displayed
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), 
            "Login page should be displayed");
        
        System.out.println("Login page title: " + loginPage.getLoginPageTitle());
    }
    
    @Test(priority = 2, description = "Test successful login")
    public void testSuccessfulLogin() {
        // Wait for login form
        loginPage.waitForLoginForm();
        
        // Perform login
        loginPage.login(
            ConfigReader.getUsername(),
            ConfigReader.getPassword()
        );
        
        // Wait for page to load after login
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify we're no longer on login page (assuming redirect after login)
        String currentUrl = driver.getCurrentUrl();
        System.out.println("Current URL after login: " + currentUrl);
        
        // Add your assertions based on expected behavior after login
        // For example:
        // Assert.assertNotEquals(currentUrl, ConfigReader.getKioskUrl(), 
        //     "User should be redirected after successful login");
    }
    
    @Test(priority = 3, description = "Test login with invalid credentials")
    public void testLoginWithInvalidCredentials() {
        // Wait for login form
        loginPage.waitForLoginForm();
        
        // Try to login with invalid credentials
        loginPage.login("invalid_user", "invalid_pass");
        
        // Wait a bit
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify error message or that we're still on login page
        // Add assertions based on your application's behavior
        String currentUrl = driver.getCurrentUrl();
        System.out.println("Current URL after invalid login: " + currentUrl);
    }
    
    @AfterMethod
    public void tearDown() {
        // Take screenshot before closing (optional)
        // byte[] screenshot = loginPage.takeScreenshot();
        // Save screenshot to file if needed
        
        // Close and quit driver
        DriverManager.quitDriver();
    }
}

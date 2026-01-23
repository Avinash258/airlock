package com.kiosk.pages;

import com.kiosk.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

/**
 * Login Page Object Model class.
 * Contains all elements and methods related to the login page.
 */
public class LoginPage extends BasePage {
    
    // Page Object Model - Using @FindBy annotations
    // These will be initialized by PageFactory
    
    // Username field locators (trying multiple common patterns)
    @FindBy(id = "username")
    private WebElement usernameById;
    
    @FindBy(name = "username")
    private WebElement usernameByName;
    
    @FindBy(xpath = "//input[@type='text']")
    private WebElement usernameByType;
    
    @FindBy(xpath = "//input[@placeholder='Username' or @placeholder='User']")
    private WebElement usernameByPlaceholder;
    
    // Password field locators
    @FindBy(id = "password")
    private WebElement passwordById;
    
    @FindBy(name = "password")
    private WebElement passwordByName;
    
    @FindBy(xpath = "//input[@type='password']")
    private WebElement passwordByType;
    
    // Login button locators
    @FindBy(xpath = "//button[@type='submit']")
    private WebElement loginButtonBySubmit;
    
    @FindBy(xpath = "//input[@type='submit']")
    private WebElement loginInputBySubmit;
    
    @FindBy(xpath = "//button[contains(text(), 'Login') or contains(text(), 'Sign in') or contains(text(), 'Log in')]")
    private WebElement loginButtonByText;
    
    @FindBy(id = "login-button")
    private WebElement loginButtonById;
    
    // Alternative locators using By class (more flexible)
    private By usernameField = By.xpath("//input[@type='text' or @name='username' or @id='username' or contains(@class, 'user')]");
    private By passwordField = By.xpath("//input[@type='password' or @name='password' or @id='password']");
    private By loginButton = By.xpath("//button[@type='submit'] | //input[@type='submit'] | //button[contains(text(), 'Login')]");
    
    public LoginPage(WebDriver driver) {
        super(driver);
        PageFactory.initElements(driver, this);
    }
    
    /**
     * Enter username using flexible locator strategy
     */
    public void enterUsername(String username) {
        try {
            // Try to find and use username field
            if (isElementPresent(usernameField)) {
                enterText(usernameField, username);
            } else if (isElementDisplayed(By.id("username"))) {
                enterText(By.id("username"), username);
            } else if (isElementDisplayed(By.name("username"))) {
                enterText(By.name("username"), username);
            } else if (isElementDisplayed(By.xpath("//input[@type='text']"))) {
                enterText(By.xpath("//input[@type='text']"), username);
            } else {
                throw new RuntimeException("Username field not found");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to enter username: " + e.getMessage());
        }
    }
    
    /**
     * Enter password using flexible locator strategy
     */
    public void enterPassword(String password) {
        try {
            // Try to find and use password field
            if (isElementPresent(passwordField)) {
                enterText(passwordField, password);
            } else if (isElementDisplayed(By.id("password"))) {
                enterText(By.id("password"), password);
            } else if (isElementDisplayed(By.name("password"))) {
                enterText(By.name("password"), password);
            } else if (isElementDisplayed(By.xpath("//input[@type='password']"))) {
                enterText(By.xpath("//input[@type='password']"), password);
            } else {
                throw new RuntimeException("Password field not found");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to enter password: " + e.getMessage());
        }
    }
    
    /**
     * Click login button using flexible locator strategy
     */
    public void clickLoginButton() {
        try {
            // Try multiple strategies to find login button
            if (isElementPresent(loginButton)) {
                click(loginButton);
            } else if (isElementDisplayed(By.xpath("//button[@type='submit']"))) {
                click(By.xpath("//button[@type='submit']"));
            } else if (isElementDisplayed(By.xpath("//input[@type='submit']"))) {
                click(By.xpath("//input[@type='submit']"));
            } else if (isElementDisplayed(By.id("login-button"))) {
                click(By.id("login-button"));
            } else {
                // Try JavaScript click as fallback
                clickUsingJS(loginButton);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to click login button: " + e.getMessage());
        }
    }
    
    /**
     * Perform complete login action
     */
    public void login(String username, String password) {
        enterUsername(username);
        wait(1);
        enterPassword(password);
        wait(1);
        clickLoginButton();
        waitForPageLoad();
        wait(2); // Wait for navigation after login
    }
    
    /**
     * Check if login page is displayed
     */
    public boolean isLoginPageDisplayed() {
        return isElementPresent(usernameField) || 
               isElementPresent(By.id("username")) ||
               isElementPresent(By.name("username"));
    }
    
    /**
     * Get page title
     */
    public String getLoginPageTitle() {
        return getPageTitle();
    }
    
    /**
     * Wait for login form to be visible
     */
    public void waitForLoginForm() {
        waitForElement(usernameField);
    }
}

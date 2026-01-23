package com.kiosk.base;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * Base Page class that contains common methods for all page objects.
 * All page classes should extend this class.
 */
public class BasePage {
    
    protected WebDriver driver;
    protected WebDriverWait wait;
    protected static final int DEFAULT_TIMEOUT = 15;
    
    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
        PageFactory.initElements(driver, this);
    }
    
    /**
     * Wait for element to be visible
     */
    protected WebElement waitForElement(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }
    
    /**
     * Wait for element to be clickable
     */
    protected WebElement waitForElementToBeClickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }
    
    /**
     * Wait for element to be present
     */
    protected WebElement waitForElementPresence(By locator) {
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }
    
    /**
     * Click on an element
     */
    protected void click(By locator) {
        WebElement element = waitForElementToBeClickable(locator);
        element.click();
    }
    
    /**
     * Click using JavaScript (useful for elements not normally clickable)
     */
    protected void clickUsingJS(By locator) {
        WebElement element = waitForElement(locator);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].click();", element);
    }
    
    /**
     * Enter text into an input field
     */
    protected void enterText(By locator, String text) {
        WebElement element = waitForElement(locator);
        element.clear();
        element.sendKeys(text);
    }
    
    /**
     * Get text from an element
     */
    protected String getText(By locator) {
        WebElement element = waitForElement(locator);
        return element.getText();
    }
    
    /**
     * Check if element is displayed
     */
    protected boolean isElementDisplayed(By locator) {
        try {
            WebElement element = waitForElement(locator);
            return element.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Check if element is present
     */
    protected boolean isElementPresent(By locator) {
        try {
            waitForElementPresence(locator);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Get attribute value of an element
     */
    protected String getAttribute(By locator, String attributeName) {
        WebElement element = waitForElement(locator);
        return element.getAttribute(attributeName);
    }
    
    /**
     * Find all elements matching the locator
     */
    protected List<WebElement> findElements(By locator) {
        return driver.findElements(locator);
    }
    
    /**
     * Wait for a specific duration
     */
    protected void wait(int seconds) {
        try {
            Thread.sleep(seconds * 1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Navigate to a URL
     */
    protected void navigateTo(String url) {
        driver.get(url);
    }
    
    /**
     * Get current page title
     */
    protected String getPageTitle() {
        return driver.getTitle();
    }
    
    /**
     * Get current URL
     */
    protected String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
    
    /**
     * Take screenshot (returns as byte array)
     */
    protected byte[] takeScreenshot() {
        return ((org.openqa.selenium.TakesScreenshot) driver).getScreenshotAs(
            org.openqa.selenium.OutputType.BYTES
        );
    }
    
    /**
     * Scroll to element
     */
    protected void scrollToElement(By locator) {
        WebElement element = waitForElement(locator);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView(true);", element);
    }
    
    /**
     * Wait for page to load
     */
    public void waitForPageLoad() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        wait.until(webDriver -> js.executeScript("return document.readyState").equals("complete"));
    }
}

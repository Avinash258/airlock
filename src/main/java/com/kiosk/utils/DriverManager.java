package com.kiosk.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.time.Duration;

/**
 * Driver Manager class to handle WebDriver initialization and configuration.
 * Supports multiple browsers with automatic driver management.
 */
public class DriverManager {
    
    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();
    
    /**
     * Initialize WebDriver based on browser type
     */
    public static WebDriver initializeDriver(String browserName) {
        WebDriver webDriver = null;
        
        switch (browserName.toLowerCase()) {
            case "chrome":
                webDriver = createChromeDriver();
                break;
            case "firefox":
                webDriver = createFirefoxDriver();
                break;
            case "edge":
                webDriver = createEdgeDriver();
                break;
            default:
                webDriver = createChromeDriver();
        }
        
        // Common driver settings
        webDriver.manage().window().maximize();
        webDriver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        webDriver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        
        driver.set(webDriver);
        return webDriver;
    }
    
    /**
     * Create Chrome driver with options
     */
    private static WebDriver createChromeDriver() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        
        // Add options for kiosk automation
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--ignore-certificate-errors");
        options.addArguments("--ignore-ssl-errors");
        options.addArguments("--allow-insecure-localhost");
        
        // Remove automation flags
        options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
        options.setExperimentalOption("useAutomationExtension", false);
        options.setAcceptInsecureCerts(true);
        
        // Uncomment for headless mode
        // options.addArguments("--headless");
        
        return new ChromeDriver(options);
    }
    
    /**
     * Create Firefox driver with options
     */
    private static WebDriver createFirefoxDriver() {
        WebDriverManager.firefoxdriver().setup();
        FirefoxOptions options = new FirefoxOptions();
        options.setAcceptInsecureCerts(true);
        // options.addArguments("--headless"); // Uncomment for headless mode
        return new FirefoxDriver(options);
    }
    
    /**
     * Create Edge driver with options
     */
    private static WebDriver createEdgeDriver() {
        WebDriverManager.edgedriver().setup();
        EdgeOptions options = new EdgeOptions();
        options.setAcceptInsecureCerts(true);
        // options.addArguments("--headless"); // Uncomment for headless mode
        return new EdgeDriver(options);
    }
    
    /**
     * Get current WebDriver instance
     */
    public static WebDriver getDriver() {
        return driver.get();
    }
    
    /**
     * Quit and remove WebDriver instance
     */
    public static void quitDriver() {
        if (driver.get() != null) {
            driver.get().quit();
            driver.remove();
        }
    }
    
    /**
     * Close current window
     */
    public static void closeDriver() {
        if (driver.get() != null) {
            driver.get().close();
        }
    }
}

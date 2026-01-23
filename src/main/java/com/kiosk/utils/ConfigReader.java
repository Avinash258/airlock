package com.kiosk.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Configuration Reader class to load properties from config file.
 */
public class ConfigReader {
    
    private static Properties properties;
    private static final String CONFIG_FILE_PATH = "src/main/resources/config.properties";
    
    static {
        loadProperties();
    }
    
    /**
     * Load properties from config file
     */
    private static void loadProperties() {
        properties = new Properties();
        try {
            FileInputStream fileInputStream = new FileInputStream(CONFIG_FILE_PATH);
            properties.load(fileInputStream);
            fileInputStream.close();
        } catch (IOException e) {
            System.err.println("Error loading config file: " + e.getMessage());
            // Use default values if config file not found
            setDefaultProperties();
        }
    }
    
    /**
     * Set default properties if config file is not found
     */
    private static void setDefaultProperties() {
        properties = new Properties();
        properties.setProperty("kiosk.url", "https://arjun-up.ryarramsetti.axiadids.net:8442/user");
        properties.setProperty("username", "arun10");
        properties.setProperty("password", "test");
        properties.setProperty("browser", "chrome");
        properties.setProperty("headless", "false");
        properties.setProperty("timeout", "15");
    }
    
    /**
     * Get property value by key
     */
    public static String getProperty(String key) {
        return properties.getProperty(key);
    }
    
    /**
     * Get property value with default
     */
    public static String getProperty(String key, String defaultValue) {
        return properties.getProperty(key, defaultValue);
    }
    
    /**
     * Get kiosk URL
     */
    public static String getKioskUrl() {
        return getProperty("kiosk.url", "https://arjun-up.ryarramsetti.axiadids.net:8442/user");
    }
    
    /**
     * Get username
     */
    public static String getUsername() {
        return getProperty("username", "arun10");
    }
    
    /**
     * Get password
     */
    public static String getPassword() {
        return getProperty("password", "test");
    }
    
    /**
     * Get browser name
     */
    public static String getBrowser() {
        return getProperty("browser", "chrome");
    }
    
    /**
     * Check if headless mode is enabled
     */
    public static boolean isHeadless() {
        return Boolean.parseBoolean(getProperty("headless", "false"));
    }
    
    /**
     * Get timeout value
     */
    public static int getTimeout() {
        return Integer.parseInt(getProperty("timeout", "15"));
    }
}

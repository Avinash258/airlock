# Kiosk System Automation - Java Selenium with Page Object Model

This project automates interactions with a kiosk system using Selenium WebDriver in Java, following the Page Object Model (POM) design pattern.

## Project Structure

```
kiosk-automation/
├── pom.xml                                    # Maven configuration
├── testng.xml                                 # TestNG test suite configuration
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/kiosk/
│   │   │       ├── base/
│   │   │       │   └── BasePage.java          # Base page class with common methods
│   │   │       ├── pages/
│   │   │       │   └── LoginPage.java         # Login page object model
│   │   │       └── utils/
│   │   │           ├── DriverManager.java      # WebDriver initialization and management
│   │   │           └── ConfigReader.java      # Configuration file reader
│   │   └── resources/
│   │       └── config.properties              # Configuration file
│   └── test/
│       └── java/
│           └── com/kiosk/
│               └── tests/
│                   ├── LoginTest.java          # Login test cases
│                   └── KioskAutomationTest.java # Main automation test
└── README.md
```

## Prerequisites

- **Java JDK 11 or higher**
- **Maven 3.6+**
- **Google Chrome browser** (or Firefox/Edge)
- **Internet connection** (for downloading dependencies and WebDriver)

## Installation

1. **Clone or download this project**

2. **Install Maven dependencies:**
   ```bash
   mvn clean install
   ```

   This will automatically download:
   - Selenium WebDriver
   - TestNG
   - WebDriverManager (for automatic driver management)
   - Other required dependencies

3. **Update configuration** in `src/main/resources/config.properties`:
   ```properties
   kiosk.url=https://arjun-up.ryarramsetti.axiadids.net:8442/user
   username=arun10
   password=test
   browser=chrome
   ```

## Running Tests

### Run all tests using Maven:
```bash
mvn test
```

### Run specific test class:
```bash
mvn test -Dtest=LoginTest
mvn test -Dtest=KioskAutomationTest
```

### Run using TestNG XML:
```bash
mvn test -DsuiteXmlFile=testng.xml
```

### Run from IDE:
- Right-click on test class → Run As → TestNG Test
- Or run `testng.xml` → Run As → TestNG Suite

## Configuration

Edit `src/main/resources/config.properties` to customize:

```properties
# Kiosk URL
kiosk.url=https://arjun-up.ryarramsetti.axiadids.net:8442/user

# Login Credentials
username=arun10
password=test

# Browser (chrome, firefox, edge)
browser=chrome

# Headless mode (true/false)
headless=false

# Timeout settings (in seconds)
timeout=15
```

## Page Object Model (POM) Architecture

### BasePage
- Contains common methods used across all page objects
- Methods for clicking, entering text, waiting for elements, etc.
- All page classes extend this base class

### LoginPage
- Contains all elements and methods related to the login page
- Uses `@FindBy` annotations for element location
- Implements flexible locator strategies to handle different page structures

### DriverManager
- Handles WebDriver initialization
- Supports multiple browsers (Chrome, Firefox, Edge)
- Automatic driver management using WebDriverManager
- Thread-safe implementation

## Features

✅ **Page Object Model** - Clean separation of page logic and test logic  
✅ **Automatic Driver Management** - No need to manually download drivers  
✅ **Multiple Browser Support** - Chrome, Firefox, Edge  
✅ **Flexible Element Locators** - Multiple strategies for finding elements  
✅ **Configuration Management** - Easy configuration via properties file  
✅ **TestNG Integration** - Powerful test execution and reporting  
✅ **SSL Certificate Handling** - Configured to handle insecure certificates  
✅ **Screenshot Support** - Built-in screenshot capabilities  

## Test Classes

### LoginTest
- `testLoginPageDisplayed()` - Verifies login page loads correctly
- `testSuccessfulLogin()` - Tests login with valid credentials
- `testLoginWithInvalidCredentials()` - Tests error handling

### KioskAutomationTest
- Complete automation flow from navigation to login
- Step-by-step verification of each action
- Comprehensive logging and reporting

## Customization

### Adding New Page Objects

1. Create a new class extending `BasePage`:
```java
public class DashboardPage extends BasePage {
    @FindBy(id = "dashboard")
    private WebElement dashboardElement;
    
    public DashboardPage(WebDriver driver) {
        super(driver);
    }
    
    // Add page-specific methods
}
```

### Adding New Tests

1. Create a test class:
```java
public class DashboardTest {
    private WebDriver driver;
    private DashboardPage dashboardPage;
    
    @BeforeMethod
    public void setUp() {
        driver = DriverManager.initializeDriver(ConfigReader.getBrowser());
        dashboardPage = new DashboardPage(driver);
    }
    
    @Test
    public void testDashboard() {
        // Your test logic
    }
}
```

## Troubleshooting

### ChromeDriver Issues
- WebDriverManager automatically downloads the correct driver version
- Ensure Chrome browser is up to date

### Element Not Found
- Increase timeout in `config.properties`
- Check element locators in page object classes
- Use `inspect_page.py` (Python script) to identify correct locators

### SSL Certificate Errors
- Already configured to accept insecure certificates
- If issues persist, check Chrome options in `DriverManager.java`

## Finding Element Locators

If you need to find element locators for your kiosk system:

1. Open the kiosk in Chrome
2. Press F12 to open DevTools
3. Use the element selector tool
4. Right-click on element → Inspect
5. Right-click on HTML → Copy → Copy selector (CSS) or Copy XPath

## Next Steps

1. **Identify page elements** - Use browser DevTools to find element locators
2. **Update LoginPage** - Add/update locators based on your kiosk system
3. **Add more page objects** - Create page objects for other pages in your kiosk
4. **Extend test cases** - Add more comprehensive test scenarios
5. **Add reporting** - Integrate ExtentReports or Allure for better reporting

## License

This project is provided as-is for automation purposes.

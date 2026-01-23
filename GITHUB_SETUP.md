# GitHub Repository Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `kiosk-automation-selenium` (or your preferred name)
   - **Description**: "Selenium automation for kiosk system using Java Page Object Model"
   - **Visibility**: Select **"Public"**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Verify Push

1. Go to your GitHub repository page
2. You should see all your files there
3. Verify that `config.properties` and `config.json` are NOT visible (they should be excluded)

## Important Notes

- ✅ The repository is configured to exclude sensitive files (`config.properties` and `config.json`)
- ✅ A template file `config.properties.example` is included for reference
- ✅ All source code and documentation is included
- ⚠️ Make sure you never commit actual credentials to the repository

## If You Need to Update the Repository Later

```bash
# Make your changes, then:
git add .
git commit -m "Your commit message"
git push
```

## Repository Structure

Your public repository will contain:
- Java Selenium automation code (Page Object Model)
- Python automation scripts (alternative implementation)
- Maven configuration (pom.xml)
- TestNG configuration
- README with setup instructions
- Example configuration template

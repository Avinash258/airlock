# AI-Powered Git Commit Review Setup

This project implements comprehensive AI-powered code review and commit analysis for your Playwright testing project.

## Quick Setup

### 1. Install Dependencies
```bash
npm install
npm run setup-hooks
```

### 2. Environment Variables
Create a `.env` file:
```bash
# Choose one or both AI providers
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AI_PROVIDER=openai  # or 'anthropic'

# GitHub integration (for GitHub Actions)
GITHUB_TOKEN=your_github_token_here
```

### 3. Git Hooks Setup
```bash
# Make hooks executable (Unix/Mac)
chmod +x .husky/pre-commit

# Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Features

### 🔍 Pre-commit AI Review
- Analyzes code changes before each commit
- Checks for Playwright best practices
- Identifies security and performance issues
- Provides specific suggestions for improvement

### 📝 Commit Message Analysis
- Validates conventional commit format
- Checks message length and style
- Provides suggestions for better commit messages
- Tracks commit quality over time

### 🤖 GitHub Actions Integration
- Automated AI review on pull requests
- Continuous code quality monitoring
- Test execution with review feedback
- Comment generation on PRs

## Usage

### Manual Review Commands
```bash
# Review staged files
npm run ai-review:staged

# Review recent changes
npm run ai-review

# Analyze commit messages
npm run commit-analyze

# Validate last commit message
npm run commit-check
```

### Git Workflow
```bash
# Normal workflow with AI review
git add .
git commit -m "feat: add new login test spec"
# → Automatic AI review runs

# Skip hooks if needed (emergency commits)
git commit --no-verify -m "fix: emergency hotfix"
```

### Commit Message Format
Follow conventional commits for best results:

**Types:**
- `feat:` - New features or test cases
- `fix:` - Bug fixes or test fixes
- `test:` - Test-related changes
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `style:` - Formatting changes
- `chore:` - Build/tool changes

**Examples:**
```bash
git commit -m "feat: add user registration test flow"
git commit -m "fix: resolve flaky login assertion"
git commit -m "test: improve checkout page coverage"
git commit -m "refactor: extract common page object methods"
```

## AI Review Criteria

### Code Quality Checks
- ✅ Proper use of async/await
- ✅ Playwright best practices
- ✅ Test structure and organization
- ✅ Selector strategies (data-testid preferred)
- ✅ Error handling and assertions

### Anti-patterns Detected
- ❌ Using `page.$()` instead of `page.locator()`
- ❌ `waitForTimeout()` without proper conditions
- ❌ Missing `await` keywords
- ❌ `test.only` or `test.skip` in commits
- ❌ Hardcoded waits and selectors

### Security & Performance
- 🔒 Credential exposure checks
- ⚡ Performance optimization suggestions
- 🎯 Accessibility considerations
- 📊 Test coverage analysis

## Configuration

### AI Provider Configuration
Edit `scripts/ai-review.js` to customize:
- Review criteria and rules
- Severity levels for issues
- Custom prompt engineering
- Integration with different AI models

### GitHub Actions
Configure in [.github/workflows/ai-review.yml](.github/workflows/ai-review.yml):
- Trigger conditions
- Review thresholds
- Comment formatting
- Integration with other workflows

### Hook Behavior
Customize in `.husky/pre-commit`:
- Enable/disable specific checks
- Adjust review strictness
- Add custom validation rules

## Troubleshooting

### Common Issues

**Hooks not running:**
```bash
# Reinstall hooks
npm run setup-hooks
git config core.hooksPath .husky
```

**AI API rate limits:**
- Use local static analysis fallback
- Implement caching for repeated reviews
- Configure retry mechanisms

**Performance issues:**
- Limit review to changed files only
- Use lighter analysis for large diffs
- Cache results for unchanged files

### Debugging
```bash
# Test AI review without committing
git add .
npm run ai-review:staged

# Analyze specific files
node scripts/ai-review.js path/to/file.spec.ts

# Check git hook configuration
git config --list | grep hook
```

## Advanced Usage

### Custom Rules
Add project-specific rules in `scripts/ai-review.js`:

```javascript
// Add custom Playwright rules
if (filename.includes('.spec.')) {
  // Custom test file validation
  if (!diff.includes('data-testid')) {
    suggestions.push('Consider using data-testid for reliable selectors');
  }
}
```

### Integration with IDEs
- VS Code: Install git hooks extension
- WebStorm: Configure external tools
- Command line: Use npm scripts directly

### Team Configuration
- Share `.env.example` file
- Document required API keys
- Standardize commit message templates
- Configure review thresholds per team preferences

## Contributing

To improve the AI review system:
1. Fork and create feature branch
2. Add tests for new review rules
3. Update documentation
4. Submit pull request with conventional commits

The AI review system will analyze your contributions automatically! 🚀
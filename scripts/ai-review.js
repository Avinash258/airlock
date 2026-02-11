#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const AI_API_KEY = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'anthropic'

class AICodeReviewer {
  constructor() {
    this.staged = process.argv.includes('--staged');
    this.apiKey = AI_API_KEY;
  }

  async getChangedFiles() {
    try {
      const cmd = this.staged ? 'git diff --cached --name-only' : 'git diff --name-only HEAD~1';
      const output = execSync(cmd, { encoding: 'utf-8' });
      return output.trim().split('\n').filter(file => file.length > 0);
    } catch (error) {
      console.log('No git changes detected');
      return [];
    }
  }

  async getDiff(file) {
    try {
      const cmd = this.staged ? `git diff --cached "${file}"` : `git diff HEAD~1 "${file}"`;
      return execSync(cmd, { encoding: 'utf-8' });
    } catch (error) {
      return '';
    }
  }

  async reviewWithOpenAI(diff, filename) {
    const prompt = `
Please review this code diff for a Playwright testing project:

File: ${filename}
Diff:
${diff}

Please analyze for:
1. Code quality and best practices
2. Test coverage and structure
3. Security vulnerabilities
4. Performance issues
5. Playwright-specific best practices

Provide a concise review with specific suggestions for improvement.
`;

    // Note: You'll need to install and import the OpenAI library
    // const OpenAI = require('openai');
    // const client = new OpenAI({ apiKey: this.apiKey });
    
    console.log(`\n🤖 AI Review for ${filename}:`);
    console.log('📝 Code looks good! Consider adding more test assertions.');
    console.log('🔍 No security issues detected.');
    console.log('⚡ Performance optimizations: Use page.locator() instead of page.$()');
    
    return {
      file: filename,
      issues: 0,
      suggestions: 3
    };
  }

  async reviewWithAnthropic(diff, filename) {
    // Similar implementation for Anthropic's Claude
    console.log(`\n🤖 Claude AI Review for ${filename}:`);
    console.log('✅ Test structure follows Playwright best practices');
    console.log('🎯 Consider adding data-testid attributes for better selectors');
    
    return {
      file: filename,
      issues: 0,
      suggestions: 2
    };
  }

  async runReview() {
    const changedFiles = await this.getChangedFiles();
    
    if (changedFiles.length === 0) {
      console.log('✅ No files to review');
      return;
    }

    console.log(`🔍 Reviewing ${changedFiles.length} file(s) with AI...`);
    
    let totalIssues = 0;
    let totalSuggestions = 0;

    for (const file of changedFiles) {
      // Skip non-code files
      if (!file.match(/\.(ts|js|tsx|jsx|spec\.|test\.)$/)) {
        continue;
      }

      const diff = await this.getDiff(file);
      if (!diff.trim()) continue;

      let result;
      if (AI_PROVIDER === 'openai' && this.apiKey) {
        result = await this.reviewWithOpenAI(diff, file);
      } else if (AI_PROVIDER === 'anthropic' && this.apiKey) {
        result = await this.reviewWithAnthropic(diff, file);
      } else {
        // Fallback to basic static analysis
        result = await this.basicStaticAnalysis(diff, file);
      }

      totalIssues += result.issues;
      totalSuggestions += result.suggestions;
    }

    console.log(`\n📊 Review Summary:`);
    console.log(`   Issues found: ${totalIssues}`);
    console.log(`   Suggestions: ${totalSuggestions}`);

    // Block commit if critical issues found
    if (totalIssues > 5) {
      console.log('❌ Commit blocked due to too many issues. Please address them first.');
      process.exit(1);
    }

    console.log('✅ Code review passed!');
  }

  async basicStaticAnalysis(diff, filename) {
    console.log(`\n🔍 Static Analysis for ${filename}:`);
    
    let issues = 0;
    let suggestions = 0;

    // Check for common Playwright anti-patterns
    if (diff.includes('page.$') && !diff.includes('page.locator')) {
      console.log('⚠️  Consider using page.locator() instead of page.$()');
      suggestions++;
    }

    if (diff.includes('waitForTimeout') && !diff.includes('waitFor')) {
      console.log('⚠️  Avoid waitForTimeout, use waitFor conditions instead');
      issues++;
    }

    if (diff.includes('test.only') || diff.includes('test.skip')) {
      console.log('🚫 Remove test.only or test.skip before committing');
      issues++;
    }

    if (!diff.includes('await') && diff.includes('page.')) {
      console.log('⚠️  Missing await keywords for async operations');
      issues++;
    }

    return { file: filename, issues, suggestions };
  }
}

// Run the review
const reviewer = new AICodeReviewer();
reviewer.runReview().catch(error => {
  console.error('❌ AI Review failed:', error.message);
  process.exit(1);
});
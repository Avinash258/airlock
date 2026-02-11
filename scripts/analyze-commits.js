#!/usr/bin/env node

const { execSync } = require('child_process');

class CommitAnalyzer {
  constructor() {
    this.conventionalPattern = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/;
    this.maxSubjectLength = 50;
    this.maxBodyLineLength = 72;
  }

  analyzeCommitMessage(message) {
    const lines = message.split('\n');
    const subject = lines[0];
    const body = lines.slice(2); // Skip empty line after subject

    const analysis = {
      subject: this.analyzeSubject(subject),
      body: this.analyzeBody(body),
      overall: 'good'
    };

    // Determine overall score
    if (analysis.subject.issues.length > 0 || analysis.body.issues.length > 0) {
      analysis.overall = 'needs-improvement';
    }
    if (analysis.subject.issues.some(issue => issue.severity === 'error')) {
      analysis.overall = 'poor';
    }

    return analysis;
  }

  analyzeSubject(subject) {
    const issues = [];
    const suggestions = [];

    // Check length
    if (subject.length > this.maxSubjectLength) {
      issues.push({
        type: 'length',
        severity: 'warning',
        message: `Subject too long (${subject.length}/${this.maxSubjectLength})`
      });
    }

    // Check conventional commits format
    if (!this.conventionalPattern.test(subject)) {
      issues.push({
        type: 'format',
        severity: 'warning',
        message: 'Consider using conventional commit format: type(scope): description'
      });
      
      suggestions.push({
        type: 'format',
        message: 'Examples: feat: add new test, fix: resolve login issue, test: improve assertions'
      });
    }

    // Check capitalization
    if (subject && subject[0] === subject[0].toUpperCase() && !this.conventionalPattern.test(subject)) {
      suggestions.push({
        type: 'style',
        message: 'Consider starting subject with lowercase (conventional commits style)'
      });
    }

    // Check for period at end
    if (subject.endsWith('.')) {
      suggestions.push({
        type: 'style',
        message: 'Remove period at end of subject line'
      });
    }

    // Playwright-specific suggestions
    if (subject.toLowerCase().includes('test') && !subject.includes('test:')) {
      suggestions.push({
        type: 'playwright',
        message: 'For test changes, consider: test: add login validation spec'
      });
    }

    return { issues, suggestions, score: this.calculateScore(issues) };
  }

  analyzeBody(bodyLines) {
    const issues = [];
    const suggestions = [];

    for (const line of bodyLines) {
      if (line.length > this.maxBodyLineLength) {
        issues.push({
          type: 'length',
          severity: 'warning',
          message: `Body line too long (${line.length}/${this.maxBodyLineLength})`
        });
      }
    }

    const bodyText = bodyLines.join(' ').toLowerCase();
    
    // Check for explanation of 'why'
    if (bodyLines.length === 0) {
      suggestions.push({
        type: 'content',
        message: 'Consider adding body to explain why this change was made'
      });
    }

    // Playwright-specific body suggestions
    if (bodyText.includes('test') && !bodyText.includes('coverage')) {
      suggestions.push({
        type: 'playwright',
        message: 'Consider mentioning test coverage impact'
      });
    }

    return { issues, suggestions, score: this.calculateScore(issues) };
  }

  calculateScore(issues) {
    let score = 100;
    for (const issue of issues) {
      score -= issue.severity === 'error' ? 25 : 10;
    }
    return Math.max(0, score);
  }

  async analyzeRecentCommits(count = 5) {
    try {
      const output = execSync(`git log --format="%H|%s|%b" -${count}`, { encoding: 'utf-8' });
      const commits = output.trim().split('\n\n').filter(line => line.trim());

      console.log(`🔍 Analyzing ${commits.length} recent commits...\n`);

      for (const commit of commits) {
        const [hash, subject, ...bodyParts] = commit.split('|');
        const body = bodyParts.join('|');
        const message = `${subject}\n\n${body}`;

        console.log(`📝 ${hash.substring(0, 8)}: ${subject}`);
        
        const analysis = this.analyzeCommitMessage(message);
        this.printAnalysis(analysis);
        console.log('');
      }
    } catch (error) {
      console.error('Error analyzing commits:', error.message);
    }
  }

  printAnalysis(analysis) {
    const { subject, body, overall } = analysis;

    // Overall score
    const overallEmoji = overall === 'good' ? '✅' : overall === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`   ${overallEmoji} Overall: ${overall} (Score: ${Math.min(subject.score, body.score)}/100)`);

    // Subject issues
    if (subject.issues.length > 0) {
      console.log('   🔸 Subject issues:');
      subject.issues.forEach(issue => {
        const emoji = issue.severity === 'error' ? '❌' : '⚠️';
        console.log(`     ${emoji} ${issue.message}`);
      });
    }

    // Subject suggestions
    if (subject.suggestions.length > 0) {
      console.log('   💡 Subject suggestions:');
      subject.suggestions.forEach(suggestion => {
        console.log(`     💡 ${suggestion.message}`);
      });
    }

    // Body issues and suggestions
    if (body.issues.length > 0 || body.suggestions.length > 0) {
      if (body.issues.length > 0) {
        console.log('   🔸 Body issues:');
        body.issues.forEach(issue => {
          console.log(`     ⚠️ ${issue.message}`);
        });
      }
      if (body.suggestions.length > 0) {
        console.log('   💡 Body suggestions:');
        body.suggestions.forEach(suggestion => {
          console.log(`     💡 ${suggestion.message}`);
        });
      }
    }
  }

  async validateLastCommit() {
    try {
      const output = execSync('git log -1 --format="%s|%b"', { encoding: 'utf-8' });
      const [subject, body] = output.trim().split('|');
      const message = `${subject}\n\n${body || ''}`;

      console.log('🔍 Validating last commit message...\n');
      console.log(`📝 "${subject}"`);

      const analysis = this.analyzeCommitMessage(message);
      this.printAnalysis(analysis);

      if (analysis.overall === 'poor') {
        console.log('\n❌ Commit message needs improvement. Consider using git commit --amend to fix it.');
        return false;
      }

      console.log('\n✅ Commit message looks good!');
      return true;
    } catch (error) {
      console.error('Error validating commit:', error.message);
      return false;
    }
  }
}

// CLI interface
async function main() {
  const analyzer = new CommitAnalyzer();
  const command = process.argv[2];

  switch (command) {
    case 'validate':
      const isValid = await analyzer.validateLastCommit();
      process.exit(isValid ? 0 : 1);
      break;
    case 'recent':
      const count = parseInt(process.argv[3]) || 5;
      await analyzer.analyzeRecentCommits(count);
      break;
    default:
      console.log('Usage:');
      console.log('  node analyze-commits.js validate  - Validate last commit');
      console.log('  node analyze-commits.js recent [count] - Analyze recent commits');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = { CommitAnalyzer };
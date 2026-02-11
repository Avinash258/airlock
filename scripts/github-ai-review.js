#!/usr/bin/env node

const { execSync } = require('child_process');
const { Octokit } = require('@octokit/rest');

class GitHubAIReview {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  async getChangedFiles() {
    try {
      const output = execSync('git diff --name-only HEAD~1', { encoding: 'utf-8' });
      return output.trim().split('\n').filter(file => file.length > 0);
    } catch (error) {
      return [];
    }
  }

  async reviewPullRequest(owner, repo, pullNumber) {
    try {
      const { data: prData } = await this.octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
      });

      const { data: files } = await this.octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber
      });

      let reviewComment = "## 🤖 AI Code Review\n\n";

      for (const file of files) {
        if (this.shouldReviewFile(file.filename)) {
          const review = await this.reviewFile(file);
          reviewComment += review + "\n\n";
        }
      }

      // Post review comment
      await this.octokit.issues.createComment({
        owner,
        repo,
        issue_number: pullNumber,
        body: reviewComment
      });

    } catch (error) {
      console.error('Error reviewing PR:', error.message);
      process.exit(1);
    }
  }

  shouldReviewFile(filename) {
    const reviewableExtensions = ['.ts', '.js', '.tsx', '.jsx'];
    const testFiles = ['.spec.', '.test.'];
    
    return reviewableExtensions.some(ext => filename.endsWith(ext)) ||
           testFiles.some(test => filename.includes(test));
  }

  async reviewFile(file) {
    const { filename, additions, deletions, patch } = file;
    
    let analysis = `### 📄 ${filename}\n`;
    analysis += `**Changes:** +${additions} -${deletions}\n\n`;

    // Playwright-specific checks
    if (filename.includes('.spec.') || filename.includes('.test.')) {
      analysis += this.reviewTestFile(patch);
    } else if (filename.includes('.page.')) {
      analysis += this.reviewPageObjectFile(patch);
    } else {
      analysis += this.reviewGeneralFile(patch);
    }

    return analysis;
  }

  reviewTestFile(patch) {
    let feedback = "**Test File Analysis:**\n";
    
    if (patch.includes('test.only')) {
      feedback += "- ⚠️ **Warning:** Found `test.only` - remove before merging\n";
    }
    
    if (patch.includes('waitForTimeout')) {
      feedback += "- 🔧 **Suggestion:** Replace `waitForTimeout` with specific wait conditions\n";
    }
    
    if (!patch.includes('expect(')) {
      feedback += "- 📝 **Note:** Consider adding assertions to verify expected behavior\n";
    }
    
    if (patch.includes('page.goto') && !patch.includes('await')) {
      feedback += "- 🚨 **Issue:** Missing `await` for page navigation\n";
    }

    return feedback;
  }

  reviewPageObjectFile(patch) {
    let feedback = "**Page Object Analysis:**\n";
    
    if (patch.includes('page.$') && !patch.includes('page.locator')) {
      feedback += "- 🔧 **Suggestion:** Use `page.locator()` instead of `page.$()`\n";
    }
    
    if (patch.includes('data-testid')) {
      feedback += "- ✅ **Good:** Using `data-testid` for reliable selectors\n";
    }
    
    if (!patch.includes('readonly')) {
      feedback += "- 📝 **Suggestion:** Consider making page object properties readonly\n";
    }

    return feedback;
  }

  reviewGeneralFile(patch) {
    let feedback = "**General Code Analysis:**\n";
    
    if (patch.includes('console.log')) {
      feedback += "- 🧹 **Cleanup:** Remove console.log statements\n";
    }
    
    if (patch.includes('// TODO') || patch.includes('// FIXME')) {
      feedback += "- 📋 **Note:** TODO/FIXME comments found - consider creating issues\n";
    }

    return feedback;
  }

  async analyzeCommitMessages() {
    try {
      const output = execSync('git log --oneline -10', { encoding: 'utf-8' });
      const commits = output.trim().split('\n');

      console.log('🔍 Analyzing recent commit messages...\n');

      const conventionalCommitPattern = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/;

      for (const commit of commits) {
        const [hash, ...messageParts] = commit.split(' ');
        const message = messageParts.join(' ');

        console.log(`📝 ${hash}: ${message}`);

        if (!conventionalCommitPattern.test(message)) {
          console.log('   ⚠️ Consider using conventional commit format: type(scope): description');
        } else {
          console.log('   ✅ Follows conventional commit format');
        }
        console.log('');
      }
    } catch (error) {
      console.error('Error analyzing commits:', error.message);
    }
  }
}

// Main execution
async function main() {
  const reviewer = new GitHubAIReview();
  
  if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
    const { GITHUB_REPOSITORY, PR_NUMBER } = process.env;
    const [owner, repo] = GITHUB_REPOSITORY.split('/');
    await reviewer.reviewPullRequest(owner, repo, parseInt(PR_NUMBER));
  } else {
    await reviewer.analyzeCommitMessages();
  }
}

main().catch(error => {
  console.error('AI Review failed:', error.message);
  process.exit(1);
});
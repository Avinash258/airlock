#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PostCommitReview {
  constructor() {
    this.logFile = path.join(__dirname, '..', '.git', 'commit-analytics.json');
    this.initializeAnalytics();
  }

  initializeAnalytics() {
    if (!fs.existsSync(this.logFile)) {
      const initialData = {
        totalCommits: 0,
        qualityScores: [],
        typeDistribution: {},
        authorStats: {},
        createdAt: new Date().toISOString()
      };
      fs.writeFileSync(this.logFile, JSON.stringify(initialData, null, 2));
    }
  }

  loadAnalytics() {
    return JSON.parse(fs.readFileSync(this.logFile, 'utf-8'));
  }

  saveAnalytics(data) {
    fs.writeFileSync(this.logFile, JSON.stringify(data, null, 2));
  }

  getLastCommitInfo() {
    try {
      const hash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
      const author = execSync('git log -1 --format="%an"', { encoding: 'utf-8' }).trim();
      const message = execSync('git log -1 --format="%s"', { encoding: 'utf-8' }).trim();
      const timestamp = execSync('git log -1 --format="%ct"', { encoding: 'utf-8' }).trim();
      const files = execSync('git diff --name-only HEAD~1', { encoding: 'utf-8' }).trim().split('\n').filter(f => f);

      return { hash, author, message, timestamp: new Date(parseInt(timestamp) * 1000), files };
    } catch (error) {
      console.log('❌ Error getting commit info:', error.message);
      return null;
    }
  }

  analyzeCommitQuality(message) {
    const conventionalPattern = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/;
    let score = 100;
    let feedback = [];

    // Check conventional commits format
    if (!conventionalPattern.test(message)) {
      score -= 20;
      feedback.push('Not following conventional commit format');
    }

    // Check length
    if (message.length > 50) {
      score -= 10;
      feedback.push('Message too long (>50 chars)');
    } else if (message.length < 10) {
      score -= 15;
      feedback.push('Message too short (<10 chars)');
    }

    // Check for proper capitalization and punctuation
    if (conventionalPattern.test(message)) {
      const type = message.match(/^(\w+)/)[1];
      const description = message.split(': ')[1];
      if (description && description[0] === description[0].toUpperCase()) {
        score -= 5;
        feedback.push('Description should start with lowercase');
      }
      if (message.endsWith('.')) {
        score -= 5;
        feedback.push('Remove period at end of message');
      }
    }

    return { score: Math.max(0, score), feedback };
  }

  extractCommitType(message) {
    const match = message.match(/^(\w+)(\(.+\))?:/);
    return match ? match[1] : 'other';
  }

  updateAnalytics(commitInfo, quality) {
    const analytics = this.loadAnalytics();
    
    analytics.totalCommits++;
    analytics.qualityScores.push({
      hash: commitInfo.hash.substring(0, 8),
      score: quality.score,
      timestamp: commitInfo.timestamp,
      message: commitInfo.message,
      feedback: quality.feedback
    });

    // Keep only last 100 commit scores
    if (analytics.qualityScores.length > 100) {
      analytics.qualityScores = analytics.qualityScores.slice(-100);
    }

    // Update type distribution
    const type = this.extractCommitType(commitInfo.message);
    analytics.typeDistribution[type] = (analytics.typeDistribution[type] || 0) + 1;

    // Update author stats
    if (!analytics.authorStats[commitInfo.author]) {
      analytics.authorStats[commitInfo.author] = {
        commits: 0,
        averageScore: 0,
        totalScore: 0
      };
    }
    const authorStat = analytics.authorStats[commitInfo.author];
    authorStat.commits++;
    authorStat.totalScore += quality.score;
    authorStat.averageScore = Math.round(authorStat.totalScore / authorStat.commits);

    analytics.lastUpdated = new Date().toISOString();
    this.saveAnalytics(analytics);
  }

  generateReport() {
    const analytics = this.loadAnalytics();
    
    console.log('\n📊 Commit Analytics Report');
    console.log('='.repeat(27));
    
    // Overall stats
    console.log(`\n📈 Overview:`);
    console.log(`   Total commits: ${analytics.totalCommits}`);
    
    if (analytics.qualityScores.length > 0) {
      const avgScore = Math.round(analytics.qualityScores.reduce((sum, commit) => sum + commit.score, 0) / analytics.qualityScores.length);
      console.log(`   Average quality score: ${avgScore}/100`);
      
      const recentScores = analytics.qualityScores.slice(-5);
      const recentAvg = Math.round(recentScores.reduce((sum, commit) => sum + commit.score, 0) / recentScores.length);
      console.log(`   Recent commits (last 5): ${recentAvg}/100`);
    }

    // Type distribution
    console.log(`\n📋 Commit Types:`);
    const typeEntries = Object.entries(analytics.typeDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    for (const [type, count] of typeEntries) {
      const percentage = Math.round((count / analytics.totalCommits) * 100);
      console.log(`   ${type}: ${count} (${percentage}%)`);
    }

    // Author performance
    if (Object.keys(analytics.authorStats).length > 0) {
      console.log(`\n👥 Top Contributors:`);
      const authorEntries = Object.entries(analytics.authorStats)
        .sort(([,a], [,b]) => b.commits - a.commits)
        .slice(0, 3);
      
      for (const [author, stats] of authorEntries) {
        console.log(`   ${author}: ${stats.commits} commits (avg: ${stats.averageScore}/100)`);
      }
    }

    // Recent quality trends
    if (analytics.qualityScores.length >= 5) {
      console.log(`\n📉 Recent Quality Trend:`);
      const recent = analytics.qualityScores.slice(-5);
      recent.forEach(commit => {
        const emoji = commit.score >= 90 ? '🟢' : commit.score >= 70 ? '🟡' : '🔴';
        console.log(`   ${emoji} ${commit.hash}: ${commit.score}/100 - "${commit.message.substring(0, 40)}..."`);
      });
    }
  }

  async run() {
    console.log('🔄 Running post-commit analysis...');
    
    const commitInfo = this.getLastCommitInfo();
    if (!commitInfo) return;

    const quality = this.analyzeCommitQuality(commitInfo.message);
    this.updateAnalytics(commitInfo, quality);

    // Show immediate feedback
    console.log(`\n📝 Commit: ${commitInfo.hash.substring(0, 8)}`);
    console.log(`💬 Message: "${commitInfo.message}"`);
    console.log(`⭐ Quality Score: ${quality.score}/100`);

    if (quality.feedback.length > 0) {
      console.log(`💡 Suggestions:`);
      quality.feedback.forEach(item => console.log(`   • ${item}`));
    }

    // Detect patterns and provide insights
    if (commitInfo.files.some(f => f.includes('.spec.') || f.includes('.test.'))) {
      console.log(`\n🧪 Test files modified: ${commitInfo.files.filter(f => f.includes('.spec.') || f.includes('.test.')).length}`);
    }

    if (commitInfo.files.some(f => f.includes('.page.'))) {
      console.log(`\n📄 Page objects modified: ${commitInfo.files.filter(f => f.includes('.page.')).length}`);
    }

    // Show weekly report on Mondays
    const day = new Date().getDay();
    if (day === 1) { // Monday
      console.log('\n📅 Weekly Report:');
      this.generateReport();
    }
  }
}

// Run the post-commit review
const reviewer = new PostCommitReview();
reviewer.run().catch(error => {
  console.error('❌ Post-commit review failed:', error.message);
});
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

/**
 * Script to automatically generate developer documentation from GitHub commits.
 * Triggered when a PR is merged into main.
 */

// Load environment variables for local testing
if (!process.env.OPENAI_API_KEY) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    }
  } catch (e) {
    console.warn('Could not load .env.local file');
  }
}

async function generateCommitDocs() {
  try {
    // Ensure we are in a git repository
    try {
      execSync('git rev-parse --is-inside-work-tree');
    } catch (e) {
      console.error('Error: Not a git repository.');
      return;
    }

    // 1. Detect the latest merge commit
    // Using --merges -1 to get the most recent merge commit
    const commitHash = execSync('git log --merges -1 --pretty=format:"%H"').toString().trim();
    if (!commitHash) {
      console.log('No merge commits found.');
      return;
    }

    const commitMessage = execSync(`git log -1 ${commitHash} --pretty=format:"%B"`).toString().trim();
    const shortHash = commitHash.substring(0, 7);
    const date = new Date().toISOString().split('T')[0];
    const repoName = process.env.PROJECT_NAME || path.basename(process.cwd());

    console.log(`Processing merge commit: ${shortHash} - ${commitMessage}`);

    // 2. Read git diff and changed files for that merge commit
    const changedFiles = execSync(`git show --name-only --pretty=format:"" ${commitHash}`).toString().trim();
    
    // Get diff of the merge commit (shows what the merge introduced)
    const gitDiff = execSync(`git show ${commitHash}`).toString().trim();

    // 3. Send information to OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Analyze the following git merge commit and generate developer documentation in markdown format.

Commit Message:
${commitMessage}

Changed Files:
${changedFiles}

Git Diff:
${gitDiff}

The output markdown MUST follow this EXACT structure:

---
title: Code Change
repo: ${repoName}
commit: ${commitHash}
date: ${date}
---

# Summary

Explain what this change introduced.

# Technical Changes

Explain what code was added or modified.

# Impact

Explain if setup, environment variables, deployment, or configuration changed.

# Files Modified

List the major files involved.
`;

    console.log('Generating documentation via OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a technical writer specializing in developer documentation. Your task is to analyze git commits and generate clear, concise, and accurate documentation." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.2,
    });

    const markdownContent = response.choices[0].message.content;

    // 4. Save the markdown file locally (will be moved by the workflow)
    const outputDir = path.join(process.cwd(), 'temp_docs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${date}-${repoName}-${shortHash}.md`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, markdownContent);
    console.log(`Successfully generated documentation: ${filePath}`);
    console.log(`FILENAME=${fileName}`); // Log filename for workflow to capture if needed

  } catch (error) {
    console.error('Error in generateCommitDocs:', error.message);
    process.exit(1);
  }
}

// Execute the function
generateCommitDocs();

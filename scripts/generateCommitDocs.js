const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

/**
 * Script to automatically generate developer documentation from GitHub commits.
 * Triggered by prefixes: feat:, docs:, infra:, architecture:
 */

// Load environment variables from .env.local if not already set (for local testing)
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

    // 1. Read latest commit info
    const commitMessage = execSync('git log -1 --pretty=format:"%B"').toString().trim();
    const commitHash = execSync('git log -1 --pretty=format:"%H"').toString().trim();
    const shortHash = commitHash.substring(0, 7);
    const date = new Date().toISOString().split('T')[0];

    // 2. Filter commits by prefix
    const allowedPrefixes = ['feat:', 'docs:', 'infra:', 'architecture:'];
    const shouldGenerate = allowedPrefixes.some(prefix => commitMessage.toLowerCase().startsWith(prefix.toLowerCase()));

    if (!shouldGenerate) {
      console.log(`Skipping documentation for commit: "${commitMessage}". Only feat:, docs:, infra:, and architecture: are processed.`);
      return;
    }

    console.log(`Processing commit: ${shortHash} - ${commitMessage}`);

    // 3. Read git diff and changed files
    const changedFiles = execSync('git show --name-only --pretty=format:"" HEAD').toString().trim();
    
    // Get diff of the latest commit
    let gitDiff = '';
    try {
      gitDiff = execSync('git diff HEAD~1 HEAD').toString().trim();
    } catch (e) {
      // Might be the first commit
      gitDiff = execSync('git show HEAD').toString().trim();
    }

    // 4. Send information to OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Analyze the following git commit and generate developer documentation in markdown format.

Commit Message:
${commitMessage}

Changed Files:
${changedFiles}

Git Diff:
${gitDiff}

The output markdown file MUST follow this EXACT format:

---
title: Commit Update
date: ${date}
commit: ${commitHash}
---

# Summary

Brief explanation of the commit.

# What Changed

Explain the technical changes made in this commit.

# Impact

Explain if the change affects setup, configuration, deployment, or runtime behaviour.

# Commands

Include commands if the change requires new commands. (e.g. npm install, docker compose up). If no commands are needed, specify "None".

# Files Modified

List the files involved.
`;

    console.log('Generating documentation via OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o as suggested in implementation plan
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

    // 5. Save the markdown file
    const outputDir = path.join(process.cwd(), 'content', 'projects', 'brilliant-office', 'changes');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${date}-${shortHash}.md`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, markdownContent);
    console.log(`Successfully generated documentation: ${filePath}`);

  } catch (error) {
    console.error('Error in generateCommitDocs:', error.message);
    if (error.response) {
      console.error(error.response.data);
    }
    process.exit(1);
  }
}

// Execute the function
generateCommitDocs();

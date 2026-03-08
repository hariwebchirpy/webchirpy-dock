const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script to automatically generate developer documentation from GitHub commits.
 * Triggered when a PR is merged into main.
 * Uses OpenRouter for AI generation.
 */

// Load environment variables for local testing
if (!process.env.OPENROUTER_API_KEY) {
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
  const { OpenRouter } = await import('@openrouter/sdk');
  try {
    // Ensure we are in a git repository
    try {
      execSync('git rev-parse --is-inside-work-tree');
    } catch (e) {
      console.error('Error: Not a git repository.');
      return;
    }

    // 1. Detect the latest commit
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    if (!commitHash) {
      console.log('No commits found.');
      return;
    }

    const commitMessage = execSync(`git log -1 ${commitHash} --pretty=format:"%B"`).toString().trim();
    const shortHash = commitHash.substring(0, 7);
    const date = new Date().toISOString().split('T')[0];

    console.log(`Processing commit: ${shortHash} - ${commitMessage}`);

    // 2. Read git diff and changed files
    const changedFiles = execSync(`git show --name-only --pretty=format:"" ${commitHash}`).toString().trim();
    let gitDiff = execSync(`git show ${commitHash}`).toString().trim();

    // Truncate diff if it's too long (limit to ~5000 lines)
    const diffLines = gitDiff.split('\n');
    if (diffLines.length > 5000) {
      gitDiff = diffLines.slice(0, 5000).join('\n') + '\n\n... (diff truncated for length)';
    }

    // Attempt to detect project from changed files (e.g., content/projects/XYZ/...)
    let detectedProject = null;
    const fileLines = changedFiles.split('\n');
    for (const file of fileLines) {
      const match = file.match(/^content\/projects\/([^/]+)\//);
      if (match) {
        detectedProject = match[1];
        break;
      }
    }

    const repoName = process.env.PROJECT_NAME || detectedProject || path.basename(process.cwd());
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || !apiKey.startsWith('sk-or-')) {
      console.error('Error: Invalid or missing OPENROUTER_API_KEY. It should start with "sk-or-".');
      return;
    }

    // 3. Send information to OpenRouter
    const openrouter = new OpenRouter({
      apiKey: apiKey,
    });

    const prompt = `
Analyze the following git commit and generate developer documentation in markdown format.

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

    console.log('Generating documentation via OpenRouter...');
    
    const modelsToTry = [
      "openrouter/auto",
      "google/gemini-3.1-flash-lite-preview",
      "qwen/qwen3.5-27b",
      "mistralai/mistral-large-2411"
    ];

    let stream;
    let successfulModel = "";

    for (const model of modelsToTry) {
      try {
        console.log(`Attempting with model: ${model}...`);
        stream = await openrouter.chat.send({
          chatGenerationParams: {
            model: model,
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
            stream: true,
            provider: {
              dataCollection: "allow"
            }
          }
        });
        successfulModel = model;
        break; 
      } catch (err) {
        if (model === modelsToTry[modelsToTry.length - 1]) throw err;
        console.warn(`Model ${model} failed, trying next...`);
      }
    }

    console.log(`Using model: ${successfulModel}`);

    let markdownContent = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        markdownContent += content;
        process.stdout.write(content);
      }
    }

    console.log('\nGeneration complete.');

    // 4. Save the markdown file to the project's changes directory
    const outputDir = path.join(process.cwd(), 'content', 'projects', repoName, 'changes');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${date}-${repoName}-${shortHash}.md`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, markdownContent);
    console.log(`Successfully generated documentation: ${filePath}`);

  } catch (error) {
    if (error.message.includes('data policy')) {
      console.error('\n--- OPENROUTER ERROR ---');
      console.error('Error: Your OpenRouter account privacy settings are blocking free model usage.');
      console.error('FIX: Go to https://openrouter.ai/settings/privacy and set "Allow data collection" to "Yes".');
      console.error('------------------------\n');
    } else {
      console.error('\n--- ERROR DETAILS ---');
      console.error('Message:', error.message);
      if (error.response && error.response.data) {
        console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      }
      console.error('----------------------\n');
      
      console.log('Attempting to list available models to help you debug...');
      try {
        const { OpenRouter } = await import('@openrouter/sdk');
        const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
        const modelsResult = await openrouter.models.list();
        if (modelsResult && modelsResult.data) {
          console.log('Available models (first 10):');
          modelsResult.data.slice(0, 10).forEach(m => console.log(`- ${m.id}`));
          console.log('Check the full list at: https://openrouter.ai/models');
        }
      } catch (listError) {
        // Ignore listing errors
      }
    }
    process.exit(1);
  }
}

// Execute the function
generateCommitDocs();

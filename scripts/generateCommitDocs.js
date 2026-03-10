const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function toSafePathSegment(value, fallback = 'unknown-project') {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || fallback;
}

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

    const beforeSha = (process.env.GITHUB_EVENT_BEFORE || '').trim();
    const afterSha = (process.env.GITHUB_EVENT_AFTER || '').trim();

    // 1. Detect commits relevant to the push event
    let commitHashes = [];
    if (beforeSha && afterSha) {
      const revRange = `${beforeSha}..${afterSha}`;
      console.log(`Computing commit range: ${revRange}`);
      const revList = execSync(`git rev-list --reverse ${revRange}`).toString().trim();
      if (revList) {
        commitHashes = revList.split('\n').map((hash) => hash.trim()).filter(Boolean);
      }
    }

    if (commitHashes.length === 0) {
      const fallbackHash = execSync('git rev-parse HEAD').toString().trim();
      if (!fallbackHash) {
        console.log('No commits found.');
        return;
      }
      commitHashes = [fallbackHash];
      console.warn('No push range found from event context. Falling back to HEAD only.');
    }

    const date = new Date().toISOString().split('T')[0];

    // Attempt to detect project from changed files (e.g., content/projects/XYZ/...)
    let detectedProject = null;
    for (const commitHash of commitHashes) {
      const changedFilesForCommit = execSync(`git show --name-only --pretty=format:"" ${commitHash}`).toString().trim();
      const fileLines = changedFilesForCommit.split('\n');
      for (const file of fileLines) {
        const match = file.match(/^content\/projects\/([^/]+)\//);
        if (match) {
          detectedProject = match[1];
          break;
        }
      }

      if (detectedProject) {
        break;
      }
    }

    const githubRepo = process.env.GITHUB_REPOSITORY || '';
    const repoBaseName = path.basename(process.cwd());
    
    const repoToPathMap = {
      'webchirpy-new/ordering-backend': 'brilliant-office/changes/backend',
      'webchirpy-new/ordering-frontend': 'brilliant-office/changes/frontend',
      'webchirpy-new/brilliantoffice_mob': 'brilliant-office/changes/mobile',
      'webchirpy-new/mytax': 'taxsense/changes/backend',
      'webchirpy-new/mytax_web': 'taxsense/changes/frontend',
      'webchirpy-new/mytax_app': 'taxsense/changes/mobile',
      'hariwebchirpy/webchirpy-dock': 'webchirpy-dock/changes/frontend'
    };
    
    const shortRepoToPathMap = {
      'ordering-backend': 'brilliant-office/changes/backend',
      'ordering-frontend': 'brilliant-office/changes/frontend',
      'brilliantoffice_mob': 'brilliant-office/changes/mobile',
      'mytax': 'taxsense/changes/backend',
      'mytax_web': 'taxsense/changes/frontend',
      'mytax_app': 'taxsense/changes/mobile',
      'webchirpy-dock': 'webchirpy-dock/changes/frontend'
    };

    let projectPath = repoToPathMap[githubRepo] || shortRepoToPathMap[repoBaseName] || process.env.PROJECT_NAME || detectedProject || repoBaseName;

    const projectSource = repoToPathMap[githubRepo] ? 'GitHub Repo Mapping' : shortRepoToPathMap[repoBaseName] ? 'Folder Name Mapping' : process.env.PROJECT_NAME ? 'GitHub Secret (PROJECT_NAME)' : detectedProject ? 'Path Detection' : 'Default Directory Name';
    console.log(`Using project path: ${projectPath} (Source: ${projectSource})`);

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || !apiKey.startsWith('sk-or-')) {
      console.error('Error: Invalid or missing OPENROUTER_API_KEY. It should start with "sk-or-".');
      process.exit(1);
    }

    // 2. Send information to OpenRouter
    const openrouter = new OpenRouter({
      apiKey: apiKey,
    });

    console.log(`Generating documentation via OpenRouter for ${commitHashes.length} commit(s)...`);
    
    const modelsToTry = [
      "openrouter/auto",
      "google/gemini-3.1-flash-lite-preview",
      "qwen/qwen3.5-27b",
      "mistralai/mistral-large-2411"
    ];


    for (const [index, commitHash] of commitHashes.entries()) {
      const commitMessage = execSync(`git log -1 ${commitHash} --pretty=format:"%B"`).toString().trim();
      const shortHash = commitHash.substring(0, 7);
      const sequenceNumber = index + 1;

      console.log(`Processing commit ${sequenceNumber}/${commitHashes.length}: ${shortHash} - ${commitMessage}`);

      const changedFiles = execSync(`git show --name-only --pretty=format:"" ${commitHash}`).toString().trim();
      let gitDiff = execSync(`git show ${commitHash}`).toString().trim();

      // Truncate diff if it's too long (limit to ~5000 lines)
      const diffLines = gitDiff.split('\n');
      if (diffLines.length > 5000) {
        gitDiff = diffLines.slice(0, 5000).join('\n') + '\n\n... (diff truncated for length)';
      }

      const prompt = `
Analyze the following git commit and generate developer documentation in markdown format.

Commit Message:
${commitMessage}

Changed Files:
${changedFiles}

Git Diff:
${gitDiff}

Commit Order In Push:
${sequenceNumber} of ${commitHashes.length}

The output markdown MUST follow this EXACT structure:

---
title: Code Change
repo: ${githubRepo || projectPath}
commit: ${commitHash}
date: ${date}
sequence: ${sequenceNumber}/${commitHashes.length}
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
                  content: "You are a technical writer specializing in developer documentation. Your task is to analyze git commits and generate clear, concise, and accurate documentation. Output ONLY raw markdown. DO NOT wrap your entire response in ```markdown or any other code blocks. Start directly with the frontmatter (---)." 
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

      // Clean up the markdown content: strip leading/trailing code blocks if the AI included them
      markdownContent = markdownContent.trim();
      if (markdownContent.startsWith('```')) {
        // Remove the first line if it starts with ```
        const lines = markdownContent.split('\n');
        if (lines[0].startsWith('```')) {
          lines.shift();
          // Also remove the last line if it's just ```
          if (lines.length > 0 && lines[lines.length - 1].trim() === '```') {
            lines.pop();
          }
          markdownContent = lines.join('\n').trim();
        }
      }

      console.log('\nGeneration complete.');

      let cleanPathSegments = projectPath.split('/').map(p => toSafePathSegment(p, p));

      const pathSegments = [
        process.cwd(),
        "content",
        "projects",
        ...cleanPathSegments
      ];
      
      const outputDir = path.join(...pathSegments);

      // ensure directory exists
      fs.mkdirSync(outputDir, { recursive: true });

      const safePrefix = cleanPathSegments.join('-');
      const fileName = `${date}-${safePrefix}-${shortHash}.md`;
      const filePath = path.join(outputDir, fileName);

      fs.writeFileSync(filePath, markdownContent);

      console.log(`Saved documentation to: ${filePath}`);
      console.log(`Successfully generated documentation: ${filePath}`);
    }

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

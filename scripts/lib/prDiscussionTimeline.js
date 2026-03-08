const fs = require('fs');
const path = require('path');

async function githubRequest(url, token) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'webchirpy-dock-docs-automation'
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API request failed (${response.status}) ${url}: ${body}`);
  }

  return response.json();
}

async function fetchAllPages(baseUrl, token) {
  const results = [];
  let page = 1;

  while (true) {
    const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}per_page=100&page=${page}`;
    const items = await githubRequest(url, token);
    if (!Array.isArray(items) || items.length === 0) {
      break;
    }

    results.push(...items);

    if (items.length < 100) {
      break;
    }
    page += 1;
  }

  return results;
}

function toEntry(item, type) {
  const body = item.body ? item.body.trim() : '';
  if (!body) {
    return null;
  }

  const createdAt = item.submitted_at || item.created_at;
  if (!createdAt) {
    return null;
  }

  return {
    createdAt,
    author: item.user?.login || 'unknown',
    type,
    body,
    metadata: {
      id: item.id,
      state: item.state,
      path: item.path,
      line: item.line || item.original_line
    }
  };
}

function renderEntry(entry) {
  const timestamp = new Date(entry.createdAt).toISOString();
  const details = [];

  if (entry.metadata.path) {
    details.push(`file: \`${entry.metadata.path}\``);
  }
  if (entry.metadata.line) {
    details.push(`line: ${entry.metadata.line}`);
  }
  if (entry.metadata.state) {
    details.push(`state: ${entry.metadata.state}`);
  }

  const detailSuffix = details.length > 0 ? ` (${details.join(', ')})` : '';

  return [
    `### ${timestamp} · @${entry.author} · ${entry.type}${detailSuffix}`,
    '',
    entry.body,
    ''
  ].join('\n');
}

function writeTimelineFile({ projectName, owner, repo, pullRequest, entries, outputBaseDir }) {
  const mergedAt = pullRequest.merged_at || new Date().toISOString();
  const mergedDate = mergedAt.split('T')[0];
  const outputDir = path.join(outputBaseDir, 'content', 'projects', projectName, 'changes', 'pr-discussions');

  fs.mkdirSync(outputDir, { recursive: true });

  const outputFileName = `${mergedDate}-${projectName}-pr-${pullRequest.number}-timeline.md`;
  const outputPath = path.join(outputDir, outputFileName);

  const summaryRows = [
    `- PR: #${pullRequest.number}`,
    `- Title: ${pullRequest.title}`,
    `- Repository: ${owner}/${repo}`,
    `- Merged at: ${mergedAt}`,
    `- Total entries: ${entries.length}`
  ];

  const markdown = [
    '---',
    `title: PR #${pullRequest.number} Discussion Timeline`,
    `repo: ${projectName}`,
    `source_repo: ${owner}/${repo}`,
    `pr: ${pullRequest.number}`,
    `merged_at: ${mergedAt}`,
    `date: ${mergedDate}`,
    'doc_type: pr_discussion_timeline',
    '---',
    '',
    '# PR Discussion Timeline',
    '',
    ...summaryRows,
    '',
    '## Conversation',
    '',
    entries.length > 0
      ? entries.map((entry) => renderEntry(entry)).join('\n')
      : '_No issue comments, review comments, or review summaries found for this PR._',
    ''
  ].join('\n');

  fs.writeFileSync(outputPath, markdown, 'utf8');
  return outputPath;
}

async function generateTimelineForPr({ owner, repo, prNumber, token, projectName, outputBaseDir = process.cwd() }) {
  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

  const pullRequest = await githubRequest(`${apiBase}/pulls/${prNumber}`, token);
  const issueComments = await fetchAllPages(`${apiBase}/issues/${prNumber}/comments`, token);
  const reviewComments = await fetchAllPages(`${apiBase}/pulls/${prNumber}/comments`, token);
  const reviews = await fetchAllPages(`${apiBase}/pulls/${prNumber}/reviews`, token);

  const entries = [
    ...issueComments.map((item) => toEntry(item, 'issue_comment')),
    ...reviewComments.map((item) => toEntry(item, 'review_comment')),
    ...reviews.map((item) => toEntry(item, 'review_summary'))
  ].filter(Boolean);

  entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return writeTimelineFile({ projectName, owner, repo, pullRequest, entries, outputBaseDir });
}

async function listMergedPullRequests({ owner, repo, token, since }) {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc`;
  const pulls = await fetchAllPages(baseUrl, token);

  return pulls.filter((pr) => {
    if (!pr.merged_at) return false;
    if (!since) return true;
    return new Date(pr.merged_at).getTime() >= new Date(since).getTime();
  });
}

module.exports = {
  generateTimelineForPr,
  listMergedPullRequests
};

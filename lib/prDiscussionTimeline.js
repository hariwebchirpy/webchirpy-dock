const fs = require("fs");
const path = require("path");

async function githubFetch(url, token) {

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json"
    }
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

async function listMergedPullRequests({ owner, repo, token, since }) {

  const prs = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=100`,
    token
  );

  return prs.filter(pr => {
    if (!pr.merged_at) return false;

    if (!since) return true;

    return new Date(pr.merged_at) >= new Date(since);
  });
}

async function generateTimelineForPr({
  owner,
  repo,
  prNumber,
  token,
  projectName
}) {

  const pr = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    token
  );

  const comments = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
    token
  );

  const reviews = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`,
    token
  );

  const events = [
    ...comments.map(c => ({
      type: "comment",
      user: c.user.login,
      body: c.body,
      date: c.created_at
    })),
    ...reviews.map(r => ({
      type: "review",
      user: r.user.login,
      body: r.body || "",
      state: r.state,
      date: r.submitted_at
    }))
  ];

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  const date = new Date().toISOString().split("T")[0];

  let markdown = `---
title: PR Discussion Timeline
repo: ${repo}
pr: ${prNumber}
date: ${date}
---

# PR #${prNumber} — ${pr.title}

## Timeline
`;

  for (const e of events) {

    markdown += `
### ${e.type} — ${e.user}

${e.body}

`;
  }

  const outputDir = path.join(
    process.cwd(),
    "content",
    "projects",
    projectName,
    "changes",
    "pr-discussions"
  );

  fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(
    outputDir,
    `${date}-pr-${prNumber}.md`
  );

  fs.writeFileSync(filePath, markdown);

  return filePath;
}

module.exports = {
  generateTimelineForPr,
  listMergedPullRequests
};
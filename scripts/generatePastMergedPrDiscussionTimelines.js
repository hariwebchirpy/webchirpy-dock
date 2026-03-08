const { generateTimelineForPr, listMergedPullRequests } = require("../lib/prDiscussionTimeline");

const REQUIRED_ENV_VARS = [
  "GITHUB_TOKEN",
  "GITHUB_REPOSITORY"
];

function ensureEnv() {
  const missing = REQUIRED_ENV_VARS.filter(v => !process.env[v]);

  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
}

function getRepoParts() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

  if (!owner || !repo) {
    throw new Error(`Invalid repo: ${process.env.GITHUB_REPOSITORY}`);
  }

  return { owner, repo };
}

async function main() {

  ensureEnv();

  const { owner, repo } = getRepoParts();

  let projectName = process.env.PROJECT_NAME || repo;
  
  // Strip -changes-* suffix if present
  projectName = projectName.replace(/-changes-.*$/, '');

  const since = process.env.PR_MERGED_SINCE || "";
  const maxPrs = Number(process.env.MAX_PRS || "0");

  const mergedPrs = await listMergedPullRequests({
    owner,
    repo,
    token: process.env.GITHUB_TOKEN,
    since
  });

  const selectedPrs = maxPrs > 0
    ? mergedPrs.slice(0, maxPrs)
    : mergedPrs;

  console.log(`Processing ${selectedPrs.length} PRs`);

  for (const pr of selectedPrs) {

    const outputPath = await generateTimelineForPr({
      owner,
      repo,
      prNumber: pr.number,
      token: process.env.GITHUB_TOKEN,
      projectName
    });

    console.log(`Generated timeline for PR #${pr.number}`);
  }

}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
const { generateTimelineForPr, listMergedPullRequests } = require('./lib/prDiscussionTimeline');

const REQUIRED_ENV_VARS = ['GITHUB_TOKEN', 'GITHUB_REPOSITORY'];

function ensureEnv() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function getRepoParts() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${process.env.GITHUB_REPOSITORY}`);
  }
  return { owner, repo };
}

async function generatePastMergedPrTimelines() {
  ensureEnv();

  const { owner, repo } = getRepoParts();
  const projectName = process.env.PROJECT_NAME || repo;
  const since = process.env.PR_MERGED_SINCE || '';
  const maxPrs = Number(process.env.MAX_PRS || '0');

  const mergedPrs = await listMergedPullRequests({
    owner,
    repo,
    token: process.env.GITHUB_TOKEN,
    since
  });

  const selectedPrs = Number.isInteger(maxPrs) && maxPrs > 0 ? mergedPrs.slice(0, maxPrs) : mergedPrs;

  console.log(`Found ${mergedPrs.length} merged PR(s); generating timelines for ${selectedPrs.length}.`);

  for (const pr of selectedPrs) {
    const outputPath = await generateTimelineForPr({
      owner,
      repo,
      prNumber: pr.number,
      token: process.env.GITHUB_TOKEN,
      projectName
    });

    console.log(`Generated timeline for PR #${pr.number}: ${outputPath}`);
  }
}

generatePastMergedPrTimelines().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

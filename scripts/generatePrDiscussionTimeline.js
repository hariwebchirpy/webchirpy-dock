const { generateTimelineForPr } = require('./lib/prDiscussionTimeline');

const REQUIRED_ENV_VARS = ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER'];

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

async function generateTimeline() {
  ensureEnv();

  const prNumber = Number(process.env.PR_NUMBER);
  if (!Number.isInteger(prNumber) || prNumber <= 0) {
    throw new Error(`Invalid PR_NUMBER: ${process.env.PR_NUMBER}`);
  }

  const { owner, repo } = getRepoParts();
  const projectName = process.env.PROJECT_NAME || repo;

  const outputPath = await generateTimelineForPr({
    owner,
    repo,
    prNumber,
    token: process.env.GITHUB_TOKEN,
    projectName
  });

  console.log(`Generated PR discussion timeline at: ${outputPath}`);
}

generateTimeline().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

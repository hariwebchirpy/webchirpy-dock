---
title: Auto Generate Commit Docs Configuration Setup
version: 1.0.0
---

# Summary

This change introduces configuration setup for automatically generating documentation from commit messages.

# Technical Changes

The `scripts/generateCommitDocs.js` script has been updated to include a new configuration option: `githubRepo`. This option allows for specifying the GitHub repository path, which will be used in the generated documentation's `repo` field. If `githubRepo` is not provided, the existing `projectPath` will be used as a fallback.

# Impact

This change modifies the configuration setup for the commit documentation generation script. Developers should be aware that the `repo` field in the generated markdown documents might now include the GitHub repository path if configured. No direct changes to environment variables, deployment processes, or core application setup are required.

# Files Modified

- `scripts/generateCommitDocs.js`
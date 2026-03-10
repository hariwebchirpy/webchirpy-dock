---
title: Code Change
repo: taxsense/changes/frontend
commit: d98c1b291b5ab2ee5b980ebad6a1d644620bf341
date: 2026-03-10
sequence: 1/1
---

# Summary

This change configures the automated generation of documentation for commits. It ensures that if a target directory for generated documentation does not exist, it will be created.

# Technical Changes

The `.github/workflows/auto-docs.yml` file was modified. Specifically, the logic within the `auto-docs` workflow job was updated. Previously, if the expected source directory for generated documentation (`content/projects/$TARGET_PATH`) did not exist, the script would exit without creating it. This change modifies that behavior to create the directory using `mkdir -p "content/projects/$TARGET_PATH"` if it's not found, allowing the documentation generation process to proceed by creating the necessary directory structure.

# Impact

This change impacts the setup for automated documentation generation. By ensuring that the target directory is created if it doesn't exist, it smooths out the initial setup and execution of the documentation generation workflow, preventing premature exits and facilitating the creation of documentation artifacts. No changes to environment variables or deployment procedures are noted.

# Files Modified

*   `.github/workflows/auto-docs.yml`
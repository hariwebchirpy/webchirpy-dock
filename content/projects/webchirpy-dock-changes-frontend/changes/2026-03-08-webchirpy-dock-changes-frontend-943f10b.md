---
title: Code Change
repo: webchirpy-dock/changes/frontend
commit: 943f10be55c644bd3352025e27d6734e8404cfbf
date: 2026-03-08
sequence: 1/2
---

# Summary

This change enhances the resilience of the documentation copying step within the CI pipeline. It now correctly handles cases where the `PROJECT_NAME` environment variable might not precisely match the directory structure, preventing failures.

# Technical Changes

The `auto-docs.yml` workflow has been updated to improve the logic for identifying and copying generated documentation.

The script now:
- Trims whitespace and carriage returns from the `PROJECT_NAME` environment variable, ensuring cleaner comparisons.
- Introduces a function `copy_project_changes` to encapsulate the logic of copying documentation for a given project.
- If the `PROJECT_NAME` directory is not found or doesn't contain changes, it now falls back to iterating through all available project change directories and copying them.
- A flag `copied_any` is used to track if any documentation was successfully copied during the fallback process, providing a more accurate "no documentation found" message.

# Impact

**Environment Variables:**
- A new environment variable, `PROJECT_NAME`, is now required in the CI environment secrets. This variable should specify the name of the project whose documentation is to be copied. If not provided, the pipeline will attempt to infer it from the `GITHUB_REPOSITORY`.

**Configuration:**
- The `.github/workflows/auto-docs.yml` file has been modified, which is the primary configuration for this CI step.

**Deployment:**
- No direct impact on deployment. This change affects the CI process for generating and updating documentation.

# Files Modified

*   `.github/workflows/auto-docs.yml`: Modified to implement the improved documentation copying logic and introduce the `PROJECT_NAME` environment variable.
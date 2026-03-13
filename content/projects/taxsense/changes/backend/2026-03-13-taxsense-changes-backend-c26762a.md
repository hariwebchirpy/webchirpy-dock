---
title: Merged main into hari branch
repo: webchirpy-new/mytax
commit: c26762a65cda83bc44c22b4c0859abf5365a0415
date: 2026-03-13
sequence: 2/4
---

# Summary

This commit merges the `main` branch into the `hari` branch. The primary change involves modifications to the `rule_engine/engine.py` file, specifically related to how residual limits and uncapped expenses are calculated within the rule engine.

# Technical Changes

The logic for calculating `residual_limit` in `rule_engine/engine.py` has been refined. Previously, the calculation was less explicit. The updated code now clearly separates the calculation of the sum of sub-limits and the subtraction from the category's effective limit to determine the `residual_limit`. Additionally, a comment has been updated to accurately reflect that the code fetches expenses not caught by sub-rules.

# Impact

No changes to setup, environment variables, deployment, or configuration are indicated by this commit.

# Files Modified

*   `rule_engine/engine.py`
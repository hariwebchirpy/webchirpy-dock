---
title: Fix Shared Subcategory Relief Distribution Under Category Cap
repo: webchirpy-new/mytax
commit: 78de2467f536b3e3b2b38391779a3db669c0825b
date: 2026-03-18
sequence: 1/2
---

# Summary

This change refactors how relief is distributed among subcategories within a given deduction category, ensuring that limited subcategories are prioritized before shared subcategories utilize the remaining category cap. This prevents shared subcategories from being starved of relief or consuming more than their fair share when an overall category cap is present.

# Technical Changes

The `RuleEngine` class in `rule_engine/engine.py` has been modified to implement a two-phase relief distribution logic.

Previously, subcategories (both limited and shared) were processed in a single loop, where their potential relief was calculated based on their `spent` amount and `effective_limit` (if applicable), and then applied against the `remaining_cap`. This could lead to an uneven distribution if a shared subcategory consumed a significant portion of the `remaining_cap` before limited subcategories had a chance to apply their individual limits.

The updated logic now separates the subcategories into two groups:
1.  **Limited Subcategories (`effective_limit > 0`):** These subcategories are processed first. Their relief is capped by their individual `effective_limit` and the `remaining_cap`. The `remaining_cap` is then reduced by the applied relief.
2.  **Shared Subcategories (`effective_limit <= 0`):** These subcategories are processed second. Their relief is capped only by their `spent` amount and the *currently remaining* `remaining_cap`. This ensures they only distribute the relief left over after all limited subcategories have been satisfied.

# Impact

This change has no impact on setup, environment variables, deployment, or configuration. It is a back-end logic adjustment within the rule engine.

# Files Modified

*   `rule_engine/engine.py`
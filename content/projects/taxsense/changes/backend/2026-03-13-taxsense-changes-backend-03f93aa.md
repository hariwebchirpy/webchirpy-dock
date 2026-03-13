---
title: Shred Limit Added
repo: webchirpy-new/mytax
commit: 03f93aa234627434edf885de73472f250db4af99
date: 2026-03-13
sequence: 3/4
---

# Summary

This change introduces a more nuanced handling of limits within the `RuleEngine`. Previously, `applied_relief` was always capped by `effective_limit`. Now, if `effective_limit` is 0, it signifies a shared limit, and `applied_relief` will be equal to the `spent` amount, effectively removing the individual cap. This applies to both subcategory and category rule processing.

# Technical Changes

The logic for calculating `res.applied_relief` in the `RuleEngine` class has been modified.

In the subcategory processing section, the calculation `res.applied_relief = min(spent, res.effective_limit)` has been replaced with a conditional block:
- If `res.effective_limit > 0`, the behavior remains the same: `res.applied_relief = min(spent, res.effective_limit)`.
- If `res.effective_limit` is 0, `res.applied_relief` is now set to `spent`, indicating no individual cap.

A similar change has been applied to the subcategory recalculation that incorporates payroll data. The logic `res.applied_relief = min(res.spent, res.effective_limit)` is replaced by:
- If `res.effective_limit > 0`, `res.applied_relief = min(res.spent, res.effective_limit)`.
- If `res.effective_limit` is 0, `res.applied_relief = res.spent`.

# Impact

No changes to setup, environment variables, deployment, or configuration are expected. This is a purely logical change within the `RuleEngine`'s calculation process.

# Files Modified

*   `rule_engine/engine.py`
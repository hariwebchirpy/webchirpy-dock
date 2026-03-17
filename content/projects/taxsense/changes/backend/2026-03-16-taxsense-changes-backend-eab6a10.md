---
title: Code Change
repo: webchirpy-new/mytax
commit: eab6a102eac93065c3191ca677d0a9d806aa711e
date: 2026-03-16
sequence: 1/2
---

# Summary

This commit addresses a bug in rule calculation, specifically ensuring that the `applied_relief` is correctly represented as `spent` for UI display purposes. This change impacts how relief amounts are visualized in the user interface.

# Technical Changes

The modification in `rule_engine/engine.py` ensures that the `applied_relief` attribute from the `RuleEngine` is now consistently mapped to a `spent` field.

-   **Addition of `spent` field to `category_data`:** When processing category data, `res.applied_relief` is now converted to a string and added to `category_data` under the key `spent`.
-   **Addition of `spent` field to `rule_data`:** Similarly, when processing rule data within sub-categories, `res.applied_relief` is converted to a string and added to the `rule_data` dictionary under the key `spent`.

# Impact

This change is primarily a frontend display adjustment. No changes are required for environment variables, deployment, or core configuration. The `spent` field will now be available for UI elements that consume this data.

# Files Modified

-   `rule_engine/engine.py`
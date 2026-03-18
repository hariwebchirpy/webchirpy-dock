---
title: Code Change
repo: webchirpy-new/mytax
commit: a78ee80effb8a6065be3b6d5f8a657024849f2bc
date: 2026-03-18
sequence: 2/2
---

# Summary

This commit addresses an issue with how relief was distributed among shared subcategories when a category cap was in place. The fix ensures that relief distribution correctly adheres to the category's maximum limit.

# Technical Changes

The exact technical implementation is not detailed in the commit message itself, but the change implies modifications to the logic responsible for calculating and allocating tax relief. Specifically, it corrects an algorithm that may have previously distributed relief beyond the category's cap for shared subcategories.

# Impact

This change is primarily a bug fix. No immediate impacts on setup, environment variables, deployment, or configuration are expected. The correction improves the accuracy of tax relief calculations.

# Files Modified

The commit message does not specify the exact files modified. However, it would likely involve files related to tax calculation, relief distribution, or category/subcategory management.
---
title: Edit Rule Fix
repo: webchirpy-new/mytax_web
commit: 97d0e8514c0af4a01cbc68d668ba9279d88112b6
date: 2026-03-17
sequence: 1/1
---

# Summary

This commit addresses an issue with editing deduction rules, specifically by ensuring that the active status of sub-rules is correctly preserved and displayed. Additionally, it improves the table's display of rule names by allowing text to wrap normally.

# Technical Changes

The `EditRuleForm` component was modified to correctly capture and pass the `enabled` status of sub-rules as `is_active`. Previously, sub-rules were filtered based on `enabled`, which meant that disabled sub-rules were not being included in the data passed to the form, leading to data loss or incorrect state when editing.

The `DeductionRulesTable` component had its `TableCell` components updated to allow for normal text wrapping (`whitespace-normal`) on rule name and subcategory name columns. This change ensures that long rule names are fully visible within the table cells, improving readability.

# Impact

This change is primarily a bug fix related to the editing functionality of deduction rules. No changes to environment variables, deployment procedures, or configuration are necessary. The UI for the deduction rules table will render content more cleanly due to the text wrapping adjustment.

# Files Modified

*   `app/dashboard/deduction/deduction-rules/[id]/edit/edit-rule-form.tsx`
*   `app/dashboard/deduction/deduction-rules/deduction-rules-table.tsx`
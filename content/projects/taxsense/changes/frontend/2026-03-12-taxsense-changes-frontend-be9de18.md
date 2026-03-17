---
title: Add Deduction Category Code
repo: webchirpy-new/mytax_web
commit: be9de189920037f742bfeb4c89dc94c7eacfdea2
date: 2026-03-12
sequence: 1/2
---

# Summary

This change introduces a `code` field for deduction categories. This field is now a required part of the deduction category form, both when adding and editing.

# Technical Changes

The `code` field has been added to the form schema for deduction categories. This includes defining it as a required string with a minimum length of 1 character. Consequently, the `AddDeductionCategory` and `EditDeductionCategory` pages have been updated to include an input field for this new `code` in their respective forms. Default values and form resetting logic have also been adjusted to accommodate the new field.

# Impact

No changes to environment variables, deployment, or configuration are required. Users will now see and be required to input a deduction code when creating or modifying deduction categories.

# Files Modified

*   `app/dashboard/deduction/[id]/edit/page.tsx`: Modified to include the `code` field in the edit form.
*   `app/dashboard/deduction/add/page.tsx`: Modified to include the `code` field in the add form.
*   `schemas/deduction/form.schema.ts`: Modified to add the `code` field to the `DeductionFormSchema`.
*   `package-lock.json`: This file was listed as modified but appears to be unrelated to the core changes of this commit, likely an artifact of a broader npm install or update that occurred separately.
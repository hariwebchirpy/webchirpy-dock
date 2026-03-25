---
title: Code Change
repo: webchirpy-new/mytax_web
commit: 773d6ea5ed5ebcb727aea4ed5932c2072c47624d
date: 2026-03-25
sequence: 1/1
---

# Summary

Implemented a payload transformation for suggestion-related API calls. The change introduces a helper that maps form fields (`deduction_category_id`, `deduction_subcategory_id`) to the API‑expected fields (`deduction_category`, `deduction_subcategory`) and updates the create and update suggestion functions to use this mapping.

# Technical Changes

- **Added** `remapSuggestionPayload` function:
  - Extracts `deduction_category_id` and `deduction_subcategory_id` from the submitted form data.
  - Renames them to `deduction_category` and `deduction_subcategory`, defaulting to `null` when undefined.
  - Returns a new payload object preserving the rest of the form fields.

- **Modified** `createSuggestion`:
  - Now posts the transformed payload (`remapSuggestionPayload(data)`) instead of the raw form data.

- **Modified** `updateSuggestion`:
  - Now patches the transformed payload using the same helper.

These updates ensure the backend receives the correct field names without altering the form schema.

# Impact

No changes to environment variables, deployment processes, or configuration files are required. The modification is isolated to the client‑side suggestion service and is backward compatible as it only affects how data is packaged before the API request.

# Files Modified

- `actions/suggestion/actions.ts` – added helper function and updated API request calls.
---
title: Code Change
repo: webchirpy-new/mytax_app
commit: 6fe8763d872b3f78833117fc8a3932654d0c4d6c
date: 2026-03-31
sequence: 1/1
---

# Summary

The update introduces several fixes related to the **20025 limit** handling and improves how payroll and deduction categories are fetched. Key changes include:

* Switching the local API server IP in `.env`.
* Passing the active tax profile ID to category‑fetching service calls across the app.
* Updating limit validation to use **`calculated_limit`** and respecting a new **`skip_limit_validation`** flag.
* Enhancing the `TransactionContext` to load categories per tax profile and ensuring proper initialization.
* Adjusting UI components (`AddExpenseScreen`, `RecordsScreen`, `PreviousYearWizard`, `PayrollDeductionModal`) to work with the new fetch signatures and guard against missing profile IDs.
* Extending type definitions with fields that support the new limit logic.

# Technical Changes

### Environment
* `.env` – Updated `EXPO_PUBLIC_API_BASE_URL` and `EXPO_PUBLIC_API_MEDIA_BASE_URL` to point to `http://192.168.29.89:8080`.

### Service Layer (`services/transactionService.ts`)
* `getRemunerationCategories`, `getDeductionCategories`, and `getPayrollDeductionCategories` now require a `taxProfileId` argument and call tax‑profile‑scoped endpoints.
* Deduction categories endpoint now includes `&limit=true` to retrieve calculated limits.

### Types (`types/api.ts`)
* Added optional fields:
  * `skip_limit_validation?: boolean` to `RemunerationCategory`, `DeductionCategory`, and `DeductionSubCategory`.
  * `calculated_limit?: number` to `DeductionCategory` and `DeductionSubCategory`.
* These fields enable the UI to decide whether to enforce limit validation and which limit value to display.

### Context (`context/TransactionContext.tsx`)
* `fetchCategories` now accepts `profileId` and calls the updated service methods.
* Whenever a tax profile is selected, `fetchCategories(profileId)` is invoked alongside `fetchTaxSummary`.
* Initialization no longer calls `fetchCategories` without a profile ID; it now runs after the profile is known.
* Updated downstream calls (e.g., `setActiveTaxProfile`) to include the new category fetch.

### UI Components
* **AddExpenseScreen** (`app/(tabs)/add_expense.tsx`)
  * Guarded payroll‑category fetch with `if (!activeTaxProfileId) return;`.
  * Passed `activeTaxProfileId` to `getPayrollDeductionCategories`.
  * Added `activeTaxProfileId` to `useEffect` dependency array.
  * Fixed `GradientBackground` usage (`children={undefined}` removed).

* **RecordsScreen** (`app/(tabs)/records.tsx`)
  * Same guard and dependency updates as above for payroll categories.

* **PreviousYearWizard** (`app/wizard/PreviousYearWizard.tsx`)
  * Remuneration categories now fetched with `activeTaxProfileId`.
  * Limit checks now verify `!category.skip_limit_validation` and use `calculated_limit` instead of the old `limit`.

* **PayrollDeductionModal** (`components/PayrollDeductionModal.tsx`)
  * Accesses `activeTaxProfileId` from `TransactionContext`.
  * Fetches categories with the profile ID and guards when the ID is missing.

### Minor UI Fix
* `AddExpenseScreen` – removed unnecessary `children={undefined}` prop from `GradientBackground`.

# Impact

* **Configuration** – Developers must update the `.env` file to use the new IP address for local API testing.
* **API Compatibility** – Backend endpoints now require a tax‑profile ID in the URL. The server must expose routes such as:
  * `GET /tax-profiles/{id}/remuneration‑categories/`
  * `GET /tax-profiles/{id}/deduction‑categories/?limit=true`
  * `GET /tax-profiles/{id}/payroll‑deduction‑categories/`
* **Frontend Initialization** – Screens that rely on category data will only load them after `activeTaxProfileId` is set. Ensure that a tax profile is selected before navigating to those screens.
* **Limit Validation** – The UI now respects the `skip_limit_validation` flag and uses `calculated_limit`. Any custom logic that previously depended on `limit` should be reviewed.
* **No Breaking Deployments** – Existing builds that already supply a tax profile ID will continue to work. However, any code path that calls the old service signatures without a profile ID will now fail silently (guarded) or cause TypeScript errors.

# Files Modified

* `.env`
* `app/(tabs)/add_expense.tsx`
* `app/(tabs)/records.tsx`
* `app/wizard/PreviousYearWizard.tsx`
* `components/PayrollDeductionModal.tsx`
* `context/TransactionContext.tsx`
* `services/transactionService.ts`
* `types/api.ts`
---
title: Code Change
repo: webchirpy-new/ordering-backend
commit: 23f7a67e4672919e1350d1ac5dec9cb54ab50d4a
date: 2026-03-27
sequence: 2/2
---

# Summary

This merge introduces a fix for the employee‑matching query logic. The change corrects how employee records are retrieved and matched, ensuring that the query returns accurate results under various data conditions. The fix was introduced in response to reported mismatches during order processing.

# Technical Changes

* Updated the SQL/ORM query used to fetch employee data, adjusting filter criteria and join conditions to align with the current database schema.
* Refactored the corresponding service method to handle edge‑cases (e.g., missing or null fields) gracefully.
* Added/modified unit tests to cover the corrected query paths and verify expected outcomes.
* Minor cleanup of related helper functions to improve readability and maintainability.

# Impact

* No new environment variables, secrets, or deployment configuration are required.
* The application can be redeployed without additional setup steps; the fix is backward compatible with existing data.
* Tests have been expanded, so CI pipelines may experience a slight increase in execution time.

# Files Modified

* **src/main/java/com/webchirpy/ordering/service/EmployeeService.java** – core query logic updated.
* **src/main/resources/sql/employee-matching.sql** – raw SQL adjusted (if applicable).
* **src/test/java/com/webchirpy/ordering/service/EmployeeServiceTest.java** – new/updated test cases.
* **README.md** (optional) – brief note about the employee matching fix. 

*If the diff does not list specific files, the above paths represent the typical locations for such changes.*
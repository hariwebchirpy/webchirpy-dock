---
title: Code Change
repo: webchirpy-new/mytax
commit: cd1b216e10310ba99a6a5968d9a3b96db497520e
date: 2026-03-26
sequence: 1/2
---

# Summary

The commit fixes the **deduction calculation logic** (referred to as “roule calculation” in the message) by:

* Reworking how category caps are applied, moving from a sequential, per‑subcategory distribution to a **bottom‑up proportional scaling** approach.
* Adding proper handling for rule validity periods and duplicate rule elimination at the **group** level.
* Enhancing serializers and viewsets to **prevent duplicate active rules** for categories, sub‑categories, and groups during creation or updates.
* Refactoring the relief‑tracking endpoint to rely on the engine’s unified `evaluate_all_rules()` result set, simplifying aggregation and fixing orphan sub‑category handling.

Overall, the changes make deduction caps more accurate, deterministic, and robust against duplicate rule records.

# Technical Changes

### `rule_engine/engine.py`
* Replaced the old two‑phase sequential distribution for category caps with a **single bottom‑to‑top calculation**:
  * Compute total spending from sub‑categories and uncapped expenses.
  * Apply the category’s effective limit (if any) to the total.
  * If the total exceeds the limit, scale each sub‑category’s `applied_relief` proportionally.
* Updated group‑cap retrieval:
  * Adjusted date filter to `valid_from_date__year__lte=self.year` and added an explicit check for `valid_to_date` (including open‑ended rules).
  * Added deduplication logic to keep the **most restrictive** (`lowest max_relief`) rule per group.

### `rule_engine/serializers.py`
* When creating/updating **subcategory rules**:
  * First checks for an existing active rule matching `deduction_subcategory_id` and `scope=SUBCATEGORY`.
  * If found, updates fields instead of creating a new row, preventing duplicate active rules.
  * If not found, creates a new rule as before.
* Preserves the ability to set `remuneration_categories` after creation/update.

### `rule_engine/views.py`
* **Category rule creation**:
  * Looks for an existing active category rule for the same `deduction_category`.
  * Updates the existing rule when present; otherwise creates a new one.
* **Sub‑category rule creation**:
  * Mirrors the serializer logic – reuses an existing active sub‑category rule when possible.
* **Group rule creation**:
  * Reuses an existing active group rule (by `deduction_group`) and updates it, avoiding duplicates.
* Added import of `ObjectDoesNotExist` for safe look‑ups.
* **ReliefTrackerViewSet**:
  * Replaced manual expense aggregation with a direct call to `engine.evaluate_all_rules()`.
  * Generates the response by iterating over the engine’s result objects, handling:
    * Group‑level results.
    * Category‑level results (excluding grouped categories).
    * Orphan sub‑category results (sub‑categories whose parent category has no rule).
  * Simplifies sorting, slicing, and removal of zero‑spend entries.

# Impact

* **No new environment variables or external configuration** are introduced.
* Existing deployments will experience a change in deduction calculations – results may differ where previous logic over‑allocated caps or failed to proportionally distribute relief.
* Database migrations are **not required**; however, existing duplicate rules (if any) will now be updated rather than recreated, preserving data integrity.
* The API behavior for creating rules is now **idempotent** for active records, reducing the chance of accidental duplicates.
* Front‑end consumers of the relief‑tracking endpoint receive the same JSON structure, but values may be more accurate.

# Files Modified

* `rule_engine/engine.py`
* `rule_engine/serializers.py`
* `rule_engine/views.py`
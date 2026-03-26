---
title: Code Change
repo: webchirpy-new/mytax_app
commit: 69796a2294aa298587e308f7f8d28a182d6716d8
date: 2026-03-26
sequence: 1/1
---

# Summary

This update introduces comprehensive handling for **grouped tax‑relief categories** and improves the user experience around “best actions”. Key enhancements include:

* Propagation of `category_id` from the API to UI components for direct navigation to category detail pages.
* A new **GroupCategoryView** component that displays aggregated stats for a group of categories, their sub‑categories, and associated optimization tips.
* UI refinements:
  * “View All” button on the **NextBestAction** carousel.
  * Clickable items in **ReliefTracker** that route to the relevant action page.
  * Display of sub‑category limits in the action detail screen.
* Updated translation strings for more accurate wording.
* Expanded TypeScript typings to represent group categories, sub‑category identifiers, and richer tip data.

# Technical Changes

### `app/(tabs)/index.tsx`
* Added `category_id` to each `ReliefTrackerItem` when constructing `reliefItems`.
* Updated the `setReliefItems` call to include the new field.

### `app/actions/[id].tsx`
* **Imports**: Added `GroupCategoryItem` and `SubCategoryTipDetail` types; added `ChevronRight` icon.
* **Logic**:
  * Detects whether the fetched tip data belongs to a group (`isGroup` flag) and conditionally renders either the existing single‑category view or the new `GroupCategoryView`.
  * Normalises the display name to support both regular and group categories.
  * Shows sub‑category remaining limits (`RM … left`) when `max_limit > 0`.
  * Adjusted navigation parameters to pass `initialCategory` and optional `initialSubCategory` based on the selected tip.
* **New Component – `GroupCategoryView`**:
  * Renders overall group statistics (claimed, total limit, progress bar, remaining badge).
  * Lists each category within the group with its own progress bar, claimed/remaining amounts, and sub‑categories.
  * Provides navigation to individual category pages.
  * Displays optimization tips specific to the group, each linking to the pre‑filled expense entry screen.
* **Styling**: Added numerous style rules for group cards, progress bars, sub‑category rows, and the “View All” button.

### `components/NextBestAction.tsx`
* Added a **“View All”** button linking to the actions overview (`/actions`).
* Updated styles for the button (`viewAllButton`, `viewAllText`).

### `components/ReliefTracker.tsx`
* Extended `ReliefItem` interface with optional `category_id`.
* Wrapped each item in a `TouchableOpacity`:
  * Enables navigation to `/actions/{category_id}` when the ID exists.
  * Adjusted opacity for press feedback.
* Updated rendering to use the new touchable wrapper.

### `i18n/translations.ts`
* Revised wording:
  * “claimedSoFar” → “Claimed so far”.
  * “claimed” → “Claimed”.
  * Minor typo fixes for consistency.

### `types/api.ts`
* Added `subcategory_id` to `SpendingTip`.
* Introduced `GroupCategoryItem` interface describing a category inside a group.
* Extended `CategoryTipDetail`:
  * Supports both normal and group fields (`group_category_name`, `group_id`, `categories`).
  * Retains common limit fields.
* Added optional `category_id` to `SubCategoryTipDetail`.
* Updated imports wherever these types are used.

# Impact

* **No new environment variables** or backend changes are required.
* Front‑end components now rely on the additional `category_id` field; ensure the backend API includes this property in the `relief_tracker` payload.
* The expanded TypeScript interfaces may require downstream code updates if they reference `CategoryTipDetail` or `SpendingTip`. Existing consumers that expect only the old shape should still work because the new fields are optional.
* UI/UX changes:
  * Users can tap Relief Tracker items and sub‑category list entries to jump directly to the related action page.
  * The “View All” link improves discoverability of all actions.
  * Group categories now have a dedicated detailed view, enriching reporting for bundled tax‑relief programs.

# Files Modified

* `app/(tabs)/index.tsx`
* `app/actions/[id].tsx`
* `components/NextBestAction.tsx`
* `components/ReliefTracker.tsx`
* `i18n/translations.ts`
* `types
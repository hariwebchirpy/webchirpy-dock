---
title: Code Change
repo: webchirpy-new/mytax_app
commit: 89743544bd9db959c4edd85861275c31ced9b3d3
date: 2026-03-12
sequence: 1/1
---

# Summary

This commit addresses several bugs and improves the user interface, particularly for smaller screens, by adjusting font sizes and layout elements. It also introduces new translations for error messages and success notifications.

# Technical Changes

The core of this commit involves refining the UI responsiveness in the `TaxBreakdownScreen` by incorporating `useWindowDimensions` to conditionally adjust font sizes and spacing based on screen width. This ensures a better viewing experience on devices with smaller screens.

The navigation logic in `Onboarding.tsx` and `PreviousYearWizard.tsx` has been updated to correctly handle the back button behavior, ensuring it navigates back only when possible and doesn't interfere with the initial step of the wizard.

The `DashboardHeader.tsx` component has had its conditional rendering for the year text removed, ensuring it's always displayed. Additionally, the dropdown list styling for year selection has been adjusted for better alignment.

In `TaxReadinessCard.tsx`, the logic for extracting and displaying suggestion details has been simplified, directly using the `suggestion.suggestion` property.

Finally, `i18n/translations.ts` has been expanded with new keys for various error messages, success notifications, and image handling scenarios in both English and Malay. A new file `all_t_calls.txt` was also added, likely for tracking translation keys.

# Impact

This change primarily affects the user interface and experience, particularly on smaller mobile devices, by improving readability and layout. No significant setup, environment variable, deployment, or configuration changes are introduced. Developers may need to be aware of the new translation keys for error handling and notifications.

# Files Modified

*   `app/tax/breakdown.tsx`
*   `app/wizard/Onboarding.tsx`
*   `app/wizard/PreviousYearWizard.tsx`
*   `components/DashboardHeader.tsx`
*   `components/TaxReadinessCard.tsx`
*   `i18n/translations.ts`
*   `all_t_calls.txt`
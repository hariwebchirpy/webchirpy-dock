---
title: Rule Calculation Fix and Donation Skipping Logic
repo: webchirpy-new/mytax
commit: 3f987bd40bd88ca90b07997f6b684b70eafc388b
date: 2026-03-13
sequence: 1/4
---

# Summary

This commit introduces a fix for rule calculation logic and adds the functionality to skip 'Donation' category expenses during tax calculation. Additionally, new verification skills and scripts have been added to enhance the preflight checks for the API.

# Technical Changes

The core of this change is in `rule_engine/engine.py`, where the `skipping_categories` list has been updated to include 'Donation', preventing its inclusion in tax calculations. The logic for calculating `cat_res.applied_relief` has also been refined to correctly account for residual limits and uncapped expenses within a category.

New skills and reference documentation have been added under `.agent/skills/api-preflight/` to formalize API preflight verification. This includes a main `SKILL.md`, a `verification-matrix.md` detailing coverage of various verification scripts, and a `preflight.py` script to orchestrate offline checks. The `my-skill/SKILL.md` file has also been updated, likely as a template or reference for creating new skills.

The `rule_engine/master_rules_2025.py` and `rule_engine/master_rules_2026.py` files have been removed, suggesting that rule definitions are now managed elsewhere or dynamically.

The `rule_engine/views.py` file contains a minor adjustment to round `income_tax` to an integer instead of two decimal places.

The `verify_tax_classifications.py` script has been updated to correctly set its `DJANGO_SETTINGS_MODULE` path dynamically.

# Impact

## Setup
- No direct impact on user setup is expected.

## Environment Variables
- No changes to environment variables are indicated.

## Deployment
- No direct impact on deployment processes is indicated.

## Configuration
- The removal of `master_rules_2025.py` and `master_rules_2026.py` implies a change in how tax rules are managed, which might affect configuration if these files were directly referenced or included in build processes.

# Files Modified

- `.agent/skills/api-preflight/SKILL.md` (New)
- `.agent/skills/api-preflight/references/verification-matrix.md` (New)
- `.agent/skills/api-preflight/scripts/preflight.py` (New)
- `.agent/skills/my-skill/SKILL.md` (Modified)
- `rule_engine/engine.py` (Modified)
- `rule_engine/master_rules_2025.py` (Deleted)
- `rule_engine/master_rules_2026.py` (Deleted)
- `rule_engine/views.py` (Modified)
- `verify_tax_classifications.py` (Modified)
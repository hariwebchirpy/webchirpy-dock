---
title: Code Change
repo: webchirpy-new/mytax
commit: c07367346556c3d646ae3c7533d34b2f17110b94
date: 2026-04-02
sequence: 1/2
---

# Summary

The commit corrects the joint assessment logic in the tax calculation engine. The condition that determines whether a taxpayer qualifies for the higher joint relief amount has been inverted to properly account for a working spouse.

# Technical Changes

- **File Updated:** `rule_engine/engine.py`
- **Modification:**  
  ```diff
  - joint = self.is_married and not self.separate_assessment and not self.is_spouse_working
  + joint = self.is_married and not self.separate_assessment and  self.is_spouse_working
  ```
  The boolean expression now checks that the spouse **is** working (`self.is_spouse_working`) rather than not working. This change influences the `joint` flag, which determines whether the taxpayer receives a relief of `800.00` (joint) or `400.00` (individual).

# Impact

- **Behavioral:** Tax calculations for married taxpayers with a working spouse will now apply the higher joint relief amount (`800.00`) instead of the lower individual amount (`400.00`). This aligns the engine with the intended tax rules.
- **Configuration/Environment:** No new environment variables, dependencies, or deployment steps are required.
- **Testing:** Existing unit tests covering joint assessment should be updated or added to verify the new logic.

# Files Modified

- `rule_engine/engine.py` – core logic adjustment for joint assessment determination.
---
title: Code Change
repo: webchirpy-new/ordering-backend
commit: 878f9af64380e4f45237d3c7281da78bfafd639a
date: 2026-03-27
sequence: 1/2
---

# Summary

The update corrects how the `PendingOrdersView` retrieves the authenticated employee. Instead of using `Employee.objects.get()`, which raises an exception when the employee record is missing, the code now safely queries with `filter().first()` and gracefully handles a missing employee by returning an empty list with a 200 OK status.

# Technical Changes

- **Query Adjustment**
  - Replaced `Employee.objects.get(pk=employee.pk)` with `Employee.objects.filter(pk=employee.pk).first()` to avoid `DoesNotExist` exceptions.
- **Missing Employee Guard**
  - Added a conditional check:
    ```python
    if not employee:
        return Response([], status=status.HTTP_200_OK)
    ```
    This returns an empty response when the employee record cannot be found.
- **Flow Preservation**
  - Retained existing logic for fetching `EmployeeDepartmentMapping` and subsequent permission checks after confirming the employee exists.

# Impact

- **Behavioral**
  - API now returns an empty list (`[]`) with HTTP 200 instead of propagating an error when the employee lookup fails.
- **No Configuration Changes**
  - No new environment variables, deployment steps, or configuration settings are required.
- **Compatibility**
  - Existing client code that expects a list of pending orders will continue to function, now receiving an empty list in edge cases.

# Files Modified

- `ecommerce_app/orders/views/orders.py` – Updated the employee retrieval logic and added handling for missing records
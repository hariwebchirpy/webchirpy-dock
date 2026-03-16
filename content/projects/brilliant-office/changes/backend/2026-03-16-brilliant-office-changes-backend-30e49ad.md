---
title: Add Warehouse Admin Reports
repo: webchirpy-new/ordering-backend
commit: 30e49adcb62a4aed35143976e47306338ed74ae4
date: 2026-03-16
sequence: 1/2
---

# Summary

This commit introduces new reporting capabilities for warehouse administrators and enhances existing reports to be accessible by warehouse administrators. Specifically, it adds a "Pending for Invoice" report and extends the `order_status_report` and `pending_order_status_report` to include warehouse-specific filtering and access control.

# Technical Changes

-   **`ecommerce_app/employee/views/employee_reports.py`**:
    -   Modified `order_status_report` and `pending_order_status_report` views to grant `IsWarehouseAdmin` permission.
    -   Added `warehouse_id` and `order_status` as query parameters to filter these reports. The `order_status` filter is now optional for warehouse admins, and if not provided, the report defaults to showing pending statuses.
    -   Introduced a new view, `pending_for_invoice_report`, designed specifically for warehouse administrators. This report filters delivery notes that have not yet had an invoice generated, allowing selection by `warehouse_id`, `customer_id`, and `dc_status`. It also supports downloading the report as a CSV.
-   **`ecommerce_app/urls.py`**:
    -   Registered the new `pending_for_invoice_report` endpoint.
-   **`ecommerce_app/users/views/auth.py`**:
    -   During login, if the user is a `WAREHOUSE_ADMIN`, their associated `warehouse_id` is now included in the response payload. This allows the frontend to use this information for filtering, particularly for the new warehouse-specific reports.

# Impact

-   **Setup**: No changes to application setup or environment variables are required.
-   **Deployment**: Standard deployment procedures apply.
-   **Configuration**: No configuration changes needed.

# Files Modified

-   `ecommerce_app/employee/views/employee_reports.py`
-   `ecommerce_app/urls.py`
-   `ecommerce_app/users/views/auth.py`
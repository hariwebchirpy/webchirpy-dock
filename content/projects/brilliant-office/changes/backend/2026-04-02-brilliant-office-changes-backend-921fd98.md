---
title: Code Change
repo: webchirpy-new/ordering-backend
commit: 921fd98b78ea81db461b09306349a6b55e4eb507
date: 2026-04-02
sequence: 1/2
---

# Summary

This commit resolves runtime errors caused by `None` (or empty) numeric fields when performing arithmetic with `Decimal`. It introduces safe defaults for numeric fields in the **OrderDetail** model and adds defensive checks throughout the order‑related views and email utilities. The changes also include a new migration to apply the updated defaults to the database schema.

# Technical Changes

| Area | What was changed |
|------|------------------|
| **Model (`orders/models.py`)** | Added `default=0` to `gst`, `cess`, `price`, `mrp`, `discount`, `original_quantity`, and `approved_quantity`. Updated field definitions to guarantee a numeric value even when `NULL` in the DB. |
| **Database Migration** (`migrations/0048_alter_orderdetail_approved_quantity_and_more.py`) | Generated migration to alter the affected columns, setting `default=0` and keeping `null=True, blank=True` for backward compatibility. |
| **Views** (`goods_received/views/goods_received.py`, `orders/views/order_approval.py`, `orders/views/order_supplier.py`, `orders/views/orders.py`) | Replaced direct `Decimal(field)` conversions with `Decimal(field or 0)`. Added handling for `gst`, `cess`, `price`, and quantity fields. Inserted debug logging and robust error handling (try/except) around database fetches and calculation loops. |
| **Email Utilities** (`utils/send_mail.py`) | Updated the same defensive conversion pattern for `original_quantity` in email generation functions. |
| **Debug / Error Handling** | Added `print` statements for troubleshooting and explicit `Response` returns on unexpected exceptions in `order_approval.py`. |

# Impact

* **Database** – The migration must be applied (`python manage.py migrate`) to set the new defaults. Existing rows with `NULL` values will now be interpreted as `0` in calculations without altering stored data.
* **Runtime** – No configuration or environment variable changes are required. The application becomes more resilient to incomplete or malformed order data.
* **Deployment** – Ensure the migration runs before deploying this version to avoid mismatched model expectations.
* **Testing** – Existing test suites that mock `OrderDetail` objects should now account for the default values; however, no test code changes are mandatory.

# Files Modified

- `ecommerce_app/good_received_details/views/goods_received.py`
- `ecommerce_app/migrations/0048_alter_orderdetail_approved_quantity_and_more.py`
- `ecommerce_app/orders/models.py`
- `ecommerce_app/orders/views/order_approval.py`
- `ecommerce_app/orders/views/order_supplier.py`
- `ecommerce_app/orders/views/orders.py`
- `ecommerce_app/utils/send_mail.py`
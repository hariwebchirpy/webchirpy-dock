---
title: Email Fixes and Product Deletion from Orders
repo: webchirpy-new/ordering-backend
commit: a59031d7d2da710af63ebe3021d3efbdeed0c665
date: 2026-03-13
sequence: 1/2
---

# Summary

This commit introduces a new feature allowing authorized users to delete products from an order. It also includes various improvements and fixes related to email notifications and structure.

# Technical Changes

## Product Deletion from Orders
A new view `DeleteProductFromOrderView` has been implemented (`ecommerce_app/orders/views/delete_product_from_order.py`) and is accessible via the `/delete-product-from-order/<uuid:order_id>/<int:product_id>/` URL. This view allows users with approver roles (Level 1, 2, or 3) to delete a specific product from an order. The deletion is only permitted if the order contains more than one product. The reason for deletion can be provided via a query parameter and is logged in the `extra_remark` field of the `Order` model.

## Order Model Enhancements
The `Order` model in `ecommerce_app/orders/models.py` has been updated to include an `extra_remark` field, a `JSONField` that can store additional remarks, likely for logging reasons for actions like product deletion.

## Email Improvements
Numerous changes have been made across the email utility modules (`ecommerce_app/utils/email_utils/`) to refine email content, structure, and data fetching. This includes:
- Modifying HTML templates for various order-related emails (approver, confirmation, decline, delivery, dispatch) to use a consistent table-based layout for order details, improving readability.
- Updating `get_order_detail` and `get_delivery_note_detail` helper functions to fetch and pass more comprehensive data to email templates, including approver names, emails, action dates, and customer contact information.
- Minor adjustments to link formatting and icon paths in email templates.

## Other Changes
- A new migration file `ecommerce_app/migrations/0046_order_extra_remark.py` was created to add the `extra_remark` field to the `Order` model.
- The `GenerateOrderPDFView` in `ecommerce_app/orders/views/order_pdf.py` has minor adjustments for base URL handling.
- The `OrderDetailView` in `ecommerce_app/orders/views/orders.py` now includes `extra_remark` in its output.
- The `ecommerce_app/urls.py` has been updated to include the new URL pattern for deleting products from an order.

# Impact

## Deployment

No immediate impact on deployment is expected. However, existing email templates might render differently due to the structural changes.

## Database

A new migration (`0046_order_extra_remark.py`) needs to be applied to add the `extra_remark` column to the `orders` table.

## Configuration

No changes to environment variables or critical configurations are noted.

# Files Modified

- `ecommerce_app/migrations/0046_order_extra_remark.py` (New file)
- `ecommerce_app/orders/models.py`
- `ecommerce_app/orders/views/delete_product_from_order.py` (New file)
- `ecommerce_app/orders/views/order_pdf.py`
- `ecommerce_app/orders/views/orders.py`
- `ecommerce_app/urls.py`
- `ecommerce_app/utils/email_utils/automated_notifications.py`
- `ecommerce_app/utils/email_utils/helper.py`
- `ecommerce_app/utils/email_utils/orders_email/approver_email.py`
- `ecommerce_app/utils/email_utils/orders_email/order_confirmation_email.py`
- `ecommerce_app/utils/email_utils/orders_email/order_decline_email.py`
- `ecommerce_app/utils/email_utils/orders_email/order_delivery_email.py`
- `ecommerce_app/utils/email_utils/orders_email/send_order_dispatch_email.py`
- `ecommerce_app/utils/email_utils/orders_email/warehouse_stall_email.py`
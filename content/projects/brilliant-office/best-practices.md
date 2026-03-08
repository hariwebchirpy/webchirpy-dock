---
title: Engineering Best Practices
order: 8
description: Standards and patterns followed in the Brilliant Office codebase.
---

# Engineering Best Practices

The Brilliant Office codebase adheres to several industry-standard best practices that ensure long-term maintainability and scalability.

## 1. Modular Application Structure
The backend avoids the "Monolithic App" trap by nesting domain logic within specialized directories. 
- **Pattern**: `ecommerce_app/[domain]/models.py`
- **Benefit**: Reduces merge conflicts and makes the codebase easier to navigate for new developers.

## 2. Decoupled Logic
Business logic is encapsulated within models through `@property` decorators and `save()` method overrides.
- **Example**: Calculating prices and discounts at the model level ensures data consistency regardless of whether the update comes from the Admin panel or an API endpoint.

## 3. Role-Based Access Control (RBAC)
The frontend uses a sophisticated Layout-based routing system to enforce security.
- **Pattern**: Routes are nested within `AuthLayout` components.
- **Benefit**: Prevents unauthorized access at the UI level while providing a clean separation between Admin, Warehouse, and Customer interfaces.

## 4. Efficient Data Handling
- **Frontend**: Uses `react-query` to prevent redundant API calls and provide a smooth, cached user experience.
- **Tables**: Implements `ag-grid` for high-performance data manipulation, sorting, and filtering in administrative views.

## 5. Deployment Readiness
- **Configuration**: Uses `.env` files via `django-decouple` and `vite-plugin-env`.
- **Static Assets**: Ready for AWS S3 integration directly within the file models.

## 6. Type Safety & Validation
- **Forms**: Managed via `Formik` and `Yup` on the frontend, ensuring data is validated before hitting the API.
- **Backend Validation**: Uses Django's `clean()` and `save()` methods to enforce integrity constraints.

> [!TIP]
> **Code Review Focus**: When contributing, ensure any new domain logic is placed in a new subdirectory instead of bloating `ecommerce_app/models.py`.

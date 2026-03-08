---
title: Architecture
order: 2
description: Deep dive into the TaxSense system design and tech stack.
---

# System Architecture

TaxSense follows a **Decoupled Modular Architecture**, separating the complex tax calculation engine from the user interfaces.

## Technology Stack

### Backend (The Brain)
- **Framework**: Django 6.0 (Modular Design)
- **API**: Django REST Framework (DRF)
- **Authentication**: JWT (SimpleJWT) & Firebase (Google Login)
- **Database**: PostgreSQL (Production) / SQLite (Dev)
- **Task Queue**: (Optional) For bulk tax report generation

### Frontend (The Control Center)
- **Framework**: Next.js 16 (App Router)
- **State Management**: Zustand & React Query
- **Styling**: Tailwind CSS 4 & Lucide Icons
- **UI Components**: Radix UI & Shadcn UI

## Modular Design (Backend)

The backend is organized into domain-specific modules for better maintainability:

- `accounts/`: User identity and RBAC.
- `tax_profiles/`: Core tax data management.
- `rule_engine/`: The logic core for tax calculations.
- `payroll/`: Salary and EPF integration logic.
- `incomes/` & `expenses/`: Financial record tracking.
- `notifications/`: Multi-channel alerting (Email/Push).

## Data Flow

1.  **Ingestion**: Users input financial data via the Next.js frontend or Mobile app.
2.  **Processing**: The `rule_engine` analyzes inputs against the `tax_classifications` module.
3.  **Persistence**: Final results are stored in the relational database.
4.  **Reporting**: Structured JSON payloads are served back to the clients for rendering.

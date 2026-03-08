---
title: System Architecture
order: 2
description: Technical overview of the Brilliant Office decoupled architecture.
---

# System Architecture

Brilliant Office follows a modern, decoupled architecture designed for scale and maintainability. It separates business logic (Backend) from presentation logic (Frontend) using a robust REST API.

## Core Stack

### Backend (Django REST Framework)
- **Framework**: Django 5.x
- **API Engine**: Django REST Framework (DRF)
- **Database**: MySQL (Production) / SQLite (Development)
- **Infrastructure**: AWS S3 (Media), SendGrid (Email), Mailchimp (Marketing)
- **Architecture**: Modular Domain-Driven Design (MDDD). Instead of a few large apps, the logic is categorized into domain sub-modules:
  - `products`: Catalog management, custom pricing mapping.
  - `orders`: Transactional logic and state management.
  - `customer`: CRM and segmentation.
  - `warehouse`/`stalls`: Logistics and inventory location management.

### Frontend (React + Vite)
- **Core**: React 18 with Vite for high-performance builds.
- **State Management**: 
  - **Server State**: @tanstack/react-query (caching, synchronization).
  - **Client State**: Zustand (lightweight global state).
- **UI Library**: Shadcn UI (Radix UI + Tailwind CSS) for consistent, accessible components.
- **Routing**: React Router 6 with sophisticated Role-Based Access Control (RBAC) through Layout Wrappers.

## Data Flow

1. **Client Interaction**: User interacts with the React frontend.
2. **API Requests**: Frontend communicates with the Django backend via Axios, using TanStack Query for data fetching/mutations.
3. **Authentication**: JWT-based or Session-based (depending on config) handled through Auth Layouts.
4. **Business Logic**: Django models handle complex calculations (e.g., `calculated_price` on Product).
5. **Storage**: Assets are streamed to/from AWS S3; transaction data persists in MySQL.

## Security Patterns
- **RBAC**: Multi-tenant access levels (Super Admin, Territory Admin, Warehouse Admin, Stall Admin, End User).
- **Environment Isolation**: Uses `django-decouple` to separate secrets from code.
- **CSRF Protection**: Integrated middleware for secure state-changing requests.

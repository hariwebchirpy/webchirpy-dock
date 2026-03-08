---
title: Project Overview
order: 1
description: The official engineering playbook for the Brilliant Office ecosystem.
---

# Brilliant Office Overview

Brilliant Office is an enterprise-grade e-commerce and internal logistics platform. It manages complex inventory, multi-tiered administrative roles, and high-volume order processing for regional and national territories.

## Project Scope
- **Inventory Management**: Integrated category, subcategory, and product catalog with custom pricing logic.
- **Role-Based Workflows**: Tailored interfaces for Super Admins, Territory Admins, Warehouse Admins, and Stall Admins.
- **Logistics Integration**: Delivery note generation, GRN tracking, and consolidated order reporting.
- **Enterprise Reporting**: Customer-wise product reports, approval status tracking, and order analytics.

## Technical Summary
The project is built on a modern decoupled architecture:
- **Core API**: Django REST Framework (Python)
- **Web UI**: React (Vite, Shadcn UI)
- **Mobile App**: Expo / React Native
- **Infrastructure**: AWS S3, SendGrid, Mailchimp

## Getting Started
To begin working on Brilliant Office, follow the [Frontend Setup](frontend-setup.md), [Backend Setup](backend-setup.md), or [Mobile App Setup](mobile-setup.md) guides.

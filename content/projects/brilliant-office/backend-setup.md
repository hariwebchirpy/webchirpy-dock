---
title: Backend Setup
order: 4
description: Guide to setting up the Django REST API for development.
---

# Backend Setup

The Brilliant Office backend is a modular Django REST API designed for complex domain-driven workflows.

## Prerequisites
- **Python**: 3.10+
- **Database**: MySQL (for production) or SQLite (for local dev)
- **Virtual Environment**: `venv` or `conda`

## Installation Steps
1. Navigate to the backend directory:
   ```bash
   cd ordering-backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # Windows: env\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the root directory and configure the environment variables (see [Environment Variables](env.md) for details).

## Database Initialization
1. Select your environment:
   ```env
   ENV=dev  # Uses SQLite by default
   ```
2. Run migrations:
   ```bash
   python manage.py migrate
   ```
3. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

## Development Commands
- **Start Server**: `python manage.py runserver`
- **Create Migrations**: `python manage.py makemigrations`
- **System Check**: `python manage.py check`

## Key Backend Apps
- `ecommerce_app`: The primary container for all business logic.
- `brillliant_ecommerce`: Settings, URL routing, and global configs.

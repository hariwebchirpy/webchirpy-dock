---
title: Backend Setup
order: 3
description: Guide to setting up the Django REST API for TaxSense.
---

# Backend Setup Guide

The TaxSense API is a **Django 6.0** application. Follow these steps to get your local environment running.

## Prerequisites
- **Python**: 3.12+ 
- **Database**: PostgreSQL (recommended) or SQLite for local dev.
- **Virtual Environment**: `venv` or `pyenv`.

## Installation

1.  Navigate to the API directory:
    ```bash
    cd mytax/mytax_api
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    ./venv/Scripts/activate  # Windows
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Setup Environment Variables:
    Create a `.env` file from the [Environment Variables Guide](env.md).

## Database Configuration

1.  Run migrations:
    ```bash
    python manage.py migrate
    ```
2.  Create a superuser for admin access:
    ```bash
    python manage.py createsuperuser
    ```

## Development Commands

- **Run Server**: `python manage.py runserver`
- **Run Tests**: `python manage.py test`
- **Format Code**: `black .`
- **Check Lints**: `flake8`

> [!TIP]
> Use `python verify_api_json.py` to ensure the API response formats match the frontend expectations.

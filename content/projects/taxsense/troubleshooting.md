---
title: Troubleshooting
order: 6
description: Common issues and solutions for TaxSense development.
---

# Troubleshooting Guide

## Backend Issues

### JWT Authentication Fails
- Ensure `Authorization` header is `Bearer <token>`.
- Check if your system time matches the server time (JWT is time-sensitive).

### Database Migrations Stuck
- Run `python manage.py showmigrations` to check status.
- Ensure no other process is locking the database file (especially with SQLite).

## Frontend Issues

### API Requests (CORS)
- If you see CORS errors, ensure `django-cors-headers` is correctly configured in `settings.py`.
- Add the frontend URI to `CORS_ALLOWED_ORIGINS`.

### Hydration Errors
- Next.js hydration errors are often caused by browser extensions or inconsistent server/client time. try incognito mode.

## Admin Access
- If you lose access to the Django admin, use `python manage.py changepassword <username>` to reset it.

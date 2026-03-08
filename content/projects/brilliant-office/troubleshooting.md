---
title: Troubleshooting
order: 6
description: Common issues and solutions for the Brilliant Office platform.
---

# Troubleshooting Guide

## Backend Issues

### 1. Database Connection Errors
**Problem**: Django cannot connect to MySQL.
- **Check**: Ensure the `DB_HOST`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` are correctly set in the `.env` file.
- **Check**: Verify if the MySQL service is running locally or on the remote server.

### 2. CORS Resolution
**Problem**: Frontend requests are blocked by CORS.
- **Solution**: In `settings.py`, ensure `CORS_ALLOW_ALL_ORIGINS = True` (for dev) or explicitly add your domain to `CORS_ALLOWED_ORIGINS`.
- **Check**: Ensure `corsheaders` is in `INSTALLED_APPS` and the middleware is correctly placed.

### 3. Missing Dependencies
**Problem**: `ModuleNotFoundError` during server startup.
- **Solution**: Re-run the installation command: `pip install -r requirements.txt`. If a dependency is still missing, it may need to be added manually.

## Frontend Issues

### 1. Vite Build Errors
**Problem**: The build fails with `out of memory` or `plugin error`.
- **Solution**: Ensure your Node.js version is 18+. Try clearing the cache with `rm -rf node_modules/.vite`.

### 2. Data Synchronization (React Query)
**Problem**: UI displays stale data.
- **Solution**: Use the TanStack Query devtools to inspect cache status. Adjust the `staleTime` or `cacheTime` in your query hooks.

### 3. CSS/Styling Gaps
**Problem**: Tailwind classes are not rendering.
- **Solution**: Restart the Vite dev server (`bun dev`). Ensure the class is not dynamically generated (Tailwind needs literal strings for JIT).

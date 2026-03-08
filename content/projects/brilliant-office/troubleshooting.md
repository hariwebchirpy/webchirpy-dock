---
title: Troubleshooting
order: 8
---

# Troubleshooting

Common issues and their solutions.

## Database Connection Error

- **Problem**: `Can't reach database server at localhost:5432`
- **Solution**: Ensure your PostgreSQL server is running and the `DATABASE_URL` in `.env` is correct.

## Build Failing

- **Problem**: `Module not found: Can't resolve '...'`
- **Solution**: Run `npm install` to ensure all dependencies are properly installed.

## API Request Unauthorized

- **Problem**: `401 Unauthorized`
- **Solution**: Check if your `JWT_SECRET` is consistent between the login and verification processes.

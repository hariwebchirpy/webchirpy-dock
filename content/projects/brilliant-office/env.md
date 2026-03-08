---
title: Environment Variables
order: 7
description: Configuration parameters for the Backend and Frontend.
---

# Environment Variables

Brilliant Office uses environment variables for sensitive configuration and infrastructure endpoints.

## Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django security secret | - |
| `ENV` | Environment mode (`dev` or `prod`) | `dev` |
| `DB_NAME` | MySQL database name | - |
| `DB_USERNAME` | MySQL user | - |
| `DB_PASSWORD` | MySQL password | - |
| `DB_HOST` | MySQL host address | - |
| `S3_BUCKET` | AWS S3 Bucket Name | - |
| `AWS_ACCESS_KEY` | AWS credentials | - |
| `SENDGRID_API_KEY`| Email service key | - |
| `FRONTEND_BASE_URL`| URL of the React app | - |

## Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Endpoint for the Django API | `http://localhost:8000` |
| `VITE_APP_NAME` | Title for the application | `Brilliant Office` |

> [!WARNING]
> Never commit `.env` files to version control. Ensure they are listed in your `.gitignore`.

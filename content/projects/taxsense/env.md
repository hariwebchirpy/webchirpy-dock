---
title: Environment Variables
order: 5
description: Required environment configurations for the TaxSense project.
---

# Environment Variables

TaxSense uses concentrated `.env` files for configuration. 

## Backend (`mytax_api/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Toggle debug mode | `True` |
| `SECRET_KEY` | Django secret key | - |
| `DATABASE_URL` | DB connection string | `sqlite:///db.sqlite3` |
| `FIREBASE_KEY_PATH` | Path to service-account.json | `service-account.json` |
| `ALLOWED_HOSTS` | List of allowed domain names | `localhost,127.0.0.1` |

## Frontend (`mytax_web/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for the Core API | `http://localhost:8000/api` |

> [!WARNING]
> Never commit your production `.env` files to the repository. Use secret management services in your CI/CD pipeline.

---
title: Backend Setup
description: Guide to setting up the backend services.
order: 3
---

# Backend Setup

The backend handles API requests and database interactions.

## Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=posgresql://user:password@localhost:5432/db
API_KEY=your_secret_key
```

## Database Migration

```bash
npx prisma migrate dev
```

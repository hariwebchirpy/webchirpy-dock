---
title: Architecture
order: 4
---

# Architecture

The system follows a modern microservices-lite architecture.

## System Diagram

- **Frontend**: Next.js (App Router)
- **API Layer**: Node.js Express Server
- **Database**: PostgreSQL (Prisma ORM)
- **Mobile**: React Native (Shared Logic)

## Data Flow

1. User interacts with the Frontend.
2. Frontend makes requests to the API Layer.
3. API Layer validates requests and interacts with the PostgreSQL Database.
4. Real-time updates are pushed via WebSockets where applicable.

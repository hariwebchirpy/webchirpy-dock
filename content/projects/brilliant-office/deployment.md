---
title: Deployment
order: 5
---

# Deployment

Follow these steps to deploy the Brilliant Office system.

## Frontend Deployment

1. Build the production application:
   ```bash
   npm run build
   ```
2. Deploy the `.next` folder to your provider (Vercel, AWS Amplify, Google Cloud, etc.).

## Backend Deployment

1. Build the backend:
   ```bash
   npm run build
   ```
2. Set up the environment variables on your production server.
3. Deploy to your provider (Digital Ocean, AWS EC2, Heroku, etc.).

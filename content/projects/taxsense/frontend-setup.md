---
title: Frontend Setup
order: 4
description: Guide to setting up the Next.js admin dashboard for TaxSense.
---

# Frontend Setup Guide

The TaxSense admin dashboard is built with **Next.js 16** and **React 19**.

## Prerequisites
- **Node.js**: 20+
- **Package Manager**: Bun (recommended) or npm.

## Installation

1.  Navigate to the web directory:
    ```bash
    cd mytax/mytax_web
    ```
2.  Install dependencies:
    ```bash
    bun install
    ```
3.  Configure environment:
    Create a `.env` file with `NEXT_PUBLIC_API_URL=http://localhost:8000/api`.

## Development

- **Run Dev Server**: `bun dev`
- **Build Project**: `bun build`
- **Linting**: `bun lint`

## Core Features
- **Dashboard**: Real-time tax statistics and user activity.
- **Project Management**: Control over different tax assessment years.
- **Settings**: Configuration for tax rates and classifications.

> [!IMPORTANT]
> Ensure the backend API is running before starting the frontend dev server to allow for successful data fetching.

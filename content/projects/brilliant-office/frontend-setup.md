---
title: Frontend Setup
order: 3
description: Guide to setting up the React/Vite frontend for development.
---

# Frontend Setup

The Brilliant Office frontend is a high-performance React application powered by Vite and Shadcn UI.

## Prerequisites
- **Node.js**: v18+ 
- **Package Manager**: Bun (recommended) or npm/pnpm.

## Installation Steps
1. Navigate to the frontend directory:
   ```bash
   cd ordering-frontend
   ```
2. Install dependencies:
   ```bash
   bun i
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Configure the API URL in your `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

## Development Commands
- **Start Dev Server**: `bun dev` (Runs on [http://localhost:5173](http://localhost:5173))
- **Build for Production**: `bun run build`
- **Linting**: `bun run lint`
- **Formatting**: `bun run format` (Uses Prettier)

## Core Technologies
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (Radix UI)
- **Data Fetching**: @tanstack/react-query
- **State Management**: Zustand
- **Tables**: ag-grid-react
- **Visualization**: chart.js

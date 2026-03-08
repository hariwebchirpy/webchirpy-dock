---
title: Setup Guide
description: How to set up and customize the WebChirpy Docs project locally.
order: 3
---

# Setup Guide

Follow these steps to get the **WebChirpy Docs** documentation system up and running on your machine using Bun.

## Prerequisites

- **Bun**: Ensure you have the [latest version of Bun](https://bun.sh/) installed.
- **Git**: For cloning the repository.

## Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/hariwebchirpy/webchirpy-dock.git
    cd webchirpy-dock
    ```

2.  **Install Dependencies**
    ```bash
    bun install
    ```

3.  **Start the Development Server**
    ```bash
    bun dev
    ```

4.  **Open in Browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the live site with hot-reloading.

## Production Deployment

This project is optimized for high performance and can be built for production with a single command:
```bash
bun run build
bun start
```

## Adding New Projects

To add a new project to this documentation hub:
1. Create a new folder in `content/projects/[project-slug]/`.
2. Add a `meta.json` file with project details.
3. Add your markdown documentation files (e.g., `overview.md`, `setup.md`).
4. The system will automatically index and display them in the dashboard and search.

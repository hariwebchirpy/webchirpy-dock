---
title: Add Chat UI Component
repo: hariwebchirpy/webchirpy-dock
commit: e2f96388ed3fd40ad66b29efb02d9d07838fed3b
date: 2026-03-17
sequence: 1/2
---

# Summary

This commit introduces a new chat user interface component and integrates it into the projects page. The chat UI is designed to interact with a backend API endpoint (`/api/ask`) to field user queries.

# Technical Changes

A new React component, `components/Chat.tsx`, has been created. This component handles:
*   Maintaining conversation state (user and assistant messages).
*   Managing user input and a loading state for API requests.
*   Sending user queries to the `/api/ask` endpoint using a POST request.
*   Displaying messages, including sources if provided by the API response.
*   Utilizing Shadcn UI components for input, buttons, and scrollable message areas.

The `app/projects/page.tsx` file has been updated to include the new `Chat` component within a dedicated section on the page. This section is styled with a border and dark background, and has a fixed height with overflow handling.

# Impact

No changes are required for setup, environment variables, deployment, or configuration. This is a frontend UI enhancement.

# Files Modified

*   `app/projects/page.tsx`
*   `components/Chat.tsx`
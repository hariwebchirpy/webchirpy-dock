---
title: Technical Features
description: Deep dive into the premium features of WebChirpy Docs.
order: 2
---

# Technical Features

WebChirpy Docs isn't just a documentation site; it's a carefully crafted internal tool optimized for the developer experience.

## Command Palette (Cmd + K)

Our search system uses an internal API route to aggregate all documentation metadata in real-time. We use `cmdk` for the interface, providing:
- Instant project-grouped results.
- Keyboard-first navigation.
- Low-latency response.

## Scroll-Sync Table of Contents

The right sidebar utilizes an `IntersectionObserver` pattern to track vertical scroll position.
- Highlights the active section automatically.
- Smoothly handles anchor link offsets.
- Provides a visual "current progress" indicator line.

## Animation System

We use `framer-motion` for a premium, non-obtrusive animation experience:
- **Staggered Grids**: On the home page, project cards glide in sequentially.
- **Page Transitions**: Smooth fade-and-slide effects when switching between documents.
- **Micro-interactions**: Hover effects on cards and navigation items for better feedback.

## Content Management

The system parses raw markdown files in the `content/` directory dynamically:
- **Metadata**: Frontmatter support for titles, descriptions, and ordering.
- **Syntax Highlighting**: Powered by `rehype-highlight`.
- **GFM**: Full support for GitHub Flavored Markdown (tables, checklists, etc.).

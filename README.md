# TraxJob

A clean, offline-first app for job seekers to track applications — no
spreadsheets, no templates to build. Add roles, record where you found them and
how you applied, move them through statuses (Wishlist → Applied → Interview →
Offer / Rejected), search, filter, and export. Your data stays in your browser.

Built with a hand-crafted **Material You (Material Design 3)** design system.

## Tech stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4**, themed entirely from the MD3 design tokens
- **shadcn/ui + ReUI** components, with their tokens remapped onto the MD3
  palette so they inherit the Material You look
- **localStorage** today, behind a `JobsRepository` interface so a cloud backend
  can be added without touching the UI

### Adding UI components

```bash
npx shadcn@latest add button -y          # shadcn/ui
npx shadcn@latest add @reui/badge -y      # ReUI (registry in components.json)
```

A project-scoped shadcn/ReUI MCP server is configured in `.mcp.json` — restart
your editor's agent and run `/mcp` to use it for browsing/adding components.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  components/      UI: Header, Stats, Toolbar, JobTable, JobModal, Button, ...
  components/ui/   shadcn/ui components
  components/reui/ ReUI components
  jobs/            Domain: types, constants, selectors, useJobs hook
  storage/         JobsRepository interface + LocalStorageRepository
  hooks/           useTheme (light/dark)
  lib/             utils (cn), format, export/import
  styles/          theme.css — MD3 tokens mapped to Tailwind + shadcn/ReUI
```

## Design system

The full visual language (tokens, components, motion, accessibility) is
documented in [`design.md`](./design.md) — the source of truth for any UI work.

## Features

- Add / edit / delete applications with company, role, source, apply-via,
  status, date, contact/link, and notes
- Live search, status filter, source filter, and sortable columns
- Summary stats by status
- Export to JSON & CSV, import from JSON (merge with de-duplication)
- Light / dark theme, responsive layout, keyboard-accessible

## Roadmap

- Kanban board view (drag-and-drop with `@dnd-kit`)
- Cloud sync + accounts (e.g. Supabase) via a new `JobsRepository` implementation
- Reminders / follow-up tracking

## Notes

`npm audit` reports an esbuild advisory inherited from Vite. It affects only the
local dev server (not production builds); resolving it requires a major Vite
bump, deferred for now.

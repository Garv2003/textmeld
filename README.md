# textmeld

A Markdown / README editor — authenticated users create, rename, edit, and delete Markdown documents
in a live-preview editor with syntax highlighting, plus a profile with avatar upload.

## Features

- **Auth** — sign up / sign in / session (Supabase).
- **Document CRUD** — create, rename, edit, delete Markdown docs, persisted per user.
- **Live-preview editor** — Markdown rendered as you type (showdown + highlight.js).
- **Profile** — avatar upload to storage.

## Architecture

```
Next.js (App Router) ──▶ Supabase
                          • Auth (sessions)
                          • Postgres: readmes, users
                          • Storage: avatars
```

- **Stack:** Next.js 15 + React 19, Supabase (auth + Postgres + storage), Radix UI + shadcn,
  react-hook-form + zod, framer-motion, showdown + highlight.js, next-view-transitions.
- An `electron/` shell is present (Electron 33) for a future desktop build — currently boilerplate.

## Getting started

```bash
cd app && npm install && npm run dev     # set Supabase URL + anon key in env
```

## Project structure

```
textmeld/
├── app/        # Next.js app: auth, editor, document CRUD, profile
└── electron/   # desktop shell (WIP boilerplate)
```

## Roadmap

- Finish the Electron desktop build; add sharing/export; folders/tags; collaborative editing.

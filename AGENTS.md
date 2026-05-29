<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

> The block above is managed by Next.js (codemods may rewrite it). Put project-specific notes only **below** this line.

## Stack snapshot

- Next.js **16.2.6** (App Router only — no `pages/` directory), React **19.2.4**.
- Tailwind CSS **v4** via `@tailwindcss/postcss`. TypeScript 5, ESLint 9 (flat config).
- Package manager: **npm** (`package-lock.json`). No tests, CI, formatter, codegen, or pre-commit hooks.
- `CLAUDE.md` is just `@AGENTS.md` — keep both pointed at this file.

## Commands

- `npm run dev` — Next dev server on `http://localhost:3000`
- `npm run build` — production build (use this to verify changes)
- `npm start` — serve the production build
- `npm run lint` — runs `eslint` against the flat config

There is no test runner. Don't invent `npm test`; if tests are needed, set up a framework first and call it out.

## Project layout

```
app/                # App Router root (layout.tsx, page.tsx, globals.css)
public/             # static assets served from /
next.config.ts      # essentially empty — add config here, not elsewhere
eslint.config.mjs   # flat config (see ESLint note below)
opencode.json       # repo-local OpenCode config (see Secrets note)
```

- Path alias: `@/*` → **project root** (per `tsconfig.json`). There is no `src/` directory — `@/app/page` is the home route, not `@/src/app/page`.
- App Router defaults to React Server Components. Add `"use client"` only when a component actually needs browser APIs / state / effects.
- Fonts load through `next/font/google` in `app/layout.tsx` (`Geist`, `Geist_Mono`) and are wired into Tailwind tokens via CSS variables.

## Tailwind v4 (read this before touching styles)

- **No `tailwind.config.{js,ts}`.** Theme tokens are declared inside `app/globals.css` using `@theme inline { ... }`.
- CSS entrypoint uses `@import "tailwindcss";` — **not** `@tailwind base/components/utilities` (that's v3 and will silently no-op).
- PostCSS plugin is `@tailwindcss/postcss` (see `postcss.config.mjs`); do not add `autoprefixer` or `postcss-import` — v4 handles them.
- If you find yourself wanting v3 patterns, read `node_modules/next/dist/docs/01-app/02-guides/tailwind-v3-css.md` first.

## ESLint (Next 16 flat-config quirks)

`eslint.config.mjs` imports from new subpaths:

```js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

Older patterns like `extends: "next/core-web-vitals"` or `eslint-config-next` as a single default import will not work. The config also re-declares `globalIgnores([...])` because importing those configs overrides the package's default ignores — preserve that block when editing.

## Bundled Next.js docs (use these instead of guessing)

Always consult these before writing Next.js code; they match the installed version exactly:

- Getting started → `node_modules/next/dist/docs/01-app/01-getting-started/`
- Guides → `node_modules/next/dist/docs/01-app/02-guides/`
- API reference → `node_modules/next/dist/docs/01-app/03-api-reference/`
- Pages Router (legacy, not used here) → `node_modules/next/dist/docs/02-pages/`

Notable v16 areas where training data is likely wrong:

- Cache Components / `use cache` directive, `cacheLife`, `updateTag`
- `unstable_instant` route export and the Instant Navigation DevTools (`experimental.instantNavigationDevToolsToggle`) — see `02-guides/instant-navigation.md`
- Async `params` / `searchParams` (`Promise<...>`) in route segments

## Secrets / OpenCode config

`opencode.json` is **committed** and currently contains live provider API keys (x5lab) and MCP server keys (context7, firecrawl, stitch). Treat it as sensitive:

- Do not echo those keys in chat output, logs, or new files.
- Do not push changes that add more secrets to it — prefer env vars / `.env*` (already gitignored) for anything new.
- The file enables MCP servers `serena`, `context7`, `firecrawl`, and `stitch`; those tools are available in-session.

## Conventions worth preserving

- `next-env.d.ts` is auto-generated and gitignored — never edit it.
- `.env*` is gitignored; don't commit env files.
- Keep `next.config.ts` minimal unless a feature genuinely needs config (e.g. `cacheComponents`, `experimental.instantNavigationDevToolsToggle`).
- When adding routes, colocate `page.tsx` / `layout.tsx` / `loading.tsx` / `error.tsx` under `app/<segment>/` per App Router conventions.

# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router (TypeScript). Entry `app/page.tsx`; shared layout in `app/layout.tsx`.
- Feature routes: `app/nurse/*` (signup, profile, dashboard), `app/user/*` (intake, matching, confirmation), and `app/signin`.
- Reusable UI lives in `app/components` (Button, Card, Input, Navbar, Footer, TrustGraph).
- Styling tokens/utilities in `app/globals.css`; static assets in `public/`; core config in repo root (`next.config.ts`, `eslint.config.mjs`, `tsconfig.json`).
- Build output in `.next/` (ignored); avoid committing generated artifacts.

## Setup & Local Development
- Use Node 18.18+ (Next 16 requires it); 20.x LTS recommended.
- Install dependencies: `npm install`.
- Start dev server: `npm run dev` → http://localhost:3000 with hot reload.
- Use the `@/*` path alias from `tsconfig.json` for absolute imports.

## Build, Test, and Development Commands
- `npm run dev` – start the development server.
- `npm run lint` – ESLint with Next core-web-vitals + TypeScript rules; add `--fix` for autofixable issues.
- `npm run build` – create production build in `.next/`; run before opening a PR.
- `npm start` – serve the compiled app locally.

## Coding Style & Naming Conventions
- TypeScript strict mode is on; prefer typed props and explicit return types for hooks/utils.
- Components/files in `app/components` use `PascalCase`; route folders stay lowercase to map cleanly to URLs (e.g., `/nurse/dashboard`).
- Use semicolons and 2-space indentation to match existing files.
- Reuse CSS variables/utilities from `app/globals.css`; avoid hard-coded colors or shadows.
- Mark client components with `'use client'` where needed; keep server components lean.

## Testing Guidelines
- No automated suite yet; add tests alongside new logic.
- Prefer React Testing Library for UI units and Playwright for critical flows; mirror route names in test filenames (e.g., `user/confirmation.test.tsx`).
- Block PRs until added tests pass locally.

## Commit & Pull Request Guidelines
- Commit messages: short, imperative summaries (e.g., "Add nurse dashboard cards"); keep one logical change per commit.
- PRs should include a brief description, screenshots for UI changes, linked issue/ADR when relevant, test steps/results, and call out breaking changes or migrations.
- Ensure lint and build succeed before requesting review; do not commit `.next` or local env files.

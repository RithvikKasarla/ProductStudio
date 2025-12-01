This is a [Next.js](https://nextjs.org) app for the CareConnect home‑care marketplace, using:

- App Router (`app/`), TypeScript, and NextAuth for auth
- Prisma + PostgreSQL (Neon) for persistence

## Getting started (local)

From the project root:

```bash
cd home-care-app
npm install
```

### 1. Environment variables

Create `home-care-app/.env.local` with:

```bash
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
NEXTAUTH_SECRET="<long-random-string>"
NEXTAUTH_URL="http://localhost:3000"
```

- `DATABASE_URL` – points at your shared Neon/Postgres instance.
- `NEXTAUTH_SECRET` – **must be the same on all machines** so sessions work everywhere.
- `NEXTAUTH_URL` – base URL for local dev.

> `.env` / `.env.local` are intentionally ignored by git. Do **not** commit real secrets; if you need to share config, use a separate `*.env.example` file or send values out‑of‑band.

### 2. Database schema

Run migrations and generate the Prisma client (only needed after schema changes or on first setup):

```bash
npx prisma migrate deploy   # or `npx prisma migrate dev` during development
npx prisma generate
```

### 3. Run the dev server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Notes

- Family and caregiver accounts are created via the UI flows (`/user/signup` and `/nurse/signup`).
- Auth + sessions rely on cookies signed with `NEXTAUTH_SECRET`; use the same secret on any machine that should share sessions against the same database.


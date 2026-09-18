# WorthIt

WorthIt is a **decision analyzer**. Pick a category, enter real numbers, and get a true-cost breakdown plus a **Worth It**, **Consider It**, or **Not Worth It** verdict.

It is **not** a budgeting or spending tracker. There are no bank connections.

## Stack

- **Next.js 16** App Router, **React 19**, **TypeScript**
- **Supabase Auth** + **Postgres** with Row Level Security
- **Tailwind** / **shadcn/ui**, **Recharts**

Category math lives in TypeScript (`lib/economics.ts`, `lib/categories.ts`). The database stores the inputs you entered and a snapshot of the result. It does not run the economics.

## What works

- **Public 9-category analyzer** at `/app/analyze` (purchase, car, housing, debt, job, college, subscription, transportation, investing). No account required.
- **Email/password auth** (sign up, sign in, forgot/reset password, email verification). If Supabase is unset, `/login` says so instead of failing; the analyzer still works.
- **Gated signed-in surfaces:** `/app` (dashboard), `/app/profile`, `/app/decisions`. Guests are redirected to `/login`.
- **Save, list, and delete** analyses for the signed-in owner. Save **re-analyzes on the server** so the client cannot submit a forged verdict. RLS (plus a verified-user check) keeps rows owner-scoped.
- **Dashboard Recent** shows the newest real saves (same source as My Decisions), not a mock list.
- **Honest empty shells** on dashboard and profile: no fake persona scores, invented income, or ranked “economic score.” Those cards stay empty until real scoring exists.

## Setup

Node 20.9+ is required. A Supabase project is required only for accounts and saved decisions.

```bash
git clone https://github.com/gabbygtobar-coder/worth-it.git
cd worth-it
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key. Safe in the browser because RLS guards every table. Never add the service role key. |
| `NEXT_PUBLIC_SITE_URL` | Origin used to build auth email links. Use `http://localhost:3000` locally. **In production this must be the real deployed origin**, or confirmation and reset links will point at the wrong host. |

Apply `supabase/migrations/0001_init.sql` (Supabase SQL editor, or `supabase db push` with the CLI). It creates `profiles` and `decisions` with RLS enabled.

```bash
npm ci
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run typecheck` | Type check without emitting |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |

## Deploy

Vercel is the recommended host for this Next.js app. No production URL is documented here.

Set these on the Vercel project (same names as `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` — the production origin, not `http://localhost:3000`. Auth email links are built from this value.

Use the same Supabase project whose migration you applied. Add that production origin to the Supabase Auth redirect allow-list so confirmation and reset links can return to the app.

## Known limits

- **Confirm email** is a Supabase project toggle. With it on, sign-up lands on `/verify-email` until the link is opened; with it off, sign-up creates a session immediately.
- The dashboard **Weekly economics** chart is labeled **Sample**. It is illustrative, not this account’s spending.
- **Not built yet:** OAuth, AI, payments, public share links, CI.
- Category results use **nominal dollars**. An inflation helper exists in `lib/economics.ts` but is unused.

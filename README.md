# WorthIt

WorthIt is a decision analyzer. You pick a decision category, enter real numbers, and get a true
cost plus a Worth It, Consider It, or Not Worth It verdict. It is not a budgeting app and it does
not track spending.

The economics live in TypeScript:

- `lib/economics.ts` holds the shared math (opportunity cost, loan interest, depreciation, and so on).
- `lib/categories.ts` holds the nine decision categories, their form fields, and their `analyze()` functions.

## Requirements

- Node 20.9 or newer
- A Supabase project (only needed for accounts and saved decisions)

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

Analyzing a decision works without any environment variables. Sign in is disabled until Supabase
is configured, and `/login` says so instead of failing.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key, safe in the browser because Row Level Security guards every table |
| `NEXT_PUBLIC_SITE_URL` | Origin used to build auth redirect links |

Never add the service role key to this app. It bypasses Row Level Security.

## Database

The schema lives in `supabase/migrations`. Apply `0001_init.sql` to your project, either by pasting
it into the Supabase SQL editor or by running `supabase db push` with the Supabase CLI.

It creates two tables:

- `profiles`: one row per user, holding analyzer defaults they enter themselves.
- `decisions`: saved analyses, storing both the inputs and a snapshot of the result.

Both tables have Row Level Security enabled so a user can only read and write their own rows.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Type check without emitting |

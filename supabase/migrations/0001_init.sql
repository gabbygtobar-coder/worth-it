-- WorthIt initial schema: user profiles and saved decisions.
--
-- Design notes:
--  * Economics stay in TypeScript (lib/economics.ts, lib/categories.ts). The
--    database stores the inputs a user entered and a snapshot of the result
--    that was shown to them, so history is stable and rerunning is possible.
--  * Every table is owner-scoped through Row Level Security. The browser only
--    ever uses the anon key, so RLS is the actual authorization boundary.

create type public.decision_category as enum (
  'purchase',
  'car',
  'housing',
  'debt',
  'job',
  'college',
  'subscription',
  'transportation',
  'investing'
);

create type public.decision_verdict as enum ('worth', 'consider', 'avoid');

-- Keeps updated_at honest without relying on the client to send it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
-- One row per auth user. Values are user-entered defaults for the analyzer.
-- Nothing here is derived from bank data or third-party tracking.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  -- Analyzer prefills.
  hourly_income numeric(12, 2),
  current_savings numeric(14, 2),
  -- Optional self-reported snapshot shown on the profile page.
  monthly_income numeric(12, 2),
  monthly_spending numeric(12, 2),
  savings_rate numeric(6, 4),
  net_worth numeric(14, 2),
  -- Assumption overrides. Defaults mirror ASSUMPTIONS in lib/economics.ts.
  expected_return numeric(6, 4) not null default 0.07,
  inflation numeric(6, 4) not null default 0.03,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null or char_length(display_name) <= 80
  ),
  constraint profiles_expected_return_range check (expected_return >= 0 and expected_return <= 1),
  constraint profiles_inflation_range check (inflation >= 0 and inflation <= 1)
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can create their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can delete their own profile"
on public.profiles for delete
to authenticated
using ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- decisions
-- ---------------------------------------------------------------------------
-- inputs  = raw form values, so a decision can be edited and rerun.
-- result  = the AnalysisResult snapshot shown when it was saved.
-- The scalar columns duplicate part of the snapshot so lists, filters, and
-- search do not have to read JSON.
create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id public.decision_category not null,
  title text not null,
  inputs jsonb not null,
  result jsonb not null,
  true_cost numeric(14, 2) not null,
  face_price numeric(14, 2) not null,
  verdict public.decision_verdict not null,
  summary text,
  -- Null until the user chooses to share. Setting it back to null revokes the link.
  share_token uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint decisions_title_length check (char_length(title) between 1 and 200)
);

create index decisions_user_created_idx on public.decisions (user_id, created_at desc);
create index decisions_user_verdict_idx on public.decisions (user_id, verdict);
create unique index decisions_share_token_idx on public.decisions (share_token)
where share_token is not null;

create trigger decisions_set_updated_at
before update on public.decisions
for each row execute function public.set_updated_at();

alter table public.decisions enable row level security;

create policy "Users can read their own decisions"
on public.decisions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own decisions"
on public.decisions for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own decisions"
on public.decisions for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own decisions"
on public.decisions for delete
to authenticated
using ((select auth.uid()) = user_id);

-- Public read access for shared links is deliberately not a policy. When
-- sharing is built it will use a security definer function that takes a token
-- and returns at most one row, so anonymous visitors cannot list shared rows.

-- ---------------------------------------------------------------------------
-- Profile bootstrap
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

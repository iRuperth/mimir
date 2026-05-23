-- Mimir guestbook schema.
-- Run this once in the Supabase SQL editor for your project.
-- After running, copy your Project URL and anon (publishable) key into:
--   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
-- and set VITE_GUESTBOOK_ENABLED=true.
--
-- The CHECK constraints below must match the VITE_GUESTBOOK_*_MAX
-- values in .env. If you change one, update both.

create table if not exists public.guestbook (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  email       text not null check (
    char_length(email) between 3 and 254
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ),
  full_name   text not null check (char_length(full_name) between 1 and 80),
  role        text          check (role is null or char_length(role) between 1 and 80),
  comment     text not null check (char_length(comment) between 1 and 500)
);

alter table public.guestbook enable row level security;

-- Column-level grants enforce privacy at the DB level: anon can only
-- write/read the columns listed below. Email is never returned to
-- visitors, even if a query tries to select it.
revoke all on public.guestbook from anon, authenticated;
grant insert (email, full_name, role, comment)
  on public.guestbook to anon, authenticated;
grant select (id, created_at, full_name, role, comment)
  on public.guestbook to anon, authenticated;

drop policy if exists "guestbook anon insert" on public.guestbook;
create policy "guestbook anon insert"
  on public.guestbook
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "guestbook anon select" on public.guestbook;
create policy "guestbook anon select"
  on public.guestbook
  for select
  to anon, authenticated
  using (true);

-- Public read view. security_invoker = on so it runs with the
-- caller's permissions and respects the grants/policies above.
create or replace view public.guestbook_public
  with (security_invoker = on)
  as
  select id, created_at, full_name, role, comment
  from public.guestbook;

grant select on public.guestbook_public to anon, authenticated;

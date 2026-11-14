-- AdFlare inquiries -> Supabase. Run once in: Supabase > SQL Editor > New query.
-- It makes a NEW table, so your portfolio's "inquiries" table is not touched.
--
-- Admin email is already set to binnfrancisco@gmail.com (same as the portfolio).

create table if not exists public.adflare_inquiries (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status     text not null default 'new' check (status in ('new', 'read')),
  name       text not null check (char_length(name)    between 1 and 120),
  email      text not null check (char_length(email)   between 3 and 200),
  company    text check (char_length(company) <= 200),
  project    text not null check (char_length(project) between 1 and 200),   -- the form's "Campaign goal"
  budget     text check (char_length(budget)   <= 60),
  timeline   text check (char_length(timeline) <= 120),
  details    text not null check (char_length(details) between 1 and 4000)
);

alter table public.adflare_inquiries enable row level security;

-- Visitors can ONLY send an inquiry (insert). They cannot read, edit or delete anything.
drop policy if exists "visitors can send inquiries" on public.adflare_inquiries;
create policy "visitors can send inquiries"
  on public.adflare_inquiries for insert
  to anon, authenticated
  with check (status = 'new');

-- Only you (by email) can read, mark as read, and delete.
drop policy if exists "admin can read" on public.adflare_inquiries;
create policy "admin can read"
  on public.adflare_inquiries for select
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('binnfrancisco@gmail.com'));

drop policy if exists "admin can update" on public.adflare_inquiries;
create policy "admin can update"
  on public.adflare_inquiries for update
  to authenticated
  using      (lower(coalesce(auth.jwt() ->> 'email','')) = lower('binnfrancisco@gmail.com'))
  with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('binnfrancisco@gmail.com'));

drop policy if exists "admin can delete" on public.adflare_inquiries;
create policy "admin can delete"
  on public.adflare_inquiries for delete
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('binnfrancisco@gmail.com'));

-- Table privileges (RLS above still decides who gets which rows).
revoke all on public.adflare_inquiries from anon, authenticated;
grant insert on public.adflare_inquiries to anon, authenticated;
grant select, update, delete on public.adflare_inquiries to authenticated;


-- ============================================================
-- REALTIME: lets admin.html get new inquiries instantly (no refresh).
-- Without this, the bell / toast / chime only fire on the 30s polling.
-- Safe to run more than once. Covers BOTH inboxes (AdFlare + portfolio).
-- ============================================================
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'adflare_inquiries') then
    alter publication supabase_realtime add table public.adflare_inquiries;
  end if;
  if to_regclass('public.inquiries') is not null and not exists (
                 select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'inquiries') then
    alter publication supabase_realtime add table public.inquiries;
  end if;
end $$;

-- Quick test (run after the above, then watch the admin): 
-- insert into public.adflare_inquiries (name,email,project,details) values ('Test','t@t.com','Test goal','Hello');

-- Run in Supabase SQL Editor after 001 + 002.
-- Enables usernames (anonymous display) and ties posts to auth users.
-- If `execute function` errors, try: ... execute procedure public.handle_new_user();

-- Profiles: one row per auth user, display name only (no email exposed in app)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now(),
  constraint username_length check (char_length(username) >= 2 and char_length(username) <= 32),
  constraint username_format check (username ~ '^[a-zA-Z0-9_]+$')
);

comment on table public.profiles is 'Public display name per user; email stays in auth.users only';

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile when a user signs up (username from sign-up metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uname text;
begin
  uname := trim(coalesce(new.raw_user_meta_data->>'username', ''));
  if uname is null or uname = '' then
    raise exception 'username is required in user metadata';
  end if;
  insert into public.profiles (id, username)
  values (new.id, uname);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Link posts to users (nullable for existing rows)
alter table public.found_items
  add column if not exists user_id uuid references public.profiles (id) on delete set null;

alter table public.lost_alerts
  add column if not exists user_id uuid references public.profiles (id) on delete set null;

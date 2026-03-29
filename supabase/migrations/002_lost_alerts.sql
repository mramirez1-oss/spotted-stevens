-- Run in Supabase SQL Editor after 001_found_items.sql

create table if not exists public.lost_alerts (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  location_last_seen text not null,
  created_at timestamptz not null default now()
);

comment on table public.lost_alerts is 'Student-posted alerts for items they have lost';

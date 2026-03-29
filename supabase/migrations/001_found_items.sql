-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

-- Found items reported from the app
create table if not exists public.found_items (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  building text not null,
  image_url text,
  created_at timestamptz not null default now()
);

comment on table public.found_items is 'Items turned in to school lost and found';

-- Public storage bucket for photos (readable by anyone with the URL)
insert into storage.buckets (id, name, public)
values ('found-images', 'found-images', true)
on conflict (id) do update set public = excluded.public;

-- Allow anonymous read of objects in this bucket (for <img> / next/image)
drop policy if exists "Public read found-images" on storage.objects;
create policy "Public read found-images"
  on storage.objects
  for select
  using (bucket_id = 'found-images');

-- Example RPC for username → email login (skip if you already created this).
-- The app calls: .rpc('get_email_from_username', { username_input: '...' })

create or replace function public.get_email_from_username(username_input text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.email::text
  from auth.users u
  join public.profiles p on p.id = u.id
  where lower(p.username) = lower(username_input)
  limit 1;
$$;

grant execute on function public.get_email_from_username(text) to anon;
grant execute on function public.get_email_from_username(text) to authenticated;

-- Description: Add profiles table and related functionality
-- Created at: 2024-12-14

-- Create a table for public profiles
create table if not exists
  public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    updated_at timestamp with time zone,
    username text unique,
    full_name text,
    avatar_url text,
    website text,
    constraint username_length check (char_length(username) >= 3)
  ) tablespace pg_default;

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage for avatars
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for avatar storage
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');


-- Add profiles table to powersync publication
alter publication powersync add table profiles;


-- Function to create initial challenge for new profile
create or replace function create_initial_challenge()
returns trigger as $$
begin
  insert into public.challenges (
    profile_id, type, duration_days, start_date, status
  ) values (
    NEW.id, 'standard', 40, now(), 'active'
  );
  return NEW;
end;
$$ language plpgsql;

-- Trigger to create challenge after profile creation
create trigger create_challenge_after_profile
  after insert on public.profiles
  for each row
  execute function create_initial_challenge();
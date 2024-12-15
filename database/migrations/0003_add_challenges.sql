-- Description: Add challenges table and related functionality
-- Created at: 2024-12-14

-- Create challenges table
create table if not exists
  public.challenges (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    type text default 'standard' check (type in ('standard', 'custom')) not null,
    duration_days integer default 40 check (duration_days > 0) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    start_date timestamp with time zone default timezone('utc'::text, now()) not null,
    end_date timestamp with time zone generated always as (start_date + (duration_days || ' days')::interval) stored,
    status text default 'active' check (status in ('active', 'completed', 'abandoned')) not null
  ) tablespace pg_default;

-- Set up Row Level Security (RLS)
alter table challenges
  enable row level security;

-- Only the challenge owner can view their challenges
create policy "Users can view own challenges." on challenges
  for select using (auth.uid() = profile_id);

-- Only the challenge owner can insert their challenges
create policy "Users can insert own challenges." on challenges
  for insert with check (auth.uid() = profile_id);

-- Only the challenge owner can update their challenges
create policy "Users can update own challenges." on challenges
  for update using (auth.uid() = profile_id);

-- Add challenges table to powersync publication
alter publication powersync add table challenges;

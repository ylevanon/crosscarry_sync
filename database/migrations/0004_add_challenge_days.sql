-- Description: Add challenge days table
-- Created at: 2024-12-14

-- Create challenge_days table
create table if not exists
  public.challenge_days (
    id uuid default gen_random_uuid() primary key,
    challenge_id uuid references public.challenges(id) on delete cascade not null,
    day_number integer not null check (day_number > 0),
    date timestamp with time zone not null,
    completed boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  ) tablespace pg_default;

-- Create unique constraint to ensure one entry per day per challenge
create unique index challenge_days_unique_day
  on public.challenge_days(challenge_id, day_number);

-- Set up Row Level Security (RLS)
alter table challenge_days
  enable row level security;

-- Users can view their own challenge days
create policy "Users can view own challenge days." on challenge_days
  for select using (
    exists (
      select 1 from challenges
      where challenges.id = challenge_days.challenge_id
      and challenges.profile_id = auth.uid()
    )
  );

-- Users can update their own challenge days
create policy "Users can update own challenge days." on challenge_days
  for update using (
    exists (
      select 1 from challenges
      where challenges.id = challenge_days.challenge_id
      and challenges.profile_id = auth.uid()
    )
  );

-- Add challenge_days table to powersync publication
alter publication powersync add table challenge_days;
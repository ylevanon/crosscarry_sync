-- create streak_photo_table
create table if not exists public.streak_photo_table (
    id uuid primary key default gen_random_uuid(),
    challenge_days_id uuid not null references public.challenge_days(id),
    challenge_id uuid not null references public.challenges(id),
    photo_id text not null,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- add streak_photo_table to powersync publication
alter publication powersync add table streak_photo_table;

-- enable row level security
alter table public.streak_photo_table enable row level security;

-- policy 1: select policy
-- this policy controls who can view streak photos
-- it checks if the user owns the challenge through the profile_id
create policy "Users can view own streak photos"
    on public.streak_photo_table
    for select
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = streak_photo_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );

-- policy 2: insert policy
-- this policy controls who can create streak photos
create policy "Users can create own streak photos"
    on public.streak_photo_table
    for insert
    with check (
        exists (
            select 1
            from public.challenges c
            where c.id = challenge_id
            and c.profile_id = auth.uid()
        )
    );

-- policy 3: update policy
-- this policy controls who can update streak photos
create policy "Users can update own streak photos"
    on public.streak_photo_table
    for update
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = streak_photo_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );

-- policy 4: delete policy
-- this policy controls who can delete streak photos
create policy "Users can delete own streak photos"
    on public.streak_photo_table
    for delete
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = streak_photo_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );

-- create trigger function to create streak photo entry when challenge day is created
create or replace function create_streak_photo_entry()
returns trigger as $$
begin
    insert into public.streak_photo_table (
        challenge_days_id,
        challenge_id
    ) values (
        new.id,
        new.challenge_id
    );
    return new;
end;
$$ language plpgsql security definer;

-- create trigger
create trigger create_streak_photo_entry_after_challenge_day
    after insert on public.challenge_days
    for each row
    execute function create_streak_photo_entry();
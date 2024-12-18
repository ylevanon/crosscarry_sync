-- create sober_table
create table if not exists public.sober_table (
    id uuid primary key default gen_random_uuid(),
    challenge_days_id uuid not null references public.challenge_days(id),
    challenge_id uuid not null references public.challenges(id),
    completed boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- add sober_table to powersync publication
alter publication powersync add table sober_table;

-- enable row level security
alter table public.sober_table enable row level security;

-- policy 1: select policy
-- this policy controls who can view sober entries
-- it checks if the user owns the challenge through the profile_id
create policy "Users can view own sober entries"
    on public.sober_table
    for select
    to public
    using (
        exists (
            select 1
            from challenges
            where challenges.id = sober_table.challenge_id
            and challenges.profile_id = auth.uid()
        )
    );

-- policy 2: update policy
-- this policy controls who can update sober entries
-- same check as select - user must own the challenge
create policy "Users can update own sober entries"
    on public.sober_table
    for update
    to public
    using (
        exists (
            select 1
            from challenges
            where challenges.id = sober_table.challenge_id
            and challenges.profile_id = auth.uid()
        )
    );

-- create trigger function to create sober entry when challenge day is created
create or replace function create_sober_entry()
returns trigger as $$
begin
    insert into public.sober_table (
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
create trigger create_sober_entry_after_challenge_day
    after insert on public.challenge_days
    for each row
    execute function create_sober_entry();

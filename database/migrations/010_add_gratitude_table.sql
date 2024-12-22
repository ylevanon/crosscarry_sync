-- create gratitude_table
create table if not exists public.gratitude_table (
    id uuid primary key default gen_random_uuid(),
    challenge_days_id uuid not null references public.challenge_days(id),
    challenge_id uuid not null references public.challenges(id),
    items jsonb default '[]'::jsonb,
    completed boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- add gratitude_table to powersync publication
alter publication powersync add table gratitude_table;

-- enable row level security
alter table public.gratitude_table enable row level security;

-- policy 1: select policy
-- this policy controls who can view gratitude entries
-- it checks if the user owns the challenge through the profile_id
create policy "Users can view own gratitude entries"
    on public.gratitude_table
    for select
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = gratitude_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );


-- policy 2: update policy
-- this policy controls who can update gratitude entries
create policy "Users can update own gratitude entries"
    on public.gratitude_table
    for update
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = gratitude_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );

-- create trigger function to create gratitude entry when challenge day is created
create or replace function create_gratitude_entry()
returns trigger as $$
begin
    insert into public.gratitude_table (challenge_days_id, challenge_id)
    values (new.id, new.challenge_id);
    return new;
end;
$$ language plpgsql;

-- create trigger
create trigger create_gratitude_entry_trigger
    after insert on public.challenge_days
    for each row
    execute function create_gratitude_entry();

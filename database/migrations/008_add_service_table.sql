-- create service_table
create table if not exists public.service_table (
    id uuid primary key default gen_random_uuid(),
    challenge_days_id uuid not null references public.challenge_days(id),
    challenge_id uuid not null references public.challenges(id),
    completed boolean default false,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- add service_table to powersync publication
alter publication powersync add table service_table;

-- enable row level security
alter table public.service_table enable row level security;

-- policy 1: select policy
-- this policy controls who can view service entries
-- it checks if the user owns the challenge through the profile_id
create policy "Users can view own service entries"
    on public.service_table
    for select
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = service_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );

-- policy 2: insert policy
-- this policy controls who can create service entries
create policy "Users can create own service entries"
    on public.service_table
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
-- this policy controls who can update service entries
create policy "Users can update own service entries"
    on public.service_table
    for update
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = service_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );

-- create trigger function to create service entry when challenge day is created
create or replace function create_service_entry()
returns trigger as $$
begin
    insert into public.service_table (
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
create trigger create_service_entry_after_challenge_day
    after insert on public.challenge_days
    for each row
    execute function create_service_entry();
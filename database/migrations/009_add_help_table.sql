-- create help_table
create table if not exists public.help_table (
    id uuid primary key default gen_random_uuid(),
    challenge_days_id uuid not null references public.challenge_days(id),
    challenge_id uuid not null references public.challenges(id),
    completed boolean default false,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- add help_table to powersync publication
alter publication powersync add table help_table;

-- enable row level security
alter table public.help_table enable row level security;

-- policy 1: select policy
-- this policy controls who can view help entries
-- it checks if the user owns the challenge through the profile_id
create policy "Users can view own help entries"
    on public.help_table
    for select
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = help_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );


-- policy 2: update policy
-- this policy controls who can update help entries
create policy "Users can update own help entries"
    on public.help_table
    for update
    using (
        exists (
            select 1
            from public.challenges c
            where c.id = help_table.challenge_id
            and c.profile_id = auth.uid()
        )
    );

-- create trigger function to create help entry when challenge day is created
create or replace function create_help_entry()
returns trigger as $$
begin
    insert into public.help_table (
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
create trigger create_help_entry_after_challenge_day
    after insert on public.challenge_days
    for each row
    execute function create_help_entry();
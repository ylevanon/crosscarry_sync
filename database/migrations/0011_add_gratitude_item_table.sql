-- create gratitude_item table
create table if not exists public.gratitude_item (
    id uuid primary key default gen_random_uuid(),
    gratitude_id uuid not null references public.gratitude_table(id),
    description text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- add gratitude_item to powersync publication
alter publication powersync add table gratitude_item;

-- enable row level security
alter table public.gratitude_item enable row level security;

-- policy 1: select policy
-- this policy controls who can view gratitude items
-- it checks if the user owns the challenge through the profile_id
create policy "Users can view own gratitude items"
    on public.gratitude_item
    for select
    using (
        exists (
            select 1
            from public.gratitude_table g
            join public.challenge_days cd on cd.id = g.challenge_days_id
            join public.challenges c on c.id = cd.challenge_id
            where g.id = gratitude_item.gratitude_id
            and c.profile_id = auth.uid()
        )
    );

-- policy 2: insert policy
-- this policy controls who can insert gratitude items
create policy "Users can insert own gratitude items"
    on public.gratitude_item
    for insert
    with check (
        exists (
            select 1
            from public.gratitude_table g
            join public.challenge_days cd on cd.id = g.challenge_days_id
            join public.challenges c on c.id = cd.challenge_id
            where g.id = gratitude_item.gratitude_id
            and c.profile_id = auth.uid()
        )
    );

-- policy 3: update policy
-- this policy controls who can update gratitude items
create policy "Users can update own gratitude items"
    on public.gratitude_item
    for update
    using (
        exists (
            select 1
            from public.gratitude_table g
            join public.challenge_days cd on cd.id = g.challenge_days_id
            join public.challenges c on c.id = cd.challenge_id
            where g.id = gratitude_item.gratitude_id
            and c.profile_id = auth.uid()
        )
    );

-- policy 4: delete policy
-- this policy controls who can delete gratitude items
create policy "Users can delete own gratitude items"
    on public.gratitude_item
    for delete
    using (
        exists (
            select 1
            from public.gratitude_table g
            join public.challenge_days cd on cd.id = g.challenge_days_id
            join public.challenges c on c.id = cd.challenge_id
            where g.id = gratitude_item.gratitude_id
            and c.profile_id = auth.uid()
        )
    );
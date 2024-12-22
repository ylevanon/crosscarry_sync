-- Add challenge_id column
ALTER TABLE public.gratitude_item
ADD COLUMN challenge_id uuid REFERENCES public.challenges(id);

-- Update existing records with challenge_id from the relationship chain
UPDATE public.gratitude_item gi
SET challenge_id = c.id
FROM public.gratitude_table g
JOIN public.challenge_days cd ON cd.id = g.challenge_days_id
JOIN public.challenges c ON c.id = cd.challenge_id
WHERE g.id = gi.gratitude_id;

-- Make challenge_id not null after populating data
ALTER TABLE public.gratitude_item
ALTER COLUMN challenge_id SET NOT NULL;

-- Update RLS policies to use challenge_id
DROP POLICY IF EXISTS "Users can view own gratitude items" ON public.gratitude_item;
DROP POLICY IF EXISTS "Users can insert own gratitude items" ON public.gratitude_item;
DROP POLICY IF EXISTS "Users can update own gratitude items" ON public.gratitude_item;
DROP POLICY IF EXISTS "Users can delete own gratitude items" ON public.gratitude_item;

-- Recreate policies using challenge_id
CREATE POLICY "Users can view own gratitude items"
    ON public.gratitude_item
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.challenges c
            WHERE c.id = gratitude_item.challenge_id
            AND c.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own gratitude items"
    ON public.gratitude_item
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.challenges c
            WHERE c.id = gratitude_item.challenge_id
            AND c.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own gratitude items"
    ON public.gratitude_item
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1
            FROM public.challenges c
            WHERE c.id = gratitude_item.challenge_id
            AND c.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own gratitude items"
    ON public.gratitude_item
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1
            FROM public.challenges c
            WHERE c.id = gratitude_item.challenge_id
            AND c.profile_id = auth.uid()
        )
    );

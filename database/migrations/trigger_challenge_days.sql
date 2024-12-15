-- Function to create challenge days
create or replace function create_challenge_days()
returns trigger as $$
declare
  day_number integer;
  day_date timestamp;
begin
  -- Verify challenge_days table exists
  if to_regclass('public.challenge_days') is null then
    raise exception 'challenge_days table does not exist';
  end if;

  -- Create all days for the challenge first
  for day_number in 1..NEW.duration_days loop
    day_date := NEW.start_date + ((day_number - 1) || ' days')::interval;
    
    insert into challenge_days (
      id, challenge_id, day_number, date, completed, 
      created_at, updated_at
    ) values (
      gen_random_uuid(), NEW.id, day_number, day_date, false,
      now(), now()
    );
  end loop;
  
  return NEW;
end;
$$ language plpgsql;

-- Create trigger to create challenge days when a challenge is created
create trigger create_challenge_days_after_challenge
  after insert on challenges
  for each row
  execute function create_challenge_days();
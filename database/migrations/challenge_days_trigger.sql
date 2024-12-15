-- Function to create challenge days
create or replace function create_challenge_days()
returns trigger as $$
declare
  day_number integer;
  day_date timestamp;
begin
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
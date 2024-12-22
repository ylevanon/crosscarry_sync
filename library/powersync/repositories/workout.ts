import { useQuery } from "@powersync/react-native";

import { WORKOUT_TABLE, WorkoutEntryRecord } from "../AppSchema";

const useWorkoutByChallengeDay = (challengeDayId: string) => {
  // Fetch active challenge and its current day

  const { data: workoutEntries } = useQuery<WorkoutEntryRecord>(
    `SELECT *
   FROM ${WORKOUT_TABLE} WHERE challenge_days_id = ?`,
    [challengeDayId]
  );

  const workoutEntry = workoutEntries?.[0];

  return { workoutEntry };
};

export default useWorkoutByChallengeDay;

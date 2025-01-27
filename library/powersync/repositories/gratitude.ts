import { useQuery } from "@powersync/react-native";

import { GRATITUDE_TABLE, GratitudeEntryRecord } from "../AppSchema";

const useGratitudeByChallengeDay = (challengeDayId: string) => {
  console.log("challengeDayId", challengeDayId);
  const { data: gratitudeEntries } = useQuery<GratitudeEntryRecord>(
    `SELECT *
     FROM ${GRATITUDE_TABLE} 
     WHERE challenge_days_id = ?`,
    [challengeDayId]
  );

  console.log("Gratitude by challenge day:", gratitudeEntries);

  return { gratitudeEntry: gratitudeEntries?.[0] };
};

export default useGratitudeByChallengeDay;

import { useQuery } from "@powersync/react-native";

import { GRATITUDE_TABLE, GratitudeEntryRecord } from "../AppSchema";

const useGratitudeByChallengeDay = (challengeDayId: string) => {
  const { data: gratitudeEntries } = useQuery<GratitudeEntryRecord>(
    `SELECT *
     FROM ${GRATITUDE_TABLE} 
     WHERE challenge_days_id = ?`,
    [challengeDayId]
  );

  const gratitudeEntry = gratitudeEntries?.[0];

  // Parse items from JSON string to array if it exists
  const parsedEntry = gratitudeEntry
    ? {
        ...gratitudeEntry,
        items: JSON.parse(gratitudeEntry.items || "[]"),
      }
    : null;

  return { gratitudeEntry: parsedEntry };
};

export default useGratitudeByChallengeDay;

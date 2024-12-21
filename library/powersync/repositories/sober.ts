import { useQuery } from "@powersync/react-native";

import { SOBER_TABLE, SoberEntryRecord } from "../AppSchema";

const useSoberByChallengeDay = (challengeDayId: string) => {
  const { data: soberEntries } = useQuery<SoberEntryRecord>(
    `SELECT *
     FROM ${SOBER_TABLE} 
     WHERE challenge_days_id = ?`,
    [challengeDayId]
  );

  const soberEntry = soberEntries?.[0];

  return { soberEntry };
};

export default useSoberByChallengeDay;

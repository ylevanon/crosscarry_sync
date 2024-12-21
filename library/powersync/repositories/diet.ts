import { useQuery } from "@powersync/react-native";

import { DIET_TABLE, DietEntryRecord } from "../AppSchema";

const useDietByChallengeDay = (challengeDayId: string) => {
  // Fetch active challenge and its current day

  const { data: dietEntries } = useQuery<DietEntryRecord>(
    `SELECT *
   FROM ${DIET_TABLE} WHERE challenge_days_id = ?`,
    [challengeDayId]
  );

  const dietEntry = dietEntries?.[0];

  return { dietEntry };
};

export default useDietByChallengeDay;

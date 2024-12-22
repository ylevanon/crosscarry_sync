import { useQuery } from "@powersync/react-native";

import { HELP_TABLE, HelpEntryRecord } from "../AppSchema";

const useHelpByChallengeDay = (challengeDayId: string) => {
  // Fetch active challenge and its current day

  const { data: helpEntries } = useQuery<HelpEntryRecord>(
    `SELECT *
   FROM ${HELP_TABLE} WHERE challenge_days_id = ?`,
    [challengeDayId]
  );

  const helpEntry = helpEntries?.[0];

  return { helpEntry };
};

export default useHelpByChallengeDay;

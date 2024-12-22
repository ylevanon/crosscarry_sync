import { useQuery } from "@powersync/react-native";

import { SERVICE_TABLE, ServiceEntryRecord } from "../AppSchema";

const useServiceByChallengeDay = (challengeDayId: string) => {
  // Fetch active challenge and its current day

  const { data: serviceEntries } = useQuery<ServiceEntryRecord>(
    `SELECT *
   FROM ${SERVICE_TABLE} WHERE challenge_days_id = ?`,
    [challengeDayId]
  );

  const serviceEntry = serviceEntries?.[0];

  return { serviceEntry };
};

export default useServiceByChallengeDay;

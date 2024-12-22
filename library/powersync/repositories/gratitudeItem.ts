import { useQuery } from "@powersync/react-native";

import { GRATITUDE_ITEM_TABLE, GratitudeItemRecord } from "../AppSchema";

const useGratitudeItemsByGratitudeId = (gratitudeId: string) => {
  const { data: gratitudeItemEntries } = useQuery<GratitudeItemRecord>(
    `SELECT *
     FROM ${GRATITUDE_ITEM_TABLE} 
     WHERE gratitude_id = ?`,
    [gratitudeId]
  );

  return { gratitudeItemEntries: gratitudeItemEntries || [] };
};

export default useGratitudeItemsByGratitudeId;

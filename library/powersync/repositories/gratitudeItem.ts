import { useQuery } from "@powersync/react-native";

import { GRATITUDE_ITEM_TABLE, GratitudeItemRecord } from "../AppSchema";

const useGratitudeItemsByGratitudeId = (gratitudeId: string) => {
  console.log("gratitudeId", gratitudeId);
  const { data: gratitudeItemEntries } = useQuery<GratitudeItemRecord>(
    `SELECT *
     FROM ${GRATITUDE_ITEM_TABLE} 
     WHERE gratitude_id = ?`,
    [gratitudeId]
  );

  console.log("Gratitude items by gratitude id:", gratitudeItemEntries);

  return { gratitudeItemEntries };
};

const useGratitudeItems = () => {
  const { data: gratitudeItemEntries } = useQuery<GratitudeItemRecord>(
    `SELECT *
     FROM ${GRATITUDE_ITEM_TABLE}`
  );

  console.log("Gratitude items:", gratitudeItemEntries);

  return { gratitudeItemEntries };
};

export { useGratitudeItemsByGratitudeId, useGratitudeItems };

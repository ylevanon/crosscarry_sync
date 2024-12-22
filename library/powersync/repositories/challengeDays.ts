// import { useQuery } from "@powersync/react-native";

// import { CHALLENGE_DAYS_TABLE, ChallengeDayRecord } from "../AppSchema";

// const useCurrentChallengeDay = (challengeId: string, today: string) => {
//   const { data: currentDayData } = useQuery<ChallengeDayRecord>(
//     `SELECT *
//      FROM ${CHALLENGE_DAYS_TABLE}
//      WHERE challenge_id = ?
//      AND date <= ?
//      ORDER BY date DESC
//      LIMIT 1`,
//     [challengeId, today]
//   );

//   const currentDay = currentDayData?.[0];

//   return { currentDay };
// };

// export { useCurrentChallengeDay };

import { useQuery } from "@powersync/react-native";

import { CHALLENGE_DAYS_TABLE, ChallengeDayRecord } from "../AppSchema";

const useCurrentChallengeDay = (challengeId: string, today: string) => {
  const { data: currentDayData } = useQuery<ChallengeDayRecord>(
    `SELECT *
     FROM ${CHALLENGE_DAYS_TABLE} 
     WHERE challenge_id = ? 
     AND date LIKE ?`,
    [challengeId, `${today}%`]
  );

  const currentDay = currentDayData?.[0];

  return { currentDay };
};

export { useCurrentChallengeDay };

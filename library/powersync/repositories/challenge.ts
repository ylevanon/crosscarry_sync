import { useQuery } from "@powersync/react-native";

import { ChallengeRecord, CHALLENGES_TABLE } from "../AppSchema";

const useChallenges = () => {
  // Fetch active challenge and its current day
  const { data: challenges } = useQuery<ChallengeRecord>(
    `SELECT * FROM ${CHALLENGES_TABLE} WHERE status = 'active' ORDER BY created_at DESC LIMIT 1`
  );

  const activeChallenge = challenges?.[0];

  const { data: allChallenges } = useQuery<ChallengeRecord>(`SELECT * FROM ${CHALLENGES_TABLE}`);

  return { activeChallenge, allChallenges };
};

export default useChallenges;

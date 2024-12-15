import { useQuery } from "@powersync/react-native";
import React from "react";
import { ScrollView, View } from "react-native";

import {
  CHALLENGES_TABLE,
  PROFILE_TABLE,
  ChallengeRecord,
  ProfileRecord,
} from "../../library/powersync/AppSchema";
import { CalendarWidget } from "../../library/widgets/CalendarWidget";

const CalendarView = () => {
  const { data: challenges } = useQuery<ChallengeRecord>(
    `SELECT * FROM ${CHALLENGES_TABLE} WHERE status = 'active' ORDER BY created_at DESC LIMIT 1`
  );
  const { data: profiles } = useQuery<ProfileRecord>(`SELECT * FROM ${PROFILE_TABLE}`);

  const activeChallenge = challenges?.[0];
  const userProfile = profiles?.[0];

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView className="flex-1 bg-neutral-800 pt-4">
        <CalendarWidget challenge={activeChallenge} profile={userProfile} />
      </ScrollView>
    </View>
  );
};

export default CalendarView;

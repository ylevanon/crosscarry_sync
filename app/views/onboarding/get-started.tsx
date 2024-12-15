import { router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { CHALLENGES_TABLE } from "../../../library/powersync/AppSchema";
import { useSystem } from "../../../library/powersync/system";
import { AnimatedButton } from "../../../library/widgets/AnimatedButton";

export default function GetStartedScreen() {
  const system = useSystem();

  const createNewChallenge = async () => {
    const { userID } = await system.supabaseConnector.fetchCredentials();

    const startDate = new Date().toISOString();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 40); // 40-day challenge

    const res = await system.powersync.execute(
      `INSERT INTO ${CHALLENGES_TABLE} (
        id, profile_id, type, duration_days, created_at, updated_at, 
        start_date, end_date, status
      ) VALUES (
        uuid(), ?, 'standard', 40, datetime(), datetime(), 
        ?, ?, 'active'
      ) RETURNING *`,
      [userID, startDate, endDate.toISOString()]
    );

    const resultRecord = res.rows?.item(0);
    if (!resultRecord) {
      throw new Error("Could not create challenge");
    }
    return resultRecord;
  };

  const handleComplete = async () => {
    await createNewChallenge();
    router.replace("/views/todos/lists");
  };

  return (
    <View className="flex-1 items-center justify-center px-8">
      <Animated.View entering={FadeIn.duration(1000)} className="items-center space-y-4">
        <Text className="font-lemon-milk-bold text-center text-4xl text-white">
          You're all set!
        </Text>
        <Text className="font-inter text-center text-neutral-400">
          Time to start your fitness journey with CrossCarry
        </Text>
      </Animated.View>

      <View className="absolute bottom-12 w-full px-8">
        <AnimatedButton
          onPress={handleComplete}
          className="bg-primary items-center justify-center rounded-lg py-3"
        >
          <Text className="font-inter-semi text-white">Start Challenge!</Text>
        </AnimatedButton>
      </View>
    </View>
  );
}

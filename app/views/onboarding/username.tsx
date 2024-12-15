import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Image } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { PROFILE_TABLE } from "../../../library/powersync/AppSchema";
import { useSystem } from "../../../library/powersync/system";
import { AnimatedButton } from "../../../library/widgets/AnimatedButton";

export default function UsernameScreen() {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const system = useSystem();

  const handleSubmit = async () => {
    if (!username.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { userID } = await system.supabaseConnector.fetchCredentials();
      if (!userID) throw new Error("No user ID found");

      await system.powersync.execute(
        `UPDATE ${PROFILE_TABLE} SET username = ?, updated_at = datetime('now') WHERE id = ?`,
        [username, userID]
      );

      router.push("/views/onboarding/get-started");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push("/views/onboarding/get-started");
  };

  return (
    <View className="flex-1 items-center justify-center px-8">
      <Animated.View entering={FadeIn.duration(1000)} className="w-full items-center space-y-8">
        <Image
          source={require("../../../assets/pngs/FOLLOW40-Logos-08.png")}
          className="mb-8 h-60 w-60"
          resizeMode="contain"
        />

        <View className="items-center space-y-4">
          <Text className="font-lemon-milk-bold text-center text-3xl text-white">
            What should we call you?
          </Text>
          <Text className="font-inter text-center text-neutral-400">
            Choose a username for your profile
          </Text>
        </View>

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor="#666"
          className="font-inter w-full rounded-lg bg-neutral-800 px-4 py-3 text-white"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </Animated.View>

      <View className="absolute bottom-12 w-full space-y-4">
        <AnimatedButton
          onPress={handleSubmit}
          disabled={!username.trim() || isSubmitting}
          className="bg-primary items-center justify-center rounded-lg py-3"
        >
          <Text className="font-inter-semi text-white">Continue</Text>
        </AnimatedButton>

        <AnimatedButton
          onPress={handleSkip}
          disabled={isSubmitting}
          className="items-center justify-center rounded-lg bg-neutral-800 py-3"
        >
          <Text className="font-inter-semi text-white">Skip for now</Text>
        </AnimatedButton>
      </View>
    </View>
  );
}

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

      router.navigate("/views/onboarding/get-started");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.navigate("/views/onboarding/get-started");
  };

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="flex-1 items-center justify-center px-8"
    >
      <View className="w-full items-center space-y-8">
        <Image
          source={require("../../../assets/pngs/FOLLOW40-Logos-08.png")}
          className="mb-8 h-60 w-60"
          resizeMode="contain"
        />

        <View className="items-center space-y-4">
          <Text className="text-center font-lemon-milk-bold text-3xl text-white">
            What should we call you?
          </Text>
          <Text className="font-inter text-center text-neutral-400">
            Choose a username for your profile
          </Text>
        </View>

        <TextInput
          className="font-inter h-12 w-full rounded-lg bg-neutral-800 px-4 text-white"
          placeholder="Enter username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View className="absolute bottom-12 w-full space-y-4">
        <AnimatedButton
          onPress={handleSubmit}
          disabled={!username.trim() || isSubmitting}
          className="items-center justify-center rounded-lg bg-primary py-3"
        >
          <Text className="font-inter-semi text-white">Continue</Text>
        </AnimatedButton>

        <AnimatedButton
          onPress={handleSkip}
          className="items-center justify-center rounded-lg py-3"
        >
          <Text className="font-inter-semi text-neutral-400">Skip for now</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
  );
}

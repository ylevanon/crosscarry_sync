import { router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AnimatedButton } from "../../../library/widgets/AnimatedButton";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Animated.View entering={FadeIn.duration(1000)} className="items-center space-y-4">
        <Text className="font-lemon-milk-bold text-center text-4xl text-white">
          Welcome to CrossCarry
        </Text>
        <Text className="font-inter text-center text-neutral-400">
          Your personal fitness companion. Let's get you set up!
        </Text>
      </Animated.View>

      <View className="absolute bottom-12 w-full px-8">
        <AnimatedButton
          onPress={() => router.push("/views/onboarding/username")}
          className="bg-primary"
        >
          Get Started
        </AnimatedButton>
      </View>
    </View>
  );
}

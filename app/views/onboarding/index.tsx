import { router } from "expo-router";
import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AnimatedButton } from "../../../library/widgets/AnimatedButton";

export default function WelcomeScreen() {
  const handleNavigate = () => {
    router.navigate("/views/onboarding/username");
  };

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="flex-1 items-center justify-center px-8"
    >
      <View className="items-center space-y-4">
        <Image
          source={require("../../../assets/pngs/FOLLOW40-Logos-08.png")}
          className="mb-8 h-60 w-60"
          resizeMode="contain"
        />
        <Text className="text-center font-lemon-milk-bold text-2xl text-white">
          Welcome to CrossCarry
        </Text>
        <Text className="text-center font-lemon-milk text-base text-gray-300">
          Your personal fitness companion. Let's get you set up!
        </Text>
      </View>

      <View className="absolute bottom-12 w-full">
        <AnimatedButton
          onPress={handleNavigate}
          className="items-center justify-center rounded-lg bg-primary py-3"
        >
          <Text className="font-inter-semi text-white">Get Started</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
  );
}

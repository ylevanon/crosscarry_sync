import { router } from "expo-router";
import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AnimatedButton } from "../../../library/widgets/AnimatedButton";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Animated.View entering={FadeIn.duration(1000)} className="items-center space-y-4">
        <Image
          source={require("../../../assets/pngs/FOLLOW40-Logos-08.png")}
          className="mb-8 h-60 w-60"
          resizeMode="contain"
        />
        <Text className="font-lemon-milk-bold text-center text-2xl text-white">
          Welcome to CrossCarry
        </Text>
        <Text className="text-center font-lemon-milk text-base text-gray-300">
          Your personal fitness companion. Let's get you set up!
        </Text>
      </Animated.View>

      <View className="absolute bottom-12 w-full">
        <AnimatedButton
          onPress={() => router.push("/views/onboarding/username")}
          className="bg-primary items-center justify-center rounded-lg py-3"
        >
          <Text className="font-inter-semi text-white">Get Started</Text>
        </AnimatedButton>
      </View>
    </View>
  );
}

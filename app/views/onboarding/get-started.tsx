import { router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AnimatedButton } from "../../../library/widgets/AnimatedButton";

export default function GetStartedScreen() {
  const handleComplete = () => {
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
        <AnimatedButton onPress={handleComplete} className="bg-primary">
          Let's go!
        </AnimatedButton>
      </View>
    </View>
  );
}

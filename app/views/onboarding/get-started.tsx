import { router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AnimatedButton } from "../../../library/widgets/AnimatedButton";

export default function GetStartedScreen() {
  const handleComplete = async () => {
    // await createNewChallenge();
    router.replace("/views/todos/lists");
  };

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="flex-1 items-center justify-center px-8"
    >
      <View className="items-center space-y-4">
        <Text className="text-center font-lemon-milk-bold text-4xl text-white">
          You're all set!
        </Text>
        <Text className="font-inter text-center text-neutral-400">
          Time to start your fitness journey with CrossCarry
        </Text>
      </View>

      <View className="absolute bottom-12 w-full">
        <AnimatedButton
          onPress={handleComplete}
          className="items-center justify-center rounded-lg bg-primary py-3"
        >
          <Text className="font-inter-semi text-white">Let's Go!</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
  );
}

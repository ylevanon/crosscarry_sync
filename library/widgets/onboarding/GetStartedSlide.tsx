import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { AnimatedButton } from "../AnimatedButton";

interface GetStartedSlideProps {
  width: number;
  onGetStarted: () => void;
}

export const GetStartedSlide: React.FC<GetStartedSlideProps> = ({ width, onGetStarted }) => {
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="items-center justify-center px-5"
      style={{ width }}
    >
      <Image
        source={require("../../../assets/pngs/FOLLOW40-Logos-08.png")}
        className="mb-8 h-60 w-full"
        resizeMode="contain"
      />
      <Text className="font-lemon-milk-bold mb-4 text-center text-2xl text-white">
        Let's Get Started!
      </Text>
      <Text className="mb-8 text-center font-lemon-milk text-base text-gray-300">
        Your fitness journey begins now. Track your workouts, connect with others, and achieve your
        goals!
      </Text>
      <View className="w-full">
        <AnimatedButton onPress={onGetStarted} className="bg-primary rounded-lg px-4 py-3">
          <Text className="text-center font-lemon-milk text-lg text-white">Start Your Journey</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
  );
};

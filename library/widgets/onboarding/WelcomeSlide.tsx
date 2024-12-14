import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface WelcomeSlideProps {
  width: number;
}

export const WelcomeSlide: React.FC<WelcomeSlideProps> = ({ width }) => {
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
        Welcome to Follow 40
      </Text>
      <Text className="text-center font-lemon-milk text-base text-gray-300">
        Your journey to better fitness starts here. Track your workouts, set goals, and crush them!
      </Text>
    </Animated.View>
  );
};

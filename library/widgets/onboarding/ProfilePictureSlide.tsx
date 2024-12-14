import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { AnimatedButton } from "../AnimatedButton";

interface ProfilePictureSlideProps {
  width: number;
  onPictureSelect: (uri: string) => void;
  onSkip: () => void;
}

export const ProfilePictureSlide: React.FC<ProfilePictureSlideProps> = ({
  width,
  onPictureSelect,
  onSkip,
}) => {
  // Temporarily disabled image picker functionality
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="items-center justify-center px-5"
      style={{ width }}
    >
      <Text className="font-lemon-milk-bold mb-4 text-center text-2xl text-white">
        Profile Picture Coming Soon
      </Text>
      <Text className="mb-8 text-center font-lemon-milk text-base text-gray-300">
        This feature will be available in a future update
      </Text>
      <View className="w-full space-y-4">
        <AnimatedButton onPress={onSkip} className="bg-primary rounded-lg px-4 py-3">
          <Text className="text-center font-lemon-milk text-lg text-white">Continue</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
  );
};

import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { AnimatedButton } from "../AnimatedButton";

interface UsernameSlideProps {
  width: number;
  onUsernameSubmit: (username: string) => Promise<void>;
  onSkip: () => void;
}

export const UsernameSlide: React.FC<UsernameSlideProps> = ({
  width,
  onUsernameSubmit,
  onSkip,
}) => {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onUsernameSubmit(username.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="items-center justify-center px-5"
      style={{ width }}
    >
      <Text className="font-lemon-milk-bold mb-4 text-center text-2xl text-white">
        Choose Your Username
      </Text>
      <Text className="mb-8 text-center font-lemon-milk text-base text-gray-300">
        Pick a unique username for your fitness journey
      </Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        placeholderTextColor="#666"
        className="mb-4 w-full rounded-lg bg-neutral-800 px-4 py-3 font-lemon-milk text-white"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View className="w-full space-y-4">
        <AnimatedButton
          onPress={handleSubmit}
          className="bg-primary rounded-lg px-4 py-3"
          disabled={!username.trim() || isSubmitting}
        >
          <Text className="text-center font-lemon-milk text-lg text-white">
            {isSubmitting ? "Saving..." : "Continue"}
          </Text>
        </AnimatedButton>
        <AnimatedButton onPress={onSkip} className="rounded-lg bg-neutral-800 px-4 py-3">
          <Text className="text-center font-lemon-milk text-lg text-gray-300">Skip for now</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
  );
};

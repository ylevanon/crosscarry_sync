import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
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
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
      onPictureSelect(result.assets[0].uri);
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
        Add a Profile Picture
      </Text>
      <Text className="mb-8 text-center font-lemon-milk text-base text-gray-300">
        Show yourself to the community
      </Text>
      <TouchableOpacity onPress={handleImagePick} className="mb-8 items-center justify-center">
        <View className="mb-4 h-32 w-32 items-center justify-center rounded-full bg-neutral-800">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="h-32 w-32 rounded-full" />
          ) : (
            <Text className="font-lemon-milk text-gray-300">Tap to select</Text>
          )}
        </View>
      </TouchableOpacity>
      <View className="w-full space-y-4">
        <AnimatedButton
          onPress={() => imageUri && onPictureSelect(imageUri)}
          className="bg-primary rounded-lg px-4 py-3"
          disabled={!imageUri}
        >
          <Text className="text-center font-lemon-milk text-lg text-white">Continue</Text>
        </AnimatedButton>
        <AnimatedButton onPress={onSkip} className="rounded-lg bg-neutral-800 px-4 py-3">
          <Text className="text-center font-lemon-milk text-lg text-gray-300">Skip for now</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
  );
};

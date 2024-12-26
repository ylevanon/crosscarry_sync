import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface ImageWidgetProps {
  title?: string;
  subtitle?: string;
  imageUri?: string;
  onPress?: () => void;
  height?: number;
}

export const ImageWidget = ({
  title,
  subtitle,
  imageUri,
  onPress,
  height = 200,
}: ImageWidgetProps) => {
  return (
    <Pressable className="rounded-lg bg-neutral-800" onPress={onPress} disabled={!onPress}>
      {imageUri ? (
        <Image
          source={{ uri: FileSystem.documentDirectory + imageUri }}
          className="w-full rounded-lg object-cover"
          style={{ height }}
        />
      ) : (
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="mb-1 font-['LemonMilkMedium'] text-xl text-white">{title}</Text>
              <Text className="text-neutral-400">{subtitle}</Text>
            </View>
            <Ionicons name="image" size={24} color="#DC1E1E" />
          </View>
        </View>
      )}
    </Pressable>
  );
};

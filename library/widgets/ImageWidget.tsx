import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, Text, View, ActionSheetIOS } from "react-native";

import { CameraWidget } from "./CameraWidget";

interface ImageWidgetProps {
  imageUri?: string;
  onUpdatePhoto: (base64: string) => void;
  disabled?: boolean;
}

export const ImageWidget = ({ imageUri, onUpdatePhoto, disabled = false }: ImageWidgetProps) => {
  const [showCamera, setShowCamera] = useState(false);

  const pickImage = async () => {
    if (disabled) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        await onUpdatePhoto(result.assets[0].base64);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleEditPress = () => {
    if (disabled) return;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Take Photo", "Choose from Library"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          setShowCamera(true);
        } else if (buttonIndex === 2) {
          pickImage();
        }
      }
    );
  };

  if (showCamera) {
    return (
      <CameraWidget
        onSave={async (photo) => {
          if (photo.base64) {
            await onUpdatePhoto(photo.base64);
          }
          setShowCamera(false);
        }}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <View className="relative">
      {imageUri ? (
        <Image
          source={{ uri: FileSystem.documentDirectory + imageUri }}
          className="w-full rounded-lg object-cover"
          style={{ height: 200 }}
        />
      ) : (
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="mb-1 font-['LemonMilkMedium'] text-xl text-white">No Image</Text>
              <Text className="text-neutral-400">Tap the edit button to add an image</Text>
            </View>
            <Ionicons name="image" size={24} color="#DC1E1E" />
          </View>
        </View>
      )}
      <Pressable
        onPress={handleEditPress}
        className="absolute bottom-2 right-2 rounded-full bg-neutral-700 p-1.5"
        disabled={disabled}
      >
        <Ionicons name="pencil" size={16} color={disabled ? "#666" : "#DC1E1E"} />
      </Pressable>
    </View>
  );
};

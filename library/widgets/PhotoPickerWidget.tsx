import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import { Text, View, ActionSheetIOS, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { CameraWidget } from "./CameraWidget";

interface PhotoPickerWidgetProps {
  title?: string;
  subtitle?: string;
  onPhotoSelected: (base64: string) => void;
  disabled?: boolean;
}

export const PhotoPickerWidget = ({
  title = "Add Photo",
  subtitle = "Upload a photo",
  onPhotoSelected,
  disabled = false,
}: PhotoPickerWidgetProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const pressed = useSharedValue(false);
  const scale = useSharedValue(1);

  const handlePhotoPress = () => {
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
        await onPhotoSelected(result.assets[0].base64);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const tap = useMemo(
    () =>
      Gesture.Tap()
        .onBegin(() => {
          "worklet";
          pressed.value = true;
          scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        })
        .onFinalize(() => {
          "worklet";
          pressed.value = false;
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
          runOnJS(handlePhotoPress)();
        }),
    [scale, pressed]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (showCamera) {
    return (
      <CameraWidget
        onSave={async (photo) => {
          if (photo.base64) {
            await onPhotoSelected(photo.base64);
          }
          setShowCamera(false);
        }}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <View className="mx-4 mt-6">
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle}>
          <Pressable
            className={`rounded-lg bg-neutral-800 p-4 ${disabled ? "opacity-50" : ""}`}
            onPress={handlePhotoPress}
            disabled={disabled}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="mb-1 font-['LemonMilkMedium'] text-xl text-white">{title}</Text>
                <Text className="text-neutral-400">{subtitle}</Text>
              </View>
              <Ionicons name="camera" size={24} color={disabled ? "#666" : "#DC1E1E"} />
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

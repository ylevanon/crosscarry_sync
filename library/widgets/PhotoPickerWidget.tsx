import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import { Text, View, ActionSheetIOS } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { CameraWidget } from "./CameraWidget";
import { colors } from "../theme/colors";

interface PhotoPickerWidgetProps {
  title: string;
  subtitle?: string;
  onPhotoSelected: (base64: string) => Promise<void>;
}

export const PhotoPickerWidget: React.FC<PhotoPickerWidgetProps> = ({
  title,
  subtitle,
  onPhotoSelected,
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const pressed = useSharedValue(false);
  const scale = useSharedValue(1);

  const handlePhotoPress = () => {
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
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      // Pick the image
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
          <View
            className="flex-row items-center justify-between rounded-xl p-4"
            style={{
              backgroundColor: colors.neutral[700],
            }}
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-neutral-800">
                <Ionicons name="camera" size={18} color="#DC1E1E" />
              </View>
              <View>
                <Text className="text-base text-white">{title}</Text>
                {subtitle && <Text className="text-sm text-gray-400">{subtitle}</Text>}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

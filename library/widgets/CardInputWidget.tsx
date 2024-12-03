import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import prompt from "react-native-prompt-android";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface CardInputWidgetProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const CardInputWidget: React.FC<CardInputWidgetProps> = ({
  title,
  subtitle,
  placeholder,
  value,
  onChangeText,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);

  const showPrompt = () => {
    prompt(
      title,
      subtitle,
      (text) => {
        if (text) {
          onChangeText(text);
          setIsPressed(true);
        }
      },
      {
        placeholder: placeholder || "Enter text...",
        defaultValue: value,
        style: "shimo",
      }
    );
  };

  const tap = Gesture.Tap()
    .onBegin(() => {
      "worklet";
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      "worklet";
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      runOnJS(showPrompt)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const hasContent = value.length > 0;

  return (
    <View className="mx-4 my-1">
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle}>
          <View className={`rounded-xl p-4 ${hasContent ? "bg-green-500" : "bg-gray-200"}`}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className={`text-xl font-medium ${hasContent ? "text-white" : "text-gray-900"}`}
                >
                  {value || title}
                </Text>
                {subtitle && (
                  <Text
                    className={`mt-0.5 text-sm ${hasContent ? "text-white/80" : "text-gray-600"}`}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
              <View className={`rounded-lg p-2 ${hasContent ? "bg-white/20" : "bg-white/50"}`}>
                <Ionicons
                  name={hasContent ? "checkmark" : "create-outline"}
                  size={18}
                  color={hasContent ? "white" : "#4B5563"}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

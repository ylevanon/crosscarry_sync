import React, { useState } from "react";
import { TextInput, View, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface AnimatedTextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const AnimatedTextInput: React.FC<AnimatedTextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFocus = () => {
    "worklet";
    scale.value = withSpring(1.02, { damping: 15, stiffness: 400 });
    setIsFocused(true);
  };

  const handleBlur = () => {
    "worklet";
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    setIsFocused(false);
  };

  const hasContent = value.length > 0;

  return (
    <View className="mx-4 my-2">
      {label && <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>}
      <Animated.View style={animatedStyle}>
        <View
          className={`overflow-hidden rounded-xl border-2 transition-colors ${
            hasContent
              ? "border-green-500 bg-green-50"
              : isFocused
                ? "border-gray-400 bg-white"
                : "border-gray-200 bg-gray-50"
          }`}
        >
          <TextInput
            className={`px-4 py-3 text-base ${hasContent ? "text-green-700" : "text-gray-900"}`}
            placeholder={placeholder}
            placeholderTextColor={hasContent ? "#059669" : "#9CA3AF"}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>
      </Animated.View>
    </View>
  );
};

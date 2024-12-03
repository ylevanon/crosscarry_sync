import React from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";

interface ProgressRingWidgetProps {
  progress: number; // 0 to 1
  size?: number;
}

export const ProgressRingWidget: React.FC<ProgressRingWidgetProps> = ({ progress, size = 110 }) => {
  const rotation = useSharedValue(0);
  const progressValue = Math.min(Math.max(progress, 0), 1);

  useAnimatedReaction(
    () => progressValue,
    (value) => {
      rotation.value = withTiming(value * 360, { duration: 500 });
    },
    [progressValue]
  );

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 10,
      borderColor: "#22C55E",
      borderTopColor: "#E5E7EB",
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View className="items-center justify-center">
      <Animated.View style={progressStyle} />
      <View className="absolute items-center">
        <Text className="text-3xl font-bold text-gray-900">{Math.round(progressValue * 100)}%</Text>
        <Text className="text-sm text-gray-500">Complete</Text>
      </View>
    </View>
  );
};

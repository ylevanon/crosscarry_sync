import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface StreakProgressWidgetProps {
  streak: number;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  size?: number;
}

export const StreakProgressWidget: React.FC<StreakProgressWidgetProps> = ({
  streak,
  progress,
  completedTasks,
  totalTasks,
  size = 140,
}) => {
  const progressValue = Math.min(Math.max(progress, 0), 1);

  // Background circle style (gray)
  const backgroundStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 12,
    borderColor: "#E5E7EB",
  }));

  // Progress circle style (green)
  const progressStyle = useAnimatedStyle(() => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 12,
    borderColor: "transparent",
    transform: [{ rotate: "-90deg" }], // Start at 12 o'clock
    borderTopColor: progressValue > 0 ? "#22C55E" : "transparent",
    borderRightColor: progressValue >= 0.25 ? "#22C55E" : "transparent",
    borderBottomColor: progressValue >= 0.5 ? "#22C55E" : "transparent",
    borderLeftColor: progressValue >= 0.75 ? "#22C55E" : "transparent",
  }));

  return (
    <View className="mx-4 flex-row items-center justify-between rounded-2xl bg-gray-100 p-4">
      {/* Left side: Stats */}
      <View className="flex-1 justify-center pr-4">
        <View className="flex-row items-center">
          <Ionicons name="flame" size={24} color="#4B5563" />
          <Text className="ml-2 text-2xl font-bold text-gray-900">{streak} Days</Text>
        </View>
        <Text className="mt-2 text-base text-gray-600">
          {completedTasks}/{totalTasks} Tasks Complete
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          {Math.round(progressValue * 100)}% Daily Progress
        </Text>
      </View>

      {/* Right side: Progress Ring */}
      <View className="items-center justify-center">
        <Animated.View style={backgroundStyle} />
        <Animated.View style={progressStyle} />
      </View>
    </View>
  );
};

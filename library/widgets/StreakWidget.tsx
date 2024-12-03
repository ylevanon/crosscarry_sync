import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";

interface StreakWidgetProps {
  count: number;
  isComplete?: boolean;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ count, isComplete = false }) => {
  return (
    <View
      className={`h-32 w-32 items-center justify-center rounded-2xl ${
        isComplete ? "bg-green-500" : "bg-gray-100"
      }`}
    >
      <Ionicons name="flame" size={32} color={isComplete ? "#ffffff" : "#4B5563"} />
      <Text className={`mt-2 text-xl font-bold ${isComplete ? "text-white" : "text-gray-600"}`}>
        {count} Days
      </Text>
    </View>
  );
};

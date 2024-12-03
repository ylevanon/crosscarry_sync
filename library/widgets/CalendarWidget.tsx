import React from "react";
import { View, Text } from "react-native";

interface CalendarWidgetProps {
  title?: string;
  days?: number;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  title = "40 Days Challenge",
  days = 40,
}) => {
  // Create array of numbers from 1 to days
  const totalDays = Array.from({ length: days }, (_, i) => i + 1);

  // Function to get random completion status
  const getRandomStatus = () => Math.random() > 0.5;

  return (
    <View className="mx-4 my-4">
      <Text className="mb-6 text-center text-2xl font-bold text-gray-900">{title}</Text>
      <View className="flex-row flex-wrap justify-center gap-3">
        {totalDays.map((day) => {
          const isCompleted = getRandomStatus();
          return (
            <View
              key={day}
              className={`h-14 w-14 items-center justify-center rounded-xl ${
                isCompleted ? "bg-green-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-base font-medium ${isCompleted ? "text-white" : "text-gray-600"}`}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

import React from "react";
import { View, Text } from "react-native";

import { colors } from "../theme/colors";
import { ChallengeRecord, ProfileRecord } from "../powersync/AppSchema";

interface CalendarWidgetProps {
  challenge?: ChallengeRecord;
  profile?: ProfileRecord;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  challenge,
  profile,
}) => {
  if (!challenge || !profile) {
    return null;
  }

  // Create array of numbers from 1 to days
  const totalDays = Array.from({ length: challenge.duration_days }, (_, i) => i + 1);

  return (
    <View className="mx-4 my-1">
      <View
        style={{
          backgroundColor: colors.neutral[700],
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Text className="mb-6 text-center font-lemon-milk text-xl text-white">
          {profile.username}'s {challenge.duration_days} Days Challenge
        </Text>
        <View className="flex-row flex-wrap justify-center gap-3">
          {totalDays.map((day) => {
            const isCompleted = false; // We'll implement this later
            return (
              <View
                key={day}
                className={`h-14 w-14 items-center justify-center rounded-xl ${
                  isCompleted ? "bg-primary" : "bg-neutral-600"
                }`}
              >
                <Text
                  className={`font-inter-semi text-base ${isCompleted ? "text-white" : "text-neutral-400"}`}
                >
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

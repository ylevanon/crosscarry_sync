import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable } from "react-native";

import { GratitudeItemRecord } from "../powersync/AppSchema";
import { colors } from "../theme/colors";

interface ListItemWidgetProps {
  item: GratitudeItemRecord;
  onRemove: (id: string) => void;
}

export const ListItemWidget: React.FC<ListItemWidgetProps> = ({ item, onRemove }) => {
  return (
    <View className="mx-4 mt-6">
      <Pressable
        onPress={() => onRemove(item.id)}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View
          className="rounded-xl p-4"
          style={{
            backgroundColor: colors.achievement.gold,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-normal" style={{ color: colors.neutral[900] }}>
              • {item.description}
            </Text>
            <Ionicons name="close-circle" size={20} color={colors.neutral[700]} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

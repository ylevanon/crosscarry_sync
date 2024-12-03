import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface CheckboxWidgetProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export const CheckboxWidget: React.FC<CheckboxWidgetProps> = ({ title, subtitle, onPress }) => {
  return (
    <View className="mx-4 my-1">
      <Pressable onPress={onPress} className="rounded-xl bg-orange-500 p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-medium text-red-500">{title}</Text>
            {subtitle && <Text className="mt-0.5 text-sm text-white/80">{subtitle}</Text>}
          </View>
          <View className="rounded-lg bg-white/20 p-2">
            <Ionicons name="compass-outline" size={18} color="white" />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

import { Ionicons } from "@expo/vector-icons";
import { useStatus } from "@powersync/react";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, Pressable, Alert } from "react-native";

import { useSystem } from "../powersync/system";

interface HeaderWidgetProps {
  title?: string;
}

export const HeaderWidget: React.FC<HeaderWidgetProps> = ({ title }) => {
  const system = useSystem();
  const { powersync } = system;
  const navigation = useNavigation();
  const status = useStatus();

  return (
    <View className="h-16 flex-row items-center justify-between bg-purple-600 px-4 shadow-md">
      {/* Left Component */}
      <Pressable
        className="p-2"
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}
      >
        <Ionicons name="menu" size={24} color="white" />
      </Pressable>

      {/* Center Component */}
      <View className="flex-1 items-center">
        <Text className="text-lg font-semibold text-white">{title}</Text>
      </View>

      {/* Right Component */}
      <Pressable
        className="p-2"
        onPress={() => {
          if (system.attachmentQueue) {
            system.attachmentQueue.trigger();
          }
          Alert.alert(
            "Status",
            `${status.connected ? "Connected" : "Disconnected"}. \nLast Synced at ${
              status?.lastSyncedAt?.toISOString() ?? "-"
            }\nVersion: ${powersync.sdkVersion}`,
          );
        }}
      >
        <Ionicons
          name={status.connected ? 'navigate' : 'navigate-outline'}
          size={24}
          color="white"
        />
      </Pressable>
    </View>
  );
};

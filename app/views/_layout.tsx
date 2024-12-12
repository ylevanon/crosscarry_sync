import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { defaultHeaderConfig } from "../../library/constants/headerConfig";
import { useSystem } from "../../library/powersync/system";
import { colors } from "../../library/theme/colors";

const Layout = () => {
  const system = useSystem();

  React.useEffect(() => {
    system.init();
  }, []);

  return (
    <View className="flex-1 bg-neutral-900">
      <Tabs
        screenOptions={{
          ...defaultHeaderConfig,
          headerStyle: {
            backgroundColor: colors.neutral[900],
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "LemonMilkBold",
          },
          tabBarStyle: {
            backgroundColor: colors.neutral[900],
            borderTopWidth: 1,
            borderTopColor: colors.neutral[700],
            elevation: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.neutral[500],
        }}
      >
        <Tabs.Screen
          name="onboarding"
          options={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="todos"
          options={{
            headerShown: false,
            tabBarLabel: "Lists",
            tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            tabBarLabel: "Calendar",
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="streak"
          options={{
            title: "Streak",
            tabBarLabel: "Streak",
            tabBarIcon: ({ color, size }) => <Ionicons name="flame" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="console"
          options={{
            title: "SQL Console",
            tabBarLabel: "Console",
            tabBarIcon: ({ color, size }) => <Ionicons name="code" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
};

export default Layout;

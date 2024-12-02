import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { defaultHeaderConfig } from "../../library/constants/headerConfig";
import { useSystem } from "../../library/powersync/system";

const Layout = () => {
  const system = useSystem();

  React.useEffect(() => {
    system.init();
  }, []);

  return (
    <Tabs
      screenOptions={{
        ...defaultHeaderConfig,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
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
        name="console"
        options={{
          title: "SQL Console",
          tabBarLabel: "Console",
          tabBarIcon: ({ color, size }) => <Ionicons name="code" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="signout"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;

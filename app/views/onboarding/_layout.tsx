import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function OnboardingLayout() {
  return (
    <View className="flex-1 bg-neutral-900">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="username" />
        <Stack.Screen name="get-started" />
      </Stack>
    </View>
  );
}

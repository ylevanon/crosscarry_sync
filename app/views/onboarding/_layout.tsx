import { Stack } from "expo-router";
import { View } from "react-native";

export default function OnboardingLayout() {
  return (
    <View className="flex-1 bg-neutral-900">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="username" />
        <Stack.Screen name="get-started" />
      </Stack>
    </View>
  );
}

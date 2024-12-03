import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface CheckboxWidgetProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export const CheckboxWidget: React.FC<CheckboxWidgetProps> = ({ title, subtitle, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressed = useSharedValue(false);
  const scale = useSharedValue(1);

  const tap = Gesture.Tap()
    .onBegin(() => {
      "worklet";
      pressed.value = true;
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      "worklet";
      pressed.value = false;
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      // State updates and callbacks need to run on JS thread
      runOnJS(setIsPressed)(!isPressed);
      runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="mx-4 my-1">
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle}>
          <View className={`rounded-xl p-4 ${isPressed ? "bg-green-500" : "bg-gray-200"}`}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className={`text-xl font-medium ${isPressed ? "text-white" : "text-gray-900"}`}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    className={`mt-0.5 text-sm ${isPressed ? "text-white/80" : "text-gray-600"}`}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
              <View className={`rounded-lg p-2 ${isPressed ? "bg-white/20" : "bg-white/50"}`}>
                <Ionicons
                  name="compass-outline"
                  size={18}
                  color={isPressed ? "white" : "#4B5563"}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

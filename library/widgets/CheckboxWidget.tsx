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

import { colors } from "../theme/colors";

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
          <View 
            style={{ 
              backgroundColor: isPressed ? colors.achievement.gold : colors.neutral[700],
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  style={{
                    fontFamily: 'LemonMilkMedium',
                    fontSize: 20,
                    color: isPressed ? colors.neutral[900] : '#fff',
                  }}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    style={{
                      color: isPressed ? colors.neutral[800] : colors.neutral[400],
                      marginTop: 2,
                    }}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
              <Ionicons
                name={isPressed ? "checkmark-circle" : "checkmark-circle-outline"}
                size={24}
                color={isPressed ? colors.neutral[900] : colors.neutral[500]}
              />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
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
  defaultChecked?: boolean;
}

export const CheckboxWidget: React.FC<CheckboxWidgetProps> = ({
  title,
  subtitle,
  onPress,
  defaultChecked = false,
}) => {
  const pressed = useSharedValue(false);
  const scale = useSharedValue(1);

  const tap = useMemo(
    () =>
      Gesture.Tap()
        .onBegin(() => {
          "worklet";
          pressed.value = true;
          scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        })
        .onFinalize(() => {
          "worklet";
          pressed.value = false;
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
          runOnJS(onPress)();
        }),
    [onPress, scale, pressed]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="mx-4 mt-6">
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle}>
          <View
            className="rounded-xl p-4"
            style={{
              backgroundColor: defaultChecked ? colors.achievement.gold : colors.neutral[700],
            }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="mb-0.5 font-['LemonMilkMedium'] text-lg"
                  style={{ color: defaultChecked ? colors.neutral[900] : colors.neutral[100] }}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    style={{
                      color: defaultChecked ? colors.neutral[900] : colors.neutral[400],
                    }}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
              <Ionicons
                name={defaultChecked ? "checkmark-circle" : "checkmark-circle-outline"}
                size={24}
                color={defaultChecked ? colors.neutral[900] : colors.neutral[400]}
              />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

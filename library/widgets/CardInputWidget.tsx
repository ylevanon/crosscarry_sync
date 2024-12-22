import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import prompt from "react-native-prompt-android";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { colors } from "../theme/colors";

interface CardInputWidgetProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeText: (text: string) => void;
}

export const CardInputWidget: React.FC<CardInputWidgetProps> = ({
  title,
  subtitle,
  placeholder,
  value,
  defaultValue = "",
  onChangeText,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (defaultValue) {
      onChangeText(defaultValue);
      setIsPressed(true);
    }
  }, [defaultValue]);

  const showPrompt = () => {
    prompt(
      title,
      subtitle,
      (text) => {
        if (text) {
          onChangeText(text);
          setIsPressed(true);
        }
      },
      {
        placeholder: placeholder || "Enter text...",
        defaultValue: value || defaultValue,
        style: "shimo",
      }
    );
  };

  const tap = useMemo(
    () =>
      Gesture.Tap()
        .onBegin(() => {
          "worklet";
          scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        })
        .onFinalize(() => {
          "worklet";
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
          runOnJS(showPrompt)();
        }),
    [scale, showPrompt]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const hasValue = Boolean(value || defaultValue);

  return (
    <View className="mx-4 mt-6">
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle}>
          <View
            style={{
              backgroundColor: hasValue ? colors.achievement.gold : colors.neutral[700],
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                {hasValue ? (
                  <>
                    <Text
                      style={{
                        fontFamily: "LemonMilkMedium",
                        fontSize: 14,
                        color: colors.neutral[900],
                        marginBottom: 4,
                      }}
                    >
                      {title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: colors.neutral[900],
                      }}
                    >
                      {value || defaultValue || ""}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        fontFamily: "LemonMilkMedium",
                        fontSize: 20,
                        color: "#fff",
                        marginBottom: subtitle ? 2 : 0,
                      }}
                    >
                      {title}
                    </Text>
                    {subtitle && (
                      <Text
                        style={{
                          color: colors.neutral[400],
                        }}
                      >
                        {subtitle}
                      </Text>
                    )}
                  </>
                )}
              </View>
              <Ionicons
                name={hasValue ? "create" : "create-outline"}
                size={24}
                color={hasValue ? colors.neutral[900] : colors.neutral[500]}
                style={{ marginLeft: 12 }}
              />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

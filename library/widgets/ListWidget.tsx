import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
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

interface ListWidgetProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  items: string[];
  onUpdateItems: (items: string[]) => void;
  completed?: boolean;
  onToggleComplete?: () => void;
}

export const ListWidget: React.FC<ListWidgetProps> = ({
  title,
  subtitle,
  placeholder = "Add item",
  items,
  onUpdateItems,
  completed = false,
  onToggleComplete,
}) => {
  const scale = useSharedValue(1);
  const safeItems = items || [];

  const handlePress = () => {
    prompt(
      title,
      placeholder,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: (text) => {
            if (text && text.trim()) {
              onUpdateItems([...safeItems, text.trim()]);
            }
          },
        },
      ],
      {
        type: "plain-text",
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
          runOnJS(handlePress)();
        }),
    [scale, handlePress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleRemoveItem = (index: number) => {
    const newItems = [...safeItems];
    newItems.splice(index, 1);
    onUpdateItems(newItems);
  };

  return (
    <View className="mx-4 mt-6">
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle}>
          <View
            className="rounded-xl p-4"
            style={{
              backgroundColor: completed ? colors.achievement.gold : colors.neutral[700],
            }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                {safeItems.length > 0 ? (
                  <>
                    <Text
                      className="mb-1 font-['LemonMilkMedium'] text-xl"
                      style={{ color: colors.neutral[900] }}
                    >
                      {title}
                    </Text>
                    {safeItems.map((item, index) => (
                      <View key={index} className="mb-1 flex-row items-center">
                        <Text
                          className="text-sm font-normal"
                          style={{ color: colors.neutral[900] }}
                        >
                          {index + 1}. {item}
                        </Text>
                        <Pressable onPress={() => handleRemoveItem(index)} className="ml-2">
                          <Ionicons name="close-circle" size={16} color={colors.neutral[900]} />
                        </Pressable>
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    <Text className="mb-0.5 font-['LemonMilkMedium'] text-lg">{title}</Text>
                    {subtitle && <Text style={{ color: colors.neutral[400] }}>{subtitle}</Text>}
                  </>
                )}
              </View>
              <Ionicons
                name={safeItems.length > 0 ? "checkmark-circle" : "add-circle"}
                size={24}
                color={safeItems.length > 0 ? colors.neutral[900] : colors.neutral[400]}
                onPress={safeItems.length > 0 ? onToggleComplete : handlePress}
              />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { GratitudeItemRecord } from "../powersync/AppSchema";
import { colors } from "../theme/colors";

interface ListItemWidgetProps {
  item: GratitudeItemRecord;
  onRemove: (id: string) => void;
}

export const ListItemWidget: React.FC<ListItemWidgetProps> = ({ item, onRemove }) => {
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
          runOnJS(() => onRemove(item.id))();
        }),
    [item.id, onRemove, scale, pressed]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="mb-1 flex-row items-center">
      <Text className="text-sm font-normal" style={{ color: colors.neutral[900] }}>
        • {item.description}
      </Text>
      <GestureDetector gesture={tap}>
        <Animated.View style={[animatedStyle, { marginLeft: 8 }]}>
          <Ionicons name="close-circle" size={16} color={colors.neutral[900]} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

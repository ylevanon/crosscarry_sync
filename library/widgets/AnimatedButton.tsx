import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  className: string;
}

export const AnimatedButton = ({ onPress, children, className }: AnimatedButtonProps) => {
  const scale = useSharedValue(1);

  const tap = React.useMemo(
    () =>
      Gesture.Tap()
        .onBegin(() => {
          "worklet";
          scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        })
        .onFinalize(() => {
          "worklet";
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
          runOnJS(onPress)();
        }),
    [onPress, scale]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={animatedStyle} className={className}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

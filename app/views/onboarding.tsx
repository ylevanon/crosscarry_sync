import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

const AnimatedButton = ({
  onPress,
  children,
  className,
}: {
  onPress: () => void;
  children: React.ReactNode;
  className: string;
}) => {
  const scale = useSharedValue(1);

  const tap = Gesture.Tap()
    .onBegin(() => {
      "worklet";
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      "worklet";
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      runOnJS(onPress)();
    });

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

const OnboardingSlide = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: any;
}) => {
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="w-full items-center justify-center px-5"
    >
      <Image source={image} className="mb-8 h-60 w-full" resizeMode="contain" />
      <Text className="font-lemon-milk-bold mb-4 text-center text-2xl text-white">{title}</Text>
      <Text className="text-center font-lemon-milk text-base text-gray-300">{description}</Text>
    </Animated.View>
  );
};

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      title: "Welcome to FOLLOW",
      description:
        "Your journey to better fitness starts here. Track your workouts, set goals, and crush them!",
      image: require("../../assets/pngs/FOLLOW40-Logos-08.png"),
    },
    {
      title: "Track Your Progress",
      description:
        "Log your workouts, monitor your gains, and watch your strength grow day by day.",
      image: require("../../assets/pngs/FOLLOW40-Logos-08.png"),
    },
    {
      title: "Join the Community",
      description:
        "Connect with fellow fitness enthusiasts, share your achievements, and stay motivated together!",
      image: require("../../assets/pngs/FOLLOW40-Logos-08.png"),
    },
  ];

  return (
    <View className="flex-1 items-center justify-between bg-black py-10">
      <StatusBar style="light" />

      <View className="w-full space-y-12">
        <View className="flex-row justify-center space-x-8 pt-10">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-[3px] rounded-full ${
                index === currentSlide
                  ? "bg-primary w-8"
                  : index < currentSlide
                    ? "bg-primary w-2"
                    : "w-2 bg-gray-600"
              }`}
            />
          ))}
        </View>

        <OnboardingSlide {...slides[currentSlide]} />
      </View>

      <View className="w-full px-5">
        <AnimatedButton
          onPress={() => {
            if (currentSlide < slides.length - 1) {
              setCurrentSlide(currentSlide + 1);
            } else {
              router.replace("/views/todos/lists");
            }
          }}
          className="bg-primary rounded-lg px-4 py-3"
        >
          <Text className="text-center font-lemon-milk text-lg text-white">
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </AnimatedButton>
      </View>
    </View>
  );
}

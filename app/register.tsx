import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, ActivityIndicator, Image, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { useSystem } from "../library/powersync/system";
import { TextInputWidget } from "../library/widgets/TextInputWidget";

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

export default function Register() {
  const { supabaseConnector } = useSystem();
  const [loading, setLoading] = React.useState(false);
  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      title: "Welcome to FOLLOW",
      description:
        "Your journey to better fitness starts here. Track your workouts, set goals, and crush them!",
      image: require("../assets/pngs/FOLLOW40-Logos-08.png"),
    },
    {
      title: "Track Your Progress",
      description:
        "Log your workouts, monitor your gains, and watch your strength grow day by day.",
      image: require("../assets/pngs/FOLLOW40-Logos-08.png"),
    },
    {
      title: "Join the Community",
      description:
        "Connect with fellow fitness enthusiasts, share your achievements, and stay motivated together!",
      image: require("../assets/pngs/FOLLOW40-Logos-08.png"),
    },
  ];

  const handleSuccess = async () => {
    setShowTutorial(true);
  };

  if (showTutorial) {
    return (
      <View className="flex-1 items-center justify-between bg-black py-10">
        <StatusBar style="light" />

        <OnboardingSlide {...slides[currentSlide]} />

        <View className="w-full space-y-4 px-5">
          <View className="flex-row justify-center space-x-2">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentSlide ? "bg-primary" : "bg-gray-600"
                }`}
              />
            ))}
          </View>

          <AnimatedButton
            onPress={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide(currentSlide + 1);
              } else {
                router.replace("views/todos/lists");
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

  return (
    <View className="flex-1 items-center justify-center bg-black">
      {loading ? (
        <ActivityIndicator color="#DC1E1E" />
      ) : (
        <View className="w-full max-w-[400px] space-y-8 px-5">
          <StatusBar style="light" />

          <Image
            source={require("../assets/pngs/FOLLOW40-Logos-08.png")}
            className="mb-10 mt-5 h-60 w-full self-center"
            resizeMode="contain"
          />

          <View className="mb-6 space-y-3">
            <TextInputWidget
              className="input-field"
              inputMode="email"
              placeholder="Username"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              onChangeText={(value) =>
                setCredentials({
                  ...credentials,
                  username: value.toLowerCase().trim(),
                })
              }
            />
            <TextInputWidget
              className="input-field"
              placeholder="Password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              onChangeText={(value) => setCredentials({ ...credentials, password: value })}
            />
          </View>

          {error ? <Text className="text-primary font-sans">{error}</Text> : null}

          <View className="space-y-3">
            <AnimatedButton
              onPress={async () => {
                setLoading(true);
                setError("");
                try {
                  const { data, error } = await supabaseConnector.client.auth.signUp({
                    email: credentials.username,
                    password: credentials.password,
                  });
                  if (error) {
                    throw error;
                  }
                  if (data.session) {
                    supabaseConnector.client.auth.setSession(data.session);
                    handleSuccess();
                  } else {
                    router.replace("signin");
                  }
                } catch (ex: any) {
                  console.error(ex);
                  setError(ex.message || "Could not register");
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-primary rounded-lg px-4 py-3"
            >
              <Text className="text-center font-lemon-milk text-lg text-white">Sign Up</Text>
            </AnimatedButton>
          </View>
        </View>
      )}
    </View>
  );
}

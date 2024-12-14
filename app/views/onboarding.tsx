import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { View, Text, Image, FlatList, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { AnimatedButton } from "../../library/widgets/AnimatedButton";

const onboardingData = [
  {
    id: "1",
    title: "Welcome to CrossCarry",
    description: "Track your workouts and progress with ease",
    image: require("../../assets/pngs/FOLLOW40-Logos-08.png"),
  },
  {
    id: "2",
    title: "Sync Everywhere",
    description: "Your data is always available, online or offline",
    image: require("../../assets/pngs/FOLLOW40-Logos-08.png"),
  },
  {
    id: "3",
    title: "Join the Community",
    description: "Connect with others and share your fitness journey",
    image: require("../../assets/pngs/FOLLOW40-Logos-08.png"),
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => {
    return (
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        className="items-center justify-center px-5"
        style={{ width }}
      >
        <Image source={item.image} className="mb-8 h-60 w-full" resizeMode="contain" />
        <Text className="font-lemon-milk-bold mb-4 text-center text-2xl text-white">
          {item.title}
        </Text>
        <Text className="text-center font-lemon-milk text-base text-gray-300">
          {item.description}
        </Text>
      </Animated.View>
    );
  };

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const handleNext = () => {
    if (currentIndex === onboardingData.length - 1) {
      router.replace("/views/todos/lists");
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <View className="flex-1">
        {/* Dot indicator - Adjust space-x-4 to increase/decrease dot spacing */}
        <View className="flex-row justify-center space-x-4 py-10">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`mx-1 h-3 w-3 rounded-full ${
                index === currentIndex ? "bg-primary h-4 w-4" : "bg-neutral-700"
              }`}
            />
          ))}
        </View>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />
      </View>
      <View className="px-5 py-10">
        <AnimatedButton onPress={handleNext} className="bg-primary rounded-lg px-4 py-3">
          <Text className="text-center font-lemon-milk text-lg text-white">
            {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          </Text>
        </AnimatedButton>
      </View>
    </View>
  );
}

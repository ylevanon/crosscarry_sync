import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { View, FlatList, useWindowDimensions, Alert } from "react-native";

import { PROFILE_TABLE } from "../../library/powersync/AppSchema";
import { useSystem } from "../../library/powersync/system";
import {
  WelcomeSlide,
  UsernameSlide,
  ProfilePictureSlide,
  GetStartedSlide,
} from "../../library/widgets/onboarding";

interface OnboardingData {
  username?: string;
}

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const flatListRef = useRef<FlatList>(null);
  const system = useSystem();

  const handleNext = () => {
    if (currentIndex < 3) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace("/views/todos/lists");
    }
  };

  const handleUsernameSubmit = async (username: string) => {
    try {
      // Get current user's ID from system
      const { userID } = await system.supabaseConnector.fetchCredentials();
      if (!userID) throw new Error("No user ID found");

      // Update or insert profile record
      await system.powersync.execute(
        `
        UPDATE ${PROFILE_TABLE} 
        SET username = ?, updated_at = datetime('now')
        WHERE id = ?
      `,
        [username, userID]
      );

      setOnboardingData((prev) => ({ ...prev, username }));
      handleNext();
    } catch (error) {
      Alert.alert("Error", "Failed to save username. Please try again.");
      console.error("Failed to save username:", error);
    }
  };

  // Simplified for now, just calls handleNext
  const handlePictureSelect = (_uri: string) => {
    handleNext();
  };

  const renderItem = ({ index }: { index: number }) => {
    switch (index) {
      case 0:
        return <WelcomeSlide width={width} />;
      case 1:
        return (
          <UsernameSlide
            width={width}
            onUsernameSubmit={handleUsernameSubmit}
            onSkip={handleNext}
          />
        );
      case 2:
        return (
          <ProfilePictureSlide
            width={width}
            onPictureSelect={handlePictureSelect}
            onSkip={handleNext}
          />
        );
      case 3:
        return <GetStartedSlide width={width} onGetStarted={handleNext} />;
      default:
        return null;
    }
  };

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <View className="flex-1">
        {/* Dot indicator */}
        <View className="flex-row justify-center space-x-4 py-10">
          {[0, 1, 2, 3].map((index) => (
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
          data={[0, 1, 2, 3]} // Indices for our slides
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />
      </View>
    </View>
  );
}

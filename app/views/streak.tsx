import React from "react";
import { View, Text } from "react-native";

import { CheckboxWidget } from "../../library/widgets/CheckboxWidget";

const StreakView = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <Text className="mx-4 my-6 text-2xl font-bold text-gray-900">Daily Streak</Text>

      <CheckboxWidget
        title="ECOMMERCE"
        subtitle="More than 128156 items waiting for you in our store"
        icon="cart"
        onPress={() => {}}
      />

      <CheckboxWidget
        title="FINANCE"
        subtitle="More than 100000 bitcoins sold"
        icon="trending-up"
        onPress={() => {}}
      />

      <CheckboxWidget
        title="DESIGNEWS"
        subtitle="iOS design system boosts your workflow"
        icon="brush"
        onPress={() => {}}
      />
    </View>
  );
};

export default StreakView;

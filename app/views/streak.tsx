import React, { useState } from "react";
import { View, Text } from "react-native";

import { CardInputWidget } from "../../library/widgets/CardInputWidget";
import { CheckboxWidget } from "../../library/widgets/CheckboxWidget";

const StreakView = () => {
  const [goal, setGoal] = useState("");

  return (
    <View className="flex-1 bg-white">
      <Text className="mx-4 my-6 text-2xl font-bold text-gray-900">Daily Streak</Text>

      <CardInputWidget
        title="Set Daily Goal"
        subtitle="What would you like to achieve today?"
        placeholder="Enter your goal..."
        value={goal}
        onChangeText={setGoal}
      />

      <View className="mt-6">
        <Text className="mx-4 mb-2 text-lg font-semibold text-gray-900">Your Progress</Text>

        <CheckboxWidget
          title="Morning Routine"
          subtitle="Complete your morning tasks"
          onPress={() => {}}
        />

        <CheckboxWidget title="Workout" subtitle="30 minutes of exercise" onPress={() => {}} />

        <CheckboxWidget title="Reading" subtitle="Read for 20 minutes" onPress={() => {}} />
      </View>
    </View>
  );
};

export default StreakView;

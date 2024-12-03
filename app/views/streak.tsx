import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";

import { CardInputWidget } from "../../library/widgets/CardInputWidget";
import { CheckboxWidget } from "../../library/widgets/CheckboxWidget";
import { ProgressRingWidget } from "../../library/widgets/ProgressRingWidget";
import { StreakWidget } from "../../library/widgets/StreakWidget";

const StreakView = () => {
  const [goal, setGoal] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    morning: false,
    workout: false,
    reading: false,
  });

  // Calculate progress
  const totalTasks = Object.keys(checkedItems).length + (goal ? 1 : 0);
  const completedTasks = Object.values(checkedItems).filter(Boolean).length + (goal ? 1 : 0);
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-6">
        <StreakWidget count={7} isComplete={progress === 1} />
        <ProgressRingWidget progress={progress} />
      </View>

      <CardInputWidget
        title="Set Daily Goal"
        subtitle="What would you like to achieve today?"
        placeholder="Enter your goal..."
        value={goal}
        onChangeText={setGoal}
      />

      <View className="mt-6">
        <CheckboxWidget
          title="Morning Routine"
          subtitle="Complete your morning tasks"
          onPress={() => setCheckedItems((prev) => ({ ...prev, morning: !prev.morning }))}
        />

        <CheckboxWidget
          title="Workout"
          subtitle="30 minutes of exercise"
          onPress={() => setCheckedItems((prev) => ({ ...prev, workout: !prev.workout }))}
        />

        <CheckboxWidget
          title="Reading"
          subtitle="Read for 20 minutes"
          onPress={() => setCheckedItems((prev) => ({ ...prev, reading: !prev.reading }))}
        />
      </View>
    </ScrollView>
  );
};

export default StreakView;

import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import { CardInputWidget } from "../../library/widgets/CardInputWidget";
import { CheckboxWidget } from "../../library/widgets/CheckboxWidget";
import { StreakProgressWidget } from "../../library/widgets/StreakProgressWidget";

const StreakView = () => {
  const [goal, setGoal] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    morning: false,
    workout: false,
    reading: false,
  });

  // Calculate progress including the goal task
  const hasGoal = goal.length > 0;
  const totalTasks = Object.keys(checkedItems).length + 1; // Always count goal task
  const completedTasks = Object.values(checkedItems).filter(Boolean).length + (hasGoal ? 1 : 0);
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <ScrollView className="flex-1 bg-white pt-4">
      <StreakProgressWidget
        streak={7}
        progress={progress}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
      />

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

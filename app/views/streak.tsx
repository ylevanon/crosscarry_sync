import { useQuery } from "@powersync/react-native";
import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";

import {
  CHALLENGES_TABLE,
  CHALLENGE_DAYS_TABLE,
  ChallengeRecord,
  ChallengeDayRecord,
} from "../../library/powersync/AppSchema";
import { colors } from "../../library/theme/colors";
import { CardInputWidget } from "../../library/widgets/CardInputWidget";
import { CheckboxWidget } from "../../library/widgets/CheckboxWidget";
import { StreakProgressWidget } from "../../library/widgets/StreakProgressWidget";

const StreakView = () => {
  const [goal, setGoal] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    sobriety: false,
    diet: false,
  });
  const [inputValues, setInputValues] = useState({
    workout: "",
    service: "",
    help: "",
  });

  // Fetch active challenge and its current day
  const { data: challenges } = useQuery<ChallengeRecord>(
    `SELECT * FROM ${CHALLENGES_TABLE} WHERE status = 'active' ORDER BY created_at DESC LIMIT 1`
  );

  const activeChallenge = challenges?.[0];

  // Get current day number (days elapsed since challenge start)
  const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD
  const { data: currentDayData } = useQuery<ChallengeDayRecord>(
    `SELECT *
     FROM ${CHALLENGE_DAYS_TABLE} 
     WHERE challenge_id = ? 
     AND date LIKE ?`,
    [activeChallenge?.id, `${today}%`]
  );

  const currentDayNumber = currentDayData?.[0]?.day_number ?? -1; // Default to 1 since we know it's first day

  // Add debug component
  const DebugInfo = () => (
    <View style={{ padding: 10, backgroundColor: "#333" }}>
      <Text style={{ color: "white", fontFamily: "monospace" }}>
        Active Challenge:{"\n"}
        {JSON.stringify(activeChallenge, null, 2)}
      </Text>
      <Text style={{ color: "white", fontFamily: "monospace", marginTop: 10 }}>
        Current Day Data:{"\n"}
        {JSON.stringify(currentDayData, null, 2)}
      </Text>
    </View>
  );

  // Calculate progress including all tasks
  const totalTasks = Object.keys(checkedItems).length + Object.keys(inputValues).length + 1; // +1 for goal
  const completedChecks = Object.values(checkedItems).filter(Boolean).length;
  const completedInputs = Object.values(inputValues).filter((val) => val.length > 0).length;
  const completedTasks = completedChecks + completedInputs + (goal.length > 0 ? 1 : 0);
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView className="flex-1 bg-neutral-800 pt-4">
        <DebugInfo />
        <StreakProgressWidget
          streak={currentDayNumber}
          progress={progress}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
        />

        <View className="mt-6">
          <CheckboxWidget
            title="No Alcohol, Drugs, or Pornography"
            subtitle="Stay clean and sober"
            onPress={() => setCheckedItems((prev) => ({ ...prev, sobriety: !prev.sobriety }))}
          />

          <CheckboxWidget
            title="Follow a Diet"
            subtitle="Stick to your nutrition plan"
            onPress={() => setCheckedItems((prev) => ({ ...prev, diet: !prev.diet }))}
          />

          <CardInputWidget
            title="Complete Workout"
            subtitle="What exercise did you do?"
            placeholder="Describe your workout..."
            value={inputValues.workout}
            onChangeText={(text) => setInputValues((prev) => ({ ...prev, workout: text }))}
          />

          <CardInputWidget
            title="Perform an Act of Service"
            subtitle="How did you help others today?"
            placeholder="Describe your service..."
            value={inputValues.service}
            onChangeText={(text) => setInputValues((prev) => ({ ...prev, service: text }))}
          />

          <CardInputWidget
            title="Ask for Help"
            subtitle="What did you need help with?"
            placeholder="What did you ask for..."
            value={inputValues.help}
            onChangeText={(text) => setInputValues((prev) => ({ ...prev, help: text }))}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default StreakView;

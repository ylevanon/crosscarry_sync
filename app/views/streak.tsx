import { useQuery } from "@powersync/react-native";
import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";

import {
  CHALLENGES_TABLE,
  CHALLENGE_DAYS_TABLE,
  ChallengeRecord,
  ChallengeDayRecord,
  SOBER_TABLE,
  SoberEntryRecord,
  DIET_TABLE,
  DietEntryRecord,
} from "../../library/powersync/AppSchema";
import { useSystem } from "../../library/powersync/system";
import { colors } from "../../library/theme/colors";
import { CardInputWidget } from "../../library/widgets/CardInputWidget";
import { CheckboxWidget } from "../../library/widgets/CheckboxWidget";
import { StreakProgressWidget } from "../../library/widgets/StreakProgressWidget";

const StreakView = () => {
  const system = useSystem();
  const [sober, setSober] = useState(false);
  const [diet, setDiet] = useState(false);
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

  // Get sober entry and initialize state
  const { data: soberEntry } = useQuery<SoberEntryRecord>(
    `SELECT *
     FROM ${SOBER_TABLE} 
     WHERE challenge_id = ? 
     AND challenge_days_id = ?`,
    [activeChallenge?.id, currentDayData?.[0]?.id]
  );

  // Get diet entry and initialize state
  const { data: dietEntry } = useQuery<DietEntryRecord>(
    `SELECT *
     FROM ${DIET_TABLE} 
     WHERE challenge_id = ? 
     AND challenge_days_id = ?`,
    [activeChallenge?.id, currentDayData?.[0]?.id]
  );

  useEffect(() => {
    if (soberEntry?.[0]) {
      setSober(!!soberEntry[0].completed);
    }
    if (dietEntry?.[0]) {
      setDiet(!!dietEntry[0].completed);
    }
  }, [soberEntry, dietEntry]);

  const toggleSobriety = async () => {
    if (!soberEntry?.[0]?.id) return;
    const newStatus = !sober;
    await system.powersync.execute(
      `UPDATE ${SOBER_TABLE} SET completed = ?, updated_at = datetime('now') WHERE id = ?`,
      [newStatus ? 1 : 0, soberEntry[0].id]
    );
    setSober(newStatus);
  };

  const toggleDiet = async () => {
    if (!dietEntry?.[0]?.id) return;
    const newStatus = !diet;
    await system.powersync.execute(
      `UPDATE ${DIET_TABLE} SET completed = ?, updated_at = datetime('now') WHERE id = ?`,
      [newStatus ? 1 : 0, dietEntry[0].id]
    );
    setDiet(newStatus);
  };

  // Calculate progress including all tasks
  const totalTasks = 3;

  const completedInputs = Object.values(inputValues).filter((val) => val.length > 0).length;
  const completedChecks = Number(sober) + Number(diet);
  const completedTasks = completedChecks + completedInputs;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView className="flex-1 bg-neutral-800 pt-4">
        {/* <DebugInfo /> */}
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
            onPress={toggleSobriety}
          />

          <CheckboxWidget
            title="Follow a Diet"
            subtitle="Stick to your nutrition plan"
            onPress={toggleDiet}
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

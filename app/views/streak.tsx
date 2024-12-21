import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";

import { SOBER_TABLE, DIET_TABLE } from "../../library/powersync/AppSchema";
import { useSystem } from "../../library/powersync/system";
import { colors } from "../../library/theme/colors";
import { CardInputWidget } from "../../library/widgets/CardInputWidget";
import { CheckboxWidget } from "../../library/widgets/CheckboxWidget";
import { StreakProgressWidget } from "../../library/widgets/StreakProgressWidget";

import useActiveChallenge from "~/library/powersync/repositories/challenge";
import { useCurrentChallengeDay } from "~/library/powersync/repositories/challengeDays";
import useDietByChallengeDay from "~/library/powersync/repositories/diet";
import useSoberByChallengeDay from "~/library/powersync/repositories/sober";

const StreakView = () => {
  const system = useSystem();
  const today = new Date().toISOString().split("T")[0];
  const [sober, setSober] = useState(false);
  const [diet, setDiet] = useState(false);
  const [inputValues, setInputValues] = useState({
    workout: "",
    service: "",
    help: "",
  });

  const { activeChallenge } = useActiveChallenge();
  const { currentDay } = useCurrentChallengeDay(activeChallenge?.id, today);
  const { dietEntry } = useDietByChallengeDay(currentDay?.id);
  const { soberEntry } = useSoberByChallengeDay(currentDay?.id);

  const currentDayNumber = currentDay?.day_number;

  // Get diet entry and initialize state
  // const { data: dietEntry } = useQuery<DietEntryRecord>(
  //   `SELECT *
  //    FROM ${DIET_TABLE}
  //    WHERE challenge_id = ?
  //    AND challenge_days_id = ?`,
  //   [activeChallenge?.id, currentDay?.id]
  // );

  // // Get sober entry and initialize state
  // const { data: soberEntry } = useQuery<SoberEntryRecord>(
  //   `SELECT *
  //    FROM ${SOBER_TABLE}
  //    WHERE challenge_id = ?
  //    AND challenge_days_id = ?`,
  //   [activeChallenge?.id, currentDay?.id]
  // );

  useEffect(() => {
    if (soberEntry) {
      setSober(!!soberEntry.completed);
    }
    if (dietEntry) {
      setDiet(!!dietEntry.completed);
    }
  }, [soberEntry, dietEntry]);

  const toggleSobriety = async () => {
    if (!soberEntry?.id) return;
    const newStatus = !sober;
    await system.powersync.execute(
      `UPDATE ${SOBER_TABLE} SET completed = ?, updated_at = datetime('now') WHERE id = ?`,
      [newStatus ? 1 : 0, soberEntry.id]
    );
    setSober(newStatus);
  };

  const toggleDiet = async () => {
    if (!dietEntry?.id) return;
    const newStatus = !diet;
    await system.powersync.execute(
      `UPDATE ${DIET_TABLE} SET completed = ?, updated_at = datetime('now') WHERE id = ?`,
      [newStatus ? 1 : 0, dietEntry.id]
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
            defaultChecked={!!soberEntry?.completed}
          />

          <CheckboxWidget
            title="Diet"
            subtitle="Stick to your nutrition plan"
            onPress={toggleDiet}
            defaultChecked={!!dietEntry?.completed}
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

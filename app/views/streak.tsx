import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";

import {
  SOBER_TABLE,
  DIET_TABLE,
  WORKOUT_TABLE,
  HELP_TABLE,
  SERVICE_TABLE,
} from "../../library/powersync/AppSchema";
import { useSystem } from "../../library/powersync/system";
import { colors } from "../../library/theme/colors";
import { CardInputWidget } from "../../library/widgets/CardInputWidget";
import { CheckboxWidget } from "../../library/widgets/CheckboxWidget";
import { StreakProgressWidget } from "../../library/widgets/StreakProgressWidget";

import useActiveChallenge from "~/library/powersync/repositories/challenge";
import { useCurrentChallengeDay } from "~/library/powersync/repositories/challengeDays";
import useDietByChallengeDay from "~/library/powersync/repositories/diet";
import useHelpByChallengeDay from "~/library/powersync/repositories/help";
import useServiceByChallengeDay from "~/library/powersync/repositories/service";
import useSoberByChallengeDay from "~/library/powersync/repositories/sober";
import useWorkoutByChallengeDay from "~/library/powersync/repositories/workout";

const StreakView = () => {
  const system = useSystem();

  // Get today's date in local timezone while maintaining ISO format
  const today = new Date().toISOString().split("T")[0];

  const [sober, setSober] = useState(false);
  const [diet, setDiet] = useState(false);
  const [workout, setWorkout] = useState("");
  const [help, setHelp] = useState("");
  const [service, setService] = useState("");
  const { activeChallenge } = useActiveChallenge();
  const { currentDay } = useCurrentChallengeDay(activeChallenge?.id, today);
  const { dietEntry } = useDietByChallengeDay(currentDay?.id);
  const { soberEntry } = useSoberByChallengeDay(currentDay?.id);
  const { workoutEntry } = useWorkoutByChallengeDay(currentDay?.id);
  const { helpEntry } = useHelpByChallengeDay(currentDay?.id);
  const { serviceEntry } = useServiceByChallengeDay(currentDay?.id);
  const currentDayNumber = currentDay?.day_number;

  useEffect(() => {
    if (soberEntry) {
      setSober(!!soberEntry.completed);
    }
    if (dietEntry) {
      setDiet(!!dietEntry.completed);
    }
    if (workoutEntry) {
      workoutEntry.description && setWorkout(workoutEntry.description);
    }
    if (helpEntry) {
      helpEntry.description && setHelp(helpEntry.description);
    }
    if (serviceEntry) {
      serviceEntry.description && setService(serviceEntry.description);
    }
  }, [soberEntry, dietEntry, workoutEntry, helpEntry]);

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

  const updateWorkoutDescription = async (text: string) => {
    if (!workoutEntry?.id) return;
    await system.powersync.execute(
      `UPDATE ${WORKOUT_TABLE} SET description = ?, updated_at = datetime('now') WHERE id = ?`,
      [text, workoutEntry.id]
    );
    setWorkout(text);
  };

  const updateHelpDescription = async (text: string) => {
    if (!helpEntry?.id) return;
    await system.powersync.execute(
      `UPDATE ${HELP_TABLE} SET description = ?, updated_at = datetime('now') WHERE id = ?`,
      [text, helpEntry.id]
    );
    setHelp(text);
  };

  const updateServiceDescription = async (text: string) => {
    if (!serviceEntry?.id) return;
    await system.powersync.execute(
      `UPDATE ${SERVICE_TABLE} SET description = ?, updated_at = datetime('now') WHERE id = ?`,
      [text, serviceEntry.id]
    );
    setService(text);
  };

  // Calculate progress including all tasks
  const totalTasks = 4;

  // const completedInputs = Object.values(inputValues).filter((val) => val.length > 0).length;
  const completedChecks = Number(sober) + Number(diet) + Number(workout);
  // const completedTasks = completedChecks + completedInputs;
  const progress = totalTasks > 0 ? completedChecks / totalTasks : 0;
  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView className="flex-1 bg-neutral-800 pt-4">
        {/* <DebugInfo /> */}
        <StreakProgressWidget
          streak={currentDayNumber}
          progress={progress}
          completedTasks={completedChecks}
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
            value={workout}
            onChangeText={updateWorkoutDescription}
          />

          <CardInputWidget
            title="Ask for Help"
            subtitle="What did you need help with?"
            placeholder="What did you ask for..."
            value={help}
            onChangeText={updateHelpDescription}
          />

          <CardInputWidget
            title="Perform an Act of Service"
            subtitle="How did you help others today?"
            placeholder="Describe your service..."
            value={service}
            onChangeText={updateServiceDescription}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default StreakView;

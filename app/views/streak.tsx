import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";

import {
  SOBER_TABLE,
  DIET_TABLE,
  WORKOUT_TABLE,
  HELP_TABLE,
  SERVICE_TABLE,
  GRATITUDE_TABLE,
} from "../../library/powersync/AppSchema";
import { useSystem } from "../../library/powersync/system";
import { colors } from "../../library/theme/colors";
import { StreakProgressWidget } from "../../library/widgets/StreakProgressWidget";

import useActiveChallenge from "~/library/powersync/repositories/challenge";
import { useCurrentChallengeDay } from "~/library/powersync/repositories/challengeDays";
import useDietByChallengeDay from "~/library/powersync/repositories/diet";
import useGratitudeByChallengeDay from "~/library/powersync/repositories/gratitude";
import useHelpByChallengeDay from "~/library/powersync/repositories/help";
import useServiceByChallengeDay from "~/library/powersync/repositories/service";
import useSoberByChallengeDay from "~/library/powersync/repositories/sober";
import useWorkoutByChallengeDay from "~/library/powersync/repositories/workout";
import { CardInputWidget } from "~/library/widgets/CardInputWidget";
import { CheckboxWidget } from "~/library/widgets/CheckboxWidget";
import { ListWidget } from "~/library/widgets/ListWidget";

const StreakView = () => {
  const system = useSystem();

  // Get today's date in local timezone while maintaining ISO format
  const today = new Date().toISOString().split("T")[0];

  const [sober, setSober] = useState(false);
  const [diet, setDiet] = useState(false);
  const [workout, setWorkout] = useState("");
  const [help, setHelp] = useState("");
  const [service, setService] = useState("");
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);

  const { activeChallenge } = useActiveChallenge();
  const { currentDay } = useCurrentChallengeDay(activeChallenge?.id, today);
  const { dietEntry } = useDietByChallengeDay(currentDay?.id);
  const { soberEntry } = useSoberByChallengeDay(currentDay?.id);
  const { workoutEntry } = useWorkoutByChallengeDay(currentDay?.id);
  const { helpEntry } = useHelpByChallengeDay(currentDay?.id);
  const { serviceEntry } = useServiceByChallengeDay(currentDay?.id);
  const { gratitudeEntry } = useGratitudeByChallengeDay(currentDay?.id);
  const currentDayNumber = currentDay?.day_number;

  useEffect(() => {
    // Always reset states if entries don't exist
    setSober(!!soberEntry?.completed);
    setDiet(!!dietEntry?.completed);
    setWorkout(workoutEntry?.description || "");
    setHelp(helpEntry?.description || "");
    setService(serviceEntry?.description || "");
    setGratitudeItems(gratitudeEntry?.items || []);
  }, [
    soberEntry?.id,
    dietEntry?.id,
    workoutEntry?.id,
    helpEntry?.id,
    serviceEntry?.id,
    gratitudeEntry?.id,
  ]);

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

  const updateGratitudeItems = async (items: string[]) => {
    if (!gratitudeEntry?.id) return;
    const itemsJson = JSON.stringify(items);
    await system.powersync.execute(
      `UPDATE ${GRATITUDE_TABLE} SET items = ?, completed = ?, updated_at = datetime('now') WHERE id = ?`,
      [itemsJson, items.length > 0, gratitudeEntry.id]
    );
    setGratitudeItems(items);
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
        <View className="pb-40">
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
              defaultChecked={sober}
            />

            <CheckboxWidget
              title="Diet"
              subtitle="Stick to your nutrition plan"
              onPress={toggleDiet}
              defaultChecked={diet}
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

            <ListWidget
              title="Gratitude"
              subtitle="What are you grateful for today?"
              items={gratitudeItems}
              onUpdateItems={updateGratitudeItems}
              completed={gratitudeItems.length > 0}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StreakView;

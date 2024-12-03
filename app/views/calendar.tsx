import React from "react";
import { View, Text, ScrollView } from "react-native";

import { CalendarWidget } from "../../library/widgets/CalendarWidget";

const CalendarView = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <Text className="mx-4 my-6 text-2xl font-bold text-gray-900">Calendar</Text>

      <CalendarWidget title="40 Days Challenge" days={40} />
    </ScrollView>
  );
};

export default CalendarView;

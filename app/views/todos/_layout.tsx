import { Stack } from "expo-router";
import React from "react";

import { defaultHeaderConfig } from "../../../library/constants/headerConfig";

const TodosLayout = () => {
  return (
    <Stack
      screenOptions={{
        ...defaultHeaderConfig,
      }}
    >
      <Stack.Screen
        name="lists"
        options={{
          title: "Todo Lists",
        }}
      />
      {/* <Stack.Screen
        name="edit/[id]"
        options={({ route }) => ({
          title: "Edit List",
          // You can still override specific options when needed
          // headerTitleStyle: {
          //   ...defaultHeaderConfig.headerTitleStyle,
          //   fontSize: 20, // Example override
          // },
        })}
      /> */}
    </Stack>
  );
};

export default TodosLayout;

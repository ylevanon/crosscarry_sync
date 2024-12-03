import "../global.css";
import { PowerSyncContext } from "@powersync/react-native";
import { SplashScreen, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect, useMemo } from "react";

import { useSystem } from "../library/powersync/system";
import { defaultHeaderConfig } from "../library/constants/headerConfig";

/**
 * This App uses a nested navigation stack.
 *
 * First layer is a Stack where navigation from index affects a stack
 *  - Login: Auth flow
 *      - Register
 *  - Views: App views once authenticated. The only way to navigate back is to sign out
 *      * Second layer: Uses a navigation drawer, navigating to any of these views replaces the current view. The first layer stack is hidden.
 *          - TodoLists (exposes another stack in order to edit a specific list)
 *              - Third layer: Edit stack
 *                * Edit [todolist] can navigate back to TodoLists
 *          - SQL Console
 *          - Sign out. Psuedo view to initiate signout flow. Navigates back to first layer.
 */

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const HomeLayout = () => {
  const system = useSystem();
  const db = useMemo(() => {
    return system.powersync;
  }, []);

  useEffect(() => {
    async function hideSplash() {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        // Ignore errors
        console.log("Error hiding splash screen:", e);
      }
    }

    hideSplash();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PowerSyncContext.Provider value={db}>
        <Stack
          screenOptions={{
            ...defaultHeaderConfig,
          }}
        >
          <Stack.Screen name="signin" options={{ title: "Supabase Login" }} />
          <Stack.Screen name="register" options={{ title: "Register" }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="views" options={{ headerShown: false }} />
        </Stack>
      </PowerSyncContext.Provider>
    </GestureHandlerRootView>
  );
};

export default HomeLayout;

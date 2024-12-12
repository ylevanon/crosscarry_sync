import "../global.css";
import { PowerSyncContext } from "@powersync/react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { defaultHeaderConfig } from "../library/constants/headerConfig";
import { useSystem } from "../library/powersync/system";

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

  const [fontsLoaded] = useFonts({
    LemonMilkRegular: require("../assets/fonts/LEMONMILK-Regular.otf"),
    LemonMilkRegularItalic: require("../assets/fonts/LEMONMILK-RegularItalic.otf"),
    LemonMilkLight: require("../assets/fonts/LEMONMILK-Light.otf"),
    LemonMilkLightItalic: require("../assets/fonts/LEMONMILK-LightItalic.otf"),
    LemonMilkMedium: require("../assets/fonts/LEMONMILK-Medium.otf"),
    LemonMilkMediumItalic: require("../assets/fonts/LEMONMILK-MediumItalic.otf"),
    LemonMilkBold: require("../assets/fonts/LEMONMILK-Bold.otf"),
    LemonMilkBoldItalic: require("../assets/fonts/LEMONMILK-BoldItalic.otf"),
  });

  useEffect(() => {
    async function hideSplash() {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        // Ignore errors
        console.log("Error hiding splash screen:", e);
      }
    }

    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} className="app">
      <PowerSyncContext.Provider value={db}>
        <Stack
          screenOptions={{
            ...defaultHeaderConfig,
            headerStyle: {
              backgroundColor: "#000000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "LemonMilkBold",
            },
            contentStyle: {
              backgroundColor: "#000000",
            },
          }}
        >
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ title: "Register" }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="views" options={{ headerShown: false }} />
        </Stack>
      </PowerSyncContext.Provider>
    </GestureHandlerRootView>
  );
};

export default HomeLayout;

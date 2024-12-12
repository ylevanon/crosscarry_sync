import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, Pressable } from "react-native";

import { useSystem } from "../../library/powersync/system";

const SettingsView = () => {
  const { powersync, supabaseConnector } = useSystem();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { user },
      } = await supabaseConnector.client.auth.getUser();
      setUserEmail(user?.email ?? null);
    };

    fetchUserEmail();
  }, []);

  const handleSignOut = async () => {
    await powersync.disconnectAndClear();
    await supabaseConnector.client.auth.signOut();
    router.replace("/signin");
  };

  return (
    <View className="flex-1 bg-neutral-900">
      {/* Profile Section */}
      <View className="m-4 rounded-lg bg-neutral-800 p-4">
        <View className="mb-4 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-neutral-700">
            <Ionicons name="person" size={40} color="#DC1E1E" />
          </View>
          <Text className="mt-2 text-lg font-lemon-milk text-white">
            {userEmail ?? "Loading..."}
          </Text>
        </View>
      </View>

      {/* Settings Options */}
      <View className="m-4 rounded-lg bg-neutral-800">
        <Pressable
          className="flex-row items-center justify-between border-b border-neutral-700 p-4"
          onPress={handleSignOut}
        >
          <View className="flex-row items-center space-x-3">
            <Ionicons name="log-out-outline" size={24} color="#DC1E1E" />
            <Text className="text-white">Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
};

export default SettingsView;

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, Pressable } from "react-native";

import { useSystem } from "../../library/powersync/system";

const SettingsView = () => {
  const { powersync, supabaseConnector } = useSystem();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Fetch user email when component mounts
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
    <View className="flex-1 bg-gray-50">
      {/* Profile Section */}
      <View className="m-4 rounded-lg bg-white p-4 shadow-sm">
        <View className="mb-4 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-purple-100">
            <Ionicons name="person" size={40} color="#6366F1" />
          </View>
          <Text className="mt-2 text-lg font-semibold text-gray-900">
            {userEmail ?? "Loading..."}
          </Text>
        </View>
      </View>

      {/* Settings Options */}
      <View className="m-4 rounded-lg bg-white shadow-sm">
        {/* Add more settings options here */}
        <Pressable
          className="flex-row items-center justify-between border-b border-gray-100 p-4"
          onPress={handleSignOut}
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text className="ml-3 text-base font-medium text-red-500">Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>
      </View>
    </View>
  );
};

export default SettingsView;

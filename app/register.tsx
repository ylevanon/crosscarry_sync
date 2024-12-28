import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";

import { useSystem } from "../library/powersync/system";
import { AnimatedButton } from "../library/widgets/AnimatedButton";
import { TextInputWidget } from "../library/widgets/TextInputWidget";

export default function Register() {
  const { supabaseConnector } = useSystem();
  const [loading, setLoading] = React.useState(false);
  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  return (
    <View className="flex-1 items-center justify-center bg-black">
      {loading ? (
        <ActivityIndicator color="#DC1E1E" />
      ) : (
        <View className="w-full max-w-[400px] space-y-8 px-5">
          <StatusBar style="light" />

          <Image
            source={require("../assets/pngs/FOLLOW40-Logos-08.png")}
            className="mb-10 mt-5 h-60 w-full self-center"
            resizeMode="contain"
          />

          <View className="mb-6 space-y-3">
            <TextInputWidget
              className="input-field"
              inputMode="email"
              placeholder="Username"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              onChangeText={(value) =>
                setCredentials({
                  ...credentials,
                  username: value.toLowerCase().trim(),
                })
              }
            />
            <TextInputWidget
              className="input-field"
              placeholder="Password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              onChangeText={(value) => setCredentials({ ...credentials, password: value })}
            />
          </View>

          {error ? <Text className="font-sans text-primary">{error}</Text> : null}

          <View className="space-y-3">
            <AnimatedButton
              onPress={async () => {
                setLoading(true);
                setError("");
                try {
                  const { data, error } = await supabaseConnector.client.auth.signUp({
                    email: credentials.username,
                    password: credentials.password,
                  });
                  if (error) {
                    throw error;
                  }
                  if (data.session) {
                    supabaseConnector.client.auth.setSession(data.session);
                    router.replace("/views/onboarding");
                  } else {
                    router.replace("signin");
                  }
                } catch (ex: any) {
                  console.error(ex);
                  setError(ex.message || "Could not register");
                } finally {
                  setLoading(false);
                }
              }}
              className="rounded-lg bg-primary px-4 py-3"
            >
              <Text className="text-center font-lemon-milk text-lg text-white">Sign Up</Text>
            </AnimatedButton>
          </View>
        </View>
      )}
    </View>
  );
}

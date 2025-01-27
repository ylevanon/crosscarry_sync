import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet } from "react-native";

import { useSystem } from "../library/powersync/system";
import { AnimatedButton } from "../library/widgets/AnimatedButton";
import { TextInputWidget } from "../library/widgets/TextInputWidget";

export default function Signin() {
  const { supabaseConnector } = useSystem();
  const [loading, setLoading] = React.useState(false);
  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  return (
    <View className="flex-1 items-center justify-center">
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

          <Text className="mb-12 text-center font-lemon-milk-bold-italic text-4xl text-white">
            Welcome Back
          </Text>

          <View className="mb-6 space-y-3">
            <TextInputWidget
              style={[SignInStyles.input]}
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
              style={[SignInStyles.input]}
              className="input-field"
              placeholder="Password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              onChangeText={(value) => setCredentials({ ...credentials, password: value })}
            />
          </View>

          {error ? <Text className="text-primary font-sans">{error}</Text> : null}

          <View>
            <AnimatedButton
              className="bg-primary rounded-lg py-2.5"
              onPress={async () => {
                try {
                  setLoading(true);
                  setError("");
                  await supabaseConnector.login(credentials.username, credentials.password);
                  router.replace("views/todos/lists");
                } catch (ex: any) {
                  console.error(ex);
                  setError(ex.message || "Could not authenticate");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Text className="font-lemon-milk-medium text-center text-base text-white">Login</Text>
            </AnimatedButton>

            <View className="h-6" />

            <AnimatedButton
              className="rounded-lg bg-white py-2.5"
              onPress={() => {
                router.push("/register");
              }}
            >
              <Text className="font-lemon-milk-medium text-center text-base text-neutral-900">
                Register
              </Text>
            </AnimatedButton>
          </View>
        </View>
      )}
    </View>
  );
}

export const SignInStyles = StyleSheet.create({
  input: {
    fontSize: 16,
  },
});

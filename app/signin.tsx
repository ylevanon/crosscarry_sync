import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from "react-native";

import { useSystem } from "../library/powersync/system";
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
    <View style={{ flexGrow: 1, alignContent: "center", justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator color="#DC1E1E" />
      ) : (
        <View style={{ padding: 20, maxWidth: 400 }} className="space-y-6">
          <StatusBar style="light" />
          <Ionicons name="log-in" size={100} style={{ padding: 5 }} className="text-primary" />
          <Text className="font-lemon-milk-bold text-4xl text-white">Welcome Back</Text>
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
          {error ? <Text className="text-primary font-sans">{error}</Text> : null}
          <View className="mt-6">
            <Pressable 
              className="btn-primary" 
              onPress={async () => {
                setLoading(true);
                setError("");
                try {
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
              <Text className="text-white">Login</Text>
            </Pressable>
          </View>
          <View className="mt-6">
            <Pressable 
              className="btn-secondary" 
              onPress={async () => {
                router.push("register");
              }}
            >
              <Text className="text-white">Register</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

export const SignInStyles = StyleSheet.create({
  input: {
    fontSize: 14,
  },
});

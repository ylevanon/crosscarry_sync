import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Button } from "react-native";

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
    <View style={{ flexGrow: 1, alignContent: "center", justifyContent: "center" }} className="bg-neutral-white">
      {loading ? (
        <ActivityIndicator color="#DC1E1E" />
      ) : (
        <View style={{ padding: 20, maxWidth: 400 }} className="space-y-6">
          <StatusBar style="auto" />
          <Ionicons name="log-in" size={100} style={{ padding: 5 }} className="text-primary" />
          <Text className="font-lemon-milk-bold-italic text-4xl text-neutral-black">Welcome Back</Text>
          <TextInputWidget
            style={[SignInStyles.input]}
            className="bg-neutral-gray-100 rounded-lg p-3"
            inputMode="email"
            placeholder="Username"
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
            className="bg-neutral-gray-100 rounded-lg p-3"
            placeholder="Password"
            secureTextEntry
            onChangeText={(value) => setCredentials({ ...credentials, password: value })}
          />
          {error ? <Text className="text-primary">{error}</Text> : null}
          <View style={SignInStyles.button_container}>
            <Button
              title="Login"
              color="#DC1E1E"
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
            />
          </View>
          <View style={SignInStyles.button_container}>
            <Button
              title="Register"
              onPress={async () => {
                router.push("register");
              }}
            />
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
  button_container: {
    marginTop: 20,
  },
});

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { SignInStyles } from "./signin";
import { useSystem } from "../library/powersync/system";
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
    <View
      style={{ flexGrow: 1, alignContent: "center", justifyContent: "center" }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ padding: 20, maxWidth: 400 }}>
          <StatusBar style="auto" />
          <Ionicons name="airplane" size={100} style={{ padding: 5 }} />

          <TextInputWidget
            placeholder="Username"
            onChangeText={(value) =>
              setCredentials({ ...credentials, username: value })
            }
          />
          <TextInputWidget
            placeholder="Password"
            secureTextEntry
            onChangeText={(value) =>
              setCredentials({ ...credentials, password: value })
            }
          />
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
          <View style={SignInStyles.button_container}>
            <Button
              title="Sign Up"
              onPress={async () => {
                setLoading(true);
                setError("");
                try {
                  const { data, error } =
                    await supabaseConnector.client.auth.signUp({
                      email: credentials.username,
                      password: credentials.password,
                    });
                  if (error) {
                    throw error;
                  }
                  if (data.session) {
                    supabaseConnector.client.auth.setSession(data.session);
                    router.replace("views/todos/lists");
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
            />
          </View>
        </View>
      )}
    </View>
  );
}

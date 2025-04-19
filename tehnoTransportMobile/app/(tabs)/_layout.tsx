import React, { useState, useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { UserProvider } from "../tools/UserContext";
export default function _Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem("user");
      setIsLoggedIn(!!user);
      setLoading(false);
    };
    checkAuth();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <UserProvider>
      <Tabs>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarLabel: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="sms" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="message"
          options={{
            title: "Change Text",
            tabBarLabel: "Change Text",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Entypo name="new-message" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarLabel: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Entypo name="user" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </UserProvider>
  );
}

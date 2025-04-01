import React, { useState, useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
export default function _Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check login status
  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem("user");
      setIsLoggedIn(!!user);
      setLoading(false);
    };
    checkAuth();
  }, [isLoggedIn]);

  console.log(isLoggedIn);

  // Show a loading spinner while checking auth status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If NOT logged in, show only the login screen
  if (!isLoggedIn) {
    return (
      <Stack>
        <Stack.Screen
          name="index" // Login Page
          options={{ headerShown: false }}
        />
      </Stack>
    );
  }

  // If logged in, show the bottom tab navigation
  return (
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
      {/* Explicitly hide the index screen from Tabs */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides it from the bottom tab navigation
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

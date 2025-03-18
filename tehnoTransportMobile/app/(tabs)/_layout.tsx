import React from "react";
import { Stack } from "expo-router";

export default function _Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="dashboard"
        options={{ title: "Dashboard", headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
}

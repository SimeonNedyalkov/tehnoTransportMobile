import React from "react";
import { Stack } from "expo-router";

export default function App() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/Dashboard" options={{ headerShown: false }} /> */}
    </Stack>
  );
}

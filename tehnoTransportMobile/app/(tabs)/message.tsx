import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function MessageScreen() {
  const [message, onChangeMessage] = React.useState("");
  const router = useRouter();
  const saveMessage = () => {
    router.push({
      pathname: "/dashboard",
      params: { message },
    });
  };
  return (
    <View style={styles.container}>
      <Text>Type your new message bellow:</Text>
      <SafeAreaProvider>
        <SafeAreaView>
          <TextInput
            style={styles.input}
            onChangeText={onChangeMessage}
            value={message}
            placeholder="Type here"
            keyboardType="default"
            multiline={true}
            numberOfLines={4}
          />
        </SafeAreaView>
      </SafeAreaProvider>
      <Button onPress={saveMessage}>Save Text</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  input: {
    minHeight: 40,
    maxHeight: 150,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
  },
});

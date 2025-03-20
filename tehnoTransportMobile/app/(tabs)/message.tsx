import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
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
      <Text style={styles.title}>Type your new message below:</Text>
      <SafeAreaProvider style={styles.boxss}>
        <SafeAreaView>
          <TextInput
            style={styles.input}
            onChangeText={onChangeMessage}
            value={message}
            placeholder="Type here"
            placeholderTextColor="#999"
            keyboardType="default"
            multiline={true}
            numberOfLines={4}
          />
        </SafeAreaView>
      </SafeAreaProvider>
      <TouchableOpacity style={styles.button} onPress={saveMessage}>
        <Text style={styles.buttonText}>Save Text</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  boxss: {
    paddingTop: 50,
  },
  input: {
    minWidth: "95%",
    maxWidth: "95%",
    minHeight: 120,
    maxHeight: 450,
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 4, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

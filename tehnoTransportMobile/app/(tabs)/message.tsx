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
    router.push({ pathname: "/dashboard", params: { message } });
  };

  return (
    <SafeAreaProvider style={styles.safeContainer}>
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.containerWrapper}>
          <Text style={styles.title}>Type your new message below:</Text>

          <TextInput
            style={styles.input}
            onChangeText={onChangeMessage}
            value={message}
            placeholder="Type here..."
            placeholderTextColor="#888"
            keyboardType="default"
            multiline
            numberOfLines={4}
          />

          <View style={styles.warningContainer}>
            <Text style={styles.important}>🔥🔥🔥 Важно !!! 🔥🔥🔥</Text>
            <Text style={styles.noteText}>
              Ако искате да промените текста: За да добавите динамично дата и
              регистрационен номер, моля използвайте следните променливи :{" "}
              {"\n"}
              Дата:
              <Text style={styles.highlight}> [date] </Text>,{"\n"}{" "}
              Регистрационен номер:
              <Text style={styles.highlight}> [regNumber] </Text>
            </Text>
            <Text style={styles.important}>🔥🔥🔥 Важно !!! 🔥🔥🔥</Text>
          </View>
        </SafeAreaView>
        <TouchableOpacity style={styles.button} onPress={saveMessage}>
          <Text style={styles.buttonText}>Save Text</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  containerWrapper: {
    height: "90%",
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    minWidth: "100%",
    minHeight: 150,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  warningContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: 12,
    padding: 15,
    marginVertical: 15,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffecb5",
  },
  important: {
    textAlign: "center",
    fontSize: 20,
    color: "#D32F2F",
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
  },
  noteText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  highlight: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginTop: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: "center",
    width: "100%",
    marginBottom: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

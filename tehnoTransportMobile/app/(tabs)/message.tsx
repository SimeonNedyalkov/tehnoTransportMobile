import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Message from "../interfaces/Message";

const IPMESSAGEURL = "https://tehno-transport-b.onrender.com/message";

export default function MessageScreen() {
  const [message, setMessage] = useState<Message>({ id: "", message: "" });
  const [newMessage, setNewMessage] = useState<Message>({
    id: "",
    message: "",
  });
  const router = useRouter();

  useEffect(() => {
    async function getMessage() {
      try {
        const response = await fetch(IPMESSAGEURL, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setMessage(data[0]);
          setNewMessage(data[0]);
        } else {
          console.warn("Message array is empty or not in expected format");
        }
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    }
    getMessage();
  }, []);

  async function saveMessage() {
    if (!message.id || typeof message.id !== "string") {
      alert("Message ID is invalid or missing!");
      console.error("Invalid message.id:", message.id);
      return;
    }
    try {
      console.log("Sending PATCH to:", `${IPMESSAGEURL}/${message.id}`);
      const response = await fetch(`${IPMESSAGEURL}/${message.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message: newMessage.message }),
      });

      const text = await response.text();
      console.log("Raw response text:", text);

      const data = text ? JSON.parse(text) : null;

      if (data) {
        setMessage(data);
        setNewMessage(data);
        alert("Message updated successfully ✅");
      } else {
        alert("Message saved but no JSON returned.");
      }
    } catch (error) {
      console.error("Error saving message:", error);
      alert("Error saving message: " + error);
    }
  }

  return (
    <SafeAreaProvider style={styles.safeContainer}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>✍️ Type your new message below:</Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) =>
              setNewMessage({ ...newMessage, message: text })
            }
            value={newMessage.message}
            placeholder="Type here..."
            placeholderTextColor="#888"
            keyboardType="default"
            multiline
            numberOfLines={6}
          />

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>📩 Сегашното съобщение:</Text>
            <Text style={styles.previewText}>{message.message}</Text>{" "}
          </View>

          <View style={styles.warningContainer}>
            <Text style={styles.important}>🔥🔥🔥 Важно !!! 🔥🔥🔥</Text>
            <Text style={styles.noteText}>
              Ако искате да промените текста: За да добавите динамично дата и
              регистрационен номер, моля използвайте следните променливи:
              {"\n\n"}
              Дата: <Text style={styles.highlight}>[date]</Text>
              {"\n"}
              Регистрационен номер:{" "}
              <Text style={styles.highlight}>[regNumber]</Text>
            </Text>
            <Text style={styles.important}>🔥🔥🔥 Важно !!! 🔥🔥🔥</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={saveMessage}>
            <Text style={styles.buttonText}>💾 Save Message</Text>
          </TouchableOpacity>
        </ScrollView>
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
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
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
    marginBottom: 20,
  },
  previewContainer: {
    width: "100%",
    backgroundColor: "#eef6ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#d0e5ff",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0055cc",
    marginBottom: 8,
    textAlign: "center",
  },
  previewText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  warningContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: 12,
    padding: 15,
    marginVertical: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ffecb5",
  },
  important: {
    textAlign: "center",
    fontSize: 18,
    color: "#D32F2F",
    fontWeight: "bold",
    marginVertical: 5,
  },
  noteText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
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
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

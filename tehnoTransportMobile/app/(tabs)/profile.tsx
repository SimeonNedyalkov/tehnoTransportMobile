import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useUser } from "../tools/UserContext";
const USERURL = "http://192.168.1.6:3000/user/getUser";
const LOGOUTURL = "http://192.168.1.6:3000/user/logout";
import { router } from "expo-router";

export default function Profile() {
  const { user, loading } = useUser();
  console.log(user);
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const getUser = async () => {
  //     let response = await fetch(USERURL, {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     const data = await response.json();
  //     const photoURL =
  //       "http://192.168.1.6:3000/" +
  //       data.photoURL.split("http://localhost:3000/")[1];
  //     data.photoURL = photoURL;
  //     setUser(data);
  //   };
  //   getUser();
  // }, []);

  async function logout() {
    try {
      const response = await fetch(LOGOUTURL, {
        method: "POST",
        credentials: "include",
      });

      if (response.status == 200) {
        console.log("User logged out successfully!");
        await AsyncStorage.removeItem("user");
        router.replace("/");
      } else {
        console.log(`${response.status} -- Logout failed`);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <View style={styles.profileCardWrapper}>
            <View style={styles.profileCard}>
              <Image
                source={{
                  uri: user.photoURL || "https://via.placeholder.com/150",
                }}
                style={styles.avatar}
              />
              <Text style={styles.displayName}>
                {user.displayName || "No Display Name"}
              </Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text
                style={[
                  styles.status,
                  { color: user.emailVerified ? "#4CAF50" : "#F44336" },
                ]}
              >
                {user.emailVerified ? "Verified" : "Not Verified"}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noUserText}>No user found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  profileCard: {
    flex: 0,
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 350,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  profileCardWrapper: {
    height: "90%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
  },
  noUserText: {
    fontSize: 18,
    color: "#777",
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

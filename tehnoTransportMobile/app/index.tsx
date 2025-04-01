import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const navigation = useNavigation();
  const SIMULATORLOGINURL = "http://10.0.2.2:3000/user/login";
  const IPLOGINURL = "http://192.168.1.6:3000/user/login";
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleLogin = async () => {
    try {
      const response = await fetch(IPLOGINURL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      await AsyncStorage.setItem("user", JSON.stringify(response));
      console.log(response);
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrors((prev) => !prev);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Tehno Transport</Text>

      <Image
        source={require("./../assets/carLogo/abs5_csod_210125.jpg")}
        style={styles.logoIcon}
      />
      {errors ? <Text>Hi</Text> : <></>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="default"
        />

        <Ionicons
          name="mail-outline"
          size={24}
          color="grey"
          style={styles.phoneIcon}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={passwordVisible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>I forgot my password</Text>

      <View style={styles.signupContainer}>
        <Text>Wanna try our services?</Text>
        <TouchableOpacity>
          <Text style={styles.signupText}>here you are</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: wp("4%"),
    backgroundColor: "#fff",
  },
  title: {
    fontSize: wp("6%"),
    marginBottom: hp("3%"),
    fontWeight: "bold",
  },
  logo: {
    marginBottom: hp("6%"),
  },
  input: {
    height: hp("7%"),
    width: "100%",
    marginVertical: hp("1%"),
    borderWidth: 1,
    padding: wp("2.5%"),
    borderRadius: 5,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#01a5fc",
    borderRadius: 25,
    padding: wp("3%"),
    alignItems: "center",
    marginTop: hp("2.5%"),
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
  forgotPassword: {
    color: "#0ed1c0",
    marginTop: hp("2.5%"),
    fontSize: wp("3.5%"),
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: hp("2.5%"),
  },
  signupText: {
    color: "#0ed1c0",
    marginLeft: wp("1%"),
    fontSize: wp("3.5%"),
  },
  logoIcon: {
    width: wp("60%"),
    height: wp("30%"),
    marginTop: hp("1%"),
    marginBottom: hp("4%"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input1: {
    flex: 1,
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ddd",
  },
  eyeIcon: {
    position: "absolute",
    right: wp("2.5%"),
    padding: wp("2.5%"),
  },
  phoneIcon: {
    position: "absolute",
    right: wp("2.5%"),
    padding: wp("2.5%"),
  },
});

export default LoginScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import Svg, { Path } from "react-native-svg"; // Importing the SVG components


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    try {
      // Sign in with Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);

      // If successful, navigate to the HomePage
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("HomeTabs"); // Navigate to the HomePage screen after login
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };
 
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "Password reset email sent! Please check your inbox."
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Svg height="150" width="100%" viewBox="0 0 1440 320">
          <Path
            fill="#25a6c2"
            d="M0,64L48,117.3C96,171,192,277,288,277.3C384,277,480,171,576,144C672,117,768,171,864,213.3C960,256,1056,288,1152,282.7C1248,277,1344,235,1392,213.3L1440,192V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0H0V64Z"
          />
        </Svg>
        <Text style={styles.headerText}>Login</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Please enter your credentials to continue
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Forgot Password link */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    width: "100%",
    height: 150,
    backgroundColor: "#25a6c2",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: "relative",
  },
  headerText: {
    alignItems: "center",
    position: "absolute",
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginTop: -40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#25a6c2",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#EAEAEA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#EAEAEA",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#25a6c2",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
    color: "#25a6c2",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default Login;

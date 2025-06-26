import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import Svg, { Path } from "react-native-svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent! Please check your inbox.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <>
      {/* Header with SVG design */}
      <View style={styles.header}>
        <Svg height="150" width="100%" viewBox="0 0 1440 320">
          <Path
            fill="#25a6c2"
            d="M0,64L48,117.3C96,171,192,277,288,277.3C384,277,480,171,576,144C672,117,768,171,864,213.3C960,256,1056,288,1152,282.7C1248,277,1344,235,1392,213.3L1440,192V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0H0V64Z"
          />
        </Svg>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>

      {/* Content */}
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Enter your email address, and we'll send you a link to reset your password.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#25a6c2",
    height: 150,
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 40,
  },
  backButtonText: {
    padding:25,
    color: "#FFFFFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  instructions: {
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
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#25a6c2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ForgotPassword;

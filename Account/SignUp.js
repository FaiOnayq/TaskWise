import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebaseConfig"; // Assuming you have Firestore set up
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState(""); // New state for userName
  const [gpa, setGpa] = useState(""); // New state for GPA

  const navigation = useNavigation(); // Initialize useNavigation hook

  const handleSignUp = async () => {
    if (!email || !password || !userName || !gpa) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        userName,
        gpa: parseFloat(gpa), // Ensure GPA is stored as a number
        email: email,
      });

      Alert.alert("Success", "Account created successfully!");

      // Navigate to the Home screen after successful sign-up
      navigation.navigate("HomeTabs"); // Change this to "Home" or your homepage's name in the navigator
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
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
          <TextInput
            style={styles.input}
            placeholder="User Name"
            value={userName}
            onChangeText={setUserName}
          />
          <TextInput
            style={styles.input}
            placeholder="GPA"
            keyboardType="numeric"
            value={gpa}
            onChangeText={setGpa}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Already have an account? Login</Text>
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
    backgroundColor: "#25a6c2", // Blue background for the header
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: "relative",
  },
  headerText: {
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
    marginTop: -40, // To make the card look like it's floating on top of the header
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
    backgroundColor: "#25a6c2", // Blue button
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
    color: "#25a6c2", // Blue color for the link
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default SignUp;

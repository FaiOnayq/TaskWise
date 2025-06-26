import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { db, auth } from "../firebaseConfig"; // Firebase config (db)
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons"; // Importing pen icon
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const ProfilePage = () => {
  const navigation = useNavigation(); // Hook to use navigation
  const [userName, setUserName] = useState("");
  const [gpa, setGpa] = useState("");
  const [email, setEmail] = useState("");
  const [newGpa, setNewGpa] = useState("");
  const [isEditingGpa, setIsEditingGpa] = useState(false); // State to toggle edit mode

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.userName);
            setGpa(userData.gpa);
            setEmail(userData.email);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data: ", error);
      }
    };
    fetchUserData();
  }, []);

  const handleGpaUpdate = async () => {
    if (newGpa === "") {
      Alert.alert("Error", "Please enter a GPA value.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        gpa: newGpa,
      });

      setGpa(newGpa);
      setNewGpa(""); // Clear the input field
      setIsEditingGpa(false); // Close the edit mode
      Alert.alert("Success", "GPA updated successfully!");
    } catch (error) {
      console.error("Error updating GPA: ", error);
      Alert.alert("Error", "Failed to update GPA. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {userName || 'Guest'}</Text>      {/* Welcome message */}

      <View style={styles.profileInfo}>
        <Text style={styles.infoText}>Email: {email}</Text>

        {/* GPA section with pen icon */}
        <View style={styles.gpaContainer}>
          <Text style={styles.infoText}>GPA: </Text>
          <Text style={styles.gpaText}>{gpa}</Text>
          <TouchableOpacity onPress={() => setIsEditingGpa(true)}>
            <MaterialIcons name="edit" size={24} color="#25a6c2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditionally show the input field to edit GPA */}
      {isEditingGpa && (
        <View style={styles.gpaEditContainer}>
          <TextInput
            style={styles.input}
            value={newGpa}
            onChangeText={setNewGpa}
            placeholder="Enter new GPA"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleGpaUpdate}>
            <Text style={styles.buttonText}>Save GPA</Text>
          </TouchableOpacity>
        </View>
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4", // Soft background color
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#126b7e",
    marginBottom: 20,
  },
  profileInfo: {
    marginBottom: 30,
    width: "100%",
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#126b7e",
  },
  gpaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  gpaText: {
    fontSize: 18,
    marginRight: 10,
    color: "#333",
  },
  gpaEditContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#25a6c2",
    padding: 12,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProfilePage;

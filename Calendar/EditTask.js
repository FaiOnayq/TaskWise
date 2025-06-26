import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for the trash icon

function EditTask({ route, navigation }) {
  const { task } = route.params;
  const [TaskTitle, setTaskTitle] = useState(task.name);
  const [TaskDescription, setTaskDescription] = useState(task.data);

  const updateTask = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('User not logged in. Please log in and try again.');
        return;
      }

      const userId = currentUser.uid;
      const taskDoc = doc(db, `users/${userId}/Tasks`, task.id);

      // Update the document fields to match Firestore field names (name, data)
      await updateDoc(taskDoc, {
        name: TaskTitle,  // Ensure you use the correct field name
        data: TaskDescription,  // Ensure you use the correct field name
      });

      Alert.alert('Task updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error updating task:', error.message);
    }
  };

  const deleteTask = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('User not logged in. Please log in and try again.');
        return;
      }

      const userId = currentUser.uid;
      const taskDoc = doc(db, `users/${userId}/Tasks`, task.id);

      await deleteDoc(taskDoc);

      Alert.alert('The task was deleted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error deleting task:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text></Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Task Title</Text>
        <TextInput
          style={styles.input}
          value={TaskTitle}
          onChangeText={(text) => setTaskTitle(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Task Description</Text>
        <TextInput
          style={styles.input}
          value={TaskDescription}
          onChangeText={(text) => setTaskDescription(text)}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={updateTask}>
        <Text style={styles.submitButtonText}>Update Task</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: 'red', marginTop: 10 }]}
        onPress={deleteTask}
      >
        <MaterialIcons name="delete" size={24} color="white" style={{ marginRight: 10 }} />
        {/* Uncomment the line below if you want to show text for "Delete Task" */}
        <Text style={styles.submitButtonText}>Delete Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  inputLabel: {
    position: 'absolute',
    top: -8,
    left: 10,
    backgroundColor: '#fff',
    color: '#808080',
    paddingHorizontal: 5,
    fontSize: 12,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d3d3d3',
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 40,
    backgroundColor: '#fff',
    color: 'black',
  },
  submitButton: {
    backgroundColor: 'grey',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditTask;

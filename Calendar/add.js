import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { uid } from 'uid';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

function Add({ navigation }) {
  const uuId = uid();
  const [TaskTitle, setTitle] = useState('');
  const [TaskDescription, setDescription] = useState('');
  const [TaskDate, setTaskDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    if (date) {
      setTaskDate(moment(date).format('YYYY-MM-DD'));
    } else {
      Alert.alert('Failed to pick a date. Please try again.');
    }
    hideDatePicker();
  };

  const addTask = async () => {
    if (!TaskTitle || !TaskDescription || !TaskDate) {
      Alert.alert('All fields must be filled out before adding the task.');
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('User not logged in. Please log in and try again.');
        return;
      }

      const userId = currentUser.uid;

      // Add task to Firestore
      await setDoc(doc(collection(db, `users/${userId}/Tasks`), uuId), {
        TaskTitle,
        TaskDescription,
        TaskDate,
        id: uuId,
      });

      Alert.alert('Task added successfully');

      // Fetch tasks (if needed for debugging or UI updates)
      const tasksCollection = collection(db, `users/${userId}/Tasks`);
      const taskSnapshot = await getDocs(tasksCollection);

      // Map tasks (optional, depending on UI requirements)
      const taskList = {};
      taskSnapshot.forEach((doc) => {
        const task = doc.data();
        const date = task.TaskDate;
        if (!taskList[date]) {
          taskList[date] = [];
        }
        taskList[date].push({ name: task.TaskTitle, data: task.TaskDescription });
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error in adding the task:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}></Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Task Title</Text>
        <TextInput
          style={styles.input}
          value={TaskTitle}
          onChangeText={(text) => setTitle(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Task Description</Text>
        <TextInput
          style={styles.input}
          value={TaskDescription}
          onChangeText={(text) => setDescription(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Task Date</Text>
        <TouchableOpacity style={styles.button} onPress={showDatePicker}>
          <Text>{TaskDate ? moment(TaskDate).format('YYYY-MM-DD') : '📅'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          themeVariant="light"
          date={TaskDate ? new Date(TaskDate) : new Date()} 
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={addTask}>
        <Text style={styles.submitButtonText}>Add Task</Text>
      </TouchableOpacity>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:30,
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  inputLabel: {
    position: "absolute",
    top: -8,
    left: 10,
    backgroundColor: "#fff",
    color: "#808080",
    paddingHorizontal: 5,
    fontSize: 12,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#d3d3d3",
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 40,
    backgroundColor: "#fff",
    color: "black",
  },
  submitButton: {
    backgroundColor: "grey",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 8,
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },

});

export default Add;

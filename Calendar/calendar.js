import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth } from 'firebase/auth';


function CalendarAll({ navigation }) {
  const [tasks, setTasks] = useState({});
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }
    // Real-time listener for Firestore updates
    const unsubscribe = onSnapshot(collection(db, `users/${userId}/Tasks`), (snapshot) => {
      const taskList = {};
      snapshot.forEach((doc) => {
        const task = doc.data();
        const date = task.TaskDate;
        if (!taskList[date]) {
          taskList[date] = [];
        }
        taskList[date].push({ id: doc.id, name: task.TaskTitle, data: task.TaskDescription });
      });
      setTasks(taskList);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Add Task"
        onPress={() => navigation.navigate('Add')}
        color={'lightblue'}
      />
      <Agenda
        items={tasks}
        renderItem={(item) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('EditTask', { task: item })}
          >
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.data}</Text>
          </TouchableOpacity>
        )}
        renderEmptyData={() => (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No Task Added!
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'lightblue',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom: 20,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
});

export default CalendarAll;

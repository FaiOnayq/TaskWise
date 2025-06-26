import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView, Platform
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const userId = auth.currentUser?.uid;

const EditCourse = ({ route, navigation }) => {
  const { courseId } = route.params;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState(0);
  const [section, setSection] = useState("");
  const [notes, setNotes] = useState("");



  const [schedule, setSchedule] = useState([]);
  const [day, setDay] = useState("");
  const [openDay, setOpenday] = useState(false);
  const [itemsDay, setItemsDay] = useState([
    { label: 'select day', value: '' },
    { label: 'Sunday', value: 'sunday' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'Saturday' },
  ]);

  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [className, setClassName] = useState("");


  const [assignments, setAssignments] = useState("");
  const [project, setProject] = useState("");
  const [mid, setMid] = useState("");
  const [quiz, setQuiz] = useState("");
  const [final, setFinal] = useState("");
  const [status, setStatus] = useState("current");
  const [grade, setGrade] = useState('');

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'In Progress', value: '' },
    { label: 'A+', value: 'A+' },
    { label: 'A', value: 'A' },
    { label: 'B+', value: 'B+' },
    { label: 'B', value: 'B' },
    { label: 'C+', value: 'C+' },
    { label: 'C', value: 'C' },
    { label: 'D+', value: 'D+' },
    { label: 'D', value: 'D' },
    { label: 'F', value: 'F' },
  ]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!userId) {
          console.error("User not authenticated");
          return;
        }
  
        const courseDoc = await getDoc(doc(db, `users/${userId}/courses`, courseId));
        if (courseDoc.exists()) {
          const data = courseDoc.data();
          setName(data.name);
          setCode(data.code);
          setCredits(data.credits);
          setSection(data.section);
          setNotes(data.notes);
          setSchedule(data.schedule);
          setAssignments(data.assignments);
          setProject(data.project);
          setMid(data.mid);
          setQuiz(data.quiz);
          setFinal(data.final);
          setStatus(data.status);
          setGrade(data.grade);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
  
    fetchCourseData();
  }, [courseId, userId]);
  const updateCourse = async () => {
    try {
      if (!userId) {
        console.error("User not authenticated");
        return;
      }
  
      await updateDoc(doc(db, `users/${userId}/courses`, courseId), {
        name,
        code,
        credits,
        section,
        notes,
        schedule,
        assignments,
        project,
        mid,
        quiz,
        final,
        status,
        grade,
      });
      console.log("Course updated successfully");
      navigation.pop(2);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };
  
  // Add schedule entry
  const addScheduleEntry = () => {
    setSchedule([...schedule, { day, startTime, endTime, className }]);
    setDay("");
    setStartTime("");
    setEndTime("");
    setClassName("");
  };
  const deleteScheduleEntry = (indexToDelete) => {
    setSchedule(schedule.filter((_, index) => index !== indexToDelete));
  };
  const showStartPicker = () => {
    setStartPickerVisibility(true);
  };

  const hideStartPicker = () => {
    setStartPickerVisibility(false);
  };

  const showEndPicker = () => {
    setEndPickerVisibility(true);
  };

  const hideEndPicker = () => {
    setEndPickerVisibility(false);
  };

  const handleStartConfirm = (date) => {
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setStartTime(formattedTime);
    hideStartPicker();
  };

  const handleEndConfirm = (date) => {
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setEndTime(formattedTime);
    hideEndPicker();
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <ScrollView style={styles.container} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(name) => setName(name)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Code</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={(code) => setCode(code)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Credits</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={credits.toString()}
          onChangeText={(text) => setCredits(Number(text))}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Section</Text>
        <TextInput
          style={styles.input}
          value={section}
          onChangeText={(section) => setSection(section)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Status</Text>
        <View style={styles.radioGroup}>
          <Pressable
            onPress={() => setStatus("current")}
            style={[styles.radio, status === "current" && styles.radioSelected]}
          />
          <Text>Current</Text>
          <Pressable
            onPress={() => setStatus("completed")}
            style={[styles.radio, status === "completed" && styles.radioSelected]}
          />
          <Text>Completed</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabelGrade}>Grade</Text>
        <DropDownPicker
          listMode="SCROLLVIEW"
          open={open}
          value={grade}
          items={items}
          setOpen={setOpen}
          setValue={setGrade}
          setItems={setItems}
          placeholder="Select Grade"
          style={styles.dropdown}
          dropDownContainerStyle={styles.pickerday}
        />
      </View>


      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Schedule:</Text>
        <View style={styles.contentContainer}>
          {schedule.map((entry, index) => (
            <View key={index} style={styles.scheduleEntry}>
              <Text style={styles.scheduleText}>{`${entry.day}, ${entry.startTime} - ${entry.endTime}, ${entry.className}`}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteScheduleEntry(index)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
          {/* Row for Day, Start Time, and End Time */}

          {/* Day Picker */}
          <DropDownPicker
            listMode="SCROLLVIEW"
            zIndex={100}
            open={openDay}
            value={day}
            items={itemsDay}
            setOpen={setOpenday}
            setValue={setDay}
            setItems={setItemsDay}
            style={styles.dropdown}
            dropDownContainerStyle={styles.pickerday}
          />
          <View style={styles.row}>
            {/* Start Time Picker */}
            <Pressable style={styles.button} onPress={showStartPicker}>
              <Text>Start Time</Text>
            </Pressable>
            <DateTimePickerModal
              isVisible={isStartPickerVisible}
              mode="time"
              onConfirm={handleStartConfirm}
              onCancel={hideStartPicker}
              themeVariant="light"
            />

            {/* End Time Picker */}
            <Pressable style={styles.button} onPress={showEndPicker}>
              <Text>End Time</Text>
            </Pressable>
            <DateTimePickerModal
              isVisible={isEndPickerVisible}
              mode="time"
              onConfirm={handleEndConfirm}
              onCancel={hideEndPicker}
              themeVariant="light"
            />
          </View>

          {/* Class Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Class Name"
            value={className}
            onChangeText={(className) => setClassName(className)}
          />
          <TouchableOpacity style={styles.addButton} onPress={addScheduleEntry}>
            <Text style={styles.addButtonText}>Add Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 60, textAlignVertical: 'top' }]} // Adjust height for 3 lines
          value={notes}
          multiline={true} // Enable multiline input
          numberOfLines={3} // Specify the number of lines
          onChangeText={(notes) => setNotes(notes)}
        />
      </View>

      <Pressable style={styles.btn} onPress={updateCourse}>
        <Text style={styles.btnText}>Update</Text>
      </Pressable>
      <Text ></Text>
      <Text ></Text>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Raleway-ThinItalic",
    textAlign: "center",
    marginBottom: 20,
    color: "#25a6c2",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#4a4a4a",
  },
  labelSched: {
    textAlign: "center",
    color: "#4a4a4a",
  },
  contentContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    paddingTop: 20,

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
    color: "#808080", // Light gray color for label
    paddingHorizontal: 5,
    fontSize: 12,
    zIndex: 1,
  },
  inputLabelGrade: {
    top: -10,
    left: 10,
    marginBottom: -5,
    backgroundColor: "#fff",
    color: "#808080", // Light gray color for label
    paddingHorizontal: 5,
    fontSize: 12,
    zIndex: 1,
  },
  pickerDropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#d3d3d3",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "black",
  },
  picker: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#d3d3d3",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#fff",
    color: "#25a6c2",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    padding: 10,
  },
  pickerday: {
    flex: 1,
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: "#25a6c2",
    borderRadius: 8,
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },
  addButton: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  scheduleEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  scheduleText: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
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
  btn: {
    backgroundColor: "#25a6c2",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    gap: 10,
    marginLeft: 10,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#25a6c2",
    marginRight: 5,
  },
  radioSelected: {
    backgroundColor: "#25a6c2",
  },
});

export default EditCourse;

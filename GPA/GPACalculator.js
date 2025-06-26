// GPACalculator.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";

const GPACalculator = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [grade, setGrade] = useState("");
  const [credits, setCredits] = useState("");
  const [scale, setScale] = useState("4");
  const [semesterGPA, setSemesterGPA] = useState(0);
  const [isCumulative, setIsCumulative] = useState(false);
  const [previousGPA, setPreviousGPA] = useState("");
  const [previousCredits, setPreviousCredits] = useState("");
  const [gradeModalVisible, setGradeModalVisible] = useState(false);

  const addCourse = () => {
    if (!courseName || !grade || !credits) {
      alert("Please fill out all fields!");
      return;
    }

    const gradeValues = {
      "A+": 5,
      "A": 4.75,
      "B+": 4.5,
      "B": 4,
      "C+": 3.5,
      "C": 3,
      "D+": 2.5,
      "D": 2.0,
      "F": 1,
    };

    const newCourse = {
      id: Math.random().toString(),
      name: courseName,
      grade: gradeValues[grade],
      credits: parseFloat(credits),
    };
    setCourses([...courses, newCourse]);
    setCourseName("");
    setGrade("");
    setCredits("");
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const calculateGPA = () => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedGrades = courses.reduce((sum, course) => sum + course.grade * course.credits, 0);
    const semesterGPA = totalCredits > 0 ? weightedGrades / totalCredits : 0;

    if (isCumulative && previousGPA && previousCredits) {
      const totalPrevCredits = parseFloat(previousCredits);
      const cumulativeGPA =
        (semesterGPA * totalCredits + parseFloat(previousGPA) * totalPrevCredits) /
        (totalCredits + totalPrevCredits);
      setSemesterGPA(cumulativeGPA.toFixed(2));
    } else {
      setSemesterGPA(semesterGPA.toFixed(2));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPA Calculator</Text>

      <View style={styles.rowSpacing}>
        <TextInput
          style={styles.input}
          placeholder="Course"
          placeholderTextColor="#A0A0A0"
          value={courseName}
          onChangeText={setCourseName}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setGradeModalVisible(true)}
        >
          <Text style={grade ? styles.inputText : styles.placeholderText}>  
            {grade || "Grade"}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={gradeModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {Object.keys({
                "A+": 4.3,
                "A": 4.0,
                "B+": 3.7,
                "B": 3.3,
                "C+": 3.0,
                "C": 2.7,
                "D+": 2.3,
                "D": 2.0,
                "F": 0.0,
              }).map((gradeOption) => (
                <TouchableOpacity
                  key={gradeOption}
                  onPress={() => {
                    setGrade(gradeOption);
                    setGradeModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalText}>{gradeOption}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <TextInput
          style={styles.input}
          placeholder="Credits"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          value={credits}
          onChangeText={setCredits}
        />
      </View>

      <View style={styles.rowSpacing}>
        <Text style={styles.scaleText}>Scale</Text>
        <TouchableOpacity
          style={styles.pickerCompact}
          onPress={() => setScale(scale === "4" ? "5" : "4")}
        >
          <Text style={[styles.pickerText, { color: "#25a6c2" }]}>{scale}.0</Text>
        </TouchableOpacity>
      </View>

      <Pressable style={styles.addButton} onPress={addCourse}>
        <Text style={styles.addButtonText}>Add Course</Text>
      </Pressable>

      <View style={styles.rowSpacing}>
        <Pressable
          style={[styles.toggleButton, isCumulative && styles.activeButton]}
          onPress={() => setIsCumulative(!isCumulative)}
        >
          <Text style={styles.toggleButtonText}>
            {isCumulative ? "Cumulative" : "Semester Only"}
          </Text>
        </Pressable>
      </View>

      {isCumulative && (
        <View style={styles.rowSpacing}>
          <TextInput
            style={styles.input}
            placeholder="Previous GPA"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
            value={previousGPA}
            onChangeText={setPreviousGPA}
          />
          <TextInput
            style={styles.input}
            placeholder="Previous Credits"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
            value={previousCredits}
            onChangeText={setPreviousCredits}
          />
        </View>
      )}

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseItemContainer}>
            <Text style={styles.courseItem}>
              {item.name} - Grade: {item.grade}, Credits: {item.credits}
            </Text>
            <Pressable style={styles.deleteButton} onPress={() => deleteCourse(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable style={styles.calculateButton} onPress={calculateGPA}>
        <Text style={styles.calculateButtonText}>Calculate GPA</Text>
      </Pressable>

      <Text style={styles.result}>GPA: {semesterGPA}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF", // Set background color to white
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left", // Align title to the left
    color: "#5bc2d8", // Set title color to blue
  },
  rowSpacing: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15, // Adjusted for better spacing
  },
  scaleText: {
    color: "#25a6c2",
    marginVertical: 3,
  },
  placeholderText: {
    color: "#A0A0A0",
  },
  inputText: {
    color: "#000000",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#25a6c2",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  pickerCompact: {
    width: "30%",
    borderWidth: 1,
    borderColor: 'lightblue',
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  pickerText: {
    textAlign: "center",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#5bc2d8',
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  toggleButton: {
    backgroundColor: '#5bc2d8',
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "#25a6c2",
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
  },
  courseItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  courseItem: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
  },
  calculateButton: {
    backgroundColor: '#5bc2d8',
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  calculateButtonText: {
    color: "white",
    fontSize: 16,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    width: "100%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#25a6c2",
  },
});

export default GPACalculator;

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const CourseInfo = ({ route }) => {
  const { course } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{course.name} ({course.code})</Text>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate("EditCourse", { courseId: course.id })}
        >
          <MaterialIcons name="edit" size={24} color="#25a6c2" />
        </TouchableOpacity>
      </View>

      {/* Row for Credits and Grade */}
      <View style={styles.row}>
        <View style={[styles.rowItem, styles.bordered]}>
          <Text style={styles.label}>Section</Text>
          <Text style={styles.value}>{course.section}</Text>
        </View>
        <View style={[styles.rowItem, styles.bordered]}>
          <Text style={styles.label}>Credits</Text>
          <Text style={styles.value}>{course.credits}</Text>
        </View>
        <View style={[styles.rowItem, styles.bordered]}>
          <Text style={styles.label}>Grade</Text>
          <Text style={styles.value}>{course.grade}</Text>
        </View>
        
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Schedule:</Text>
        {course.schedule.length > 0 ? (
          course.schedule.map((entry, index) => (
            <View key={index} style={styles.scheduleEntry}>
              <Text style={styles.value}>
                {entry.day}, {entry.startTime} - {entry.endTime}, Class {entry.className}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>No schedule available.</Text>
        )}
      </View>

      <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <View style={styles.scheduleEntry}>
          <Text style={styles.value}>{course.notes}</Text>
          </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#25a6c2",
  },
  editIcon: {
    padding: 5,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  scheduleEntry: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  rowItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  bordered: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 5,
  },
});

export default CourseInfo;

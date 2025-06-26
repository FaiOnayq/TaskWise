import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { db } from "../firebaseConfig";
import { collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase authentication

const CoursesScreen = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null); // State to hold the current user's ID
  const [showOldCourses, setShowOldCourses] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth(); // Firebase authentication instance

  // Fetch data from Firestore for the logged-in user
  const fetchData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No user is logged in.");
        return;
      }

      const userId = currentUser.uid; // Get the current user's ID
      setUserId(userId);

      const coursesQuery = query(collection(db, `users/${userId}/courses`));
      const querySnapshot = await getDocs(coursesQuery);
      const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    const timeout = setTimeout(() => {
      setRefreshing(false);
    }, 5000);

    try {
      await fetchData();
    } catch (error) {
      console.error("Error refreshing data: ", error);
    } finally {
      clearTimeout(timeout);
      setRefreshing(false);
    }
  };

  const handleCourseClick = (course) => {
    navigation.navigate('CourseInfoScreen', { course });
  };

  const handleAddCourse = () => {
    navigation.navigate('Add Course');
  };

  const handleDeleteCourse = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${userId}/courses`, id));
      setData((prevData) => prevData.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Error deleting course: ", error);
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        Alert.alert(
          "Delete Course",
          "Are you sure you want to delete this course?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => handleDeleteCourse(id) },
          ]
        );
      }}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
      <Image
        source={require('../assets/courses.png')} // Local image
        style={styles.image}
      />
        {/* Old Courses Section */}
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setShowOldCourses(!showOldCourses)}
        >
          <Text style={styles.sectionTitle}>Old courses</Text>
          <Text style={styles.arrow}>{showOldCourses ? '\u25B2' : '\u25BC'}</Text>
        </TouchableOpacity>

        {showOldCourses && (
          data.length > 0 ? (
            data.map((course) =>
              course.status === 'completed' ? (

                <Swipeable key={course.id} renderRightActions={() => renderRightActions(course.id)} >
                  <TouchableOpacity key={course.id} style={styles.oldCourseItem} onPress={() => handleCourseClick(course)}>
                    <Text style={styles.courseText}>{course.name}</Text>
                    <View style={styles.gradeBadge}>
                      <Text style={styles.gradeText}>{course.grade}</Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ) : null
            )
          ) : (
            <Text style={styles.noDataText}>No data available</Text>
          )
        )}

        {/* Current Courses Section */}
        <View style={styles.currentCoursesContainer}>
          <Text style={styles.sectionTitleWithUnderline}>This semester courses</Text>
          {data.length > 0 ? (
            data.map((course) =>
              course.status === 'current' ? (
                <Swipeable key={course.id} renderRightActions={() => renderRightActions(course.id)}>
                  <TouchableOpacity
                    key={course.id}
                    style={styles.courseItem}
                    onPress={() => handleCourseClick(course)}
                  >
                    <Text style={styles.courseText}>{course.name}</Text>
                    <Text style={styles.arrow}>{'\u2192'}</Text>
                  </TouchableOpacity>
                </Swipeable>
              ) : null
            )
          ) : (
            <Text style={styles.noDataText}>No data available</Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitleWithUnderline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  oldCourseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  gradeBadge: {
    backgroundColor: '#25a6c2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  gradeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  courseText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#25a6c2',
  },
  currentCoursesContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonContainer: {
    padding: 10,
    marginTop: 10,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
    backgroundColor: '#25a6c2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: "#FF6666",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    flex: 1,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});

export default CoursesScreen;

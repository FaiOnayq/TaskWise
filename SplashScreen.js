import React, { useEffect } from "react";
import { View, Image, Text, Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

// Import Screens
import LoginScreen from "./Account/Login";
import SignUpScreen from "./Account/SignUp";
import ForgotPassword from "./Account/ForgotPassword";
import CalendarAll from "./Calendar/calendar";
import Add from "./Calendar/add";
import EditTask from "./Calendar/EditTask";
import CoursesScreen from "./Courses/CoursesScreen";
import CourseInfoScreen from "./Courses/CourseInfoScreen";
import AddCourse from "./Courses/AddCourse";
import EditCourse from "./Courses/EditCourse";
import GPACalculator from "./GPA/GPACalculator";
import Profile from "./Account/ProfilePage";

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AddStack = createNativeStackNavigator();

const BGColor = "lightblue";
const Logo = require("./assets/Logo.png");

// AddStack Navigator
function AddStackFun() {
  return (
    <AddStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#25a6c2',  
      },
      headerTintColor: "#fff", 
      headerTitleAlign: "center", 
    }}>
      <AddStack.Screen name="Calendar" component={CalendarAll} />
      <AddStack.Screen name="Add" component={Add} />
      <AddStack.Screen name="EditTask" component={EditTask} />
    </AddStack.Navigator>
  );
}

// Courses Stack
function CoursesStack() {
  return (
    <AddStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#25a6c2',  
      },
      headerTintColor: "#fff", 
      headerTitleAlign: "center", 
    }}>
      <AddStack.Screen name="Courses Screen" component={CoursesScreen} />
      <AddStack.Screen name="CourseInfoScreen" component={CourseInfoScreen} />
      <AddStack.Screen name="Add Course" component={AddCourse} />
      <AddStack.Screen name="EditCourse" component={EditCourse} />
    </AddStack.Navigator>
  );
}

// GPA Stack
function GPAStack() {
  return (
    <AddStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#25a6c2',  
      },
      headerTintColor: "#fff", 
      headerTitleAlign: "center", 
    }}>
      <AddStack.Screen name="GPA" component={GPACalculator} />
    </AddStack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <AddStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#25a6c2',  
      },
      headerTintColor: "#fff", 
      headerTitleAlign: "center", 
    }}
    >
      <AddStack.Screen name="Profile" component={Profile} />
    </AddStack.Navigator>
  );
}


// Tab Navigator
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Calendar") iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Courses") iconName = focused ? "file-tray-full" : "file-tray-full-outline";
          else if (route.name === "GPA") iconName = focused ? "calculator" : "calculator-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        
      })}
    >
      <Tab.Screen name="Calendar" component={AddStackFun} options={{ headerShown: false }} />
      <Tab.Screen name="Courses" component={CoursesStack} options={{ headerShown: false }} />
      <Tab.Screen name="GPA" component={GPAStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Splash Screen
function SplashScreen({ onFinish }) {
  const opacity = useSharedValue(1);
  const scaleLogo = useSharedValue(1);
  const scaleTitle = useSharedValue(1);

  useEffect(() => {
    setTimeout(() => {
      // Start animations
      opacity.value = withTiming(0, { duration: 1000 });
      scaleLogo.value = withTiming(0.7, { duration: 1000 });
      scaleTitle.value = withTiming(0.8, { duration: 1000 });

      // Finish splash screen after animations
      setTimeout(() => {
        onFinish();
      }, 1000);
    }, 1500);
  }, []);

  const splashStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleLogo.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleTitle.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: '#25a6c2',
          position: "absolute",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          zIndex: 1,
        },
        splashStyle,
      ]}
    >
      <Animated.Image source={Logo} style={[{ width: 120, height: 120, marginBottom: 20 }, logoStyle]} />
      <Animated.Text style={[{ fontSize: 24, fontWeight: "bold", color: "white" }, titleStyle]}>
        Task Wise
      </Animated.Text>
    </Animated.View>
  );
}

// Main App Component
export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
        {!showSplash && (
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Calendar" component={CalendarAll} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
            <AuthStack.Screen name="HomeTabs" component={HomeTabs} />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgtJPYDHwBGztkS0FwHcwvgB6rE2yxv08",
  authDomain: "taskwise-e332f.firebaseapp.com",
  projectId: "taskwise-e332f",
  storageBucket: "taskwise-e332f.firebasestorage.app",
  messagingSenderId: "716488336143",
  appId: "1:716488336143:web:98f0f934a8b65d0e88947a",
  measurementId: "G-3KJJ9HT526"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const realtimeDb = getDatabase(app);
export const storage = getStorage(app);



import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./SplashScreen";



export default function App() {


    return (
        <SafeAreaProvider>
            <SplashScreen></SplashScreen>
        </SafeAreaProvider>
    );
}
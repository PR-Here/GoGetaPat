/** @format */

import React, { useState, useRef, useEffect } from "react";
import { AuthProvider } from "./src/contexts/authContext";
import AppNavigator from "./AppNavigator";
import { HomeProvider } from "./src/contexts/HomeContext";
// google login implimentation need to be compleated droped for now
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { setBadge } from "./src/common/helper";
import { Platform, AppState, LogBox } from "react-native";
import { ProfileProvider } from "./src/contexts/profileContext";
import { useSelector } from "react-redux";

GoogleSignin.configure({
  webClientId:
    "1052310868832-3e0o0vkh63c0p8qev8hut29l5hkok1o6.apps.googleusercontent.com",
  androidClientId:
    "1052310868832-jss1u3ft9qnkagfv059k15ch4kikm8ph.apps.googleusercontent.com",
  iosClientId:
    "1052310868832-ap3p05din4okcm2hovr306rnmuci5mdh.apps.googleusercontent.com",
});

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const { activeScreen } = useSelector((state) => state);

  const StoreFcmDeviceToken = async () => {
    try {
      const fcmDeviceToken = await messaging().getToken();

      AsyncStorage.setItem("deviceToken", fcmDeviceToken);
    } catch (e) {}
  };

  React.useEffect(() => {
    LogBox.ignoreAllLogs();
    StoreFcmDeviceToken();
    setBadge(0);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setBadge(0);
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <HomeProvider>
        <ProfileProvider>
          <AppNavigator />
        </ProfileProvider>
      </HomeProvider>
    </AuthProvider>
  );
}

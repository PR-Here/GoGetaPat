/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */
import React from "react";
import { AppRegistry, Platform } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Provider } from "react-redux";

let notificationArray = [];

import PushNotification from "react-native-push-notification";
import configureStore from "./src/redux/store/configureStore";

const store = configureStore();

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    // console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

function setBackHandler() {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    try {
      Platform.OS == "ios"
        ? PushNotificationIOS.getApplicationIconBadgeNumber((resp) => {
            PushNotificationIOS.setApplicationIconBadgeNumber(resp + 1);
          })
        : null;

      if (notificationArray.indexOf(remoteMessage.data.from_user) === -1) {
        notificationArray.push(remoteMessage.data.from_user);
      }
      await AsyncStorage.setItem(
        "notificationArray",
        JSON.stringify(notificationArray)
      );
    } catch (e) {
      // saving error
    }
  });
}

async function requestUserPermission() {
  try {
    const authorizationStatus = await messaging().requestPermission({
      sound: true,
      announcement: true,
      badge: true,
      provisional: false,
    });

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      setBackHandler();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      setBackHandler();
    } else {
    }
  } catch (e) {}
}
requestUserPermission();

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <RNRedux />;
}
const RNRedux = () => {
  try {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  } catch (e) {}
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);

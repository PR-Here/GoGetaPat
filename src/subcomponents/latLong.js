/** @format */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Linking,
  Platform,
  Alert,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import customToastMsg from "./CustomToastMsg";

const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      customToastMsg("Unable to open settings");
    });
  };

  const status = await Geolocation.requestAuthorization("whenInUse");
  // console.log(status);
  if (status === "granted") {
    return true;
  }

  if (status === "denied") {
    // customToastMsg('Go to your device settings and allow location service for GoGetaPet');
    Alert.alert(
      `Go to your device settings and allow location service for GoGetaPet`,
      "",
      [
        { text: "Go to Settings", onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ]
    );
  }

  if (status === "disabled") {
    Alert.alert(
      `Turn on Location Services to allow GoGetaPet to determine your location.`,
      "",
      [
        { text: "Go to Settings", onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ]
    );
  }

  return false;
};

// Has location permission for both IOs and Android
const hasLocationPermission = async () => {
  if (Platform.OS === "ios") {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === "android" && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  if (hasPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    // customToastMsg('Location permission denied by user.', 'long');
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    // customToastMsg('Location permission revoked by user.', 'long');
  }

  return false;
};

export const requestLocationPermission = async (setLatitude, setLongitude) => {
  let isPermission = await hasLocationPermission();

  try {
    if (isPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {},
        {
          accuracy: { android: "high", ios: "best" },
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    }
  } catch (err) {}
};

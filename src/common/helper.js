/** @format */

import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { firebase } from "@react-native-firebase/dynamic-links";
import { Platform } from "react-native";
export function validateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }

  return false;
}

export function validatePhoneNumber(phone) {
  var regexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{5,6}$/im;
  let _phone = phone.split(" ").join("");
  _phone = _phone.split("-").join("");
  return regexp.test(_phone);
}

export function validatePassword(password) {
  var regexp =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  return regexp.test(password);
}

// pad 0 infront of a integer value
export function pad(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}

// Storing string value
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};
// #Storing object value
export const storeObjData = async (key, value) => {
  try {
    let jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

//read string from async storage
export async function getData(key) {
  try {
    let value = await AsyncStorage.getItem(key);
    return value != null ? value : null;
  } catch (e) {
    // error reading value
    console.log(e);
  }
}

//Reading object value
export async function getObjData(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key, (error, result) => {
      return result;
    });

    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e, "elkdf lkasf ");
  }
}

//get columns
export function getCol(arr, column) {
  var colData = [];
  arr.map((x) => {
    if (colData.indexOf(x[column]) == -1) {
      colData.push(x[column]);
    }
  });

  return colData; // return column data.
}

export function nameValidate(name) {
  var regex = new RegExp("^[a-zA-Z ]*$");
  // var str = String.fromCharCode(!name.charCode ? name.which : name.charCode);
  if (regex.test(name)) {
    return true;
  }
  return false;
}

export function priceValidate(name) {
  var regex = new RegExp("^([0-9]+.?[0-9]*|.[0-9]+)$");
  // var str = String.fromCharCode(!name.charCode ? name.which : name.charCode);
  if (regex.test(name) || name === "") {
    return true;
  }
  return false;
}

export function numValidate(num) {
  var regex = new RegExp("^[+]?[0-9]*$");
  // var str = String.fromCharCode(!name.charCode ? name.which : name.charCode);
  if (regex.test(num)) {
    return true;
  }
  return false;
}

export function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  });
}

var monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export function dateFormat(d) {
  var t = new Date(d);
  return t.getDate() + " " + monthNames[t.getMonth()] + " " + t.getFullYear();
}
export function validateTitle(name) {
  var regex = new RegExp("^[a-zA-Z0-9 ]*$");
  if (regex.test(name)) {
    return true;
  }
  return false;
}

export function numberValidate(num) {
  var regex = new RegExp("^[1-9]*$");
  if (regex.test(num)) {
    return true;
  }
  return false;
}

export function weekValidate(num) {
  var regex = new RegExp("^[1-4]*$");
  if (regex.test(num)) {
    return true;
  }
  return false;
}

export const setBadge = (number) => {
  try {
    if (Platform.OS == "ios") {
      PushNotificationIOS.setApplicationIconBadgeNumber(number);
    }
  } catch (e) {
    console.log(e, "setBadge");
  }
};

export const generateLink = async (param, value, withoutPrams = false) => {
  const link = await firebase.dynamicLinks().buildShortLink({
    link: withoutPrams
      ? `https://gogetapet.com/`
      : `https://gogetapet.com/?${param}=${value}`,
    ios: {
      bundleId: "com.pets4u",
      appStoreId: "1581126772",
      fallbackUrl: "https://apps.apple.com/in/app/gogetapet/id1581126772",
    },
    android: {
      packageName: "com.pets4u",
      fallbackUrl: "https://play.google.com/store/apps/details?id=com.pets4u",
    },
    domainUriPrefix: "https://gogetapet.page.link",
    navigation: {
      forcedRedirectEnabled: true,
    },
  });

  return link;
};

export const getAppLaunchLink = async (navigation) => {
  try {
    const { url } = await firebase.dynamicLinks().getInitialLink();
    // console.log(url, 'got url')
    if (url) {
      // alert(JSON.stringify(url) + "getLink")
      let id = url.split("=")[1];
      if (id) {
        navigation.navigate("Post", { id });
      }
    }
    //handle your link here
  } catch {
    //handle errors
  }
};

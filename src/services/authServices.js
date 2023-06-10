/** @format */

import auth, { firebase } from "@react-native-firebase/auth";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { numbername, login, fetchUserDetail, socialLogin, logOut } from "./api";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager } from "react-native-fbsdk-next";
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthCredentialState,
} from "@invertase/react-native-apple-authentication";

const signIn = async (name, number) => {
  try {
    // const response = await Auth.signIn(email, number);
    return "response";
  } catch (error) {
    throw new Error(error.message);
  }
};

const signUp = async (name, number) => {
  try {
    // const response = await Auth.signUp({ username, number });
    return "response";
  } catch (error) {
    throw new Error(error.message);
  }
};

const confirmSignUp = async (number, code) => {
  try {
    // const response = await Auth.confirmSignUp(number, code, {
    // forceAliasCreation: true
    // });
    return "response";
  } catch (error) {
    throw new Error(error.message);
  }
};

const signOut = async (dispatch, authState) => {
  try {
    const unsubscribe = await auth()
      .signOut()
      .then(async () => {
        clear = null;
        logOut(clear);
        // await GoogleSignin.signOut();

        try {
          await GoogleSignin.signOut();
          LoginManager.logOut();
          if (appleAuth.isSupported) {
            if (firebase.auth().currentUser?.providerData) {
              for (
                let i = 0;
                i < firebase.auth().currentUser?.providerData?.length;
                i++
              ) {
                if (
                  firebase.auth().currentUser?.providerData[i].providerId ===
                  "apple.com"
                ) {
                  console.log(
                    "UserStore::logout - found apple.com provider, trying logout"
                  );
                  const appleAuthRequestResponse =
                    await appleAuth.performRequest({
                      requestedOperation: AppleAuthRequestOperation.LOGOUT,
                      user: firebase.auth().currentUser?.providerData[i].uid,
                    });

                  // get current authentication state for user
                  const credentialState =
                    await appleAuth.getCredentialStateForUser(
                      appleAuthRequestResponse.user
                    );

                  // use credentialState response to ensure the user credential's have been revoked
                  if (credentialState === AppleAuthCredentialState.REVOKED) {
                    console.log(
                      "UserStore::logout - apple credential successfully revoked"
                    );
                  }
                }
              }
            }
          }
        } catch (e) {
          console.log("UserStore::logout - error from apple logout", e);
        }
        await dispatch({ type: "SIGN_OUT" });
        authState.loginedUser = null;
        authState.userToken = null;
        const asyncStorageKeys = await AsyncStorage.getAllKeys();
        const deviceToken = await AsyncStorage.getItem("deviceToken");

        if (asyncStorageKeys.length > 0) {
          if (Platform.OS === "android") {
            await AsyncStorage.clear();
          }
          if (Platform.OS === "ios") {
            await AsyncStorage.multiRemove(asyncStorageKeys);
          }
          await AsyncStorage.setItem("deviceToken", deviceToken);
        }
      });
    return unsubscribe;
  } catch (error) {
    console.log("logout err ", error.message);
  }
};

const checkAuth = async (dispatch, navigation, setAnimate = null) => {
  try {
    const unsubscribe = auth().onAuthStateChanged((res) => {
      if (res) {
        res
          .getIdToken(true)
          .then(async (idToken) => {
            if (res.uid) {
              /**
               * Check if display is coming or not,
               * if not then get from email id
               */
              let name = res.displayName;
              if (!name) {
                if (res?.email) name = res.email.split("@")[0];
                else name = "";
              }

              socialLogin(idToken, name, res.email, res.photoURL).then(
                (res) => {
                  if (setAnimate) {
                    setAnimate(false);
                  }
                  if (res?.accessToken) {
                    AsyncStorage.setItem('loginValue', JSON.stringify(true));
                    dispatch({ type: "SIGN_IN", token: res.accessToken });

                    fetchUserDetail(res.user.id).then((res) => {
                      dispatch({ type: "SIGN_IN_USER", loginedUser: res.data });
                    });

                    navigation.navigate("TabNavigator");
                  } else {
                    dispatch({
                      type: "SIGN_IN",
                      token: null,
                      loginedUser: null,
                    });
                  }
                }
              );
            }
          })
          .catch((err) => {
            customToastMsg(err.message);
          });
      }
    });
    return unsubscribe;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { signIn, signOut, checkAuth, signUp, confirmSignUp };

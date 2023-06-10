/** @format */

import * as React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RNBootSplash from "react-native-bootsplash";
import {
  Text,
  Platform,
  View,
  StyleSheet,
  Image,
  AppState,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useAuthState, useAuthDispatch } from "./src/contexts/authContext";
// import { checkAuth } from './src/services/authServices';
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
// import HomeScreen from './src/screens/HomeScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

import ToHideTab from "./src/subcomponents/ToHideTab";

// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  fontBold,
  fontLight,
  fontRegular,
  fontSemiBold,
  themeColor,
  fontMediumTextColor,
  textInputBorderColor,
  fontMediumTextColor2,
  fontMediumTextColor3,
} from "./src/common/common";

import HomeScreen from "./src/screens/HomeScreen";
import PubPri from "./src/screens/PubPri";
import PurSales from "./src/screens/PurSales";
import InboxScreen from "./src/screens/InboxScreen";
import PostScreen from "./src/screens/PostScreen";
import AccountScreen from "./src/screens/AccountScreen";
import PostItemScreen from "./src/screens/PostItemScreen";
import ItemDash from "./src/screens/ItemDash";
// import Profile from './src/screens/Pofile';
import SellingScreen from "./src/screens/SellingScreen";
import Post from "./src/screens/Post";
import Posted from "./src/screens/Posted";
import SearchScreen from "./src/screens/SearchScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SavedItems from "./src/screens/SavedItems";
import Accsetting from "./src/screens/Accsetting";
import Boost from "./src/screens/BoostAdScreen";
import BoostPost from "./src/screens/BoostPostScreen";
import HelpCenter from "./src/screens/HelpCenter";
import Archived from "./src/screens/Archived";
import SignInScreen from "./src/screens/SignInScreen";
import VerificationScreen from "./src/screens/VerificationScreen";
import { useHomeDispatch, useHomeState } from "./src/contexts/HomeContext";
import messaging from "@react-native-firebase/messaging";
import UpdateProfileScreen from "./src/screens/UpdateProfile";
import { useProfileDispatch } from "./src/contexts/profileContext";
import { getAppLaunchLink } from "./src/common/helper";
import { firebase } from "@react-native-firebase/dynamic-links";
import NavigationService from "./src/services/NavigationService";
import PetComment from "./src/screens/PetComment";

// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
  let stateHome = useHomeState();
  let dispatchHome = useHomeDispatch();

  // React.useEffect(() => {
  //     const unsubscribe = messaging().onMessage(async remoteMessage => {
  //         if (!stateHome.notificationUser.includes(remoteMessage.data.from_user)) {

  //             dispatchHome({
  //                 type: "SET_NOTIFICATION_USER",
  //                 payload: remoteMessage.data.from_user
  //             })

  //         }

  //         dispatchHome({
  //             type: "SET_NOTIFICATION_TOGGLER",
  //             payload: !stateHome.notificationToggler
  //         })
  //     });
  //     return unsubscribe;
  // });
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused, color, size }) => {
          let iconTitle;
          let iconName = focused;

          if (route.name === "Home") {
            iconTitle = "Home";
          } else if (route.name === "Inbox") {
            iconTitle = "Inbox";
          } else if (route.name === "PostItemHide") {
            iconTitle = "Post";
          } else if (route.name === "Selling") {
            iconTitle = "Selling";
          } else if (route.name === "Account") {
            iconTitle = "Account";
          }

          return (
            <Text
              style={
                (iconName = focused
                  ? {
                      fontSize: wp("3.8%"),
                      paddingTop: 10,
                      paddingBottom: 15,
                      color: themeColor,
                    }
                  : {
                      fontSize: wp("3.8%"),
                      paddingTop: 10,
                      paddingBottom: 15,
                      color: "black",
                    })
              }
            >
              {iconTitle}
            </Text>
          );
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused
              ? require("./src/images/home-inactive.png")
              : require("./src/images/home-active.png");
          } else if (route.name === "Inbox") {
            iconName = focused
              ? require("./src/images/inbox-active.png")
              : require("./src/images/inbox-inactive.png");
          } else if (route.name === "PostItemHide") {
            iconName = focused
              ? require("./src/images/post-active.png")
              : require("./src/images/post-inactive.png");
          } else if (route.name === "Selling") {
            iconName = focused
              ? require("./src/images/selling-active.png")
              : require("./src/images/selling-inactive.png");
          } else if (route.name === "Account") {
            iconName = focused
              ? require("./src/images/account-active.png")
              : require("./src/images/account-inactive.png");
          }

          return (
            <View
              style={[
                styles.tab_nav_Image,
                {
                  paddingTop: focused ? hp("0.5%") : hp("1%"),
                  marginBottom: focused ? -hp("0.5%") : -hp("0.8%"),
                  borderTopWidth: focused ? 5 : null,
                },
              ]}
            >
              <Image
                source={iconName}
                style={{
                  height: hp("5.4%"),
                  width: wp("6.8%"),
                  resizeMode: "contain",
                }}
              />
              {stateHome != null ? (
                route.name === "Inbox" ? (
                  stateHome.notificationUser?.length ? (
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: "red",
                        width: 10,
                        height: 10,
                        borderRadius: 50,
                        top: 4,
                        right: 8,
                      }}
                    ></View>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </View>
          );
        },
        tabBarStyle:
          Platform.OS == "ios"
            ? {
                height: hp("13%"),
                marginTop: hp("1%"),
              }
            : {
                height: hp("10%"),
                marginTop: hp("1%"),
              },
        tabBarHideOnKeyboard: true,
        // tabBarActiveBackgroundColor : "#fbfbfb",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Selling" component={SellingScreen} />
      <Tab.Screen name="PostItemHide" component={ToHideTab} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(
    appState.current
  );

  const state = useAuthState();
  const dispatch = useAuthDispatch();
  const profileDispatch = useProfileDispatch();

  const dispatchHome = useHomeDispatch();
  const stateHome = useHomeState();
  const [initialRoute, setInitialRoute] = React.useState("TabNavigator");

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (!stateHome.notificationUser.includes(remoteMessage.data.from_user)) {
        dispatchHome({
          type: "SET_NOTIFICATION_USER",
          payload: remoteMessage.data.from_user,
        });
      }
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    let getNotificationData = async () => {
      try {
        let notificationArray = await AsyncStorage.getItem("notificationArray");
        if (notificationArray !== null) {
          let notificationUpdatedArray = JSON.parse(notificationArray);
          dispatchHome({
            type: "UPDATE_NOTIFICATION_USER",
            payload: notificationUpdatedArray,
          });
          await AsyncStorage.removeItem("notificationArray");
          // }
        }
      } catch (e) {}
    };

    // getNotificationData();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        getNotificationData();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    // messaging().getInitialNotification().then(remoteMessage => {

    //     getNotificationData();
    //     // if (remoteMessage) {
    //     // setInitialRoute("Inbox")
    //     // }
    // });

    return () => {
      subscription.remove();
    };
  }, []);

  const updateProfileModal = () => {
    if (state.hasOwnProperty("loginedUser")) {
      if (state.loginedUser) {
        if (state.loginedUser.hasOwnProperty("name_confirmed")) {
          if (!state.loginedUser.name_confirmed) {
            profileDispatch({ type: "CONF_INFO", payload: true });
          }
        }
      }
    }
  };
  React.useEffect(() => {
    if (Platform.OS == "android") {
      setTimeout(function () {
        RNBootSplash.hide({ fade: true });
      }, 3000);
    }

    if (state?.loginedUser) {
      updateProfileModal();
    }
  }, [state, dispatch]);

  const config = {
    // screens: {
    //     Main: {
    screens: {
      Post: {
        path: "post/:id",
        initialRouteName: "TabNavigator",
      },
    },
    //     }
    // },
  };

  const linking = {
    prefixes: ["pets4u://", "https://pets4u.com", "https://gogetapet.com"],
    config,
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
        linking={linking}
        fallback={<Text>Loading...</Text>}
      >
        <Stack.Navigator
          initialRouteName={"TabNavigator"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Group screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="Home" component={HomeScreen}/> */}
            {/* {
                            state.userToken == null ? ( */}
            {/* // No token found, user isn't signed in */}
            {/* <Stack.Screen name="Auth" isSignout={state.isSignout} component={AuthNavigator} /> */}
            {/* ) : ( */}
            {/* // User is signed in */}
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen
              name="Post Item"
              component={Post}
              initialParams={{ true: false }}
            />
            <Stack.Screen name="Post" component={PostScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Message" component={ChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ItemDash" component={ItemDash} />
            <Stack.Screen name="Posted" component={Posted} />
            <Stack.Screen name="Pursales" component={PurSales} />
            <Stack.Screen name="Saveditems" component={SavedItems} />
            <Stack.Screen name="Accsetting" component={Accsetting} />
            <Stack.Screen name="Boost" component={Boost} />
            <Stack.Screen name="BoostPost" component={BoostPost} />
            <Stack.Screen name="Pubpri" component={PubPri} />
            <Stack.Screen name="Helpcenter" component={HelpCenter} />
            <Stack.Screen name="Archived" component={Archived} />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: "Sign in",
                animationTypeForReplace: state.isSignout ? "pop" : "push",
              }}
            />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="PetCommentScreen" component={PetComment} />
            {/* ) */}
            {/* } */}
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      <UpdateProfileScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1,
    // paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },
  profile_view: {
    // justifyContent: 'center',
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 5,
  },
  profile_img: {
    width: hp("10%"),
    height: hp("10%"),
    borderRadius: hp("50%"),
    resizeMode: "cover",
  },
  profile_img_upload: {
    width: wp("13%"),
    height: hp("8%"),
    marginBottom: 20,
    resizeMode: "contain",
    position: "absolute",
    bottom: 5,
    right: 22,
  },
  content_view: {
    paddingHorizontal: wp("4.5%"),
  },
  profile_Link: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profile_Link_img: {
    resizeMode: "contain",
    height: 30,
    width: 30,
  },
  profile_Link_Text: {
    fontSize: 15,
    color: fontMediumTextColor2,
    paddingLeft: 10,
    fontWeight: "bold",
  },
  inner_content_view: {
    paddingBottom: 40,
    // paddingHorizontal: 8
  },
  btnStyle: {
    backgroundColor: themeColor,
    width: "100%",
    height: 40,
    // padding: 10,
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  btnTxtStyle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: fontBold,
    // fontSize: 14
  },
  txtStyle1: {
    fontFamily: fontBold,
    marginBottom: 8,
    fontSize: wp("8%"),
  },
  txtStyle2: {
    textAlign: "center",
    fontFamily: fontLight,
    color: fontMediumTextColor,
    marginBottom: 40,
    fontSize: wp("5%"),
  },
  top_Header: {
    padding: 12,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    backgroundColor: themeColor,
    flexDirection: "row",
    alignItems: "center",
  },
  top_HeaderRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  top_HeaderText: {
    fontSize: wp("6%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: "#fff",
  },
  form_input: {
    color: fontMediumTextColor,
    borderBottomWidth: 1,
    borderColor: textInputBorderColor,
    marginTop: 20,
    marginBottom: 5,
  },
  verified_Code: {
    position: "absolute",
    right: 0,
    bottom: 13.5,
    fontSize: wp("5%"),
    color: "#16D800",
  },
  tab_nav_Image: {
    width: wp("20%"),
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: themeColor,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

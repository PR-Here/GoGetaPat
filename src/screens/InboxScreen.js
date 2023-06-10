/** @format */

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  AppState,
  Button,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  fontBold,
  fontMediumTextColor2,
  fontSemiBold,
  grayBorderColor,
  headerColor,
  themeColor,
} from "../common/common";

import { CustomLoginPopup } from "../subcomponents/CustomLoginPopup";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthState } from "../contexts/authContext";
import { useHomeDispatch, useHomeState } from "../contexts/HomeContext";
import { fetchAllChat } from "../services/api";

import database from "@react-native-firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setChatScreenFocused } from "../redux/actions/activeScreenAction";

const { width: windowWidth, height: windowHeight } = Dimensions.get("screen");

const MessageScreen = ({ navigation, dispatch, homeState }) => {
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(
    appState.current
  );
  let row = [];
  let prevOpenedRow;
  let authState = useAuthState();
  let homeDispatch = useHomeDispatch();
  var readChatMessageFromUserCheck = database().ref(`Chats`);

  // const fetchChat = async () => {
  //   fetchAllChat()
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((res) => {
  //       homeDispatch({ type: "CLEAR_CHAT_USER_INFO" });
  //       res?.chat.map((item, index, arr) => {
  //         if (authState?.loginedUser) {
  //           if (authState.loginedUser?.id == item.from_user) {
  //             homeDispatch({
  //               type: "SET_CHAT_USER_INFO",
  //               payload: {
  //                 id: item.id,
  //                 userId: item.to_user,
  //                 uuid: item.uuid,
  //                 userName: item.to_user_name,
  //                 photoUrl: item.to_user_image
  //                   ? `https://gogetapet.com/public/storage/${item?.to_user_image}`
  //                   : null,
  //                 message: item.message_text,
  //                 created: item.created,
  //                 messageObj: item,
  //               },
  //             });
  //             // setUserDetail(res.data)
  //           }
  //           if (authState.loginedUser?.id == item.to_user) {
  //             // homeDispatch({ type: "CLEAR_CHAT_USER_INFO" })
  //             homeDispatch({
  //               type: "SET_CHAT_USER_INFO",
  //               payload: {
  //                 id: item.id,
  //                 userId: item.from_user,
  //                 uuid: item.uuid,
  //                 userName: item.from_user_name,
  //                 photoUrl: item.from_user_image
  //                   ? `https://gogetapet.com/public/storage/${item?.from_user_image}`
  //                   : null,
  //                 message: item.message_text,
  //                 created: item.created,
  //                 messageObj: item,
  //               },
  //             });
  //           }
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    if (authState.loginedUser) {
      if (authState?.loginedUser?.id) {
        try {
          readChatMessageFromUserCheck.on(
            "child_changed",
            (snapshot, prevChildKey) => {
              const newMessage = snapshot.val();
              if (newMessage) {
                // fetchChat();
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    }

    return () => {
      try {
        if (authState.loginedUser) {
          if (authState?.loginedUser?.id) {
            readChatMessageFromUserCheck.off();
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  useEffect(() => {
    // fetchChat();
  }, [homeState.notificationUser]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // fetchChat();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // fetchChat();
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  // useEffect(() => {
  //     // console.log(homeState.notificationToggler, 'toggler ')
  //     fetchChat();
  // }, [homeState.notificationToggler])

  const handleSingleChat = (item) => {
    dispatch(
      setChatScreenFocused({
        isActive: true,
        userInfo: {
          ...item,
        },
      })
    );
    navigation.navigate("Message", { item });
  };

  const flatListOptimizationProps = {
    initialNumToRender: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    scrollEventThrottle: 16,
    // windowSize: 3,

    keyExtractor: (data, index) => index,
    getItemLayout: useCallback(
      (_, index) => ({
        index,
        length: windowWidth,
        offset: index * windowWidth,
      }),
      []
    ),
  };

  const renderInbox = useCallback(
    ({ item, index }, onClick) => {
      const closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
          prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
      };

      const renderRightActions = (progress, dragX, onClick) => {
        return (
          <View
            style={{
              margin: 0,
              alignContent: "center",
              justifyContent: "center",
              width: 70,
              borderRadius: 20,
            }}
          >
            <Button
              color={themeColor}
              onPress={onClick}
              title="DELETE"
            ></Button>
          </View>
        );
      };

      return (
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, onClick)
          }
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref) => (row[index] = ref)}
          rightOpenValue={-100}
        >
          <TouchableOpacity
            key={Math.random()}
            onPress={() => {
              handleSingleChat(item);
            }}
          >
            <View style={styles.chat_Inner_Wrapper}>
              <View>
                <Image
                  source={
                    item?.photoUrl
                      ? { uri: item?.photoUrl }
                      : require("../images/defaultProfile.png")
                  }
                  style={styles.chat_Img}
                />
              </View>

              <View style={{ flex: 1, padding: 12 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.chat_Name}>{item.userName}</Text>
                  <View>
                    {homeState.notificationUser &&
                      homeState.notificationUser.map((fromUser, index) => {
                        if (item.messageObj.from_user == fromUser) {
                          return (
                            <View
                              key={Math.random()}
                              style={{
                                position: "absolute",
                                backgroundColor: "red",
                                marginLeft: 10,
                                marginTop: 2,
                                height: 20,
                                paddingHorizontal: 5,
                                borderRadius: 50,
                                top: 0,
                              }}
                            >
                              <Text
                                style={{
                                  color: "#fff",
                                  fontFamily: fontBold,
                                }}
                              >
                                New
                              </Text>
                            </View>
                          );
                        } else {
                          return (
                            <React.Fragment
                              key={Math.random()}
                            ></React.Fragment>
                          );
                        }
                      })}
                  </View>
                </View>
                <Text
                  style={[
                    styles.chat_Message,
                    homeState.notificationUser.includes(
                      item.messageObj.from_user.toString()
                    )
                      ? {}
                      : { fontWeight: "normal" },
                  ]}
                  numberOfLines={1}
                >
                  {item.message}
                </Text>
                <Text style={styles.lastScene} numberOfLines={1}>
                  {item?.LastActive}
                </Text>
              </View>
              <Image source={item.AnimalImage} style={styles.chat_Img} />
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    },
    [homeState.chatUserInfo]
  );

  const deleteItem = ({ item, index }) => {
    Alert.alert("", "Are you sure you want to delete chat", [
      {
        text: "No",
        onPress: () => {},
      },
      { text: "Yes", onPress: () => {} },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={homeState.chatUserInfo}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(v) =>
          renderInbox(v, () => {
            // deleteItem(v);
          })
        }
        style={{ paddingHorizontal: wp("4%") }}
        ListEmptyComponent={() => (
          <Text
            style={[
              styles.chat_Message,
              {
                marginTop: hp("35"),
                textAlign: "center",
                fontSize: 23,
                marginLeft: wp(6),
              },
            ]}
          >
            No contacts found
          </Text>
        )}
      />
    </View>
  );
};

const InboxScreen = ({ navigation, route }) => {
  let authState = useAuthState();
  const [popup, setPopup] = useState(true);
  const dispatch = useDispatch();
  homeState = useHomeState();
  const { activeScreen } = useSelector((state) => state);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (
        authState?.userToken == null ||
        authState?.userToken == undefined ||
        authState?.userToken == ""
      ) {
        setPopup(true);
      } else {
        dispatch(
          setChatScreenFocused({
            isActive: false,
            userInfo: null,
          })
        );
        setPopup(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation, authState?.userToken]);
  return (
    <SafeAreaView style={styles.mainContainer}>
      {authState.userToken && homeState ? (
        <>
          <View style={styles.top_Header}>
            <View style={styles.top_HeaderRight}>
              <Text allowFontScaling={false} style={styles.top_HeaderText}>
                Inbox
              </Text>
            </View>
          </View>
          <MessageScreen
            navigation={navigation}
            dispatch={dispatch}
            homeState={homeState}
          />
        </>
      ) : popup ? (
        <CustomLoginPopup
          toggle={popup}
          setPopup={setPopup}
          name="Access Denied"
          btnName1="Cancel"
          btnName2="Login"
          alertText="Please login to access this funcationality."
          btn2Action={() => navigation.navigate("SignIn")}
        />
      ) : (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <Text style={styles.blankScreen}>
            You are not authorized to access this feature. {"\n"}Please login!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ButtonTxt: {
    fontSize: wp("3%"),
    fontWeight: "bold",
    fontFamily: fontBold,
    color: "#fff",
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  ButtonStyle: {
    backgroundColor: themeColor,
    borderRadius: 5,
    width: wp("27.5%"),
    height: hp("4%"),
    flexDirection: "row",
    elevation: 7,
    justifyContent: "center",
  },
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1,
    // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
  },

  top_Header: {
    paddingVertical: wp("3%"),

    justifyContent: "space-between",
    backgroundColor: headerColor,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: wp("3.5%"),
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
    color: themeColor,
  },

  heading_Main: {
    fontSize: wp("4.5%"),
    fontFamily: fontSemiBold,
    fontWeight: "bold",
  },
  chat_Inner_Wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: grayBorderColor,
    paddingVertical: hp("0.5%"),
    borderBottomWidth: 2,
    // backgroundColor: 'blue'
  },
  chat_Img: {
    height: hp("8%"),
    width: hp("8%"),
    resizeMode: "contain",
  },
  Img: {
    height: hp("3%"),
    width: hp("3%"),
    resizeMode: "cover",
    alignSelf: "center",
  },
  chat_Name: {
    color: themeColor,
    fontSize: wp("4.5%"),
    fontWeight: "bold",
  },
  bidPrice: {
    fontFamily: fontBold,
    color: themeColor,
    width: "50%",
    // paddingRight: wp("10%"),
    fontWeight: "bold",
    // backgroundColor: 'green'
  },
  chat_Message: {
    fontFamily: fontBold,
    color: "#000000",
    paddingRight: 40,
    fontWeight: "bold",
    flex: 1,
  },
  lastScene: {
    fontFamily: fontBold,
    color: fontMediumTextColor2,
    paddingRight: 40,
    paddingTop: 5,
  },
  blankScreen: {
    fontSize: wp("6%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});
export default InboxScreen;

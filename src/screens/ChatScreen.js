/** @format */

import React, {
  useState,
  useLayoutEffect,
  memo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import database from "@react-native-firebase/database";
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  TextInput,
  BackHandler,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';
// comment add
import moment from "moment";
import {
  fontBold,
  fontLight,
  themeColor,
  fontMediumTextColor,
  fontMediumTextColor2,
  headerColor,
} from "../common/common";
import { useHomeDispatch, useHomeState } from "../contexts/HomeContext";
import { useAuthDispatch, useAuthState } from "../contexts/authContext";
import { fetchUserDetail, sendPushNotificationUser } from "../services/api";
import { chartStyles } from "./ChatScreenStyles";
import customToastMsg from "../subcomponents/CustomToastMsg";
import ImagePicker from "react-native-image-crop-picker";
import ImgToBase64 from "react-native-image-base64";

const activeStar = require("../images/star-active.png");
const inActiveStar = require("../images/star-inactive.png");

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const MessageBox = ({ sendMessage }) => {
  const RichText = useRef();
  const [message, setMessage] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [fileType, setFile] = useState("");
  const [ImageUrl, setImageUrl] = useState("");

  const choosePhotoFromLibrary = () => {
    const imageList = [];
    ImagePicker.openPicker({
      mediaType: "any",
    })
      .then((image) => {
        var ext = image.path.substr(image.path.lastIndexOf(".") + 1);
        console.log("vedio image react section", image);
        if (image.size > 2000000) {
          customToastMsg("File size too large");
        } else if (ext !== "mp4") {
          customToastMsg("File type not support");
        } else {
          setFile([image]);
        }
        console.log("coverVideo", "is---" + JSON.stringify(fileType));
      })
      .catch((err) => {
        customToastMsg(err.message);
      });
  };
  const PicketSettings =
    Platform.OS == "ios"
      ? {
          width: 1700,
          height: 1700,
        }
      : {
          compressImageMaxHeight: 1700,
          compressImageMaxWidth: 1700,
        };

  const imagePickerCoverFunc = () => {
    ImagePicker.openPicker({
      ...PicketSettings,
      // width: 1700,
      // height: 1700,
      freeStyleCropEnabled: true,
      compressImageMaxHeight: 1700,
      compressImageMaxWidth: 1700,
      cropping: true,
      mediaType: "photo",
      compressImageQuality: 0.95,
      // includeBase64: true,
      // width: 2000,
      // height: 2000,
      smartAlbums: [
        "PhotoStream",
        "Generic",
        "Panoramas",
        "Videos",
        "Favorites",
        "Timelapses",
        "AllHidden",
        "RecentlyAdded",
        "Bursts",
        "SlomoVideos",
        "UserLibrary",
        "SelfPortraits",
        "Screenshots",
        "DepthEffect",
        "LivePhotos",
        "Animated",
        "LongExposure",
      ],
    })
      .then((image) => {
        // setCoverImage([...coverImage, image]);
        convertBase64(image);
      })
      .catch((err) => {
        customToastMsg(err.message);
        console.log("errrrrrr", err);
      });
  };

  const convertBase64 = (image) => {
    ImgToBase64.getBase64String(image.path)
      .then((base64String) => {
        const ImageUrl64 = `data:${image.mime};base64,${base64String}`;
        sendMessage(message, setMessage, setClickCount, ImageUrl64);
        // setClickCount(clickCount + 1);
        // console.log("base64String6565ImageUrl64", ImageUrl64);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <View style={chartStyles.send_message_location}>
      <View style={[chartStyles.sec_padding, { flexDirection: "row" }]}>
        <TextInput
          style={chartStyles.send_message_input}
          placeholderTextColor={fontMediumTextColor2}
          value={message}
          onChangeText={(value) => {
            setMessage(value);
          }}
          placeholder="Message..."
        />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: themeColor,
            borderRadius: 5,
            width: wp("10%"),
            height: hp("5%"),
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
            marginLeft: 12,
          }}
          onPress={() => {
            imagePickerCoverFunc();
          }}
        >
          <Image
            style={{
              height: wp("6%"),
              width: wp("5%"),
              resizeMode: "contain",
              alignSelf: "center",
            }}
            source={require("../images/camera.png")}
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",

            //   elevation: 2,
            marginRight: 12,
          }}
        ></View>
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            elevation: 2,
            marginRight: 10,
            width: wp(10),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (message.trim()) {
                sendMessage(message, setMessage, setClickCount);
                setClickCount(clickCount + 1);
              } else {
                setMessage("");
                customToastMsg("Blank Message can not be sent.");
              }
            }}
            disabled={clickCount == 0 ? false : true}
          >
            <Image
              source={require("../images/send.png")}
              style={{ height: hp("6%"), width: hp("6%") }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ChatScreen = ({ navigation, route }) => {
  let authDispatch = useAuthDispatch();
  let authState = useAuthState();
  let homeState = useHomeState();
  let homeDispatch = useHomeDispatch();
  const scrollViewRef = useRef();
  const [starRating, setStarRating] = useState(3);
  const [stars, setStars] = useState([
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
  ]);
  const [userChatMessages, setUserChatMessages] = useState([]);

  const [userChatMessagesLoading, setUserChatMessagesLoading] = useState(false);
  const [scrollToDown, setScrollToDown] = useState(false);
  const [userData, setUserData] = useState("");

  const [currentPagination, setCurrentPagination] = useState("");
  const [totalPagination, setTotalPagination] = useState("");
  const [pageno, setpageno] = useState(1);
  const [scrollDown, setscrollDown] = useState(true);

  const [checkExist, setCheckExist] = useState(false);
  var readChatMessageFromUser = database().ref(
    `Chats/user_${
      authState.loginedUser?.id || route.params.item?.messageObj?.to_user
    }/sender_${route.params.item.userId}`
  );

  var readChatMessageFromUserCheck = database().ref(`Chats}`);

  useEffect(() => {
    let notificationUser = homeState.notificationUser;
    if (route.params.item.hasOwnProperty("messageObj")) {
      if (
        notificationUser.includes(`${route.params.item.messageObj.from_user}`)
      ) {
        let notificationUserIndex = notificationUser.indexOf(
          `${route.params.item.messageObj.from_user}`
        );
        let updateNotificationUser = notificationUser.splice(
          notificationUserIndex,
          1
        );
        homeDispatch({
          type: "CLEAR_NOTIFICATION_USER",
          payload: notificationUser,
        });
      }
    }
    const backAction = () => {
      navigation.navigate("Inbox");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [homeState.notificationUser]);

  const sendMessage = (message, setMessage, setClickCount, ImageUrl) => {
    let type = "";
    if (message) {
      type = "Text";
    } else {
      type = "Image";
    }
    if (
      authState.loginedUser.id &&
      route.params.item &&
      (message || ImageUrl)
    ) {
      let messageObj = {
        createdTime: moment().format("YYYY-MM-DD hh:mm:ss"),
        // '2022-10-29 05:45:37',
        fromUserId: authState.loginedUser.id,
        toUserId: route?.params?.item?.userId,
        messageText: message ? `${message}` : ImageUrl,
        uuid: generateUUID(),
        messageType: type,
      };
      let sendChatMessage = database().ref(
        `Chats/user_${route.params.item.userId}/sender_${authState.loginedUser.id}/message`
      );
      sendChatMessage.once("value", (snapshot) => {
        if (!snapshot.exists()) {
          const email = snapshot.val();
          let writeMessageToDbRef = sendChatMessage
            .set(messageObj)
            .then((res) => {
              let userChatUpdate = userChatMessages;
              userChatUpdate.push(messageObj);

              setUserChatMessages([...userChatUpdate]);
              setUserChatMessagesLoading(false);
              send_message(messageObj);
            });
        } else {
          let writeMessageToDbRef = sendChatMessage
            .update(messageObj)
            .then((res) => {
              let userChatUpdate = userChatMessages;
              userChatUpdate.push(messageObj);

              setUserChatMessages([...userChatUpdate]);
              setUserChatMessagesLoading(false);
              send_message(messageObj);
            });
        }
        setMessage("");
        setClickCount(0);
        scrollViewRef.current.scrollToEnd({ animated: true });
      });
    }
  };

  useEffect(() => {
    if (authState.loginedUser) {
      if (
        authState?.loginedUser?.id &&
        userChatMessages &&
        route.params.item.userId
      ) {
        try {
          readChatMessageFromUser.on(
            "child_changed",
            (snapshot, prevChildKey) => {
              const newMessage = snapshot.val();
              if (newMessage) {
                setCheckExist(true);
              }

              if (userChatMessages) {
                let userChatUpdate = userChatMessages;
                userChatUpdate.push(newMessage);
                setUserChatMessages([...userChatUpdate]);
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    }

    return () => {
      if (authState.loginedUser) {
        if (authState?.loginedUser?.id && route.params.item.userId) {
          readChatMessageFromUser.off();
        }
      }
    };
  });

  const send_message = (messageObj) => {
    console.log("messageObj", "is---" + JSON.stringify(messageObj));
    try {
      fetch(`https://gogetapet.com/api/api/save_chat`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.userToken}`,
        },
        body: JSON.stringify(messageObj),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log("Send", "Message Responce is--", res);
        })
        .catch((err) => {
          console.log("Error in Send message" + err);
        });
    } catch (error) {
      console.log("Error in Send message" + error);
    }
  };

  let fetchChat = () => {
    setUserChatMessagesLoading(true);
    fetch(
      `https://gogetapet.com/api/api/get_message_user_db?second_user=${route.params.item.userId}&id=${route.params.item.id}&page=${pageno}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.userToken}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        let directUpdate = () => {
          setCurrentPagination(res.chat.to);
          setTotalPagination(res.chat.total);

          let userChatUpdate = res.chat.data;
          if (route.params.item.messageObj) {
            userChatUpdate.unshift(route.params.item.messageObj);
            setUserChatMessages([...userChatUpdate.reverse()]);
          }
          setscrollDown(true);
          setUserChatMessagesLoading(false);
        };

        let concatUpdate = () => {
          setCurrentPagination(res.chat.to);
          setTotalPagination(res.chat.total);
          setUserChatMessages(
            userChatMessages.reverse().concat(res.chat.data).reverse()
          );

          setscrollDown(false);
          setUserChatMessagesLoading(false);
        };

        if (
          userChatMessages.length > 0 &&
          res.chat.data.length > 0 &&
          pageno == 1
        ) {
          directUpdate();
        } else if (
          userChatMessages.length > 0 &&
          res.chat.data.length > 0 &&
          pageno == 1
        ) {
          directUpdate();
        } else if (
          userChatMessages.length > 0 &&
          res.chat.data.length > 0 &&
          pageno == 1
        ) {
          directUpdate();
        } else if (
          userChatMessages.length > 0 &&
          res.chat.data.length > 0 &&
          pageno > 1
        ) {
          if (
            res?.chat?.data[res?.chat?.data.length - 1]?.id !=
            userChatMessages[0].from_user
          ) {
            concatUpdate();
          }
        } else {
          directUpdate();
        }

        setUserChatMessagesLoading(false);
      })
      .catch((err) => {
        setUserChatMessagesLoading(false);

        console.log(err);
      });
  };

  useEffect(() => {
    setUserChatMessagesLoading(true);
    fetchUserDetail(route.params.item.userId).then((res) => {
      setUserData(res.data);
      setUserChatMessagesLoading(false);
    });
    database()
      .ref(
        `Chats/user_${route.params.item.userId}/sender_${authState.loginedUser.id}/message`
      )
      .once("value", (snapshot) => {
        database()
          .ref(
            `Chats/user_${authState.loginedUser.id}/sender_${route.params.item.userId}/message`
          )
          .once("value", (snaps) => {
            if (snapshot.exists() || snaps.exists()) {
              if (authState.loginedUser.id && route.params.item.userId) {
                fetchChat();
              }
            }
          });
      });
  }, [route.params.item.userId]);

  useEffect(() => {
    if (pageno > 1) {
      // console.log('here');
      setUserChatMessagesLoading(true);
      fetchChat();
    }
  }, [pageno]);

  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  const renderHeader = (userData) => {
    return (
      <>
        <View style={chartStyles.sec_padding}>
          <View style={chartStyles.chat_Inner_Wrapper}>
            <Image
              source={
                userData?.profile_image
                  ? {
                      uri: userData.profile_image,
                    }
                  : require("../images/defaultProfile.png")
              }
              style={chartStyles.chat_Img}
            />
            <View style={chartStyles.wrp}>
              <Text style={chartStyles.chat_Name}>{userData?.name}</Text>
              <Text style={chartStyles.chat_Message} numberOfLines={1}>
                {userData?.address ? userData?.address : null}
              </Text>

              <View style={{ flexDirection: "row" }}>
                {stars.map((currentValue, index) => {
                  if (index < userData?.user_rating) {
                    return (
                      <Image
                        key={index}
                        source={activeStar}
                        style={chartStyles.strRat}
                      />
                    );
                  }
                  return (
                    <Image
                      key={index}
                      source={inActiveStar}
                      style={chartStyles.strRat}
                    />
                  );
                })}
                <Text style={chartStyles.Rating}>
                  ({userData?.user_rating_count})
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={chartStyles.border_Bottom_1}></View>
      </>
    );
  };

  let renderChat = useCallback(
    ({ item, index }) => {
      const checkMessage =
        item?.message_text == undefined ? item.messageText : item?.message_text;
      const getMessage = checkMessage?.includes(";base64,");
      let UTCregx =
        /^([0-2][0-9]{3})\-(0[1-9]|1[0-2])\-([0-2][0-9]|3[0-1]) ([0-1][0-9]|2[0-3]):([0-5][0-9])\:([0-5][0-9])( ([\-\+]([0-1][0-9])\:00))?$/;
      let date = {};
      if (item.created && item.created.match(UTCregx)) {
        let covertDate = item.created
          .split("-")
          .join(" ")
          .split(" ")
          .join(":")
          .split(":");
        date = new Date(
          Date.UTC(
            covertDate[0],
            covertDate[1] - 1,
            covertDate[2],
            covertDate[3],
            covertDate[4],
            covertDate[5]
          )
        );
      } else {
        date = new Date(item.created || item.createdTime);
      }
      let hours =
        date.getHours().toLocaleString().length < 1
          ? `0${date.getHours().toLocaleString()}`
          : date.getHours().toLocaleString();
      let min = date.getMinutes().toLocaleString();
      let day = date.getDate().toLocaleString();
      let crDay = date.getDate().toString();
      let crMonth = (date.getMonth() + 1).toString();
      let crYear = date.getFullYear().toString();
      //let fullDate = date.toLocaleDateString().split("/").reverse()
      let fullDate = [crMonth, crDay, crYear];
      let currdate = new Date();
      let currday = currdate.getDate().toLocaleString();
      let userdate = "";

      if (
        userChatMessages &&
        userChatMessages?.length &&
        userChatMessages[index].created &&
        userChatMessages[index > 0 ? index - 1 : index]?.created
      ) {
        let userDatadate = userChatMessages[
          index > 0 ? index - 1 : index
        ]?.created
          .split("-")
          .join(" ")
          .split(" ")
          .join(":")
          .split(":");
        userdate = new Date(
          Date.UTC(
            userDatadate[0],
            userDatadate[1] - 1,
            userDatadate[2],
            userDatadate[3],
            userDatadate[4],
            userDatadate[5]
          )
        );
      } else if (
        userChatMessages &&
        userChatMessages?.length &&
        userChatMessages[index].createdTime &&
        userChatMessages[index > 0 ? index - 1 : index]?.createdTime
      ) {
        userdate = new Date(
          userChatMessages[index > 0 ? index - 1 : index].createdTime
        );
      }

      var difMint = Math.floor(Math.abs(new Date(date) - userdate) / 1000 / 60);
      return (
        <>
          <View
            style={[
              chartStyles.single_Chat_Wrapper,
              authState.loginedUser.id == item.from_user ||
              authState.loginedUser.id == item.fromUserId
                ? chartStyles.single_Chat_Wrapper_Sender
                : null,
            ]}
          >
            {index > 0 ? (
              (item.fromUserId || item.from_user) ==
                (userChatMessages[index - 1].fromUserId ||
                  userChatMessages[index - 1].from_user) &&
              difMint < 2 ? null : (
                <Text style={chartStyles.chat_Time}>
                  {currday === day
                    ? tConvert(
                        `${hours.length == 1 ? "0" + hours : hours}:${
                          min.length == 1 ? "0" + min : min
                        }`
                      )
                    : `${
                        fullDate[0].length == 1
                          ? "0" + fullDate[0]
                          : fullDate[0]
                      }-${
                        fullDate[1].length == 1
                          ? "0" + fullDate[1]
                          : fullDate[1]
                      }-${fullDate[2]} ${tConvert(
                        `${hours}:${min.length == 1 ? "0" + min : min}`
                      )}`}
                </Text>
              )
            ) : null}
            {index == 0 ? (
              <Text style={chartStyles.chat_Time}>
                {currday === day
                  ? tConvert(
                      `${hours.length == 1 ? "0" + hours : hours}:${
                        min.length == 1 ? "0" + min : min
                      }`
                    )
                  : `${
                      fullDate[0].length == 1 ? "0" + fullDate[0] : fullDate[0]
                    }-${
                      fullDate[1].length == 1 ? "0" + fullDate[1] : fullDate[1]
                    }-${fullDate[2]} ${tConvert(
                      `${hours}:${min.length == 1 ? "0" + min : min}`
                    )}`}
              </Text>
            ) : null}
            <View style={chartStyles.chat_Content}>
              {getMessage == false && (
                <Text
                  style={[
                    chartStyles.single_Chat_Message,
                    authState.loginedUser.id == item.from_user ||
                    authState.loginedUser.id == item.fromUserId
                      ? chartStyles.single_Chat_Sender
                      : null,
                  ]}
                >
                  {item?.message_text ? item?.message_text : item?.messageText}
                </Text>
              )}
              {getMessage == true && (
                <Image
                  style={{
                    height: 250,
                    width: "100%",
                  }}
                  source={{
                    uri: item?.message_text
                      ? item?.message_text
                      : item?.messageText,
                  }}
                />
              )}
              {authState.loginedUser.id == item.from_user ||
              authState.loginedUser.id == item.fromUserId ? (
                <Image
                  style={chartStyles.chat_Seen_Reciept}
                  source={require("../images/d-tick.png")}
                />
              ) : null}
            </View>
          </View>
        </>
      );
    },
    [userChatMessages]
  );

  let onContentOffsetChanged = (distanceFromTop) => {
    if (distanceFromTop === 0 && currentPagination != totalPagination) {
      setpageno(pageno + 1);
    }
  };

  return (
    <SafeAreaView style={chartStyles.mainContainer}>
      {/* {console.log(route.params.item, 'aldsfk')} */}
      <View style={chartStyles.top_Header}>
        <TouchableOpacity
          style={chartStyles.go_Back_Icon}
          onPress={() => {
            navigation.navigate("Inbox");
          }}
        >
          <Image
            source={require("../images/back-button.png")}
            style={chartStyles.go_Back_Icon_Img}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={chartStyles.top_HeaderRight}>
          <Text allowFontScaling={true} style={chartStyles.top_HeaderText}>
            {route.name}
          </Text>
        </View>
      </View>
      {userChatMessagesLoading && (
        <View
          style={{
            position: "absolute",
            height: hp(100),
            width: wp(100),
            zIndex: 1,
            backgroundColor: "#ffffff91",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            // style={{ t}}
            size="large"
          />
        </View>
      )}
      {renderHeader(userData)}

      <KeyboardAvoidingView
        style={chartStyles.content_view}
        behavior={Platform.OS === "ios" ? "padding" : ""}
        keyboardShouldPersistTaps="always"
      >
        <FlatList
          data={userChatMessages}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollDown && scrollViewRef.current.scrollToEnd({ animated: true })
          }
          style={{ marginHorizontal: wp("5%") }}
          keyExtractor={(item, index) => index.toString()}
          onScroll={(event) =>
            onContentOffsetChanged(event.nativeEvent.contentOffset.y)
          }
          onEndReached={() => {
            setscrollDown(true);
          }}
          renderItem={renderChat}
        />

        <MessageBox sendMessage={sendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

// import {
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     FlatList,
//     TextInput,
//     ActivityIndicator,
//     Dimensions,
//     ScrollView,
//   } from 'react-native';
//   import React, {useState, useCallback, useEffect} from 'react';
//   import AllUsers from './allUsers';
//   import {GiftedChat} from 'react-native-gifted-chat';
//   import {useDispatch, useSelector} from 'react-redux';
//   import {firebase} from '@react-native-firebase/database';
//   import MsgComponent from '../components/Chat/MsgComponent';
//   import {COLORS} from '../components/constants/colors';
//   import {Center, Icon} from 'native-base';
//   import moment from 'moment';
//   import ChatHeader from '../components/Header/ChatHeader';
//   import SimpleToast from 'react-native-simple-toast';
//   import {lstmsg} from '../redux/reducer/user';
//   import {Moment} from 'moment';
//   import ImagePicker from 'react-native-image-crop-picker';

//   const Chat = (props, {navigation}) => {
//     const dispatch = useDispatch();
//     const {userData} = useSelector(state => state.User);
//     const {receiverData} = props.route.params;
//     const {lstms} = receiverData.lastMsg;
//     const [loading, setLoading] = useState(true);
//     const [image, setImage] = useState([]);
//     const [msg, setMsg] = React.useState('');
//     const [time,setTime]=useState()
//     const [disabled, setdisabled] = React.useState(false);
//     const [allChat, setallChat] = React.useState([]);
//     const windowWidth = Dimensions.get('window').width;
//   const windowHeight = Dimensions.get('window').height;

//     // console.log('Day of message==>',moment(receiverData.sendTime).format('dddd'))

//     const choosePhotoFromLibrary = () => {
//       const imageList = [];
//       ImagePicker.openPicker({
//         multiple: true,
//         waitAnimationEnd: false,
//         includeExif: true,
//         forceJpg: true,
//         width: 300,
//         height: 300,
//         cropping: true,
//         compressImageQuality: 0.7,
//         maxFiles: 10,
//         mediaType: 'any',
//         includeBase64: true,
//       }).then(response => {
//         console.log('Response', response);
//         // setImage(image.path);
//         response.map(Images => {
//           // console.log(Images.path)

//           imageList.push({
//             path: Images.path,
//           });
//         });
//         setImage(imageList);
//       });
//     };

//     useEffect(() => {
//       const onChildAdd = firebase
//         .database()
//         .ref('/messages/' + receiverData.roomId)
//         .on('child_added', snapshot => {
//           setallChat(state => [snapshot.val(), ...state]);
//           setTime(snapshot.val().sendTime)
//         });
//       return () =>
//         firebase
//           .database()
//           .ref('/messages' + receiverData.roomId)
//           .off('child_added', onChildAdd);
//     }, []);

//     const msgvalid = txt => txt && txt.replace(/\s/g, '').length;

//     const sendMsg = () => {
//       if (msg == '' || msgvalid(msg) == 0) {
//         SimpleToast.show('Enter something....');
//         return false;
//       }
//       setdisabled(true);
//       let msgData = {
//         roomId: receiverData.roomId,
//         message: msg,
//         from: userData?.id,
//         to: receiverData.id,
//         sendTime: moment().format(''),
//         msgType: 'text',
//         senderName: userData.Name,
//         Images: [...image],
//       };

//       const newReference = firebase
//         .database()
//         .ref('/messages/' + receiverData.roomId)
//         .push();
//       msgData.id = newReference.key;
//       newReference.set(msgData).then(() => {
//         let chatListupdate = {
//           lastMsg: msg,
//           sendTime: msgData.sendTime,
//         };
//         firebase
//           .database()
//           .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
//           .update(chatListupdate);

//         console.log("'/chatlist/' + userData?.id + '/' + data?.id", receiverData);
//         firebase
//           .database()
//           .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
//           .update(chatListupdate);

//         setMsg('');
//         setImage([]);
//         setdisabled(false);
//       });
//     };
//     useEffect(() => {
//       setTimeout(() => {
//         setLoading(!loading);
//       }, 500);
//     }, []);

//     return (
//       <View style={styles.container}>
//         {loading ? (
//           <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
//             <ActivityIndicator size={'large'} color="#2994FF" />
//           </View>
//         ) : (
//       <View style={styles.container}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//             marginTop: 30,
//             alignItems: 'center',
//           }}>
//           <TouchableOpacity
//             style={{marginLeft: -20}}
//             onPress={() => props.navigation.goBack()}>
//             <Image source={require('../../Assets/leftarrow.png')} />
//           </TouchableOpacity>
//           <View style={{flexDirection: 'column', marginTop: -25}}>
//             <Image
//               style={{
//                 height: 50,
//                 width: 50,
//                 backgroundColor: '#000',
//                 borderRadius: 50,
//                 marginLeft: 10,
//               }}
//               source={{
//                 uri: 'https://media.gettyimages.com/photos/tesla-ceo-elon-musk-speaks-during-the-unveiling-of-the-new-tesla-y-picture-id1130598318?s=2048x2048',
//               }}
//             />
//             <Text style={{fontWeight: '800', fontSize: 20, marginTop: 3}}>
//               {receiverData.Name}
//             </Text>
//           </View>

//           <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
//             <Image source={require('../../Assets/Vector.png')} />
//           </TouchableOpacity>
//         </View>
//         <Image
//           style={{marginTop: 5, marginLeft: 20}}
//           source={require('../../Assets/Line.png')}
//         />
//         <View style={{flex: 1}}>
//           <View style={{justifyContent: 'center', alignItems: 'center'}}>
//             <Text>{moment(receiverData.sendTime).format('dddd')}</Text>
//           </View>
//           <FlatList
//             style={{flex: 1}}
//             data={allChat}
//             showsVerticalScrollIndicator={false}
//             keyExtractor={(item, index) => index}
//             inverted
//             renderItem={({item}) => {
//               return (
//                 <>
//                   <MsgComponent sender={item.from == userData.id} item={item} />
//                 </>
//               );
//             }}
//           />
//         </View>

//         <View
//               style={{
//                 flexDirection: 'row',
//               }}>
//               <View style={styles.TinputView}>
//                 <ScrollView horizontal={true}>
//                   <View style={{flexDirection: 'row', padding: 20}}>
//                     {image.map(item => {
//                       // console.log('lkdnfgne----',item.path)
//                       return (
//                         <Image
//                           style={{
//                             height: 200,
//                             width: 200,
//                             backgroundColor: 'red',
//                             borderColor: 'dodgerblue',
//                             marginVertical: 15,
//                           }}
//                           source={{uri: item.path}}
//                         />
//                       );
//                     })}
//                   </View>
//                 </ScrollView>

//  <TextInput
//                   style={styles.Tinput}
//                   placeholder="type a message"
//                   placeholderTextColor={COLORS.black}
//                   multiline={true}
//                   value={msg}
//                   onChangeText={val => setMsg(val)}
//                 />
//               </View>
//               <View
//                 style={{
//                   backgroundColor: '#2994FF',
//                   marginTop: 8,
//                   height: 40,
//                   width: 40,
//                   left: 300,
//                   position: 'absolute',
//                   borderRadius: 5,
//                   marginLeft:29
//                 }}>
//                 <TouchableOpacity
//                   disabled={disabled}
//                   onPress={choosePhotoFromLibrary}>
//                   <Image
//                     source={require('../../Assets/camera.png')}
//                     style={{
//                       position: 'absolute',
//                       left: '8.33%',
//                       right: '8.33%',
//                       top: '8.33%',
//                       bottom: '8.33%',
//                       marginTop: 12,
//                       marginLeft: 7,

//                     }}
//                   />
//                 </TouchableOpacity>
//               </View>
//               <View
//                 style={{
//                   backgroundColor: '#2994FF',
//                   marginTop: 55,
//                   height: 40,
//                   width: 40,
//                   left: 300,
//                   position: 'absolute',
//                   borderRadius: 5,
//                   marginLeft:29
//                 }}>
//                 <TouchableOpacity disabled={disabled} onPress={sendMsg}>
//                   <Image
//                     source={require('../../Assets/msg.png')}
//                     style={{
//                       position: 'absolute',
//                       left: '8.33%',
//                       right: '8.33%',
//                       top: '8.33%',
//                       bottom: '8.33%',
//                       marginTop: 12,
//                       marginLeft: 7,
//                     }}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//       </View>
//        )}
//       </View>
//     );
//   };

//   export default Chat;

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     Tinput: {
//       backgroundColor: '#f3f2f3',
//       overflow: 'hidden',
//       alignItems: 'center',
//       flexDirection: 'row',
//       height: 40,
//       width: '77%',
//       borderColor: '#707070',
//       marginHorizontal: 10,
//       marginVertical: 5,
//     },
//     TinputView: {
//       backgroundColor: '#f3f2f3',
//       overflow: 'hidden',
//       // backgroundColor:'blue',
//       // alignItems: 'center',
//       flexDirection: 'column',
//       // height: 90,
//       width: '77%',
//       borderRadius: 6,
//       borderColor: '#707070',
//       marginHorizontal: 10,
//       marginVertical: 2,
//       borderWidth: 1,
//     },
//   });

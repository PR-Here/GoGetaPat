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
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';

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
import {
  fetchUserDetail,
  sendPushNotificationUser,
  async,
} from "../services/api";
import { chartStyles } from "./ChatScreenStyles";
import customToastMsg from "../subcomponents/CustomToastMsg";

import {
  GiftedChat,
  Send,
  Actions,
  ActionsProps,
  Bubble,
} from "react-native-gifted-chat";

import ImagePicker from "react-native-image-crop-picker";
import firestore, {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "@react-native-firebase/firestore";
// import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';

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
  const [message, setMessage] = useState("");
  const [clickCount, setClickCount] = useState(0);
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

        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            marginLeft: 5,
            elevation: 2,
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

const ChatScreen = ({ user, navigation, route }) => {
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
  const [messages, setMessages] = useState([]);

  const [imageData, setImageData] = useState([]);
  const { uid } = route.params;
  var readChatMessageFromUser = database().ref(
    `Messages/user_${authState.loginedUser.id}/sender_${route.params.item.userId}`
  );

  var readChatMessageFromUserCheck = database().ref(`Messages}`);

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

  const sendMessage = (message, setMessage, setClickCount) => {
    if (authState.loginedUser.id && route.params.item && message) {
      let messageObj = {
        createdTime: new Date().toISOString(),
        fromUserId: authState.loginedUser.id,
        toUserId: route?.params?.item?.userId,
        messageText: `${messages.text}`,
        uuid: generateUUID(),
      };

      let sendChatMessage = database().ref(
        `Messages/user_${route.params.item.userId}/sender_${authState.loginedUser.id}/message`
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
            });
        } else {
          let writeMessageToDbRef = sendChatMessage
            .update(messageObj)
            .then((res) => {
              let userChatUpdate = userChatMessages;
              userChatUpdate.push(messageObj);

              setUserChatMessages([...userChatUpdate]);
              setUserChatMessagesLoading(false);
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
        route.params.item.id
      ) {
        try {
          readChatMessageFromUser.on(
            "child_changed",
            (snapshot, prevChildKey) => {
              const newMessage = snapshot.val();
              if (newMessage) {
                setCheckExist(true);
              }

              // if (userChatMessages) {
              //     let userChatUpdate = userChatMessages;
              //     userChatUpdate.push(newMessage);
              //     setUserChatMessages([...userChatUpdate]);
              // }
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    }

    return () => {
      if (authState.loginedUser) {
        if (authState?.loginedUser?.id && route.params.item.id) {
          readChatMessageFromUser.off();
        }
      }
    };
  });

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
        // console.log("good++++++++",res.chat.data);

        let directUpdate = () => {
          setCurrentPagination(res.chat.to);
          setTotalPagination(res.chat.total);

          let userChatUpdate = res.chat.data;
          if (route.params.item.messageObj) {
            // userChatUpdate.push(route.params.item.messageObj);
            let data = userChatUpdate.map((item) => {
              // {
              //     "created": "2021-12-23 12:32:10",
              //     "from_user": 327,
              //     "id": 2122,
              //     "message_text": "Jwjsjsjjw",
              //     "to_user": 323,
              //     "uuid": "1c284647-f250-4515-944e-95bf8e189186"
              //   },
              // console.log(item)
              return {
                _id: item.id,
                text: item.message_text,
                createdAt: item.created,
                user: {
                  _id: item.from_user,
                  name: "React Native",
                  avatar: userData?.profile_image,
                },
              };
            });
            setUserChatMessages([...data]);
          }
          setscrollDown(true);
          setUserChatMessagesLoading(false);
        };

        let concatUpdate = () => {
          setCurrentPagination(res.chat.to);
          setTotalPagination(res.chat.total);
          let data = res.chat.data.map((item) => {
            // {
            //     "created": "2021-12-23 12:32:10",
            //     "from_user": 327,
            //     "id": 2122,
            //     "message_text": "Jwjsjsjjw",
            //     "to_user": 323,
            //     "uuid": "1c284647-f250-4515-944e-95bf8e189186"
            //   },
            // console.log(item)
            return {
              _id: item.id,
              text: item.message_text,
              createdAt: item.created,
              user: {
                _id: item.from_user,
                name: "React Native",
                avatar: userData?.profile_image,
              },
            };
          });
          setUserChatMessages(userChatMessages.concat(data));

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
    console.log(route.params.item, "userid");
    setUserChatMessagesLoading(true);
    fetchUserDetail(route.params.item.id).then((res) => {
      // console.log(res, 'asldfk')
      setUserData(res.data);
      setUserChatMessagesLoading(false);
    });
    // getAllMessages();
    // database().ref(`Messages/user_${route.params.item.userId}/sender_${authState.loginedUser.id}/message`).once("value", snapshot => {
    //     database().ref(`Messages/user_${authState.loginedUser.id}/sender_${route.params.item.userId}/message`).once("value", snaps => {
    //         if (snapshot.exists() || snaps.exists()) {
    //             if (authState.loginedUser.id && route.params.item.userId) {
    //                 fetchChat()
    //                 // getAllMessages()
    //             }
    //         }
    //     });
    // })
  }, [route.params.item.id]);

  useEffect(() => {
    if (pageno > 1) {
      // console.log('here');
      // setUserChatMessagesLoading(true);
      // fetchChat()
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
    // console.log(userData);
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

  // useEffect(() => {
  //     console.log(userChatMessages, 'dlsfk')
  //     setMessages([
  //         // {
  //         //     _id: 1,
  //         //     text: 'Hello developer',
  //         //     createdAt: new Date(),
  //         //     user: {
  //         //         _id: 2,
  //         //         name: 'React Native',
  //         //         avatar: 'https://placeimg.com/140/140/any',
  //         //     },
  //         // },

  //         ...userChatMessages
  //     ])
  // }, []);

  const handlePickImage = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: "photo",
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
        // var data = new FormData();
        // data.append('profile_picture', {
        //     uri: image.path,
        //     name: image.path.split("/").pop(),
        //     type: image.mime
        // });

        setImageData({
          uri: image.path,
          name: image.path.split("/").pop(),
          type: image.mime,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAllMessages = async () => {
    const docid =
      route.params.item.userId > authState?.loginedUser?.id
        ? authState?.loginedUser?.id + "-" + route.params.item.userId
        : route.params.item.userId + "-" + authState?.loginedUser?.id;
    console.log(
      "heelo",
      userData?.id,
      "hhhhhhhhhhhhhhhhh",
      route.params.item.userId
    );
    console.log("heelo", docid);
    const querySanp = await firestore()
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();
    const allmsg = querySanp.docs.map((docSanp) => {
      return {
        ...docSanp.data(),
        createdAt: docSanp.data().createdAt.toDate(),
      };
    });
    setMessages(allmsg);
  };

  useEffect(() => {
    if (imageData && imageData.name && imageData.uri) {
      let messages = {
        _id: generateUUID(),
        createdAt: new Date(),
        user: {
          _id: authState?.loginedUser?.id,
          name: authState?.loginedUser?.name,
          avatar: authState?.loginedUser?.profile_image,
        },
        image: imageData.uri,
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      const docid =
        route.params.item.id > authState?.loginedUser?.id
          ? authState?.loginedUser?.id + "-" + route.params.item.id
          : route.params.item.id + "-" + authState?.loginedUser?.id;

      firestore()
        .collection("Chats")
        .doc(docid)
        .collection("messages")
        .add({
          ...messages,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      updateSenderHistory();
      updateOwnHistory();
      setImageData({});
    }
  }, [imageData]);

  useEffect(() => {
    // getAllMessages()

    const docid =
      route.params.item.id > authState?.loginedUser?.id
        ? authState?.loginedUser?.id + "-" + route.params.item.id
        : route.params.item.id + "-" + authState?.loginedUser?.id;
    const messageRef = firestore()
      .collection("Chats")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc");

    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map((docSanp) => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  function renderActions(props) {
    return (
      <Actions
        {...props}
        options={{
          ["Select Image"]: handlePickImage,
        }}
        icon={() => (
          <Image
            source={require("../images/camera.png")}
            style={{ height: hp("2.5"), width: hp("3.5") }}
            resizeMode={"contain"}
          />
        )}
        // onSend={args => console.log(args)}
        // onPressActionButton={args => console.log(args)}
        onSend={(mssg) => {
          console.length(mssg, "jiasdjf");
          const msg = messageArray[0];
          //     const mymsg = {
          //         ...msg,
          //         sentBy:authState?.loginedUser?.id,
          //         sentTo:userData?.id,
          //         createdAt:new Date()
          //     }
          //    setMessages(previousMessages => GiftedChat.append(previousMessages,mymsg))
          //    const docid  = userData?.id > authState?.loginedUser?.id ? authState?.loginedUser?.id+ "-" + userData?.id : userData?.id+"-"+authState?.loginedUser?.id

          //    firestore().collection('Chats')
          //    .doc(docid)
          //    .collection('messages')
          //    .add({...mymsg,createdAt:firestore.FieldValue.serverTimestamp()})
        }}
      />
    );
  }

  const updateSenderHistory = () => {
    firestore()
      .collection("Chat_History")
      .doc(route.params.item?.id.toString())
      .set(
        {
          userName: userData?.name,
          profile_image: userData?.profile_image,
          id: userData?.id,
          nameConfirmed: userData?.name_confirmed,
          rated: userData?.rated,
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: false }
      );

    firestore()
      .collection("Chat_History")
      .doc(route.params.item?.id.toString())
      .collection("sender")
      .doc(authState?.loginedUser?.id.toString())
      .set(
        {
          userName: authState?.loginedUser?.name,
          profile_image: authState?.loginedUser?.profile_image,
          id: authState?.loginedUser?.id,
          nameConfirmed: authState?.loginedUser?.name_confirmed,
          rated: authState?.loginedUser?.rated,
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: false }
      );
  };

  const updateOwnHistory = () => {
    firestore()
      .collection("Chat_History")
      .doc(authState?.loginedUser?.id.toString())
      .set(
        {
          userName: authState?.loginedUser?.name,
          profile_image: authState?.loginedUser?.profile_image,
          id: authState?.loginedUser?.id,
          nameConfirmed: authState?.loginedUser?.name_confirmed,
          rated: authState?.loginedUser?.rated,
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: false }
      );

    firestore()
      .collection("Chat_History")
      .doc(authState?.loginedUser?.id.toString())
      .collection("sender")
      .doc(route.params.item?.id.toString())
      .set(
        {
          userName: userData?.name,
          profile_image: userData?.profile_image,
          id: userData?.id,
          nameConfirmed: userData?.name_confirmed,
          rated: userData?.rated,
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: false }
      );
  };

  const onSend = (messageArray) => {
    console.log(messageArray, " laksdfjlk f");
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: authState?.loginedUser?.id,
      sentTo: userData?.id,
      createdAt: new Date(),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, mymsg)
    );
    const docid =
      userData?.id > authState?.loginedUser?.id
        ? authState?.loginedUser?.id + "-" + userData?.id
        : userData?.id + "-" + authState?.loginedUser?.id;

    firestore()
      .collection("Chats")
      .doc(docid)
      .collection("messages")
      .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() });

    updateSenderHistory();
    updateOwnHistory();
  };
  // const onSend = useCallback(async (messages = []) => {
  //     try {

  //         // console.log(messages)
  //         // console.log(userData)
  //         setUserChatMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  //         const docid = "user_" + userData?.id
  //         console.log(docid, authState?.loginedUser?.id, 'docid')
  //         let x = firestore().collection('Chats').doc(docid)

  //         let setDoc = await x.set({
  //             userName: userData?.name,
  //             profile_image: userData?.profile_image,
  //             id: userData?.id,
  //             nameConfirmed: userData?.name_confirmed,
  //             rated: userData?.rated
  //         }, { merge: false });
  //         console.log(setDoc)

  //         let setMsg = await x.collection('sender').doc(`sender_${authState?.loginedUser?.id}`)
  //             .collection('messages')
  //             .add({ ...messages, createdAt: firestore.FieldValue.serverTimestamp() })

  //         const snapshot = await firestore().collection('Chats').get()
  //         snapshot.docs.map(doc => console.log(doc.data(), "hello i am"));

  //         // let getData = await firestore().collection('Chats')

  //         // console.log(getData,"========",setMsg, 'onsend')
  //     }
  //     catch (e) {
  //         console.log(e, "error")
  //     }
  // }, [userData]);

  return (
    <SafeAreaView style={chartStyles.mainContainer}>
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
          <Text style={chartStyles.top_HeaderText}>{route.name}</Text>
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

      {/* <KeyboardAvoidingView style={chartStyles.content_view}
                behavior={Platform.OS === "ios" ? "padding" : ""}
                keyboardShouldPersistTaps="always"
            > */}
      {/* <FlatList
                    data={userChatMessages}
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollDown && scrollViewRef.current.scrollToEnd({ animated: true })}
                    style={{ marginHorizontal: wp("5%") }}
                    keyExtractor={(item, index) => index.toString()}
                    onScroll={(event) =>
                        onContentOffsetChanged(event.nativeEvent.contentOffset.y)
                    }

                    onEndReached={() => {
                        setscrollDown(true)
                    }}

                    renderItem={renderChat}
                /> */}

      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: authState?.loginedUser?.id,
          name: authState?.loginedUser?.name,
          avatar: authState?.loginedUser?.profile_image,
        }}
        loadEarlier={true}
        onLoadEarlier={() => {
          if (currentPagination != totalPagination) {
            setpageno(pageno + 1);
          }
        }}
        infiniteScroll={true}
        // showAvatarForEveryMessage={false}
        // showUserAvatar={true}
        renderAvatar={null}
        alwaysShowSend={true}
        renderSend={(props) => {
          return (
            <Send
              {...props}
              containerStyle={{
                height: 60,
                width: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{}}>
                <Image
                  source={require("../images/send.png")}
                  style={{ height: hp("5%"), width: hp("5%") }}
                  resizeMode={"contain"}
                />
              </View>
            </Send>
          );
        }}
        messagesContainerStyle={{ paddingBottom: 15 }}
        renderActions={renderActions}
      />

      {/* <MessageBox sendMessage={sendMessage} /> */}
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default ChatScreen;

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { postCommentApi, showAllCommentApi } from "../services/api";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  fontBold,
  themeColor,
  headerColor,
  fontRegular,
} from "../common/common";
import { useAuthState } from "../contexts/authContext";
import moment from "moment";

let auth = null;
let BaseURL = "https://gogetapet.com/api/api/";

export default function PetComment({ navigation, route }) {
  const { postId } = route?.params;
  let authState = useAuthState();
  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const handleCommentChange = (text) => {
    setComment(text);
  };

  //   Get Comment Api
  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(`${BaseURL}viewComments`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState?.userToken}`,
        },
        body: JSON.stringify({
          post_id: postId,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (res?.success) {
            setComment("");
            setData(res?.data);
            Keyboard.dismiss();
            scrollToTop();
          }
        });
    } catch (error) {
      setLoading(false);
      customToastMsg(error?.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [postId]);

  //   Post Comment Api
  async function postComment(comment) {
    setLoading(true);
    try {
      const response = await fetch(`${BaseURL}insertComments`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState?.userToken}`,
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: authState?.loginedUser?.id,
          comment_text: comment,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (res?.success) {
            fetchData();
          } else customToastMsg(res?.message);
        });
    } catch (error) {
      setLoading(false);
      customToastMsg(err?.message);
    }
  }

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", scrollToBottom);
    return () => {
      Keyboard.removeListener("keyboardDidShow", scrollToBottom);
    };
  }, []);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd();
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  // console.log(postId, authState?.loginedUser?.id);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.top_Header}>
          <TouchableOpacity
            style={styles.go_Back_Icon}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../images/back-button.png")}
              style={styles.go_Back_Icon_Img}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.commentText}>Comments</Text>
        </View>
        {/* List */}
        {data == "" ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: fontRegular,
                fontSize: 18,
              }}
            >
              No Comment.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            bounces={true}
            showsVerticalScrollIndicator={false}
            data={data}
            ListFooterComponent={<View style={{ marginBottom: 80 }}></View>}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.commentView}>
                  <Image
                    style={styles.profileImage}
                    source={{
                      uri: item?.profile_image,
                    }}
                  />
                  <View style={styles.nameView}>
                    <Text style={styles.userName}>{item?.name}</Text>
                    <Text style={styles.commentTextDesc}>
                      {item?.comment_text}
                    </Text>
                    <Text style={styles.timeText}>
                      {moment(item?.created_at).format("D MMM hh:mm A")}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
        {/* TextInput */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.commentTextInput}
            placeholder="Add a comment..."
            value={comment}
            onChangeText={handleCommentChange}
          />
          <TouchableOpacity
            onPress={() => {
              if (comment == "") {
                customToastMsg("Please write a comment first!");
                return;
              }
              postComment(comment);
            }}
          >
            <Image
              source={require("../images/send.png")}
              style={{ height: hp("5%"), width: hp("5%") }}
              resizeMode={"contain"}
            />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size={"large"} style={styles.loading} />
        ) : null}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top_Header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.8%"),
    backgroundColor: headerColor,
    marginBottom: 8,
  },
  go_Back_Icon: {
    width: wp("9%"),
    height: hp("5%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("1%"),
    paddingVertical: hp("1%"),
    borderRadius: 5,
  },
  go_Back_Icon_Img: {
    height: hp("8%"),
    width: wp("14%"),
    marginTop: hp("0.5%"),
  },
  commentText: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    width: "80%",
  },
  commentTextInput: {
    backgroundColor: "white",
    width: "70%",
    height: 45,
    alignSelf: "center",
    paddingHorizontal: 10,
    fontWeight: "500",
    color: "black",
    borderRadius: 10,
    backgroundColor: headerColor,
  },
  loading: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#00000099",
    width: "100%",
    height: "100%",
  },
  inputView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    padding: 10,
  },
  commentView: {
    flexDirection: "row",
    width: "100%",
    margin: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: headerColor,
    padding: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 100 / 2,
    marginLeft: 10,
  },
  nameView: {
    marginLeft: 20,
    flex: 1,
  },
  commentTextDesc: {
    color: "grey",
    marginTop: 5,
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
  userName: {
    fontWeight: "bold",
    color: "black",
    fontFamily: "Poppins-SemiBold",
  },
  timeText: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 10,
    color: "grey",
    fontFamily: "Poppins-Regular",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 16, // Adjust the bottom margin as needed
  },
});

/** @format */

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Text,
  Alert,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  useHomeDispatch,
  useHomeState,
  useAuthState,
} from "../contexts/HomeContext";
import {
  UnsavePost,
  fetchPostList,
  fetchTestFilterPost,
  savePost,
  likedislikepost,
} from "../services/api";
import {
  TapGestureHandler,
  GestureHandlerRootView,
  SubTapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { View } from "react-native-animatable";
import DoubleClick from "react-native-double-tap";
import customToastMsg from "./CustomToastMsg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomLoginPopup } from "../subcomponents/CustomLoginPopup";

const { width } = Dimensions.get("window");

const AnimatedImage = Animated.createAnimatedComponent(Image);

function PetList({
  petImages,
  navigation,
  getDataAcc,
  searchTerm,
  selectedValueCat,
  longitude,
  latitude,
  selectedValueLoc,
  homeAfterSearch,
  setLatitude,
  setLongitude,
  authState,
  fullPostData,
  setFullPostData,
}) {
  const doubleTapRef = useRef(null);
  const lastTap = useRef(0);
  let dispatchHome = useHomeDispatch();
  let stateHome = useHomeState();
  const [liked, setLiked] = useState(false);
  const [likeValue, setLikeValue] = useState(0);
  const [lastDoubleTap, setLastDoubleTap] = useState(null);
  const [heart, setHeart] = useState();
  const [postList, setPostList] = useState(fullPostData);
  const [loginValue, setLoginValue] = useState(null);

  const scale = useSharedValue(0);
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(scale.value, 0) }],
  }));

  useEffect(() => {
    AsyncStorage.getItem("loginValue").then((loginValueCheck) => {
      const response = JSON.parse(loginValueCheck);
      setLoginValue(response);
      console.log("---loginValueCheck---", response);
    });
    setPostList(fullPostData);
    // console.log("---fullPostData.length---", fullPostData[2]);
  });

  const doubleTab = (id) => {
    fetchPostList(setFullPostData, dispatchHome);
    setLiked(!liked);
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scale.value = withDelay(500, withSpring(0));
      }
    });
  };

  const likedislike = async (postId, userId, no, index, likePost) => {
    // export async function likedislikepost(id, postId) {
    let auth = null;
    let data = "";
    data = {
      user_id: authState.loginedUser.id,
      post_id: postId,
    };

    return await fetch("https://gogetapet.com/api/api/LikedislikePost", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response?.message === "Post Like successfully !") {
          const some_array = [...postList];
          some_array[index].like_count = no + 1;
          some_array[index].like_post = 1;
          setPostList(some_array);
        } else if (response?.message === "Post Dislike successfully !") {
          const some_array = [...postList];
          some_array[index].like_count = no - 1;
          some_array[index].like_post = 0;
          setPostList(some_array);
        }
      })
      .catch((err) => {
        customToastMsg(err.message);
      });
  };

  const loginAlertPopup = () => {
    Alert.alert(
      "Access Denied",
      "Please login to access this functionality.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Login",
          onPress: () => navigation.navigate("SignIn"),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <FlatList
      data={postList}
      onEndReachedThreshold={0.9}
      onEndReached={() => {
        // if (hasScrolled) {
        fetchTestFilterPost(
          dispatchHome,
          stateHome,
          searchTerm,
          getDataAcc?.id,
          selectedValueCat,
          (homeAfterSearch && homeAfterSearch.isSearch) ||
            (homeAfterSearch && homeAfterSearch.fromLoc)
            ? longitude
            : "",
          (homeAfterSearch && homeAfterSearch.isSearch) ||
            (homeAfterSearch && homeAfterSearch.fromLoc)
            ? latitude
            : "",
          (homeAfterSearch && homeAfterSearch.isSearch) ||
            (homeAfterSearch && homeAfterSearch.fromLoc)
            ? selectedValueLoc
            : "",
          true
        );
      }}
      renderItem={({ item, index }) => {
        return (
          <View>
            <Animated.View>
              <DoubleClick
                singleTap={() => {
                  navigation.navigate({
                    name: "Post",
                    params: { id: item.id, setLatitude, setLongitude },
                  });
                }}
                doubleTap={() => {
                  console.log("double tap");
                  if (item.like_post === 0 && loginValue === true) {
                    likedislike(
                      item.id,
                      item.user.id,
                      item.like_count,
                      index,
                      item.like_post
                    );
                  }
                }}
                delay={200}
              >
                {console.log(
                  "item?.cover_image[0]?.image_url.... ",
                  item?.cover_image[0]?.image_url
                )}

                <ImageBackground
                  source={
                    petImages &&
                    petImages?.post.length 
                      ? {
                          uri: item?.cover_image[0]?.image_url,
                        }
                      : require("../images/no-image.png")
                  }
                  style={[styles.pets_Image, { position: "relative" }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      // top: width / 4,
                      justifyContent: "flex-start",
                      alignItems: "flex-end",
                      bottom: 3,
                      position: "absolute",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        width: "50%",

                        // backgroundColor:'green'
                      }}
                    >
                      {/* Heart Icon Like and DisLike Image Here */}
                      {item.like_post === 0 ? (
                        <TouchableOpacity
                          style={{ overflow: "hidden", zIndex: 999 }}
                          disabled={!loginValue}
                          onPress={() => {
                            if (loginValue === true) {
                              likedislike(
                                item.id,
                                item.user.id,
                                item.like_count,
                                index,
                                item.like_post
                              );
                            } else {
                              // loginAlertPopup();
                            }
                          }}
                        >
                          <Image
                            source={require("../images/heartnewblank.png")}
                            resizeMode="contain"
                            style={[
                              {
                                width: 30,
                                height: 30,
                                tintColor: "white",
                                marginLeft: 5,
                                marginBottom: 2,
                              },
                            ]}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            overflow: "hidden",
                            zIndex: 999,
                            // position: "absolute",
                          }}
                          disabled={!loginValue}
                          onPress={() => {
                            if (loginValue === true) {
                              likedislike(
                                item.id,
                                item.user.id,
                                item.like_count,
                                index,
                                item.like_post
                              );
                            } else {
                              // loginAlertPopup();
                            }
                          }}
                        >
                          <Image
                            source={require("../images/heartnewfill.png")}
                            resizeMode="contain"
                            style={{
                              width: 30,
                              height: 30,
                              tintColor: "red",
                              marginLeft: 5,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      {/* Like Count Text */}
                      <Text
                        style={[
                          styles.countText,
                          { marginLeft: item.like_post === 1 ? 5 : 5 },
                        ]}
                      >
                        {item.like_count}
                      </Text>
                    </View>
                    {/* Comment Image Click Here and Comment Text */}
                    <View style={styles.CommentView}>
                      {/* Comment Image */}
                      <TouchableOpacity
                        disabled={!loginValue}
                        onPress={() => {
                          if (loginValue === true) {
                            navigation.navigate("PetCommentScreen", {
                              postId: item?.id,
                            });
                          } else {
                            // loginAlertPopup();
                          }
                        }}
                        style={styles.commentButton}
                      >
                        <Image
                          resizeMode="contain"
                          style={styles.chatImage}
                          source={require("../images/chat.png")}
                        />
                      </TouchableOpacity>
                      <Text style={styles.countText}>
                        {item?.comment_count}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </DoubleClick>
            </Animated.View>
          </View>
        );
      }}
      keyExtractor={(item, index) => {
        return index;
      }}
      numColumns={3}
      horizontal={false}
    />
  );
}

export default PetList;

const styles = StyleSheet.create({
  noListStyle: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },
  pets_Image_Wrapper:
    Platform.OS == "android"
      ? {
          flexDirection: "row",

          flexWrap: "wrap",
        }
      : {
          width: "100%",
        },
  pets_Image:
    Platform.OS == "android"
      ? {
          // height: hp("20%"),
          // width: wp("32%"),
          height: width / 3,
          width: width / 3.2,
          marginHorizontal: wp("1%"),
          marginVertical: hp("0.5%"),
          overflow: "hidden",
        }
      : {
          height: width / 3,
          width: width / 3.2,
          marginHorizontal: wp("1%"),
          marginVertical: hp("0.5%"),
          overflow: "hidden",
        },
  btn:
    Platform.OS == "ios"
      ? {
          flex: 1 / 3,
          paddingHorizontal: wp(1),
          paddingVertical: hp(0.5),
        }
      : {},
  CommentView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "50%",
    alignItems: "flex-start",

    // backgroundColor:'red'
  },
  chatImage: {
    tintColor: "white",
    width: 35,
    height: 35,
    alignSelf: "center",
    marginLeft: 5,
  },
  countText: {
    fontSize: 14,
    fontWeight: "300",
    color: "white",
    // marginTop: item.like_post === 1 ? 12 : 10,
    textAlign: "left",
    alignSelf: "center",
    width: 30,
  },
  commentButton: {},
});

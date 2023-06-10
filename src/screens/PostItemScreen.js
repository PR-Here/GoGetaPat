import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import Video from "react-native-video";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  TapGestureHandler,
  TouchableOpacity,
} from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";

import {
  fontRegular,
  fontMediumTextColor2,
  themeColor,
} from "../common/common";
import { styles } from "../screens/PostItemScreenStyles";
import { validateTitle } from "../common/helper";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { useAuthState } from "../contexts/authContext";

const PostItemScreen = ({
  navigation,
  route,
  coverImage,
  setCoverImage,
  otherImage,
  setOtherImage,
  coverVideo,
  setCoverVideo,
  title,
  setTitle,
}) => {
  // const [value, setValue] = useState()
  // console.log("coverVideo","is--"+JSON.stringify(coverVideo))
  // const [coverImage, setCoverImage] = useState([]);
  // const [otherImage, setOtherImage] = useState([]);
  const [lastTap, setLastTap] = useState(0);

  const authState = useAuthState();

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
        setCoverImage([...coverImage, image]);
        // console.log(image, "1")
      })
      .catch((err) => {
        customToastMsg(err.message);
      });
  };

  const imageSinglePickerOtherFunc = () => {
    ImagePicker.openPicker({
      ...PicketSettings,
      // width: 300,
      // height: 400,
      freeStyleCropEnabled: true,
      compressImageMaxHeight: 1700,
      compressImageMaxWidth: 1700,
      // width: 2000,
      // height: 2000,
      cropping: true,
      mediaType: "photo",
      compressImageQuality: 0.95,
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
        setOtherImage([image]);
        // console.log(image, "2")
      })
      .catch((err) => {
        customToastMsg(err.message);
      });
  };

  const imagePickerOtherFunc = () => {
    ImagePicker.openPicker({
      ...PicketSettings,
      mediaType: "photo",
      multiple: true,
      // width: 2000,
      // height: 2000,
      compressImageMaxHeight: 1700,
      compressImageMaxWidth: 1700,
      freeStyleCropEnabled: true,
      cropping: true,
      compressImageQuality: 0.95,
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
        let updatedImage = [...otherImage];
        let maxImage = 11;

        let otherImageLen = otherImage.length;
        let imageLenToPush = maxImage - otherImageLen;
        if (image.length > imageLenToPush) {
          setTimeout(() => {
            customToastMsg(`You can only select ${imageLenToPush} images`);
          }, 3000);
        } else {
          if (otherImageLen >= 0 && otherImageLen < 12) {
            for (let i = 1; i <= imageLenToPush; i++) {
              if (image[i - 1] !== undefined) {
                updatedImage.push(image[i - 1]);
              }
            }
            setOtherImage([...updatedImage]);
          }
        }
        // console.log(image, "3")
      })
      .catch((err) => {
        customToastMsg(err.message);
      });
  };

  //Pick Video
  const videoPickerCoverFunc = () => {
    ImagePicker.openPicker({
      ...PicketSettings,
      mediaType: "video",
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
        const min = Math.floor((image?.duration / 1000 / 60) << 0);
        var ext = image.path.substr(image.path.lastIndexOf(".") + 1);
        if (image.size > 2147483648) {
          customToastMsg("File size too large");
        } else if (ext !== "mp4") {
          customToastMsg("File type not support");
        } else if (min > 1) {
          customToastMsg("only less then 1 minute video be added");
        } else {
          setCoverVideo([image]);
        }

        console.log("coverVideo", "is---" + JSON.stringify(coverVideo));
      })
      .catch((err) => {
        customToastMsg(err.message);
      });
  };

  const openCamera = (imageState, setImageState) => {
    ImagePicker.openCamera({
      ...PicketSettings,
      // width: wp(100),
      // height: hp(100),
      // width: 1700,
      // height: 1700,
      cropping: true,
      freeStyleCropEnabled: true,
      compressImageMaxHeight: 1500,
      compressImageMaxWidth: 1500,
      compressImageQuality: 0.95,
    })
      .then((image) => {
        setImageState([...imageState, image]);
        // console.log(image, "4")
      })
      .catch((err) => {
        customToastMsg(err.message);
      });
  };

  const deleteItem = (index, imageState, setImageState) => {
    let newImageState = [...imageState];
    newImageState.splice(index, 1);
    setImageState(newImageState);
  };
  const deleteVideo = (index, imageState, setImageState) => {
    let newImageState = [...imageState];
    newImageState.splice(index, 1);
    setImageState(newImageState);
  };

  const initialCameraOption = () => (
    <>
      <View style={{ paddingTop: hp("10%") }}>
        <TouchableOpacity
          style={styles.ButtonStyle}
          onPress={() => {
            openCamera(coverImage, setCoverImage);
          }}
        >
          <Image
            style={styles.Buttonicon}
            source={require("../images/camera.png")}
          />
          <Text style={styles.ButtonTxt}>Take Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingTop: hp("3%") }}>
        <TouchableOpacity
          style={styles.ButtonStyle}
          onPress={() => {
            imagePickerCoverFunc();
          }}
        >
          <Image
            style={styles.Buttonicon}
            source={require("../images/image.png")}
          />
          <Text style={styles.ButtonTxt}>Select Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingTop: hp("3%") }}>
        <Text style={styles.InstTxt}>Add your cover photo first</Text>
      </View>
    </>
  );

  const coverImageFunc = () => (
    <>
      <View>
        <View
          style={{
            paddingTop: hp("10%"),
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {coverImage ? (
            <View
              style={{
                position: "relative",
                width: 100,
                height: 100,
                marginBottom: hp("8%"),
                marginHorizontal: wp("5%"),
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <Image
                source={{ uri: coverImage[0].path || coverImage[0].image_url }}
                resizeMode="cover"
                style={{ width: wp("30%"), height: hp("19%"), borderRadius: 4 }}
              />
              <View
                style={{
                  position: "absolute",
                  top: -hp("2%"),
                  right: -wp("3%"),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    deleteItem(0, coverImage, setCoverImage);
                  }}
                  style={{
                    width: wp("8%"),
                    height: hp("4.5%"),
                    overflow: "hidden",
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      width: wp("10%"),
                      height: hp("8%"),
                      marginLeft: 0,
                      marginTop: -9,
                    }}
                    source={require("../images/trash.png")}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  position: "absolute",
                  bottom: -hp("2.5%"),
                  backgroundColor: "#00000081",
                  color: "#fff",
                  borderRadius: 3,
                  paddingHorizontal: 12,
                  paddingVertical: 3,
                  fontFamily: fontRegular,
                  fontSize: wp("3.2%"),
                }}
              >
                Cover Photo
              </Text>
            </View>
          ) : null}
          {otherImage.length
            ? otherImage.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      marginBottom: hp("8%"),
                      marginHorizontal: wp("5%"),
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Image
                      source={{ uri: item.path || item.image_url }}
                      resizeMode="cover"
                      style={{
                        width: wp("30%"),
                        height: hp("19%"),
                        borderRadius: 4,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: -hp("2%"),
                        right: -wp("2.7%"),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          deleteItem(index, otherImage, setOtherImage);
                        }}
                        style={{
                          width: wp("8%"),
                          height: hp("4.5%"),
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          style={{
                            width: wp("10%"),
                            height: hp("8%"),
                            marginLeft: 0,
                            marginTop: -9,
                          }}
                          source={require("../images/trash.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            : null}
          {authState?.loginedUser ? (
            authState.loginedUser?.boosted ? (
              otherImage.length < 11 ? (
                <View
                  style={{
                    position: "relative",
                    width: wp("30%"),
                    height: hp("19%"),
                    marginBottom: hp("6%"),
                    marginHorizontal: wp("5%"),
                  }}
                >
                  <TouchableOpacity
                    style={{
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: fontMediumTextColor2,
                      alignItems: "center",
                      width: wp("30%"),
                      height: hp("19%"),
                      justifyContent: "space-evenly",
                    }}
                    onPress={() => {
                      imagePickerOtherFunc();
                    }}
                  >
                    <Image
                      style={{ width: wp("18%"), height: hp("8%") }}
                      source={require("../images/Plus.png")}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: wp("6%"),
                          height: hp("3%"),
                          resizeMode: "contain",
                        }}
                        source={require("../images/images.png")}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.ButtonTxt, { fontSize: wp("3.7%") }]}
                      >
                        Add Photo
                      </Text>
                    </View>
                    <Text style={{ fontSize: wp("3.1%"), color: "#000" }}>
                      Using {`${coverImage.length + otherImage.length}/12`}{" "}
                      images
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null
            ) : otherImage.length < 1 ? (
              <View
                style={{
                  position: "relative",
                  width: wp("30%"),
                  height: hp("19%"),
                  marginBottom: hp("6%"),
                  marginHorizontal: wp("5%"),
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: fontMediumTextColor2,
                    alignItems: "center",
                    width: wp("30%"),
                    height: hp("19%"),
                    justifyContent: "space-evenly",
                  }}
                  onPress={() => {
                    imageSinglePickerOtherFunc();
                  }}
                >
                  <Image
                    style={{ width: wp("18%"), height: hp("8%") }}
                    source={require("../images/Plus.png")}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: wp("6%"),
                        height: hp("3%"),
                        resizeMode: "contain",
                      }}
                      source={require("../images/images.png")}
                    />
                    <Text
                      allowFontScaling={false}
                      style={[styles.ButtonTxt, { fontSize: wp("3.7%") }]}
                    >
                      Add Photo
                    </Text>
                  </View>

                  {/* <Text style={{ fontSize: wp("3.1%"), color: "#000" }}>Using {`${coverImage.length + otherImage.length}/12`} images</Text> */}
                </TouchableOpacity>
              </View>
            ) : null
          ) : null}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {coverVideo?.length ? (
            <View
              style={{
                position: "relative",
                width: 100,
                height: 100,
                marginBottom: hp("8%"),
                marginHorizontal: wp("5%"),
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <Video
                source={{
                  uri: coverVideo[0]?.path || coverVideo[0]?.sourceURL,
                }}
                style={{ width: wp("30%"), height: hp("19%"), borderRadius: 4 }}
                controls={false}
                paused={false}
                muted={true}
                resizeMode="cover"
              />
              {/* <Image
                source={{
                  uri: coverVideo[0]?.path,
                }}
                resizeMode="cover"
                style={{ width: wp("30%"), height: hp("19%"), borderRadius: 4 }}
              /> */}
              <View
                style={{
                  position: "absolute",
                  top: -hp("2%"),
                  right: -wp("3%"),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    deleteVideo(0, coverVideo, setCoverVideo);
                  }}
                  style={{
                    width: wp("8%"),
                    height: hp("4.5%"),
                    overflow: "hidden",
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      width: wp("10%"),
                      height: hp("8%"),
                      marginLeft: 0,
                      marginTop: -9,
                    }}
                    source={require("../images/trash.png")}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  position: "absolute",
                  bottom: -hp("2.5%"),
                  backgroundColor: "#00000081",
                  color: "#fff",
                  borderRadius: 3,
                  paddingHorizontal: 12,
                  paddingVertical: 3,
                  fontFamily: fontRegular,
                  fontSize: wp("3.2%"),
                }}
              >
                Cover Video
              </Text>
            </View>
          ) : (
            <View
              style={{
                position: "relative",
                width: 100,
                height: 100,
                marginBottom: hp("8%"),
                marginHorizontal: wp("5%"),
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: fontMediumTextColor2,
                  alignItems: "center",
                  width: wp("30%"),
                  height: hp("19%"),
                  justifyContent: "space-evenly",
                }}
                onPress={() => {
                  videoPickerCoverFunc();
                }}
              >
                <Image
                  style={{ width: wp("18%"), height: hp("8%") }}
                  source={require("../images/Plus.png")}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: wp("6%"),
                      height: hp("3%"),
                      resizeMode: "contain",
                    }}
                    source={require("../images/images.png")}
                  />
                  <Text
                    allowFontScaling={false}
                    style={[styles.ButtonTxt, { fontSize: wp("3.7%") }]}
                  >
                    Add Video
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <KeyboardAwareScrollView style={styles.content_view}>
        {coverImage.length ? coverImageFunc() : initialCameraOption()}
        {authState?.loginedUser ? (
          !authState.loginedUser?.boosted && otherImage.length == 1 ? (
            <View style={{ paddingTop: hp(3), paddingHorizontal: wp(5) }}>
              <Text style={[styles.top_HeaderText1, { color: "#000" }]}>
                You are using free version !{" "}
                <Text
                  onPress={() => {
                    navigation.navigate("Boost");
                  }}
                  style={styles.top_HeaderText1}
                >
                  Subscribe now{" "}
                </Text>
                to add more then two images.
              </Text>
            </View>
          ) : null
        ) : null}

        <View style={styles.rightAlign}>
          <View style={{ paddingTop: hp("2%") }}>
            <Text style={styles.Title}>Title</Text>
            <TextInput
              selectionColor="black"
              style={styles.input}
              value={title}
              onChangeText={(value) => {
                if (validateTitle(value)) {
                  if (value.trim().length > 0) {
                    setTitle(value);
                  } else {
                    setTitle(value.trim()); // stop whitespace to set
                  }
                }
              }}
              placeholder="Enter Title"
              placeholderTextColor={fontMediumTextColor2}
              maxLength={40}
            />
            <Text style={styles.belowTitle}>
              For Example: Weight, Sex, Color, Age
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default PostItemScreen;

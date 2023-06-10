/** @format */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  BackHandler,
  Dimensions,
  Alert,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import customToastMsg from "../subcomponents/CustomToastMsg";
import { btnTextColor, fontBold, themeColor } from "../common/common";

import StatusNavigationBar from "../subcomponents/StatusNavigationBar";
import { CustomLoginPopup } from "../subcomponents/CustomLoginPopup";
import PostItemScreen from "./PostItemScreen";
import DetailScreen from "./DetailScreen";
import Price from "./Price";
import Finish from "./Finish";
import { fetchBreed, fetchUserDetail } from "../services/api";

import { useHomeDispatch, useHomeState } from "../contexts/HomeContext";
import { useAuthState, useAuthDispatch } from "../contexts/authContext";
import { priceValidate, validateTitle } from "../common/helper";
import { detailStyles } from "./DetailScreenStyles";
import { Loader } from "../subcomponents/Loader";

import CustomToastMsg from "../subcomponents/CustomToastMsg";
import { useDispatch, useSelector } from "react-redux";
import { setEnableBoostAd } from "../redux/actions/postScreenAction";

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const { height } = Dimensions.get("screen");

const Post = ({ navigation, route }) => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const [popup, setPopup] = useState(true);
  const [allData, setAllData] = useState({});
  const homeState = useHomeState();
  const authState = useAuthState();
  const dispatchHome = useHomeDispatch();

  const [latitude, setLatitude] = useState(
    route.params?.itemData ? route.params?.itemData.latitude : ""
  );
  const [longitude, setLongitude] = useState(
    route.params?.itemData ? route.params?.itemData.longitude : ""
  );

  // postItemScreen states
  const [coverImage, setCoverImage] = useState(
    route.params?.itemData ? route.params?.itemData.cover_image : []
  );
  const [coverVideo, setCoverVideo] = useState(
    route.params?.itemData ? route.params?.itemData.coverVideo : []
  );
  const [otherImage, setOtherImage] = useState(
    route.params?.itemData ? route.params?.itemData.non_cover_image : []
  );
  const [title, setTitle] = useState(
    route.params?.itemData ? route.params?.itemData.title : ""
  );

  // DetailScreen states
  const [categories, setCategories] = useState([
    {
      heading: "Category",
      subHeading: "(Required)",
      title: "Category",
      data: homeState?.catg,
    },
  ]);
  const [weight, setWeight] = useState(
    route.params?.itemData ? route.params?.itemData.weight : ""
  );
  const [catg, setCatg] = useState(
    route.params?.itemData
      ? homeState?.catg.filter((item) => {
          return item.name == route.params?.itemData.category;
        })[0]
      : {}
  );

  const [bred, setBred] = useState(
    route.params?.itemData
      ? {
          id: route.params?.itemData.breed_id,
          name: route.params?.itemData.breed,
        }
      : ""
  );
  const [sx, setSx] = useState(
    route.params?.itemData
      ? {
          name: route.params?.itemData.sex,
          id: route.params?.itemData?.sex == "Male" ? 1 : 2,
        }
      : ""
  );
  // const [age, setAge] = useState(route.params?.itemData && route.params?.itemData?.ageMonth ? route.params?.itemData?.ageMonth?.toString() : "");
  const [month, setMonth] = useState(
    route.params?.itemData && route.params?.itemData?.ageMonth
      ? route.params?.itemData?.ageMonth?.toString()
      : null
  );
  const [year, setYear] = useState(
    route.params?.itemData && route.params?.itemData?.ageYear
      ? route.params?.itemData?.ageYear?.toString()
      : null
  );
  const [week, setWeek] = useState(
    route.params?.itemData && route.params?.itemData?.ageWeek
      ? route.params?.itemData?.ageWeek?.toString()
      : null
  );
  const [sex, setSex] = useState([
    {
      heading: "Sex",
      title: "Sex",
      data: [
        { name: "Male", id: "1" },
        { name: "Female", id: "2" },
        { name: null, id: "0" },
      ],
    },
  ]);
  const [breed, setBreed] = useState([
    { heading: "Breed", title: "Breed", data: [{ name: "blank", id: "0" }] },
  ]);
  const [describe, setDescribe] = useState(
    route.params?.itemData ? route.params?.itemData.description : ""
  );
  const [reset, setReset] = useState(false);

  // priceScreen states
  const [priceOfPet, setPriceOfPet] = useState(
    route.params?.itemData ? route.params?.itemData.price : ""
  );
  // shippingPrice states
  const [shippingPrice, setShippingPrice] = useState(
    route.params?.itemData ? route.params?.itemData.shippingprice : ""
  );

  // FinishScreen states
  const [pin, setPin] = useState(
    route.params?.itemData ? route.params?.itemData.pin : ""
  );
  const [state, setState] = useState(
    route.params?.itemData ? route.params?.itemData.state : ""
  );
  const [city, setCity] = useState(
    route.params?.itemData ? route.params?.itemData.city : ""
  );
  const [check, setCheck] = useState(false);

  const [value, setValue] = useState(1);
  const [descrField, setdescrField] = useState(false);
  const [navigatetoHome, setNavigatetoHome] = useState(true);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const authDispatch = useAuthDispatch();
  const { enableBoostAd } = useSelector((state) => state.postScreen);

  const [clearBread, setClearBread] = useState(route.params?.true || false);

  useEffect(() => {
    if (!clearBread) {
      setClearBread(false);
      setBred("");
    } else {
      setClearBread(false);
    }
    setBreed("");
    dispatchHome({ type: "Loading", payload: true });
    fetchBreed(catg.id, setBreed, "", dispatchHome);
  }, [catg]);

  //Handle Submit btn
  // Finish Post Api Call Here
  const storePicture = async () => {
    // Create the form data object
    // const data = new FormData()
    // console.log(describe, "here is describe")
    if (pin == "") {
      customToastMsg("Please Enter Pin");
    } else {
      dispatchHome({ type: "Loading", payload: true });
      try {
        var data = new FormData();
        otherImage.forEach((element, i) => {
          const newFile = {
            uri: element.path,
            name: element.path.split("/").pop(),
            type: element.mime,
          };
          data.append(`image[${i}]`, newFile);
        });

        if (coverImage[0].path !== undefined) {
          data.append("cover_image", {
            uri: coverImage[0].path,
            name: coverImage[0].path.split("/").pop(),
            type: coverImage[0].mime,
          });
        } else {
          data.append("cover_image", {
            uri: coverImage[0].image_url,
            name: coverImage[0].image_url.split("/").pop(),
            type: coverImage[0].mime || "image/jpeg",
          });
        }

        if (coverVideo && coverVideo.length) {
          // console.log("Videois not empaty")
          data.append("video", {
            uri: coverVideo[0].path,
            name: coverVideo[0].path.split("/").pop(),
            type: coverVideo[0].mime || "video/mp4",
          });
        }

        let rest_data = {
          title: title,
          price: priceOfPet,
          shippingprice: shippingPrice,
          latitude: latitude || "0.0",
          longitude: longitude || "0.0",
          description: describe || "",
          sex: sx.name || "",
          category: catg.id,
          city: city,
          state: state,
          pin: pin,
        };
        for (const key in rest_data) {
          if (rest_data[key] != null) {
            data.append(key, rest_data[key].toString());
          } else {
            data.append(key, rest_data[key]);
          }
        }

        //if breed avail in category and in month, year or week
        if (bred.id) data.append("breed", bred.id.toString());
        if (month) data.append("month", month.toString());
        if (year) data.append("year", year.toString());
        if (week) data.append("week", week.toString());
        if (weight) data.append("weight", weight.toString());

        // Create the config object for the POST
        // You typically have an OAuth2 token that you use for authentication
        const config = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data;",
            Authorization: `Bearer ${authState.userToken}`,
          },
          body: data,
        };
        //console.log("config", "content is---"+JSON.stringify(config))
        //dispatchHome({ type: "Loading", payload: false })
        console.log(config.body, "content");
        await fetch("https://gogetapet.com/api/api/posts", config)
          .then((response) => response.json())
          .then((responseData) => {
            // console.log("upload picture","responce is"+ JSON.stringify(responseData));
            dispatchHome({ type: "Loading", payload: false });
            console.log("responseData.data  ... ",responseData)
            if (responseData.data != undefined) {
              if (Object.keys(responseData && responseData.data)) {
                dispatch(
                  setEnableBoostAd({
                    isActive: true,
                    data: null,
                  })
                );
                fetchUserDetail(authState.loginedUser?.id).then((res) => {
                  authDispatch({ type: "SIGN_IN_USER", loginedUser: res.data });
                });
                navigation.navigate("Posted", { data: responseData.data });
              } else {
                customToastMsg("Some error occured while creating post");
              }
            } else {
              customToastMsg("Some error occured while creating post");
            }
          })
          .catch((err) => {
            console.log("....Error ..... ",err.message.toString());
            dispatchHome({ type: "Loading", payload: false });
            customToastMsg(err.message.toString());
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  //handle Update btn
  const updatePicture = () => {
    var data = new FormData();
    otherImage.forEach((element, i) => {
      const newFile = {
        uri: element.image_url,
        name: element.image_url.split("/").pop(),
        type: element.mime || "image/jpeg",
      };
      data.append(`images[${i}]`, newFile);
    });

    if (coverImage[0].path !== undefined) {
      data.append("cover_image", {
        uri: coverImage[0].path,
        name: coverImage[0].path.split("/").pop(),
        type: coverImage[0].mime,
      });
    } else {
      data.append("cover_image", {
        uri: coverImage[0].image_url,
        name: coverImage[0].image_url.split("/").pop(),
        type: coverImage[0].mime || "image/jpeg",
      });
    }
    if (coverVideo && coverVideo.length) {
      data.append("video", {
        uri: coverVideo[0].path,
        name: coverVideo[0].path.split("/").pop(),
        type: coverVideo[0].mime || "video/mp4",
      });
    }

    let rest_data = {
      title: title,
      price: priceOfPet,
      shippingprice: shippingPrice,
      latitude: latitude || "0.0",
      longitude: longitude || "0.0",
      description: describe || "",
      sex: sx.name || null,
      category: catg.id,
      city: city,
      state: state,
      pin: pin,
    };
    //console.log(rest_data)
    for (const key in rest_data) {
      if (rest_data[key] != null) {
        data.append(key, rest_data[key].toString());
      } else {
        data.append(key, rest_data[key]);
      }
    }

    //if breed avail in category and age in month, year or week
    if (bred.id) data.append("breed", bred.id.toString());
    if (month) data.append("month", month.toString());
    if (year) data.append("year", year.toString());
    if (week) data.append("week", week.toString());
    if (weight) data.append("weight", weight.toString());

    const config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data;",
        Authorization: `Bearer ${authState.userToken}`,
      },
      body: data,
    };

    fetch(
      `https://gogetapet.com/api/api/posts/${route.params?.itemData.id}?_method=put`,
      config
    )
      .then((response) => response.json())
      .then((responseData) => {
        dispatchHome({ type: "Loading", payload: false });
        navigation.navigate("Posted", { data: responseData.data });
        // console.log(responseData)
      })
      .catch((err) => {
        console.log(err);
        customToastMsg(err.message.toString());
      });
  };

  //console.log(authState)
  const showLoader = () => {
    if (homeState.isLoading) {
      return <Loader />;
    }
    return null;
  };

  //Handle Device Back btn
  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to Cancel?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => navigation.navigate("Home") },
    ]);
    return true;
  };

  useEffect(() => {
    if (authState.hasOwnProperty("loginedUser")) {
      if (authState.loginedUser) {
        if (authState.loginedUser.hasOwnProperty("blocked")) {
          if (!authState.loginedUser.blocked) {
            // navigation.navigate("Post Item")
            customToastMsg(
              "You are restricted to add posts, please contact admin.\nIf your are unblocked then close the app and open it again."
            );
            navigation.navigate("TabNavigator", { screen: "Home" });
          }
        } else {
          // navigation.navigate("Post Item")
        }
      } else {
        // navigation.navigate("Post Item")
      }
    } else {
      // navigation.navigate("Post Item")
    }

    BackHandler.addEventListener("hardwareBackPress", backAction);
    let keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      keyboardDidShow
    );
    let keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide
    );

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const keyboardDidShow = (event) => {
    setKeyboardOffset(event.endCoordinates.height);
  };

  const keyboardDidHide = () => {
    setKeyboardOffset(0);
  };

  const backButton = () => {
    setValue(value - 1);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (
        authState?.userToken &&
        !authState?.userToken == null &&
        !authState?.userToken == undefined &&
        !authState?.userToken == ""
      ) {
        setPopup(false);
        if (route.params?.true == true) {
          // console.log(route.params?.itemData)
          setValue(2);
        } else {
          setValue(1);
        }
      } else {
        setPopup(true);
      }
    });
    const unsubscribeOne = navigation.addListener("blur", () => {
      // navigation.setParams({ true: false })
      if (
        authState?.userToken &&
        !authState?.userToken == null &&
        !authState?.userToken == undefined &&
        !authState?.userToken == ""
      ) {
        setValue(1);
      }
    });
    return () => {
      unsubscribe();
      unsubscribeOne();
    };
  }, [route.params?.true]);

  const returnScreen = () => {
    if (value == 1) {
      return (
        <PostItemScreen
          navigation={navigation}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          coverVideo={coverVideo}
          setCoverVideo={setCoverVideo}
          otherImage={otherImage}
          setOtherImage={setOtherImage}
          title={title}
          setTitle={setTitle}
        />
      );
    } else if (value == 2) {
      return (
        <DetailScreen
          setValues={backButton}
          navigation={navigation}
          categories={categories}
          setCategories={setCategories}
          weight={weight}
          setWeight={setWeight}
          year={year}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
          week={week}
          setWeek={setWeek}
          sex={sex}
          setSex={setSex}
          breed={breed}
          setBreed={setBreed}
          reset={reset}
          setReset={setReset}
          catg={catg}
          setCatg={setCatg}
          bred={bred}
          setBred={setBred}
          sx={sx}
          setSx={setSx}
          describe={describe}
          setDescribe={setDescribe}
          keyboardOffset={keyboardOffset}
          setdescrField={setdescrField}
        />
      );
    } else if (value == 3) {
      return (
        <Price
          setValues={backButton}
          navigation={navigation}
          priceOfPet={priceOfPet}
          setPriceOfPet={setPriceOfPet}
          shippingPrice={shippingPrice}
          setShippingPrice={setShippingPrice}
        />
      );
    } else if (value == 4) {
      return (
        <Finish
          setValues={backButton}
          navigation={navigation}
          pin={pin}
          setPin={setPin}
          state={state}
          setState={setState}
          city={city}
          setCity={setCity}
          check={check}
          setCheck={setCheck}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
      );
    }
  };

  const renderHeader = (value) => {
    let headerTitle = "";
    if (value == 1) {
      headerTitle = "Post";
    } else if (value == 2) {
      headerTitle = "Details";
    } else if (value == 3) {
      headerTitle = "Price";
    } else {
      headerTitle = "Finish";
    }

    return (
      <View style={[detailStyles.top_Header, { top: insets.top }]}>
        {value == 1 ? (
          <View style={{ paddingLeft: wp(10) }}></View>
        ) : (
          <TouchableOpacity onPress={backButton}>
            <Image
              source={require("../images/back-button.png")}
              style={detailStyles.headerIcon}
            />
          </TouchableOpacity>
        )}

        <View style={detailStyles.top_HeaderRight}>
          <Text style={detailStyles.top_HeaderText}>{headerTitle}</Text>
        </View>
        <TouchableOpacity
          // style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Text style={detailStyles.top_HeaderText1}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CustomStatusBar = ({ backgroundColor, barStyle = "dark-content" }) => {
    if (Platform.OS === "ios") {
      let barHeight = insets.top - height;

      return (
        <View style={{ height: insets.top, backgroundColor, top: barHeight }}>
          <StatusBar
            animated={true}
            backgroundColor={backgroundColor}
            barStyle={barStyle}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaProvider style={styles.mainContainer}>
      {authState.userToken ? (
        <>
          <View
            style={
              Platform.OS == "android"
                ? styles.flex1
                : [
                    styles.flex1,
                    value == 2 && descrField
                      ? { bottom: keyboardOffset / 1.25 }
                      : {},
                  ]
            }
          >
            {returnScreen()}
          </View>

          <View
            style={[
              styles.bottomStyle,
              Platform.OS == "ios"
                ? { bottom: keyboardOffset ? keyboardOffset - 35 : 0 }
                : {},
            ]}
          >
            <StatusNavigationBar active={value} />
            {value == 4 ? (
              <TouchableOpacity
                onPress={() => {
                  console.log('route.params ... ',route.params)
                  if (route.params?.true == true) {
                    // if (city || state || latitude || longitude) {
                    dispatchHome({ type: "Loading", payload: true });
                    updatePicture();
                    // } else {
                    //     alert("Please enter a valid pin")
                    // }
                  } else {
                    // if (city || state || latitude || longitude) {
                    //   // if(enableBoostAd.isActive){
                    //   //     navigation.navigate("BoostPost")
                    //   // }
                    //   // else{
                    // dispatchHome({ type: "Loading", payload: true });
                    storePicture();
                    //   // }
                    // } else {
                    //   alert("Please enter a valid pin");
                    // }
                  }
                }}
                style={styles.bottomStyleButton}
              >
                <Text style={styles.bottomBtnTxt}>
                  {value == 4
                    ? route.params?.true == true
                      ? "Update"
                      : "Submit"
                    : "Next"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                 
                  if (value == 1) {
                    if (!coverImage.length) {
                      CustomToastMsg("Please upload cover image");
                    } else if (!title) {
                      CustomToastMsg("Please enter title");
                    } else {
                      setValue(value + 1);
                    }
                  } else if (value == 2) {
                    let flag = false;
                    if (!catg?.id) {
                      CustomToastMsg("Please pick category");
                      flag = false;
                    } else if (
                      !sx &&
                      catg.name !== "Pet Services" &&
                      catg.name !== "Pet Supplies" &&
                      catg.name != "Stud Services"
                    ) {
                      CustomToastMsg("Please pick sex");
                      flag = false;
                    } else if (!describe) {
                      CustomToastMsg("Please enter description");
                      flag = false;
                    } else {
                      flag = true;
                    }

                    let flag1 = true;
                    if (weight) {
                      if (
                        !String(weight).match(
                          /^((\d|[1-9]\d+)(\.\d{1,2})?|\.\d{1,2})$/
                        )
                      ) {
                        CustomToastMsg("Please enter valid weight in field");
                        flag1 = false;
                      }
                    }

                    if (flag && flag1) {
                      setValue(value + 1);
                    }
                  } else if (value == 3) {
                    // if (
                    //   !String(priceOfPet).match(
                    //     /^((\d|[1-9]\d+)(\.\d{1,2})?|\.\d{1,2})$/
                    //   ) ||
                    //   priceOfPet.toString() <= 0
                    // ) {
                    //   CustomToastMsg("Please enter valid price");
                    // } else if (
                    //   !String(shippingPrice).match(
                    //     /^((\d|[1-9]\d+)(\.\d{1,2})?|\.\d{1,2})$/
                    //   ) ||
                    //   shippingPrice.toString() <= 0
                    // ) {
                    //   CustomToastMsg("Please enter valid shipping price");
                    // } else {
                      setValue(value + 1);
                    // }
                  }
                }}
                style={styles.bottomStyleButton}
              >
                <Text style={styles.bottomBtnTxt}>
                  {value == 4 ? "Submit" : "Next"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <CustomStatusBar backgroundColor={btnTextColor} />
          {renderHeader(value)}
        </>
      ) : popup ? (
        <CustomLoginPopup
          toggle={popup}
          setPopup={setPopup}
          name="Access Denied"
          btnName1="Cancel"
          btnName2="Login"
          alertText="Please login to access this funcationality."
          btn2Action={() => {
            setNavigatetoHome(false);
            navigation.navigate("SignIn");
          }}
        />
      ) : navigatetoHome ? (
        navigation.navigate("Home") //on cancel, send to home screen
      ) : (
        <></>
      )}
      {showLoader()}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomStyleButton: {
    marginLeft: "5%",
    justifyContent: "center",
    alignContent: "center",
    width: wp("90%"),
    backgroundColor: themeColor,
    height: hp("7%"),
    borderRadius: 7,
    elevation: 10,
  },
  bottomStyle: {
    backgroundColor: "white",
    // position: "absolute",
    width: wp("100%"),
    height: hp("18%"),
    // backgroundColor: "#F0F8FF",
    shadowColor: "#0000001F",
    // marginTop: hp('78%'),
    // marginLeft: 0.5,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  bottomBtnTxt: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontBold,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  flex1: {
    flex: 1,
  },
});

export default Post;

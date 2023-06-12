/** @format */

import messaging from "@react-native-firebase/messaging";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/core";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Loader } from "../subcomponents/Loader";

import { Picker } from "@react-native-picker/picker";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { firebase } from "@react-native-firebase/dynamic-links";
import PushNotification from "react-native-push-notification";
import { useDispatch, useSelector } from "react-redux";
import { MAP_API_KEY, fontRegular, themeColor } from "../common/common";
import { getAppLaunchLink } from "../common/helper";
import { useAuthState } from "../contexts/authContext";
import { useHomeDispatch, useHomeState } from "../contexts/HomeContext";
import { setChatScreenFocused } from "../redux/actions/activeScreenAction";
import {
  fetchAllChat,
  fetchPostList,
  fetchTestFilterPost,
  runAllHomeApi,
} from "../services/api";
import Accordian from "../subcomponents/Accordian";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { requestLocationPermission } from "../subcomponents/latLong";
import { locationName } from "../subcomponents/locationName";
import PetList from "../subcomponents/PetList";
import { homeStyles } from "./HomeScreenStyles";

const upArrow = require("../images/up-arrow.png");
const downArrow = require("../images/down-arrow.png");

const FiltersModal = ({
  filtersModal,
  setFiltersModal,
  selectedValueCat,
  setSelectedValueCat,
  selectedValueLoc,

  stateHome,
  setCatgValue,

  dispatchHome,
  searchTerm,
  setGetDataAcc,

  state,
  city,

  longitude,
  latitude,
}) => {
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={filtersModal}
      onRequestClose={() => {
        setFiltersModal(!filtersModal);
      }}
    >
      <View style={homeStyles.modal_Backdrop}>
        <View style={homeStyles.modal_Main_Wrap}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[homeStyles.sec_padding, { flex: 1 }]}>
              <View style={homeStyles.accordian_Header}>
                <TouchableOpacity
                  onPress={() => {
                    setFiltersModal(!filtersModal);
                  }}
                >
                  <Image
                    source={require("../images/cancle.png")}
                    resizeMode="contain"
                    style={homeStyles.cancle_Icon}
                  />
                </TouchableOpacity>
                <Text style={{ ...homeStyles.txtStyle1 }}>Filter</Text>
                <TouchableOpacity
                  onPress={() => {
                    dispatchHome({ type: "FILTER_STATUS", payload: true });
                    setFiltersModal(!filtersModal);
                    setGetDataAcc("");
                    dispatchHome({ type: "Loading", payload: true });
                    dispatchHome({ type: "FILTER_STATUS", payload: false });

                    fetchTestFilterPost(
                      dispatchHome,
                      stateHome,
                      searchTerm,
                      "",
                      selectedValueCat,
                      "",
                      "",
                      selectedValueLoc,
                      false
                    );
                  }}
                >
                  <Text
                    style={{
                      ...homeStyles.txtStyle2,
                      fontSize: wp("3.7%"),
                      fontWeight: "bold",
                      color: themeColor,
                    }}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View style={homeStyles.filter_Wrap}>
                  <Text style={homeStyles.filter_Text}>Categories</Text>
                  <Picker
                    selectedValue={selectedValueCat}
                    style={homeStyles.filter_Picker}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedValueCat(itemValue);
                    }}
                  >
                    <Picker.Item
                      label="All Categories"
                      value="All Categories"
                    />
                    {stateHome.catg.map((item, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          onValueChange={(value) => {
                            setCatgValue(value);
                          }}
                          label={item.name}
                          value={item.id}
                        />
                      );
                    })}
                  </Picker>
                </View>
                <View style={homeStyles.filter_Wrap}>
                  <Text style={homeStyles.filter_Text}>Location</Text>

                  {state?.length && city?.length ? (
                    <>
                      <Text
                        style={[
                          homeStyles.filter_Picker,
                          { textAlign: "center" },
                        ]}
                      >
                        {selectedValueLoc} Miles
                      </Text>
                    </>
                  ) : (
                    <Text style={homeStyles.filter_Text}>
                      Please let us know your current location
                    </Text>
                  )}
                </View>
              </ScrollView>

              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFiltersModal(!filtersModal);

                    setGetDataAcc("");
                    dispatchHome({ type: "Loading", payload: true });
                    dispatchHome({ type: "FILTER_STATUS", payload: true });

                    fetchTestFilterPost(
                      dispatchHome,
                      stateHome,
                      searchTerm,
                      "",

                      selectedValueCat,
                      longitude,
                      latitude,
                      selectedValueLoc,
                      false
                    );
                  }}
                  style={homeStyles.btnStyle}
                >
                  <Text style={homeStyles.btnTxtStyle}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const SearchByLoc = ({
  searchByLoc,
  setSearchByLoc,
  selectedValueCat,
  selectedValueLoc,

  stateHome,
  setZipCode,
  zipCode,
  dispatchHome,
  searchTerm,
  setGetDataAcc,

  state,
  city,
  longitude,
  latitude,
  setLatitude,
  setLongitude,
  homeAfterSearch,

  setHomeAfterSearch,
}) => {
  const [lati, setLati] = useState(latitude);
  const [logni, setLogni] = useState(longitude);
  const [clickSubmit, setClickSubmit] = useState(false);
  const [hit, setHit] = useState(false);

  useEffect(() => {
    if (zipCode == "" || !zipCode) {
      setLati("");
      setLogni("");
    }
  }, [searchByLoc, zipCode]);

  useEffect(() => {
    if (longitude && latitude && clickSubmit && zipCode == "") {
      setClickSubmit(false);
      dispatchHome({ type: "Loading", payload: true });
      fetchTestFilterPost(
        dispatchHome,
        stateHome,
        searchTerm,
        "",
        selectedValueCat,

        "",
        "",
        selectedValueLoc,
        false
      );
    }

    if (lati && logni && clickSubmit && zipCode) {
      setClickSubmit(false);
      dispatchHome({ type: "Loading", payload: true });
      fetchTestFilterPost(
        dispatchHome,
        stateHome,
        searchTerm,
        "",

        selectedValueCat,
        logni,
        lati,
        selectedValueLoc,
        false
      );
    }
  }, [longitude, latitude, lati, logni, hit]);

  const fetchLocationUsingPincode = () => {
    if (!zipCode || zipCode == "" || zipCode.length < 4) {
      setLati("");
      setLogni("");
      setLatitude("");
      setLongitude("");
      return;
    }

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=` +
        MAP_API_KEY
    )
      .then((respon) => respon.json())
      .then((results) => {
        console.log(results);
        const { lat, lng } = results?.results[0]?.geometry?.location;
        if (lat && lng) {
          setLati(lat);
          setLogni(lng);
          setLatitude(lat);
          setLongitude(lng);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatchHome({ type: "Loading", payload: false });
        customToastMsg("Not able to locate you. Please enter a valid ZIP Code");
      });
  };
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={searchByLoc}
      onRequestClose={() => {
        setSearchByLoc(!setSearchByLoc);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={homeStyles.modal_Backdrop}>
          <View style={homeStyles.modal_Main_Wrap}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={[homeStyles.sec_padding, { flex: 1 }]}>
                <View style={homeStyles.accordian_Header}>
                  <TouchableOpacity
                    onPress={() => {
                      setSearchByLoc(!searchByLoc);
                    }}
                  >
                    <Image
                      source={require("../images/cancle.png")}
                      resizeMode="contain"
                      style={homeStyles.cancle_Icon}
                    />
                  </TouchableOpacity>
                  <Text style={{ ...homeStyles.txtStyle1 }}>Location</Text>
                  <TouchableOpacity onPress={() => {}}></TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ flex: 1 }} bounces={false}>
                  <View style={{}}>
                    <Text style={homeStyles.filter_Text}>ZIP Code</Text>
                    <View style={{ elevation: 10, marginVertical: hp(2) }}>
                      <TextInput
                        value={zipCode.toString()}
                        placeholder="Enter ZIP Code"
                        style={{
                          backgroundColor: "#ddd",
                          paddingHorizontal: 10,
                          height: 50,
                          fontFamily: fontRegular,
                          borderRadius:5
                        }}
                        maxLength={6}
                        keyboardType={"number-pad"}
                        returnKeyType="done"
                        onChangeText={(value) => {
                          setZipCode(value);
                        }}
                        // onBlur={() => {
                        // 	fetchLocationUsingPincode();
                        // }}
                      />
                    </View>
                  </View>
                  {zipCode.length > 4 ? (
                    <View style={{}}>
                      <Text style={homeStyles.filter_Text}>Distance</Text>

                      {state?.length && city?.length ? (
                        <>
                          <Text
                            style={[
                              homeStyles.filter_Picker,
                              { textAlign: "center", fontSize: wp(4.5) },
                            ]}
                          >
                            {selectedValueLoc} Miles
                          </Text>
                          {/* <Slider
													value={parseInt(selectedValueLoc)}
													minimumValue={0}
													maximumValue={1000}
													onValueChange={value => setSelectedValueLoc(value)}
													step={5}
												/> */}
                        </>
                      ) : (
                        <Text style={homeStyles.filter_Text}>
                          Please let us know your current location
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text style={homeStyles.filter_Text}>
                      Please enter your ZIP Code.
                    </Text>
                  )}
                </ScrollView>

                <View>
                  <TouchableOpacity
                    onPress={async () => {
                      setClickSubmit(true);
                      setGetDataAcc("");

                      if (zipCode == "" || !zipCode) {
                        requestLocationPermission(setLatitude, setLongitude);
                      }

                      setSearchByLoc(!searchByLoc);

                      if (zipCode) {
                        dispatchHome({ type: "Loading", payload: true });

                        fetchLocationUsingPincode();
                        setHomeAfterSearch({
                          ...homeAfterSearch,
                          fromLoc: true,
                        });
                        setHit(!hit);
                      } else {
                        setHomeAfterSearch({
                          ...homeAfterSearch,
                          fromLoc: false,
                        });
                        setLatitude("");
                        setLongitude("");
                      }
                    }}
                    style={homeStyles.btnStyle}
                  >
                    <Text style={homeStyles.btnTxtStyle}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const CategoriesModal = ({
  renderCategoriesAccordians,
  categoriesModal,
  setCategoriesModal,
  setGetDataAcc,
}) => {
  const [reset, setReset] = useState(false);

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={categoriesModal}
      onRequestClose={() => {
        setCategoriesModal(!categoriesModal);
      }}
    >
      <View style={homeStyles.modal_Backdrop}>
        <View style={homeStyles.modal_Main_Wrap}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[homeStyles.sec_padding, { flex: 1 }]}>
              <View style={homeStyles.accordian_Header}>
                <TouchableOpacity
                  onPress={() => {
                    setCategoriesModal(false);
                  }}
                >
                  <Image
                    source={require("../images/cancle.png")}
                    resizeMode="contain"
                    style={homeStyles.cancle_Icon}
                  />
                </TouchableOpacity>
                <Text style={{ ...homeStyles.txtStyle1 }}>Categories</Text>
                <TouchableOpacity
                  onPress={() => {
                    setReset(true);
                    setGetDataAcc("");
                  }}
                >
                  <Text
                    style={{
                      ...homeStyles.txtStyle2,
                      fontSize: wp("3.7%"),
                      fontWeight: "bold",
                      color: themeColor,
                    }}
                  >
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View style={{ flex: 1 }}>
                  {renderCategoriesAccordians(reset, setReset)}
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const HomeScreen = ({ navigation, route }) => {
  let dispatchHome = useHomeDispatch();
  let stateHome = useHomeState();
  let authState = useAuthState();

  const dispatch = useDispatch();
  const { activeScreen } = useSelector((state) => state);
  const [categoriesModal, setCategoriesModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [selectedValueCat, setSelectedValueCat] = useState("");
  const [selectedValueLoc, setSelectedValueLoc] = useState("30");
  const [inputRangeMin, setInputRangeMin] = useState("");
  const [inputRangeMax, setInputRangeMax] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [getDataAcc, setGetDataAcc] = useState("");
  const [catgValue, setCatgValue] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [check, setCheck] = useState("");
  const [hitNow, setHitNow] = useState(false);
  const [searchByLoc, setSearchByLoc] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [enableOtherApi, setEnableOtherApi] = useState(false);
  const [fullPostData, setFullPostData] = useState();
  const [homeAfterSearch, setHomeAfterSearch] = useState({
    isSearch: false,
    searchValue: "",
  });
  const [loginValue, setLoginValue] = useState(null);
  const showLoader = (stateHome) => {
    if (stateHome.isLoading) {
      return <Loader />;
    }
    return null;
  };
  const [categories, setCategories] = useState([]);

  PushNotification.configure({
    onNotification: function (notification) {
      if (notification.userInteraction && notification.foreground) {
        dispatch(
          setChatScreenFocused({
            isActive: true,
            userInfo: {
              userId: notification.data.from_user,
              id: notification.data.id,
              messageObj: {
                ...notification.data,
              },
            },
          })
        );
        navigation.navigate("Message", {
          item: {
            userId: notification.data.from_user,
            id: notification.data.id,
            messageObj: {
              ...notification.data,
            },
          },
        });
      }
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    popInitialNotification: true,
    requestPermissions: true,
  });

  useFocusEffect(
    React.useCallback(() => {
      dispatchHome({ type: "CLEAR_POST" });
      let callApis = async () => {
        runAllHomeApi(dispatchHome)();
      };
      callApis();
    }, [navigation])
  );

  useEffect(() => {
    if (authState?.loginedUser) {
      fetchAllChat()
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.success) {
            dispatchHome({ type: "CLEAR_CHAT_USER_INFO" });

            res?.chat.map((item, index, arr) => {
              if (authState?.loginedUser?.id == item.from_user) {
                dispatchHome({
                  type: "SET_CHAT_USER_INFO",
                  payload: {
                    id: item.id,
                    userId: item.to_user,
                    uuid: item.uuid,
                    userName: item.to_user_name,
                    photoUrl: item.to_user_image
                      ? `https://gogetapet.com/public/storage/${item?.to_user_image}`
                      : null,
                    message: item.message_text,
                    created: item.created,
                    messageObj: item,
                  },
                });
              }
              if (authState?.loginedUser?.id == item.to_user) {
                dispatchHome({
                  type: "SET_CHAT_USER_INFO",
                  payload: {
                    id: item.id,
                    userId: item.from_user,
                    uuid: item.uuid,
                    userName: item.from_user_name,
                    photoUrl: item.from_user_image
                      ? `https://gogetapet.com/public/storage/${item?.from_user_image}`
                      : null,
                    message: item.message_text,
                    created: item.created,
                    messageObj: item,
                  },
                });
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [authState && authState.loginedUser]);

  useEffect(() => {
    if (latitude && longitude) {
      setState("");
      setCity("");
      locationName(
        latitude,
        longitude,
        state,
        city,
        setState,
        setPin,
        setCity,
        setCheck
      );
    }
    if (enableOtherApi) {
      if (latitude == "" && longitude == "") {
        dispatchHome({ type: "Loading", payload: true });
        fetchTestFilterPost(
          dispatchHome,
          stateHome,
          searchTerm,
          getDataAcc?.id,
          // sort = '',
          selectedValueCat,
          "",
          "",
          selectedValueLoc,
          false

          // min = '',
          // max = '',
        );
      }
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (hitNow == false) {
        dispatchHome({ type: "Loading", payload: true });
        if (homeAfterSearch.isSearch == false) {
          setZipCode("");
        }
        setHomeAfterSearch({ searchValue: "", isSearch: false });
        setSearchTerm("");
        setSelectedValueCat("");
        setSelectedValueLoc("30");
        setLatitude("");
        setLongitude("");
        // if (latitude == "" || longitude == "") {
        await requestLocationPermission(setLatitude, setLongitude);
        // }
        dispatchHome({ type: "Loading", payload: true });
        fetchTestFilterPost(
          dispatchHome,
          stateHome,
          "",
          getDataAcc?.id,
          // sort = '',
          "",
          "",
          "",
          selectedValueLoc,
          false

          // min = '',
          // max = '',
        );
      }

      setEnableOtherApi(true);
    });
    if (hitNow) {
      dispatchHome({ type: "Loading", payload: true });
      fetchTestFilterPost(
        dispatchHome,
        stateHome,
        searchTerm,
        getDataAcc?.id,
        selectedValueCat,
        homeAfterSearch?.fromLoc ? longitude : "",
        homeAfterSearch?.fromLoc ? latitude : "",
        selectedValueLoc,
        false
      );
      setHitNow(false);
    } else {
    }

    return unsubscribe;
  }, [hitNow, fullPostData]);

  useEffect(() => {
    if (enableOtherApi) {
      dispatchHome({ type: "Loading", payload: true });

      setCategoriesModal(false);
      setSelectedValueCat("");
      fetchTestFilterPost(
        dispatchHome,
        stateHome,
        searchTerm,
        getDataAcc?.id,
        selectedValueCat,
        homeAfterSearch?.fromLoc ? longitude : "",
        homeAfterSearch?.fromLoc ? latitude : "",
        selectedValueLoc,
        false
      );
    }
  }, [getDataAcc]);

  // called this when come back
  useEffect(() => {
    const willFocusSubscription = navigation.addListener("focus", () => {
      AsyncStorage.getItem("loginValue").then((loginValueCheck) => {
        const response = JSON.parse(loginValueCheck);
        setLoginValue(response);
      });
      setTimeout(
        () =>
          console.log(
            authState?.loginedUser?.id,
            "---loginValueCheck---",
            loginValue
          ),

        fetchPostList(
          setFullPostData,
          dispatchHome,
          loginValue,
          authState?.loginedUser?.id
        ),
        500
      );
    });
    return willFocusSubscription;
  }, [loginValue, authState?.loginedUser?.id]);

  useEffect(() => {
    setCategories(stateHome?.catg);
  });

  let renderCategoriesAccordians = (reset, setReset) => {
    const items = [];
    let title = "";
    if (reset) {
    }

    for (let item of categories) {
      title = item.name;
      if (getDataAcc.catgId == item.id) {
        title = getDataAcc.name;
      }

      const temp = (
        <Accordian
          key={item.id}
          title={title}
          data={item.breeds}
          imageOpen={upArrow}
          imageClose={downArrow}
          titleColor={themeColor}
          reset={reset}
          setReset={setReset}
          setGetDataAcc={setGetDataAcc}
        />
      );

      items.splice(item.temp_id, 0, temp);
    }

    return items;
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (
        remoteMessage.data.from_user !=
        activeScreen.chatScreenFocused.userInfo?.userId
      ) {
        PushNotification.localNotification({
          channelId: "fcm_fallback_notification_channel",
          title: remoteMessage?.notification?.title,
          message: remoteMessage.data?.message_text,
          playSound: true,
          soundName: "dog.wav",
          autoCancel: true,
          vibrate: true,
          vibration: 300,
          invokeApp: true,
          userInfo: {
            ...remoteMessage.data,
          },
        });
      }
    });
    return unsubscribe;
  }, [activeScreen.chatScreenFocused]);

  useEffect(() => {
    getAppLaunchLink(navigation);

    const unsubscribe = firebase.dynamicLinks().onLink(({ url }) => {
      if (navigation) {
        let id = url.split("=")[1];
        if (id) {
          navigation.navigate("Post", { id });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
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
        }
      } catch (e) {
        console.log(e, "error catch notification");
      }
      return Promise.resolve();
    };
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    if (authState?.loginedUser) {
      messaging().onNotificationOpenedApp((remoteMessage) => {
        if (remoteMessage) {
          dispatch(
            setChatScreenFocused({
              isActive: true,
              userInfo: {
                userId: remoteMessage.data.from_user,
                id: remoteMessage.data.id,
                messageObj: {
                  ...remoteMessage.data,
                },
              },
            })
          );
          navigation.navigate("Message", {
            item: {
              userId: remoteMessage.data.from_user,
              id: remoteMessage.data.id,
              messageObj: {
                ...remoteMessage.data,
              },
            },
          });
        }
      });

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          getNotificationData();
          if (remoteMessage) {
            dispatch(
              setChatScreenFocused({
                isActive: true,
                userInfo: {
                  userId: remoteMessage.data.from_user,
                  id: remoteMessage.data.id,
                  messageObj: {
                    ...remoteMessage.data,
                  },
                },
              })
            );
            navigation.navigate("Message", {
              item: {
                userId: remoteMessage.data.from_user,
                id: remoteMessage.data.id,
                messageObj: {
                  ...remoteMessage.data,
                },
              },
            });
          }
        });
    }
  }, [authState, authState?.loginedUser]);

  return (
    <SafeAreaView style={[homeStyles.mainContainer]}>
      <View
        style={[
          homeStyles.top_Header,
          homeAfterSearch.isSearch
            ? {
                marginTop: 22,
                marginBottom: 17,
                marginHorizontal: wp("5%"),
              }
            : null,
        ]}
      >
        {homeAfterSearch.isSearch ? (
          <View style={homeStyles.header_Back_Btn}>
            <TouchableOpacity
              onPress={() => {
                setHomeAfterSearch({ searchValue: "", isSearch: false });
                setSearchTerm("");
                setSelectedValueCat("");
                if (homeAfterSearch && !homeAfterSearch.isSearch) {
                  setSelectedValueLoc("30");
                }
                setLatitude("");
                setLongitude("");
                dispatchHome({ type: "Loading", payload: true });
                dispatchHome({ type: "FILTER_STATUS", payload: false });

                requestLocationPermission(setLatitude, setLongitude);
                setHitNow(!hitNow);
              }}
            >
              <Image
                source={require("../images/back-button.png")}
                style={{
                  height: hp("8%"),
                  width: wp("14%"),
                  marginTop: hp("0.5%"),
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity
          style={homeStyles.inputSearchBox}
          onPressIn={() => {
            navigation.navigate("Search", {
              setHomeAfterSearch,
              homeAfterSearch,
              setSearchTerm,
              searchTerm,
              setHitNow,
              hitNow,
            });
          }}
        >
          {Platform.OS === "ios" ? (
            <Image
              source={require("../images/search.png")}
              style={homeStyles.icon_InputSearchBox}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("../images/search.png")}
              style={homeStyles.icon_InputSearchBox}
              resizeMode="contain"
            />
          )}
          <TextInput
            editable={false}
            style={{ marginLeft: wp(1) }}
            value={
              homeAfterSearch.searchValue ??
              "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + homeAfterSearch.searchValue
            }
            placeholder="Search"
            placeholderTextColor={"#000"}
          />
        </TouchableOpacity>

        {homeAfterSearch.isSearch ? null : (
          <TouchableOpacity
            onPress={() => {
              setCategoriesModal(true);
            }}
          >
            <Image
              source={require("../images/categories.png")}
              style={homeStyles.inputSearchBox_Right_Image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={homeStyles.contentSection}>
        <TouchableOpacity
          onPress={() => {
            setSearchByLoc(true);
          }}
          style={homeStyles.location_Wrapper}
        >
          <Image
            source={require("../images/location-home.png")}
            style={homeStyles.sm_Image}
            resizeMode="contain"
          />
          {state?.length && city?.length ? (
            <Text style={homeStyles.location_Text}>{`${state},${city}${
              stateHome.filterEnable || zipCode.length > 4
                ? "-" + selectedValueLoc + " Miles"
                : ""
            } `}</Text>
          ) : (
            <Text
              style={homeStyles.location_Text}
            >{`Click here to get pet nearby`}</Text>
          )}
        </TouchableOpacity>
        {homeAfterSearch.isSearch ? (
          <View style={homeStyles.buttons_Wrapper}>
            <TouchableOpacity
              style={[homeStyles.buttons_Blue, homeStyles.btn]}
              onPress={() => {
                setFiltersModal(true);
              }}
            >
              <Image
                source={require("../images/filter.png")}
                style={homeStyles.sm_Image}
                resizeMode="contain"
              />
              <Text style={homeStyles.btn_Blue_Text}>Filter</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {stateHome.post.length > 0 ? (
        <PetList
          petImages={stateHome}
          fullPostData={fullPostData}
          setFullPostData={setFullPostData}
          navigation={navigation}
          search={searchTerm}
          setSearchTerm={setSearchTerm}
          setGetDataAcc={setGetDataAcc}
          selectedValueCat={selectedValueCat}
          getDataAcc={getDataAcc}
          longitude={longitude}
          latitude={latitude}
          selectedValueLoc={selectedValueLoc}
          searchTerm={searchTerm}
          homeAfterSearch={homeAfterSearch}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          authState={authState}
        />
      ) : (
        <View
          style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}
        >
          <Text>There is no item to display for applied filter.</Text>
        </View>
      )}

      <CategoriesModal
        renderCategoriesAccordians={renderCategoriesAccordians}
        categoriesModal={categoriesModal}
        setCategoriesModal={setCategoriesModal}
        dispatchHome={dispatchHome}
        stateHome={stateHome}
        searchTerm={searchTerm}
        getDataAcc={getDataAcc}
        setHitNow={setHitNow}
        hitNow={hitNow}
        setSelectedValueCat={setSelectedValueCat}
        setGetDataAcc={setGetDataAcc}
      />
      <FiltersModal
        filtersModal={filtersModal}
        setFiltersModal={setFiltersModal}
        selectedValueCat={selectedValueCat}
        setSelectedValueCat={setSelectedValueCat}
        selectedValueLoc={selectedValueLoc}
        setSelectedValueLoc={setSelectedValueLoc}
        inputRangeMin={inputRangeMin}
        inputRangeMax={inputRangeMax}
        setInputRangeMin={setInputRangeMin}
        setInputRangeMax={setInputRangeMax}
        dispatchHome={dispatchHome}
        stateHome={stateHome}
        setCatgValue={setCatgValue}
        catgValue={catgValue}
        searchTerm={searchTerm}
        getDataAcc={getDataAcc}
        state={state}
        city={city}
        setHitNow={setHitNow}
        hitNow={hitNow}
        setGetDataAcc={setGetDataAcc}
        longitude={longitude}
        latitude={latitude}
      />
      <SearchByLoc
        searchByLoc={searchByLoc}
        setSearchByLoc={setSearchByLoc}
        selectedValueCat={selectedValueCat}
        setSelectedValueCat={setSelectedValueCat}
        selectedValueLoc={selectedValueLoc}
        setSelectedValueLoc={setSelectedValueLoc}
        inputRangeMin={inputRangeMin}
        inputRangeMax={inputRangeMax}
        setInputRangeMin={setInputRangeMin}
        setInputRangeMax={setInputRangeMax}
        dispatchHome={dispatchHome}
        stateHome={stateHome}
        zipCode={zipCode}
        setZipCode={setZipCode}
        searchTerm={searchTerm}
        getDataAcc={getDataAcc}
        state={state}
        city={city}
        setHitNow={setHitNow}
        hitNow={hitNow}
        setGetDataAcc={setGetDataAcc}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        longitude={longitude}
        latitude={latitude}
        homeAfterSearch={homeAfterSearch}
        setHomeAfterSearch={setHomeAfterSearch}
      />

      {showLoader(stateHome)}
    </SafeAreaView>
  );
};

export default HomeScreen;

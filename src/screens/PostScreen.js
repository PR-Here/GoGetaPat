import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ToastAndroid,
  ScrollView,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CurrencyPicker from "react-native-currency-picker";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import Carousel from "../subcomponents/Carousel";
import { priceValidate, camelCase } from "../common/helper";
import {
  fontBold,
  fontLight,
  fontRegular,
  grayBorderColor,
  themeColor,
  fontMediumTextColor2,
  fontMediumTextColor3,
  headerColor,
  fontMediumTextColor,
} from "../common/common";
import { useAuthState } from "../contexts/authContext";
import { useHomeDispatch, useHomeState } from "../contexts/HomeContext";
import {
  fetchSinglePost,
  savePost,
  UnsavePost,
  reportPost,
  deletePost,
  blockUser,
  boostPost,
  boostposts
} from "../services/api";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { handleShare } from "../subcomponents/Share";
import { Loader } from "../subcomponents/Loader";
import { CustomLoginPopup } from "../subcomponents/CustomLoginPopup";
import { useDispatch } from "react-redux";
import { setChatScreenFocused } from "../redux/actions/activeScreenAction";

const ReportModal = ({
  reportModal,
  setReportModal,
  setPlanModal,
  setModalDelete,
  user_id,
  fullData,
  navigation,
  setOpenModal,
}) => {
  let authState = useAuthState();

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={reportModal}
      onRequestClose={() => {
        setReportModal(!reportModal);
      }}
    >
      <View style={styles.modal_Backdrop}>
        <View
          style={
            !(authState?.loginedUser?.id == user_id)
              ? styles.modal_Main_Wrap
              : styles.modal_Main_Wrap2
          }
        >
          <View style={{ paddingHorizontal: wp("4%"), flex: 1 }}>
            <View style={styles.modal_Header}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setReportModal(!reportModal);
                  }}
                >
                  <Text style={[styles.txtStyle2, { color: themeColor }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.report_List_Wrap}>
              {!(authState?.loginedUser?.id == user_id) ? (
                <>
                  <TouchableOpacity
                    style={[styles.report_List_View, { flexDirection: "row" }]}
                    onPress={() => {
                      // deletePost(fullData.id, navigation)
                      setReportModal(false);
                      setModalDelete(true);
                      setOpenModal("delete_post");
                    }}
                  >
                    <Image
                      source={require("../images/delete.png")}
                      style={{
                        height: hp("4.4%"),
                        width: hp("4.4%"),
                        marginRight: wp("3%"),
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.report_List_Text}>Delete Post</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.report_List_View, { flexDirection: "row" }]}
                    onPress={() => {
                      setReportModal(false);
                        setPlanModal(true);
                      // navigation.navigate("Boost", {
                      //   post_id: fullData.id,
                      //   from_admin: true
                      // });
                    }}
                  >
                    <Image
                      source={require("../images/Promote.png")}
                      style={{
                        height: hp("4.4%"),
                        width: hp("4.4%"),
                        marginRight: wp("3%"),
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.report_List_Text}>Boost Post</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.report_List_View, { flexDirection: "row" }]}
                    onPress={() => {
                      // blockUser(fullData.user.id, navigation);
                      setReportModal(false);
                      setModalDelete(true);
                      setOpenModal("block_post");
                    }}
                  >
                    <Image
                      source={require("../images/cancel1.png")}
                      style={styles.report_List_Image}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.report_List_Text}>Block User</Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : null}
              {/* 
                <TouchableOpacity style={styles.report_List_View}>
                  <Image
                    source={require("../images/share_dark.png")}
                    style={styles.report_List_Image}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.report_List_Text}>Share</Text>
                  </View>
                </TouchableOpacity>
                {!(authState?.loginedUser?.id == user_id) ? (
                  <TouchableOpacity
                    style={styles.report_List_View}
                    onPress={() => {
                      setRateProfile(true);
                      setReportModal(!reportModal);
                    }}
                  >
                    <Image
                      source={require("../images/rating.png")}
                      style={styles.report_List_Image}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.report_List_Text}>Rate Profile</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
  
                {!(authState?.loginedUser?.id == user_id) ? (
                  <TouchableOpacity
                    style={styles.report_List_View}
                    onPress={() => {
                      {
                        reported
                          ? customToastMsg("You already reported this profile")
                          : setFilterReportModal(true);
                        setReportModal(!reportModal);
                      }
                    }}
                  >
                    <Image
                      source={require("../images/cancel1.png")}
                      style={styles.report_List_Image}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.report_List_Text}>Report</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}*/}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const PlanModal = ({
  planModal,
  setPlanModal,
  userID,
  planDays,
  setModalDelete,
  user_id,
  fullData,
  navigation,
  dispatchHome,
}) => {
  let authState = useAuthState();

  //handle postBoost
  const postBoost = (days) => {

    let data = {
      user_id: fullData?.user?.id,
      days: days,
    };
console.log("----postBoost data----",JSON.stringify(data));
    const config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.userToken}`,
      },
      body: data,
    };

    fetch(
      `https://gogetapet.com/api/api/PostBoost`,
      config
    )
      .then((response) => response.json())
      .then((responseData) => {
        dispatchHome({ type: "Loading", payload: false });
        if(responseData?.success === false){
          Alert.alert(responseData?.message);
        }
        console.log("----postBoost responseData----",JSON.stringify(responseData));
        navigation.navigate("Home");
        // console.log(responseData)
      })
      .catch((err) => {
        console.log(err);
        customToastMsg(err.message.toString());
      });
  };

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={planModal}
      onRequestClose={() => {
        setPlanModal(!planModal);
      }}
    >
      <View style={styles.modal_Backdrop}>
        <View
          style={
            !(authState?.loginedUser?.id == user_id)
              ? styles.modal_Main_Wrap
              : styles.modal_Main_Wrap2
          }
        >
          <View style={{ paddingHorizontal: wp("4%"), flex: 1 }}>
            <View style={styles.modal_Header}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setPlanModal(!planModal);
                  }}
                >
                  <Text style={[styles.txtStyle2, { color: themeColor }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.report_List_Wrap}>
              {!(authState?.loginedUser?.id == user_id) ? (
                <>
                  <TouchableOpacity
                    style={[styles.report_List_View, { flexDirection: "row" }]}
                    onPress={() => {
                      setPlanModal(false);
                      boostposts(fullData.user.id, 7, navigation);

                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.report_List_Text}>7 Days</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.report_List_View, { flexDirection: "row" }]}
                    onPress={() => {
                      setPlanModal(false);
                      boostposts(fullData.user.id, 30, navigation);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.report_List_Text}>1 Month</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.report_List_View, { flexDirection: "row" }]}
                    onPress={() => {
                      setPlanModal(false);
                      boostposts(fullData.user.id, 365, navigation);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.report_List_Text}>1 Year</Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const MakeAnOfferModal = ({
  makeOfferModal,
  setMakeOfferModal,
  petActualPrice,
}) => {
  const [petOfferedPrice, setPetOfferedPrice] = useState([]);
  const [priceOfPet, setPriceOfPet] = useState("");
  const { currency, price } = petActualPrice;
  const makeOwnOfferInput = useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [symbol, setSymbol] = useState("$");

  const [code, setCode] = useState("US");
  let currencyPickerRef = undefined;
  // const [ratio, setRatio] = useState(false)
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        // console.log(isKeyboardVisible)
        // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
        // console.log(isKeyboardVisible)
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    setPetOfferedPrice([]);
    let makeOffer = (10 / 100) * price;
    let offerPrice = price - makeOffer;
    let allOfferPrice = [];
    for (let i = 0; i < 4; i++) {
      allOfferPrice.push(offerPrice);
      offerPrice = offerPrice - makeOffer;
    }
    setPetOfferedPrice(allOfferPrice);
  }, [petActualPrice]);

  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={makeOfferModal}
      onRequestClose={() => {
        setMakeOfferModal(!makeOfferModal);
      }}
    >
      <View style={styles.modal_Backdrop}>
        <View
          style={[
            styles.modal_Main_Wrap,
            { height: isKeyboardVisible ? hp("55%") : hp("75%") },
          ]}
        >
          {/* <KeyboardAvoidingView
                    keyboardVerticalOffset={Header.HEIGHT + 50} // adjust the value here if you need more padding
                    style={{ flex: 1 }}
                    behavior="margin"
                > */}

          <View style={[styles.sec_padding, { flex: 1 }]}>
            <View style={styles.accordian_Header}>
              <View style={{ flex: 1 }}></View>

              <View style={{ flex: 1 }}>
                <TouchableOpacity>
                  <Text style={styles.txtStyle1}>Make an Offer</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TouchableOpacity
                  onPress={() => {
                    setMakeOfferModal(!makeOfferModal);
                  }}
                >
                  <Text style={{ ...styles.txtStyle2, color: themeColor }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView>
              <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                {petOfferedPrice && petOfferedPrice.length
                  ? petOfferedPrice.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setPriceOfPet(item);
                          }}
                        >
                          <View
                            style={[
                              styles.offerPriceWrapper,
                              {
                                borderColor:
                                  priceOfPet == item ? "black" : themeColor,
                              },
                            ]}
                          >
                            {/* <Text style={[styles.offerPriceText, { color: priceOfPet == item ? "black" : themeColor }]}>{`${currency} ${item}`}</Text> */}
                            <Text
                              style={[
                                styles.offerPriceText,
                                {
                                  color:
                                    priceOfPet == item ? "black" : themeColor,
                                },
                              ]}
                            >{`${symbol} ${item}`}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  : null}
              </View>

              <View
                style={styles.makeOwnOffer}
                onTouchStart={() => {
                  makeOwnOfferInput.current.focus();
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    currencyPickerRef.open();
                  }}
                >
                  <Image
                    source={require("../images/up-arrow.png")}
                    style={styles.headerIconArrow}
                  />
                </TouchableOpacity>
                <CurrencyPicker
                  currencyPickerRef={(ref) => {
                    currencyPickerRef = ref;
                  }}
                  enable={true}
                  darkMode={false}
                  currencyCode={code}
                  showFlag={false}
                  showCurrencyName={false}
                  showCurrencyCode={false}
                  onSelectCurrency={(data) => {
                    setSymbol(data.symbol);
                    setCode(data.code);
                    // ; console.log("DATA", data)
                  }}
                  onOpen={() => {}}
                  onClose={() => {}}
                  showNativeSymbol={false}
                  showSymbol={true}
                  containerStyle={{
                    container: {},
                    flagWidth: 40,
                    currencyCodeStyle: {},
                    currencyNameStyle: {},
                    symbolStyle: {
                      fontSize: wp("9%"),
                      fontFamily: fontBold,
                      fontWeight: "bold",
                      paddingVertical: 5,
                    },
                    symbolNativeStyle: {},
                  }}
                  modalStyle={{
                    container: {},
                    searchStyle: {},
                    tileStyle: {},
                    itemStyle: {
                      itemContainer: {},
                      flagWidth: 30,
                      currencyCodeStyle: {},
                      currencyNameStyle: {},
                      symbolStyle: {},
                      symbolNativeStyle: {},
                    },
                  }}
                  title={"Currency"}
                  searchPlaceholder={"Search"}
                  showCloseButton={true}
                  showModalTitle={true}
                />

                <TextInput
                  placeholder={"Enter Price  "}
                  value={priceOfPet.toLocaleString("en-US", {
                    style: "currency",
                  })}
                  onChangeText={(value) => {
                    if (priceValidate(value)) {
                      setPriceOfPet(value);
                    }
                  }}
                  placeholderTextColor={grayBorderColor}
                  style={styles.makeOwnOfferInput}
                  ref={makeOwnOfferInput}
                  keyboardType="numeric"
                />
              </View>
              {/* <View style={styles.makeOwnOffer}
                            onTouchStart={() => {
                                makeOwnOfferInput.current.focus();
                            }}
                        >
                            <Text style={styles.makeOwnOfferText}>{`${currency}`}</Text>
                            <TextInput value={priceOfPet.toString()} onChangeText={(value) => { setPriceOfPet(value); }} style={styles.makeOwnOfferInput} ref={makeOwnOfferInput} keyboardType="numeric" />
                        </View> */}
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setMakeOfferModal(!makeOfferModal);
                  }}
                  style={styles.btnStyle}
                >
                  <Text style={styles.btnTxtStyle}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* </KeyboardAvoidingView > */}
        </View>
      </View>
    </Modal>
  );
};

const FilterReportModal = ({
  filterReportModal,
  setFilterReportModal,
  setThankYouModal,
  setFullData,
  setImages,
  id,
  dispatchHome,
}) => {
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={filterReportModal}
      onRequestClose={() => {
        setFilterReportModal(!filterReportModal);
      }}
    >
      <View style={styles.modal_Backdrop}>
        <View style={styles.modal_Main_Wrap}>
          <View style={{ paddingHorizontal: wp("4%"), flex: 1 }}>
            <View style={styles.modal_Header}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterReportModal(!filterReportModal);
                  }}
                >
                  <Text style={[styles.txtStyle2, { color: themeColor }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.report_List_Wrap}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderColor: "#ddd",
                  paddingBottom: 10,
                }}
              >
                {/* <Text style={{ fontFamily: fontBold, fontWeight: "bold", fontSize: wp("5.5%") }}>Filter</Text> */}
              </View>
              <View>
                <Text
                  style={{
                    paddingVertical: 15,
                    color: "#000",
                    fontSize: wp("4.5%"),
                    fontFamily: fontBold,
                    fontWeight: "bold",
                  }}
                >
                  Why are you reporting this post?
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setFilterReportModal(!filterReportModal);
                  setThankYouModal(true);
                  reportPost(
                    id,
                    "It's spam",
                    setFullData,
                    setImages,
                    dispatchHome
                  );
                  // fetchSinglePost(setFullData, setImages, id, dispatchHome)
                }}
                style={{ paddingBottom: 15 }}
              >
                <Text style={{ fontSize: wp("4.5%") }}>It's spam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFilterReportModal(!filterReportModal);
                  setThankYouModal(true);
                  reportPost(
                    id,
                    "It's inappropriate",
                    setFullData,
                    setImages,
                    dispatchHome
                  );
                  // fetchSinglePost(setFullData, setImages, id, dispatchHome)
                }}
                style={{ paddingBottom: 15 }}
              >
                <Text style={{ fontSize: wp("4.5%") }}>It's inappropriate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ThankYouModal = ({
  thankYouModal,
  setThankYouModal,
  setFilterReportModal,
}) => {
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={thankYouModal}
      onRequestClose={() => {
        setThankYouModal(!thankYouModal);
      }}
    >
      <View style={styles.modal_Backdrop}>
        <View style={styles.modal_Main_Wrap}>
          <View style={{ paddingHorizontal: wp("4%"), flex: 1 }}>
            <View style={styles.modal_Header}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setThankYouModal(!thankYouModal);
                  }}
                >
                  <Text style={[styles.txtStyle2, { color: themeColor }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.report_List_Wrap}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                  paddingTop: 15,
                }}
              >
                <Image
                  source={require("../images/successfully.png")}
                  style={{
                    resizeMode: "contain",
                    width: hp("10%"),
                    height: hp("10%"),
                  }}
                />
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{
                    paddingTop: 15,
                    color: "#000",
                    fontSize: wp("5%"),
                    fontFamily: fontBold,
                    fontWeight: "bold",
                  }}
                >
                  Thanks for reporting
                </Text>
              </View>
              <View style={{ paddingBottom: 15, paddingTop: 7 }}>
                <Text style={{ fontSize: wp("4.5%"), textAlign: "center" }}>
                  Thanks for helping us to keep application safe and supportive
                  community
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const PostScreen = ({ navigation, route }) => {
  const authState = useAuthState();
  const homeState = useHomeState();
  const dispatchHome = useHomeDispatch();
  const [filterReportModal, setFilterReportModal] = useState(false);
  const [thankYouModal, setThankYouModal] = useState(false);
  const [fullData, setFullData] = useState({});
  const [makeOfferModal, setMakeOfferModal] = useState(false);
  const [petActualPrice, setPetActualPrice] = useState({
    currency: "$",
    price: "30",
  });
  const [userID, setUserID] = useState(route.params.userId);
  const [heart, setHeart] = useState();
  const [colorForHeader, setColorForHeader] = useState(false);
  const dispatch = useDispatch();
  const [reportModal, setReportModal] = useState(false);
  const [planModal, setPlanModal] = useState(false);
  const [planDays, setPlanDays] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [openModal, setOpenModal] = useState("");
  const [images, setImages] = useState([]);
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return (
      layoutMeasurement.height + 10 < layoutMeasurement.height + contentOffset.y
    );
  };

  const [popup, setPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      //  let postData= homeState && homeState.post.length && homeState?.post?.filter((item)=>{
      //     return item.id== route?.params?.id

      //  })
      dispatchHome({ type: "Loading", payload: true });
      fetchSinglePost(setFullData, setImages, route?.params?.id, dispatchHome);
      // setImages([...postData[0].cover_image,...postData[0].non_cover_image])
    });
    return unsubscribe;
  }, []);
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    setHeart(fullData.saved);
    setPetActualPrice({ currency: "$", price: fullData.price });
  }, [fullData]);

  const showLoader = () => {
    if (homeState.isLoading) {
      return <Loader />;
    }
    return null;
  };

  const handleMsg = (fullData) => {
    if (!authState.userToken) {
      setPopup(true);
      return;
    } else {
      let x = homeState.chatUserInfo.filter((item) => {
        return item.userId == fullData.user.id;
      });

      // if (x.length) {
      //     navigation.navigate("Message", { item: { userId: fullData.user.id, id: x[0].id, data: x[0] } })
      // } else {
      //     navigation.navigate("Message", { item: { userId: fullData.user.id } })

      // }
      if (x.length) {
        dispatch(
          setChatScreenFocused({
            isActive: true,
            userInfo: {
              ...x[0],
            },
          })
        );
        navigation.navigate("Message", { item: x[0] });
      } else {
        dispatch(
          setChatScreenFocused({
            isActive: true,
            userInfo: {
              userId: fullData.user.id,
            },
          })
        );
        navigation.navigate("Message", { item: { userId: fullData.user.id } });
      }
    }
  };

  const handleReport = (fullData) => {
    if (!authState.userToken) {
      setPopup(true);
      return;
    } else {
      fullData?.reported
        ? customToastMsg("You already reported this post")
        : setFilterReportModal(true);
    }
  };

  const handleSave = (fullData) => {
    if (!authState.userToken) {
      setPopup(true);
      return;
    } else {
      UnsavePost(fullData.id, setHeart);
      customToastMsg("Post removed from your profile  ");
    }
  };

  tempYearName = fullData?.ageYear > 1 ? " Yrs" : " Yr";
  tempWeekName = fullData?.ageWeek > 1 ? " W" : " W";
  tempMonthName = fullData?.ageMonth > 1 ? " Mo" : " Mo";

  const { latitude, longitude } = fullData;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FilterReportModal
        filterReportModal={filterReportModal}
        setFilterReportModal={setFilterReportModal}
        setThankYouModal={setThankYouModal}
        setFullData={setFullData}
        setImages={setImages}
        id={route?.params?.id}
        dispatchHome={dispatchHome}
      />
      <ThankYouModal
        thankYouModal={thankYouModal}
        setThankYouModal={setThankYouModal}
        setFilterReportModal={setFilterReportModal}
      />
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: wp("100%"),
            height: hp("8.3%"),
            backgroundColor: colorForHeader ? headerColor : "transparent",
            position: "absolute",
            zIndex: 1,
            paddingHorizontal: hp("2%"),
            elevation: colorForHeader ? 11 : 0,
            // top: 0
            paddingTop: hp("0.5%"),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../images/back-button.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                // setHeart(!heart);

                if (heart) {
                  handleSave(fullData);
                } else {
                  authState.userToken
                    ? savePost(fullData.id, setHeart)
                    : setPopup(true);
                }
              }}
            >
              {heart ? (
                <Image
                  source={require("../images/heart.png")}
                  style={styles.headerIcon}
                />
              ) : (
                <Image
                  source={require("../images/heartdis.png")}
                  style={styles.headerIcon}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleShare(fullData.id)}>
              <Image
                source={require("../images/shareButton.png")}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            {authState?.loginedUser?.is_admin == 1 && (
              <TouchableOpacity
                style={styles.go_Back_Icon}
                onPress={() => {
                  setReportModal(true);
                }}
              >
                <Image
                  source={require("../images/3dot-icon.png")}
                  style={{ width: wp("6%") }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            <ReportModal
              reportModal={reportModal}
              user_id={route.params.userId}
              setReportModal={setReportModal}
              setFilterReportModal={setFilterReportModal}
              fullData={fullData}
              setFullData={setFullData}
              setImages={setImages}
              dispatchHome={dispatchHome}
              navigation={navigation}
              setModalDelete={setModalDelete}
              setOpenModal={setOpenModal}
              setPlanModal={setPlanModal}
            />
            <PlanModal
              planModal={planModal}
              user_id={route.params.userId}
              setPlanModal={setPlanModal}
              setPlanDays={setPlanDays}
              planDays={planDays}
              userID={userID}
              fullData={fullData}
              setFullData={setFullData}
              dispatchHome={dispatchHome}
              navigation={navigation}
            />

          </View>
        </View>
        <ScrollView
          style={styles.mainContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              setColorForHeader(true);
            } else {
              setColorForHeader(false);
            }
          }}
          scrollEventThrottle={0}
        >
          <View style={{ overflow: "hidden", flex: 1 }}>
            <Carousel images={images} />
          </View>

          <View style={styles.container}>
            <Text allowFontScaling={false} style={styles.PetName}>
              {fullData.title}
            </Text>
            <View
              style={[
                styles.about,
                {
                  justifyContent: fullData.sex
                    ? fullData.weight
                      ? fullData.ageYear ||
                        fullData.ageMonth ||
                        fullData.ageWeek
                        ? "space-between"
                        : "flex-start"
                      : "flex-start"
                    : "flex-start"
                },
              ]}
            >
              {fullData.sex &&
              fullData?.category_id != 5 &&
              fullData?.category_id != 6 &&
              fullData?.category_id != 8 ? (
                <>
                  <View style={styles.row}>
                    <Text style={styles.TextGray}>Sex</Text>
                    <Text style={styles.TextBlue}> {fullData.sex}</Text>
                  </View>
                </>
              ) : null}
              {fullData?.ageYear || fullData?.ageMonth || fullData?.ageWeek ? (
                <>
                  {fullData.sex ? (
                    <View
                      style={[styles.BorderRight, { marginHorizontal: wp(4) }]}
                    ></View>
                  ) : null}
                  <View style={styles.row}>
                    <Text style={styles.TextGray}>Age</Text>
                    <Text style={styles.TextBlue}>
                      {fullData?.ageYear ? fullData?.ageYear + tempYearName : ""}
                      {fullData?.ageMonth
                        ? " " + fullData?.ageMonth + tempMonthName
                        : ""}
                      {fullData?.ageWeek
                        ? " " + fullData?.ageWeek + tempWeekName
                        : ""}
                    </Text>
                  </View>
                </>
              ) : null}
              {fullData?.weight ? (
                <>
                  {fullData.sex ? (
                    <View
                      style={[styles.BorderRight, { marginHorizontal: wp(4) }]}
                    ></View>
                  ) : fullData?.ageYear ||
                    fullData?.ageMonth ||
                    fullData?.ageWeek ? (
                    <View
                      style={[styles.BorderRight, { marginHorizontal: wp(4) }]}
                    ></View>
                  ) : null}
                  <View style={styles.row}>
                    <Text style={styles.TextGray}>Weight</Text>
                    <Text style={styles.TextBlue}>
                      {parseFloat(fullData?.weight)} lbs
                    </Text>
                  </View>
                </>
              ) : null}
            </View>
            <View>
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: "flex-start",
                    marginTop: 10,
                    alignItems: "center",
                  },
                ]}
              >
                <Text style={[styles.chat_Message, { paddingRight: 5 }]}>
                  Price -
                </Text>
                <Text style={styles.Price}>
                  $ {numberWithCommas(parseFloat(fullData?.price).toFixed(2))}
                </Text>
              </View>
              {/* {console.log("------fullData?.shippingprice-----",fullData?.shippingprice)}
              {fullData?.shippingprice === 0 ? null : (
                <View
                  style={[
                    styles.row,
                    {
                      justifyContent: "flex-start",
                      marginTop: 5,
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text style={[styles.chat_Message, { paddingRight: 5 }]}>
                    Shipping Price -
                  </Text>
                  <Text style={styles.Price}>
                    ${" "}
                    {numberWithCommas(
                      parseFloat(fullData?.shippingprice).toFixed(2)
                    )}
                  </Text>
                </View>
              )} */}
            </View>
          </View>
          <View style={{ backgroundColor: "#ededed91" }}>
            <View style={styles.chat_Inner_Wrapper}>
              <TouchableOpacity
                style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
                onPress={() => {
                  navigation.navigate("Profile", { userId: fullData?.user.id });
                }}
              >
                <Image
                  source={
                    fullData && fullData?.user?.profile_image
                      ? {
                          uri: fullData?.user?.profile_image,
                        }
                      : require("../images/defaultProfile.png")
                  }
                  style={styles.chat_Img}
                />
                <View style={{ flex: 1, padding: 12 }}>
                  <Text style={styles.chat_Name}>
                    {fullData?.user && fullData?.user.name}
                  </Text>
                  <Text style={styles.chat_Message} numberOfLines={1}>
                    Pet Owner
                  </Text>
                  <Text style={styles.lastScene} numberOfLines={1}>
                    {fullData?.user && fullData?.user.address}
                  </Text>
                </View>
              </TouchableOpacity>
              {fullData?.user?.id !== authState?.loginedUser?.id ? (
                <TouchableOpacity
                  onPress={() => {
                    handleMsg(fullData);
                  }}
                >
                  <Image
                    source={require("../images/msg.png")}
                    style={styles.chat_Img1}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.DescriptionContainer}>
            <Text style={styles.Description}>Description</Text>
            <Text style={styles.DescriptionContent}>
              {fullData?.description ? fullData?.description : null}
            </Text>
          </View>

          <View style={styles.ButtonDiv}>
            <View style={styles.buttonStyleView}>
              {!heart ? (
                <TouchableOpacity
                  onPress={() => {
                    authState.userToken
                      ? savePost(fullData?.id, setHeart)
                      : setPopup(true);
                  }}
                  style={styles.ButtonStyle}
                >
                  <Image
                    style={styles.Buttonicon}
                    source={require("../images/save.png")}
                  />
                  <Text allowFontScaling={false} style={styles.ButtonTxt}>
                    Save
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handleSave(fullData);
                  }}
                  style={styles.ButtonStyle}
                >
                  <Image
                    style={styles.Buttonicon}
                    source={require("../images/save.png")}
                  />
                  <Text allowFontScaling={false} style={styles.ButtonTxt}>
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!(authState?.loginedUser?.id == fullData?.user?.id) ? (
              <View style={styles.buttonStyleView}>
                <TouchableOpacity
                  style={styles.ButtonStyle}
                  onPress={() => {
                    handleReport(fullData);
                  }}
                >
                  <Image
                    style={styles.Buttonicon}
                    source={require("../images/flag.png")}
                  />
                  <Text allowFontScaling={false} style={styles.ButtonTxt}>
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.buttonStyleView}>
              <TouchableOpacity
                style={styles.ButtonStyle}
                onPress={() => handleShare(fullData?.id)}
              >
                <Image
                  style={styles.Buttonicon}
                  source={require("../images/share.png")}
                />
                <Text allowFontScaling={false} style={styles.ButtonTxt}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {latitude && longitude ? (
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              >
              </MapView>
            </View>
          ) : null}
        </ScrollView>
      </View>
      {!(authState?.loginedUser?.id == fullData?.user?.id) ? (
        <View style={styles.bottomStyle}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleMsg(fullData);
              }}
              style={styles.bottomStyleButton}
            >
              <Text style={styles.bottomBtnTxt}>Contact Seller</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <MakeAnOfferModal
        makeOfferModal={makeOfferModal}
        setMakeOfferModal={setMakeOfferModal}
        petActualPrice={petActualPrice}
      />
      {showLoader()}
      <CustomLoginPopup
        toggle={popup}
        setPopup={setPopup}
        name="Access Denied"
        btnName1="Cancel"
        btnName2="Login"
        alertText="Please login to access this funcationality."
        btn2Action={() => navigation.navigate("SignIn")}
      />

      <Modal
        animationType={"slide"}
        transparent={true}
        visible={modalDelete}
        onRequestClose={() => {
          setModalDelete(false);
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setModalDelete(false);
          }}
          style={styles.modal_Backdrop_delete}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modal_Main_Wrap_delete}>
              <>
                <Text style={styles.chat_Name}>
                  {openModal == "delete_post"
                    ? "Delete This Post"
                    : "Block This User"}
                </Text>
                <Text
                  style={{
                    width: wp("75%"),
                    textAlign: "center",
                    paddingTop: hp("2.5%"),
                    fontSize: wp("4%"),
                    marginBottom: 10,
                  }}
                >
                  This can't revert.
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-between",
                    width: wp("78%"),
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setModalDelete(false);
                    }}
                    style={[
                      styles.bottomStyleButton,
                      {
                        width: wp("35%"),
                        backgroundColor: fontMediumTextColor,
                      },
                    ]}
                  >
                    <Text style={[styles.bottomBtnTxt, { color: "#000" }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.bottomStyleButton, { width: wp("35%") }]}
                  >
                    <Text
                      style={styles.bottomBtnTxt}
                      onPress={() => {
                        console.log("delete post", openModal);
                        if (openModal == "delete_post") {
                          deletePost(fullData.id, navigation);
                        } else {
                          blockUser(fullData.user.id, navigation);
                        }
                      }}
                    >
                      {openModal == "delete_post" ? "Delete" : "Block"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonStyleView: {
    elevation: 5,
    backgroundColor: "#d1d1d1",
    borderRadius: 5,
    width: wp("25%"),
    height: hp("4%"),
    justifyContent: "center",
    marginHorizontal: wp("2.2%"),
  },
  bottomStyleButton: {
    justifyContent: "center",
    alignContent: "center",
    paddingHorizontal: 20,
    backgroundColor: themeColor,
    height: hp("7%"),
    borderRadius: 10,
  },
  bottomThemeStyleButton: {
    justifyContent: "center",
    alignContent: "center",
    width: wp("40%"),
    borderColor: themeColor,
    borderWidth: 2,
    height: hp("7%"),
    borderRadius: 10,
  },
  bottomStyle: {
    paddingTop: hp("2%"),
    position: "absolute",
    width: wp("100%"),
    height: hp("15%"),
    backgroundColor: "#F0F8FF",
    shadowColor: "#0000001F",
    marginTop: hp("85%"),
    // marginLeft: 0.5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bottomBtnTxt: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontBold,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
  },
  bottomThemeBtnTxt: {
    color: themeColor,
    fontSize: 18,
    fontFamily: fontBold,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  ButtonTxt: {
    fontSize: wp("4%"),
    fontFamily: fontRegular,
    alignSelf: "center",
  },
  Buttonicon: {
    height: wp("6%"),
    width: wp("5%"),
    resizeMode: "contain",
    alignSelf: "center",
  },
  ButtonDiv: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: wp("3%"),
    paddingBottom: wp("4%"),
  },
  ButtonStyle: {
    flexDirection: "row",

    justifyContent: "space-around",
  },
  BorderRight: {
    width: 2,
    // borderColor: fontMediumTextColor3,
    alignSelf: "center",
    height: hp("2%"),
    backgroundColor: fontMediumTextColor3,
  },
  Price: {
    fontSize: wp("5%"),
    fontFamily: fontRegular,
    fontFamily: fontBold,
    fontWeight: "bold",
    alignSelf: "center",
  },
  TextGray: {
    fontSize: wp("3.5%"),
    fontFamily: fontRegular,
    color: fontMediumTextColor2,
    alignItems: "center",
    paddingRight: wp("0.5%"),
    alignSelf: "center",
  },
  TextBlue: {
    fontSize: wp("3.5%"),
    fontFamily: fontRegular,
    color: themeColor,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  PetName: {
    fontSize: wp("4.8%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: fontMediumTextColor3,
    paddingBottom: hp("2%"),
  },
  Description: {
    fontSize: wp("4%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: fontMediumTextColor3,
    paddingBottom: hp("2%"),
  },
  DescriptionContent: {
    fontSize: wp("4%"),
    fontFamily: fontRegular,
    lineHeight: 23,
    color: fontMediumTextColor3,
    paddingBottom: hp("2%"),
  },
  chat_Inner_Wrapper: {
    paddingVertical: wp("2%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chat_Img: {
    height: hp("7%"),
    width: hp("7%"),
    resizeMode: "cover",
  },

  headerIcon: {
    height: hp("8%"),
    width: wp("14%"),
  },
  chat_Img1: {
    height: hp("4.5%"),
    width: hp("4.5%"),
    resizeMode: "cover",
  },
  chat_Name: {
    color: themeColor,
    fontSize: wp("4.5%"),
    fontWeight: "bold",
  },
  chat_Message: {
    fontFamily: fontBold,
    color: "#000000",
    paddingRight: 40,
    fontWeight: "bold",
  },
  lastScene: {
    fontFamily: fontBold,
    color: fontMediumTextColor2,
    paddingRight: 40,
    paddingTop: 5,
  },
  modal_Backdrop: {
    flex: 1,
    backgroundColor: "#00000091",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modal_Main_Wrap: {
    width: wp("100%"),
    height: hp("50%"),
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  modal_Header: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 5,
  },
  DescriptionContainer: {
    paddingVertical: hp("3%"),
    paddingHorizontal: wp("4%"),
    // flex: 1
  },
  container: {
    paddingVertical: hp("3%"),
    paddingHorizontal: wp("4%"),
  },
  mapContainer: {
    marginBottom: Platform.OS === "ios" ? hp(16) : hp(14),
    // paddingBottom: hp("3%"),
    height: hp(30),
    width: wp(90),
    justifyContent: "center",
    alignSelf: "center",
  },
  icon: {
    height: wp("8%"),
    width: wp("7%"),
    resizeMode: "contain",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  about: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  mainContainer: {
    backgroundColor: "#fff",
    height: "88%"
  },
  modal_Backdrop_delete: {
    flex: 1,
    backgroundColor: "#00000091",
    paddingTop: hp("20%"),
    alignItems: "center",
    // justifyContent: 'center'
  },
  modal_Main_Wrap_delete: {
    paddingTop: hp("4%"),
    width: wp("90%"),
    // height: hp('30%'),
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "column",
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderRadius: 20,
    paddingBottom: hp(11),
  },
  accordian_Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
    marginBottom: 15,
  },
  txtStyle1: {
    fontFamily: fontBold,
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: themeColor,
  },
  txtStyle2: {
    fontFamily: fontLight,
    color: fontMediumTextColor2,
    fontSize: wp("4.3%"),
    fontWeight: "bold",
  },

  offerPriceWrapper: {
    borderWidth: 2,
    borderColor: themeColor,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginVertical: 10,
    marginHorizontal: 3,
    width: wp("22%"),
    justifyContent: "center",
    alignItems: "center",
  },
  headerIconArrow: {
    height: hp("3%"),
    width: wp("4%"),
    resizeMode: "contain",
    transform: [{ rotate: "180deg" }],
  },
  offerPriceText: {
    color: themeColor,
    fontWeight: "bold",
    fontSize: wp("4.3%"),
  },
  makeOwnOffer: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    width: wp("80%"),
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  makeOwnOfferText: {
    fontSize: wp("9%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  makeOwnOfferInput: {
    borderWidth: 0,
    fontSize: wp("8.5%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    paddingVertical: 5,
    maxWidth: wp("50%"),
    color: "#000",
  },
  txtStyle2: {
    fontFamily: fontLight,
    color: fontMediumTextColor2,
    fontSize: wp("4.3%"),
    fontWeight: "bold",
  },
  report_List_Wrap: {
    flex: 1,
  },
  report_List_Image: {
    height: hp("3.4%"),
    width: hp("3.4%"),
    marginRight: wp("5%"),
  },
  report_List_View: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("3%"),
  },
  report_List_Text: {
    color: "#000",
    fontFamily: fontBold,
    fontWeight: "bold",
    fontSize: wp("5.5%"),
  },
  btnStyle: {
    backgroundColor: themeColor,
    width: wp("50%"),
    height: 40,
    justifyContent: "center",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 30,
  },
  btnTxtStyle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: fontBold,
    fontWeight: "bold",
    fontSize: wp("6%"),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    backgroundColor: "white",
    marginTop: 8,
    marginLeft: 8,
  },
});

export default PostScreen;

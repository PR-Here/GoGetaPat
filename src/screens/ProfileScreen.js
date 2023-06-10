/** @format */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ToastAndroid,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  fetchMoreUserPost,
  fetchUserDetail,
  followApi,
  RatingUser,
  unfollowApi,
} from "../services/api";

import {
  fontBold,
  fontLight,
  fontSemiBold,
  themeColor,
  fontMediumTextColor,
  fontMediumTextColor2,
  headerColor,
} from "../common/common";
// import PetList from '../subcomponents/PetList';
import customToastMsg from "../subcomponents/CustomToastMsg";
import {
  fetchUserBought,
  fetchUserPost,
  fetchUserSold,
  reportUser,
} from "../services/api";
import { useHomeDispatch, useHomeState } from "../contexts/HomeContext";
import PetListPro from "../subcomponents/PetListPro";
import { dateFormat } from "../common/helper";
import { useAuthState } from "../contexts/authContext";

const activeStar = require("../images/star-active.png");
const inActiveStar = require("../images/star-inactive.png");

const active_Star = require("../images/star_active.png");
const inActive_Star = require("../images/star_inactive.png");

const ReportModal = ({
  reportModal,
  setReportModal,
  setFilterReportModal,
  setRateProfile,
  follow,
  setfollow,
  user_id,
  reported,
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
                <TouchableOpacity
                  style={[styles.report_List_View, { flexDirection: "row" }]}
                >
                  <Image
                    source={require("../images/follow.png")}
                    style={styles.report_List_Image}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.report_List_Text}>Follow</Text>
                  </View>
                  {follow ? (
                    <TouchableOpacity
                      onPress={() => {
                        unfollowApi(user_id, setfollow);
                        customToastMsg("You unfollowed this profile");
                      }}
                    >
                      <Image
                        source={require("../images/toggel-on.png")}
                        style={styles.cateRatio}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        followApi(user_id, setfollow);
                        customToastMsg("You followed this profile");
                      }}
                    >
                      <Image
                        source={require("../images/toggel-off.png")}
                        style={[styles.cateRatio, { marginRight: wp("1.8%") }]}
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ) : null}

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
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FilterReportModal = ({
  filterReportModal,
  setFilterReportModal,
  setThankYouModal,
  id,
  homeState,
  userData,
  setUserData,
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
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontWeight: "bold",
                    fontSize: wp("5.5%"),
                  }}
                >
                  Filter
                </Text>
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
                  Why are you reporting this profile?
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setFilterReportModal(!filterReportModal);
                  setThankYouModal(true);
                  reportUser(id, "It's spam").then(() => {
                    fetchUserDetail(id).then((res) => {
                      setUserData(res.data);
                    });
                  });
                }}
                style={{ paddingBottom: 15 }}
              >
                <Text style={{ fontSize: wp("4.5%") }}>It's spam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFilterReportModal(!filterReportModal);
                  setThankYouModal(true);
                  reportUser(id, "It's inappropriate").then(() => {
                    fetchUserDetail(id).then((res) => {
                      setUserData(res.data);
                    });
                  });
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

const RateProfile = ({
  rateProfile,
  setRateProfile,
  id,
  homeState,
  userData,
  setUserData,
  setRated,
}) => {
  const [starRating, setStarRating] = useState(0);
  const [stars, setStars] = useState([
    "star_inactive.png",
    "star_inactive.png",
    "star_inactive.png",
    "star_inactive.png",
    "star_inactive.png",
  ]);

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={rateProfile}
      onRequestClose={() => {
        setRateProfile(!rateProfile);
      }}
    >
      <View style={[styles.modal_Backdrop, { justifyContent: "center" }]}>
        <View
          style={[
            styles.modal_Main_Wrap,
            {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderRadius: 20,
              width: wp("90%"),
              height: hp("37%"),
            },
          ]}
        >
          <View style={{ paddingHorizontal: wp("4%"), flex: 1 }}>
            <View style={styles.report_List_Wrap}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: fontBold,
                    fontWeight: "bold",
                    fontSize: wp("5.5%"),
                  }}
                >
                  Rate Profile
                </Text>
              </View>
              <View>
                {userData?.rated ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      paddingVertical: hp("3%"),
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: fontBold,
                        fontWeight: "bold",
                        fontSize: wp("5.5%"),
                      }}
                    >
                      You Already Rated This Profile!!
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      paddingVertical: hp("3%"),
                    }}
                  >
                    {stars.map((currentValue, index) => {
                      if (index < starRating) {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              setStarRating(index + 1);
                            }}
                          >
                            <Image
                              source={active_Star}
                              style={[
                                styles.strRat,
                                {
                                  marginHorizontal: wp("2%"),
                                  height: hp("5%"),
                                  width: hp("5%"),
                                },
                              ]}
                            />
                          </TouchableOpacity>
                        );
                      }
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setStarRating(index + 1);
                          }}
                        >
                          <Image
                            source={inActive_Star}
                            style={[
                              styles.strRat,
                              {
                                marginHorizontal: wp("2%"),
                                height: hp("5%"),
                                width: hp("5%"),
                              },
                            ]}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {userData?.rated ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: hp("2%"),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setRateProfile(!rateProfile);
                      }}
                      style={{
                        paddingVertical: wp("3%"),
                        paddingHorizontal: wp("7.5%"),
                        backgroundColor: "#bbb",
                        borderRadius: 8,
                        marginHorizontal: wp("3%"),
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: wp("4.5%"),
                          fontWeight: "bold",
                          fontFamily: fontBold,
                        }}
                      >
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: hp("2%"),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setRateProfile(!rateProfile);
                      }}
                      style={{
                        paddingVertical: wp("3%"),
                        paddingHorizontal: wp("7.5%"),
                        backgroundColor: "#bbb",
                        borderRadius: 8,
                        marginHorizontal: wp("3%"),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: wp("4.5%"),
                          fontWeight: "bold",
                          fontFamily: fontBold,
                        }}
                      >
                        Not Now
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        elevation: 10,
                        paddingVertical: wp("3%"),
                        paddingHorizontal: wp("7.5%"),
                        backgroundColor: themeColor,
                        borderRadius: 8,
                        marginHorizontal: wp("3%"),
                      }}
                      onPress={() => {
                        RatingUser(id, starRating);
                        setRateProfile(!rateProfile);
                        fetchUserDetail(id).then((res) => {
                          setUserData(res.data);
                          setRated(res.data.rated);
                        });
                      }}
                    >
                      <Text
                        style={{
                          fontSize: wp("4.5%"),
                          fontWeight: "bold",
                          fontFamily: fontBold,
                          color: "#fff",
                        }}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
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

const ProfileScreen = ({ navigation, route }) => {
  console.log("6kkt", route.params);
  let homeState = useHomeState();
  let homeDispatch = useHomeDispatch();
  let authState = useAuthState();
  const [stars, setStars] = useState([
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
  ]);

  const [reportModal, setReportModal] = useState(false);
  const [rateProfile, setRateProfile] = useState(false);
  const [filterReportModal, setFilterReportModal] = useState(false);
  const [thankYouModal, setThankYouModal] = useState(false);
  const [bought, setBought] = useState();
  const [sold, setSold] = useState();
  const [follow, setFollow] = useState();
  const [userData, setUserData] = useState();
  const [rated, setRated] = useState();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      fetchUserPost(route.params.userId, homeDispatch);
      fetchUserBought(route.params.userId, setBought);
      fetchUserSold(route.params.userId, setSold);
      // followApi(route.params.userId, setFollow)

      // setFollow(homeState?.profilePost[0]?.user.follows)

      await fetchUserDetail(route.params.userId).then((res) => {
        setFollow(res.data.follows);
        setUserData(res.data);
        setRated(res.data.rated);
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.mainContainer}>
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
        <View style={styles.top_HeaderRight}>
          <Text style={styles.top_HeaderText}>{route.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.go_Back_Icon}
          onPress={() => {
            authState?.userToken
              ? setReportModal(true)
              : Alert.alert("Please Login First");
          }}
        >
          <Image
            source={require("../images/3dot-icon.png")}
            style={{ width: wp("6%") }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content_view}>
        <View style={styles.sec_padding}>
          <View style={styles.chat_Inner_Wrapper}>
            <Image
              source={
                userData?.profile_image
                  ? {
                      uri: homeState?.profilePost[0]?.user.profile_image,
                    }
                  : require("../images/defaultProfile.png")
              }
              style={styles.profile_Img}
            />

            {/* <Image source={require("../images/img-for-chat.png")} style={styles.profile_Img} /> */}

            <View style={styles.wrp}>
              <Text style={styles.profile_Name}>{userData?.name}</Text>
              <Text style={styles.profile_Text} numberOfLines={1}>
                {dateFormat(userData?.joined)}
              </Text>
              <Text style={styles.profile_Text} numberOfLines={1}>
                {userData?.address}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {stars.map((currentValue, index) => {
                  if (index < userData?.user_rating) {
                    return (
                      <Image
                        key={index}
                        source={activeStar}
                        style={styles.strRat}
                      />
                    );
                  }
                  return (
                    <Image
                      key={index}
                      source={inActiveStar}
                      style={styles.strRat}
                    />
                  );
                })}
                <Text style={styles.Rating}>
                  ({userData?.user_rating_count})
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.border_Bottom_1}></View>
        <View style={styles.selling_Counts_Wraper}>
          <View style={styles.count_Main}>
            <Text style={styles.count_Number}>{bought}</Text>
            <Text style={styles.count_Text}>Bought</Text>
          </View>
          <View style={styles.count_Main}>
            <Text style={styles.count_Number}>{sold}</Text>
            <Text style={styles.count_Text}>Sold</Text>
          </View>
          <View style={styles.count_Main}>
            <Text style={styles.count_Number}>
              {homeState?.profilePost[0]?.user.user_followers_count}
            </Text>
            <Text style={styles.count_Text}>Followers</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={[styles.sec_padding, { marginTop: 0 }]}>
            <Text
              style={{
                fontFamily: fontSemiBold,
                fontWeight: "bold",
                fontSize: wp("4.7%"),
                marginBottom: 10,
              }}
            >
              Items for this seller
            </Text>
          </View>
          <PetListPro
            navigation={navigation}
            fetchMoreUserPost={fetchMoreUserPost}
            id={route.params.userId}
          />
        </View>
      </View>
      <ReportModal
        reportModal={reportModal}
        user_id={route.params.userId}
        setReportModal={setReportModal}
        setFilterReportModal={setFilterReportModal}
        setRateProfile={setRateProfile}
        follow={follow}
        setfollow={setFollow}
        reported={userData?.reported}
      />
      <RateProfile
        rateProfile={rateProfile}
        setRateProfile={setRateProfile}
        id={route.params.userId}
        homeState={homeState}
        userData={userData}
        setUserData={setUserData}
        setRated={setRated}
      />
      <FilterReportModal
        filterReportModal={filterReportModal}
        setFilterReportModal={setFilterReportModal}
        setThankYouModal={setThankYouModal}
        id={route.params.userId}
        homeState={homeState}
        userData={userData}
        setUserData={setUserData}
      />
      <ThankYouModal
        thankYouModal={thankYouModal}
        setThankYouModal={setThankYouModal}
        setFilterReportModal={setFilterReportModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cateRatio: {
    height: hp("6%"),
    width: hp("8.5%"),
    resizeMode: "cover",
  },
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1,
    // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
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
    height: hp("9%"),
    width: wp("16%"),
    marginTop: hp("0.5%"),
  },
  content_view: {
    flex: 1,
    alignContent: "center",
  },
  top_Header: {
    paddingVertical: 12,
    paddingHorizontal: wp("4.5%"),
    justifyContent: "space-between",
    backgroundColor: headerColor,
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
    color: themeColor,
  },

  sec_padding: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 13,
    marginHorizontal: wp("4%"),
  },
  Rating: {
    paddingLeft: 5,
    paddingTop: wp("0.80%"),
    color: fontMediumTextColor,
  },
  strRat: {
    height: wp("7%"),
    width: wp("4%"),
    resizeMode: "contain",
  },
  wrp: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    marginLeft: wp("5%"),
  },
  chat_Inner_Wrapper: {
    paddingTop: 10,
    paddingBottom: 4,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    marginBottom: 7,
  },
  border_Bottom_1: {
    borderBottomColor: "#24242422",
    borderBottomWidth: 1,
  },
  profile_Img: {
    height: hp("12%"),
    width: hp("12%"),
    resizeMode: "cover",
  },
  profile_Name: {
    color: "#000000",
    fontSize: wp("4.7%"),
    fontWeight: "bold",
  },
  profile_Text: {
    color: "#000000",
    fontSize: wp("3.6%"),
  },
  selling_Counts_Wraper: {
    flexDirection: "row",
    paddingVertical: hp("3%"),
    paddingHorizontal: wp("2%"),
    justifyContent: "space-around",
  },
  count_Main: {
    justifyContent: "center",
    alignItems: "center",
  },
  count_Number: {
    color: themeColor,
    fontFamily: fontBold,
    fontWeight: "bold",
  },
  count_Text: {
    color: fontMediumTextColor2,
    fontFamily: fontBold,
    fontWeight: "bold",
  },

  modal_Backdrop: {
    flex: 1,
    backgroundColor: "#00000091",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modal_Main_Wrap: {
    width: wp("100%"),
    height: hp("60%"),
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modal_Main_Wrap2: {
    width: wp("100%"),
    height: hp("30%"),
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
});

export default ProfileScreen;

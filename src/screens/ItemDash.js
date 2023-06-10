/** @format */

import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  fontBold,
  fontLight,
  fontMediumTextColor,
  fontMediumTextColor2,
  fontMediumTextColor3,
  fontRegular,
  headerColor,
  themeColor,
} from "../common/common";
import { useAuthDispatch, useAuthState } from "../contexts/authContext";
import { markArchiveRes, markDelRes, markSoldRes } from "../services/api";

const petData = {
  Img: require("../images/img3.png"),
  Name: "Dr. Lisa Sparks",
  Description:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.",
  PetName: "British Shorthair",
  Sex: "Male",
  Age: "8 months",
  Weight: "15 lbs",
  Cost: "30",
  UserId: 1,
  LastActive: "1 Hour ago",
  Location: "London",
  Price: "$5,000",
};

const ItemDash = ({ navigation, route }) => {
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalArchive, setModalArchive] = useState(false);

  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    console.log(modal);
  }, [modal]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.top_Header}>
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
        <View style={styles.top_HeaderRight}>
          <Text allowFontScaling={false} style={styles.top_HeaderText}>
            Item Dashboard
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Archived");
          }}
        >
          <Text allowFontScaling={false} style={styles.top_HeaderText1}>
            Archived
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate({
              name: "Post",
              params: { id: route?.params?.itemData?.id },
            });
          }}
        >
          <View style={styles.chat_Inner_Wrapper}>
            <Image
              source={{ uri: route.params.itemData?.cover_image[0].image_url }}
              style={styles.chat_Img}
            />
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text style={styles.chat_Name}>
                {route.params.itemData?.title}
              </Text>
              <Text style={styles.chat_Name} numberOfLines={1}>
                $ {route.params.itemData?.price}
              </Text>
              {/* <Text style={styles.chat_Message} numberOfLines={1}>{petData.LastActive}</Text> */}
            </View>
            <Image
              source={require("../images/arrow-right.png")}
              style={styles.chat_Img1}
            />
          </View>
        </TouchableOpacity>
        <View style={{ paddingHorizontal: wp("5%") }}>
          {authState.hasOwnProperty("loginedUser") ? (
            authState.loginedUser ? (
              authState.loginedUser.hasOwnProperty("blocked") ? (
                authState.loginedUser.blocked ? (
                  <TouchableOpacity
                    style={styles.ButtonStyle}
                    onPress={() => {
                      navigation.navigate("Post Item", {
                        true: true,
                        itemData: route.params.itemData,
                      });
                    }}
                  >
                    <Image
                      style={styles.Buttonicon}
                      source={require("../images/edit.png")}
                    />
                    <Text style={styles.ButtonTxt}>Edit Post</Text>
                  </TouchableOpacity>
                ) : null
              ) : null
            ) : null
          ) : null}

          <View style={{ alignContent: "space-between" }}>
            {route.params.itemData.status == "Sold" ? null : (
              <TouchableOpacity
                style={styles.bottomStyleButton}
                onPress={() => {
                  setModal(true);
                }}
              >
                <Text style={styles.bottomBtnTxt}>Mark sold</Text>
              </TouchableOpacity>
            )}
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              {route.params.itemData.status == "Archive" ? null : (
                <TouchableOpacity
                  style={[styles.bottomStyleButton, { width: "45%" }]}
                  onPress={() => {
                    setModalArchive(true);
                  }}
                >
                  <Text style={styles.bottomBtnTxt}>Archive</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.bottomStyleButton, { width: "45%" }]}
                onPress={() => {
                  setModalDelete(true);
                }}
              >
                <Text style={styles.bottomBtnTxt}>Delete</Text>
              </TouchableOpacity>
            </View>

            {/* <TouchableOpacity style={styles.More} >
                            <Image source={require("../images/3dot-icon-dark.png")} style={{ resizeMode: "contain", width: wp("5%") }} />
                        </TouchableOpacity> */}
          </View>
        </View>
        {/* <View style={styles.chat_Inner_Wrapper1}>
                    <Image style={styles.Buttonicon} source={require('../images/performance.png')} />
                    <Text style={styles.ButtonTxt}>Item Performance</Text>
                    <Image source={require('../images/arrow-right.png')} style={styles.chat_Img1} />

                </View> */}
        <View style={styles.brd} />

        {/* <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'center',
            paddingTop: hp('5%'),
          }}>
          <Text style={styles.chat_Name}> You have no messages</Text>
          <Text style={[styles.chat_Message1, { paddingTop: hp('3%') }]}>
            {' '}
            When people ask or make offers.You'll{' '}
          </Text>
          <Text style={styles.chat_Message1}> get their messages here</Text>
        </View> */}
      </KeyboardAwareScrollView>
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setModal(false);
          }}
          style={styles.modal_Backdrop}
        >
          <View style={styles.modal_Main_Wrap}>
            <Text style={styles.chat_Name}>Mark Pet as sold</Text>
            <Text
              style={{
                width: wp("75%"),
                textAlign: "center",
                paddingTop: hp("2.5%"),
                fontSize: wp("4%"),
              }}
            >
              This can't be canceled. Only do this if you've actually sold the
              pet elsewhere, continue?
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
                  setModal(false);
                }}
                style={[
                  styles.bottomStyleButton,
                  { width: wp("35%"), backgroundColor: fontMediumTextColor },
                ]}
              >
                <Text style={[styles.bottomBtnTxt, { color: "#000" }]}>
                  Continue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomStyleButton, { width: wp("35%") }]}
              >
                <Text
                  style={styles.bottomBtnTxt}
                  onPress={() => {
                    markSoldRes(route?.params?.itemData?.id).then((res) => {
                      if (res) {
                        route.params.setMark(true);
                      }
                    });
                    navigation.goBack();
                  }}
                >
                  Mark Sold
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
          style={styles.modal_Backdrop}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modal_Main_Wrap}>
              <>
                <Text style={styles.chat_Name}>Delete This Listing</Text>
                <Text
                  style={{
                    width: wp("75%"),
                    textAlign: "center",
                    paddingTop: hp("2.5%"),
                    fontSize: wp("4%"),
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
                      Continue
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.bottomStyleButton, { width: wp("35%") }]}
                  >
                    <Text
                      style={styles.bottomBtnTxt}
                      onPress={() => {
                        markDelRes(route?.params?.itemData?.id).then((res) => {
                          if (res) {
                            authDispatch({
                              type: "SIGN_IN_USER",
                              loginedUser: {
                                ...authState.loginedUser,
                                post_count:
                                  Number(authState.loginedUser.post_count) - 1,
                              },
                            });
                          }
                        });
                        navigation.goBack();
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          </TouchableWithoutFeedback>
          {/* </ScrollView> */}
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={modalArchive}
        onRequestClose={() => {
          setModalDelete(false);
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setModalDelete(false);
          }}
          style={styles.modal_Backdrop}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modal_Main_Wrap}>
              <>
                <Text style={styles.chat_Name}>Archive This Listing</Text>
                <Text
                  style={{
                    width: wp("75%"),
                    textAlign: "center",
                    paddingTop: hp("2.5%"),
                    fontSize: wp("4%"),
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
                      Continue
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.bottomStyleButton, { width: wp("35%") }]}
                  >
                    <Text
                      style={styles.bottomBtnTxt}
                      onPress={() => {
                        markArchiveRes(route?.params?.itemData?.id).then(
                          (res) => {
                            if (res) {
                              navigation.goBack();
                            }
                          }
                        );
                      }}
                    >
                      Archive
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
  bottomBtnTxt: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontBold,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  modal_Backdrop: {
    flex: 1,
    backgroundColor: "#00000091",
    paddingTop: hp("20%"),
    alignItems: "center",
    // justifyContent: 'center'
  },
  modal_Main_Wrap: {
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

  brd: {
    paddingTop: 7,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },

  bottomStyleButton: {
    marginTop: hp("2%"),
    justifyContent: "center",
    alignContent: "center",
    width: wp("90%"),
    backgroundColor: themeColor,
    height: hp("6%"),
    borderRadius: 7,
  },

  ButtonTxt: {
    flex: 1,
    fontSize: wp("4%"),
    fontFamily: fontRegular,
    color: themeColor,
    paddingHorizontal: 12,
    alignSelf: "center",
  },
  Buttonicon: {
    height: wp("6%"),
    width: wp("5%"),
    resizeMode: "contain",
    alignSelf: "center",
  },
  ButtonStyle: {
    borderRadius: 5,

    height: hp("4%"),
    flexDirection: "row",

    justifyContent: "space-around",
  },

  chat_Inner_Wrapper: {
    paddingTop: hp("10%"),
    flexDirection: "row",
    alignContent: "center",
    paddingBottom: wp("2%"),
    paddingHorizontal: wp("5%"),
  },

  chat_Img: {
    height: hp("8%"),
    width: hp("8%"),
    resizeMode: "cover",
  },
  chat_Img1: {
    height: hp("3%"),
    alignSelf: "center",
    resizeMode: "contain",
  },

  chat_Name: {
    color: fontMediumTextColor3,
    fontSize: wp("4.5%"),
    fontWeight: "bold",
  },

  chat_Message: {
    fontFamily: fontLight,
    color: fontMediumTextColor2,
    paddingRight: wp("30"),
    fontWeight: "bold",
  },
  chat_Message1: {
    color: fontMediumTextColor2,
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  headerIcon: {
    height: hp("8%"),
    width: wp("14%"),
    resizeMode: "cover",
  },
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 20 : 0,
  },
  top_Header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("3.5%"),
    backgroundColor: headerColor,
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
  top_HeaderText1: {
    fontSize: wp("4%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: themeColor,
  },
});

export default ItemDash;

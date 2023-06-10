/** @format */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { TouchableOpacity } from "react-native-gesture-handler";
import {
  enableVisibility,
  disableVisibility,
  fetchUserDetail,
} from "../services/api";
import { useAuthState, useAuthDispatch } from "../contexts/authContext";
import { Loader } from "../subcomponents/Loader";

import {
  fontBold,
  fontRegular,
  fontSemiBold,
  grayBorderColor,
  themeColor,
  headerColor,
} from "../common/common";
import customToastMsg from "../subcomponents/CustomToastMsg";
const PubPri = ({ navigation }) => {
  let authState = useAuthState();
  let dispatch = useAuthDispatch();
  let initial = "";
  let id = authState.loginedUser.id;
  if (authState.loginedUser.visibility.toLowerCase() == "public") {
    initial = true;
  } else {
    initial = false;
  }

  const [visible, setVisible] = useState(initial);
  const [load, setLoad] = useState(false);

  const showLoader = () => {
    if (load) {
      return <Loader />;
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.top_Header}>
        <View style={{ flex: 1 }}>
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
        </View>
        <View style={styles.top_HeaderRight}>
          <Text allowFontScaling={false} style={styles.top_HeaderText}>
            Profile
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}></View>
      </View>
      <View style={[styles.content_view]}>
        <Text allowFontScaling={false} style={styles.TextWht}>
          Who can see your post?
        </Text>
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              visible
                ? customToastMsg("Already set as Public")
                : enableVisibility(setVisible, dispatch, id);
            }}
          >
            <View style={styles.radio_Wrapper}>
              <View style={styles.radio_Outer}>
                {visible ? <View style={styles.radio_Selected} /> : null}
              </View>
              <Image
                source={require("../images/view.png")}
                style={styles.eyeIcon}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.radio_Text}>Public</Text>
                <Text style={styles.radio_Text_sub}>Everyone</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.border_btm} />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              visible
                ? disableVisibility(setVisible, dispatch, id)
                : customToastMsg("Already set as Private");
            }}
          >
            <View style={styles.radio_Wrapper}>
              <View style={styles.radio_Outer}>
                {visible ? null : <View style={styles.radio_Selected} />}
              </View>
              <Image
                source={require("../images/hide.png")}
                style={styles.eyeIcon}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.radio_Text}>Private</Text>
                <Text style={styles.radio_Text_sub}>Only you</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.border_btm} />
        </View>
      </View>
      {showLoader()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  border_btm: {
    marginTop: 10,
    backgroundColor: grayBorderColor,
    width: wp("90%"),
    height: 2,
    marginBottom: wp("4.5%"),
  },
  radio_Outer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: themeColor,
    alignItems: "center",
    justifyContent: "center",
  },
  radio_Selected: {
    height: 15,
    width: 15,
    borderRadius: 7,
    backgroundColor: themeColor,
  },
  radio_Wrapper: {
    flexDirection: "row",
    paddingVertical: 7,
    alignItems: "center",
  },
  radio_Text: {
    color: "#000",
    fontFamily: fontBold,
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: wp("5%"),
  },
  radio_Text_sub: {
    color: "#000",
    fontFamily: fontSemiBold,
    // fontWeight: '500',
    marginLeft: 10,
    fontSize: wp("4.5%"),
  },
  top_HeaderRight: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  top_HeaderText: {
    fontSize: wp("6%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: themeColor,
  },
  headerIcon: {
    height: hp("8%"),
    width: wp("14%"),
  },
  eyeIcon: {
    height: hp("5%"),
    width: hp("5%"),
    resizeMode: "contain",
    marginLeft: wp("3%"),
  },
  content_view: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: wp("7.5%"),
    alignItems: "flex-start",
    flexDirection: "column",
    paddingHorizontal: wp("5%"),
  },

  top_Header: {
    paddingHorizontal: wp("4%"),
    paddingVertical: 0,
    justifyContent: "space-between",
    backgroundColor: headerColor,
    flexDirection: "row",
    alignItems: "center",
  },

  TextWht: {
    marginBottom: hp("3%"),
    fontSize: wp("6.5%"),
    fontWeight: "bold",
    fontFamily: fontRegular,
    color: "#000",
    // paddingLeft: wp("2%"),
    textAlign: "center",
    lineHeight: 30,
  },
});

export default PubPri;

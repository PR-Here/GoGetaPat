/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  Modal,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { FloatingLabelInput } from "react-native-floating-label-input";

import {
  themeColor,
  fontMediumTextColor,
  fontMedium,
  fontBold,
  fontMediumTextColor3,
  fontMediumTextColor2,
  textInputBorderColor,
} from "../common/common";
import { useAuthDispatch, useAuthState } from "../contexts/authContext";
import { TextInput } from "react-native-gesture-handler";
import { fetchUserDetail, updateProfileName } from "../services/api";
import {
  useProfileDispatch,
  useProfileState,
} from "../contexts/profileContext";
const lables = {
  fontSizeFocused: wp("3.5%"),
  fontSizeBlurred: wp("4.5%"),
  colorFocused: fontMediumTextColor3,
  colorBlurred: fontMediumTextColor2,
};
const inputStyles = {
  paddingTop: 15,
  paddingBottom: 5,
  fontSize: wp("4.5%"),
};
const UpdateProfileScreen = ({ navigation }) => {
  // const dispatch = useAuthDispatch();
  const authState = useAuthState();
  const profileState = useProfileState();
  const authDispatch = useAuthDispatch();
  const profileDispatch = useProfileDispatch();

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = useState({
    error: false,
    attrname: "",
  });

  useEffect(() => {
    if (authState.hasOwnProperty("loginedUser")) {
      if (!authState?.loginedUser?.name_confirmed) {
        setName(authState?.loginedUser?.name);
      }
    }
  }, [authState]);

  const updateName = async () => {
    if (authState.hasOwnProperty("loginedUser")) {
      if (!authState.loginedUser.name_confirmed) {
        let x = await updateProfileName(name, authDispatch);
      }
    }
  };

  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={profileState.updateProfile}
      onRequestClose={() => {
        setShowModal(!showModal);
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000091",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: wp("93%"),
            backgroundColor: "white",
            paddingHorizontal: 8,
            paddingVertical: 30,
            borderRadius: 20,
          }}
        >
          <View style={{ alignItems: "center", paddingHorizontal: wp("10%") }}>
            {/* <Image source={require("../images/mail_send.png")} style={{ width: wp('30%'), height: hp("20%"), resizeMode: "contain", marginBottom: 20 }} /> */}

            <Text style={styles.txtStyle}>Confirm Profile Name</Text>
            <Text style={{ ...styles.txtStyle1, textAlign: "center" }}>
              This is only for one time you have to provide this information.
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                // paddingLeft: wp(10)
              }}
            >
              <Text
                style={{
                  // flex: 0.8,
                  fontFamily: fontBold,
                  textAlign: "right",
                  marginTop: 12,
                  marginRight: 22,
                }}
              >
                Name
              </Text>
              <TextInput
                value={name}
                style={styles.inputSearchBox}
                onChangeText={(value) => {
                  setName(value);
                }}
                onBlur={() => {
                  if (!name) {
                    setName(authState?.loginedUser?.name);
                  }
                }}
                maxLength={20}
              />
            </View>
          </View>
          <View style={{ paddingHorizontal: 35 }}>
            {/* TODO: Continue Btn */}
            <TouchableOpacity
              onPress={() => {
                if (name) {
                  updateName();
                  profileDispatch({ type: "CONF_INFO", payload: false });
                } else {
                  Alert.alert("Name should not be empty");
                  setName(authState?.loginedUser?.name);
                }
              }}
              style={styles.btnStyle}
            >
              <Text style={styles.btnTxtStyle}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    backgroundColor: "#FFFFFF",
  },
  logo_view: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: hp("11%"),
    marginBottom: hp("5%"),
  },
  logoStyle: {
    width: wp("41%"),
    height: hp("16%"),
    resizeMode: "contain",
  },
  content_view: {
    paddingHorizontal: 25,
  },
  inner_content_view: {
    paddingBottom: 20,
  },
  HeadingText: {
    textAlign: "left",
    fontFamily: fontMedium,
    fontSize: hp("3.4%"),
    opacity: 1,
    color: fontMediumTextColor3,
    marginBottom: 8,
  },
  headingView: {
    // marginTop: hp('1%'),
    // marginBottom: hp('3%'),
    backgroundColor: "#81CED4",
    width: wp("11%"),
    flex: 1,
    height: hp("0.5%"),
    opacity: 1,
  },

  loginRegisterBtnBG: {
    backgroundColor: themeColor,
    width: wp("49%"),
    height: hp("6%"),
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    opacity: 1,
    marginTop: hp("5%"),
  },
  loginRegisterTxt: {
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: fontMedium,
    fontSize: hp("1.97%"),
  },

  txtStyle: {
    fontFamily: fontBold,
    // marginBottom: 20,
    fontSize: wp("6%"),
    fontWeight: "bold",
    textAlign: "center",
  },
  txtStyle1: {
    textAlign: "center",
    fontFamily: fontBold,
    fontSize: wp("3.8%"),
    color: "#959595",
    letterSpacing: 0.56,
    marginTop: 5,
  },

  form_input: {
    color: fontMediumTextColor,
    borderBottomWidth: 1,
    borderColor: textInputBorderColor,
    marginTop: 20,
    marginBottom: 5,
  },
  btnStyle: {
    backgroundColor: themeColor,
    width: "100%",
    height: 40,
    // padding: 10,
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  btnTxtStyle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: fontBold,
    // fontSize: 14
  },

  error_Code: {
    color: "red",
    fontSize: wp("3%"),
  },
  error_Img: {
    position: "absolute",
    right: 0,
    bottom: 8,
    width: wp("5%"),
    resizeMode: "contain",
  },
  inputSearchBox: {
    // height: hp('5%'),
    // flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    // position: "relative",
    paddingHorizontal: 35,
    color: "#000",
    // width: wp(80),
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderBottomWidth: 0,
    shadowColor: fontMediumTextColor3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6.65,
    elevation: 10,
    paddingVertical: 10,
    marginTop: 20,
    maxWidth: 200,
  },
});
export default UpdateProfileScreen;

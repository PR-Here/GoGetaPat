/** @format */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
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
const ForgotPasswordScreen = ({ navigation }) => {
  // const dispatch = useAuthDispatch();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = React.useState("");
  const [error, setError] = useState({
    error: false,
    attrname: "",
  });
  const forgotPass = async () => {
    // setSignInLoading(true);
    if (email != "") {
      setError({
        error: false,
        attrname: "",
      });
      setShowModal(true);
    } else {
      setError({
        error: true,
        attrname: "email",
      });
    }
  };

  const modalView = () => {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={showModal}
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
              width: wp("90%"),
              backgroundColor: "white",
              paddingHorizontal: 8,
              paddingVertical: 30,
              borderRadius: 20,
            }}
          >
            <View
              style={{ alignItems: "center", paddingHorizontal: wp("12%") }}
            >
              <Image
                source={require("../images/mail_send.png")}
                style={{
                  width: wp("30%"),
                  height: hp("20%"),
                  resizeMode: "contain",
                  marginBottom: 20,
                }}
              />

              <Text style={styles.txtStyle}>Check your email</Text>
              <Text style={{ ...styles.txtStyle1, textAlign: "center" }}>
                We've sent you instructions on how to reset the password (also
                check the Spam folder).
              </Text>
            </View>
            <View style={{ paddingHorizontal: 35 }}>
              {/* TODO: Continue Btn */}
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal);
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

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareScrollView
      // keyboardShouldPersistTaps='handled'
      >
        {modalView()}
        <View style={styles.logo_view}>
          <Image
            source={require("../images/logo.png")}
            style={styles.logoStyle}
          />
        </View>
        <View style={styles.content_view}>
          <Text style={styles.HeadingText}>Find Your Email</Text>
          <View style={styles.headingView} />
          <View style={styles.inner_content_view}>
            <View>
              <FloatingLabelInput
                label={"Email"}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                }}
                customLabelStyles={{
                  ...lables,
                }}
                labelStyles={{
                  ...styles.lables,
                  backgroundColor: "#fff",
                }}
                inputStyles={inputStyles}
                containerStyles={{
                  ...styles.form_input,
                  marginTop: 15,
                }}
              />
              {error.error == true && error.attrname == "email" ? (
                <>
                  <Image
                    source={require("../images/eRROR.png")}
                    style={styles.error_Img}
                  />
                  <Text style={styles.error_Code}>
                    {" "}
                    Please enter a valid email ID or phone number{" "}
                  </Text>
                </>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                // this.validateLogin();
                forgotPass();
              }}
              style={styles.loginRegisterBtnBG}
            >
              <Text style={styles.loginRegisterTxt}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
    marginBottom: 20,
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
});
export default ForgotPasswordScreen;

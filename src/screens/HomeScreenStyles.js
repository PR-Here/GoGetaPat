/** @format */

import { StyleSheet, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  fontBold,
  fontLight,
  fontRegular,
  themeColor,
  fontMediumTextColor,
  fontMediumTextColor2,
  fontMediumTextColor3,
} from "../common/common";

export const homeStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1,
    // paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  top_Header: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp("2%"),
    marginVertical: hp("1.5%"),
    // backgroundColor:"gray"
  },
  icon_Input_Wraper: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
  },
  icon_InputSearchBox: {
    height: hp("5%"),
    width: wp("5%"),
    position: "absolute",
    left: wp(2),
  },
  inputSearchBox:
    Platform.OS == "ios"
      ? {
          height: hp("5%"),
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderRadius: 10,
          marginVertical: 10,
          position: "relative",
          justifyContent: "center",
          paddingHorizontal: 35,
          color: "#000",
          width: wp(80),
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
        }
      : {
          height: hp("5%"),
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: 5,
          marginLeft: 10,
          justifyContent: "center",
          position: "relative",
          paddingVertical: 1,
          paddingHorizontal: 35,
          // marginTop: -5,
          shadowColor: fontMediumTextColor3,
          shadowOffset: {
            width: 20,
            height: 20,
          },
          shadowOpacity: 0.27,
          shadowRadius: 6.65,
          elevation: 10,
        },
  inputSearchBox_Right: {
    width: 55,
    height: 50,
    overflow: "hidden",
  },
  inputSearchBox_Right_Image: {
    height: hp(10),
    width: wp(20),
  },
  contentSection: {
    marginHorizontal: wp("3.5%"),
    marginVertical: hp("0.5%"),
  },
  location_Wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  sm_Image: {
    width: wp("4%"),
    height: hp("2.5%"),
    marginLeft: wp("1%"),
  },
  modal_Backdrop: {
    flex: 1,
    backgroundColor: "#00000091",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modal_Main_Wrap: {
    width: wp("100%"),
    // height: hp('91%'),
    flex: 0.9,
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  location_Text: {
    marginLeft: wp("1%"),
    color: themeColor,
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
  txtStyle1: {
    fontFamily: fontBold,
    // marginBottom: 10,
    fontSize: wp("4.7%"),
    fontWeight: "bold",
  },
  txtStyle2: {
    // textAlign: "center",
    fontFamily: fontLight,
    color: fontMediumTextColor2,
    // marginBottom: 5,
    fontSize: wp("3.7%"),
  },
  btnStyle: {
    backgroundColor: themeColor,
    width: "100%",
    height: 40,
    justifyContent: "center",
    borderRadius: 5,
  },
  btnTxtStyle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: fontBold,
    fontWeight: "bold",
    // fontSize: 14
  },
  sec_padding: {
    paddingHorizontal: wp("4%"),
    // marginTop: 20
  },
  accordian_Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
    marginBottom: 15,
  },
  cancle_Icon: {
    height: hp("3%"),
    width: wp("5%"),
  },
  header_Back_Btn: {
    width: wp("9%"),
    height: hp("5%"),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("1%"),
    paddingVertical: hp("1%"),
    borderRadius: 5,
    marginTop: -5,
    marginRight: 5,
  },
  header_Notification_Icon_Wrapper: {
    position: "absolute",
    right: 0,
    zIndex: 11,
    height: hp("5%"),
    width: wp("8%"),

    elevation: 11,
  },
  header_Notification_Icon: {
    height: hp("5%"),
    width: wp("5%"),
    // position: "absolute",
    // right: 10,
    // elevation: 11,
    // marginTop: -5
  },
  buttons_Wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    flexDirection: "row",
    paddingHorizontal: wp("2%"),
    minWidth: wp("25%"),
    paddingVertical: hp("1%"),
    borderRadius: 5,
    justifyContent: "center",
    marginRight: wp("3%"),
    marginVertical: hp("1.5%"),
    alignItems: "center",
  },
  buttons_Blue: {
    backgroundColor: themeColor,
  },
  buttons_Gray: {
    backgroundColor: fontMediumTextColor,
  },
  btn_Blue_Text: {
    color: "#fff",
    marginLeft: 5,
  },
  btn_Gray_Text: {
    color: "#000",
    marginLeft: 5,
  },
  filter_Wrap:
    Platform.OS == "ios"
      ? {
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          height: hp(40),
        }
      : {
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          marginBottom: 20,
        },
  filter_Text: {
    fontFamily: fontBold,
    fontWeight: "bold",
    fontSize: wp("4.5%"),
    margin: 0,
  },
  filter_Picker:
    Platform.OS == "ios"
      ? {
          width: wp("92%"),
        }
      : {
          height: 50,
          width: wp("92%"),
          marginHorizontal: -6,
          marginVertical: -5,
        },
  price_Wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  price_Range: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: fontMediumTextColor2,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  price_Text: {
    marginHorizontal: 10,
    fontFamily: fontRegular,
    fontSize: wp("3.8%"),
    fontWeight: "bold",
  },
  radio_Outer: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: themeColor,
    alignItems: "center",
    justifyContent: "center",
  },
  radio_Selected: {
    height: 12,
    width: 12,
    borderRadius: 6,
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
    fontSize: wp("4.5%"),
  },
});

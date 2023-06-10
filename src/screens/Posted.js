/** @format */

import React, { useState } from "react";
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
  fontBold,
  fontRegular,
  themeColor,
  fontMediumTextColor2,
  fontMediumTextColor3,
  headerColor,
} from "../common/common";
import { handleShare } from "../subcomponents/Share";

const Post = ({ navigation, route }) => {
  const [stateData, setStateData] = useState(route.params.data);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.top_Header}>
        <View style={{ flex: 1, alignItems: "flex-start" }}></View>
        <View style={styles.top_HeaderRight}>
          <Text allowFontScaling={false} style={styles.top_HeaderText}>
            Posted!
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text allowFontScaling={false} style={styles.top_HeaderText1}>
              Cancel
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.midCont}>
        <View style={styles.imgCont}>
          <Image
            source={{ uri: stateData?.cover_image[0]?.image_url }}
            style={styles.img}
          />
          <View style={styles.name}>
            <Text allowFontScaling={false} style={styles.nameTxt}>
              {stateData?.title}
            </Text>
            {/* <Text style={styles.breadTxt}>{stateData?.breed || ""}</Text> */}
          </View>
        </View>
        <View style={{ alignContent: "center", alignItems: "center" }}>
          <Text allowFontScaling={false} style={styles.adsTxt}>
            Get more views per day
          </Text>

          <TouchableOpacity
            style={styles.bottomStyleButton}
            onPress={() => {
              navigation.navigate("Boost");
            }}
          >
            <Text allowFontScaling={false} style={styles.bottomBtnTxt}>
              Apply
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ButtonStyle}
            onPress={() => handleShare(stateData.id)}
          >
            <Text allowFontScaling={false} style={styles.ButtonTxt}>
              Share your post to get more views
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ButtonStyle,
              { borderWidth: 0, marginTop: hp("2%") },
            ]}
            onPress={() => {
              navigation.navigate("Post Item", { true: false });
            }}
          >
            <Image
              style={styles.Buttonicon}
              source={require("../images/camera.png")}
            />
            <Text style={styles.ButtonTxt}>Post Another Item</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <DetailScreen/> */}
      <View style={{ alignContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.doneStyleButton}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Text allowFontScaling={false} style={styles.bottomBtnTxt}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Buttonicon: {
    height: wp("6%"),
    width: wp("5%"),
    resizeMode: "contain",
    alignSelf: "center",
  },
  ButtonTxt: {
    fontSize: wp("4%"),
    fontFamily: fontRegular,
    color: themeColor,
    paddingLeft: wp("2%"),
    alignSelf: "center",
  },

  ButtonStyle: {
    marginTop: hp("3%"),
    borderWidth: 1,
    borderColor: themeColor,
    borderRadius: 5,
    width: wp("90%"),
    height: hp("7%"),
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
  },
  name: {
    paddingLeft: wp("3%"),
    flexDirection: "row",
    flexGrow: 1,
    flex: 1,
  },
  imgCont: {
    flexDirection: "row",
  },
  midCont: {
    flexDirection: "column",
    paddingHorizontal: wp("3%"),
    paddingTop: hp("5%"),
  },
  img: {
    height: wp("35%"),
    width: wp("35%"),
    resizeMode: "cover",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  top_Header: {
    paddingHorizontal: wp("3%"),
    paddingVertical: 10,
    height: hp("8%"),
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
  nameTxt: {
    fontSize: wp("6%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: fontMediumTextColor3,
  },
  adsTxt: {
    fontSize: wp("4%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: fontMediumTextColor3,
    paddingVertical: hp("2.5%"),
  },
  breadTxt: {
    paddingTop: hp("1%"),
    fontSize: wp("4%"),
    fontFamily: fontBold,
    color: fontMediumTextColor2,
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
  bottomStyleButton: {
    justifyContent: "center",
    alignItems: "center",
    width: wp("90%"),
    backgroundColor: themeColor,
    height: hp("7%"),
    borderRadius: 7,
  },

  doneStyleButton: {
    marginTop: hp("18%"),
    justifyContent: "center",
    alignItems: "center",
    width: wp("20%"),
    backgroundColor: themeColor,
    height: hp("6%"),
    borderRadius: 20,
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
  StyleButton: {
    justifyContent: "center",
    alignContent: "center",
    width: wp("90%"),

    height: hp("7%"),
    borderRadius: 7,
  },
});

export default Post;

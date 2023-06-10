import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  fontBold,
  fontLight,
  themeColor,
  fontMediumTextColor,
  fontMediumTextColor2,
  fontMediumTextColor3,
  headerColor,
} from "../common/common";

const activeStar = require("../images/star-active.png");
const inActiveStar = require("../images/star-inactive.png");

const petImages = [
  require("../images/img1.png"),
  require("../images/img2.png"),
  require("../images/img3.png"),
  require("../images/img4.png"),
  require("../images/img5.png"),
  require("../images/img6.png"),
  require("../images/img7.png"),
  require("../images/img8.png"),
  require("../images/img9.png"),
  require("../images/img10.png"),
  require("../images/img11.png"),
  require("../images/img12.png"),
  require("../images/img13.png"),
  require("../images/img14.png"),
  require("../images/img15.png"),
];

const Profile = ({ navigation, route }) => {
  const [starRating, setStarRating] = useState(3);
  const [stars, setStars] = useState([
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
  ]);

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
            Profile
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.top_HeaderText1}>...</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView>
        <View style={styles.chat_Inner_Wrapper}>
          <Image
            source={require("../images/img-for-chat.png")}
            style={styles.chat_Img}
          />
          <View style={styles.wrp}>
            <Text style={styles.chat_Name}>Lisa Maxwell</Text>
            <Text style={styles.chat_Message} numberOfLines={1}>
              Joined Apr 2016
            </Text>
            <Text style={styles.chat_Message} numberOfLines={1}>
              Taskin,Flles
            </Text>
            <View style={{ flexDirection: "row" }}>
              {stars.map((currentValue, index) => {
                if (index < starRating) {
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
              <Text style={styles.Rating}>(46)</Text>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.top_Header1}>
            <View
              style={{
                alignContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={styles.top_HeaderText}>32</Text>
              <Text style={styles.txtStyle2}>Bought</Text>
            </View>
            <View
              style={{
                alignContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={styles.top_HeaderText}>45</Text>
              <Text style={styles.txtStyle2}>Sold</Text>
            </View>
            <View
              style={{
                alignContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={styles.top_HeaderText}>28</Text>
              <Text style={styles.txtStyle2}>Followers</Text>
            </View>
          </View>
          <View style={{ paddingLeft: wp("4%") }}>
            <Text style={styles.chat_Name}>Items from this seller</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingTop: hp("2.5%"),
          }}
        >
          {petImages.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate("Post");
              }}
            >
              <Image
                source={item}
                style={styles.pets_Image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Rating: {
    paddingLeft: 5,
    paddingTop: wp("0.80%"),
    color: fontMediumTextColor,
  },

  chat_Inner_Wrapper: {
    paddingTop: 12,
    flexDirection: "row",
    alignContent: "center",
    paddingBottom: wp("2%"),
    paddingHorizontal: wp("5%"),
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },
  chat_Img: {
    height: hp("12%"),
    width: hp("12%"),
    resizeMode: "cover",
    alignContent: "center",
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
  chat_Name: {
    color: fontMediumTextColor3,
    fontSize: wp("4.5%"),
    fontWeight: "bold",
  },
  chat_Message: {
    fontFamily: fontLight,
    color: fontMediumTextColor3,
    paddingRight: wp("30"),
    fontWeight: "bold",
  },
  headerIcon: {
    height: hp("6%"),
    width: hp("6%"),
    resizeMode: "cover",
  },
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1,
    // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
  },
  top_Header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("3.5%"),
    backgroundColor: headerColor,
  },
  top_Header1: {
    paddingVertical: wp("5%"),
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp("3.5%"),
    paddingHorizontal: wp("5%"),
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
    fontSize: wp("8%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: themeColor,
  },

  pets_Image: {
    height: hp("15%"),
    width: wp("31.4%"),
    marginHorizontal: wp("1%"),
    marginVertical: hp("0.5%"),
  },

  txtStyle2: {
    paddingTop: hp("0.5%"),
    // textAlign: "center",
    fontFamily: fontLight,
    color: fontMediumTextColor2,
    // marginBottom: 5,
    fontSize: wp("4%"),
  },
});

export default Profile;

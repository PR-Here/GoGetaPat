/** @format */

import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  fontBold,
  fontLight,
  fontMediumTextColor,
  grayBorderColor,
  headerColor,
  themeColor,
} from "../common/common";
import { useHomeDispatch, useHomeState } from "../contexts/HomeContext";

import { Loader } from "../subcomponents/Loader";

import { fetchSellingData } from "../services/api";

const activeStar = require("../images/star-active.png");
const inActiveStar = require("../images/star-inactive.png");

const ChatData = [
  {
    catg: "labrador retriever dog",
    seller: "Lisa Maxwell",
    AnimalImage: require("../images/dog.png"),
    Sold: 5000,
    View: 0,
    About: "",
    Conversations: 0,
    UserId: 1,
    LastActive: "1 Hour ago",
  },
  {
    catg: "cat",
    AnimalImage: require("../images/cat.png"),
    seller: "Lisa Maxwell",
    Sold: 5000,
    View: 160,
    About: "Clearly Loved Pets Playpen Dog",
    Conversations: 2,
    UserId: 2,
    LastActive: "1 Hour ago",
  },
  {
    catg: "cat",
    AnimalImage: require("../images/cat.png"),
    seller: "Lisa Maxwell",
    Sold: 5000,
    View: 160,
    About: "Clearly Loved Pets Playpen Dog",
    Conversations: 2,
    UserId: 2,
    LastActive: "1 Hour ago",
  },

  {
    catg: "cat",
    AnimalImage: require("../images/cat.png"),
    seller: "Lisa Maxwell",
    Sold: 5000,
    View: 160,
    About: "Clearly Loved Pets Playpen Dog",
    Conversations: 2,
    UserId: 2,
    LastActive: "1 Hour ago",
  },
];

const Archived = ({ navigation }) => {
  const homeDispatch = useHomeDispatch();
  const stateHome = useHomeState();

  const [fullData, setFullData] = useState();
  const [starRating, setStarRating] = useState(3);
  const [stars, setStars] = useState([
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
    "star-inactive.png",
  ]);
  const [change, setChange] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      let sellingData = async () => {
        let response = await fetchSellingData(homeDispatch);
        // console.log(response, "koko")
        var newArray = response?.data.filter((item) => {
          return item.status == "Archive";
        });
        setFullData(newArray);
      };
      sellingData();
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  let deleteFunc = (index) => {
    // console.log(index)
    let updatedData = fullData;
    updatedData.splice(index, 1);
    setFullData(updatedData);
    setChange(!change);
  };
  const showLoader = (stateHome) => {
    if (stateHome.isLoading) {
      return <Loader />;
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {showLoader(stateHome)}
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
            Archived Items
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}></View>
      </View>
      <View style={[styles.content_view]}>
        {/* <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}> */}
        {stateHome.isLoading === false ? (
          fullData?.length ? (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <FlatList
                  data={fullData}
                  extraData={change}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      key={item + index}
                      onPress={() => {
                        navigation.navigate({
                          name: "Post",
                          params: { id: item.id },
                        });
                      }}
                    >
                      <View style={styles.chat_Inner_Wrapper}>
                        <Image
                          source={{ uri: item?.cover_image[0]?.image_url }}
                          style={[
                            styles.chat_Img,
                            { alignSelf: "flex-start", marginTop: 10 },
                          ]}
                        />
                        <View style={{ flex: 1, paddingHorizontal: 12 }}>
                          <Text style={styles.chat_Name}>{item?.title}</Text>

                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "flex-start",
                            }}
                          >
                            <Image
                              style={styles.icon}
                              source={require("../images/purchases.png")}
                            />
                            <Text style={styles.text}>{item?.price}</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              paddingRight: wp(15),
                              flexDirection: "row",
                            }}
                          >
                            <Text style={styles.text}>Pet seller : </Text>

                            <Text style={styles.chat_Name_theme}>
                              {item.user.name}
                            </Text>
                          </View>
                          <View style={{ flexDirection: "row" }}>
                            <View style={{ flexDirection: "column" }}>
                              <Text style={styles.chat_Message}>
                                Taskin,Flles
                              </Text>

                              <View style={{ flexDirection: "row" }}>
                                {stars.map((currentValue, index) => {
                                  if (index < item.user.user_rating_count) {
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
                                  {item.views_count}
                                </Text>
                              </View>
                            </View>
                            {/* <TouchableOpacity onPress={(index) => { deleteFunc(index) }} style={{ alignItems: 'center', justifyContent: "center", flex: 1, backgroundColor: '#0000', elevation: 1000 }}>
                                                        <Image source={require('../images/delete.png')} style={styles.deleteIcon} />
                                                    </TouchableOpacity> */}
                          </View>
                        </View>
                        <View
                          style={{
                            justifyContent: "center", //Centered horizontally
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={require("../images/right-arrow.png")}
                            style={styles.chat_Img1}
                          />
                        </View>
                        <View style={styles.border_btm}></View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          ) : (
            <View
              style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}
            >
              <Text>You don’t have any Archived item to display.</Text>
            </View>
          )
        ) : null}

        {/* </SafeAreaView> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chat_Message: {
    fontFamily: fontLight,
    color: "#000",

    fontWeight: "bold",
  },
  text: {
    fontFamily: fontBold,
    fontWeight: "bold",
    fontSize: wp("3.5%"),
    color: "#000",
  },
  Rating: {
    paddingLeft: 3,
    paddingTop: wp("0.80%"),
    color: fontMediumTextColor,
    fontSize: wp("2.5%"),
  },
  strRat: {
    height: wp("5%"),
    width: wp("3%"),
    resizeMode: "contain",
  },
  chat_Img: {
    height: hp("12%"),
    width: hp("12%"),
    resizeMode: "cover",
    alignSelf: "flex-end",
  },
  chat_Img1: {
    height: hp("3%"),
    alignSelf: "center",
    resizeMode: "contain",
    justifyContent: "center",
  },
  deleteIcon: {
    height: hp("5.5%"),
    alignSelf: "center",
    resizeMode: "contain",
    justifyContent: "center",
  },
  icon: {
    height: hp("2.5%"),
    width: hp("2.5%"),
    resizeMode: "contain",
    alignSelf: "center",
  },
  chat_Name: {
    color: "#000000",
    fontSize: wp("4%"),
    fontWeight: "bold",
    fontFamily: fontBold,
  },
  chat_Name_theme: {
    color: themeColor,
    fontSize: wp("3.5%"),
    fontWeight: "bold",
    paddingRight: wp("5%"),
    textAlignVertical: "bottom",
  },

  chat_Inner_Wrapper: {
    paddingTop: 5,
    flexDirection: "row",
    marginTop: 2,
    borderColor: grayBorderColor,
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  headerIcon: {
    height: hp("8%"),
    width: wp("14%"),
  },

  content_view: {
    flex: 1,
    alignContent: "flex-start",
    flexDirection: "column",
    paddingHorizontal: wp("5%"),
  },

  top_Header: {
    paddingHorizontal: wp("4%"),
    // paddingVertical: 3,
    justifyContent: "space-between",
    backgroundColor: headerColor,
    flexDirection: "row",
    alignItems: "center",
  },
  top_HeaderRight: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  top_HeaderText: {
    fontSize: wp("6%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    color: themeColor,
  },
});

export default Archived;

import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { fetchSellingData } from "../services/api";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { useHomeDispatch, useHomeState } from "../contexts/HomeContext";
import { useAuthState } from "../contexts/authContext";
import { sellingStyles } from "./SellingScreenStyles";
import { handleShare } from "../subcomponents/Share";
import { CustomLoginPopup } from "../subcomponents/CustomLoginPopup";

const cameraIcon = require("../images/camera.png");

const SellingScreen = ({ navigation, route }) => {
  const authState = useAuthState();
  let dispatchHome = useHomeDispatch();
  const [fullData, setFullData] = useState([]);
  const [mark, setMark] = useState(false);
  const [popup, setPopup] = useState(true);

  const markTick = () => {
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={mark}
        onRequestClose={() => {
          setMark(false);
        }}
      >
        <TouchableOpacity
          style={sellingStyles.modal_Backdrop}
          onPress={() => {
            setMark(false);
          }}
        >
          <View style={sellingStyles.modal_Main_Wrap1}>
            <Image
              style={sellingStyles.tickImg}
              source={require("../images/tick.png")}
            />
            <Text
              style={[
                sellingStyles.bottomBtnTxt,
                { color: "#000", paddingTop: wp("2%") },
              ]}
            >
              Mark Sold
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const handleSingleChat = (item) => {
    navigation.navigate({
      name: "ItemDash",
      params: { setMark: setMark, itemData: item, itemStatus: item.itemStatus },
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (
        authState.userToken == null ||
        authState.userToken == undefined ||
        authState.userToken == ""
      ) {
        setPopup(true);
      } else {
        let sellingData = async () => {
          let response = await fetchSellingData(dispatchHome);
          var newArray = response?.data.filter((item) => {
            return item.status != "Archive";
          });
          setFullData(newArray);
        };
        sellingData();
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation, authState.userToken]);

  return (
    <SafeAreaView style={sellingStyles.mainContainer}>
      {authState.userToken ? (
        <>
          {markTick()}
          <View style={sellingStyles.top_Header}>
            <View style={{ flex: 1 }}></View>
            <View style={sellingStyles.top_HeaderRight}>
              <Text
                allowFontScaling={false}
                style={sellingStyles.top_HeaderText}
              >
                {route.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Archived");
              }}
              style={{ flex: 1, alignItems: "flex-end" }}
            >
              <Text
                allowFontScaling={false}
                style={sellingStyles.top_HeaderText1}
              >
                Archived
              </Text>
            </TouchableOpacity>
          </View>

          <View style={sellingStyles.content_view}>
            <View style={sellingStyles.sec_padding}>
              <View style={sellingStyles.heading_Main_Wrap}>
                <View style={sellingStyles.heading_Main_View}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Post Item", { true: false });
                    }}
                    style={{ flexDirection: "row" }}
                  >
                    <Image
                      source={cameraIcon}
                      style={sellingStyles.chat_Img1}
                    />
                    <Text style={sellingStyles.heading_Main_Message}>
                      Post Another Item
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              {Object.keys(fullData)?.length > 0 ? (
                <FlatList
                  data={fullData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    // console.log(item, "popo")

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          handleSingleChat(item);
                        }}
                      >
                        <View style={sellingStyles.chat_Inner_Wrapper}>
                          <Image
                            source={{ uri: item?.cover_image[0]?.image_url }}
                            style={sellingStyles.chat_Img}
                          />
                          <View style={{ paddingLeft: 12, flex: 1 }}>
                            <Text style={sellingStyles.chat_Name}>
                              {item.category}
                            </Text>
                            <Text
                              style={sellingStyles.chat_Message}
                              numberOfLines={1}
                            >
                              {item.description && item.description}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                              {/* {item.Conversations == 0 ? (
                                                    <View></View>
                                                    ) : (
                                                        <Text
                                                        style={sellingStyles.chat_Message_convo}
                                                        numberOfLines={1}>
                                                        {item.Conversations} Conversations
                                                        </Text>
                                                    )} */}
                              {item.views_count == 0 ? null : (
                                <Text
                                  style={sellingStyles.chat_Message_convo}
                                  numberOfLines={1}
                                >
                                  {item.views_count && item.views_count} Views
                                </Text>
                              )}
                            </View>
                            <View>
                              {item?.status == "Sold" ? (
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                  <TouchableOpacity
                                    onPress={() => handleShare(item.id)}
                                  >
                                    <Text style={sellingStyles.chat_Name_theme}>
                                      Share
                                    </Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    onPress={() => {
                                      navigation.navigate("Post Item", {
                                        true: false,
                                      });
                                    }}
                                  >
                                    <Text
                                      style={sellingStyles.chat_Name_theme}
                                      numberOfLines={1}
                                    >
                                      Sell another
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => handleShare(item.id)}
                                  >
                                    <Text
                                      style={sellingStyles.chat_Name_theme}
                                      numberOfLines={1}
                                    >
                                      Share
                                    </Text>
                                  </TouchableOpacity>
                                  {/* <TouchableOpacity
                                                                onPress={() => { navigation.navigate('Boost') }}>
                                                                <Text style={sellingStyles.chat_Name_theme} numberOfLines={1}>
                                                                    Boost Ad
                                                                </Text>
                                                            </TouchableOpacity> */}
                                </View>
                              )}
                            </View>
                          </View>
                          {item?.status == "Sold" ? (
                            <View style={sellingStyles.soldNoti}>
                              <View style={sellingStyles.soldNoti1}>
                                <Text style={sellingStyles.soldTxt}>SOLD</Text>
                              </View>
                            </View>
                          ) : null}
                          <View style={sellingStyles.arrow_cont}>
                            <Image
                              source={require("../images/right-arrow.png")}
                              style={sellingStyles.chat_Img1}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  style={{ paddingHorizontal: wp("3%") }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={sellingStyles.nothingSaved}>
                    {" "}
                    There is nothing show here
                  </Text>
                </View>
              )}
            </View>
          </View>
        </>
      ) : popup ? (
        <CustomLoginPopup
          toggle={popup}
          setPopup={setPopup}
          name="Access Denied"
          btnName1="Cancel"
          btnName2="Login"
          alertText="Please login to access this functionality."
          btn2Action={() => navigation.navigate("SignIn")}
        />
      ) : (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <Text style={sellingStyles.nothingSaved}>
            {" "}
            You are not authorized to access this feature. {"\n"}Please login!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SellingScreen;

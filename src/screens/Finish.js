/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Linking,
  Platform,
  Keyboard,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Geolocation from "react-native-geolocation-service";
import {
  fontBold,
  fontLight,
  fontRegular,
  MAP_API_KEY,
  themeColor,
  fontMediumTextColor2,
  fontMediumTextColor3,
  headerColor,
} from "../common/common";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

const keyboardType = Platform.OS === "android" ? "numeric" : "number-pad";

// Check Location Permission for IOS
const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      customToastMsg("Unable to open settings");
    });
  };

  const status = await Geolocation.requestAuthorization("whenInUse");
  if (status === "granted") {
    return true;
  }

  if (status === "denied") {
    customToastMsg("Location service is off");
  }

  if (status === "disabled") {
    Alert.alert(
      `Turn on Location Services to allow GoGetaPet to determine your location.`,
      "",
      [
        { text: "Go to Settings", onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ]
    );
  }

  return false;
};

// Has location permission for both IOs and Android
const hasLocationPermission = async () => {
  if (Platform.OS === "ios") {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === "android" && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  if (hasPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    customToastMsg("Location permission denied by user.", "long");
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    customToastMsg("Location permission revoked by user.", "long");
  }

  return false;
};

// const CategoriesModal = ({ categoriesModal, setCheck, setCategoriesModal, pin, state, city, setPin, setState, setCity,
//     setLatitude, setLongitude }) => {

//     return <Modal animationType={"slide"}
//         transparent={true}
//         visible={categoriesModal}
//         onRequestClose={() => { setCategoriesModal(!categoriesModal); }} >
//         <View style={{ flex: 1, backgroundColor: "#00000091", justifyContent: "flex-end", alignItems: "center" }}>
//             <View style={{ width: wp('100%'), height: hp("91%"), backgroundColor: "white", paddingHorizontal: 8, paddingVertical: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
//                 <SafeAreaView style={{ flex: 1 }}>
//                     <View style={[styles.sec_padding, { flex: 1 }]}>
//                         <View style={styles.accordian_Header}>
//                             <View style={{ flex: 1 }}></View>
//                             <TouchableOpacity style={{ flex: 4, justifyContent: "center", alignContent: "center" }} onPress={() => requestLocationPermission()}>
//                                 <Text style={{ ...styles.txtStyle1 }}>Set Location</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={{ flex: 1, justifyContent: "flex-end", }} onPress={() => { setCategoriesModal(!categoriesModal); }}>
//                                 <Text style={{ ...styles.txtStyle2, fontSize: wp("3.7%"), fontWeight: "bold", color: themeColor }}>Cancel</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <ScrollView>
//                             <View style={styles.content_view}>
//                                 <View style={{ paddingTop: hp("10%") }}>
//                                     <View style={{ paddingVertical: hp("3%") }}>
//                                         <Text style={styles.InstTxt}>Where is your pet located?</Text>
//                                     </View>
//                                     <TouchableOpacity style={styles.ButtonStyle} onPress={() => requestLocationPermission()}>
//                                         <Image style={styles.Buttonicon} source={require('../images/location-home.png')} />
//                                         <Text style={styles.ButtonTxt}>Get my location</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                                 <View style={{ paddingVertical: hp("3%") }}>
//                                     <Text style={styles.InstTxt}>Or</Text>
//                                 </View>

//                                 <View style={styles.ButtonStyleBlack}>
//                                     <TextInput
//                                         placeholder={"Zip Code"}
//                                         value={pin}
//                                         onChangeText={(value) => setPin(value)}
//                                         style={{ width: wp("40%"), color: "black", textAlign: 'center' }}
//                                         onSubmitEditing={() => fetchLocationUsingPincode()}
//                                         onBlur={() => fetchLocationUsingPincode()}
//                                         keyboardType={keyboardType}
//                                     />
//                                 </View>

//                                 {city || state ?
//                                     <View style={{ paddingVertical: hp("3%") }}>
//                                         <Text style={styles.InstTxt}>{city ? city + "," : city} {state}</Text>
//                                     </View>
//                                     : null
//                                 }
//                             </View>
//                         </ScrollView>

//                         <View>
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     setCategoriesModal(!categoriesModal);
//                                 }}
//                                 style={styles.btnStyle} >
//                                 <Text style={styles.btnTxtStyle}>Apply</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </SafeAreaView>
//             </View>
//         </View>
//     </Modal>
// }

const Finish = ({
  navigation,
  route,
  setValues,
  setLatitude,
  setLongitude,
  state,
  setState,
  city,
  setCity,
  pin,
  setPin,
}) => {
  // const [pin, setPin] = useState("Enter Your Pin");
  // const [state, setState] = useState("");
  // const [city, setCity] = useState("");
  const [check, setCheck] = useState(false);
  const [categoriesModal, setCategoriesModal] = useState(false);

  const requestLocationPermission = async () => {
    let isPermission = await hasLocationPermission();
    try {
      if (isPermission) {
        Geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);

            //setLatitude(26.438332);
            //setLongitude(82.6809145);
            // 26.4321417 82.6974811
            var latlong =
              position.coords.latitude + "," + position.coords.longitude;
            // var latlong = 26.4321417 + "," + 82.6974811;
            fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlong}&key=` +
                MAP_API_KEY
            )
              .then((respon) => respon.json())

              .then((results) => {
                console.log("results", "is--" + JSON.stringify(results));
                var address = results.results[0].address_components;
                let City, State, Zip;
                let addressInfo = {
                  locality: "",
                  sublocality: "",
                  state: "",
                  postalCode: "",
                };
                let data = "";
                address.forEach(function (component) {
                  var types = component.types;
                  let foo = types.indexOf("locality") > -1;
                  let bar = types.indexOf("sublocality") > -1;
                  data = component.long_name + " " + data;
                  if ((foo && !bar) || (!foo && bar)) {
                    if (types.indexOf("locality") > -1) {
                      City = component.long_name;
                    }
                    if (types.indexOf("sublocality") > -1) {
                      City = component.long_name;
                    }
                    setCity(City);
                  }

                  if (types.indexOf("administrative_area_level_1") > -1) {
                    State = component.short_name;
                    setState(State);
                  }
                  if (types.indexOf("postal_code") > -1) {
                    Zip = component.long_name || component.short_name;
                    setPin(Zip);
                  } else {
                    results.results.map((info) => {
                      if (info.types.includes("postal_code")) {
                        info.address_components.map((item) => {
                          if (item.types.includes("postal_code")) {
                            Zip = item.long_name || item.short_name;
                            setPin(Zip);
                          }
                        });
                      }
                    });
                  }
                  if (city && state) {
                    setCheck(true);
                  }
                });
              })
              .catch((error) => {
                customToastMsg(error.message);
              });
          },
          (error) => {
            customToastMsg(error.message);
          },
          {
            accuracy: { android: "high", ios: "best" },
            enableHighAccuracy: true,
            timeout: 10000,
          }
        );
      }
    } catch (err) {
      customToastMsg(err.message);
    }
  };

  const fetchLocationUsingPincode = (customPin) => {
    if (!pin) {
      return;
    }

    setCity("");
    setState("");

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${
        customPin || pin
      }&key=` + MAP_API_KEY
    )
      .then((respon) => respon.json())
      .then((results) => {
        var address = results.results[0].address_components;
        const { lat, lng } = results.results[0].geometry.location;
        let City, State, Zip;

        // alert(JSON.stringify(results.results[0].address_components + " FIRST fetchlocationpincode"));

        address.forEach(function (component) {
          var types = component.types;
          let foo = types.indexOf("locality") > -1;
          let bar = types.indexOf("sublocality") > -1;
          if ((foo && !bar) || (!foo && bar)) {
            if (types.indexOf("locality") > -1) {
              City = component.long_name;
            }

            if (types.indexOf("sublocality") > -1) {
              City = component.long_name;
            }
            setCity(City);
          } else {
            results.results.map((info) => {
              if (info.types.includes("locality")) {
                info.address_components.map((item) => {
                  if (item.types.includes("locality")) {
                    City = item.long_name || item.short_name;
                  }
                  setCity(City);
                });
              } else if (info.types.includes("sublocality")) {
                info.address_components.map((item) => {
                  if (item.types.includes("sublocality")) {
                    City = item.long_name || item.short_name;
                  }
                  setCity(City);
                });
              } else if (info.types.includes("administrative_area_level_2")) {
                info.address_components.map((item) => {
                  if (item.types.includes("administrative_area_level_2")) {
                    City = item.long_name || item.short_name;
                  }
                  setCity(City);
                });
              } else if (info.types.includes("postal_code")) {
                info.address_components.map((item) => {
                  if (item.types.includes("administrative_area_level_2")) {
                    City = item.long_name || item.short_name;
                  }
                  setCity(City);
                });
              }
            });
          }
          if (types.indexOf("administrative_area_level_1") > -1) {
            State = component.short_name;
            setState(State);
          }
          if (types.indexOf("postal_code") < -1) {
            Zip = component.long_name || component.short_name;
            setPin(Zip);
          } else {
            results.results.map((info) => {
              if (info.types.includes("postal_code")) {
                info.address_components.map((item) => {
                  if (item.types.includes("postal_code")) {
                    Zip = item.long_name || item.short_name;
                    setPin(Zip);
                  }
                });
              }
            });
          }
          if (state) {
            setCheck(true);
          }
          if (lat && lng) {
            setLatitude(lat);
            setLongitude(lng);
          }
        });
      })
      .catch((error) => {});
  };
  // useEffect(() => {
  //     alert(pin + " getting pin")
  // }, [pin])

  return (
    <SafeAreaView>
      {/* <CategoriesModal pin={pin} state={state}
                city={city} check={check} setCheck={setCheck} categoriesModal={categoriesModal}
                setCategoriesModal={setCategoriesModal} setPin={setPin} setState={setState} setCity={setCity}
                setLatitude={setLatitude} setLongitude={setLongitude}
            /> */}
      <KeyboardAwareScrollView
        style={{ paddingHorizontal: wp("7%"), paddingVertical: "20%" }}
        keyboardShouldPersistTaps="always"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        <Text style={styles.heading}>
          Location
          <Text style={{ fontSize: wp("3.5%") }}>(Required) </Text>
        </Text>
        <View style={styles.top_Header1}>
          <>
            {city || state ? (
              <Text style={styles.location}>
                {city ? city + "," : ""}
                {state}
              </Text>
            ) : (
              <Text style={styles.location}>Location</Text>
            )}
          </>
          {/* <TouchableOpacity onPress={() => { setCategoriesModal(true) }} >
                        <Image style={styles.Buttonicon} source={require('../images/location-home.png')} /> */}
          {/* <Text style={styles.top_HeaderText1}>Edit</Text> */}
          {/* </TouchableOpacity> */}
        </View>

        <View style={styles.content_view}>
          <View style={{ paddingTop: hp("3%") }}>
            {/* {city || state ?
                        <View style={{ paddingVertical: hp("1%") }}>
                            {/* <Text style={styles.InstTxt}>{city ? city + "," : city} {state}</Text> */}
            {/* <TouchableOpacity style={styles.ButtonStyle} onPress={() => { navigation.navigate('BoostPost') }}>
                            {/* <Image style={styles.Buttonicon} source={require('../images/location-home.png')} /> */}
            {/* <Text style={styles.ButtonTxt}>Click to boost your post</Text> */}
            {/* </TouchableOpacity>
                        </View>
                        :
                        null
                    }  */}
            <View style={{ paddingVertical: hp("3%") }}>
              <Text style={styles.InstTxt}>Where is your pet located?</Text>
            </View>
            {/* <TouchableOpacity style={styles.ButtonStyle} onPress={() => requestLocationPermission()}>
                            <Image style={styles.Buttonicon} source={require('../images/location-home.png')} />
                            <Text style={styles.ButtonTxt}>Get my location</Text>
                        </TouchableOpacity> */}
          </View>
          {/* <View style={{ paddingVertical: hp("3%") }}>
            <Text style={styles.InstTxt}>Or</Text>
          </View> */}

          <View style={styles.ButtonStyleBlack}>
            <TextInput
              placeholder={"Zip Code"}
              value={pin}
              onChangeText={(value) => {
                setPin(value);
                if (value.length >= 5) fetchLocationUsingPincode(value);
              }}
              style={{ width: wp("40%"), color: "black", textAlign: "center" }}
              //onSubmitEditing={() => fetchLocationUsingPincode()}
              // onBlur={() => fetchLocationUsingPincode()}
              keyboardType={keyboardType}
              maxLength={10}
            />
          </View>

          {city || state ? (
            <View style={{ paddingVertical: hp("3%") }}>
              <Text style={styles.InstTxt}>
                {city ? city + "," : city} {state}
              </Text>
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  InstTxt: {
    fontSize: wp("5%"),
    fontFamily: fontBold,
    color: fontMediumTextColor3,
    paddingLeft: wp("2%"),
    alignSelf: "center",
  },
  ButtonTxt: {
    fontSize: wp("4%"),
    fontFamily: fontRegular,
    color: themeColor,
    paddingLeft: wp("2%"),
    alignSelf: "center",
  },
  Buttonicon: {
    height: wp("6%"),
    width: wp("5%"),
    resizeMode: "contain",
    alignSelf: "center",
  },
  ButtonStyle: {
    borderWidth: 1,
    borderColor: themeColor,
    borderRadius: 5,
    width: wp("55%"),
    height: hp("7%"),
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
  },
  ButtonStyleBlack: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    width: wp("55%"),
    height: hp("7%"),
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
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
  txtStyle2: {
    // textAlign: "center",
    fontFamily: fontLight,
    color: fontMediumTextColor2,
    // marginBottom: 5,
    fontSize: wp("3.7%"),
  },
  txtStyle1: {
    fontFamily: fontBold,
    // marginBottom: 10,
    fontSize: wp("4.7%"),
    fontWeight: "bold",
    alignSelf: "center",
  },

  accordian_Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
    marginBottom: 15,
  },
  sec_padding: {
    paddingHorizontal: wp("4%"),
    // marginTop: 20
  },

  heading: {
    fontSize: wp("5%"),
    fontFamily: fontBold,
    letterSpacing: 1,
    fontWeight: "bold",
    color: "black",
  },
  location: {
    fontSize: wp("4%"),
    fontFamily: fontBold,
    letterSpacing: 1,
    color: "black",
    fontWeight: "bold",
  },
  content_view: {
    // flex: 1,
    // alignContent: 'flex-start',
    flexDirection: "column",
    paddingHorizontal: wp("5%"),
  },

  top_Header: {
    paddingHorizontal: wp("3%"),
    paddingVertical: 0,
    justifyContent: "space-between",
    backgroundColor: headerColor,
    flexDirection: "row",
    alignItems: "center",
  },
  top_Header1: {
    paddingVertical: 3,
    justifyContent: "space-between",

    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    height: hp("8%"),
    width: wp("14%"),
    resizeMode: "cover",
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

export default Finish;

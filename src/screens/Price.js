import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  SafeAreaView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CurrencyPicker from "react-native-currency-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  fontBold,
  themeColor,
  headerColor,
  placeholderColor,
  fontMediumTextColor3,
} from "../common/common";

import { priceValidate } from "../common/helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

const keyboardType = Platform.OS === "android" ? "numeric" : "number-pad";
const Price = ({
  navigation,
  route,
  setValues,
  priceOfPet,
  setPriceOfPet,
  shippingPrice,
  setShippingPrice,
}) => {
  let currencyPickerRef = undefined;
  // const [priceOfPet, setPriceOfPet] = useState("")
  const makeOwnOfferInput = useRef(null);

  return (
    <SafeAreaView>
      {/* <View style={styles.top_Header}>
                <TouchableOpacity onPress={setValues}>
                    <Image source={require('../images/back-button.png')} style={styles.headerIcon} />
                </TouchableOpacity>
                <View style={styles.top_HeaderRight}>
                    <Text style={styles.top_HeaderText}>Price</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                    <Text style={styles.top_HeaderText1}>Cancel</Text>
                </TouchableOpacity>
            </View> */}

      <KeyboardAwareScrollView
        style={{ height: hp(100), paddingTop: hp(7) }}
        scrollEnabled={false}
      >
        <View style={styles.makeOwnOffer}>
          <TouchableOpacity
            onPress={() => {
              currencyPickerRef.open();
            }}
          >
            <Image
              source={require("../images/up-arrow.png")}
              style={styles.headerIconArrow}
            />
          </TouchableOpacity>

          <CurrencyPicker
            currencyPickerRef={(ref) => {
              currencyPickerRef = ref;
            }}
            enable={true}
            darkMode={false}
            currencyCode={"usd"}
            showFlag={false}
            showCurrencyName={false}
            showCurrencyCode={false}
            onSelectCurrency={(data) => {}}
            onOpen={() => {
              console.log("Open");
            }}
            onClose={() => {
              console.log("Close");
            }}
            showNativeSymbol={false}
            showSymbol={true}
            containerStyle={{
              container: {},
              flagWidth: 40,
              currencyCodeStyle: {},
              currencyNameStyle: {},
              symbolStyle: {
                fontSize: wp("8.5%"),
                fontFamily: fontBold,
                fontWeight: "bold",
                paddingBottom: 2,
              },
              symbolNativeStyle: {},
            }}
            modalStyle={{
              container: {},
              searchStyle: {},
              tileStyle: {},
              itemStyle: {
                itemContainer: {},
                flagWidth: 30,
                currencyCodeStyle: {},
                currencyNameStyle: {},
                symbolStyle: {},
                symbolNativeStyle: {},
              },
            }}
            title={"Currency"}
            searchPlaceholder={"Search"}
            showCloseButton={false}
            showModalTitle={true}
          />

          <TextInput
            autoFocus={true}
            placeholder={"0"}
            maxLength={6}
            value={priceOfPet.toString()}
            onChangeText={(value) => {
              if (priceValidate(value)) {
                setPriceOfPet(value);
              }
            }}
            placeholderTextColor={placeholderColor}
            style={styles.makeOwnOfferInput}
            ref={makeOwnOfferInput}
            keyboardType={keyboardType}
          />
        </View>
        <View style={{alignSelf: 'center', marginTop: 10}}>
          <Text
            style={{
              fontSize: wp("4%"),
              fontFamily: fontBold,
              letterSpacing: 1,
              fontWeight: "bold",
              color: fontMediumTextColor3,
              marginBottom: -8,
            }}
          >
            Shipping Price
          </Text>
        </View>
        <View style={styles.makeOwnOffer}>
          <TouchableOpacity
            onPress={() => {
              currencyPickerRef.open();
            }}
          >
            <Image
              source={require("../images/up-arrow.png")}
              style={styles.headerIconArrow}
            />
          </TouchableOpacity>

          <CurrencyPicker
            currencyPickerRef={(ref) => {
              currencyPickerRef = ref;
            }}
            enable={true}
            darkMode={false}
            currencyCode={"usd"}
            showFlag={false}
            showCurrencyName={false}
            showCurrencyCode={false}
            onSelectCurrency={(data) => {}}
            onOpen={() => {
              console.log("Open");
            }}
            onClose={() => {
              console.log("Close");
            }}
            showNativeSymbol={false}
            showSymbol={true}
            containerStyle={{
              container: {},
              flagWidth: 40,
              currencyCodeStyle: {},
              currencyNameStyle: {},
              symbolStyle: {
                fontSize: wp("8.5%"),
                fontFamily: fontBold,
                fontWeight: "bold",
                paddingBottom: 2,
              },
              symbolNativeStyle: {},
            }}
            modalStyle={{
              container: {},
              searchStyle: {},
              tileStyle: {},
              itemStyle: {
                itemContainer: {},
                flagWidth: 30,
                currencyCodeStyle: {},
                currencyNameStyle: {},
                symbolStyle: {},
                symbolNativeStyle: {},
              },
            }}
            title={"Currency"}
            searchPlaceholder={"Search"}
            showCloseButton={false}
            showModalTitle={true}
          />

          <TextInput
            autoFocus={true}
            placeholder={"0"}
            maxLength={6}
            value={shippingPrice.toString()}
            onChangeText={(value) => {
              if (priceValidate(value)) {
                setShippingPrice(value);
              }
            }}
            placeholderTextColor={placeholderColor}
            style={styles.makeOwnOfferInput}
            ref={makeOwnOfferInput}
            keyboardType={keyboardType}
          />
        </View>
      </KeyboardAwareScrollView>

      {/* <View style={styles.top_Header1}> */}

      {/* <View >
                    <Text style={styles.heading}>Category(Required)</Text>
                </View>
                {
                    ratio ?
                        <TouchableOpacity onPress={() => setRatio(false)}>
                            <Image source={require('../images/toggel-off.png')} style={[styles.cateRatio, { marginRight: wp("1.8%") }]} />
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={() => setRatio(true)}>
                            <Image source={require('../images/toggel-on.png')} style={styles.cateRatio} />
                        </TouchableOpacity>
                } */}
      {/* </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  makeOwnOffer: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    width: wp("80%"),
    height: hp("10%"),
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  makeOwnOfferText: {
    fontSize: wp("9%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  makeOwnOfferInput: {
    borderWidth: 0,
    fontSize: wp("8.5%"),
    fontFamily: fontBold,
    fontWeight: "bold",
    paddingVertical: 5,
    maxWidth: wp("50%"),
    color: "#000",
  },
  inputField: {
    fontSize: hp("4%"),
    color: "black",
  },
  input: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    alignItems: "center",
    borderWidth: 1,
    width: wp("90%"),
    paddingHorizontal: wp("5%"),
    marginVertical: hp("5%"),
    height: wp("15%"),
    color: "black",
  },

  heading: {
    fontSize: wp("5%"),
    fontFamily: fontBold,
    letterSpacing: 1,
    fontWeight: "bold",
    color: "black",
  },

  content_view: {
    flex: 1,
    alignContent: "flex-start",
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
    paddingHorizontal: wp("3%"),
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
  headerIconArrow: {
    height: hp("3%"),
    width: wp("4%"),
    resizeMode: "contain",
    transform: [{ rotate: "180deg" }],
  },
  cateRatio: {
    height: hp("6%"),
    width: hp("8.5%"),
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

export default Price;

import React from "react";
import {
  View,
  Image,
  Text,
  SafeAreaView,
  Platform,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
// import RNIap, {
//     finishTransaction,
//     purchaseErrorListener,
//     purchaseUpdatedListener,
// } from 'react-native-iap';
import * as RNIap from "react-native-iap";
import { cos } from "react-native-reanimated";
import { useAuthDispatch, useAuthState } from "../contexts/authContext";
import { boosts } from "../services/api";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { boostStyles } from "./BoostAdScreenStyles";
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const Boast = ({ navigation, route }) => {
  const { post_id, from_admin } = route.params ?? {};
  const dispatch = useAuthDispatch();
  const state = useAuthState();
  let id = from_admin == true ? post_id : state.loginedUser.id;
  const [productList, setProductList] = React.useState([]);

  const skus = Platform.select({
    ios: ["7days", "30days", "1year"],
    android: [
      "unlimited_access_for_1week",
      "unlimited_access_for_1month",
      "unlimited_access_for_1year",
    ],
  });

  const itemSubs = Platform.select({
    ios: ["7days", "30days", "1year"],
    android: [
      "unlimited_access_for_1week_sub",
      "unlimited_access_for_1month_sub",
      "unlimited_access_for_1year_sub",
    ],
  });

  const getProducts = React.useCallback(async () => {
    if (Platform.OS === "ios") {
      RNIap.clearProductsIOS();
    }
    try {
      await RNIap.initConnection();
    } catch (err) {
      customToastMsg(err.message);
    }

    // It will be called when we click on any subscription to purchase
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase.transactionReceipt
          ? purchase.transactionReceipt
          : purchase.originalJson;
        let allowedDaysforsubscription = 365;
        if (purchase.productId == "boost_ad_30") {
          allowedDaysforsubscription = 30;
        } else if (purchase.productId == "boost_ad_for_7days") {
          allowedDaysforsubscription = 7;
        }

        if (receipt) {
          try {
            const ackResult = await finishTransaction(purchase).then(() => {
              boosts(allowedDaysforsubscription, dispatch, id);
              navigation.navigate("Home");
            });
          } catch (ackErr) {
            customToastMsg(ackErr.message);
          }
        }
      }
    );

    //it will called when user cancel the purchase request
    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      customToastMsg(
        `User has cancelled the operation manually. Please press "OK" to proceed.`
      );
    });

    //Fetch all Products
    const products = await RNIap.getProducts({ skus });
    console.log("products", products);
    products.forEach((product) => {
      product.type = "inapp";
    });

    const subscriptions = await RNIap.getSubscriptions({ skus: itemSubs });
    subscriptions.forEach((subscription) => {
      subscription.type = "subs";
    });

    console.log("subscriptions", JSON.stringify(subscriptions));
    subscriptions.sort(function (a, b) {
      return a.price - b.price;
    });
    let list = subscriptions.reverse();
    console.log("----subscriptions list----", JSON.stringify(list));

    setProductList(list);
  }, [productList]);

  React.useEffect(() => {
    getProducts();
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }

      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);

  const requestBuy = async (productId, offerToken) => {
    try {
      RNIap.requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [
            {
              sku: productId,
              offerToken: offerToken,
            },
          ],
        }),
      })
        .catch((err) => {
          console.log("error buying product", err);
        })
        .then(async (res) => {
          console.log("request subscription ", JSON.stringify(res));
          // handle/store response
        });
    } catch (err) {
      console.log("requestSubscription", "err is--", err);
      customToastMsg(err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={boostStyles.top_Header}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../images/back-button.png")}
              style={boostStyles.headerIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={boostStyles.top_HeaderRight}>
          <Text allowFontScaling={false} style={boostStyles.top_HeaderText}>
            Boost Ads & Plan options
          </Text>
        </View>
        {/* <View style={{ flex: 1, alignItems: "flex-end" }}></View> */}
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[boostStyles.content_view, { paddingBottom: 40 }]}>
          <Image
            style={boostStyles.icon}
            source={require("../images/boost-img.png")}
          />
          <Text allowFontScaling={false} style={boostStyles.TextWht}>
            Increase the reach of your audience by boosting your ads{" "}
          </Text>

          {productList?.map((product, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={boostStyles.ButtonStyle}
                onPress={() => {
                  if (Platform.OS == "android") {
                    requestBuy(
                      product.productId,
                      product.subscriptionOfferDetails[0]?.offerToken
                    );
                  } else {
                    requestBuy(product.productId, null);
                  }
                }}
              >
                <Text allowFontScaling={false} style={boostStyles.ButtonTxt}>
                  {product.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Boast;

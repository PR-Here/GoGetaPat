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
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";
import { useDispatch, useSelector } from "react-redux";

import { useAuthDispatch, useAuthState } from "../contexts/authContext";
import { setEnableBoostAd } from "../redux/actions/postScreenAction";
import { boosts } from "../services/api";
import customToastMsg from "../subcomponents/CustomToastMsg";
import { boostStyles } from "./BoostAdScreenStyles";
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const BoastPost = ({ navigation, route }) => {
  const dispatch = useAuthDispatch();
  const state = useAuthState();
  const dispatchPost = useDispatch();
  const { enableBoostAd } = useSelector((state) => state.postScreen);
  let id = state.loginedUser.id;
  const [productList, setProductList] = React.useState([]);

  const itemSkus = Platform.select({
    ios: ["boost_ad_for_7days", "boost_ad_30", "unlimited_access_for_1year"],
    android: [
      "unlimited_access_for_1week",
      "unlimited_access_for_1month",
      "unlimited_access_for_1year",
    ],
  });

  const itemSubs = Platform.select({
    ios: ["boost_ad_for_7days", "boost_ad_30", "unlimited_access_for_1year"],
    android: [
      "unlimited_access_for_1week_sub",
      "unlimited_access_for_1month_sub",
      "unlimited_access_for_1year_sub",
    ],
  });

  const getProducts = React.useCallback(async () => {
    RNIap.clearProductsIOS();
    try {
      const result = await RNIap.initConnection();
      // console.log('result', result);
    } catch (err) {
      // console.warn("12344", err.code, err.message);
      customToastMsg(err.message);
    }

    // It will be called when we click on any subscription to purchase
    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.info("purchase", purchase);
      const receipt = purchase.transactionReceipt
        ? purchase.transactionReceipt
        : purchase.originalJson;
      // console.info(receipt);

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
            dispatchPost(
              setEnableBoostAd({
                isActive: false,
                data: null,
              })
            );
            navigation.goBack();
          });
          // console.info('ackResult', ackResult);
        } catch (ackErr) {
          customToastMsg(ackErr.message);
        }
      }
    });

    //it will called when user cancel the purchase request
    purchaseErrorSubscription = purchaseErrorListener((error) => {
      // console.log('purchaseErrorListener', error);
      customToastMsg(
        `User has cancelled the operation manually. Please press "OK" to proceed.`
      );
    });

    //Fetch all Products
    const products = await RNIap.getProducts(itemSkus);
    products.forEach((product) => {
      product.type = "inapp";
    });

    const subscriptions = await RNIap.getSubscriptions(itemSubs);
    subscriptions.forEach((subscription) => {
      subscription.type = "subs";
    });

    // console.log('subscriptions', JSON.stringify(subscriptions));
    subscriptions.sort(function (a, b) {
      return a.price - b.price;
    });
    let list = subscriptions.reverse();

    setProductList(list);
  }, [productList]);

  React.useEffect(() => {
    getProducts();
    if (enableBoostAd.isActive) {
      if (state.loginedUser.post_count < 2) {
        dispatchPost(
          setEnableBoostAd({
            isActive: false,
            data: null,
          })
        );
      }
    }
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }

      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);

  // React.useEffect(async ()=>{
  //     // try {
  //     //     await RNIap.initConnection();
  //     //     if (Platform.OS === 'android') {
  //     //         await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
  //     //     } else {
  //     //         await RNIap.clearTransactionIOS();
  //     //     }
  //     // } catch (err) {
  //     //     customToastMsg(err.message);
  //     // }

  //     // It will be called when we click on any subscription to purchase
  //     purchaseUpdateSubscription = purchaseUpdatedListener(
  //         async (purchase) => {
  //             console.info('purchase', purchase);
  //             const receipt = purchase.transactionReceipt ? purchase.transactionReceipt : purchase.originalJson;
  //             // console.info(receipt);

  //             let allowedDaysforsubscription = 365;
  //             if(purchase.productId == "boost_ad_30"){
  //                 allowedDaysforsubscription = 30;
  //             } else if(purchase.productId == "boost_ad_for_7days"){
  //                 allowedDaysforsubscription = 7;
  //             }

  //             if (receipt) {
  //                 try {
  //                     const ackResult = await finishTransaction(purchase).then(()=>{
  //                         boosts(allowedDaysforsubscription, dispatch, id);
  //                         navigation.navigate("Home");
  //                     });
  //                     // console.info('ackResult', ackResult);
  //                 } catch (ackErr) {
  //                    customToastMsg(ackErr.message);
  //                 }

  //                 // this.setState({receipt}, () => this.goNext());
  //             }
  //         },
  //     );

  //     //it will called when user cancel the purchase request
  //     purchaseErrorSubscription = purchaseErrorListener(
  //         (error) => {
  //             customToastMsg(`User has cancelled the operation manually. Please press "OK" to proceed.`);
  //         //   Alert.alert('purchase error', JSON.stringify(error));
  //         },
  //     );

  //     // getItems();

  //     return () => {
  //         if (purchaseUpdateSubscription) {
  //             purchaseUpdateSubscription.remove();
  //             purchaseUpdateSubscription = null;
  //         }
  //         if (purchaseErrorSubscription) {
  //             purchaseErrorSubscription.remove();
  //             purchaseErrorSubscription = null;
  //         }
  //         RNIap.endConnection();
  //     };
  // });

  const getItems = async () => {
    try {
      const products = [];
      if (Platform.OS == "android") {
        products = await RNIap.getSubscriptions(itemSkus);
      } else {
        products = await RNIap.getProducts(itemSkus);
      }

      // console.log('Products', products);

      // sort by price
      var productByName = products.slice(0);
      productByName.sort(function (a, b) {
        return a.price - b.price;
      });

      setProductList(productByName);
    } catch (err) {
      customToastMsg(err.message);
    }
  };

  const requestSubscription = async (sku) => {
    try {
      RNIap.requestSubscription(sku);
    } catch (err) {
      customToastMsg(err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={boostStyles.top_Header}>
        {/* if(post>=2){ */}
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={boostStyles.headerIcon1}>Skip</Text>
            {/* <Image source={require('../images/back-button.png')} style={boostStyles.headerIcon} /> */}
          </TouchableOpacity>
        </View>
        {/* } */}

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
                style={boostStyles.ButtonStyle}
                onPress={() => {
                  requestSubscription(product.productId);
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

export default BoastPost;

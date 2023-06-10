import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions,Platform } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    fontBold, fontLight, fontRegular, fontSemiBold,
    themeColor, fontMediumTextColor, textInputBorderColor, fontMediumTextColor2, fontMediumTextColor3
} from './src/common/common';

const { width, height } = Dimensions.get('window');
import ToHideTab from './src/subcomponents/ToHideTab';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import HomeScreen from './src/screens/HomeScreen';
import PubPri from './src/screens/PubPri';
import PurSales from './src/screens/PurSales';
import InboxScreen from "./src/screens/InboxScreen";
import PostScreen from "./src/screens/PostScreen";
import AccountScreen from "./src/screens/AccountScreen";
import PostItemScreen from './src/screens/PostItemScreen';
import ItemDash from './src/screens/ItemDash';
// import Profile from './src/screens/Pofile';
import SellingScreen from './src/screens/SellingScreen';
import Post from './src/screens/Post';
import Posted from './src/screens/Posted'
import SearchScreen from './src/screens/SearchScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SavedItems from './src/screens/SavedItems';
import Accsetting from './src/screens/Accsetting';
import Boost from './src/screens/BoostAdScreen';
import BoostPost from './src/screens/BoostPostScreen';
import HelpCenter from './src/screens/HelpCenter';
import Archived from './src/screens/Archived';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarLabel: ({ focused, color, size }) => {
                    let iconTitle;
                    let iconName = focused

                    if (route.name === 'Home') {
                        iconTitle = "Home"

                    }
                    else if (route.name === 'Inbox') {
                        iconTitle = "Inbox"

                    }
                    else if (route.name === 'PostItemHide') {
                        iconTitle = "Post"
                    }
                    else if (route.name === 'Selling') {
                        iconTitle = "Selling"

                    }
                    else if (route.name === 'Account') {
                        iconTitle = 'Account'

                    }

                    return <Text style={iconName = focused ?
                        { fontSize: wp("4%"), paddingTop: 10, paddingBottom: 15, color: themeColor }
                        :
                        { fontSize: wp("4%"), paddingTop: 10, paddingBottom: 15, color: "black" }} >
                        {iconTitle}
                    </Text>;

                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused
                            ? require("./src/images/home-inactive.png")
                            : require("./src/images/home-active.png")
                    }
                    else if (route.name === 'Inbox') {
                        iconName = focused
                            ? require("./src/images/inbox-active.png")
                            : require("./src/images/inbox-inactive.png")
                    }
                    else if (route.name === 'PostItemHide') {
                        iconName = focused
                            ? require("./src/images/post-active.png")
                            : require("./src/images/post-inactive.png")

                    }
                    else if (route.name === 'Selling') {
                        iconName = focused
                            ? require("./src/images/selling-active.png")
                            : require("./src/images/selling-inactive.png")
                    }
                    else if (route.name === 'Account') {
                        iconName = focused
                            ? require("./src/images/account-active.png")
                            : require("./src/images/account-inactive.png")
                    }

                    return (
                        <View style={[styles.tab_nav_Image, {
                            paddingTop: focused ? hp("0.5%") : hp("1%"),
                            marginBottom: focused ? -hp("0.5%") : -hp("0.8%"),
                            borderTopWidth: focused ? 5 : null
                        }]}>
                            <Image
                                source={iconName}
                                style={{
                                    height: hp("5.5%"),
                                    width: wp("7%"),
                                    resizeMode: "contain"
                                }}
                            />
                        </View>
                    )
                },
                tabBarStyle: Platform.OS=="ios"? {
                    height: hp("13%"),
                    marginTop: hp("1%")
                } : {
                    height: hp("10%"),
                    marginTop: hp("1%"),
                },
                tabBarHideOnKeyboard : true,
                // tabBarActiveBackgroundColor : "#fbfbfb",
                headerShown: false,
                
            }
            )}
        >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Selling" component={SellingScreen} />
            <Tab.Screen name="PostItemHide" component={ToHideTab}    />
            <Tab.Screen name="Inbox" component={InboxScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    )
}

const MainNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        {/* initialRouteName="TabNavigator"  */}
        {/* <> */}
        {/* Screens those are having Drawer nav and bottom tabs */}
        <Stack.Screen name="Initial" component={TabNavigator} />
        <Stack.Screen name="Post Item" component={Post} initialParams={{ true: false }}/>
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Message" component={ChatScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ItemDash" component={ItemDash} />
        <Stack.Screen name="Posted" component={Posted} />
        <Stack.Screen name="Pursales" component={PurSales} />
        <Stack.Screen name="Saveditems" component={SavedItems} />
        <Stack.Screen name="Accsetting" component={Accsetting} />
        <Stack.Screen name="Boost" component={Boost} />
        <Stack.Screen name="BoostPost" component={BoostPost} />
        <Stack.Screen name="Pubpri" component={PubPri} />
        <Stack.Screen name="Helpcenter" component={HelpCenter} />
        <Stack.Screen name="Archived" component={Archived} />
        {/* </> */}
        {/* Screens those are not having Drawer nav and bottom tabs */}
    </Stack.Navigator>
);

export default MainNavigator;

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#fff",
        flex: 1,
        // paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
    profile_view: {
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        paddingVertical: 5
    },
    profile_img: {
        width: hp('10%'),
        height: hp('10%'),
        borderRadius: hp("50%"),
        resizeMode: 'cover',
    },
    profile_img_upload: {
        width: wp('13%'),
        height: hp('8%'),
        marginBottom: 20,
        resizeMode: 'contain',
        position: "absolute",
        bottom: 5,
        right: 22
    },
    content_view: {
        paddingHorizontal: wp("4.5%")
    },
    profile_Link: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: "center"
    },
    profile_Link_img: {
        resizeMode: "contain",
        height: 30,
        width: 30
    },
    profile_Link_Text: {
        fontSize: 15,
        color: fontMediumTextColor2,
        paddingLeft: 10,
        fontWeight: "bold"
    },
    inner_content_view: {
        paddingBottom: 40,
        // paddingHorizontal: 8
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
    txtStyle1: {
        fontFamily: fontBold,
        marginBottom: 8,
        fontSize: wp("8%")
    },
    txtStyle2: {
        textAlign: "center",
        fontFamily: fontLight,
        color: fontMediumTextColor,
        marginBottom: 40,
        fontSize: wp("5%")
    },
    top_Header: {
        padding: 12,
        paddingHorizontal: 15,
        justifyContent: "space-between",
        backgroundColor: themeColor,
        flexDirection: "row",
        alignItems: "center",
    },
    top_HeaderRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    top_HeaderText: {
        fontSize: wp("6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: "#fff"
    },
    form_input: {
        color: fontMediumTextColor,
        borderBottomWidth: 1,
        borderColor: textInputBorderColor,
        marginTop: 20,
        marginBottom: 5
    },
    verified_Code: {
        position: "absolute",
        right: 0,
        bottom: 13.5,
        fontSize: wp("5%"),
        color: "#16D800"
    },
    tab_nav_Image: {
        width: wp('20%'),
        justifyContent: "center",
        alignItems: "center",
        borderTopColor: themeColor,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    }
});
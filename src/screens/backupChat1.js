import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Image, Text, FlatList, SafeAreaView, AppState, Dimensions } from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    fontBold, fontSemiBold, grayBorderColor,
    themeColor, fontMediumTextColor2, headerColor
} from '../common/common';

import { CustomLoginPopup } from '../subcomponents/CustomLoginPopup';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuthDispatch, useAuthState } from '../contexts/authContext'
import { fetchAllChat, fetchUserDetail } from '../services/api';
import { useHomeDispatch, useHomeState } from '../contexts/HomeContext';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import { setChatScreenFocused } from '../redux/actions/activeScreenAction';
const { width: windowWidth, height: windowHeight } = Dimensions.get("screen");

const ChatData = [
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Lisa Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 1, LastActive: "1 Hour ago", price: 6000, bidPrice: 5000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Monika Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 2, LastActive: "1 Hour ago", price: 6000, bidPrice: 3000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Lisa Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 3, LastActive: "2 Hour ago", price: 4500, bidPrice: 4000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Monika Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 4, LastActive: "2 Hour ago", price: 4500, bidPrice: 4000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Lisa Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 5, LastActive: "2 Hour ago", price: 6000, bidPrice: 3000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Monika Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 6, LastActive: "2 Hour ago", price: 4500, bidPrice: 4000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Lisa Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 7, LastActive: "2 Hour ago", price: 6000, bidPrice: 3000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Monika Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 8, LastActive: "2 Hour ago", price: 6000, bidPrice: 3000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Lisa Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 9, LastActive: "2 Hour ago", price: 4500, bidPrice: 4000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Monika Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 10, LastActive: "2 Hour ago", price: 6000, bidPrice: 3000 },
    { Img: require("../images/img-for-chat.png"), Name: "Dr. Lisa Sparks", Message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, harum.", AnimalImage: require("../images/cat.png"), UserId: 11, LastActive: "2 Hour ago", price: 6000, bidPrice: 3000 },
]



const MessageScreen = ({ navigation, dispatch }) => {
    const appState = React.useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = React.useState(appState.current);

    let authDispatch = useAuthDispatch()
    let authState = useAuthState()
    let homeState = useHomeState()
    let homeDispatch = useHomeDispatch()
    const [userDetail, setUserDetail] = useState("")
    // const [fullData, setFullData] = useState(ChatData);
    // const [fullData1, setFullData1] = useState(ChatData);

    var readChatMessageFromUserCheck = database().ref(`Chats`);

    let fetchChat = () => {

        fetchAllChat()
            .then((res) => { return res.json() })
            .then(res => {
                // console.log("alf")
                homeDispatch({ type: "CLEAR_CHAT_USER_INFO" })
                res?.chat.map((item, index, arr) => {
                    if (authState?.loginedUser) {
                        if (authState.loginedUser?.id == item.from_user) {
                            homeDispatch({
                                type: "SET_CHAT_USER_INFO",
                                payload: {
                                    "id": item.id,
                                    "userId": item.to_user,
                                    "uuid": item.uuid,
                                    "userName": item.to_user_name,
                                    "photoUrl": item.to_user_image ? `https://gogetapet.com/public/storage/${item?.to_user_image}` : null,
                                    "message": item.message_text,
                                    "created": item.created,
                                    "messageObj": item

                                }
                            })
                            // setUserDetail(res.data)
                        }
                        if (authState.loginedUser?.id == item.to_user) {
                            // homeDispatch({ type: "CLEAR_CHAT_USER_INFO" })
                            homeDispatch({
                                type: "SET_CHAT_USER_INFO",
                                payload: {
                                    "id": item.id,
                                    "userId": item.from_user,
                                    "uuid": item.uuid,
                                    "userName": item.from_user_name,
                                    "photoUrl": item.from_user_image ? `https://gogetapet.com/public/storage/${item?.from_user_image}` : null,
                                    "message": item.message_text,
                                    "created": item.created,
                                    "messageObj": item

                                }
                            })
                        }
                    }

                })
            }
            )
            .catch(err => {
                console.log(err)

            })
    }

    useEffect(() => {
        if (authState.loginedUser) {
            if (authState?.loginedUser?.id) {
                try {
                    readChatMessageFromUserCheck.on('child_changed', (snapshot, prevChildKey) => {
                        // console.log('hi')
                        const newMessage = snapshot.val();
                        if (newMessage) {
                            // fetchChat()
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }

        return (() => {
            try {
                if (authState.loginedUser) {
                    if (authState?.loginedUser?.id) {
                        readChatMessageFromUserCheck.off()
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })
    }, [])

    React.useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                // fetchChat();
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // if (authState?.userToken) {
            // fetchChat()
            // setFullData1(dataResp)
            // }
        })

        return () => {
            unsubscribe();
        }
    }, [navigation]);


    // useEffect(() => {
    //     // console.log(homeState.notificationToggler, 'toggler ')
    //     fetchChat();
    // }, [homeState.notificationToggler])

    const handleSingleChat = (item) => {
        dispatch(setChatScreenFocused({
            isActive: true,
            userInfo: {
                ...item
            }
        }))
        navigation.navigate("Message", { item })
    }

    const flatListOptimizationProps = {
        initialNumToRender: 0,
        maxToRenderPerBatch: 1,
        removeClippedSubviews: true,
        scrollEventThrottle: 16,
        // windowSize: 3,

        keyExtractor: (data, index) => index,
        getItemLayout: useCallback(
            (_, index) => ({
                index,
                length: windowWidth,
                offset: index * windowWidth,
            }),
            []
        ),
    };

    useEffect(() => {
        let unsubscribe = ()=>{}
        if(authState.loginedUser?.id){
        const docid = authState.loginedUser?.id;
        unsubscribe = firestore()
          .collection('Chat_History')
          // add this
          .doc(docid.toString())
          .collection('sender')
        //   .orderBy('latestMessage.createdAt', 'desc')
          .onSnapshot(querySnapshot => {
            const threads = querySnapshot.docs.map(documentSnapshot => {
            
            return documentSnapshot.data()
            //   return {
            //     _id: documentSnapshot.id,
            //     name: '',
            //     // add this
            //     latestMessage: {
            //       text: ''
            //     },
            //     // ---
            //     ...documentSnapshot.data()
            //   };
            });
            
            console.log(threads)
            setUserDetail(threads);
      
            // if (loading) {
            //   setLoading(false);
            // }
          });
        }
        return () => unsubscribe();
      }, [authState.loginedUser]);

    const renderInbox = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity
                key={Math.random()} onPress={() => { handleSingleChat(item) }}>
                <View style={styles.chat_Inner_Wrapper}>
                    <View>
                        <Image source={item?.photoUrl ? { uri: item?.photoUrl } : require("../images/defaultProfile.png")} style={styles.chat_Img} />
                    </View>

                    <View style={{ flex: 1, padding: 12 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.chat_Name}>{item.userName}</Text>
                            <View>
                                {
                                    homeState.notificationUser && homeState.notificationUser.map((fromUser, index) => {
                                        if (item.messageObj.from_user == fromUser) {
                                            {/* console.log("true") */ }
                                            return <View key={Math.random()} style={{
                                                position: "absolute",
                                                backgroundColor: "red",
                                                marginLeft: 10,
                                                marginTop: 2,
                                                height: 20,
                                                paddingHorizontal: 5,
                                                borderRadius: 50,
                                                top: 0,
                                            }}>
                                                <Text style={{
                                                    color: "#fff",
                                                    fontFamily: fontBold
                                                }}>New</Text>
                                            </View>
                                        } else {
                                            return <React.Fragment key={Math.random()}></React.Fragment>
                                        }
                                    })
                                }
                            </View>
                        </View>
                        <Text style={[styles.chat_Message, homeState.notificationUser.includes(item.messageObj.from_user.toString()) ? {} : { fontWeight: "normal" }]} numberOfLines={1}>{item.message}</Text>
                        <Text style={styles.lastScene} numberOfLines={1}>{item?.LastActive}</Text>
                    </View>
                    <Image source={item.AnimalImage} style={styles.chat_Img} />
                    {/* <View style={{ position: "absolute", backgroundColor: "red", height: 20, width: 20, borderRadius: 50, top: 0, right: 0 }}></View> */}

                </View>
            </TouchableOpacity>
        )
    }, [homeState.chatUserInfo])


    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* {console.log(homeState.notificationUser, "klsjdf lkjsdflkja  j")} */}
            <FlatList
                data={homeState.chatUserInfo}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderInbox}
                style={{ paddingHorizontal: wp("4%") }}
                // {...flatListOptimizationProps}
                ListEmptyComponent={() => <Text style={[styles.chat_Message, { marginTop: hp("35"), textAlign: "center", fontSize: 23, marginLeft: wp(6) }]}>
                    No contacts found
                </Text>
                }
            />

        </View>

    );
}

// function NotificationScreen({ navigation }) {

//     const [fullData, setFullData] = useState(ChatData);

//     const handleSingleChat = (item) => {
//         navigation.navigate("Message", { item: item })

//     }
//     return (
//         <View style={{ flex: 1, backgroundColor: "#fff" }}>
//             <FlatList
//                 data={fullData}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({ item, index }) => (
//                     <View key={item + index} >
//                         <View style={styles.chat_Inner_Wrapper}>
//                             <Image source={item.AnimalImage} style={styles.chat_Img} />
//                             <View style={{ flex: 1, padding: 12, flexDirection: "column", justifyContent: "space-between" }}>
//                                 <Text style={styles.chat_Message}>{item.Name}</Text>
//                                 <Text style={styles.chat_Message} numberOfLines={1}>${item.price}</Text>
//                                 <View style={{ flexDirection: 'row' }}>
//                                     <Text style={styles.bidPrice} numberOfLines={1}>Bid price{item.bidPrice}</Text>
//                                     <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center' }}>
//                                         <TouchableOpacity style={styles.ButtonStyle} onPress={() => navigation.navigate("Message")}>
//                                             <Text style={styles.ButtonTxt}>Accept Offer</Text>
//                                         </TouchableOpacity>
//                                         {/* <View style={{ flex: 1, justifyContent: "center", elevation: 14, backgroundColor: 'red' }} > */}
//                                         <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate("Message")}>
//                                             <Image source={require("../images/msg.png")} style={styles.Img} />
//                                         </TouchableOpacity>
//                                         {/* </View> */}
//                                     </View>
//                                 </View>
//                             </View>
//                             {/* <Image source={item.AnimalImage} style={styles.chat_Img} /> */}


//                         </View>
//                     </View>
//                 )}
//                 style={{ paddingHorizontal: wp("4%") }}

//             />

//         </View>

//     );

// }

// const Tab = createMaterialTopTabNavigator();

const InboxScreen = ({ navigation, route }) => {
    let authState = useAuthState()
    const [popup, setPopup] = useState(true);
    const dispatch = useDispatch();
    const { activeScreen } = useSelector(state => state)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (authState?.userToken == null || authState?.userToken == undefined || authState?.userToken == "") {
                setPopup(true);
            }
            else {
                dispatch(setChatScreenFocused({
                    isActive: false,
                    userInfo: null
                }))
                setPopup(false);
            }

        })
        return () => {
            unsubscribe();
        }
    }, [navigation, authState?.userToken]);
 
    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* {console.log(activeScreen.chatScreenFocused, "inbox")} */}

            {
                authState.userToken ?
                    <>
                        <View style={styles.top_Header}>
                            <View style={styles.top_HeaderRight}>
                                <Text allowFontScaling={false} style={styles.top_HeaderText}>Inbox</Text>
                            </View>
                        </View>
                        {/* 
                    <Tab.Navigator
                        initialRouteName="Home"

                        screenOptions={({ route }) => ({
                            tabBarLabel: ({ focused, color, size }) => {
                                let iconTitle;
                                let iconName = focused

                                if (route.name === 'Messages') {
                                    iconTitle = "Messages"

                                }
                                else if (route.name === 'Notifications') {
                                    iconTitle = "Notifications"

                                }

                                return <Text style={iconName = focused ?
                                    { fontSize: wp("5%"), fontFamily: fontBold, fontWeight: "bold", paddingTop: 5, paddingBottom: 5, color: themeColor, }
                                    :
                                    { fontSize: wp("5%"), fontFamily: fontBold, fontWeight: "bold", paddingTop: 5, paddingBottom: 5, color: "black" }} >
                                    {iconTitle}
                                </Text>;
                            }

                        })}
                        tabBarOptions={{
                            activeBackgroundColor: themeColor,

                            keyboardHidesTabBar: true,
                            style: {
                                height: hp("8%"),
                                marginBottom: -hp("1%")
                            }
                        }}
                    >
                        <Tab.Screen name="Messages" component={MessageScreen} />
                        <Tab.Screen name="Notifications" component={NotificationScreen} />
                    </Tab.Navigator> */}
                        <MessageScreen navigation={navigation} dispatch={dispatch} />
                    </>
                    :
                    popup ?
                        <CustomLoginPopup toggle={popup} setPopup={setPopup} name="Access Denied" btnName1="Cancel" btnName2="Login"
                            alertText="Please login to access this funcationality." btn2Action={() => navigation.navigate("SignIn")} />
                        :
                        <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
                            <Text style={styles.blankScreen}> You are not authorized to access this feature. {"\n"}Please login!</Text>
                        </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    ButtonTxt: {
        fontSize: wp("3%"),
        fontWeight: "bold",
        fontFamily: fontBold,
        color: "#fff",
        textAlign: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    ButtonStyle: {

        backgroundColor: themeColor,
        borderRadius: 5,
        width: wp("27.5%"),
        height: hp("4%"),
        flexDirection: "row",
        elevation: 7,
        justifyContent: "center",
    },
    mainContainer: {
        backgroundColor: "#fff",
        flex: 1,
        // paddingTop: (Platform.OS === 'ios') ? 20 : 0,

    },


    top_Header: {
        paddingVertical: wp("3%"),

        justifyContent: "space-between",
        backgroundColor: headerColor,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: wp("3.5%")
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
        color: themeColor
    },


    heading_Main: {
        fontSize: wp("4.5%"),
        fontFamily: fontSemiBold,
        fontWeight: "bold"
    },
    chat_Inner_Wrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: grayBorderColor,
        paddingVertical: hp('0.5%'),
        borderBottomWidth: 2,
        // backgroundColor: 'blue'
    },
    chat_Img: {
        height: hp("8%"),
        width: hp("8%"),
        resizeMode: "contain",

    },
    Img: {

        height: hp("3%"),
        width: hp("3%"),
        resizeMode: "cover",
        alignSelf: "center",


    },
    chat_Name: {
        color: themeColor,
        fontSize: wp("4.5%"),
        fontWeight: "bold"
    },
    bidPrice: {
        fontFamily: fontBold,
        color: themeColor,
        width: '50%',
        // paddingRight: wp("10%"),
        fontWeight: "bold",
        // backgroundColor: 'green'
    },
    chat_Message: {
        fontFamily: fontBold,
        color: "#000000",
        paddingRight: 40,
        fontWeight: "bold"
    },
    lastScene: {
        fontFamily: fontBold,
        color: fontMediumTextColor2,
        paddingRight: 40,
        paddingTop: 5

    },
    blankScreen: {
        fontSize: wp("6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center"
    }

});
export default InboxScreen;
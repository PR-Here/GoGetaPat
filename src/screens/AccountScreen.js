import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Image, Text, FlatList, TouchableWithoutFeedback, SafeAreaView, TextInput, PermissionsAndroid, Modal, TouchableOpacity,
    Linking, Platform
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    fontBold, fontLight, fontRegular, fontSemiBold, grayBorderColor,
    themeColor, fontMediumTextColor, headerColor, fontMediumTextColor3, fontLightTextColor
} from '../common/common';
import { locationName } from '../subcomponents/locationName';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthDispatch, useAuthState } from '../contexts/authContext';
import ImagePicker from 'react-native-image-crop-picker';
import { requestLocationPermission } from "../subcomponents/latLong"
import customToastMsg from '../subcomponents/CustomToastMsg';
import { CustomLoginPopup } from '../subcomponents/CustomLoginPopup';
import DeviceInfo from 'react-native-device-info';
import { handleInvite } from '../subcomponents/Invite';
import { signOut } from "../services/authServices";

// or ES6+ destructured imports

import { getUniqueId, getManufacturer } from 'react-native-device-info';

const activeStar = require("../images/star-active.png")
const inActiveStar = require("../images/star-inactive.png")


const AccountScreen = ({ navigation, route }) => {
    const dispatch = useAuthDispatch();
    let authState = useAuthState()
    let authDispatch = useAuthDispatch()
    let [latitude, setLatitude] = useState("")
    let [longitude, setLongitude] = useState("")
    let [state, setState] = useState()
    let [pin, setPin] = useState()
    let [city, setCity] = useState()
    let [check, setCheck] = useState()
    const [popup, setPopup] = useState(true);
    let readableVersion = DeviceInfo.getVersion();



    useEffect(() => {
        if (latitude && longitude) {
            setState("")
            setCity("")
            locationName(latitude, longitude, state, city, setState, setPin, setCity, setCheck)
        }
    }, [latitude, longitude])


    useEffect(() => {
        if (state?.length && city?.length) {
            fetch("https://gogetapet.com/api/api/store_lat_long", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.userToken}`
                },
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude,
                    address: `${state},${city}`
                }),
            })
                .then(response => response.json())
                .then(response => {
                    authDispatch({ type: "SIGN_IN_USER", loginedUser: response.data })
                })
                .catch(err => {
                    customToastMsg(err)
                })
        }

    }, [state, city])


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (authState?.userToken == null || authState?.userToken == undefined || authState?.userToken == "") {
                setPopup(true);
            }
            else {
                setPopup(false);
            }
        })
        return () => {
            unsubscribe();
        }
    }, [navigation]);

    const [fullData, setFullData] = useState({});
    const [starRating, setStarRating] = useState(3)
    const [stars, setStars] = useState(["star-inactive.png", "star-inactive.png", "star-inactive.png", "star-inactive.png", "star-inactive.png"])
    // signOut(dispatch, authState)


    return (
        <SafeAreaView showsHorizontalScrollIndicator={false} style={styles.mainContainer}>
            {
                authState.userToken ?
                    <>
                        <View style={styles.top_Header}>
                            <View style={{ flex: 1, alignItems: "flex-start", }}></View>
                            <View style={styles.top_HeaderRight}>
                                <Text allowFontScaling={false} style={styles.top_HeaderText}>Account</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }} >
                                <TouchableWithoutFeedback onPress={() => { navigation.navigate("Accsetting") }}>
                                    <Image source={require('../images/cog_settings.png')} style={styles.images} />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>


                        <View style={styles.chat_Inner_Wrapper}>
                            {/* {console.log(authState?.loginedUser)} */}
                            <View style={{ position: "relative", alignItems: "center" }}>
                                <Image source={authState?.loginedUser && authState?.loginedUser?.profile_image ? {
                                    uri: authState?.loginedUser?.profile_image}:
                               require("../images/defaultProfile.png")}


                                    // source={{
                                    //     uri: authState?.loginedUser?.profile_image
                                    // }} 
                                    resizeMode="cover" style={styles.chat_Img} />
                                <View style={{ position: "absolute", top: 0, right: 0 }}>
                                    <TouchableOpacity onPress={() => {
                                        ImagePicker.openPicker({
                                            // width: 300,
                                            // height: 400,
                                            cropping: true,
                                            freeStyleCropEnabled: true,
                                            mediaType: "photo",
                                            smartAlbums: ['PhotoStream', 'Generic', 'Panoramas', 'Videos', 'Favorites', 'Timelapses', 'AllHidden', 'RecentlyAdded', 'Bursts', 'SlomoVideos', 'UserLibrary', 'SelfPortraits', 'Screenshots', 'DepthEffect', 'LivePhotos', 'Animated', 'LongExposure']
                                        }).then(image => {
                                            var data = new FormData();
                                            data.append('profile_picture', {
                                                uri: image.path,
                                                name: image.path.split("/").pop(),
                                                type: image.mime
                                            });
                                            // console.log(data)

                                            fetch("https://gogetapet.com/api/api/change_profile_picture", {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',

                                                    'Content-Type': 'multipart/form-data;',
                                                    'Authorization': `Bearer ${authState?.userToken}`
                                                },
                                                body: data,
                                            })
                                                .then(response => response.json())
                                                .then(response => {
                                                    authDispatch({ type: "SIGN_IN_USER", loginedUser: response.data })
                                                })


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    }} style={{ width: wp("4.5%"), height: hp("3%"), overflow: "hidden", backgroundColor: "#ffffffe0", borderRadius: 3, justifyContent: "center" }}>
                                        <Image resizeMode="contain" style={{ width: wp("4%"), height: hp("3%"), alignSelf: "center" }} source={require('../images/edit.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {console.log(authState)}
                            {/* <Image source={require("../images/img-for-chat.png")} style={styles.chat_Img} /> */}
                            <View style={styles.wrp}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={styles.chat_Name}>{authState?.loginedUser?.name}</Text>

                                    <Image source={require('../images/verified.png')} style={{
                                        height: hp("3.7%"),
                                        width: wp("4..5%"),
                                        alignSelf: 'flex-end',
                                        resizeMode: "contain", marginLeft: 5
                                    }} />

                                </View>
                                <View style={{ flexDirection: "row", alignContent: "center" }}>
                                    <Text style={styles.chat_Message} >{authState?.loginedUser?.address}</Text>
                                    <TouchableOpacity onPress={() => {
                                        requestLocationPermission(setLatitude, setLongitude)
                                    }}>
                                        <Image resizeMode="contain" style={{ width: wp("4%"), height: hp("4%") }} source={require('../images/edit.png')} />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {stars.map((currentValue, index) => {
                                        if (index < authState?.loginedUser?.user_rating) {
                                            return (
                                                <Image key={index} source={activeStar} style={styles.strRat} />
                                            )
                                        }
                                        return (
                                            <Image key={index} source={inActiveStar} style={styles.strRat} />
                                        )
                                    }
                                    )}
                                    <Text style={styles.Rating}>({authState?.loginedUser?.user_rating_count > 0 ? authState?.loginedUser?.user_rating_count : 0})</Text>
                                </View>
                            </View>
                        </View>

                        <ScrollView showsHorizontalScrollIndicator={false}>
                            <SafeAreaView style={styles.content_view}>
                                <View style={styles.contBox}>

                                    <Text style={styles.headingBox}>Transactions</Text>
                                    <TouchableOpacity style={styles.leftBox} onPress={() => { navigation.navigate("Pursales") }}>
                                        <Text style={styles.cont_Box}>Purchases & Sales</Text>
                                        <Image style={styles.icon} source={require('../images/purchases.png')} />
                                    </TouchableOpacity>
                                    {/* <View style={styles.leftBox}>
                                    <Text style={styles.cont_Box}>Payment & deposit method</Text>
                                    <Image style={styles.icon} source={require('../images/card.png')} />
                                </View> */}
                                    <View style={styles.border_btm}></View>
                                </View>



                                <View style={styles.contBox}>
                                    <Text style={styles.headingBox}>Saves</Text>
                                    <TouchableOpacity style={styles.leftBox} onPress={() => {
                                        navigation.navigate("Saveditems")
                                    }}>
                                        <Text style={styles.cont_Box}>Saved items</Text>
                                        <Image style={styles.icon} source={require('../images/Save-items.png')} />
                                    </TouchableOpacity>
                                    {/* <View style={styles.leftBox}>
                                <Text style={styles.cont_Box}>Search alerts</Text>
                                <Image style={styles.icon} source={require('../images/search-alerts.png')} />
                            </View>*/}
                                    <View style={styles.border_btm}></View>
                                </View>
                                <View style={styles.contBox}>

                                    <Text style={styles.headingBox}>Account</Text>
                                    <TouchableOpacity style={styles.leftBox} onPress={() => { navigation.navigate("Accsetting") }}>
                                        <Text style={styles.cont_Box}>Account Settings</Text>
                                        <Image style={{
                                            height: wp("6.5%"),
                                            width: wp("6%"), marginRight: wp("0.5%"),
                                            resizeMode: "contain"
                                        }} source={require('../images/settings-black.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.leftBox} onPress={() => { navigation.navigate('Pubpri') }}>
                                        <Text style={styles.cont_Box}>Public Profile</Text>
                                        <Image style={{
                                            height: wp("5.5%"),
                                            width: wp("5%"), marginRight: wp("1%"),
                                            resizeMode: "contain"
                                        }} source={require('../images/account-inactive.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.leftBox} onPress={() => handleInvite()}>
                                        <Text style={styles.cont_Box}>Invite Friends</Text>
                                        {/* <Image style={{
                                            height: wp("5.5%"),
                                            width: wp("5%"), marginRight: wp("1%"),
                                            resizeMode: "contain"
                                        }} source={require('../images/account-inactive.png')} /> */}
                                    </TouchableOpacity>
                                    {/* <View style={styles.leftBox}>
                                <Text style={styles.cont_Box}>Custom Profile Link</Text>
                                <Image style={styles.icon} source={require('../images/link.png')} />
                            </View> */}
                                    <TouchableOpacity style={styles.leftBox} onPress={() => { navigation.navigate('Boost') }}>
                                        <Text style={styles.cont_Box}>Boost ad & plan options</Text>
                                        <Image style={styles.icon} source={require('../images/Promote.png')} />
                                    </TouchableOpacity>
                                    <View style={styles.border_btm}></View>
                                </View>



                                <View style={styles.contBox}>

                                    <Text style={styles.headingBox}>Help</Text>
                                    <TouchableOpacity style={styles.leftBox} onPress={() => {
                                        navigation.navigate('Helpcenter')
                                    }}>
                                        <Text style={styles.cont_Box}>Help center</Text>
                                        <Image style={styles.icon} source={require('../images/qus.png')} />
                                    </TouchableOpacity>
                                    {/* <View style={styles.leftBox}>
                                <Text style={styles.cont_Box}>Community actions</Text>
                                <Image style={styles.icon} source={require('../images/action.png')} />
                                </View>*/}
                                 <View style={{justifyContent:"space-between", flexDirection:"row"}}>
                                    <Text style={styles.cont_Box}>Version</Text>
                                    <Text style={styles.cont_Box}>{readableVersion}</Text>
                                </View> 
                                </View>
                            </SafeAreaView>
                        </ScrollView>
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
};

const styles = StyleSheet.create({
    border_btm: {
        backgroundColor: grayBorderColor,
        width: wp("90%"),
        height: 1
    },
    contBox: {
        flexDirection: 'column',
        alignContent: 'center',
    },
    leftBox: {
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingVertical: hp("0.65%")
    },
    headingBox: {
        paddingTop: hp("4%"),
        paddingVertical: hp("0.75%"),
        fontFamily: fontBold,
        fontWeight: 'bold',
        fontSize: hp("2.5%")
    },
    cont_Box: {
        fontFamily: fontSemiBold,
        fontSize: hp("2.25%")
    },
    icon: {
        height: wp("7%"),
        width: wp("6.5%"),
        resizeMode: "contain"
    },
    Rating: {
        paddingLeft: 5,
        paddingTop: wp("0.80%"),
        color: fontMediumTextColor
    },
    strRat: {
        height: wp("7%"),
        width: wp("4%"),
        resizeMode: "contain"
    },
    wrp: {
        flex: 1,
        flexDirection: "column",
        alignContent: 'center',
        marginLeft: wp("5%")
    },
    content_view: {
        flex: 1,
        alignContent: 'center',
        paddingHorizontal: wp("5%"),
    },
    chat_Inner_Wrapper: {
        paddingTop: 10,
        flexDirection: "row",
        alignContent: 'center',
        paddingHorizontal: wp("5%"),
    },
    chat_Img: {
        height: hp("9%"),
        width: hp("9%"),
        resizeMode: "cover",
        alignContent: 'center'
    },
    chat_Name: {
        color: fontMediumTextColor3,
        fontSize: wp("4.5%"),
        fontWeight: "bold"

    },
    chat_Message: {
        fontFamily: fontLight,
        color: fontMediumTextColor,
        paddingRight: wp("5%"),
        fontWeight: "bold",
        alignContent: "center",
        alignSelf: "center"
    },
    mainContainer: {
        backgroundColor: "#fff",
        flex: 1,
        // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    images: {
        height: wp("6%"),
        width: wp("6%"),
        alignSelf: 'flex-end',
        resizeMode: "contain"
    },
    top_Header: {
        paddingVertical: wp("3.5%"),
        flexDirection: "row",
        justifyContent: 'space-between',
        backgroundColor: headerColor,
        paddingHorizontal: wp("3.5%"),
    },
    top_HeaderText: {
        fontSize: wp("6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: themeColor
    },
    bottom_HeaderText: {
        fontSize: wp("4%"),
        fontWeight: "normal",
        color: themeColor
    },
    blankScreen: {
        fontSize: wp("6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center"
    }
})


export default AccountScreen;
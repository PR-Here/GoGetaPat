import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    fontBold, fontRegular, themeColor,
} from '../common/common';

import customToastMsg from '../subcomponents/CustomToastMsg';

const openWhatsApp = () => {
    let url = "whatsapp://send?&phone=13055051500";

    Linking.openURL(url)
        .then(data => {
            // console.log("WhatsApp Opened successfully " + data);  //<---Success
        })
        .catch(() => {
            customToastMsg("Make sure WhatsApp installed on your device");  //<---Error
        });
}

const openEmail = () => {
    Linking.openURL('mailto:gogetapet@outlook.com')
        .then(data => {
            //Success
        })
        .catch((error) => {
            customToastMsg(error.message);  //<---Error
        });
}

const openPhoneCall = () => {
    Linking.openURL(`tel:13055051500`)
        .then(data => {
            //Success
        })
        .catch((error) => {
            customToastMsg(error.message);  //<---Error
        });
}

const openMsgApp = () => {
    Linking.openURL(`sms:13055051500`)
        .then(data => {
            //Success
        })
        .catch((error) => {
            customToastMsg(error.message);  //<---Error
        });
}

const HelpCenter = ({ navigation, route }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} >
            <View style={styles.top_Header}>
                <View style={{ flex: 1, }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image source={require('../images/back-button.png')} style={styles.headerIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.top_HeaderRight}>
                    <Text allowFontScaling={false} style={styles.top_HeaderText}>Help Center</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end", }}></View>
            </View>
            <View style={styles.content_view}>
                <Image source={require('../images/help-img.png')} style={styles.Icon} />
                {/* removed after client side update */}
                {/* <Image source={require('../images/address.png')} style={styles.addressIcon} /> */}
                {/* <Text style={styles.TextPri}>Address</Text>
                <Text style={[styles.TextPri, styles.addressText]}>
                    8390 SW 97th Ave {"\n"}Miami, Florida 33173-4062{"\n"}United States
                </Text> */}

                <View style={styles.btnsView}>
                    <TouchableOpacity onPress={() => openEmail()}>
                        <Image source={require('../images/email2.png')} style={styles.addressIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openPhoneCall()}>
                        <Image source={require('../images/telephone2.png')} style={styles.addressIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openMsgApp()}>
                        <Image source={require('../images/msgicon.png')} style={styles.addressIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    top_HeaderRight: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    top_HeaderText: {
        fontSize: wp("6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: themeColor,
    },
    headerIcon: {
        height: hp("8%"), width: wp("14%"), resizeMode: "contain"
    },
    addressIcon: {
        marginHorizontal: wp("3.5%"),
        marginVertical: hp("2.5%"),
        height: wp("13%"),
        width: wp("13%"),
        alignSelf: "center",
        resizeMode: "cover",
    },
    Icon: {
        height: wp("50%"),
        width: wp("50%"),
        resizeMode: "contain",
        marginLeft: wp("3%"),
        alignSelf: "center"
    },
    content_view: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: wp("7.5%"),
        justifyContent: "center",
        flexDirection: "column",
        paddingHorizontal: wp("5%")
    },
    top_Header: {
        paddingHorizontal: wp("4%"),
        paddingVertical: 0,
        backgroundColor: "#F0F8FF",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    TextPri: {
        marginBottom: hp("1.2%"),
        fontSize: wp("6.5%"),
        fontWeight: "bold",
        fontFamily: fontRegular,
        color: "#000",
        alignSelf: "center",
        lineHeight: 30
    },
    addressText: {
        color: themeColor,
        fontSize: wp("5.5%"),
        textAlign: "center"
    },
    btnsView: {
        marginVertical: hp('2%'),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});


export default HelpCenter;
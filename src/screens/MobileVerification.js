import React, { useState } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity,
    Keyboard,
    TouchableHighlight,
    TextInput, Input, Button
} from 'react-native';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import { signIn } from '../services/authServices';
import { useAuthDispatch } from '../contexts/authContext';

import {
    fontLight, themeColor, fontMediumTextColor, fontMedium, fontSemiBold,
    fontMediumTextColor3, fontLightTextColor, fontRegular, screenWidth, fontMediumTextColor2, textInputBorderColor
} from '../common/common';

import { FloatingLabelInput } from 'react-native-floating-label-input';
import { color } from 'react-native-reanimated';


const lables = {
    fontSizeFocused: wp("3.5%"),
    fontSizeBlurred: wp("4.5%"),
    colorFocused: fontMediumTextColor3,
    colorBlurred: fontMediumTextColor2,
}

const inputStyles = {
    paddingTop: 10,
    paddingBottom: 0,
    fontSize: wp("4.5%")
}




const MobileVerification = async (navigation) => {


    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.content_view}>
                <Text style={styles.HeadingText}>Verification</Text>
                <Text style={styles.SubHeadingText}>We have sent an otp code to:</Text>
                <Text style={styles.HeadingTextColour}>{mobileno}</Text>

                <View style={styles.headingView} />



            </View>


        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: "#6698e8"
    },

    logo_view: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,

    },
    logoStyle: {
        width: wp('41%'),
        height: hp('16%'),
        resizeMode: 'contain',
        marginBottom: 20,
    },
    content_view: {
        marginTop: hp('10%'),
        paddingHorizontal: wp('10%'),
        backgroundColor: "#FFFFFF",
        shadowColor: "#eceef5",
        borderRadius: 40,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.65,

        elevation: 12,
    },
    input: {
        backgroundColor: "#FFFFFF",
        height: hp('7%'),
        margin: 10,
        borderColor: "#C0E7BA",
        shadowColor: fontMediumTextColor3,
        borderRadius: 10,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.27,
        shadowRadius: 6.65,

        elevation: 10,

    },
    inner_content_view: {

        paddingBottom: 20,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    HeadingText: {

        marginTop: hp('3.8%'),
        textAlign: "left",
        fontFamily: fontSemiBold,
        fontSize: hp('3.4%'),
        opacity: 1,
        color: fontMediumTextColor3,
        marginBottom: 8,
    },
    HeadingText: {

        marginTop: hp('3.8%'),
        textAlign: "left",
        fontFamily: fontSemiBold,
        fontSize: hp('3.4%'),
        opacity: 1,
        color: themeColor,
        marginBottom: 8,
    },
    SubHeadingText: {

        textAlign: "left",
        fontFamily: fontRegular,
        fontSize: hp('1.85%'),
        opacity: 1,
        color: fontMediumTextColor2,
        lineHeight: hp("2.25%"),
        marginBottom: hp("5%")


    },


    txtInputContainerStyle: {
        borderWidth: 1,
        paddingTop: hp('1.5%'),
        borderColor: "transparent",
        borderBottomColor: "#242424",
        marginRight: wp('8%'),
    },
    errorTextStyle: {
        color: "#FF0000",
        fontSize: 14,
        fontFamily: fontRegular,
        marginLeft: wp('0.5%'),
        marginTop: hp('1%'),
        marginBottom: hp('1.5%')
    },
    showHideStyle: {
        width: wp('4.2%'),
        height: hp('1.5%'),
        resizeMode: 'contain',
        marginRight: wp('5%'),
        opacity: 1
    },
    rememBoxStyle: {
        width: wp('5%'),
        height: hp('2.5%'),
        resizeMode: 'contain',
        marginRight: 8,
        opacity: 1
    },
    checkboxContainer: {
        flex: 1,
        flexDirection: "row",
    },
    textLight: {
        fontSize: 14,
        fontFamily: fontLight,
        color: fontMediumTextColor,
        opacity: 1
    },

    submitBtnBG: {
        backgroundColor: themeColor,
        width: wp('30%'),
        height: hp('7%'),
        textAlign: "center",
        justifyContent: "center",


        borderRadius: 15,
        opacity: 1,
        marginTop: hp('2.5%'),
        marginBottom: hp("5%")
    },
    submitTxt: {
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "row",
        color: "#FFFFFF",
        fontFamily: fontMedium,
        fontSize: hp('1.97%')
    },

    imagestyle: {
        height: hp('6%'),
        width: wp('12%'),
        marginLeft: wp('3.8%'),
        resizeMode: "contain"
    },

    notLoginView: {
        flex: 1,
        flexDirection: 'row',
        width: wp('57.6%'),
        height: hp('5.4%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        justifyContent: "center"
    },


    view_Img: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
    },
    error_Code: {
        color: "red",
        fontSize: wp("3%")
    },
    error_Img: {
        position: "absolute",
        right: 0,
        bottom: 8,
        width: wp("5%"),
        resizeMode: "contain"
    }
});

export default MobileVerification;
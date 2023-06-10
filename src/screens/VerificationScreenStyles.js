import { StyleSheet} from 'react-native';
import { 
    heightPercentageToDP as hp, widthPercentageToDP as wp
} from 'react-native-responsive-screen';

import {
    themeColor, fontSemiBold, fontMediumTextColor3, fontRegular, fontMediumTextColor2, fontBold
} from '../common/common';

export const styles = StyleSheet.create({
    headerIcon: {
        height: hp("8%"), width: wp("14%")
    },
    logoStyle: {
        width: wp('41%'),
        height: wp('41%'),
        resizeMode: 'contain'
    },
    mainContainer: {
        flex: 1,
        // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: themeColor
    },
    logo_view: {
        paddingTop: hp("4%"),
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    otpStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    content_view: {
        // marginTop: hp('%'),
        paddingHorizontal: wp('10%'),
        backgroundColor: "#FFFFFF",
        shadowColor: "#eceef5",
        borderRadius: 20,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.65,
        elevation: 12,
        height: hp(30)
    },
    otpText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        width: '100%',
        color: themeColor,
        fontSize: 18,
        borderColor: 'black',
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
    HeadingText: {
        marginTop: hp('3.8%'),
        textAlign: "left",
        fontFamily: fontSemiBold,
        fontSize: hp('3.4%'),
        opacity: 1,
        color: fontMediumTextColor3,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    HeadingTextColour: {
        textAlign: "left",
        fontFamily: fontBold,
        fontSize: hp('3.6%'),
        fontWeight: "bold",
        opacity: 1,
        color: themeColor,
        marginBottom: hp("2%"),
    },
    SubHeadingText: {
        textAlign: "left",
        fontFamily: fontRegular,
        fontSize: hp('1.85%'),
        opacity: 1,
        color: fontMediumTextColor2,
        lineHeight: hp("2.25%"),
        marginBottom: hp("2.5%")
    },
    submitBtnBG: {
        backgroundColor: themeColor,
        width: wp('30%'),
        height: hp('7%'),
        textAlign: "center",
        justifyContent: "center",


        borderRadius: 15,
        opacity: 1,
        marginTop: hp('3.5%'),
        marginBottom: hp("5%")
    },
    submitTxt: {
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "row",
        color: "#FFFFFF",
        fontFamily: fontBold,
        fontSize: hp('2.4%')
    }
});

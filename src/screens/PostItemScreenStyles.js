import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    fontRegular, fontMediumTextColor2, fontMedium, themeColor, fontMediumTextColor3, fontBold, headerColor
} from '../common/common';

export const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        width: wp("90"),
        paddingHorizontal: wp('5%'),
        color: "#000",
        height: 40,
        borderRadius: 10
    },
    rightAlign: {
        paddingHorizontal: wp("5%"),
        flex: 1,
        alignContent: "center",
    },
    ButtonTxt: {
        fontSize: wp("4%"),
        fontFamily: fontRegular,
        color: themeColor,
        paddingLeft: wp("2%"),
        alignSelf: "center",
    },
    InstTxt: {
        fontSize: wp("4%"),
        fontFamily: fontMedium,
        letterSpacing: 1,
        color: fontMediumTextColor3,
        paddingLeft: wp("2%"),
        alignSelf: "center",
    },
    Title: {
        fontSize: wp("4%"),
        fontFamily: fontBold,
        letterSpacing: 1,
        fontWeight: 'bold',
        color: fontMediumTextColor3,
        paddingBottom: wp('2%')
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
    content_view: {
        flex: 1,
        alignContent: 'center',
        flexDirection: "column"
    },

    top_Header: {
        paddingHorizontal: wp("3%"),
        paddingVertical: 0,
        justifyContent: "space-between",
        height: hp("8%"),
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: headerColor,
    },
    top_HeaderRight: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    top_HeaderText: {
        fontSize: wp("6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: themeColor
    },
    top_HeaderText1: {
        fontSize: wp("4%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: themeColor,
        textAlign: "center"
    },
    belowTitle: {
        paddingTop: 8,
        fontSize: wp("3.8%"),
        fontFamily: fontMedium,
        color: fontMediumTextColor2
    },
});
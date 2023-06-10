import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
    fontBold, themeColor, fontMediumTextColor3, headerColor
} from '../common/common';

export const detailStyles = StyleSheet.create({
    headerIcon: {
        height: hp("8%"),
        width: wp("14%"),
        resizeMode: "cover"
    },
    input: {
        borderWidth: 1,
        width: wp("90"),
        paddingHorizontal: wp('5%'),
        height: wp('20%'),
        color: "#000",
        borderRadius: 10
    },
    menu: {
        paddingVertical: wp('0.5%')
    },
    ageMYW: {
        paddingTop: wp('4%'),
        paddingRight: wp(15),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    heading: {
        fontSize: wp("4%"),
        fontFamily: fontBold,
        letterSpacing: 1,
        fontWeight: 'bold',
        color: fontMediumTextColor3,
        marginBottom: -8
    },
    Title: {
        fontSize: wp("4%"),
        fontFamily: fontBold,
        letterSpacing: 1,
        fontWeight: 'bold',
        color: fontMediumTextColor3,
        paddingVertical: hp("2%"),
        marginTop: -10
    },
    content_view: {
        // flex: 4,
        // height:hp(30),
        flexDirection: "column",
        paddingHorizontal: wp("5%"),
        // height: hp(50),
        // backgroundColor: "yellow"
    },
    top_Header: {
        paddingHorizontal: wp("3%"),
        // paddingVertical: 0,
        width: wp(100),
        justifyContent: "space-between",
        backgroundColor: headerColor,
        flexDirection: "row",
        alignItems: "center",
        height: hp(8),
        position: "absolute",
    },
    top_HeaderRight: {
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
    },
    details_Input: {
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
        paddingHorizontal: 0,
        color: "#000",
        height: 48
    },
    details_Input1: {
        borderColor: "#ddd",
        borderWidth: 1,
        color: "#000",
        height: hp(5),
        width: wp(18),
        textAlign: "center",
        // marginRight: wp(5)
    },
    titleblack: {
        fontSize: wp('4%'),
        // fontWeight: 'bold',
        color: 'black',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 18,
        alignItems: 'center',
    },
    row_1: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // paddingRight: 18,
        alignItems: 'center',
    },
    accordian_Icon: {
        marginLeft: 8,
        width: wp('4%'),
        height: hp('4%'),
        resizeMode: 'contain',
    },
});

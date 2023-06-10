import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
    fontBold, fontRegular, fontSemiBold, themeColor, headerColor
} from '../common/common';

export const boostStyles = StyleSheet.create({
    top_HeaderRight: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "blue"
    },
    top_HeaderText: {
        fontSize: wp("5.6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: themeColor,
    },
    headerIcon: {
        height: hp("8%"), width: wp("14%"), resizeMode: "cover"
    },
    headerIcon1:{
        color: themeColor,
        fontSize: wp('4%'),
        fontFamily: fontBold,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    content_view: {
        flex: 1,
        backgroundColor: themeColor,
        paddingTop: wp("15%"),
        alignItems: 'center',
        flexDirection: "column",
        paddingHorizontal: wp("5%")
    },
    top_Header: {
        paddingHorizontal: wp("4%"),
        paddingVertical: 3,
        justifyContent: "space-between",
        backgroundColor: headerColor,
        flexDirection: "row",
        alignItems: "center"
    },
    ButtonTxt: {
        fontSize: wp("5%"),
        fontWeight: "bold",
        fontFamily: fontBold,
        color: "#000",
        paddingLeft: wp("1%"),
        alignSelf: "center",
        lineHeight: 30,
        textAlign: "center",
        width: wp("64%"),
    },
    TextWht: {
        width: wp("88%"),
        fontSize: wp("5%"),
        fontWeight: "bold",
        fontFamily: fontRegular,
        color: "#fff",
        paddingLeft: wp("2%"),
        textAlign: "center",
        lineHeight: 30,
    },
    ButtonStyle: {
        marginTop: wp("5%"),
        backgroundColor: "white",
        borderRadius: 25,
        width: wp("75%"),
        height: hp("13%"),
        flexDirection: "row",
        elevation: 14,
        justifyContent: "center",
    },
    icon: {
        height: hp("13%"),
        width: hp("13%"),
        resizeMode: "contain",
        marginBottom: wp("3%"),
        elevation: 100
    }
});
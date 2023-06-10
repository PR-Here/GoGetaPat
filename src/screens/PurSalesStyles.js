import { StyleSheet } from "react-native";
import {
    fontBold, themeColor, fontMediumTextColor2, headerColor
} from '../common/common';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    viewsText: {
        flex: 1,
        alignSelf: "baseline",
        fontFamily: fontBold,
        fontSize: wp("3.5%"),
        color: fontMediumTextColor2,
        textAlignVertical: 'center'
    },
    flexRow: {
        flex: 1,
        flexDirection: "row"
    },
    soldText: {
        flex: 1,
        fontFamily: fontBold,
        fontWeight: "bold",
        fontSize: wp("3.5%")
    },
    rotatePaid: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center',
        marginRight: 10,
        transform: [{ rotate: "-45deg" }]
    },
    soldText: {
        flex: 1,
        fontFamily: fontBold,
        fontWeight: "bold",
        fontSize: wp("3.5%")
    },
    imageCont: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center',
    },
    chat_Img: {
        height: hp("8%"),
        width: hp("8%"),
        resizeMode: "cover",
        alignSelf: "flex-start",
        marginTop: hp("0.7%")
    },
    chat_Img1: {
        height: hp("3%"),
        alignSelf: "center",
        resizeMode: "contain",
        justifyContent: "center",
    },
    icon: {
        height: hp("2.5%"),
        width: hp("2.5%"),
        resizeMode: "contain"
    },
    iconPaid: {
        height: wp("10%"),
        width: wp("10%"),
        resizeMode: "contain",
    },
    chat_Name: {
        color: "#000000",
        fontSize: wp("4%"),
        fontWeight: "bold",
        fontFamily: fontBold
    },
    chat_Name_theme: {
        color: themeColor,
        fontSize: wp("3.5%"),
        fontWeight: "bold",
        paddingRight: wp("5%"),
        textAlignVertical: "bottom"
    },
    chat_Inner_Wrapper: {
        paddingTop: 10,
        flexDirection: "row",
        elevation: 14,
        backgroundColor: "#0000",
        alignItems: "center"
    },
    headingBox: {
        paddingVertical: hp("0.75%"),
        fontFamily: fontBold,
        fontWeight: 'bold',
        fontSize: hp("2.5%"),
        paddingTop: wp('7%')
    },
    headerIcon: {
        height: hp("8%"), width: wp("14%")
    },
    content_view: {
        flex: 1,
        alignContent: 'flex-start',
        flexDirection: "column",
        paddingHorizontal: wp("5%")
    },
    top_Header: {
        paddingHorizontal: wp("4%"),
        paddingVertical: 0,
        justifyContent: "space-between",
        backgroundColor: headerColor,
        flexDirection: "row",
        alignItems: "center"
    },
    top_HeaderRight: {
        flex: 3,
        justifyContent: "center",
        alignContent: 'center',
    },
    top_HeaderText: {
        fontSize: wp("6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: themeColor,
        textAlign: "center"
    },
    ButtonTxt: {
        fontSize: wp("4%"),
        fontFamily: fontBold,
        color: themeColor,
        paddingHorizontal: 12,
        alignSelf: "center",
    },
    Buttonicon: {
        height: wp("6%"),
        width: wp("5%"),
        resizeMode: "contain",
        alignSelf: "center"
    },
    ButtonStyle: {
        borderRadius: 5,
        height: hp("4%"),
        flexDirection: "row",
        justifyContent: "space-around",
    },
    noListStyle: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "center"
    },
    listItemTitle: {
        flex: 1,
        paddingHorizontal: 12
    },
    listItemPrice: {
        flexDirection: "row",
        alignContent: "flex-start"
    }
});
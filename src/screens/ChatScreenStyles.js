import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
    fontBold, fontLight,
    themeColor, fontMediumTextColor, fontMediumTextColor2, headerColor
} from '../common/common';

export const chartStyles = StyleSheet.create({
    single_Chat_Wrapper: {
        marginVertical: hp("0.5%")
    },
    single_Chat_Wrapper_Sender: {
        alignItems: "flex-end"
    },
    chat_Time: {
        fontFamily: fontBold,
        color: fontMediumTextColor2,
        fontSize: wp("4.5%"),
        marginRight: wp("8%"),
    },
    chat_Content: {
        flexDirection: "row",
        alignItems: "flex-end",
        maxWidth: wp("80%")
    },
    single_Chat_Message: {
        paddingVertical: 7,
        paddingHorizontal: 20,
        fontSize: wp("4%"),
        borderRadius: 10,
        marginTop: 6,
        backgroundColor: "#cdcdcd",
        color: "#000",
        overflow: "hidden"
    },
    single_Chat_Sender: {
        backgroundColor: themeColor,
        color: "#fff"
    },
    chat_Seen_Reciept: {
        height: hp("3.8%"),
        width: wp("7%"),
        resizeMode: "contain",
        marginLeft: 5
    },
    chat_Seen_Time: {
        fontFamily: fontBold,
        color: fontMediumTextColor2,
        fontSize: wp("4%"),
        marginRight: wp("8%"),
        marginTop: 5
    },
    mainContainer: {
        backgroundColor: "#fff",
        flex: 1,
    },
    go_Back_Icon: {
        width: wp("9%"),
        height: hp("5%"),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: wp('1%'),
        paddingVertical: hp("1%"),
        borderRadius: 5
    },
    go_Back_Icon_Img: {
        height: hp("9%"),
        width: wp("14%"),
        marginTop: hp("0.5%")
    },
    content_view: {
        flex: 1,
        alignContent: 'center',
    },
    top_Header: {
        paddingVertical: 10,
        paddingHorizontal: wp("4.5%"),
        backgroundColor: headerColor,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
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
    sec_padding: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 13,
        marginHorizontal: wp("4%")
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
    chat_Inner_Wrapper: {
        paddingTop: 10,
        paddingBottom: 4,
        flexDirection: "row",
        flex: 1,
    },
    border_Bottom_1: {
        borderBottomColor: "#24242422",
        borderBottomWidth: 1,
    },
    chat_Img: {
        height: hp("8%"),
        width: hp("8%"),
        resizeMode: "cover",
    },
    petImageWithPrice: {
        height: hp("7.5%"),
        width: hp("7.5%"),
        position: 'relative',
        borderRadius: 100,
        marginTop: 8
    },
    pet_Image: {
        height: hp("7.5%"),
        width: hp("7.5%"),
        resizeMode: "cover",
    },
    pet_Price: {
        color: "#fff",
        backgroundColor: "#0007",
        position: "absolute",
        bottom: 0,
        width: hp("7.5%"),
        textAlign: "center"
    },
    chat_Name: {
        color: "#000000",
        fontSize: wp("4.5%"),
        fontWeight: "bold"
    },
    chat_Message: {
        fontFamily: fontLight,
        color: "#000000",
        paddingRight: 40,
        fontWeight: "bold"
    },
    send_message_location: {
        height: 80,
        width: wp("100%"),
    },
    send_message_input: {
        backgroundColor: "#e3e3f3",
        height: hp("7%"),
        flex: 2,
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 20,
        color: "#000"
    }
});
import { StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp, heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    fontBold,
    fontLight,
    fontSemiBold,
    themeColor,
    headerColor,
} from '../common/common';

export const sellingStyles = StyleSheet.create({
    nothingSaved: {
        fontSize: wp("6%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center"
    },
    tickImg: {
        height: hp('3%'),
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    bottomBtnTxt: {
        color: '#fff',
        fontSize: 18,
        fontFamily: fontBold,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
    },
    mainContainer: {
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        // paddingHorizontal: wp("3%")
    },
    arrow_cont: {
        alignSelf: 'center',
    },
    soldNoti: {
        marginRight: wp('5%'),
        borderWidth: 1,
        borderColor: themeColor,
        width: 48,
        height: 22,
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        opacity: 1,
        transform: [{ rotate: '-45deg' }],
        position: "relative",
        top: -10
    },
    soldNoti1: {
        borderWidth: 1,
        borderColor: themeColor,
        width: 46,
        height: 19,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        opacity: 1,
    },
    soldTxt: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: themeColor,
        fontFamily: fontBold,
        fontSize: 11,
    },
    content_view: {
        flex: 1,
        alignContent: 'center',
        paddingHorizontal: wp('3%'),
    },
    top_Header: {
        paddingVertical: wp('3.5%'),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: headerColor,
        paddingHorizontal: wp('3%'),
    },
    modal_Backdrop: {
        flex: 1,
        backgroundColor: '#00000071',
        paddingTop: hp('15%'),
        alignItems: 'center',
    },
    modal_Main_Wrap1: {
        paddingTop: hp('4%'),
        width: wp('45%'),
        height: hp('15%'),
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 20,
    },
    top_HeaderRight: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    top_HeaderText: {
        fontSize: wp('6%'),
        fontFamily: fontBold,
        fontWeight: 'bold',
        color: themeColor,
    },
    top_HeaderText1: {
        fontSize: wp('4%'),
        fontFamily: fontBold,
        fontWeight: 'bold',
        color: themeColor,
    },
    sec_padding: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 13,
    },
    heading_Main_Wrap: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
    },
    heading_Main_View: {
        paddingVertical: 8,
    },
    heading_Main: {
        fontSize: wp('4.5%'),
        fontFamily: fontSemiBold,
        fontWeight: 'bold',
    },
    heading_Main_Message: {
        fontSize: wp('4.5%'),
        fontFamily: fontSemiBold,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: themeColor,
    },
    chat_Inner_Wrapper: {
        paddingTop: 10,
        flexDirection: 'row',
    },
    chat_Img: {
        height: hp('8%'),
        width: hp('8%'),
        resizeMode: 'cover',
    },
    chat_Img1: {
        height: hp('3%'),
        width: hp('3%'),
        alignSelf: 'center',
        resizeMode: 'contain',
        marginRight: 10
    },
    chat_Name: {
        color: '#000000',
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
    },
    chat_Name_theme: {
        color: themeColor,
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        paddingRight: wp('5%'),
    },
    chat_Message: {
        fontFamily: fontLight,
        color: '#000000',

        fontWeight: 'bold',
    },
    chat_Message_convo: {
        fontFamily: fontLight,
        color: '#000000',
    }
});


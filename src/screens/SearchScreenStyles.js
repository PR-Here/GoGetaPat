import { StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { fontBold, themeColor, headerColor } from '../common/common';

export const searchStyles = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#fff',
      flex: 1,
      paddingTop: Platform.OS === 'ios' ? 20 : 0,
    },
    top_Header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp('5%'),
      paddingVertical: hp('1.8%'),
      backgroundColor: headerColor,
      marginBottom: 8,
    },
    cancle_Btn: {
      color: themeColor,
      fontSize: wp('4%'),
      fontFamily: fontBold,
      fontWeight: 'bold',
      marginLeft: 15,
    },
    sec_padding: {
      paddingHorizontal: wp('4%'),
    },
    go_Back_Icon: {
      width: wp('9%'),
      height: hp('5%'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp('1%'),
      paddingVertical: hp('1%'),
      borderRadius: 5,
    },
    go_Back_Icon_Img: {
      height: hp('8%'),
      width: wp('14%'),
      marginTop: hp('0.5%'),
    },
    search_Icon: {
      height: hp('5%'),
      width: wp('5%'),
      position: 'absolute',
      zIndex: 11,
      left: 30,
    },
    search_Input: {
      height: hp('5%'),
      flex: 1,
      elevation: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      marginLeft: 20,
      position: 'relative',
      paddingVertical: 1,
      paddingHorizontal: 35,
    },
    recent_Search: {
      fontFamily: fontBold,
      color: '#000',
      marginBottom: 10,
      fontSize: wp('4.5%'),
      fontWeight: 'bold',
    },
    recent_Listing_Item: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 5,
    },
    recent_Listing_Text: {
      color: '#4d4d4d',
      fontSize: wp('4%'),
      fontWeight: 'bold',
    },
    cross_Icon: {
      resizeMode: 'contain',
      width: wp('4%'),
      height: hp('4%'),
    },
});

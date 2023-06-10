import React from "react";
import { 
    StyleSheet, 
    Platform, 
    ToastAndroid, 
    Alert
} from "react-native";
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const customToastMsg = (msg, type='short') => {
    let toastType = ToastAndroid.SHORT;
    if(type === 'long'){
        toastType = ToastAndroid.LONG;
    } 
    
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, toastType);
    } else {
        Alert.alert(msg);
    }
}

const styles = StyleSheet.create({
    headLeftstyle:{
        width: wp('4.2%'),
        height: hp('2.6%'),
        marginLeft: wp('3.3%')
    },
});

export default customToastMsg;
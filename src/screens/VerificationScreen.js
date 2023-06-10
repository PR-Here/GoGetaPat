import React, { useRef, useState, useEffect } from 'react';

import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Keyboard, Platform, SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';

import auth from '@react-native-firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import { useAuthDispatch } from '../contexts/authContext';
import customToastMsg from '../subcomponents/CustomToastMsg';
import { numbername } from '../services/api';
import CustomTextInput from '../subcomponents/CustomTextInput';
import { styles } from '../screens/VerificationScreenStyles';
import { Loader } from '../subcomponents/Loader';
import { useHomeDispatch, useHomeState } from '../contexts/HomeContext';
const isAndroid = Platform.OS === 'android';

const VerificationScreen = ({ navigation, route }) => {
    const stateHome = useHomeState()
    const dispatch = useAuthDispatch();
    const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
    const [animate, setAnimate] = useState();

    const [isCodeMatched, setIsCodeMatched] = useState(false);

    const firstTextInputRef = useRef(null);
    const secondTextInputRef = useRef(null);
    const thirdTextInputRef = useRef(null);
    const fourthTextInputRef = useRef(null);
    const fifthTextInputRef = useRef(null);
    const sixthTextInputRef = useRef(null);

    const refCallback = textInputRef => node => {
        textInputRef.current = node;
    };

    let confirmCode = () => {
        setAnimate(true)
        let tempCode = otpArray.join("")

        if (tempCode.length == 6) {
            try {
                // console.log("47", route.params.confirmPass, tempCode);
                route.params.confirmPass.confirm(tempCode)
                    .then(async (res) => {
                        // console.log(res, "response of fire");
                        setTimeout(()=>{
                            setAnimate(false);
                        }, 2000);
                        
                        // navigation.navigate('Home');
                    })
                    .catch((err) => {
                        customToastMsg(err.message)
                    });
            } catch (error) {
                setAnimate(false)
                setIsCodeMatched(true);
                customToastMsg('Invalid code.');
            }
        } else {
            setAnimate(false)
            customToastMsg("OTP is not correct, Please check again!");
        }
    }
    // this event won't be fired when text changes from '' to '' i.e. backspace is pressed
    // using onOtpKeyPress for this purpose
    const onOtpChange = index => {
        return value => {
            if (isNaN(Number(value))) {
                // do nothing when a non digit is pressed
                return;
            }
            const otpArrayCopy = otpArray.concat();
            otpArrayCopy[index] = value;
            setOtpArray(otpArrayCopy);

            // auto focus to next InputText if value is not blank
            if (value !== '') {
                if (index === 0) {
                    secondTextInputRef.current.focus();
                } else if (index === 1) {
                    thirdTextInputRef.current.focus();
                } else if (index === 2) {
                    fourthTextInputRef.current.focus();
                } else if (index === 3) {
                    fifthTextInputRef.current.focus();
                } else if (index === 4) {
                    sixthTextInputRef.current.focus();
                }
            }
        };
    };

    // only backspace key press event is fired on Android
    // to have consistency, using this event just to detect backspace key press and
    // onOtpChange for other digits press
    const onOtpKeyPress = index => {

        return ({ nativeEvent: { key: value } }) => {
            // auto focus to previous InputText if value is blank and existing value is also blank
            if (value === 'Backspace' && otpArray[index] === '') {
                if (index === 1) {
                    firstTextInputRef.current.focus();
                } else if (index === 2) {
                    secondTextInputRef.current.focus();
                } else if (index === 3) {
                    thirdTextInputRef.current.focus();
                } else if (index === 4) {
                    fourthTextInputRef.current.focus();
                } else if (index === 5) {
                    fifthTextInputRef.current.focus();
                }

                /**
                 * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
                 * doing this thing for us
                 * todo check this behaviour on ios
                 */
                if (isAndroid && index > 0) {
                    const otpArrayCopy = otpArray.concat();
                    otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
                    setOtpArray(otpArrayCopy);
                }
            }
        };
    };


    const handleSendCode = async () => {
        const { number } = await numbername("get");

        setAnimate(true);

        // Request to send OTP
        let phoneNo = number;
        // console.log("out of try")
        try {
            // console.log("in try")

            const confirmation = await auth().signInWithPhoneNumber(phoneNo);

            setAnimate(false);
        } catch (err) {
            setAnimate(false);
            // console.log(err)

            if (err.code === 'missing-phone-number') {
                customToastMsg('Missing Phone Number.');
            } else if (err.code === 'auth/invalid-phone-number') {
                customToastMsg('Invalid Phone Number.');
            } else if (err.code === 'auth/quota-exceeded') {
                customToastMsg('SMS quota exceeded.Please try again later.');
            } else if (err.code === 'auth/user-disabled') {
                customToastMsg('Phone Number disabled. Please contact support.');
            }
        }
    };

    const showLoader = () => {
        if (animate || stateHome.isLoading) {
            return <Loader />;
        }
        return null;
    }


    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{
                // marginVertical:hp("2%"),
                paddingHorizontal: 10,
                elevation: 7
            }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image source={require('../images/back-button.png')} style={styles.headerIcon} />
                </TouchableOpacity>
            </View>

            <KeyboardAwareScrollView style={styles.content_view} keyboardShouldPersistTaps='always'>
                <Text style={styles.HeadingText}>Verification</Text>
                <Text style={styles.SubHeadingText}>We have sent an otp code to:</Text>
                <Text style={styles.HeadingTextColour}>{route.params.number}</Text>

                <View style={styles.headingView} />

                <View style={styles.otpStyle}>
                    {[
                        firstTextInputRef,
                        secondTextInputRef,
                        thirdTextInputRef,
                        fourthTextInputRef,
                        fifthTextInputRef,
                        sixthTextInputRef,
                    ].map((textInputRef, index) => (
                        <CustomTextInput
                            containerStyle={{ flex: 1, }}
                            value={otpArray[index]}
                            onKeyPress={onOtpKeyPress(index)}
                            onChangeText={onOtpChange(index)}
                            keyboardType={'number-pad'}
                            maxLength={1}
                            style={[styles.otpText]}
                            // autoFocus={index === 0 ? true : undefined}
                            refCallback={refCallback(textInputRef)}
                            key={index}
                        />
                    ))}
                </View>
                <View style={
                    { justifyContent: "space-around", flexDirection: "row" }
                }>
                    <TouchableOpacity onPress={() => { Keyboard.dismiss(); confirmCode() }}
                        style={styles.submitBtnBG} >
                        <Text style={styles.submitTxt}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { Keyboard.dismiss(); handleSendCode(); }}
                        style={styles.submitBtnBG} >
                        <Text style={styles.submitTxt}>Resend OTP</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>

            <View style={styles.logo_view}>
                <Image source={require("../images/appLogo.png")} style={styles.logoStyle} />
            </View>
            {showLoader()}
        </SafeAreaView>
    );
};

export default VerificationScreen;
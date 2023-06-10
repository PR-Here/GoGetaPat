import React, { useEffect } from 'react'
import { useAuthState } from '../contexts/authContext';
import customToastMsg from './CustomToastMsg';

const ToHideTab = ({ navigation }) => {
    const authState = useAuthState();

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            // console.log('zoho zoho ', authState)

            if (authState.hasOwnProperty("loginedUser")) {
                if (authState.loginedUser) {
                    if (authState.loginedUser.hasOwnProperty("blocked")) {
                        if (authState.loginedUser.blocked) {
                            navigation.navigate("Post Item")
                        } else {
                            customToastMsg('You are restricted to add posts, please contact admin.\nIf your are unblocked then close the app and open it again.')
                            navigation.navigate("TabNavigator", { screen: "Home" })
                        }
                    } else {
                        navigation.navigate("Post Item")
                    }
                } else {
                    navigation.navigate("Post Item")
                }
            } else {
                navigation.navigate("Post Item")
            }

        });
        return unsubscribe;
    }, [navigation]);
    return <></>
}

export default ToHideTab


import React from 'react';
import {
    createStackNavigator,

} from '@react-navigation/stack';

import JoinScreen from './src/screens/JoinScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginByMobileScreen from './src/screens/LoginByMobileScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import VerificationScreen from './src/screens/VerificationScreen';

const Stack = createStackNavigator();

const AuthNavigator = ({ isSignout }) => (
    <Stack.Navigator initialRouteName="Join" headerMode="none">
        <Stack.Screen name="Join" component={JoinScreen} />

        <Stack.Screen name="SignIn" component={SignInScreen}
            options={{
                title: 'Sign in',
                animationTypeForReplace: isSignout ? 'pop' : 'push'
            }}
        />
        <Stack.Screen name="MobileLogin" component={LoginByMobileScreen}
            options={{
                title: 'LoginByMobile',
                animationTypeForReplace: isSignout ? 'pop' : 'push'
            }}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen}
            options={{
                title: 'Sign Up',
                animationTypeForReplace: isSignout ? 'pop' : 'push'
            }}
        />
        <Stack.Screen name="ForgotPass" component={ForgotPasswordScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
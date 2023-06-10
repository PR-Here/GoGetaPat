import React from 'react';
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack';


import SignInScreen from './src/screens/SignInScreen';
import LoginByMobileScreen from './src/screens/MobileVerification';
import VerificationScreen from './src/screens/VerificationScreen';
// import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

const AuthNavigator = ({ isSignout }) => (
    <Stack.Navigator screenOptions={{headerShown:false}}>
    {/* <> */}
        <Stack.Screen name="SignIn" component={SignInScreen}
            options={{
                title: 'Sign in',
                animationTypeForReplace: isSignout ? 'pop' : 'push'
            }}
        />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        {/* </> */}
    </Stack.Navigator>
);

export default AuthNavigator;
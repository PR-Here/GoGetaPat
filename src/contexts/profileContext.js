import React from 'react';
// import { authReducer } from '../reducers/authReducer';
import auth from '@react-native-firebase/auth';
import { checkAuth } from '../services/authServices';
import { profileReducer } from '../reducers/profileReducer';
const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

function ProfileProvider({ children }) {
    const [state, dispatch] = React.useReducer(profileReducer, {
        isLoading: true,
        updateProfile: false,
    });


    // React.useEffect(() => {
    //     let callCheck = async () => {
    //         let unsub = await checkAuth(dispatch)
    //         return unsub
    //     }
    //     let unsub = callCheck();
    //     return unsub
    // }, [])
    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
}

function useProfileState() {
    const context = React.useContext(AuthStateContext);
    if (context === undefined) {
        throw new Error('useProfileState must be used within a ProfileProvider');
    }
    return context;
}

function useProfileDispatch() {
    const context = React.useContext(AuthDispatchContext);
    if (context === undefined) {
        throw new Error('useProfileDispatch must be used within a ProfileProvider');
    }
    return context;
}

export { ProfileProvider, useProfileState, useProfileDispatch };

import React from 'react';
import { authReducer } from '../reducers/authReducer';
import auth from '@react-native-firebase/auth';
import { checkAuth } from '../services/authServices';
const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

function AuthProvider({ children }) {
    const [state, dispatch] = React.useReducer(authReducer, {
        isLoading: true,
        isSignout: false,
        userToken: null,
        loginedUser: null,
        // updateProfile: false,
    });


    React.useEffect(() => {
        let callCheck = async () => {
            let unsub = await checkAuth(dispatch)
            return unsub
        }
        let unsub = callCheck();
        return unsub
    }, [])
    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
}

function useAuthState() {
    const context = React.useContext(AuthStateContext);
    if (context === undefined) {
        throw new Error('useAuthState must be used within a AuthProvider');
    }
    return context;
}

function useAuthDispatch() {
    const context = React.useContext(AuthDispatchContext);
    if (context === undefined) {
        throw new Error('useAuthDispatch must be used within a AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuthState, useAuthDispatch };

export const authReducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...prevState,
                userToken: action.token,
                isLoading: false
            };
        case 'SIGN_IN':
            return {
                ...prevState,
                isSignout: false,
                userToken: action.token,
                loginedUser: action.loginedUser
            };
        case 'SIGN_IN_USER':
            return {
                ...prevState,
                isSignout: false,

                loginedUser: action.loginedUser
            };
        // case 'CONF_INFO':
        //     return {
        //         ...prevState,
        //         updateProfile: action.payload
        //     };
        case 'SIGN_OUT':
            return {
                ...prevState,
                isSignout: true,
                userToken: null,
                loginedUser: null
            };
        default:
            return prevState;
    }
};
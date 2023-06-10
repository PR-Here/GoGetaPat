export const profileReducer = (prevState, action) => {
    switch (action.type) {
        case 'CONF_INFO':
            return {
                ...prevState,
                updateProfile: action.payload
            };
        default:
            return prevState;
    }
};
import { CHAT_SCREEN_FOCUSED } from '../constants';
const initialState = {
    chatScreenFocused: {
        isActive: false,
        userInfo: null
    }
};
const activeScreenReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHAT_SCREEN_FOCUSED:
            return {
                ...state,
                chatScreenFocused: action.payload
            };
        default:
            return state;
    }
}
export default activeScreenReducer;
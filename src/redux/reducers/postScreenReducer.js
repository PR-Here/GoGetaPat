import {ENABLE_BOOST_AD } from '../constants';
const initialState = {
   enableBoostAd: {
    isActive: true,
    data: null
}
};
const postScreenReducer = (state = initialState, action) => {
    switch (action.type) {
        case ENABLE_BOOST_AD:
            return {
                ...state,
                enableBoostAd : action.payload
            };
        default:
            return state;
    }
}
export default postScreenReducer;
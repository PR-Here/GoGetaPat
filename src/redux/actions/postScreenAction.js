import { ENABLE_BOOST_AD } from '../constants';
export function setEnableBoostAd(value) {
    return {
        type: ENABLE_BOOST_AD,
        payload: value
    }
}
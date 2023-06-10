import { CHAT_SCREEN_FOCUSED } from '../constants';
export function setChatScreenFocused(value) {
    return {
        type: CHAT_SCREEN_FOCUSED,
        payload: value
    }
}

import { ToastAndroid, Platform, Alert } from 'react-native';

const ToastMessage = (msg) => {
    if (Platform.OS === "ios") {
        Alert.alert(msg);
    } else {
        ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
    }
};

export default ToastMessage;

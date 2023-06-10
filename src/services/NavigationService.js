import { CommonActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        CommonActions.navigate({
            name: routeName,
            params
        })
    );
}


function resetNavigator(routeName = 'HomeScreen', params) {
    _navigator.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: routeName }],
        })
    );
}

function dispatch(action) {
    if (!_navigator) return;
    _navigator.dispatch(action);
};

const NavigationService = {
    navigate,
    setTopLevelNavigator,
    dispatch,
    resetNavigator,
};
export default NavigationService;
import React, { Component } from 'react';
import { View, Animated, StyleSheet, TextInput } from 'react-native';
import { string, func, object, number, array } from 'prop-types';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default class FloatingTitleTextInputField extends Component {
    static propTypes = {
        attrName: string.isRequired,
        title: string.isRequired,
        value: string.isRequired,
        updateMasterState: func.isRequired,
        onFocusOfInput: func,
        keyboardType: string,
        titleActiveSize: number, // to control size of title when field is active
        titleInActiveSize: number, // to control size of title when field is inactive
        titleActiveColor: string, // to control color of title when field is active
        titleInactiveColor: string, // to control color of title when field is active
        textInputStyles: object,
        otherStyle: object,
        otherTextInputProps: object,
        inputRangeProps: array,
        outputRangeProps: array
    }


    static defaultProps = {
        keyboardType: 'default',
        titleActiveSize: 12,
        titleInActiveSize: 15,
        titleActiveColor: 'black',
        titleInactiveColor: 'dimgrey',
        textInputStyles: {},
        otherStyle: {},
        otherTextInputAttributes: {},
        inputRangeProps: [0, 1],
        outputRangeProps: [18, 0]
    }

    constructor(props) {
        super(props);
        const { value } = this.props;
        this.position = new Animated.Value(value ? 1 : 0);

        this.state = {
            isFieldActive: false,

        }

    }

    componentDidMount() {
        if (this.props.setting_active_true) {
            this.setState({ isFieldActive: true });
            Animated.timing(this.position, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true
            }).start();
        }
    }

    _handleFocus = () => {
        if (!this.state.isFieldActive) {

            this.setState({ isFieldActive: true });
            Animated.timing(this.position, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();

            const { onFocusOfInput } = this.props;
            if (onFocusOfInput != undefined) {
                onFocusOfInput();
            }
        }
    }

    _handleBlur = () => {
        if (this.state.isFieldActive && !this.props.value) {
            this.setState({ isFieldActive: false });

            Animated.timing(this.position, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            }).start();
        }
    }

    _onChangeText = (updatedValue) => {
        const { attrName, updateMasterState } = this.props;
        updateMasterState(attrName, updatedValue);
    }

    _returnAnimatedTitleStyles = () => {
        const { isFieldActive } = this.state;
        const {
            titleActiveColor, titleInactiveColor, titleActiveSize, titleInActiveSize,
            inputRangeProps, outputRangeProps
        } = this.props;

        return {
            // top: this.position.interpolate({
            //     inputRange: inputRangeProps,
            //     outputRange: outputRangeProps,
            // }),
            transform: [
                // {
                //     translateX: this.position.interpolate({
                //         inputRange: inputRangeProps,
                //         outputRange: outputRangeProps
                //     })
                // },
                {
                    translateY: this.position.interpolate({
                        inputRange: inputRangeProps,
                        outputRange: outputRangeProps
                    })
                }
            ],
            fontSize: isFieldActive ? titleActiveSize : titleInActiveSize,
            color: isFieldActive ? titleActiveColor : titleInactiveColor,
        }
    }



    render() {
        return (

            <View style={[Styles.container, this.props.otherStyle]}>

                <Animated.Text
                    style={[Styles.titleStyles, this._returnAnimatedTitleStyles()]}
                >
                    {this.props.title}
                </Animated.Text>

                <TextInput
                    value={this.props.value}
                    style={[Styles.textInput, this.props.textInputStyles]}
                    underlineColorAndroid='transparent'
                    onFocus={this._handleFocus}
                    onBlur={this._handleBlur}
                    onChangeText={this._onChangeText}
                    keyboardType={this.props.keyboardType}
                    {...this.props.otherTextInputProps}
                    placeholderTextColor='#000000'
                />
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        // width: '100%',
        // borderRadius: 3,
        // borderStyle: 'solid',
        // borderWidth: 0.5,
        // height: 50,
        // marginVertical: 4,
    },
    textInput: {
        // width: wp('80%'),
        // marginLeft: wp('8.26%'),
        height: hp('7%'),
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        textAlignVertical: 'bottom'
    },
    titleStyles: {
        position: 'absolute',
        fontFamily: 'Avenir-book',
        // left: wp('8.25%'),
        // color:'#000000',
    }
});
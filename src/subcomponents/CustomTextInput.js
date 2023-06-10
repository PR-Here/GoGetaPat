
import React from 'react';
import {StyleSheet, View, ViewPropTypes, TextInput} from 'react-native';
import PropTypes from 'prop-types';

import {fontLight, themeColor, fontMediumTextColor, fontMedium,fontSemiBold,
    fontMediumTextColor3, fontLightTextColor, fontRegular, screenWidth, fontMediumTextColor2, textInputBorderColor} from '../common/common';
    import {
      heightPercentageToDP as hp,
      widthPercentageToDP as wp
  } from 'react-native-responsive-screen';

const CustomTextInput = function(props) {
  const {
    containerStyle,
    style,
    LeftComponent,
    RightComponent,
    refCallback,
    ...remainingProps
  } = props;

  return (
    <View style={[styles.containerStyle, containerStyle]}>
     
      <TextInput
        {...remainingProps}
        style={[styles.textInputStyle,{flex:1},  style]}
        ref={refCallback}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    backgroundColor:"#FFFFFF",
    height: hp('5%'),
    width: hp("5%"),
    margin: 7,
    borderColor:"#C0E7BA",
    shadowColor: fontMediumTextColor3,
    borderRadius:10,
    shadowOffset: {
        width: 10,
        height: 10,
    },
    shadowOpacity: 0.27,
    shadowRadius: 6.65,

    elevation: 10,
  },
  textInputStyle: {
    padding: 0,
  },
});




export default CustomTextInput;
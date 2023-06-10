import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    pets_Image_Wrapper: {
        // justifyContent: "space-evenly"
        alignSelf:"center"
    },
    pets_Image: {
        height: hp("15%"),
        width: wp("31.3%"),
        marginHorizontal: wp("1%"),
        marginVertical: hp("0.5%")
    },
})

import React from 'react'
import { View, Text, Modal, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image,StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    fontBold, fontLight, fontRegular, fontSemiBold,
    themeColor, fontMediumTextColor, textInputBorderColor, fontMediumTextColor2, fontMedium1extColor3, fontMediumTextColor3, fontMedium
} from '../common/common';

const StatusNavigationBar = (props) => {
    // const [value,setValue] = useState(props)
   

    return <SafeAreaView style={styles.container}>
        <View style={styles.ButtonStyle}>
            
            <View style={styles.Border}></View>
            {props.active>=2?
            <View style={styles.Border}></View>
            :
            <View style={styles.Border1}></View>
            }
            
            {props.active>=3?
            <View style={styles.Border}></View>
            :
            <View style={styles.Border1}></View>
            }
            {props.active>=4?
            <View style={styles.Border}></View>
            :
            <View style={styles.Border1}></View>
            }
        </View>
        <View style={styles.ButtonStyle}>
        
            <Text style={styles.Text}>1.Photos</Text>
        
        {props.active>=2?
            <Text style={styles.Text}>2.Details</Text>
            :
            <Text style={styles.Text1}>2.Details</Text>
        }
        {props.active>=3?
            <Text style={styles.Text}>3.Price</Text>
            :
            <Text style={styles.Text1}>3.Price</Text>
        }
        {props.active>=4?
            <Text style={styles.Text}>4.Finish</Text>
            :
            <Text style={styles.Text1}>4.Finish</Text>
        }
            
        </View>
    </SafeAreaView>
}

export default StatusNavigationBar;

const styles = StyleSheet.create({
    Text:{
        fontSize: wp("3.5%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: themeColor
    },
    Text1:{
        fontSize: wp("3.5%"),
        fontFamily: fontBold,
        fontWeight: "bold",
        color: 'black'
    },
    container:{
        marginBottom:hp("3%")
    },
    ButtonStyle:{        
        width:wp("90%"),
        marginTop:hp('1%'),
        flexDirection:"row",
        alignSelf:"center",
        justifyContent:"space-around",
    },
    Border:{        
        borderColor:themeColor,
        borderTopWidth:5,
        width:wp("15%")        
    },
    Border1:{        
        borderColor:"black",
        borderTopWidth:5,
        width:wp("20%")
    },
})
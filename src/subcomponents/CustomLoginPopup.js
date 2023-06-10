import React from 'react';
import { Text, View, Image, TouchableOpacity, Modal, StyleSheet, StatusBar } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fontBold, fontMedium, fontRegular } from "../common/common";

export const CustomLoginPopup = (props) => {
    const { toggle, setPopup, name, btnName1, btnName2, alertText, btn2Action } = props;

    return <Modal
        animationType={'none'}
        transparent={true}
        statusBarTranslucent={true}
        visible={toggle}
        onRequestClose={() => {
        }}>
        <View style={styles.modal_Backdrop}>
            <View style={[
                styles.modal_Main_Wrap,
            ]}>
                <View style={styles.head}>
                    <Text style={styles.text}>{name}</Text>
                </View>

                <Text style={styles.modalBody}>{alertText}</Text>

                <View style={{ flex: 1, flexDirection: "row", bottom: 0, position: "absolute" }}>
                    <TouchableOpacity style={[styles.btnTop, styles.borderRight]}
                        onPress={() => { setPopup(false) }}>
                        <Text style={[styles.textColor, { fontFamily: fontRegular }]}>{btnName1}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnTop, styles.borderLeft]}
                        onPress={() => {
                            setPopup(false); btn2Action();
                        }} >
                        <Text style={styles.textColor}>{btnName2}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
}



const styles = StyleSheet.create({
    head: {
        flexDirection: 'row',
        // alignItems: "center",
        justifyContent: "center",
        paddingTop: hp(1.5)
    },
    text: {
        color: "black",
        fontSize: 17,
        backgroundColor: "transparent",
        fontFamily: fontMedium,
        alignSelf: "center"
    },
    subText: {
        color: "lightgray",
        fontSize: 21,
        marginVertical: hp(2),
        backgroundColor: "transparent",
        paddingHorizontal: wp(3),
        paddingLeft: wp(3),
        fontFamily: fontBold
    },
    imgContainer: {
        height: hp(7),
        width: wp(7),
    },
    img: {
        resizeMode: 'contain',
    },
    modal_Backdrop: {
        flex: 1,
        backgroundColor: '#00000091',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal_Main_Wrap: {
        // height: hp(38),
        paddingBottom: 30,
        width: wp(80),
        backgroundColor: 'white',
        borderRadius: 10
    },
    sec_padding: {
        paddingHorizontal: wp('4%')
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    modalCross: {
        flex: 1,
        alignItems: "flex-end"
    },
    sec_content: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp(2),
        marginBottom: hp(1),
        paddingHorizontal: wp(9)
    },
    headerText: {
        fontFamily: fontBold,
        fontSize: 17,
        textAlign: 'center'
    },
    sub_heading_Text: {
        fontFamily: fontRegular,
        fontSize: 14,
        color: "lightgray",
        paddingVertical: hp(1.5),
        textAlign: "center"
    },
    underline_Button: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: hp(3)
    },
    underline_text: {
        borderColor: "black",
        borderBottomWidth: 1,
        fontFamily: fontRegular,
        fontSize: 14,
    },
    marginHorizontal: {
        marginHorizontal: wp(2)
    },
    tabBarInitial: Platform.OS == "ios" ?
        { height: hp("13%") }
        :
        {
            height: hp("8.5%"),
            paddingVertical: hp(1)
        },
    btnTop: {
        borderTopColor: "lightgray",
        borderTopWidth: 0.7,
        width: wp(40),
        height: hp(5),
        justifyContent: "center",
        alignItems: "center",
    },
    borderRight: {
        borderRightWidth: 0.3,
        borderRightColor: "lightgray",
    },
    borderLeft: {
        borderLeftWidth: 0.3,
        borderLeftColor: "lightgray"
    },
    textColor: {
        color: "blue",
        fontFamily: fontMedium,
        fontSize: 17
    },
    modalBody: {
        textAlign: "center",
        alignItems: "center",
        fontSize: 16,
        fontFamily: fontRegular,
        paddingVertical: hp(2)
    },
})
import React from 'react'
import { View, Text, Modal, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const CountryModal = ({ isModalVisible, setIsModalVisible, selectedCallingCode, selectCountry }) => {

    const placeItem = ({ item }) => {
        return (
            <TouchableOpacity key={item.key} onPress={() => selectCountry(item.iso2)} style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ddd" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={item.image} style={{ height: 20, width: 20, marginRight: 10 }} resizeMode="contain" />
                        <Text >{item.label.toString()}</Text>
                    </View>
                    <Text >{item.dialCode.toString()}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return <Modal
        animationType={"fade"}
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => { setIsModalVisible(!isModalVisible); }}>
        <TouchableWithoutFeedback onPress={() => { setIsModalVisible(!isModalVisible) }}>
            <View style={{ flex: 1, backgroundColor: "#00000091", justifyContent: "center", alignItems: "center" }}>
                <View style={{ height: hp("75%"), width: wp('90%'), backgroundColor: "white", padding: 5, borderRadius: 5 }}>
                    <FlatList
                        data={selectedCallingCode}
                        renderItem={placeItem}
                        keyExtractor={(item, index) => item.key + index}
                        initialNumToRender={20}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
}

export default CountryModal

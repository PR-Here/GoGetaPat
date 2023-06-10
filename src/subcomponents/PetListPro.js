import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    LayoutAnimation,
    Platform,
    UIManager,
    SafeAreaView,
    ScrollView,
    TextInput,
    Modal,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { runAllHomeApi, fetchMorePost, fetchFilterPost } from '../services/api';
import { useHomeDispatch, useHomeState } from '../contexts/HomeContext';

const PetListPro = ({ navigation, fetchMoreUserPost, id


}) => {
    let dispatchHome = useHomeDispatch();
    let stateHome = useHomeState();

    return (
        <>
            <FlatList
                //    horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.pets_Image_Wrapper}
                data={stateHome?.profilePost}
                refreshing={false}
                onEndReachedThreshold={0.2}
                onEndReached={() => {

                    // fetchMoreProfilePost(
                    //     dispatchHome,
                    //     stateHome.page,
                    //     search,
                    //     stateHome.post,
                    //     getDataAcc,

                    // );

                    fetchMoreUserPost(id, dispatchHome, stateHome)

                }}
                onRefresh={() => {


                }}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            key={Date()}
                            onPress={() => {
                                navigation.navigate({ name: 'Post', params: { id: item.id } });
                            }}>

                            <Image
                                source={item && item?.cover_image[0]?.image_url ? {
                                    uri: item?.cover_image[0]?.image_url
                                } : require("../images/no-image.png")}
                                style={styles.pets_Image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(item, index) => {
                    return index;
                }}
                numColumns={3}
            />
        </>
    );
}

export default PetListPro;

const styles = StyleSheet.create({
    pets_Image_Wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pets_Image: {
        height: hp('15%'),
        width: wp('31.3%'),
        marginHorizontal: wp('1%'),
        marginVertical: hp('0.5%'),
    },
});

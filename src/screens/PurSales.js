import React, { useState, useEffect } from 'react';
import { View, Image, Text, SectionList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { styles } from './PurSalesStyles';
import { PurchaseList, SalesList } from '../services/api';
import { Loader } from '../subcomponents/Loader';
import { useHomeDispatch, useHomeState } from '../contexts/HomeContext';
import { useAuthState } from '../contexts/authContext';

const renderList = ({ item, index, section }, navigation, authState) => {
    if (section.title == "Purchases") {
        return renderPurchaseItem(item, index, navigation)
    } else return renderSalesItem(item, index, navigation, authState)
}

const renderSalesItem = (item, index, navigation, authState) => {

    return (
        <TouchableOpacity key={item + index} onPress={() => { navigation.navigate({ name: 'Post', params: { id: item.id } }) }}>
            <View style={styles.chat_Inner_Wrapper}>
                <Image source={{ uri: item?.cover_image[0]?.image_url }} style={styles.chat_Img} />

                <View style={styles.listItemTitle}>
                    <Text style={styles.chat_Name}>{item.title}</Text>
                    <View style={styles.listItemPrice}>
                        {/* <Image style={styles.icon} source={require('../images/purchases.png')} /> */}
                        <Text style={styles.soldText}>$ {item.price}</Text>
                    </View>
                    <View style={{ height: hp("3%"), }}>
                        <Text style={styles.viewsText}>
                            {item.View} views
                        </Text>
                    </View>
                    <View style={styles.flexRow}>
                        {/* <TouchableOpacity onPress={() => { navigation.navigate("Post Item", { true: false }) }}>
                            <Text style={styles.chat_Name_theme} numberOfLines={1}>Edit Post</Text>
                        </TouchableOpacity> */}
                        {
                            authState.hasOwnProperty("loginedUser") ?
                                authState.loginedUser ?
                                    authState.loginedUser.hasOwnProperty("blocked") ?
                                        authState.loginedUser.blocked ? <TouchableOpacity style={styles.ButtonStyle} onPress={() => {
                                            navigation.navigate('Post Item', { true: true, itemData: item });
                                        }}>
                                            <Image style={styles.Buttonicon} source={require('../images/edit.png')} />
                                            <Text style={styles.ButtonTxt}>Edit Post</Text>
                                        </TouchableOpacity>
                                            : null
                                        : null
                                    : null
                                : null
                        }
                    </View>
                </View>

                <View style={styles.imageCont}>
                    <Image source={require('../images/right-arrow.png')} style={styles.chat_Img1} />
                </View>
            </View>
        </TouchableOpacity>
    )
}



const renderPurchaseItem = (item, index, navigation) => {
    return (
        <TouchableOpacity key={item + index} onPress={() => { navigation.navigate("Post") }}>
            <View style={styles.chat_Inner_Wrapper}>
                <Image source={{ uri: item?.cover_image[0]?.image_url }} style={styles.chat_Img} />

                <View style={styles.listItemTitle}>
                    <Text style={styles.chat_Name}>{item.title}</Text>

                    <View style={styles.listItemPrice}>
                        {/* <Image style={styles.icon} source={require('../images/purchases.png')} /> */}
                        <Text style={styles.soldText}>$ {item.price}</Text>
                    </View>
                    <View>
                        <View style={styles.flexRow}>
                            <Text style={styles.chat_Name_theme} numberOfLines={1}>2 Puppys</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.rotatePaid}>
                    <Image source={require('../images/paid.png')} style={styles.iconPaid} />
                </View>

                <View style={styles.imageCont}>
                    <Image source={require('../images/right-arrow.png')} style={styles.chat_Img1} />
                </View>
            </View>
        </TouchableOpacity>
    )
}


const PurSales = ({ navigation, route, setValues }) => {
    let homeDispatch = useHomeDispatch();
    let stateHome = useHomeState();

    const authState = useAuthState();

    const [fullData, setFullData] = useState([])
    const [fullDataSales, setFullDataSales] = useState([])
    const [finalState, setFinalState] = useState([])

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            //  let postData= homeState && homeState.post.length && homeState?.post?.filter((item)=>{
            //     return item.id== route?.params?.id
            //  })
            PurchaseList(setFullData, homeDispatch);
            SalesList(setFullDataSales, homeDispatch);

            //  console.log([...postData[0].cover_image,...postData[0].non_cover_image],"here it is")
            // setImages([...postData[0].cover_image,...postData[0].non_cover_image])
        })
        return unsubscribe
    }, [navigation]);

    useEffect(() => {
        //   if(fullData && fullDataSales){
        //   setFinalState(
        //       [
        //            {
        //                 title: 'Purchases',
        //                 data: fullData
        //             },
        //             {
        //                 title:'Sales',
        //                 data:fullDataSales
        //             }
        //       ]

        //   )
        //     }

        // if(fullData && fullDataSales){
        let sectionArray = []

        if (fullData.length) {
            sectionArray.push({ title: "Purchases", data: fullData })
        }
        if (fullDataSales.length) {
            sectionArray.push({ title: "Sales", data: fullDataSales })
        }

        setFinalState(sectionArray);
        // }
        // else

        //      if(fullDataSales && !fullData ){
        //   setFinalState(
        //       [

        //             {
        //                 title:'Sales',
        //                 data:fullDataSales
        //             }
        //       ]

        //   )
        //     }else
        //        if(!fullDataSales && fullData){
        //   setFinalState(
        //       [

        //             {
        //                 title:'Purchases',
        //                 data:fullData
        //             }
        //       ]

        //   )
        //     }

    }, [fullData, fullDataSales])

    const showLoader = (stateHome) => {
        if (stateHome.isLoading) {
            return <Loader />;
        }
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} >
            {showLoader(stateHome)}

            <View style={styles.top_Header}>
                <View style={{ flex: 1, }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }} >
                        <Image source={require('../images/back-button.png')} style={styles.headerIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.top_HeaderRight}>
                    <Text allowFontScaling={false} style={styles.top_HeaderText}>Purchases & Sales</Text>
                </View>
                {Platform.OS == "android" &&
                    <View style={{ flex: 1, alignItems: "flex-end", }}></View>
                }
            </View>
            <View style={[styles.content_view]}>
                {/* <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}> */}
                {
                    stateHome.isLoading === false ?
                        finalState?.length > 0 ?
                            <SectionList
                                sections={finalState}
                                keyExtractor={(item, index) => item + index}
                                renderItem={(item, index) => renderList(item, navigation, authState)}
                                renderSectionHeader={({ section: { title } }) => (
                                    <Text style={styles.headingBox}>{title}</Text>
                                )}
                            /> :
                            <View style={styles.noListStyle}>
                                <Text>
                                    You don’t have any purchase or sales item to display. <Text style={{ color: "blue" }}
                                        onPress={() => navigation.navigate('Home')}>Lets Start!</Text>
                                </Text>
                            </View>
                        :
                        null
                }
                {/* </SafeAreaView> */}
            </View>
        </SafeAreaView>
    );
};

export default (PurSales);
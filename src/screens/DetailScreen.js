import React, { useEffect, useRef, useState } from 'react';
import {
    View, Image, Text, TextInput, SafeAreaView, Platform, Keyboard, BackHandler
} from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import RadioGroup from 'react-native-radio-buttons-group';

import { fontMediumTextColor2 } from '../common/common';
import CustomToastMsg from '../subcomponents/CustomToastMsg';
import Accordian from '../subcomponents/Accordian';
import { detailStyles } from './DetailScreenStyles';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';



const keyboardType = Platform.OS === "android" ? "numeric" : "number-pad";
const DetailScreen = ({
    navigation, route,
    setValues, categories, setCategories,
    weight, setWeight,
    month, setMonth,
    year, setYear,
    week, setWeek,
    sex, setSex,
    breed, setBreed,
    reset, setReset,
    catg, setCatg,
    bred, setBred,
    sx, setSx,
    describe, setDescribe,
    setdescrField
}) => {
    let _description = useRef(null);
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const insets = useSafeAreaInsets();
    const [tempAge, setTempAge] = useState(year ?? (month ?? week));
    const [radioButtons, setRadioButtons] = useState([{
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Weeks',
        value: 'week',
        selected: week ? true : month || year ? false : true,
    }, {
        id: '2',
        label: 'Months',
        value: 'month',
        selected: month ? true : false,
    }, {
        id: '3',
        label: 'Years',
        value: 'year',
        selected: year ? true : false,
    }]
    );


    useEffect(() => {
        // BackHandler.addEventListener("hardwareBackPress", backAction);
        let keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow,);
        let keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide,);

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        }
    }, []);

    const keyboardDidShow = (event) => {
        setKeyboardOffset(event.endCoordinates.height);
        // console.log(event)
    }

    const keyboardDidHide = () => {
        setKeyboardOffset(0);
    }
    const onPressRadioButton = (radioButtonsArray) => {
        setRadioButtons(radioButtonsArray);

        radioButtonsArray.map((ele) => {
            if (ele.selected) {
                if (ele.value == "year") {
                    setWeek("");
                    setMonth("");
                    setYear(tempAge);
                } else if (ele.value == "month") {
                    setWeek("");
                    setYear("");
                    setMonth(tempAge);
                } else if (ele.value == "week") {
                    setWeek(tempAge);
                    setMonth("");
                    setYear("");
                }
                // else {
                //     customToastMsg("Please enter valid " + ele.value + ".");
                // }
            }
        });
    }

    const handleAge = (value) => {
        let val = value.trim();
        setTempAge(val);

        if (val) {
            radioButtons.map((ele) => {
                if (ele.selected) {
                    if (ele.value == "year") {
                        setWeek("");
                        setMonth("");
                        setYear(val);
                    } else if (ele.value == "month") {
                        setWeek("");
                        setYear("");
                        setMonth(val);
                    } else if (ele.value == "week") {
                        setWeek(val);
                        setMonth("");
                        setYear("");
                    }
                    // else {
                    //     customToastMsg("Please enter valid " + ele.value + ".");
                    // }
                }
            });
        }
    }

    const renderAccordians = (commingItem, getDataAcc, setGetDataAcc) => {
        const items = [];

        for (let item of commingItem) {
            items.push(
                <View style={detailStyles.menu}>
                    <Text style={detailStyles.heading}>{item.heading}
                        {item.subHeading ? <Text style={{ fontSize: wp("3%") }}> {item.subHeading}</Text> : null}
                    </Text>

                    <Accordian
                        title={getDataAcc ? getDataAcc : item.title}
                        data={item.data}
                        styleColour={false}
                        reset={reset}
                        setReset={setReset}
                        // getDataAcc={getDataAcc}
                        setGetDataAcc={setGetDataAcc}
                        commingFrom="detailscr"
                    />
                </View>
            );
        }
        // console.log(getDataAcc, "lal lkjaljk lkj aljk");
        return items;
    }

    return (
        // <SafeAreaView>
        <KeyboardAwareScrollView
            // ref={(s) => { scrollRef = s }}
            style={detailStyles.content_view}
            // getTextInputRefs={() => { return [_weight, _age, _description]; }}
            onScrollBeginDrag={() => Keyboard.dismiss()}
        >
            <View style={{
                paddingTop: keyboardOffset > 0 && catg.name == "Pet Services" ||
                    keyboardOffset > 0 && catg.name == "Pet Supplies" ||
                    keyboardOffset > 0 && catg.name == "Stud Services" ? Platform.OS == "ios" ?
                    hp(32.5) : hp(8.5) : hp(8.5) + insets.top,
                // height: hp(50),
                // backgroundColor: "red"
            }}>
                {renderAccordians(categories, catg?.name, setCatg)}

                {/* {When category is pet services or pet Supplies, display only description */}
                {catg.name == "Pet Services" || catg.name == "Pet Supplies" || catg.name == "Stud Services" ? null :
                    <>
                        <View style={detailStyles.menu}>
                            <Text style={detailStyles.heading}>Weight/lbs
                                <Text style={{ fontSize: wp("3.5%") }}> (Optional)</Text>
                            </Text>
                            <TextInput selectionColor="black" value={weight} placeholder="Weight" maxLength={5}
                                onChangeText={(value) => {
                                    setWeight(value)
                                }}
                                // ref={(w) => {
                                //     try {
                                //         _weight = w
                                //     } catch (e) {
                                //         console.log(e)
                                //     }
                                // }}
                                keyboardType={keyboardType}
                                placeholderTextColor={"#000"}
                                style={detailStyles.details_Input}
                                onFocus={() => { setdescrField(false) }}
                            />
                        </View>

                        <Text style={detailStyles.heading}>Age
                            <Text style={{ fontSize: wp("3.5%") }}> (Optional)</Text>
                        </Text>
                        <View style={detailStyles.ageMYW}>
                            <TextInput value={tempAge} placeholder="Age"
                                onChangeText={(value) => { handleAge(value) }}
                                maxLength={3} keyboardType={keyboardType} placeholderTextColor={"#000"}
                                style={[detailStyles.details_Input1, { width: wp(13.5), paddingVertical: hp(0.3), marginRight: wp(2.5) }]}
                                // ref={(a) => {
                                //     try {
                                //         _age = a
                                //     } catch (e) {
                                //         console.log(e)
                                //     }
                                // }}
                                onFocus={() => setdescrField(false)}
                            />
                            <View style={{}}>
                                <RadioGroup radioButtons={radioButtons} onPress={onPressRadioButton}
                                    containerStyle={{ flexDirection: "row", justifyContent: "space-evenly", flex: 1 }}
                                    labelStyle={{ marginRight: 25 }}
                                />
                            </View>

                        </View>
                    </>
                }
                {/* {When category is pet services or pet Supplies, display only description */}
                {catg.name == "Pet Services" || catg.name == "Pet Supplies" || catg.name == "Stud Services" ? null :
                    renderAccordians(sex, sx?.name, setSx)}
                {/* {When category is pet services or pet Supplies, display only description */}
                {catg.name == "Pet Services" || catg.name == "Pet Supplies" ? null :
                    Object.keys(catg).length > 0 && breed[0]?.data.length > 0 ?
                        renderAccordians(breed, bred?.name, setBred)
                        :
                        (
                            <View style={detailStyles.menu}>
                                <Text style={detailStyles.heading}>Breed</Text>
                                <TouchableOpacity
                                    style={[detailStyles.row_1, { height: 56 }]}
                                    onPress={() => {
                                        Object.keys(bred).length > 0 ?
                                            CustomToastMsg("Please select category first")
                                            :
                                            CustomToastMsg("There is no breed available.")
                                    }}>
                                    <Text style={[detailStyles.titleblack]}>Breed</Text>
                                    <Image
                                        source={require('../images/down-arrow.png')}
                                        style={detailStyles.accordian_Icon}
                                    />
                                </TouchableOpacity>

                                {/* <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={() => {
                                    CustomToastMsg("Please select category first")
                                }}>
                                </TouchableOpacity> */}
                            </View>
                        )
                }
                <Text style={detailStyles.Title}>Description</Text>
                <TextInput
                    multiline={true}
                    style={detailStyles.input}
                    placeholder="Type your description"
                    placeholderTextColor={fontMediumTextColor2}
                    // ref={r => {
                    //     try {
                    //         _description = r;
                    //     } catch (e) {
                    //         console.log(e)
                    //     }
                    // }}
                    value={describe}
                    onChangeText={(value) => {
                        if (value.trim().length > 0) {
                            setDescribe(value)
                        } else {
                            setDescribe(value.trim())  // stop whitespace to set
                        }
                    }}
                    onFocus={() => { setdescrField(true) }}
                />
                {/* </View> */}
            </View>
        </KeyboardAwareScrollView>
        // </SafeAreaView>
    );
};

export default DetailScreen;
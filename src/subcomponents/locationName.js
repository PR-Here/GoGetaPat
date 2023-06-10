import React, { useState } from 'react';
import {
    View, StyleSheet, PermissionsAndroid, Image, Text, Modal, TouchableOpacity,
    ScrollView, SafeAreaView, TextInput, Linking, Platform
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { MAP_API_KEY } from '../common/common';
import customToastMsg from './CustomToastMsg';

export const locationName = (latitude, longitude, state, city, setState, setPin, setCity, setCheck) => {
    // alert(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=`)
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=` + MAP_API_KEY)
        .then(respon => respon.json())
        .then(results => {
            if (results?.results[0]) {
                var address = results.results[0].address_components
                // console.log(address)

                let City, State, Zip;
                address.forEach(function (component) {

                    var types = component.types;
                    let foo = types.indexOf('locality') > -1
                    let bar = types.indexOf('sublocality') > -1

                    if ((foo && !bar) || (!foo && bar)) {
                        if (types.indexOf('locality') > -1) {
                            City = component.long_name;
                        }
                        if (types.indexOf('sublocality') > -1) {

                            City = component.long_name;
                        }
                        setCity(City)
                    }

                    if (types.indexOf('administrative_area_level_1') > -1) {
                        State = component.short_name;
                        setState(State)
                    }

                    if (types.indexOf('postal_code') > -1) {
                        Zip = component.long_name || component.short_name;
                        setPin(Zip)
                    }
                    if (city && state) {
                        setCheck(true)
                    }

                });
            }

            return true

        })
        .catch(error => {
            console.log("erroring", error.message);
            customToastMsg(error.message);
        });
}
/** @format */

import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { getObjData, storeObjData } from "../common/helper";
import { searchStyles } from "./SearchScreenStyles";

function SearchScreen({ navigation, route }) {
  const {
    setHomeAfterSearch,
    homeAfterSearch,
    setSearchTerm,
    hitNow,
    setHitNow,
  } = route.params;
  const [searchInput, setSearchInput] = useState("");
  const [recentSearch, setRecentSearch] = useState([]);

  const removeRecentSearch = (index, item) => {
    let newRecentSearch = [...recentSearch];
    newRecentSearch.splice(index, 1);
    storeObjData("recentsearch", newRecentSearch);
    setRecentSearch(newRecentSearch);
  };

  const recoverRecentSearch = async () => {
    let data = await getObjData("recentsearch");
    if (data != null) setRecentSearch(data);
  };

  const saveToStorage = () => {
    let history = recentSearch ? recentSearch : [];
    history.push(searchInput);

    storeObjData("recentsearch", history);
  };

  useEffect(() => {
    recoverRecentSearch();
  }, [recentSearch]);

  return (
    <SafeAreaView style={searchStyles.mainContainer}>
      <View style={searchStyles.top_Header}>
        <TouchableOpacity
          style={searchStyles.go_Back_Icon}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("../images/back-button.png")}
            style={searchStyles.go_Back_Icon_Img}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={{ flex: 1, flexDirection: "row", position: "relative" }}>
          <View style={{ elevation: 11 }}>
            <Image
              source={require("../images/search.png")}
              style={searchStyles.search_Icon}
              resizeMode="contain"
            />
          </View>
          <TextInput
            value={searchInput}
            style={searchStyles.search_Input}
            placeholder="Search"
            placeholderTextColor={'#000'}
            onChangeText={(value) => {
              setSearchInput(value);
              setHomeAfterSearch({
                ...homeAfterSearch,
                isSearch: true,
                searchValue: searchInput,
              });
            }}
            onBlur={(value) => {
              if (searchInput) {
                saveToStorage();
                setSearchTerm(searchInput);
                setRecentSearch([...recentSearch, searchInput]);
                setHomeAfterSearch({
                  ...homeAfterSearch,
                  isSearch: true,
                  searchValue: searchInput,
                });

                setHitNow(!hitNow);
                // fetchFilterPost(dispatchHome, 1, searchInput, stateHome.post);
                navigation.navigate("Home");
              }
            }}
          />
        </View>
        <View style={{ flexDirection: "row", position: "relative" }}>
          <TouchableOpacity
            onPress={() => {
              setSearchInput("");
              setHomeAfterSearch({
                ...homeAfterSearch,
                isSearch: false,
                searchValue: "",
              });
              setSearchTerm("");
              setHitNow(!hitNow);
              navigation.goBack();
            }}
          >
            <Text style={searchStyles.cancle_Btn}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAwareScrollView>
        <View style={searchStyles.sec_padding}>
          {recentSearch?.length > 0 ? (
            <Text style={searchStyles.recent_Search}>Recent Searches</Text>
          ) : (
            <Text>There is no recent search.</Text>
          )}
          <View>
            {recentSearch?.length > 0
              ? recentSearch.map((item, index, arr) => (
                  <TouchableOpacity
                    style={searchStyles.recent_Listing_Item}
                    key={item + index}
                    onPress={() => {
                      setHomeAfterSearch({
                        ...homeAfterSearch,
                        isSearch: true,
                        searchValue: item,
                      });
                      setSearchTerm(item);
                      setHitNow(!hitNow);
                      navigation.navigate("Home");
                    }}
                  >
                    <Text style={searchStyles.recent_Listing_Text}>{item}</Text>

                    <TouchableOpacity
                      onPress={() => {
                        removeRecentSearch(index, item);
                      }}
                    >
                      <Image
                        source={require("../images/cancle-listing.png")}
                        style={searchStyles.cross_Icon}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              : null}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default SearchScreen;

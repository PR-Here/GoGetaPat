import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");

export const Loader = (props) => {
  if (Platform.OS === "android") {
    return (
      <Modal transparent={true} visible={true}>
        <View style={styles.container}>
          <View style={styles.smallContainer}>
            <ActivityIndicator
              size="large"
              color={"gray"}
              accessibilityLabel="ActivityIndicator"
              testID="ActivityIndicator"
            />
          </View>
        </View>
      </Modal>
    );
  } else {
    return (
      <View style={[styles.container, props.dimensionLength]}>
        <View style={styles.smallContainer}>
          <ActivityIndicator
            size="small"
            color={"white"}
            accessibilityLabel="ActivityIndicator"
            testID="ActivityIndicator"
          />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignSelf: "center",
    // marginTop: 20,
    position: "absolute",
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: "#FFFFFF",
    // opacity: 0.3
  },
  smallContainer: {
    justifyContent: "center",
    alignSelf: "center",
    // marginTop: 20,
    position: "relative",
    width: 100,
    height: 100,
    backgroundColor: "#000",
    opacity: 0.8,
    borderRadius: 20,
    zIndex: 1,
  },
});

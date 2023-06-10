import React, { useCallback, memo, useRef, useState } from "react";
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
import Video from "react-native-video";
import VisibilitySensor from "@svanboxel/visibility-sensor-react-native";
const styles = StyleSheet.create({
  slide: {
    width: windowWidth,
    alignItems: "center",
  },
  slideImage: {
    height: hp("53%"),
    width: wp("100%"),
    // resizeMode: "contain"
  },

  pagination: {
    position: "absolute",
    bottom: 8,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotActive: { backgroundColor: "lightblue" },
  paginationDotInactive: { backgroundColor: "gray" },

  carousel: { flex: 1 },
});

const Slide = memo(function Slide({ data }) {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [isPreloading, setisPreloading] = useState(true);
  const [paused, setpaused] = useState(true);
  // if (data.hasOwnProperty("image_url")) {
  // const { width, height } = Image.resolveAssetSource(require("../images/no-image.png"));
  // const ratio = height / width;
  const SCREEN_WIDTH = Dimensions.get("window").width;
  // }

  Image.getSize(
    `${data.image_url}`,
    (width, height) => {
      setHeight(height);
      setWidth(width);
      console.log(`Width: ${width}, Height: ${height}`);
    },
    (error) => console.error(error)
  );

  return (
    <View style={styles.slide}>
      {data.type === "cover" || data.type === "non_cover" ? (
        <Image
          source={
            data.image_url
              ? { uri: data.image_url }
              : require("../images/no-image.png")
          }
          style={[
            styles.slideImage,
            // { height: height ? height : hp("53%") }
          ]}
        ></Image>
      ) : (
        <VisibilitySensor
          onChange={(isVisible) => {
            return (
              isVisible ? setpaused(false) : setpaused(true)
            );
          }}
        >
          <View>
            {isPreloading && (
              <ActivityIndicator
                animating
                color={"#00ADEF"}
                size="large"
                style={{
                  flex: 1,
                  position: "absolute",
                  top: "50%",
                  left: "45%",
                }}
              />
            )}

            <Video
              source={{
                uri: data?.image_url,
              }}
              onLoadStart={() => setisPreloading(true)}
              onLoad={() => setisPreloading(false)}
              style={{ height: hp("53%"), width: windowWidth }}
              controls={false}
              paused={paused}
              resizeMode="cover"
            />
          </View>
        </VisibilitySensor>
      )}
    </View>
  );
});

// function Pagination({ index },list) {
//   return (
//     <View style={styles.pagination} pointerEvents="none">
//       {list.map((_, i) => {
//         return (
//           <View
//             key={i}
//             style={[
//               styles.paginationDot,
//               index === i
//                 ? styles.paginationDotActive
//                 : styles.paginationDotInactive,
//             ]}
//           />
//         );
//       })}
//     </View>
//   );
// }

const Carousel = (props) => {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  const flatListOptimizationProps = {
    initialNumToRender: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    scrollEventThrottle: 16,
    windowSize: 2,
    // _keyExtractor = (item, index) => item.item.key;
    keyExtractor: (data, index) => index,
    getItemLayout: useCallback(
      (_, index) => ({
        index,
        length: windowWidth,
        offset: index * windowWidth,
      }),
      []
    ),
  };

  const renderItem = useCallback(function renderItem({ item, index }) {
    // console.log(index)
    return <Slide data={item} />;
  }, []);

  return (
    <>
      <FlatList
        data={props.images}
        style={styles.carousel}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        {...flatListOptimizationProps}
      />
      {/* <Pagination list = {props.images} index={index}></Pagination> */}
    </>
  );
};

export default Carousel;

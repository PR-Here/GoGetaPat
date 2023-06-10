import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { themeColor } from '../common/common';

function Accordian({
  data,
  title,
  styleColour = true,
  reset,
  setReset,
  setGetDataAcc = () => { },
  commingFrom
}) {
  const [expanded, setExpanded] = useState(false);
  const [titl, setTitl] = useState(title);
  const accordian = useRef();
  useEffect(() => {
    if (reset) {
      setTitl(title);
      setReset(false);
    }
  }, [reset]);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  let toggleExpand = status => {
    if ((status = false)) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(expanded);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const hellofriend = () => {
    return 'item';
  };

  let dropdownimgStyle = commingFrom == "detailscr" ? styles.row_1 : styles.row;
  let accrodianStyle = commingFrom == "detailscr" ? styles.accordian_Icon1 : styles.accordian_Icon;
  return (
    <>
      <TouchableOpacity
        ref={accordian}
        style={[dropdownimgStyle, { height: expanded ? 40 : 56 }]}
        onPress={() => {
          toggleExpand(true)
        }}>
        {styleColour ? (
          <Text style={[styles.title]}>{titl}</Text>
        ) : (
          <Text style={[styles.titleblack]}>{titl}</Text>
        )}

        <Image
          source={
            expanded
              ? require('../images/up-arrow.png')
              : require('../images/down-arrow.png')
          }
          style={accrodianStyle}
        />
      </TouchableOpacity>
      <View
        style={
          (styles.parentHr,
          {
            borderBottomColor: expanded ? null : '#ddd',
            borderBottomWidth: expanded ? null : 1,
          })
        }
      />
      {expanded && (
        <View
          style={[
            styles.child,
            {
              borderBottomColor: expanded ? '#ddd' : null,
              borderBottomWidth: expanded ? 1 : null,
            },
          ]}>
          {data?.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.name + item.index + index}
                style={styles.child_Inner}
                onPress={() => {
                  setTitl(item.name);
                  toggleExpand(false);
                  setGetDataAcc({ name: item.name, id: item.id, catgId: item.category_id ?? null });
                  // return item.name
                }}>
                <Text> {item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );
}

export default Accordian;
const styles = StyleSheet.create({
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: themeColor,
  },
  titleblack: {
    fontSize: wp('4%'),
    // fontWeight: 'bold',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 18,
    alignItems: 'center',
  },
  row_1: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // paddingRight: 18,
    // paddingRight: 10,
    alignItems: 'center',
  },
  parentHr: {
    height: 1,
    color: '#fff',
    width: '100%',
  },
  child: {
    marginBottom: 5,
  },
  child_Inner: {
    paddingVertical: 3,
    paddingBottom: 10,
  },
  accordian_Icon: {
    width: wp('4%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  accordian_Icon1: {
    marginLeft: 8,
    width: wp('4%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
});

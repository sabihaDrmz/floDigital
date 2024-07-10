import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

// import { IScreenWithHeaderProps, screenWithHeader } from '../../../helper/hocs/screenWithHeader';
import SliderBorderFirst from '../../CustomIcons/SliderBorderFirst';
import SliderBorderLast from '../../CustomIcons/SliderBorderLast';
import SliderBorderMiddle from '../../CustomIcons/SliderBorderMiddle';
// import { IHeaderSliderMenuItem } from '../context/HeaderContext';

const SelectedBgMaker = (props: any) => {
  let width = props.width;
  const EDGE_WIDTH = 79;
  width += EDGE_WIDTH;
  if (width < EDGE_WIDTH + 20) width = EDGE_WIDTH + 20;
  return (
    <View
      style={{
        backgroundColor: 'rgb(246,246,246)',
        flexDirection: 'row',
      }}>
      {/* <View
        style={{
          width: 50,
          height: 59,
          backgroundColor: 'rgb(255, 134, 0)',
          borderBottomRightRadius: 20,
        }}
      />
      <View
        style={{
          backgroundColor: 'rgb(255, 134, 0)',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            height: 59,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingLeft: 20,
            paddingRight: 20,
          }}>
          {props.children}
        </View>
      </View>
      <View
        style={{
          width: 50,
          height: 59,
          backgroundColor: 'rgb(255, 134, 0)',

          borderBottomLeftRadius: 20,
        }}
      /> */}
      <Svg width={width} height={60} style={{ width: '100%' }}>
        <G>
          <Path
            fill={'#ff8600'}
            d={`m ${width} 0 h 0 c 1.914 0 1.709 -0.191 1.709 1.76 v 57 h 0.234 a 21.728 21.728 90 0 1 -21.47 -17.227 a 21.162 21.162 90 0 1 -0.5 -4.443 c -0.056 -6.274 0 -12.548 -0.038 -18.822 a 24.091 24.091 90 0 0 -1.8 -9.6 c -2.01 -4.63 -5.649 -6.91 -10.528 -7.224 c -3.124 -0.2 -6.264 -0.193 -9.4 -0.194 q -47.855 -0.019 -${width - EDGE_WIDTH
              } 0.017 a 23.465 23.465 90 0 0 -7.517 0.82 c -4.306 1.436 -6.684 4.628 -7.723 8.839 a 34.552 34.552 90 0 0 -0.988 7.444 c -0.139 6.144 -0.04 12.293 -0.052 18.439 a 21.957 21.957 90 0 1 -18.324 21.681 a 22.328 22.328 90 0 1 -3.594 0.26 c -1.28 0 -1.282 0 -1.282 -1.345 v -55.95 c 0 -1.452 0 -1.453 1.448 -1.453 z`}
          />
        </G>
      </Svg>
      <View
        style={{
          position: 'absolute',
          paddingTop: 10,
          width,
        }}>
        {props.children}
      </View>
    </View>
  );
};
const HeaderSliderMenu: React.FC<{
  tabs: any[];
  onChangeTab?: (index: number) => void;
  currentTab?: number;
}> = (props) => {
  const [currentSelected, setCurrent] = useState(props.currentTab || 0);

  const renderItem = (itm: any, selected: boolean = false) => {
    if (itm.visible !== false) {
      if (itm.enabled !== false) {
        return selected && itm.selectedItem
          ? itm.selectedItem
          : itm.defaultItem;
      } else {
        return itm.disabledItem ? itm.disabledItem : itm.defaultItem;
      }
    } else {
      return null;
    }
  };

  const changeTab = (index: number) => {
    if (props.onChangeTab) props.onChangeTab(index);
    setCurrent(index);
  };

  const renderList = () => {
    return props.tabs.map((x: any, ind: number) => {
      if (
        ind === (props.currentTab !== -1 ? props.currentTab : currentSelected)
      ) {
        return (
          <TouchableOpacity key={ind} activeOpacity={1}>
            <SelectedBgMaker width={x.customWidth ? x.customWidth : 80}>
              {x.selectedItem}
            </SelectedBgMaker>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            disabled={x.enabled === false}
            activeOpacity={1}
            style={[
              styles.headerItem,
              styles.noSelect,
              {
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
            onPress={() => changeTab(ind)}>
            {renderItem(x)}
          </TouchableOpacity>
        );
      }
    });
  };

  // return (
  //   <FlatList
  //     style={{backgroundColor: '#ff8600'}}
  //     data={props.tabs}
  //     renderItem={({item, index}) => {
  //       if (index === currentSelected) {
  //         return (
  //           <TouchableOpacity activeOpacity={1}>
  //             <SelectedBgMaker width={item.customWidth ? item.customWidth : 80}>
  //               {item.selectedItem}
  //             </SelectedBgMaker>
  //           </TouchableOpacity>
  //         );
  //       } else {
  //         return (
  //           <TouchableOpacity
  //             disabled={item.enabled === false}
  //             activeOpacity={1}
  //             style={[
  //               styles.headerItem,
  //               styles.noSelect,
  //               {
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //               },
  //             ]}
  //             onPress={() => changeTab(index)}>
  //             <View style={{height: 59, width: 100}}>
  //               <Text>Bura</Text>
  //             </View>
  //           </TouchableOpacity>
  //         );
  //       }
  //     }}
  //     horizontal
  //   />
  // );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        backgroundColor: '#ff8600',
        width: Dimensions.get('window').width,
        // flexDirection: 'row',
        height: 59,
      }}>
      {renderList()}
    </ScrollView>
  );
};

export default HeaderSliderMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff8600',
    maxHeight: 79,
  },
  flatContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: '#ff8600',
  },
  selectedItem: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  noSelect: {
    backgroundColor: '#ff8600',
  },
  selectedImg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  selectFirst: {},
  selectLast: {},
});

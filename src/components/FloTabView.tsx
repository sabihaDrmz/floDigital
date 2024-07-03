import React, {Component} from 'react';
import {
  Keyboard,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../theme/colors';

type FloTabViewProps = {
  tabTitles: string[];
  tabViews: any[];
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
class FloTabView extends Component<FloTabViewProps> {
  state = {selectedItem: 0, scrollableEnable: true};

  constructor(props: any) {
    super(props);

    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = () => {
    this.setState({scrollableEnable: false});
  };

  _keyboardDidHide = () => {
    this.setState({scrollableEnable: true});
  };
  tabScroll: ScrollView | undefined | null = null;
  render() {
    return (
      <View>
        <ScrollView
          style={styles.container}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {this.props.tabTitles.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.tabButton,
                this.state.selectedItem === index
                  ? styles.tabButtonActive
                  : null,
              ]}
              key={index}
              onPress={() =>
                this.setState(
                  {selectedItem: index},
                  this.tabScroll.scrollTo({x: screenWidth * index}),
                )
              }>
              <Text
                key={index}
                style={
                  this.state.selectedItem === index
                    ? styles.tabButtonActiveText
                    : styles.tabButtonPassive
                }>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          ref={(tab) => (this.tabScroll = tab)}
          horizontal
          pagingEnabled
          scrollEnabled={this.state.scrollableEnable}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            let pos = event.nativeEvent.contentOffset;
            let scrollToIndex = pos.x / screenWidth;

            if (scrollToIndex % 1 === 0) {
              this.setState({selectedItem: scrollToIndex});
            }
          }}>
          {this.props.tabViews.map((item, index) => (
            <View key={index} style={styles.pageItem}>
              {item}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
export default FloTabView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: colors.brightOrange,
    borderWidth: 1,
  },
  pageItem: {
    width: screenWidth,
  },
  tabButton: {
    minWidth: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.brightOrange,
  },
  tabButtonActiveText: {
    color: '#fff',
  },
  tabButtonPassive: {
    color: '#000',
  },
});

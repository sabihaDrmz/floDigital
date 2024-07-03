import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { colors } from '../theme/colors';

type RadioValue = {
  key: any;
  value: string;
};

interface FloRadioButtonProps {
  values: RadioValue[];
}

class FloRadioButton extends Component<FloRadioButtonProps> {
  state = { currentRadioSelect: this.props.values[0].key };
  _renderItem = (item: RadioValue) => (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.radio}
      onPress={() => this.setState({ currentRadioSelect: item.key })}>
      <View
        style={[
          styles.circle,
          this.state.currentRadioSelect === item.key
            ? styles.circleSelect
            : null,
        ]}></View>
      <Text>{item.value}</Text>
    </TouchableOpacity>
  );
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.values}
          renderItem={(itr) => this._renderItem(itr.item)}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}
export default FloRadioButton;

const CIRCLE_SIZE = 15;
const styles = StyleSheet.create({
  container: { paddingLeft: 20, paddingRight: 20 },
  radio: {
    marginRight: 10,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    borderColor: colors.brightOrange,
    marginRight: 10,
  },
  circleSelect: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    borderColor: colors.darkGrey,
    backgroundColor: colors.brightOrange,
    marginRight: 10,
  },
});

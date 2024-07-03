import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class FloModal extends Component {
  render() {
    return <View style={styles.container}>{this.props.children}</View>;
  }
}
export default FloModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

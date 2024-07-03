import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CancelFromStore: React.FC = (props) => (
  <View style={styles.container}>
    <Text>CancelFromStore</Text>
  </View>
);
export default CancelFromStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

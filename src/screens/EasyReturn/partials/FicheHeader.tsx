import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface FicheHeaderProps {}
const FicheHeader = (props: FicheHeaderProps) => (
  <View style={styles.container}>
    <Text>FicheHeader</Text>
  </View>
);
export default FicheHeader;

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: 'red',
  },
});

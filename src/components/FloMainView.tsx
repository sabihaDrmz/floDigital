import React, {ReactNode} from 'react';
import {View, StyleSheet} from 'react-native';
import {FloHeader} from './Header';

interface FloMainViewProps {
  headerTitle?: string;
  hideHeader?: boolean;
  children?: ReactNode;
}
const FloMainView = (props: FloMainViewProps) => (
  <View>
    {props.hideHeader ? null : (
      <FloHeader
        headerType={'standart'}
        headerTitle={props.headerTitle ? props.headerTitle : ''}
      />
    )}
    {props.children}
  </View>
);
export default FloMainView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

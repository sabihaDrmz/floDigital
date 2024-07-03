import React from 'react';
import {View, Text, StyleSheet, TextProps} from 'react-native';
import {fontFamilies} from '../../theme/fontStyles';

const DisplayText: React.FC<DisplayTextProps> = (props) => (
  <Text
    {...props}
    style={[
      styles.base,
      props.type === DisplayTextType.XS
        ? styles.xs
        : props.type === DisplayTextType.S
        ? styles.s
        : props.type === DisplayTextType.M
        ? styles.m
        : props.type === DisplayTextType.L
        ? styles.l
        : styles.m,
      props.style,
    ]}>
    {props.children}
  </Text>
);
export default DisplayText;

const styles = StyleSheet.create({
  base: {
    ...fontFamilies.SemiBold,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
  },
  xs: {fontSize: 36, lineHeight: 44},
  s: {fontSize: 44, lineHeight: 52},
  m: {fontSize: 52, lineHeight: 64},
  l: {fontSize: 96, lineHeight: 112},
});

export enum DisplayTextType {
  XS,
  S,
  M,
  L,
}

export interface DisplayTextProps extends TextProps {
  type?: DisplayTextType;
}

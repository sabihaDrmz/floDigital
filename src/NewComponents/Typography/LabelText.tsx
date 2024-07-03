import React from 'react';
import {View, Text, StyleSheet, TextProps} from 'react-native';
import {fontFamilies} from '../../theme/fontStyles';

const LabelText: React.FC<LabelTextProps> = (props) => (
  <Text
    {...props}
    style={[
      styles.base,
      props.type === LabelTextType.XS
        ? styles.xs
        : props.type === LabelTextType.S
        ? styles.s
        : props.type === LabelTextType.M
        ? styles.m
        : props.type === LabelTextType.L
        ? styles.l
        : styles.m,
      props.style,
    ]}>
    {props.children}
  </Text>
);
export default LabelText;

const styles = StyleSheet.create({
  base: {
    ...fontFamilies.Medium,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
  },
  xs: {fontSize: 12, lineHeight: 16},
  s: {fontSize: 14, lineHeight: 16},
  m: {fontSize: 16, lineHeight: 20},
  l: {fontSize: 18, lineHeight: 24},
});

export enum LabelTextType {
  XS,
  S,
  M,
  L,
}

export interface LabelTextProps extends TextProps {
  type?: LabelTextType;
}

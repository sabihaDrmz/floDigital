import React from 'react';
import {Text, StyleSheet, TextProps} from 'react-native';
import {fontFamilies} from '../../theme/fontStyles';

const HeadingText: React.FC<HeadingTextProps> = (props) => (
  <Text
    {...props}
    style={[
      styles.base,
      props.type === HeadingTextType.XS
        ? styles.xs
        : props.type === HeadingTextType.S
        ? styles.s
        : props.type === HeadingTextType.M
        ? styles.m
        : props.type === HeadingTextType.L
        ? styles.l
        : props.type === HeadingTextType.XL
        ? styles.xl
        : props.type === HeadingTextType.XXL
        ? styles.xxl
        : styles.m,
      props.style,
    ]}>
    {props.children}
  </Text>
);
export default HeadingText;

const styles = StyleSheet.create({
  base: {
    ...fontFamilies.Medium,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
  },
  xs: {fontSize: 20, lineHeight: 28},
  s: {fontSize: 24, lineHeight: 32},
  m: {fontSize: 28, lineHeight: 36},
  l: {fontSize: 32, lineHeight: 40},
  xl: {fontSize: 36, lineHeight: 44},
  xxl: {fontSize: 40, lineHeight: 52},
});

export enum HeadingTextType {
  XS,
  S,
  M,
  L,
  XL,
  XXL,
}

export interface HeadingTextProps extends TextProps {
  type?: HeadingTextType;
}

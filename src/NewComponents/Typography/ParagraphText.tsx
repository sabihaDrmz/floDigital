import React from 'react';
import {Text, StyleSheet, TextProps} from 'react-native';
import {fontFamilies} from '../../theme/fontStyles';

const ParagraphText: React.FC<ParagraphTextProps> = (props) => (
  <Text
    {...props}
    style={[
      props.type === ParagraphTextType.XS
        ? styles.xs
        : props.type === ParagraphTextType.S
        ? styles.s
        : props.type === ParagraphTextType.M
        ? styles.m
        : props.type === ParagraphTextType.L
        ? styles.l
        : props.type === ParagraphTextType.XL
        ? styles.xl
        : styles.m,
      props.style,
    ]}>
    {props.children}
  </Text>
);
export default ParagraphText;

const styles = StyleSheet.create({
  xs: {
    ...fontFamilies.ExtraLight,
    fontSize: 10,
    fontWeight: '200',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
  },
  s: {
    ...fontFamilies.Light,
    fontSize: 12,
    fontWeight: '300',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
  },
  m: {
    ...fontFamilies.Light,
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
  },
  l: {
    ...fontFamilies.Light,
    fontSize: 16,
    fontWeight: '300',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
  },
  xl: {
    ...fontFamilies.Light,
    fontSize: 18,
    fontWeight: '300',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
  },
});

export enum ParagraphTextType {
  XS,
  S,
  M,
  L,
  XL,
}

export interface ParagraphTextProps extends TextProps {
  type?: ParagraphTextType;
}

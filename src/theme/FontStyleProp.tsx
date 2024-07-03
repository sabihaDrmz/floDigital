import {ColorValue} from 'react-native';

export type FontStyleProp = {
  color?: ColorValue;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
  /**
   * Specifies font weight. The values 'normal' and 'bold' are supported
   * for most fonts. Not all fonts have a variant for each of the numeric
   * values, in that case the closest one is chosen.
   */
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  textDecorationLine?:
    | 'none'
    | 'underline'
    | 'line-through'
    | 'underline line-through';
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  textDecorationColor?: ColorValue;
  textShadowColor?: ColorValue;
  textShadowOffset?: {width: number; height: number};
  textShadowRadius?: number;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  testID?: string;
};

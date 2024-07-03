import {Platform} from 'react-native';

export const paddings = {
  defaultLeft: 20,
  defaultRight: 20,
  loginTop: Platform.OS === 'android' ? 20 : 80,
  textInputPadding: 16,
};

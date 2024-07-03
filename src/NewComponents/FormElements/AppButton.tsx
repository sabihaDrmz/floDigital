import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {LabelText} from '..';
import {AppColor} from '../../theme/AppColor';

const AppButton: React.FC<AppButtonProps> = (props) => (
  <TouchableOpacity
    {...props}
    style={[
      styles.container,
      props.style,
      props.type === AppButtonType.Danger
        ? styles.danger
        : props.type === AppButtonType.Gray
        ? styles.passive
        : props.type === AppButtonType.Success
        ? styles.success
        : props.type === AppButtonType.Normal
        ? styles.system
        : styles.system,
    ]}
    disabled={props.disabled ? props.disabled : props.loading}>
    {props.loading && (
      <ActivityIndicator
        style={styles.indicator}
        color={AppColor.FD.Text.Pure}
      />
    )}
    <LabelText style={styles.labelStyle}>{props.label}</LabelText>
  </TouchableOpacity>
);
export default AppButton;

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    color: AppColor.FD.Text.Pure,
  },
  indicator: {
    position: 'absolute',
    left: 30,
  },
  danger: {
    backgroundColor: AppColor.FD.Functional.Error,
  },
  success: {
    backgroundColor: AppColor.FD.Functional.Success,
  },
  passive: {
    backgroundColor: AppColor.FD.Text.Light,
  },
  system: {
    backgroundColor: AppColor.FD.Brand.Solid,
  },
});

export interface AppButtonProps extends TouchableOpacityProps {
  loading?: boolean;
  label?: string;
  type?: AppButtonType;
}

export enum AppButtonType {
  Normal,
  Gray,
  Danger,
  Success,
}

import React, { useState, useEffect } from "react";
import { View, ViewProps, StyleSheet, TouchableOpacity } from "react-native";
import { AppColor } from "../../theme/AppColor";

interface CheckBoxsalesProps extends ViewProps {
  checked?: boolean;
  disabled?: boolean;
  checkboxIconContainerStyle?: object
  style: any;
  onChangeChecked?: (state?: boolean) => void;
  checkedIcon?: any;
};

const CheckBoxSales = (props: CheckBoxsalesProps) => {
  const [checked, setChecked] = useState(props.checked);

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked]);

  const renderCheckedIcon = () => {
    if (checked) {
      return props.checkedIcon ? props.checkedIcon : (
        <View style={styles.checkboxIconContainerTrue} />
      )
    }
    return null
  }

  return (
    <View style={props.style}>
      <TouchableOpacity disabled={props.disabled}
        onPress={() => {
          let newValue = !checked;
          setChecked(newValue);
          if (props.onChangeChecked) props.onChangeChecked(newValue);
        }}>
        <View style={props.checkboxIconContainerStyle ? props.checkboxIconContainerStyle : styles.checkboxIconContainer}>
          {renderCheckedIcon()}
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default CheckBoxSales;

const styles = StyleSheet.create({
  checkboxIconContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: AppColor.OMS.Background.Light,
    borderWidth: 1,
    borderColor: "#b7b5b5"
  },
  checkboxIconContainerTrue: {
    width: 15,
    height: 15,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColor.OMS.Background.Fundamental
  }
});

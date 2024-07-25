import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  StyleProp,
  TextStyle,
  TouchableOpacity
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { colors } from "../theme/colors";

interface FloCheckBoxProps extends ViewProps {
  title: string;
  checked?: boolean;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  onChangeChecked?: (state?: boolean) => void;
}

const FloCheckBox = (props: FloCheckBoxProps) => {
  const [checked, setChecked] = useState(props.checked);
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={[styles.container, props.style]}
      onPress={() => {
        let newValue = !checked;
        setChecked(newValue);

        if (props.onChangeChecked) props.onChangeChecked(newValue);
      }}
    >
      <View style={styles.checkboxIconContainer}>
        {checked ? (
          <FontAwesomeIcon icon={"check"} color={"white"} size={16} />
        ) : null}
      </View>
      <Text style={[styles.title, props.textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};
export default FloCheckBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    minHeight: 20,
  },
  checkboxIconContainer: {
    width: 20,
    height: 20,
    backgroundColor: colors.brightOrange,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins_400Regular",
  },
});

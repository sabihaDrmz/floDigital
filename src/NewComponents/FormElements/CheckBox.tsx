import React, { FC, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { ParagraphText, ParagraphTextType } from "..";
import { AppColor } from "../../theme/AppColor";

const CheckBox: FC<CheckBoxProps> = (props) => {
  const [selected, setSelect] = useState(false);

  const onSelect = () => {
    const value = !selected;

    setSelect(value);
    if (props.onChange) props.onChange(value);
  };

  return (
    <TouchableOpacity onPress={onSelect} style={styles.container}>
      <View style={[styles.box, selected && styles.boxSelected]}>
        {selected && <FontAwesomeIcon icon={"check"} color={"#fff"} size={15} />}
      </View>
      <ParagraphText
        style={{ color: AppColor.FD.Text.Ash }}
        type={ParagraphTextType.M}
      >
        {props.label}
      </ParagraphText>
    </TouchableOpacity>
  );
};
export default CheckBox;

const styles = StyleSheet.create({
  box: {
    width: 25,
    height: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "rgba(0,0,0,0.3)",
    marginRight: 15,
  },
  boxSelected: {
    backgroundColor: AppColor.FD.Navy.Greenish,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export interface CheckBoxProps {
  selected?: boolean;
  label?: string;
  onChange?: (selectedState: boolean) => void;
}

import {
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const Radio: React.FC<{
  selected?: boolean;
  label?: string;
  onSelect?: () => void;
}> = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onSelect}
      style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          marginRight: 10,
          backgroundColor: "#e4e4e4",
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.selected && (
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: AppColor.FD.Brand.Solid,
            }}
          />
        )}
      </View>
      <AppText
        selectable
        labelColorType={props.selected ? ColorType.Dark : ColorType.Gray}
        style={{ fontWeight: props.selected ? "500" : "300" }}
      >
        {props.label}
      </AppText>
    </TouchableOpacity>
  );
};

export default Radio;

import { ParagraphText, ParagraphTextType } from "NewComponents";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ColorValue,
  StyleProp,
  ViewStyle,
} from "react-native";
import { AppColor } from "../../theme/AppColor";

const RadioButtonList: React.FC<RadioButtonListProps> = (props) => {
  const RadioCard: React.FC<{
    value: string;
    text: string;
    customColor?: ColorValue;
    selectedValue: string;
    onSelect: (key: string) => void;
  }> = (props) => {
    return (
      <TouchableOpacity
        onPress={() => props.onSelect(props.value)}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <ParagraphText
          type={ParagraphTextType.M}
          style={[{ color: props.customColor }]}
        >
          {props.text.toUpperCase()}
        </ParagraphText>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: AppColor.FD.Text.Light,
            marginLeft: 5,
            padding: 4,
          }}
        >
          {props.selectedValue === props.value && (
            <View
              style={{
                flex: 1,
                backgroundColor: props.customColor
                  ? props.customColor
                  : AppColor.FD.Text.Dark,
                borderRadius: 13,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (props.selectedValue && props.selectedValue !== current)
      setCurrent(props.selectedValue);
  });
  return (
    <View style={[styles.container, props.containerStyle]}>
      <FlatList
        bounces={false}
        nestedScrollEnabled
        horizontal={props.horizontal}
        data={props.values}
        renderItem={({ item }) => (
          <RadioCard
            onSelect={(res) => {
              setCurrent(res);
              if (props.onSelect) props.onSelect(res);
            }}
            selectedValue={current}
            {...item}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ marginRight: 20 }} />}
      />
    </View>
  );
};
export default RadioButtonList;

const styles = StyleSheet.create({
  container: {},
});

export interface RadioButtonListProps {
  values: { value: string; text: string; customColor?: ColorValue }[];
  horizontal?: boolean;
  onSelect?: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  selectedValue?: string;
}

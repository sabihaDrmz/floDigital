import React, { useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle, FlatList, TouchableOpacity } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { LabelText, ParagraphText } from "..";
import { AppColor } from "../../theme/AppColor";

const AppComboBox: React.FC<AppComboBoxProps> = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [current, setCurrent] = useState("");
  const onSelect = (item: { value: string; text: string }) => {
    setCurrent(item.value);
    props.onSelect(item.value);
    setShowDropdown(false);
  };
  return (
    <View style={props.containerStyle}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, props.style]}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <ParagraphText style={styles.text}>
          {props.values.find((x) => x.value === current)
            ? props.values.find((x) => x.value === current)?.text
            : props.label}
        </ParagraphText>
        <View style={styles.dropDownIco}>
          <Octicons
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={30}
            color={"#fff"}
          />
        </View>
      </TouchableOpacity>
      {showDropdown && (
        <View
          style={{
            height: 200,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            padding: 10,
          }}
        >
          <FlatList
            bounces={false}
            data={props.values}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                key={item.value}
                style={{
                  height: 30,
                  marginVertical: 9,
                  justifyContent: "center",
                }}
              >
                <LabelText style={{ color: AppColor.FD.Text.Ash }}>
                  {item.text}
                </LabelText>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
            ItemSeparatorComponent={() => (
              <View
                style={{ height: 1, backgroundColor: AppColor.FD.Text.Light }}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};
export default AppComboBox;

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AppColor.FD.Text.Light,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    color: AppColor.FD.Text.Ash,
    marginRight: 10,
  },
  dropDownIco: {
    backgroundColor: "rgba(168, 168, 168,1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    width: 52,
    height: 52,
  },
});

interface AppComboBoxProps {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  values: { value: string; text: string }[];
  onSelect: (value: string) => void;
}

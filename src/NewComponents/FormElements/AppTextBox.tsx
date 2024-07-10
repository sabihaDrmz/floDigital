import { ParagraphText, ParagraphTextType } from "../../NewComponents";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  Alert,
  StyleProp,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { MaskService } from "react-native-masked-text";
import { AppColor } from "../../theme/AppColor";
import { fontFamilies } from "../../theme/fontStyles";

export const TextManipulator = (
  txt: string,
  format?: "onlyNumber" | "phone" | "date"
) => {
  let charArray = Array.from(txt);
  txt = charArray
    .filter((x) => {
      x = x.trim();
      if (!x) {
        return false;
      }
      x = x.replace(/^0+/, "") || "0";
      var n = Math.floor(Number(x));
      return n !== Infinity && String(n) === x && n >= 0;
    })
    .join("");

  if (format && format === "date") {
    txt = MaskService.toMask("datetime", txt, { format: "DD/MM/YYYY" });
  }
  if (format && format === "phone") {
    if (!txt.startsWith("0") && txt.length > 0) txt = `0${txt}`;

    txt = MaskService.toMask("cel-phone", txt, {
      withDDD: true,
      dddMask: "9 ( 999 ) 999 99 99",
    });
  }

  return txt;
};

const AppTextBox: React.FC<AppTextBoxProps> = (props) => {
  const [onLoad, setOnload] = useState(false);
  useEffect(() => {
    if (
      props.format &&
      props.value &&
      !MaskService.isValid("cel-phone", props.value, {
        withDDD: true,
        dddMask: "9 ( 999 ) 999 99 99",
      })
    ) {
      if (props.onChangeText)
        props.onChangeText(TextManipulator(props.value, props.format));
    }
    if (
      props.format &&
      props.value &&
      !MaskService.isValid("datetime", props.value, { format: "DD/MM/YYYY" })
    ) {
      if (props.onChangeText)
        props.onChangeText(TextManipulator(props.value, props.format));
    }
  });
  return (
    <View style={styles.container}>
      {props.label && (
        <ParagraphText
          style={[
            {
              marginLeft: 10,
              borderColor: AppColor.FD.Text.Ash,
              marginBottom: 4,
            },
            props.labelStyle,
          ]}
          type={ParagraphTextType.L}
        >
          {props.label}
        </ParagraphText>
      )}
      <View
        style={[
          {
            borderWidth: 1,
            borderColor: AppColor.FD.Text.Light,
            minHeight: 42,
            borderRadius: 8,
            paddingHorizontal: 13,
            paddingTop: 8,
            paddingBottom: props.multiline ? 20 : 9,
            maxHeight: 130,
          },
          props.backgroundColor,
        ]}
      >
        <TextInput
          selectionColor={AppColor.FD.Brand.Solid}
          style={{ ...fontFamilies.Light, fontSize: 15 }}
          {...props}
          textAlignVertical={"top"}
          onChangeText={(txt) => {
            let manipuleText = props.format
              ? TextManipulator(txt, props.format)
              : txt;
            if (props.onChangeText) props.onChangeText(manipuleText);
          }}
        />
      </View>
    </View>
  );
};
export default AppTextBox;

const styles = StyleSheet.create({
  container: {},
});

interface AppTextBoxProps extends TextInputProps {
  label?: string;
  format?: "onlyNumber" | "phone" | "date";
  labelStyle?: StyleProp<TextStyle>;
  backgroundColor?: StyleProp<ViewStyle>;
}

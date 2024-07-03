import React, { LegacyRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";

import { colors } from "../theme/colors";

interface FloTextBoxNewProps extends TextInputProps {
  inputHeight?: number;
  floatingLabel?: boolean;
  rounded?: boolean;
  label?: string;
  maskType?: "cel-phone";
  refText?: LegacyRef<TextInput> | TextInput | null | undefined;
  onBlur?: () => void
}

const FloTextBoxNew = (props: FloTextBoxNewProps) => {
  const [value, setValue] = useState(props.value ? props.value : "");
  let barcodeOptions = {
    withDDD: true,
    dddMask: "9 ( 999 ) 999 99 99",
  };
  return (
    <View>
      {props.label && (
        <Text style={[styles.labelStyle, props.rounded && { marginLeft: 20 }]}>
          {props.label}
        </Text>
      )}
      {props.maskType && (
        <TextInputMask
          value={value}
          onChangeText={(txt) => {
            setValue(txt.startsWith("0") ? txt : "0" + txt);
            if (props.onChangeText) props.onChangeText("0" + txt);
          }}
          type={"cel-phone"}
          style={[
            styles.inputStyle,
            props.style,
            props.rounded && styles.inputRounded,
          ]}
          placeholder={props.floatingLabel ? "" : props.placeholder}
          underlineColorAndroid={"transparent"}
          selectionColor={"#FF8600"}
          options={barcodeOptions}
          {...props}
          // @ts-expect-error
          refInput={props.refText}
        />
      )}
      {!props.maskType && (
        <TextInput
          //@ts-expect-error
          ref={props.refText}
          selectionColor={"#FF8600"}
          underlineColorAndroid={"transparent"}
          value={value}
          onChangeText={setValue}
          style={[
            styles.inputStyle,
            props.style,
            props.rounded && styles.inputRounded,
          ]}
          {...props}
          placeholder={props.floatingLabel ? "" : props.placeholder}
          placeholderTextColor={"#707070"}
          onBlur={props.onBlur && props.onBlur}
        />
      )}
    </View>
  );
};
export default FloTextBoxNew;

const styles = StyleSheet.create({
  container: {
    borderColor: colors.warmGrey,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 24,
    marginLeft: 10,
    marginRight: 10,
  },
  inputStyle: {
    borderColor: "#CECACA",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "Poppins_200ExtraLight",
    fontSize: 15,
    color: "#707070",
  },
  inputRounded: {
    borderRadius: 30,
  },
  labelStyle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#707070",
    marginLeft: 10,
  },
});

import { observer } from "mobx-react";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import EasyReturnService from "../../../core/services/EasyReturnService";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { colors } from "../../../theme/colors";

const RadioTypeButtons = { productSelect: ["İade", "Değişim"] };

interface BarcodeRadioProps {
  onSelectChange: (selectedButton: number) => void;
  buttons: string[];
  currentIndex?: number;
}

const BarcodeRadio = (props: BarcodeRadioProps) => {
  let [i, setI] = useState(0);

  if (props.currentIndex !== undefined && props.currentIndex - 1 != i)
    setI(props.currentIndex - 1);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {props.buttons.map((button, index) => {
          return (
            <TouchableOpacity
              key={button}
              activeOpacity={0.7}
              onPress={() => {
                setI(index);
                props.onSelectChange(index);
              }}
              style={[styles.button, index === i ? styles.buttonActive : null]}
            >
              <Text
                style={[
                  styles.buttonText,
                  index === i ? styles.buttonTextActive : null,
                ]}
              >
                {button}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
export default BarcodeRadio;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: colors.whiteFour,
    flexDirection: "row",
    borderRadius: 20,
  },
  button: {
    paddingLeft: 30,
    paddingTop: 7,
    paddingBottom: 10,
    paddingRight: 30,
  },
  buttonActive: {
    backgroundColor: colors.brightOrange,
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    lineHeight: PerfectFontSize(19),
    color: colors.warm_grey_two,
  },
  buttonTextActive: {
    color: colors.white,
  },
});

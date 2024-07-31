import React, { Component, LegacyRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  Animated,
  Platform,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { paddings } from "../theme/paddingConst";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { TextInputMask } from "react-native-masked-text";
import { Keyboard } from "react-native";
import { PerfectFontSize } from "../helper/PerfectPixel";

interface FloTextBoxProps extends TextInputProps {
  floatingLabel?: boolean;
  refText?: LegacyRef<TextInput> | TextInput | null | undefined;
  inputHeight?: number;
  mask?:
    | "credit-card"
    | "cpf"
    | "cnpj"
    | "zip-code"
    | "only-numbers"
    | "money"
    | "cel-phone"
    | "datetime"
    | "custom";
  onlyNumber?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

class FloTextBox extends Component<FloTextBoxProps> {
  state = { curText: "", overrideTextEntry: false };
  refText?: TextInput | null | undefined;

  AnimatedValue = new Animated.Value(Platform.OS === "ios" ? 20 : 24);
  AnimatedTiming = Animated.timing(this.AnimatedValue, {
    toValue: -7,
    delay: 10,
    duration: 300,
    useNativeDriver: false,
  });

  AnimatedBackTiming = Animated.timing(this.AnimatedValue, {
    toValue: Platform.OS === "ios" ? 20 : 24,
    delay: 10,
    duration: 300,
    useNativeDriver: false,
  });

  componentDidMount() {
    if (this.props.value && this.props.value !== "") {
      this.setState({ curText: this.props.value });
      this.AnimatedTiming.start();
    }
  }

  textChange = (input: string) => {
    if (this.props.onlyNumber)
      input = FloTextBox.clearNonNumericCharacters(input);
    this.setState({ curText: input });

    if (this.props.onChangeText) this.props.onChangeText(input);

    if (this.props.mask && input.length === 19) {
      Keyboard.dismiss();
    }
  };

  static clearNonNumericCharacters(input: string): string {
    let arr = input.split("");
    let str = "";
    for (var item of arr) {
      if (Number.isInteger(Number(item))) str += item;
    }
    return str;
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.mask ? (
          <TextInputMask
            // @ts-expect-error
            refInput={this.props.refText}
            maxLength={19}
            type={this.props.mask}
            options={{
              withDDD: true,
              dddMask: "9 ( 999 ) 999 99 99",
            }}
            {...this.props}
            secureTextEntry={
              this.state.overrideTextEntry ? false : this.props.secureTextEntry
            }
            style={[
              styles.textInputStyle,
              { borderWidth: 0 },
              this.props.inputHeight
                ? { height: this.props.inputHeight }
                : null,
              this.props.textStyle,
            ]}
            placeholderTextColor={
              this.props.placeholderTextColor
                ? this.props.placeholderTextColor
                : colors.darkGrey
            }
            placeholder={this.props.floatingLabel ? "" : this.props.placeholder}
            onFocus={(e) => {
              if (this.state.curText === "") this.AnimatedTiming.start();
              if (this.props.onFocus) this.props.onFocus(e);
            }}
            onBlur={(e) => {
              if (this.state.curText === "") this.AnimatedBackTiming.start();
              if (this.props.onBlur) this.props.onBlur(e);
            }}
            onChangeText={(input) =>
              this.textChange(
                input.substring(0, 1) === "0" ? input : "0" + input
              )
            }
            keyboardType={"number-pad"}
          />
        ) : (
          <TextInput
            underlineColorAndroid="transparent"
            //@ts-expect-error
            ref={this.props.refText}
            {...this.props}
            secureTextEntry={
              this.state.overrideTextEntry ? false : this.props.secureTextEntry
            }
            value={this.state.curText}
            style={[
              styles.textInputStyle,
              { borderWidth: 0 },
              this.props.inputHeight
                ? { height: this.props.inputHeight }
                : null,
              this.props.textStyle,
            ]}
            placeholderTextColor={
              this.props.placeholderTextColor
                ? this.props.placeholderTextColor
                : colors.darkGrey
            }
            placeholder={this.props.floatingLabel ? "" : this.props.placeholder}
            onFocus={(e) => {
              if (this.state.curText === "") this.AnimatedTiming.start();
              if (this.props.onFocus) this.props.onFocus(e);
            }}
            onBlur={(e) => {
              if (this.state.curText === "") this.AnimatedBackTiming.start();
              if (this.props.onBlur) this.props.onBlur(e);
            }}
            onChangeText={(input) => this.textChange(input)}
          />
        )}
        {this.props.floatingLabel ? (
          <Animated.Text
            style={[styles.floatingLabel, { top: this.AnimatedValue }]}
          >
            {this.props.placeholder}
          </Animated.Text>
        ) : null}
        {this.props.secureTextEntry ? (
          <View style={{ position: "absolute", right: 0, top: 0 }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  overrideTextEntry: !this.state.overrideTextEntry,
                })
              }
              style={{
                width: 60,
                height: 60,
                paddingRight: 20,
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <FontAwesomeIcon
                icon={this.state.overrideTextEntry ? faEye : faEyeSlash}
                size={20}
                // @ts-ignore
                color={
                  this.props.placeholderTextColor
                    ? this.props.placeholderTextColor
                    : colors.darkGrey
                }
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}
export default FloTextBox;

const styles = StyleSheet.create({
  container: {
    borderColor: colors.warmGrey,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 24,
  },
  textInputStyle: {
    color: colors.darkGrey,
    lineHeight:
      Platform.OS === "ios" ? PerfectFontSize(20) : PerfectFontSize(16),
    fontSize: PerfectFontSize(16),
    fontFamily: "Poppins_500Medium",
    padding: paddings.textInputPadding,
  },
  floatingLabel: {
    marginLeft: paddings.textInputPadding,
    marginRight: paddings.textInputPadding,
    marginBottom: paddings.textInputPadding,
    top: 20,
    position: "absolute",
    color: colors.darkGrey,
    lineHeight: PerfectFontSize(18),
    fontSize: PerfectFontSize(16),
    fontFamily: "Poppins_500Medium",

    backgroundColor: "#fff",
  },
});

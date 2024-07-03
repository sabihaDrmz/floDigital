import React, { Component, ReactNode } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextProps,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PerfectFontSize } from "../helper/PerfectPixel";
import { colors } from "../theme/colors";

interface FloButtonProps extends TextProps {
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  renderTitle?: () => ReactNode;
  activeOpacity?: number;
  isLoading?: boolean;
  linearColos?: string[];
  activeColor?: string;
}

class FloButton extends Component<FloButtonProps> {
  buttonContent = () => {
    return (
      <>
        {this.props.isLoading && (
          <ActivityIndicator
            color={this.props.activeColor ? this.props.activeColor : "white"}
            size={"small"}
            style={{ marginRight: 20 }}
          />
        )}
        {this.props.title ? (
          <Text
            {...this.props}
            style={[styles.buttonTextStyle, this.props.style]}
          >
            {this.props.title}
          </Text>
        ) : this.props.renderTitle ? (
          this.props.renderTitle()
        ) : null}
      </>
    );
  };
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.isLoading}
        {...this.props}
        activeOpacity={
          this.props.activeOpacity ? this.props.activeOpacity : 0.7
        }
        style={[styles.container, this.props.containerStyle]}
      >
        {this.props.linearColos ? (
          <LinearGradient
            colors={this.props.linearColos}
            style={[
              { position: "absolute", width: "100%" },
              styles.container,
              this.props.containerStyle,
            ]}
          >
            {this.buttonContent()}
          </LinearGradient>
        ) : (
          this.buttonContent()
        )}
      </TouchableOpacity>
    );
  }
}
export default FloButton;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#ff8600",
    flexDirection: "row",
  },
  buttonTextStyle: {
    color: colors.white,
    fontFamily: "Poppins_600SemiBold",
    fontSize: PerfectFontSize(18),
  },
});

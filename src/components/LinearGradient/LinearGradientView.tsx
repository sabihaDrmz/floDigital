
// @ts-nocheck
import LinearGradient from "react-native-linear-gradient";
import { Dimensions } from "react-native";
import React from "react";


const LinearGradientView = ({ children, style, colors }) => {

    return (
      <LinearGradient
        style={[style]}
        colors={colors}
      >
          {children}
      </LinearGradient>
    )
}

export default LinearGradientView;

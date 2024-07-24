
// @ts-nocheck
import {Dimensions, Text} from "react-native";
import LinearGradient from "react-native-web-linear-gradient";
import React from "react";


const LinearGradientView = ({children, style, colors})=> {

    return(
      <LinearGradient
        style={[style]}
        colors={colors}
      >
        {children}
      </LinearGradient>
     )
}

export default LinearGradientView;

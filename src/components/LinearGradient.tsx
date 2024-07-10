import React from 'react';
import { LinearGradient as LinearGradientOriginal } from 'react-native-linear-gradient';
import { StyleSheet } from "react-native";


const LinearGradient =({ children, style, colors })=>{
  return (
      <LinearGradientOriginal
        style={[style]}
        colors={colors}
      >
        {children}
      </LinearGradientOriginal>
  );
}

export default LinearGradient;

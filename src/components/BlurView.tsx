import React from 'react';
import { BlurView as BlurVieww } from '@react-native-community/blur';
import { StyleSheet } from "react-native";


const BlurView =({ children, style })=>{
  return (
      <BlurVieww
        style={[StyleSheet.absoluteFill, style]}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      >
        {children}
      </BlurVieww>
  );
}

export default BlurView;

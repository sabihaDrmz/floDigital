import React from 'react';
import { BlurView as BlurVieww } from '@react-native-community/blur';
import { StyleSheet, View } from "react-native";


const BlurView =({ children, style })=>{
  return (
      <View
        style={[StyleSheet.absoluteFill, style]}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      >
        {children}
      </View>
  );
}

export default BlurView;

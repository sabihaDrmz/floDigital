// @ts-nocheck
import React from "react";
import { View } from "react-native";
interface CameraProps {
  onReadComplete: (value: string) => void;
  isShow: boolean;
  onHide: () => void;
}

const MainCamera: React.FC<CameraProps> = (props) => {

  return (
    <View>
    </View>
  );
};
export default MainCamera;


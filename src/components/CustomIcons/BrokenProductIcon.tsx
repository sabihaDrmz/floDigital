import React from "react";
import { Image } from "react-native";

export const BrokenProductIcon: React.FC<any> = (props) => {
  return (
    <Image
      source={require("../../assets/arizaicon.png")}
      style={{ width: 47, alignItems: "center", height: 46 }}
    />
  );
};

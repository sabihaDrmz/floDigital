import { FontAwesome } from "../../../components";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import React from "react";
import { View } from "react-native";

export const CloseIco = (props: any) => {
  return (
    <View
      style={{
        width: 72,
        height: 72,
        backgroundColor: "#d10d0d",
        borderRadius: 36,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -10,
      }}
    >
      <FontAwesomeIcon icon="close" size={60} color={"#fff"} />
    </View>
  );
};

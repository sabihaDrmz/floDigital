import React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";

const OmsClockIcon: React.FC<{ color?: string }> = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} {...props}>
      <G
        transform="translate(1 1)"
        fill="none"
        stroke={props.color || "#77838f"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={2}
      >
        <Circle cx={7} cy={7} r={7} />
        <Path d="M7 2.8V7l2.8 1.4" />
      </G>
    </Svg>
  );
};

export default OmsClockIcon;

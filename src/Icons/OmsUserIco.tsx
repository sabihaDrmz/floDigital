import React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";

const OmsUserIco: React.FC<{ color?: string }> = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={14} height={15} {...props}>
      <G data-name="Group 2766" fill="#f9f9f9">
        <G
          data-name="Ellipse 131"
          transform="translate(3)"
          stroke="#919191"
          strokeWidth={1.25}
        >
          <Circle cx={3.5} cy={3.5} r={3.5} stroke="none" />
          <Circle cx={3.5} cy={3.5} r={2.875} fill="none" />
        </G>
        <G data-name="Subtraction 1">
          <Path d="M7 8.625a6.354 6.354 0 0 1 4.508 1.867 6.354 6.354 0 0 1 1.837 3.883H.655a6.354 6.354 0 0 1 1.837-3.883A6.355 6.355 0 0 1 7 8.625Z" />
          <Path
            d="M7 9.25a5.713 5.713 0 0 0-4.066 1.684 5.732 5.732 0 0 0-1.548 2.816h11.228a5.732 5.732 0 0 0-1.548-2.816A5.732 5.732 0 0 0 7 9.25M7 8a6.977 6.977 0 0 1 4.95 2.05A6.977 6.977 0 0 1 14 15H0a6.977 6.977 0 0 1 2.05-4.95A6.977 6.977 0 0 1 7 8Z"
            fill="#919191"
          />
        </G>
      </G>
    </Svg>
  );
};

export default OmsUserIco;

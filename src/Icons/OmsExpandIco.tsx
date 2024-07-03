import React from "react";
import Svg, { Path } from "react-native-svg";

const OmsExpandIcon: React.FC<{ color?: string }> = (props) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={9.818}
      height={17}
      {...props}
    >
      <Path
        d="M.411 16.641C-.044 16.169-.051 1.373.055.928A1.214 1.214 0 0 1 2.146.412l7.3 7.25a1.185 1.185 0 0 1 .007 1.71l-7.331 7.277a1.211 1.211 0 0 1-1.715-.007Z"
        fill={props.color || "#dedede"}
        data-name="back_2 copy"
      />
    </Svg>
  );
};

export default OmsExpandIcon;

import React from "react";
import Svg, { Path } from "react-native-svg";

const AppCardColorizeSVG: React.FC<{ color: string }> = (props) => {
    return (
        <Svg width={10} height={53} {...props}>
            <Path
                data-name="AGT Siparis karti"
                d="M10 0v43A10 10 0 0 1 0 53V10A10 10 0 0 1 10 0Z"
                fill={props.color}
            />
        </Svg>
    );
};

export default AppCardColorizeSVG;
import React from "react";
import Svg, { Path } from "react-native-svg";

const DownIcon: React.FC<{ color?: string }> = (props) => {
    return (
        <Svg
            //@ts-ignore xmlns error
            xmlns="http://www.w3.org/2000/svg"
            width={17}
            height={9.795}
            {...props}
        >
            <Path
                d="M.359.388a1.217 1.217 0 0 1 1.7.008c5.246 4.615 7.59 4.615 12.813.041a1.2 1.2 0 0 1 2.1.5 1.213 1.213 0 0 1-.38 1.189l-7.25 7.3a1.185 1.185 0 0 1-1.71.007L.355 2.102A1.211 1.211 0 0 1 .362.387Z"
                data-name="back_2 copy"
                opacity={0.422}
                fill={props.color || "#fff"}
            />
        </Svg>
    );
};
export default DownIcon;
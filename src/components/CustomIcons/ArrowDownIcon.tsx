import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ArrowDownIcon: React.FC = (props) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={17}
            height={15.528}
            {...props}
        >
            <Path
                d="M.359 6.121a1.217 1.217 0 011.7.008l5.213 5.256.003-10.236a1.207 1.207 0 012.412.026L9.68 11.387l5.188-5.217a1.2 1.2 0 012.1.5 1.213 1.213 0 01-.38 1.189l-7.25 7.3a1.185 1.185 0 01-1.71.007L.351 7.835A1.211 1.211 0 01.358 6.12z"
                data-name="back_2 copy"
                fill="#959595"
            />
        </Svg>
    )
}

export default ArrowDownIcon

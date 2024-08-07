import * as React from 'react';
import Svg, { Defs, G, Path } from 'react-native-svg';

/* SVGR has dropped some elements not supported by react-native-svg: style */

const AttachmentIcon: React.FC<any> = (props) => {
  return (
    <Svg
      id="linkicon"
      xmlns="http://www.w3.org/2000/svg"
      width={30.295}
      fill={'#959595'}
      height={30.49}
      {...props}
    >
      <Defs></Defs>
      <G id="Group_2749" data-name="Group 2749">
        <Path
          id="Path_1837"
          data-name="Path 1837"
          d="M229.1 490.217a5.116 5.116 0 00-3.239-4.359 5.228 5.228 0 00-5.864.826c-.883.748-1.659 1.62-2.49 2.429-.746.727-1.532.767-2.135.123a1.43 1.43 0 01.207-2.1 37.384 37.384 0 012.93-2.823 8.29 8.29 0 0113.246 5.2 8.2 8.2 0 01-2.325 7.325 201.666 201.666 0 01-4.075 4.094 8.279 8.279 0 01-12.3-.653 1.5 1.5 0 01-.295-1.773 1.291 1.291 0 011.434-.67 1.431 1.431 0 01.911.575 5.524 5.524 0 008.6.271c1.254-1.26 2.513-2.514 3.759-3.781a5.947 5.947 0 001.636-4.684z"
          transform="translate(-201.582 -482.569)"
        />
        <Path
          id="Path_1838"
          data-name="Path 1838"
          d="M200.265 508.2a5.337 5.337 0 003.224 5.065 5.221 5.221 0 005.869-.79c.94-.791 1.749-1.739 2.649-2.582a1.354 1.354 0 012.278.493 1.3 1.3 0 01-.322 1.435 36.061 36.061 0 01-2.8 2.747 7.862 7.862 0 01-9.09 1.078 7.987 7.987 0 01-4.55-8.066 7.818 7.818 0 012.308-5.16 204.39 204.39 0 014.285-4.3 8.289 8.289 0 0112.236.773 1.469 1.469 0 01-.034 2.12 1.439 1.439 0 01-2.072-.323 5.529 5.529 0 00-8.546-.257c-1.254 1.259-2.511 2.515-3.759 3.78a5.475 5.475 0 00-1.676 3.987z"
          transform="translate(-197.512 -486.137)"
        />
      </G>
    </Svg>
  )
}

export default AttachmentIcon;

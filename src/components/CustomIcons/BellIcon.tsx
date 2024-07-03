import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

/* SVGR has dropped some elements not supported by react-native-svg: style */

const BellIcon: React.FC<any> = (props) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={33.853}
      height={33.921}
      {...props}>
      <Path
        fill={props.fill || '#fff'}
        d="M6.368 18.2h1.873a1.687 1.687 0 103.371 0h1.873a3.562 3.562 0 11-7.117 0zm13.485-2.741v.393a1.723 1.723 0 01-1.686 1.761H1.686A1.724 1.724 0 010 15.852v-.393a2.909 2.909 0 012.248-2.876V8.022a7.687 7.687 0 1115.358 0v4.561a2.906 2.906 0 012.247 2.879zm-1.873 0a.958.958 0 00-.94-.978 1.34 1.34 0 01-1.307-1.367V8.022a5.812 5.812 0 10-11.612 0v5.092a1.34 1.34 0 01-1.308 1.367.96.96 0 00-.94.978v.2H17.98z"
      />
    </Svg>
  );
};

export default BellIcon;

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const SvgComponent: React.FC<SvgProps> = (props: SvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        data-name="Path 2201"
        d="M54.667.003h53.807c.966 0 .882-.067.883.9v9.929c0 .651-.033.66-.671.592s-1.256-.1-1.885-.127c-1.212-.044-2.424-.1-3.636-.1q-31.915-.009-63.831.013a30.689 30.689 0 00-6.49.488 12.285 12.285 0 00-9.24 8.045 24.484 24.484 0 00-1.545 7.18c-.231 3.022-.085 6.049-.1 9.073-.029 5 0 9.992-.013 14.988a23.632 23.632 0 01-.91 6.861 22.125 22.125 0 01-10.864 13.414 21.117 21.117 0 01-9.431 2.624c-.736.03-.738.01-.738-.714V.733c0-.738 0-.739.765-.739z"
        fill="#ff8600"
      />
    </Svg>
  )
}

export default SvgComponent

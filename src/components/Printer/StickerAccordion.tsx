import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { PrinterConfigProp } from "../../contexts/model/PrinterConfigGroupModel";

interface StickerAccordionProps {
  title: string;
  icon?: React.ReactNode;
  items: PrinterConfigProp[];
  renderItem: (x: PrinterConfigProp, index: number) => void;
}

const DEFAULT_HEIGHT = 50;
const PADDINT_DEFAULT = 20;
const HEIGHT_OF_HEAD = 70;
const StickerAccordion: React.FC<StickerAccordionProps> = (props) => {
  const [hasOpen, setHasOpen] = useState(false);

  const hasOpensv = useSharedValue(DEFAULT_HEIGHT);
  const icoRotation = useSharedValue(180);
  const handleOpen = () => {
    hasOpensv.value = withTiming(
      !hasOpen ? 50 * props.items.length + HEIGHT_OF_HEAD : DEFAULT_HEIGHT
    );
    icoRotation.value = withTiming(!hasOpen ? 0 : 180);
    setHasOpen(!hasOpen);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: hasOpensv.value,
      overflow: "hidden",
    };
  });

  const animatedRoute = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${icoRotation.value}deg`,
        },
      ],
    };
  });
  return (
    //@ts-ignore
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={handleOpen} style={styles.headerContainer}>
        {props.icon}
        <AppText selectable style={styles.title}>
          {props.title}
        </AppText>
        <Animated.View style={animatedRoute}>
          <FontAwesomeIcon icon={"chevron-thin-up"} size={20} />
        </Animated.View>
      </TouchableOpacity>
      {props.items.map(props.renderItem)}
    </Animated.View>
  );
};
export default StickerAccordion;

const styles = StyleSheet.create({
  container: {
    overflow: "scroll",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  title: {
    fontSize: 18,
    color: AppColor.FD.Text.Dark,
    fontFamily: "Poppins_500Medium",
    marginLeft: 10,
    marginVertical: 10,
    flex: 1,
  },
});

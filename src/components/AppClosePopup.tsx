import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Portal } from "react-native-portalize";

interface AppClosePopupProps {
  onClose?: () => void;
  autoClose?: boolean;
}

const AppClosePopup: React.FC<AppClosePopupProps> = (props) => (
  <Portal>
    <TouchableWithoutFeedback
      onPress={
        props.autoClose !== undefined || props.autoClose
          ? props.onClose
          : undefined
      }
    >
      <View style={styles.container}>
        <View style={styles.transparency}>
          <TouchableWithoutFeedback>
            <View style={styles.bg}>{props.children}</View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Portal>
);
export default AppClosePopup;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width,
    height,
    backgroundColor: "rgba(0,0,0,.5)",
  },
  transparency: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bg: {
    backgroundColor: "white",
    width: width - 40,
    minHeight: 100,
    borderRadius: 10,
  },
});

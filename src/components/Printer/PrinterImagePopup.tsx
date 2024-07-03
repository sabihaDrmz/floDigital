import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

const PrinterImagePopup: React.FC<{ image?: any; onClose?: () => void }> = (
  props
) => (
  <View style={styles.container}>
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={props.onClose}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          backgroundColor: "#fff",
          padding: 5,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          right: 9,
          top: -24,
          width: 25,
          height: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>X</Text>
      </TouchableOpacity>
      <View
        style={{
          height: 200,
          backgroundColor: "#fff",
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.image && (
          <Image
            style={{ width: 200, height: 150, resizeMode: "contain", flex: 1 }}
            source={props.image}
            resizeMethod={"scale"}
          />
        )}
      </View>
    </View>
  </View>
);
export default PrinterImagePopup;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.3)",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    width: Dimensions.get("window").width - 70,
  },
});

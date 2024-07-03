import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import Svg, { Defs, G, Rect, Path } from "react-native-svg";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";

const ErSuccess: React.FC = (props) => {
  const { options, message, hide } = useMessageBoxService();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <Ico />
        </View>
        <AppText
          style={[styles.description, { fontSize: 14, marginVertical: 10 }]}
        >
          {message}
        </AppText>
        <View
          style={{
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <AppButton
            title={
              options?.yesButtonTitle && options?.yesButtonTitle !== ""
                ? options?.yesButtonTitle
                : translate("messageBox.ok")
            }
            style={{
              width: Dimensions.get("window").width - 150,
              marginBottom: 10,
              height: 60,
              maxWidth: 350,
            }}
            onPress={() => {
              options && options.yesButtonEvent
                ? options.yesButtonEvent()
                : undefined;
              hide();
            }}
            buttonColorType={
              options && options.yesButtonColorType
                ? options.yesButtonColorType
                : ColorType.Brand
            }
          />
        </View>
      </View>
    </View>
  );
};
export default ErSuccess;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    flex: 1,
    padding: 20,
    ...Platform.select({
      android: {
        backgroundColor: "rgba(0,0,0,0.5)",
      }
    })
  },
  card: {
    width: Dimensions.get("window").width - 40,
    backgroundColor: "#fff",
    padding: 16,
    maxWidth: 400,
    borderRadius: 10,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.3,
  },
  description: {
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.3,
    fontSize: PerfectFontSize(15),
    marginTop: 9,
    textAlign: "center",
  },
});

const Ico = () => {
  return (
    <Svg width={90} height={92}>
      <Defs></Defs>
      <G data-name="Group 3177">
        <G
          style={{
            filter: "url(#a)",
          }}
        >
          <Rect
            data-name="Rectangle 421"
            width={72}
            height={74}
            rx={36}
            transform="translate(9 6)"
            style={{
              fill: "#119d47",
            }}
          />
        </G>
        <Path
          data-name="Path 2191"
          d="m4374.751 13614.445 15.362 16.242 27.753-31.719"
          transform="translate(-4351.429 -13571.618)"
          style={{
            fill: "none",
            stroke: "#fff",
            strokeWidth: 7,
          }}
        />
      </G>
    </Svg>
  );
};

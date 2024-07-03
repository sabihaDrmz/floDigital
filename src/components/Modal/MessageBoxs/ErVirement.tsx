import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import Svg, { Circle, Defs, G, Path } from "react-native-svg";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";

const ErVirement: React.FC = (props) => {
  const { message, options, hide } = useMessageBoxService();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
            marginTop: 30,
          }}
        >
          <Ico />
        </View>
        <AppText
          style={[
            {
              textAlign: "center",
              fontFamily: "Poppins_300Light_Italic",
              marginTop: 30,
            },
          ]}
        >
          {message}
        </AppText>
        <AppText
          style={{
            ...styles.description,
            fontSize: 14,
            marginVertical: 10,
            marginTop: 20,
          }}
        >
          {options?.customParameters?.description}
        </AppText>
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <AppButton
            title={
              options?.yesButtonTitle && options?.yesButtonTitle !== ""
                ? options?.yesButtonTitle
                : translate("messageBox.ok")
            }
            style={{
              width: Dimensions.get("window").width - 120,
              marginBottom: 10,
              height: 60,
              maxWidth: 350,
            }}
            buttonColorType={
              options && options.yesButtonColorType
                ? options.yesButtonColorType
                : ColorType.Brand
            }
            onPress={() => {
              hide();
            }}
          />
        </View>
      </View>
    </View>
  );
};
export default ErVirement;

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

const Ico = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={72} height={72} {...props}>
      <Defs></Defs>
      <G data-name="Group 4462">
        <G
          data-name="Ellipse 262"
          style={{
            stroke: "#ff8600",
            fill: "none",
          }}
        >
          <Circle
            cx={36}
            cy={36}
            r={36}
            style={{
              stroke: "none",
            }}
            stroke="none"
          />
          <Circle
            cx={36}
            cy={36}
            r={35.5}
            style={{
              fill: "none",
            }}
          />
        </G>
        <Path
          data-name="Subtraction 5"
          d="M19.563 26.871a.588.588 0 0 1-.081-.008.543.543 0 0 0-.074-.007h-7.514c-3.642 0-6.844 0-9.788-.005a2.116 2.116 0 0 1-2.1-2.174V2.31H0V1.043h.008V0h36.736v9.072c0 .039 0 .076-.008.128 0 .027 0 .056-.008.09A12.081 12.081 0 0 0 30 7.207a12.264 12.264 0 0 0-9.021 4.011 13.073 13.073 0 0 0-3.194 7.254 12.924 12.924 0 0 0 1.925 8.313.152.152 0 0 1-.147.086zM6.325 21.236H4.941c-.546 0-.846.252-.845.7s.311.7.849.7h6.46a.953.953 0 0 0 .627-.187.645.645 0 0 0 .218-.521c0-.449-.3-.7-.849-.7H6.325zm1.6-3.511H4.894a.712.712 0 0 0-.708 1.049.774.774 0 0 0 .687.348c.552.006 1.139.009 1.848.009h1.97a.9.9 0 0 0 .666-.233.656.656 0 0 0 .168-.481c-.008-.443-.312-.688-.856-.692h-.744z"
          transform="translate(16.775 29.359)"
          style={{
            stroke: "transparent",
            strokeMiterlimit: 10,
            fill: "#ff8600",
          }}
        />
        <Path
          data-name="Rectangle 87"
          transform="translate(13.853 20)"
          style={{
            fill: "#ff8600",
          }}
          d="M0 0h43v9H0z"
        />
        <G
          style={{
            filter: "url(#a)",
          }}
        >
          <Path
            data-name="Path 1935"
            d="M1070.942 489.108a10.892 10.892 0 1 1-11.04-11.25 11.082 11.082 0 0 1 11.04 11.25z"
            transform="translate(-1012.787 -439.82)"
            style={{
              fill: "#a3a3a5",
            }}
          />
        </G>
        <Path
          data-name="Path 1936"
          d="M207.667 243.644c0 .608.016 1.159-.006 1.708-.012.29.089.354.351.353 2.27-.009 4.539 0 6.809-.011.293 0 .36.091.356.375a95.766 95.766 0 0 0 0 3.079c.005.308-.1.37-.373.369-2.242-.008-4.483-.005-6.725 0-.411 0-.411 0-.411.429v1.365c0 .066.013.148-.06.179s-.119-.038-.167-.081q-2.025-1.812-4.051-3.622c-.139-.123-.154-.192-.006-.325q2.063-1.844 4.116-3.7a1.936 1.936 0 0 1 .167-.118z"
          transform="translate(-161.965 -198.296)"
          style={{
            fill: "#fff",
          }}
        />
      </G>
    </Svg>
  );
};

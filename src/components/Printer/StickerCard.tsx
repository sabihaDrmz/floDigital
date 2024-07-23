import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { PrinterConfigProp } from "../../contexts/model/PrinterConfigGroupModel";
import { PerfectFontSize } from "../../helper/PerfectPixel";

const StickerCard: React.FC<{
  sticker: PrinterConfigProp;
  selectedTag: number;
  onSelect: () => void;
  onImageClick?: () => void;
}> = (props) => {
  return (
    <TouchableOpacity
      disabled={props.selectedTag === props.sticker.id}
      style={styles.container}
      onPress={() => {
        props.onSelect();
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#dedede",
            padding: 4,
          }}
        >
          {props.selectedTag === props.sticker.id && (
            <View
              style={{
                flex: 1,
                backgroundColor: "#FF8600",
                borderRadius: 16,
              }}
            ></View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 21,
          }}
        >
          <Text
            style={[
              styles.title,
              props.selectedTag === props.sticker.id && styles.titleSelected,
            ]}
          >
            {props.sticker.title
              .replace("Tek", "")
              .replace("Çift", "")
              .replace("Cift", "")}
          </Text>
          {props.sticker.title.includes("Tek") && (
            <Text
              style={[
                styles.oneTwo,
                props.selectedTag === props.sticker.id && styles.oneTwoSelected,
              ]}
            >
              Tek
            </Text>
          )}
          {props.sticker.title.includes("Çift") && (
            <Text
              style={[
                styles.oneTwo,
                props.selectedTag === props.sticker.id && styles.oneTwoSelected,
              ]}
            >
              Çift
            </Text>
          )}
          {props.sticker.title.includes("Cift") && (
            <Text
              style={[
                styles.oneTwo,
                props.selectedTag === props.sticker.id && styles.oneTwoSelected,
              ]}
            >
              Çift
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={props.onImageClick}>
        <View style={{ alignItems: "flex-end" }}>
          <Image
            source={{
              uri: props.sticker.image,
            }}
            style={{ width: 25, height: 25, resizeMode: "cover" }}
            defaultSource={require("../../assets/imgicon.png")}
            // loadingIndicatorSource={require('../../../assets/imgicon.png')}
          />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export default StickerCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 40,
    height: 50,
  },
  oneTwo: {
    fontFamily: "Poppins_200ExtraLight_Italic",
    fontSize: PerfectFontSize(15),
    color: "rgb(125,126,129)",
  },
  oneTwoSelected: {
    fontFamily: "Poppins_300Light_Italic",
    fontSize: PerfectFontSize(15),
    color: "rgb(125,126,129)",
  },
  title: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(16),
    color: "rgb(125,126,129)",
  },
  titleSelected: {
    fontFamily: "Poppins_500Medium",
  },
});

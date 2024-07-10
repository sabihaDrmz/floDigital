import {
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
//TODO: EXPO expo-camera
// import { CameraCapturedPicture } from "expo-camera";
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Portal } from "react-native-portalize";
import { AntDesign } from "@expo/vector-icons";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { useMediaSelector } from "./MediaSelector";

interface ImagePreviewProps  {
  onCancel: () => void;
}

const { width, height } = Dimensions.get("window");
const ImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { onAssetSelect } = useMediaSelector();
  return (
    <Portal>
      <View style={{ backgroundColor: "black", width, height }}>
        <Image style={{ width, height }} source={{ uri: props.uri }} />
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            position: "absolute",
            right: 30,
            top: 50,
          }}
          onPress={props.onCancel}
          hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
        >
          <AntDesign name="close" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
           onAssetSelect({
            Url: props.uri,
            MediaType: "picture",
            Height: props.height,
            Width: props.width
          });
          }}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            width: width,
            height: 70,
            ...ifIphoneX(
              {
                bottom: 75,
              },
              { bottom: 35 }
            ),
          }}
        >
          <AntDesign name="pluscircleo" size={70} color="white" />
        </TouchableOpacity>
        <View
          style={{
            ...ifIphoneX(
              {
                height: 60,
              },
              { height: 26 }
            ),
            padding: 4,
            backgroundColor: AppColor.FD.Brand.Solid,
            position: "absolute",
            width,
            bottom: 0,
          }}
        >
          <AppText
            style={{
              textAlign: "center",
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
            }}
            labelColorType={ColorType.Light}
          >
            Görüntüyü kaydet
          </AppText>
        </View>
      </View>
    </Portal>
  );
};
export default ImagePreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

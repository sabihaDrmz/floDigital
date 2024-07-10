import { ColorType } from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  Image,
} from "react-native";
//TODO: EXPO exImp
// import * as exImp from "expo-image-picker";
//TODO: EXPO expo-image-picker
// import { ImageInfo, ImagePickerAsset, } from "expo-image-picker/build/ImagePicker.types";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";

const CARD_WIDH = 80;
const CARD_HEIGHT = 114;
/*
const imagePickerSettings: exImp.ImagePickerOptions = {
  mediaTypes: exImp.MediaTypeOptions.All,
  allowsEditing: false,
  aspect: [18, 9],
  quality: 0.3,
};

 */
const FloMediaButton: React.FC<FloMediaButtonProps> = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...props}
      style={[styles.mediaButton, props.style]}
    ></TouchableOpacity>
  );
};
const FloMediaSelector: React.FC = (props) => {
  const [images, setImages] = useState<any>([]);
  const MessageBox = useMessageBoxService();
  const questionMediaLibrary = () => {
    MessageBox.show("Medya nereden kullanılsın", {
      type: MessageBoxType.YesNo,
      yesButtonTitle: "Galeriden Seç",
      noButtonTitle: "Kamera Kullan",
      noButtonColorType: ColorType.Brand,
      yesButtonColorType: ColorType.Brand,
      yesButtonEvent: async () => {
        /*
        let permission = await exImp.getMediaLibraryPermissionsAsync();
        if (!permission.granted && permission.canAskAgain) {
          permission = await exImp.requestMediaLibraryPermissionsAsync();
        }

         */

        if (permission.granted)
         /* exImp
            .launchImageLibraryAsync(imagePickerSettings)
            .then((selectedItem) => {
              if (selectedItem.canceled) return;

              let image: ImagePickerAsset = {
                ...selectedItem.assets[0],
              };

              setImages([...images, image]);
            });

          */
        else {
          MessageBox.show("Dosya sistemine erişim yetkisi bulunmuyor");
        }
      },
      noButtonEvent: async () => {
       /* let permission = await exImp.getCameraPermissionsAsync();
        if (!permission.granted && permission.canAskAgain) {
          permission = await exImp.requestCameraPermissionsAsync();
        }

        if (permission.granted)
          exImp.launchCameraAsync(imagePickerSettings).then((selectedItem) => {
            if (selectedItem.canceled) return;

            let image: ImagePickerAsset = {
              ...selectedItem.assets[0],
            };

            setImages([...images, image]);
          });


        else {
          MessageBox.show("Kamera Yetkiniz Bulunmuyor");
        }

        */
      },
    });
  };

  const removeImage = (image: any) => {
    setImages(images.filter((x) => x !== image));
  };

  return (
    <View style={styles.container}>
      <FloMediaButton onPress={questionMediaLibrary}>
        <Image
          source={require("../../../assets/cameraicon.png")}
          style={{ width: 41, height: 41 }}
        />
      </FloMediaButton>
      {images.map((image) => {
        return (
          <FloMediaButton
            key={`img_${image.uri.substring(20)}`}
            onPress={() => removeImage(image)}
          >
            <Image
              source={{ uri: image.uri }}
              style={{
                position: "absolute",
                width: CARD_WIDH - 2,
                height: CARD_HEIGHT - 2,
                borderRadius: 8,
              }}
              blurRadius={1}
            />
            <Image
              source={require("../../../assets/closeicon.png")}
              style={{ width: 41, height: 41 }}
            />
          </FloMediaButton>
        );
      })}
    </View>
  );
};
export default FloMediaSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mediaButton: {
    width: CARD_WIDH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    borderColor: "rgb(206,202,202)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
  },
});

interface FloMediaButtonProps extends TouchableOpacityProps {}

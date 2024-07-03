import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";

interface EasyReturnTakeCameraProps {
  onSavePicture: (picture: CameraCapturedPicture) => void;
}

const TAKE_BUTTON_SIZE = 70;
const { width, height } = Dimensions.get("window");
const EasyReturnTakeCamera = (props: EasyReturnTakeCameraProps) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const camera = useRef<Camera>(null);

  const takePicture = () => {
    camera.current?.takePictureAsync().then((res) => {
      setPicture(res);
    });
  };

  useEffect(() => {
    Camera.requestPermissionsAsync().then((status) => {
      // @ts-expect-error
      setHasPermission(status.status === "granted");
    });
  }, []);

  if (hasPermission === null)
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  if (hasPermission === false)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Kamera erişimi yok</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {picture ? (
        <View
          style={{ flex: 1, justifyContent: "center", backgroundColor: "#000" }}
        >
          <Image
            source={{ uri: picture.uri }}
            style={[
              {
                resizeMode: "contain",
                width,
                height,
              },
            ]}
          />
          <TouchableOpacity
            onPress={() => props.onSavePicture(picture)}
            style={{
              position: "absolute",
              width: TAKE_BUTTON_SIZE - 15,
              height: TAKE_BUTTON_SIZE - 15,
              backgroundColor: "rgba(255,255,255,0.6)",
              borderRadius: TAKE_BUTTON_SIZE / 2,
              bottom: 70,
              right: TAKE_BUTTON_SIZE / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name={"right"} size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPicture(undefined)}
            style={{
              position: "absolute",
              width: TAKE_BUTTON_SIZE - 15,
              height: TAKE_BUTTON_SIZE - 15,
              backgroundColor: "rgba(255,255,255,0.6)",
              borderRadius: TAKE_BUTTON_SIZE / 2,
              bottom: 70,
              left: TAKE_BUTTON_SIZE / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name={"close"} size={30} />
          </TouchableOpacity>
        </View>
      ) : (
        <Camera style={StyleSheet.absoluteFill} type={type} ref={camera}>
          <TouchableOpacity
            onPress={takePicture}
            style={{
              position: "absolute",
              width: TAKE_BUTTON_SIZE,
              height: TAKE_BUTTON_SIZE,
              backgroundColor: "rgba(255,255,255,0.6)",
              borderRadius: TAKE_BUTTON_SIZE / 2,
              bottom: 70,
              left: (width - TAKE_BUTTON_SIZE) / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name={"camera"} size={37} />
          </TouchableOpacity>
        </Camera>
      )}
    </View>
  );
};

export default EasyReturnTakeCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { Observer } from "mobx-react-lite";
import React from "react";
import { Animated, Dimensions, TouchableOpacity, View } from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { Portal } from "react-native-portalize";
import { AntDesign } from "@expo/vector-icons";
import { PerfectPixelSize } from "../helper/PerfectPixel";
import { useApplicationGlobalService } from "../contexts/ApplicationGlobalService";

const { width, height } = Dimensions.get("window");
const FullScreenImage: React.FC = (props) => {
  const scale = new Animated.Value(1);
  const ApplicationGlobalService = useApplicationGlobalService();
  const onZoomEvent = Animated.event(
    [
      {
        nativeEvent: { scale: scale },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  const onZoomStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <React.Fragment>
      {ApplicationGlobalService.isShowFullScreenImage && (
        <Portal>
          <View
            style={{
              width,
              height,
              backgroundColor: "#fff",
              position: "absolute",
            }}
          >
            <PinchGestureHandler
              onGestureEvent={onZoomEvent}
              onHandlerStateChange={onZoomStateChange}
            >
              <Animated.Image
                source={{
                  uri: ApplicationGlobalService.fullScreenImageUri,
                }}
                style={{
                  width: width,
                  height: height,
                  transform: [{ scale: scale }],
                }}
                resizeMode="contain"
              />
            </PinchGestureHandler>
            <View
              style={{
                position: "absolute",
                top: PerfectPixelSize(50),
                right: 30,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  ApplicationGlobalService.hideFullScreenImage();
                }}
                style={{ backgroundColor: "#ffffff", borderRadius: 10 }}
              >
                <AntDesign name={"close"} size={40} />
              </TouchableOpacity>
            </View>
          </View>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default FullScreenImage;

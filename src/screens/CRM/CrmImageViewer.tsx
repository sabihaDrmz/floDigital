import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { PerfectPixelSize } from "../../helper/PerfectPixel";

const { width, height } = Dimensions.get("window");
const CrmImageViewer: React.FC<{
  imageUrls: string[];
  onCloseImageModal?: () => void;
}> = (props) => {
  const scale = new Animated.Value(1);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let page = Math.floor(event.nativeEvent.contentOffset.x / width) + 1;

    setCurrentPage(page);
  };
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: "#fff",
        position: "absolute",
      }}
    >
      <ScrollView
        onScroll={handleScroll}
        pagingEnabled
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {props.imageUrls.map((image, index) => (
          <PinchGestureHandler
            key={"pc" + index}
            onGestureEvent={onZoomEvent}
            onHandlerStateChange={onZoomStateChange}
          >
            <Animated.Image
              source={{
                uri: `data:image/png;base64,${image}`,
              }}
              style={{
                width: width,
                height: height,
                ...(index === currentPage - 1 && {
                  transform: [{ scale: scale }],
                }),
              }}
              resizeMode="contain"
            />
          </PinchGestureHandler>
        ))}
      </ScrollView>
      <View
        style={{ position: "absolute", top: PerfectPixelSize(50), right: 30 }}
      >
        <TouchableOpacity
          onPress={() => {
            if (props.onCloseImageModal) props.onCloseImageModal();
          }}
        >
          <AntDesign name={"close"} size={40} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 80,
          width,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.imageUrls.map((image, index) => {
          return (
            <View
              key={"pv" + index}
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                borderColor: "#afafaf",
                borderWidth: 1,
                marginRight: 10,
                backgroundColor: currentPage === index + 1 ? "red" : "white",
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

export default CrmImageViewer;

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  PinchGestureHandler,
  ScrollView,
  State,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { AntDesign } from "../../../components";
import { PerfectPixelSize } from "../../../helper/PerfectPixel";

const IsoImageSlider: React.FC<{
  product: {
    barcode: string;
    site: string;
    store: string;
    storeName: string;
    county: string;
    city: string;
    name: string;
    brand: string;
    color: string;
    size: string;
    price: number;
    oldPrice: number;
    sku: string;
    parentSku: string;
    qty: number;
    gender: string;
    model: string;
    saya: string;
    currency: string;
    type: string;
    images: [string];
  };
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
    <View style={styles.container}>
      <ScrollView
        onScroll={handleScroll}
        pagingEnabled
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {props.product.images.map((image, index) => {
          return (
            <PinchGestureHandler
              key={"pc" + index}
              onGestureEvent={onZoomEvent}
              onHandlerStateChange={onZoomStateChange}
            >
              <Animated.Image
                source={{
                  uri: `https://floimages.mncdn.com/${image}`,
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
          );
        })}
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
          left: width / 2 - 50,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.product.images.map((image, index) => {
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
export default IsoImageSlider;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width,
    height,
    backgroundColor: "#fff",
  },
});

import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Portal } from "react-native-portalize";
import { Easing } from "react-native-reanimated";
 
export interface BottomSheetProps {
  show: boolean;
  onDissmiss: () => void;
  enableBackDropDismiss:boolean;
  children?: any;
}

const BottomSheet = (props: BottomSheetProps) => {
  const bottomSheetHeight = Dimensions.get("window").height * 0.5;
  const deviceWidth = Dimensions.get("window").width;
  const [open, setopen] = useState<boolean>(props.show)
  const bottom = useRef( new Animated.Value(-bottomSheetHeight)).current;
  
  const onGesture = (event: any) => {
    if(event.nativeEvent.translationY > 0) {
        bottom.setValue(-event.nativeEvent.translationY )
    }
  }
  const onGestureEnd = (event: any) => {
    if(event.nativeEvent.translationY > (bottomSheetHeight / 4)){
        props.onDissmiss();
    } else {
        bottom.setValue(0)
    }
  }
  
  useEffect(() => {
    if(props.show){
        setopen(props.show)
        Animated.timing(bottom,{
            toValue: 0,
            duration: 500,
            useNativeDriver:false,
            easing: Easing.cubic
        },).start();
    }
    else{
        Animated.timing(bottom,{
            toValue: -bottomSheetHeight,
            duration: 500,
            useNativeDriver:false,
            easing: Easing.cubic
        }).start(() =>{
            setopen(false);
        });
    }
  }, [props.show])
  
  if(!open) {
    return null
  }

  return (
    <Portal>
      <>
      <Pressable style={styles.backDrop} onPress={props.enableBackDropDismiss ? props.onDissmiss : undefined}></Pressable>
      <Animated.View
        style={[
          styles.root,
          {
            height: bottomSheetHeight,
            bottom: bottom,
            shadowOffset: {
              height: -3,
              width: 0,
            },
          },
          styles.common,
        ]}
      >
        <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
        <View
          style={[
            styles.header,
          ]}
        >
          <View
            style={{
              width: 40,
              height:4,
              position: "absolute",
              top: 12,
              left: (deviceWidth - 60) / 2,
              zIndex: 10,
              borderRadius: 4,
              backgroundColor: "#ccc",
            }}
          ></View>
        </View>
        </PanGestureHandler>
        {props.children}
      </Animated.View>
      </>
    </Portal>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  header: {
    height: 20,
    backgroundColor: "#ffff",
  },
  common: {
    shadowColor: "#000",
    shadowOffset: {
        height:0,
      width: 0,
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 3,
  },
  closeIcon: {
    position: "absolute",
    right: 0,
    top: -5,
    zIndex: 10,
  },
  backDrop:{
    ...StyleSheet.absoluteFillObject,
    zIndex:80,
    backgroundColor:"rgba(0,0,0, 0.012)"
  }
});

export default BottomSheet;

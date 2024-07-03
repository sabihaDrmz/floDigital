import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

interface FloZoomImageProps {
  imageSource: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

const screen = Dimensions.get('window');
class FloZoomImage extends Component<FloZoomImageProps> {
  scale = new Animated.Value(1);

  onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {scale: this.scale},
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this.scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  render() {
    return (
      <View style={this.props.style}>
        <PinchGestureHandler
          enabled
          onGestureEvent={this.onPinchEvent}
          onHandlerStateChange={this.onPinchStateChange}>
          <Animated.Image
            source={this.props.imageSource}
            style={{
              width: screen.width,
              height: 300,
              transform: [{scale: this.scale}],
            }}
            resizeMode="contain"
          />
        </PinchGestureHandler>
      </View>
    );
  }
}
export default FloZoomImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {colors} from '../../theme/colors';

interface FloSlidingModalProps {
  isVisible: boolean;
  onClosing?: () => void;
  onClosingCancel?: () => void;
}
class FloSlidingModal extends Component<FloSlidingModalProps> {
  render() {
    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.props.isVisible}
          style={{margin: 0, marginTop: 80}}
          swipeDirection={'down'}
          onSwipeCancel={this.props.onClosingCancel}
          onSwipeComplete={this.props.onClosing}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <View
                style={{
                  backgroundColor: colors.warm_grey_three,
                  height: 8,
                  borderRadius: 4,
                  width: 70,
                }}></View>
            </View>
            {this.props.children}
          </View>
        </Modal>
      </View>
    );
  }
}
export default FloSlidingModal;

const styles = StyleSheet.create({
  container: {},
});

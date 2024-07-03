import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  ModalProps,
} from "react-native";
import { FloButton, FloTextBox } from "..";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";

const wWidth = Dimensions.get("window").width;

interface FloSmsValidationModalProps extends ModalProps {
  onClosing?: () => void;
  onSubmit?: (submitCode: string) => void;
}
class FloSmsValidationModal extends Component<FloSmsValidationModalProps> {
  state = { code: "" };
  render() {
    return (
      <Modal animationType={"slide"} transparent {...this.props}>
        <View style={styles.container}>
          <View
            style={{
              backgroundColor: colors.white,
              width: wWidth - 40,
              padding: 20,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: PerfectFontSize(16),
                lineHeight: PerfectFontSize(19),
                color: colors.darkGrey,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              {translate("floSmsValidationModal.information")}
            </Text>
            <FloTextBox
              placeholder={translate("floSmsValidationModal.validationCode")}
              floatingLabel
              keyboardType={"number-pad"}
              maxLength={10}
              onChangeText={(input) => this.setState({ code: input })}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <FloButton
                onPress={this.props.onClosing}
                title={translate("floSmsValidationModal.cancel")}
                containerStyle={{
                  width: Dimensions.get("window").width / 2 - 50,
                  backgroundColor: colors.white,
                  borderColor: colors.black,
                  borderWidth: 1,
                }}
                style={{ color: colors.black }}
              />
              <FloButton
                onPress={() =>
                  this.props.onSubmit
                    ? this.props.onSubmit(this.state.code)
                    : null
                }
                title={translate("floSmsValidationModal.approve")}
                containerStyle={{
                  width: Dimensions.get("window").width / 2 - 50,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
export default FloSmsValidationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

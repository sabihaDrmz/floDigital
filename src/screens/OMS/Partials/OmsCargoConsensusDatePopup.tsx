import BlurView from "../../../components/BlurView";
import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Portal } from "react-native-portalize";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  getLocale,
  translate,
} from "../../../helper/localization/locaizationMain";
import OmsService from "../../../core/services/OmsService";
import moment from "moment";
import { Fontisto } from "@expo/vector-icons";
import AppTextBox from "../../../NewComponents/FormElements/AppTextBox";
import AppDatePicker from "../../../components/AppDatePicker";

interface OmsCargoConsensusDatePopupProps {
  onClose: () => void;
}

const OmsCargoConsensusDatePopup: React.FC<OmsCargoConsensusDatePopupProps> = (
  props
) => {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  return (
    <Portal>
      <BlurView
        style={{
          position: "absolute",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width - 40,
              minHeight: 100,
              borderRadius: 10,
              backgroundColor: "#fff",
              padding: 20,
            }}
          >
            <AppDatePicker
              onDateConfirm={(date) => {
                OmsService.omsConsensusStartDate = date;
              }}
              defaultDate={OmsService.omsConsensusStartDate}
            />
            <AppButton
              title={translate("OmsCargoConsensusDatePopup.ok")}
              onPress={props.onClose}
              buttonColorType={ColorType.Brand}
            />
          </View>
        </View>
      </BlurView>
    </Portal>
  );
};
export default OmsCargoConsensusDatePopup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { BlurView } from "expo-blur";
import { AppButton, ColorType } from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Portal } from "react-native-portalize";
import AppDatePicker from "../../AppDatePicker";
import { useOmsService } from "../../../contexts/OmsService";
import { translate } from "../../../helper/localization/locaizationMain";

interface OmsCargoConsensusDatePopupProps {
  onClose: () => void;
}

const CargoConsensusDatePopup: React.FC<OmsCargoConsensusDatePopupProps> = (
  props
) => {
  const OmsService = useOmsService();
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
                OmsService.setOmsConsensusStartDateData(date);
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
export default CargoConsensusDatePopup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

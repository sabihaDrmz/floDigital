import React, { useState } from "react";
import { Portal } from "react-native-portalize";
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MenuIconSales } from "../../../src/components/CompletionOfSalesShortage/MenuIconSales";
import {
  AppText,
  AppButton,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { translate } from "../../../src/helper/localization/locaizationMain";
import Radio from "../../../src/components/Oms/partials/Radio";
import { ColorType } from "@flomagazacilik/flo-digital-components";
import { PerfectFontSize } from "../../../src/helper/PerfectPixel";

interface PopupProps {
  onHide: () => void;
  reasonsData: any;
  selectedReasonId: any;
  onReasonSelect: (reasonCode: any) => void;
  onRemove: () => void;
}

const Popup: React.FC<PopupProps> = (props) => {
  const [reasonSelect, setReasonSelect] = useState(props.selectedReasonId);
  return (
    <Portal>
      <TouchableWithoutFeedback>
        <View style={styles.popUpItem}>
          <TouchableWithoutFeedback>
            <View style={styles.popUp}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MenuIconSales color2={"#919191"} color={"#fff"} />
                  <AppText size={FontSizes.L} style={styles.popUpText}>
                    {translate("completionOfSalesShortageMainScreen.buttonTwo")}
                  </AppText>
                </View>
                <View style={{ height: 30 }}>
                  <AppButton
                    transparent
                    onPress={() => {
                      props.onRemove();
                      props.onHide();
                    }}
                  >
                    <View style={styles.buttonView}>
                      <AppText>X</AppText>
                    </View>
                  </AppButton>
                </View>
              </View>
              <View style={{ paddingHorizontal: 5 }}>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                  {props.reasonsData === undefined
                    ? ""
                    : props.reasonsData.map((reason: any, itemId: any) => {
                        return (
                          <Radio
                            key={reason.reasonId}
                            selected={reason.reasonId === reasonSelect}
                            onSelect={() => setReasonSelect(reason.reasonId)}
                            label={reason.reasonName}
                          />
                        );
                      })}
                </View>
                <AppButton
                  onPress={() => {
                    props.onReasonSelect(reasonSelect);
                    props.onHide();
                  }}
                  buttonColorType={ColorType.Success}
                  title={translate(
                    "completionOfSalesShortageMainScreen.popUpButton"
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Portal>
  );
};
export default Popup;

const styles = StyleSheet.create({
  popUpItem: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  popUp: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minWidth: 330
  },
  popUpText: {
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(14),
    fontStyle: "normal",
    color: "#b7b5b5"
  },
  buttonView: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 25,
    height: 25,
    backgroundColor: "rgba(0,0,0,.1)",
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30
  },
});

import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ColorPropType,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Portal } from "react-native-portalize";
import Svg, { Defs, G, Path } from "react-native-svg";
import { OmsErrorReasonModel } from "../../../core/models/OmsErrorReasonModel";
import OmsService from "../../../core/services/OmsService";
import { translate } from "../../../helper/localization/locaizationMain";
import Radio from "./Radio";

const OmsReaseonRadios: React.FC<{
  onSave?: (reason?: OmsErrorReasonModel) => void;
  center?: boolean;
}> = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentReason, setCurrentReason] = useState<
    OmsErrorReasonModel | undefined
  >();
  useEffect(() => {
    if (showPopup) {
      OmsService.loadErrorReasons();
    }
  }, [showPopup]);

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setCurrentReason(undefined);
          setShowPopup(true);
          props.onSave && props.onSave(undefined);
          // setCurrentReason(undefined);
        }}
        style={styles.container}
      >
        <View style={styles.content}>
          <AppText selectable style={{ fontWeight: "400" }}>
            {currentReason ? currentReason?.OmsName : "-"}
          </AppText>
          {currentReason === undefined && (
            <AppText style={{ fontWeight: "400" }}>
              {translate("OmsReaseonRadios.selectReason")}
            </AppText>
          )}
        </View>
        <MenuIcon />
      </TouchableOpacity>
      {showPopup && (
        <Portal>
          <TouchableWithoutFeedback
            onPress={() => {
              props.onSave && props.onSave(currentReason);

              setShowPopup(false);
            }}
          >
            <View
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.popupContainer,
                    props.center && { top: 0, width: "90%" },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MenuIcon color2={"#919191"} color={"#fff"} />
                    <AppText size={FontSizes.L} style={{ color: "#919191" }}>
                      {translate("OmsReaseonRadios.selectReason")}
                    </AppText>
                  </View>
                  <View style={{ paddingHorizontal: 24 }}>
                    <Observer>
                      {() => (
                        <View style={{ marginBottom: 10, marginTop: 10 }}>
                          {OmsService.errorReasons.map((reason) => {
                            return (
                              <Radio
                                selected={reason === currentReason}
                                onSelect={() =>
                                  setCurrentReason(
                                    reason === currentReason
                                      ? undefined
                                      : reason
                                  )
                                }
                                label={reason.OmsName}
                              />
                            );
                          })}
                        </View>
                      )}
                    </Observer>
                    <AppButton
                      onPress={() => {
                        props.onSave && props.onSave(currentReason);

                        setShowPopup(false);
                      }}
                      buttonColorType={ColorType.Success}
                      title={translate("OmsReaseonRadios.continue")}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      )}
    </React.Fragment>
  );
};
export default OmsReaseonRadios;

const POPUP_HEIGHT = 340;
const styles = StyleSheet.create({
  popupContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  container: {
    height: 44,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#c1bdbd",
    opacity: 0.42,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    alignItems: "center",
    flexDirection: "row",

    paddingLeft: 15,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
});

export const MenuIcon: React.FC<{ color?: string; color2?: string }> = (
  props
) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} {...props}>
      <Defs></Defs>
      <G
        id="Group_3142"
        data-name="Group 3142"
        transform="translate(-293 -881)"
      >
        <Path
          id="Path_2211"
          data-name="Path 2211"
          d="M4 0h36a4 4 0 0 1 4 4v36a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
          transform="translate(293 881)"
          style={{
            fill: props.color || "#b7b4b4",
            opacity: 0.998,
          }}
        />
        <G id="ru7Gjk.tif" transform="translate(-125.527 699.946)">
          <G
            id="Group_3140"
            data-name="Group 3140"
            transform="translate(429.179 194.054)"
          >
            <Path
              fill={props.color2 || "#fff"}
              id="Path_2205"
              data-name="Path 2205"
              className="cls-2"
              d="M603.79 227.664a1.418 1.418 0 0 1-1.073 1.055 1.322 1.322 0 0 1-.3.029h-12.333a1.377 1.377 0 0 1-1.19-2.1 1.282 1.282 0 0 1 1.148-.67q6.209-.005 12.419 0a1.388 1.388 0 0 1 1.326 1.083z"
              transform="translate(-581.851 -224.61)"
            />
            <Path
              fill={props.color2 || "#fff"}
              id="Path_2206"
              data-name="Path 2206"
              className="cls-2"
              d="M603.789 387.352a1.418 1.418 0 0 1-1.073 1.055 1.324 1.324 0 0 1-.3.029h-12.333a1.377 1.377 0 0 1-1.19-2.1 1.282 1.282 0 0 1 1.148-.67q6.209-.005 12.419 0a1.388 1.388 0 0 1 1.326 1.083z"
              transform="translate(-581.85 -377.446)"
            />
            <Path
              fill={props.color2 || "#fff"}
              id="Path_2207"
              data-name="Path 2207"
              className="cls-2"
              d="M603.789 547.04a1.418 1.418 0 0 1-1.073 1.055 1.328 1.328 0 0 1-.3.029h-12.333a1.377 1.377 0 0 1-1.19-2.1 1.282 1.282 0 0 1 1.148-.67q6.209-.005 12.419 0a1.388 1.388 0 0 1 1.326 1.083z"
              transform="translate(-581.85 -530.283)"
            />
            <Path
              fill={props.color2 || "#fff"}
              id="Path_2208"
              data-name="Path 2208"
              className="cls-2"
              d="M431.244 198.192a2.069 2.069 0 1 1 2.073-2.055 2.049 2.049 0 0 1-2.073 2.055z"
              transform="translate(-429.179 -194.054)"
            />
            <Path
              fill={props.color2 || "#fff"}
              id="Path_2209"
              data-name="Path 2209"
              className="cls-2"
              d="M431.268 353.742a2.069 2.069 0 1 1-2.088 2.04 2.049 2.049 0 0 1 2.088-2.04z"
              transform="translate(-429.18 -346.89)"
            />
            <Path
              fill={props.color2 || "#fff"}
              id="Path_2210"
              data-name="Path 2210"
              className="cls-2"
              d="M429.179 515.5a2.069 2.069 0 1 1 2.056 2.071 2.05 2.05 0 0 1-2.056-2.071z"
              transform="translate(-429.179 -499.726)"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};

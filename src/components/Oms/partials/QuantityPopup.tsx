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
  Image,
  Platform,
  KeyboardAvoidingView,
  TextInput
} from "react-native";
import { Portal } from "react-native-portalize";
import { useOmsService } from "../../../contexts/OmsService";
import { OmsErrorReasonModel } from "../../../core/models/OmsErrorReasonModel";
import { translate } from "../../../helper/localization/locaizationMain";
import { TextManipulator } from "../../../NewComponents/FormElements/AppTextBox";
import ReaseonRadios from "./ReaseonRadios";
const { width, height } = Dimensions.get("window");
const QuantityPopup: React.FC<{
  quantity: string;
  curQuantity: string;
  imageUri: string;
  onComplete?: (
    quantity: number,
    reason?: OmsErrorReasonModel,
    continueLater?: boolean
  ) => void;
  barcode: string;
}> = (props) => {
  const OmsService = useOmsService();
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState<OmsErrorReasonModel>();
  const [continueLater, setContinueLater] = useState<boolean>(false);
  return (
    <Portal>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.content}>
            <AppText
              selectable
              style={{
                fontSize: 14,
                fontWeight: "300",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "center",
                color: "#707070",
              }}
            >
              {props.barcode}
            </AppText>
            <View style={styles.imageContainer}>
              <Image
                style={styles.imageContainer}
                resizeMode={"center"}
                source={{ uri: props.imageUri }}
              />
            </View>
            <View style={styles.quantityContainer}>
              <AppText selectable style={styles.quantityText}>
                {props.quantity || 3}
              </AppText>
              <AppText
                selectable
                style={[styles.quantityText, { marginLeft: 4 }]}
              >
                /
              </AppText>
              <TextInput
                value={quantity}
                onChangeText={(txt) => {
                  txt = TextManipulator(txt, "onlyNumber");
                  if (txt && Number(props.quantity) < Number(txt))
                    txt = props.quantity;
                  setQuantity(txt);
                  setReason(undefined);
                  setContinueLater(false);
                }}
                style={styles.quantityInput}
              />
            </View>
            <AppText selectable>{`${props.quantity} TANE ÜRÜNÜN ${quantity || "0"
              } TANESİNİ TOPLADIN`}</AppText>
            {!continueLater &&
              quantity !== "" &&
              Number(props.quantity) > Number(quantity) && (
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, marginTop: 20 }}>
                    <ReaseonRadios
                      reasons={OmsService.errorReasons}
                      onSave={setReason}
                    />
                  </View>
                </View>
              )}
            {/* {!continueLater && !reason && quantity !== '' && (
            <View
              style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
              <View
                style={{
                  height: 1,
                  width: '30%',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  marginTop: 3,
                }}
              />
              <AppText style={{marginHorizontal: 10}}>veya</AppText>
              <View
                style={{
                  height: 1,
                  width: '30%',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  marginTop: 3,
                }}
              />
            </View>
          )} */}
            {/* {!reason &&
            quantity !== '' &&
            Number(props.quantity) > Number(quantity) && (
              <View style={{marginTop: 15}}>
                <AppCheckBox
                  onSelect={setContinueLater}
                  checked={continueLater}
                  title={'Kalan ürünler sonra toplanacak'}
                />
              </View>
            )} */}
            {reason && (
              <AppText
                selectable
                labelColorType={ColorType.Danger}
                style={{ marginTop: 20 }}
              >
                {quantity} {translate("OmsQuantityPopup.collected")}{" "}
                {reason.OmsName} {translate("OmsQuantityPopup.wilBeMarked")}
              </AppText>
            )}
            <AppButton
              style={styles.button}
              disabled={
                quantity !== props.quantity && !continueLater && !reason
              }
              title={"Devam et"}
              loading={OmsService.loadingGroupCollect}
              buttonColorType={
                quantity !== props.quantity && !continueLater && !reason
                  ? ColorType.Gray
                  : reason
                    ? ColorType.Warning
                    : ColorType.Success
              }
              onPress={() => {
                props.onComplete &&
                  props.onComplete(Number(quantity), reason, continueLater);
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Portal>
  );
};
export default QuantityPopup;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width,
    height,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    borderRadius: 14,
    width: width - 90,
    padding: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#3c3c3c55",
    shadowOffset: {
      width: 0,
      height: 13,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 21,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#626161",
  },
  quantityInput: {
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#707070",
    width: 32,
    height: 32,
    marginLeft: 7,
    fontSize: 21,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#626161",
    ...Platform.select({
      android: {
        paddingVertical: 1,
        paddingHorizontal: 1,
      },
    }),
  },
  imageContainer: {
    width: 117,
    height: 117,
    marginBottom: 17,
    // backgroundColor: 'red',
    marginTop: 10,
    alignItems: "center",
  },
  button: {
    width: width - 160,
    marginTop: 20,
  },
});

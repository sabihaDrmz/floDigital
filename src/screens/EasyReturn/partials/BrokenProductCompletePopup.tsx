import axios from "axios";
import { observer } from "mobx-react";
import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { FloTextBox, FloButton } from "../../../components";
import { TransactionType } from "../../../core/models/EasyReturnTrasnaction";
import { ErSentSmsResult } from "../../../core/models/ErSentSms";
import {
  FloResultCode,
  ServiceResponseBase,
} from "../../../core/models/ServiceResponseBase";
import AccountService from "../../../core/services/AccountService";
import EasyReturnService from "../../../core/services/EasyReturnService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../../core/services/MessageBox";
import { GetServiceUri, ServiceUrlType } from "../../../core/Settings";
import { toCensorText } from "../../../core/Util";
//TODO: EXPO exPrint
// import * as exPrint from "expo-print";
import { useEffect } from "react";
import { autorun } from "mobx";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";

interface BrokenProductCompletePopupProps {
  onComplete: () => void;
}

const BrokenProductCompletePopup = observer(
  (props: BrokenProductCompletePopupProps) => {
    const [hasEditPhone, setHasEditPhone] = useState(false);
    const [phone, setPhone] = useState("");
    const [printCopyCount, setPrintCopyCount] = useState(1);
    const [hasSentValidationCode, setHasSentValidationCode] = useState(false);
    const [sentSmsId, setSentSmsId] = useState(0);
    const [validationCode, setValidationCode] = useState("");
    const [validationState, setValidationState] = useState(0);
    const [countDown, setCountDown] = useState(0);
    const [hasPrint, setHasPrint] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCompleteTransaction, setHasCompleteTransaction] = useState(false);
    const [htmlDoc, setHtmlDoc] = useState("");
    const [receiptBarcode, setReceiptBarcode] = useState("");
    //   const [intervaler, setIntervaler] = useState();

    useEffect(
      autorun(() => {
        EasyReturnService.updateTransaction(
          TransactionType.Broken,
          EasyReturnService.transaction?.processTypeSource
        );
      }),
      []
    );

    const _handleSentValidationCode = async () => {
      setHasSentValidationCode(true);
      // setCountDown(__DEV__ ? 5 : 90);

      //TODO: Burası sms doğrulama kodunu gönderme
      await _sentValidationCode();
    };

    const _validateCode = async () => {
      try {
        let result = await axios.post<ServiceResponseBase<ErSentSmsResult>>(
          `${GetServiceUri(
            ServiceUrlType.ER_APPROVE_SMS
          )}?id=${sentSmsId}&code=${validationCode}`,
          {},
          { headers: AccountService.tokenizeHeader() }
        );

        if (
          result.data.state === FloResultCode.Successfully &&
          result.data.model.result
        ) {
          setValidationState(1);
        } else {
          setValidationState(2);
        }
      } catch (err) {}
    };

    const _sentValidationCode = async () => {
      try {
        let result = await axios.post<ServiceResponseBase<ErSentSmsResult>>(
          `${GetServiceUri(
            ServiceUrlType.ER_SENT_SMS
          )}?phone=${phone}&transactionId=${EasyReturnService.transaction?.id}`,
          {},
          { headers: AccountService.tokenizeHeader() }
        );

        if (result.data.state === FloResultCode.Successfully) {
          setSentSmsId(result.data.model.id);
        }
      } catch (err) {}
    };

    const _printDocument = async () => {
      if (isLoading) return;

      if (validationState !== 1) {
        MessageBox.Show(
          translate("easyReturnBrokenProductCompletePopup.validationSms"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );

        return;
      }
      try {
        if (!hasCompleteTransaction) {
          setIsLoading(true);

          let saveUri =
            GetServiceUri(ServiceUrlType.SYSTEM_API) +
            "genius/SendReturnProduct?transactionId=" +
            EasyReturnService.transaction?.id;

          let result = await axios.post(
            saveUri,
            {},
            { headers: AccountService.tokenizeHeader() }
          );

          if (result.data.state === FloResultCode.Successfully) {
            setHasCompleteTransaction(true);
            setHtmlDoc(result.data.model.expenseSlipUrl);
            setReceiptBarcode(result.data.model.receipt_Barcode);
          }

          setIsLoading(false);
        }

        setHasPrint(true);
       /* await exPrint.selectPrinterAsync();
        await exPrint.printAsync({
          html: htmlDoc,
          orientation: exPrint.Orientation.portrait,
        });

        */
      } catch (err) {}
    };

    const _handleComplete = async () => {
      if (!hasPrint) {
        MessageBox.Show(
          translate("easyReturnBrokenProductCompletePopup.printDocument"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );

        return;
      }

      props.onComplete();
    };

    return (
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            padding: 15,
            width: "90%",
          }}
        >
          {receiptBarcode === "" ? (
            <KeyboardAwareScrollView>
              <FloTextBox
                editable={validationState !== 1}
                value={
                  hasEditPhone
                    ? phone
                    : toCensorText(
                        EasyReturnService.currentFiche
                          ? EasyReturnService.currentFiche.customerPhone
                          : ""
                      )
                }
                placeholder={"0 ( 5xx ) xxx xx xx"}
                mask={hasEditPhone ? "cel-phone" : undefined}
                onFocus={() => setHasEditPhone(true)}
                onChangeText={(input) => setPhone(input)}
              />

              {
                <View>
                  {hasSentValidationCode && validationState !== 1 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <FloButton
                        containerStyle={{
                          width:
                            Dimensions.get("window").width -
                            (countDown > 0 ? 150 : 70),
                        }}
                        onPress={_sentValidationCode}
                        title={translate(
                          "easyReturnBrokenProductCompletePopup.sendAgain"
                        )}
                      />
                      {countDown > 0 && (
                        <Text
                          style={{
                            fontSize: 50,
                            width: 50,
                            textAlign: "center",
                          }}
                        >
                          {countDown}
                        </Text>
                      )}
                    </View>
                  ) : validationState === 1 ? (
                    <></>
                  ) : (
                    <>
                      <View style={{ height: 15 }}></View>
                      <FloButton
                        onPress={_handleSentValidationCode}
                        title={translate(
                          "easyReturnBrokenProductCompletePopup.sendValidationCode"
                        )}
                      />
                      <View style={{ height: 15 }}></View>
                      {hasEditPhone && (
                        <FloButton
                          title={translate("messageBox.cancel")}
                          containerStyle={{ backgroundColor: "red" }}
                          onPress={() => setHasEditPhone(false)}
                        />
                      )}
                      <View style={{ height: 15 }}></View>
                    </>
                  )}
                  {hasSentValidationCode && validationState !== 1 && (
                    <View>
                      <View style={{ height: 15 }}></View>
                      <FloTextBox
                        onChangeText={(input) => setValidationCode(input)}
                        placeholder={translate(
                          "easyReturnBrokenProductCompletePopup.validationCode"
                        )}
                      />
                      <FloButton
                        onPress={_validateCode}
                        title={translate(
                          "easyReturnBrokenProductCompletePopup.approve"
                        )}
                      />
                      <View style={{ height: 15 }}></View>
                    </View>
                  )}
                </View>
              }

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: 15,
                }}
              >
                <View>
                  <Text>Kopya Sayısı</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setPrintCopyCount(
                          printCopyCount > 1
                            ? printCopyCount - 1
                            : printCopyCount
                        )
                      }
                      style={{
                        marginRight: 15,
                      }}
                    >
                      <AntDesign name={"minus"} size={20} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25 }}>{printCopyCount}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setPrintCopyCount(
                          printCopyCount < 5
                            ? printCopyCount + 1
                            : printCopyCount
                        )
                      }
                      style={{
                        marginLeft: 15,
                      }}
                    >
                      <AntDesign name={"plus"} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={_printDocument}>
                  <AntDesign name={"printer"} size={35} />
                </TouchableOpacity>
              </View>

              <FloButton
                onPress={_handleComplete}
                title={translate(
                  "easyReturnBrokenProductCompletePopup.completeTransaction"
                )}
              />
            </KeyboardAwareScrollView>
          ) : (
            <View>
              <Text
                style={{
                  fontSize: PerfectFontSize(15),
                  fontFamily: "Poppins_400Regular",
                }}
              >{`${receiptBarcode} translate('easyReturnBrokenProductCompletePopup.recordCreated'`}</Text>
              <View style={{ height: 20 }}></View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: 15,
                }}
              >
                <View>
                  <Text>Kopya Sayısı</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setPrintCopyCount(
                          printCopyCount > 1
                            ? printCopyCount - 1
                            : printCopyCount
                        )
                      }
                      style={{
                        marginRight: 15,
                      }}
                    >
                      <AntDesign name={"minus"} size={20} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25 }}>{printCopyCount}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setPrintCopyCount(
                          printCopyCount < 5
                            ? printCopyCount + 1
                            : printCopyCount
                        )
                      }
                      style={{
                        marginLeft: 15,
                      }}
                    >
                      <AntDesign name={"plus"} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={_printDocument}>
                  <AntDesign name={"printer"} size={35} />
                </TouchableOpacity>
              </View>

              <FloButton
                onPress={_handleComplete}
                title={translate(
                  "easyReturnBrokenProductCompletePopup.completeTransaction"
                )}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
);

export default BrokenProductCompletePopup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

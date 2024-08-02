import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { AppCardColorizeSvg } from "./BrokenComplete";
//TODO: EXPO exPrint
// import * as exPrint from "expo-print";
import RNPrint from 'react-native-print';

import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import { translate } from "../../helper/localization/locaizationMain";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useEasyReturnService } from "../../contexts/EasyReturnService";

const GetStateColor = (state?: string) => {
  let iState = Number(state);

  switch (iState) {
    case 1:
    case 8:
      return AppColor.FD.Functional.Error;
    case 4:
    case 2:
    case 9:
      return AppColor.OMS.Background.Success;
    case 3:
    case 5:
    case 6:
    case 7:
    default:
      return AppColor.FD.Brand.Solid;
  }
};
const BrokenProductResult: React.FC = (props) => {
  const {
    brokenProductSapFiches,
    brokenProductFindResult,
    brokenProductTemplate,
    sendRejectionApproveSms,
    sendRejectionSms,
    SendBrokenProductCompletedSms,
    GetBrokenProductDocumentWithTransactionId
  } = useEasyReturnService();
  const { show } = useMessageBoxService();

  const BrSapResult: React.FC = (props) => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <>
        <AppTextBox
          placeholder="Ara"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginHorizontal: 10,
            marginVertical: 10,
            padding: 16,
            borderRadius: 10,
          }}
        />

        <FlatList
          style={{ padding: 20 }}
          data={brokenProductSapFiches.filter((x) =>
            x.mgZ_MUSTERI_ADI.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
            x.mgZ_MUSTERI_TEL.includes(searchQuery) ||
            x.mgZ_UIB_NO.includes(searchQuery) ||
            x.karaR_TEXT.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
            x.istasyoN_TEXT.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
          )}
          keyExtractor={(item) => item.mgZ_UIB_NO}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  minHeight: 100,
                  marginTop: 20,
                }}
              >
                <View style={{ position: "absolute" }}>
                  <AppCardColorizeSvg
                    color={AppColor.OMS.Background.OpacityOrange}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                  }}
                >
                  <View>
                    <Image
                      source={{
                        uri:
                          "https://www.flo.com.tr/V1/product/image?sku=" +
                          item.uruN_KODU
                            .replace(/^0+/, "")
                            .substring(
                              0,
                              item.uruN_KODU.replace(/^0+/, "").length - 3
                            ),
                      }}
                      style={{ width: 80, height: 80, resizeMode: "cover" }}
                    />
                  </View>
                  <View style={{flexShrink:1}}>
                    <AppText
                      selectable
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                      numberOfLines={2}
                    >
                      {item.uruN_ADI}
                    </AppText>
                    {/* <AppText
                        selectable
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        Beden : {erl[0].size} | Adet : {erl[0].quantity}
                      </AppText> */}
                    <AppText
                      selectable
                      style={{ fontFamily: "Poppins_400Regular" }}
                    >
                      {item.uruN_KODU}
                    </AppText>
                  </View>
                </View>

                <Evaluation
                  {...{
                    customerName: item.mgZ_MUSTERI_ADI,
                    customerPhone: item.mgZ_MUSTERI_TEL,
                    uibNo: item.mgZ_UIB_NO,
                    evaluation: item.karaR_TEXT,
                    evaluationType: item.karar,
                    station: item.istasyoN_TEXT,
                    reason: item.istasyoN_TEXT,
                  }}
                />
              </View>
            );
          }}
        />
      </>
    );
  };

  const Evaluation: React.FC<{
    customerName?: string;
    customerPhone?: string;
    uibNo?: string;
    evaluation?: string;
    evaluationType?: string;
    station?: string;
    reason?: string;
    ficheNumber?: string;
    reviewReason?: string;
  }> = (props) => {
    const {
      customerName,
      customerPhone,
      ficheNumber,
      uibNo,
      evaluation,
      evaluationType,
      station,
      reason,
      reviewReason,
    } = props;
    return (
      <View style={{ marginBottom: 20 }}>
        <View style={styles.header}>
          <AppText
            labelColorType={ColorType.Light}
            style={{ fontWeight: "bold" }}
          >
            Değerlendirme
          </AppText>
        </View>
        <View style={styles.detail}>
          {customerName && (
            <View style={styles.textLine}>
              <AppText style={styles.typeText}>Müşteri Adı</AppText>
              <AppText>:</AppText>
              <AppText style={styles.textDetail}>{customerName}</AppText>
            </View>
          )}
          {customerPhone && (
            <View style={styles.textLine}>
              <AppText style={styles.typeText}>Müşteri Tel</AppText>
              <AppText>:</AppText>
              <AppText style={styles.textDetail}>{customerPhone}</AppText>
            </View>
          )}
          {ficheNumber && (
            <View style={styles.textLine}>
              <AppText style={styles.typeText}>Fiş No</AppText>
              <AppText>:</AppText>
              <AppText style={styles.textDetail}>{ficheNumber}</AppText>
            </View>
          )}
          {uibNo && (
            <View style={styles.textLine}>
              <AppText style={styles.typeText}>ÜİB No</AppText>
              <AppText>:</AppText>
              <AppText style={styles.textDetail}>{uibNo}</AppText>
            </View>
          )}
          {reviewReason && (
            <View style={styles.textLine}>
              <AppText style={styles.typeText}>İnceleme Nedeni</AppText>
              <AppText>:</AppText>
              <AppText style={styles.textDetail}>{reviewReason}</AppText>
            </View>
          )}
          {reason && (
            <View style={styles.textLine}>
              <AppText style={styles.typeText}>İade Sebebi</AppText>
              <AppText>:</AppText>
              <AppText style={styles.textDetail}>{reason}</AppText>
            </View>
          )}
          {evaluation && (
            <View style={styles.textLine}>
              <AppText style={styles.typeText}>Karar</AppText>
              <AppText>:</AppText>
              <AppText
                style={[
                  styles.textDetail,
                  {
                    color: GetStateColor(evaluationType),
                    fontWeight: "600",
                    fontFamily: "Poppins_600SemiBold",
                  },
                ]}
              >
                {evaluation}
              </AppText>
            </View>
          )}
          {station && (
            <View style={styles.textLine}>
              <AppText style={styles.typeText}>İstasyon</AppText>
              <AppText>:</AppText>
              <AppText style={styles.textDetail}>{station}</AppText>
            </View>
          )}
        </View>
      </View>
    );
  };
  let erl =
    brokenProductFindResult?.easyReturnTransaction
      .easyReturnTrasactionLine;

  const validateSms = async (ficheNumber: string, auibNo: string, validationCode: string) => {
    sendRejectionApproveSms(
      ficheNumber,
      auibNo,
      validationCode,
    ).then((res) => {
      if (res) {
        show("Ürünü teslim edebilirsiniz");
      }
      else {
        show(translate("messageBox.verificationNotValid"), {
          type: MessageBoxType.SmsValidation,
          onValidate(validationCode) {
            validateSms(ficheNumber, auibNo, validationCode);
          },
        });
      }
    });

  };

  const sendSms = (ficheNumber: string, auibNo: string) => {
    sendRejectionSms(
      ficheNumber, auibNo
    ).then((res) => {
      if (res) {
        show("", {
          type: MessageBoxType.SmsValidation,
          onValidate: (validationCode) => {
            validateSms(ficheNumber, auibNo, validationCode);
          },
          reSendSms: () => {
            sendSms(ficheNumber, auibNo);
          },
        });
      }
    })
  }

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        headerTitle="İDES Durumu"
        enableButtons={["back"]}
      />
      {erl === undefined ? (
        <BrSapResult />
      ) : (
        <ScrollView
          bounces={false}
          style={{ paddingHorizontal: 20, paddingTop: 10 }}
        >
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderRadius: 10,
              backgroundColor: "#fff",
              minHeight: 100,
              marginTop: 20,
            }}
          >
            <View style={{ position: "absolute" }}>
              <AppCardColorizeSvg
                color={AppColor.OMS.Background.OpacityOrange}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 20,
                paddingHorizontal: 20,
              }}
            >
              <View>
                <Image
                  source={{
                    uri: brokenProductFindResult?.images,
                  }}
                  style={{ width: 80, height: 80, resizeMode: "cover" }}
                />
              </View>
              <View>
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                >
                  {erl[0].productName}
                </AppText>
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Beden : {erl[0].size} | Adet : {erl[0].quantity}
                </AppText>
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  {erl[0].barcode} / {erl[0].sku}
                </AppText>
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  labelColorType={ColorType.Brand}
                >
                  Satış Fiyatı : {erl[0].productPrice}
                </AppText>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: 5,
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                SendBrokenProductCompletedSms();
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width / 3 - 30,
                  maxWidth: 135,
                  backgroundColor: "#FF8600",
                  borderRadius: 10,
                  padding: 15,
                  marginHorizontal: 5,
                  minHeight: 80,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AppText
                  labelColorType={ColorType.Light}
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 11,
                  }}
                >
                  Tekrar ÜİB No SMS'i Gönder
                </AppText>
              </View>
            </TouchableOpacity>
            {brokenProductFindResult?.sapResult?.karar &&
              (brokenProductFindResult.sapResult.karar === "1" ||
                brokenProductFindResult.sapResult.karar === "8") &&
              <TouchableOpacity
                onPress={() => sendSms(brokenProductFindResult?.easyReturnTransaction
                  .ficheNumber,
                  brokenProductFindResult?.sapResult.mgZ_UIB_NO)}
              >
                <View
                  style={{
                    width: Dimensions.get("screen").width / 3 - 30,
                    maxWidth: 135,
                    backgroundColor: "#FF8600",
                    borderRadius: 10,
                    padding: 15,
                    marginHorizontal: 5,
                    minHeight: 80,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AppText
                    labelColorType={ColorType.Light}
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 11,
                    }}
                  >
                    Ürün Teslim İçin SMS Gönder
                  </AppText>
                </View>
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => {
                GetBrokenProductDocumentWithTransactionId().then(
                  async (res) => {
                    if (res) {
                      await RNPrint.print({
                        html: brokenProductTemplate,
                      });
                    }
                  }
                );
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width / 3 - 30,
                  maxWidth: 135,
                  backgroundColor: "#FF8600",
                  borderRadius: 10,
                  padding: 15,
                  marginHorizontal: 5,
                  minHeight: 80,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AppText
                  labelColorType={ColorType.Light}
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 11,
                  }}
                >
                  Belgeyi Yazdır
                </AppText>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity>
                  <View
                    style={{
                      width: 90,
                      backgroundColor: "#FF8600",
                      borderRadius: 10,
                      padding: 15,
                      marginHorizontal: 5,
                      minHeight: 80,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AppText style={{ color: Colors.white, fontSize: 11 }}>
                      Belge İptali Talep Et
                    </AppText>
                  </View>
                </TouchableOpacity> */}
          </View>

          <Evaluation
            {...{
              customerName:
                brokenProductFindResult?.easyReturnTransaction
                  .customerName,
              customerPhone:
                brokenProductFindResult?.easyReturnTransaction
                  .customerGsm,
              ficheNumber:
                brokenProductFindResult?.easyReturnTransaction
                  .ficheNumber,
              uibNo:
                brokenProductFindResult?.sapResult.mgZ_UIB_NO,
              reviewReason:
                brokenProductFindResult?.sapResult
                  .hatA_DETAYI,
              evaluation:
                brokenProductFindResult?.sapResult.karaR_TEXT,
              evaluationType:
                brokenProductFindResult?.sapResult.karar,
              station:
                brokenProductFindResult?.sapResult
                  .istasyoN_TEXT,
              reason:
                brokenProductFindResult?.sapResult
                  .iadE_SEBEBI,
            }}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default BrokenProductResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 35,
    backgroundColor: AppColor.FD.Brand.Solid,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  detail: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeText: {
    width: 120,
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  textDetail: {
    marginLeft: 7,
    fontSize: 11,
  },
});

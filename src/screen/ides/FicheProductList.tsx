import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import BlurView from "../../components/BlurView";
import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { FloHeader } from "../../components/Header";
import ErFicheHeader from "../../components/IdesComponents/ErFicheHeader";
import ProductCard from "../../components/IdesComponents/ProductCard";
import QrSearchBar from "../../components/IdesComponents/QrSearchBar";
import { PerfectPixelSize } from "../../helper/PerfectPixel";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { EasyReturnTrasactionModel } from "../../contexts/model/EasyReturnTrasactionModel";
import { translate } from "../../helper/localization/locaizationMain";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
const FicheProductList: React.FC = () => {
  const {
    isLoading,
    erCurrentFiche,
    erSelectedReturnProducts,
    SetErSelectedReturnProductsData,
    ErMakeTransaction,
    sentValidationSms,
    validateSms
  } = useEasyReturnService();
  const { show } = useMessageBoxService();
  const { allEasyReturnReasons } = useApplicationGlobalService();
  const [selectedCombo, setSelectedCombo] = useState<
    { barcode: string; combo: any; quantit: number }[]
  >([]),
    [showPopup, setShowPopup] = useState(false),
    [popupItem, setPopupItem] = useState(""),
    [popupType, setPopupType] = useState(1),
    [popupMaxQuantity, setMaxQuantityPopup] = useState(1),
    [customerPhone, setCustomerPhone] = useState("0"),
    [customerNameSurname, setCustomerNameSurname] = useState<any>(),
    PushBarcode = (barcode: string, quantit: number = 1) => {
      if (selectedCombo.length > 0) {
        show("Sadece bir ürün için İDES kaydı oluşturulabilir.");
        return;
      }

      if (
        erCurrentFiche === undefined ||
        erCurrentFiche === null ||
        erCurrentFiche.data.findIndex(
          (x) => x.barcode === barcode
        ) < 0
      ) {
        show(
          "Bu ürüne ait İDES kaydı oluşturulmuş yada bu barkod fiş içerisinde bulunamadı."
        );
        return;
      }

      if (
        erCurrentFiche === undefined ||
        erCurrentFiche === null ||
        erCurrentFiche.data.findIndex(
          (x) => x.barcode === barcode && x.aiuAcceptedQuantity > 0
        ) < 0
      ) {
        show(
          "Okutulan ürün/ürünler için İDES kaydı oluşturulabilir durumda değil."
        );
        return;
      }

      let tempBarcodeList = selectedCombo;

      if (
        tempBarcodeList &&
        tempBarcodeList.findIndex((x) => x.barcode === barcode) < 0
      )
        tempBarcodeList.push({ barcode, combo: "", quantit });

      setSelectedCombo(tempBarcodeList);
      SetErSelectedReturnProductsData(tempBarcodeList);
    },
    GetQuantityPopup = (maxQuantity: number) => {
      let model: any[] = [];
      for (var i = 1; i <= maxQuantity; i++) {
        model.push(
          <AppButton
            onPress={() => {
              setShowPopup(false);
              let temp = selectedCombo;
              let index = temp.findIndex((x) => x.barcode === popupItem);

              if (index !== -1) {
                temp[index].quantit = i;
              }

              setSelectedCombo(temp);
              SetErSelectedReturnProductsData(temp);
            }}
            transparent
            style={{
              height: 30,
              justifyContent: "flex-start",
              paddingHorizontal: 20,
            }}
          >
            <AppText selectable>{i}</AppText>
          </AppButton>
        );
      }

      return model;
    };

  const removePhoneMask = (phone: string) => {
    phone = phone.trim();
    phone = phone.replace("(", "");
    phone = phone.replace(")", "");
    while (phone.indexOf(" ") > 0) phone = phone.replace(" ", "");
    phone = phone.startsWith("0") ? phone.substring(1) : phone;
    return phone;
  };

  const validateSmsProcess = async (validationCode: string, smsValidationTemp: number, customerGsm: string, transaction: EasyReturnTrasactionModel) => {
    validateSms(
      validationCode,
      smsValidationTemp
    ).then((res) => {
      if (!res) {
        show(translate("messageBox.verificationNotValid"), {
          type: MessageBoxType.SmsValidation,
          onValidate(validCode) {
            validateSmsProcess(validCode, smsValidationTemp, customerGsm, transaction);
          },
          reSendSms: () => {
            sendSms(customerGsm, transaction);
          },
        });
      }
    });

  };

  const sendSms = (customerGsm: string, transaction: EasyReturnTrasactionModel) => {
    sentValidationSms(
      customerGsm, transaction
    ).then((res) => {
      show("", {
        type: MessageBoxType.SmsValidation,
        onValidate: (validationCode) => {
          validateSmsProcess(validationCode, res, customerGsm, transaction);
        },
        reSendSms: () => {
          sendSms(customerGsm, transaction);
        },
      });
    })
  }

  let data = erCurrentFiche;
  if (data === undefined || data === null) return null;

  return (
    <View style={styles.container}>
      <FloHeader
        headerType="standart"
        headerTitle="Ürün Listesi"
        enableButtons={["back"]}
      />
      <ScrollView>
        <>
          <ErFicheHeader
            {...{
              ficheNumber: data.ficheKey,
              storeNum: data.storeNumber,
              customerName: data.customerName,
              customerPhone: data.customerPhone,
              ficheTotal: data.totalPrice,
              createData: data.ficheDate,
            }}
          />
          <QrSearchBar
            onSearch={(barcode: string) => {
              if (barcode) PushBarcode(barcode);
            }}
          />
          <FlatList
            style={{ marginTop: 20, paddingTop: 10 }}
            data={data.data.filter((x) =>
              erSelectedReturnProducts
                ?.map((y) => y.barcode)
                .includes(x.barcode)
            )}
            keyExtractor={(item, index) => `${index}-${item.barcode}`}
            renderItem={({ item }) => (
              <View>
                <AppButton
                  buttonColorType={ColorType.Danger}
                  style={{
                    width:
                      Dimensions.get("window").width - PerfectPixelSize(40),
                    marginHorizontal: PerfectPixelSize(20),
                    marginBottom: PerfectPixelSize(20),
                  }}
                  onPress={() => {
                    setSelectedCombo([]);
                    SetErSelectedReturnProductsData([]);
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                    }}
                  >
                    Seçilen Ürünü Kaldır
                  </Text>
                </AppButton>
                <ProductCard
                  {...item}
                  onOpenCombo={() => {
                    setShowPopup(true);
                    setPopupItem(item.barcode);
                    setPopupType(1);
                  }}
                  onOpenQuantity={() => {
                    setPopupType(2);
                    setShowPopup(true);
                    setMaxQuantityPopup(Number(item.quantity));
                  }}
                  selectedCombo={
                    erSelectedReturnProducts.find(
                      (x) => x.barcode === item.barcode
                    )?.combo?.name
                  }
                  selQuantity={
                    erSelectedReturnProducts.find(
                      (x) => x.barcode === item.barcode
                    )?.quantit
                  }
                />
              </View>
            )}
          />
          <View style={{ marginHorizontal: 20 }}>
            <AppText
              selectable
              style={{
                marginBottom: 10,
                fontFamily: "Poppins_300Light_Italic",
                marginLeft: 20,
              }}
            >
              {erSelectedReturnProducts.length} Ürün ile devam
              Edilecek
            </AppText>
            <AppButton
              disabled={erSelectedReturnProducts.length === 0}
              onPress={() => {
                setPopupType(3);
                setShowPopup(true);
              }}
              loading={isLoading}
              buttonColorType={
                erSelectedReturnProducts.length === 0
                  ? ColorType.Gray
                  : ColorType.Brand
              }
              title="Devam Et"
            />
          </View>
        </>
      </ScrollView>
      <SafeAreaView />
      {showPopup && (
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
              padding: 20,
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                minHeight: 100,
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 10,
              }}
            >
              {popupType === 1 && (
                <FlatList
                  style={{ marginTop: 10 }}
                  data={allEasyReturnReasons.filter(
                    (x) => !x.name.includes("Arızalı ürün")
                  )}
                  renderItem={({ item }) => (
                    <AppButton
                      onPress={() => {
                        setShowPopup(false);
                        let temp = selectedCombo;
                        let index = temp.findIndex(
                          (x) => x.barcode === popupItem
                        );

                        if (index !== -1) {
                          temp[index].combo = item;
                        }

                        setSelectedCombo(temp);
                        SetErSelectedReturnProductsData(temp);
                      }}
                      transparent
                      style={{
                        height: 30,
                        justifyContent: "flex-start",
                        paddingHorizontal: 20,
                      }}
                    >
                      <AppText selectable>{item.name}</AppText>
                    </AppButton>
                  )}
                  keyExtractor={(x) => x.id.toString()}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#e4e4e4",
                        marginHorizontal: 30,
                        marginBottom: 10,
                      }}
                    />
                  )}
                />
              )}
              {popupType === 2 ? (
                <ScrollView>{GetQuantityPopup(popupMaxQuantity)}</ScrollView>
              ) : popupType === 3 ? (
                <View style={{ padding: 20 }}>
                  <AppText
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 16,
                      marginBottom: 10,
                    }}
                  >
                    Müşteri Ad Soyad :
                  </AppText>
                  <FloTextBoxNew
                    onChangeText={(nameSurname) =>
                      setCustomerNameSurname(nameSurname)
                    }
                    value={customerNameSurname}
                    maxLength={100}
                  />
                  <AppText
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 16,
                      marginBottom: 10,
                    }}
                  >
                    Müşteri Telefonu :
                  </AppText>
                  <FloTextBoxNew
                    onChangeText={(phone) =>
                      setCustomerPhone(
                        phone.startsWith("0") ? phone : `0${phone}`
                      )
                    }
                    value={customerPhone}
                    maskType={"cel-phone"}
                    maxLength={19}
                  />
                  <AppButton
                    style={{ marginTop: 20 }}
                    buttonColorType={ColorType.Brand}
                    title={"Tamamla"}
                    onPress={() => {
                      setShowPopup(false);

                      if (
                        customerNameSurname === "" ||
                        customerNameSurname === null ||
                        customerNameSurname === undefined
                      ) {
                        show("Müşteri Ad Soyad boş geçilemez");
                        return;
                      }
                      if (removePhoneMask(customerPhone) === "") {
                        show("Telefon numarası boş geçilemez");
                        return;
                      }

                      ErMakeTransaction(
                        removePhoneMask(customerPhone),
                        customerNameSurname,
                        true
                      ).then((x: any) => {
                        if (x) {
                          sendSms("0" + removePhoneMask(customerPhone), x);
                        }
                      });
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </BlurView>
      )}
    </View>
  );
};
export default FicheProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

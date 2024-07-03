import { BlurView } from "expo-blur";
import {
  AppButton,
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
  Image,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FloTextBoxNew from "../../../../components/FloTextBoxNew";
import { FloHeader } from "../../../../components/Header";
import ApplicationGlobalService from "../../../../core/services/ApplicationGlobalService";
import EasyReturnService from "../../../../core/services/EasyReturnService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../../../core/services/MessageBox";
import MessageBoxNew from "../../../../core/services/MessageBoxNew";
import AppTextBox from "../../../../NewComponents/FormElements/AppTextBox";
import ErFicheHeader from "../SharedElements/ErFicheHeader";
import ProductCard from "../SharedElements/ProductCard";
import QrSearchBar from "../SharedElements/QrSearchBar";
import {
  PerfectFontSize,
  PerfectPixelSize,
} from "../../../../helper/PerfectPixel";

const removePhoneMask = (phone: string) => {
  phone = phone.trim();
  phone = phone.replace("(", "");
  phone = phone.replace(")", "");
  while (phone.indexOf(" ") > 0) phone = phone.replace(" ", "");
  phone = phone.startsWith("0") ? phone.substring(1) : phone;
  return phone;
};

const InfoMessage: React.FC = (props) => {
  return null;
  //  (
  //   <View style={{paddingHorizontal: 20, marginBottom: 15}}>
  //     <View
  //       style={{
  //         borderTopWidth: 1,
  //         borderBottomWidth: 1,
  //         borderColor: 'rgb(228 ,228 ,228)',
  //         paddingVertical: 10,
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //       }}>
  //       <View style={{marginRight: 10}}>
  //         <Image
  //           source={require('../../../../../assets/crmi.png')}
  //           style={{width: 30, height: 30}}
  //         />
  //       </View>
  //       <AppText
  //         size={FontSizes.S}
  //         style={{
  //           width: Dimensions.get('window').width - 80,
  //         }}>
  //         Kullanılmamış ve etiketleri kesilmemiş ürünlerinizin değişimini
  //         gerçekleştirdiğinize dikkat ediniz
  //       </AppText>
  //     </View>
  //   </View>
  // );
};
const FicheProductList: React.FC = (props) => {
  const [selectedCombo, setSelectedCombo] = useState<
    { barcode: string; combo: any; quantit: number }[]
  >([]);

  const PushBarcode = (barcode: string, quantit: number = 1) => {
    if (selectedCombo.length > 0) {
      MessageBoxNew.show("Sadece bir ürün için İDES kaydı oluşturulabilir.");
      return;
    }

    if (
      EasyReturnService.erCurrentFiche === undefined ||
      EasyReturnService.erCurrentFiche === null ||
      EasyReturnService.erCurrentFiche.data.findIndex(
        (x) => x.barcode === barcode
      ) < 0
    ) {
      MessageBoxNew.show(
        "Bu ürüne ait İDES kaydı oluşturulmuş yada bu barkod fiş içerisinde bulunamadı."
      );
      return;
    }

    if (
      EasyReturnService.erCurrentFiche === undefined ||
      EasyReturnService.erCurrentFiche === null ||
      EasyReturnService.erCurrentFiche.data.findIndex(
        (x) => x.barcode === barcode && x.aiuAcceptedQuantity > 0
      ) < 0
    ) {
      MessageBoxNew.show(
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

    EasyReturnService.erSelectedReturnProducts = tempBarcodeList;
  };

  const [showPopup, setShowPopup] = useState(false);
  const [popupItem, setPopupItem] = useState("");
  const [popupType, setPopupType] = useState(1);
  const [popupMaxQuantity, setMaxQuantityPopup] = useState(1);
  const [customerPhone, setCustomerPhone] = useState(
    EasyReturnService.erCurrentFiche?.customerPhone || "0"
  );
  const [customerNameSurname, setCustomerNameSurname] = useState<any>();
  const GetQuantityPopup = (maxQuantity: number) => {
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
            EasyReturnService.erSelectedReturnProducts = temp;
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
  return (
    <View style={styles.container}>
      <FloHeader
        headerType="standart"
        headerTitle="Ürün Listesi"
        enableButtons={["back"]}
      />
      <ScrollView>
        <Observer>
          {() => {
            let data = EasyReturnService.erCurrentFiche;
            if (data === undefined || data === null) return null;

            return (
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
                <InfoMessage />
                <QrSearchBar
                  onSearch={(barcode: string) => PushBarcode(barcode)}
                />
                <FlatList
                  style={{ marginTop: 20, paddingTop: 10 }}
                  data={data.data.filter((x) =>
                    EasyReturnService.erSelectedReturnProducts
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
                            Dimensions.get("window").width -
                            PerfectPixelSize(40),
                          marginHorizontal: PerfectPixelSize(20),
                          marginBottom: PerfectPixelSize(20),
                        }}
                        onPress={() => {
                          setSelectedCombo([]);
                          EasyReturnService.erSelectedReturnProducts = [];
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
                          EasyReturnService.erSelectedReturnProducts.find(
                            (x) => x.barcode === item.barcode
                          )?.combo?.name
                        }
                        selQuantity={
                          EasyReturnService.erSelectedReturnProducts.find(
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
                    {EasyReturnService.erSelectedReturnProducts.length} Ürün ile
                    devam Edilecek
                  </AppText>
                  <AppButton
                    disabled={
                      EasyReturnService.erSelectedReturnProducts.length === 0
                    }
                    onPress={() => {
                      setPopupType(3);
                      setShowPopup(true);
                    }}
                    loading={EasyReturnService.isLoading}
                    buttonColorType={
                      EasyReturnService.erSelectedReturnProducts.length === 0
                        ? ColorType.Gray
                        : ColorType.Brand
                    }
                    title="Devam Et"
                  />
                </View>
              </>
            );
          }}
        </Observer>
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
          <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
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
                  data={ApplicationGlobalService.allEasyReturnReasons.filter(
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
                        EasyReturnService.erSelectedReturnProducts = temp;
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
                        MessageBoxNew.show("Müşteri Ad Soyad boş geçilemez");
                        return;
                      }
                      if (removePhoneMask(customerPhone) === "") {
                        MessageBoxNew.show("Telefon numarası boş geçilemez");
                        return;
                      }

                      EasyReturnService.ErMakeTransaction(
                        removePhoneMask(customerPhone),
                        customerNameSurname,
                        true
                      ).then(() => {
                        EasyReturnService.sentValidationSms(
                          "0" + removePhoneMask(customerPhone)
                        ).then((res) => {
                          if (res) {
                            MessageBox.Show(
                              "",
                              MessageBoxDetailType.Danger,
                              MessageBoxType.SmsValidation,
                              () => {},
                              () => {},
                              (validationCode) => {
                                EasyReturnService.validateSms(validationCode);
                              },
                              // resend
                              () => {
                                EasyReturnService.sentValidationSms(
                                  "0" + removePhoneMask(customerPhone)
                                );
                              }
                            );
                          }
                        });
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

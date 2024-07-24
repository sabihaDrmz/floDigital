import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import BlurView from "../../components/BlurView";
import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { FontAwesome } from "@expo/vector-icons";
import { SearchQR } from "../../components/CustomIcons/MainPageIcons";
import { FloHeader } from "../../components/Header";
import AppCardColorizeSVG from "../../components/AppColorizeSvg";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
import MainCamera from "../../components/MainCamera";

const ReturnProductFichePaymentResult: React.FC = () => {
  const { erSelectedReturnProducts, erCurrentFiche, selectedPaymentTypes, isLoading, returnCommit, printDoc } = useEasyReturnService();
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [name, setName] = useState(""),
    [tckn, setTckn] = useState(""),
    [description, setDescription] = useState(""),
    [rfdm, setRfdm] = useState(""),
    [showPrintDocPopup, setShowPrintDocPopup] = useState(false),
    [completeEnable, setCompleteEnable] = useState(false);


  const selectedBarcodes = erSelectedReturnProducts.map(
    (x) => x.barcode
  ),
    totalPrice = erCurrentFiche?.data
      .filter((x) => selectedBarcodes.includes(x.barcode))
      .reduce(
        (a, b) =>
          a +
          Number(b.returnPrice) *
          // @ts-ignore
          erSelectedReturnProducts.find(
            (x) => b.barcode === x.barcode
          )?.quantit,
        0
      );

  let remainderPrice: number =
    (totalPrice || 0) -
    selectedPaymentTypes.reduce((x, y) => x + y.price, 0);

  const selectPaymentType = (paymentType: any) => {
    if (paymentType) {
      let pt = selectedPaymentTypes.find(
        (x) => x.type === paymentType.key
      );

      if (pt) {
        let index = selectedPaymentTypes.findIndex(
          (x) => x.type === paymentType.key
        );
        selectedPaymentTypes.splice(index, 1);
      } else {
        selectedPaymentTypes.push({
          type: paymentType.key,
          price:
            paymentType.value > remainderPrice
              ? remainderPrice
              : paymentType.value,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <FloHeader headerType="standart" enableButtons={["back"]} />
      <View style={{ padding: 20 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 25,
          }}
        >
          <AppText style={{ fontSize: 15, marginTop: 20 }}>
            İade edilecek toplam tutar
          </AppText>
          <AppText
            selectable
            labelColorType={ColorType.Brand}
            style={{ fontFamily: "Poppins_600SemiBold", fontSize: 18 }}
          >
            {totalPrice}
          </AppText>
        </View>
        <AppText style={{ fontFamily: "Poppins_500Medium", fontSize: 15 }}>
          İade Yöntemi Seçin
        </AppText>
        <View
          style={{
            height: 1,
            marginVertical: 15,
            backgroundColor: "#e4e4e4",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
        {erCurrentFiche?.odeme.map((x) => {
          return (
            <AppButton
              transparent
              disabled={
                remainderPrice === 0 &&
                selectedPaymentTypes.find(
                  (y) => y.type === x.key
                ) === undefined
              }
              onPress={() => selectPaymentType(x)}
              style={{
                justifyContent: "flex-start",
                paddingVertical: 5,
                marginTop: -15,
              }}
            >
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 5,
                  backgroundColor: AppColor.OMS.Background.Success,
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectedPaymentTypes.find(
                  (y) => y.type === x.key
                ) && <FontAwesome size={20} color={"#fff"} name={"check"} />}
              </View>
              <AppText selectable style={{ color: "rgb(103,103,103)" }}>
                {x.description} (
                {selectedPaymentTypes
                  .find((y) => y.type === x.key)
                  ?.price.toFixed(2) ||
                  Number(
                    x.value > remainderPrice ? remainderPrice : x.value
                  ).toFixed(2)}
                )
              </AppText>
            </AppButton>
          );
        })}
        <View style={{ alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_500Medium" }}>
              Toplam :{" "}
            </AppText>
            <AppText
              selectable
              style={{ fontFamily: "Poppins_600SemiBold", fontSize: 15 }}
            >
              {totalPrice}
            </AppText>
          </View>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_500Medium" }}>
              Kalan :{" "}
            </AppText>
            <AppText
              selectable
              style={{ fontFamily: "Poppins_600SemiBold", fontSize: 15 }}
            >
              {remainderPrice === undefined ||
                remainderPrice === null ||
                remainderPrice === 0
                ? "0.00"
                : remainderPrice.toFixed(2)}
            </AppText>
          </View>
        </View>
        <View style={{ marginTop: 50 }}>
          <AppButton
            loading={isLoading}
            disabled={remainderPrice > 0}
            onPress={() => {
              setShowPrintDocPopup(true);
            }}
            buttonColorType={remainderPrice > 0 ? undefined : ColorType.Brand}
            title="Gider Pusulası Bas"
          />
          <AppButton
            disabled={!completeEnable}
            loading={isLoading}
            buttonColorType={
              completeEnable === false ? undefined : ColorType.Brand
            }
            onPress={() => returnCommit()}
            title="İadeyi Tamamla"
          />
        </View>
      </View>
      {showPrintDocPopup && (
        <BlurView
          style={{
            flex: 1,
            position: "absolute",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                minHeight: 100,
                borderRadius: 10,
              }}
            >
              <View style={{ position: "absolute", right: 20, top: 20 }}>
                <AppButton
                  onPress={() => {
                    setShowPrintDocPopup(false);
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#c6c9cc",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="close" color={"white"} size={25} />
                </AppButton>
              </View>
              <View style={{ position: "absolute" }}>
                <AppCardColorizeSVG color={AppColor.FD.Brand.Solid} />
              </View>
              <KeyboardAwareScrollView>
                <View
                  style={{ marginLeft: 30, marginTop: 40, marginBottom: 20 }}
                >
                  <View style={{ width: Dimensions.get("window").width - 100 }}>
                    <AppText style={styles.fm}>Müşteri Adı</AppText>
                    <AppTextBox value={name} onChangeText={setName} />
                  </View>
                  <View style={{ width: Dimensions.get("window").width - 100 }}>
                    <AppText style={styles.fm}>
                      Müşteri TCKN / Müşteri VKN
                    </AppText>
                    <AppTextBox
                      maxLength={11}
                      value={tckn}
                      onChangeText={setTckn}
                      keyboardType={"number-pad"}
                    />
                  </View>
                  <View style={{ width: Dimensions.get("window").width - 100 }}>
                    <AppText style={styles.fm}>Müşteri Adresi</AppText>
                    <AppTextBox
                      value={description}
                      onChangeText={setDescription}
                      multiline
                    />
                  </View>
                  <View
                    style={{
                      width: Dimensions.get("window").width - 100,
                      marginTop: 10,
                    }}
                  >
                    <AppText style={styles.fm}>RFDM No</AppText>
                    <TextInput
                      maxLength={20}
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        height: 40,
                        paddingHorizontal: 10,
                        borderColor: "rgb(206,202,202)",
                      }}
                      value={rfdm}
                      onChangeText={setRfdm}
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: -40,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          if (!rfdm) setIsCameraShow(true);

                          setRfdm("");
                        }}
                        style={[
                          {
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,

                            elevation: 5,
                          },
                        ]}
                      >
                        <SearchQR />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      width: Dimensions.get("window").width - 100,
                      marginTop: 30,
                    }}
                  >
                    <AppButton
                      onPress={() => {
                        printDoc(
                          name,
                          tckn,
                          description,
                          rfdm,
                          selectedPaymentTypes.map((x) => {
                            let pType =
                              erCurrentFiche?.odeme.find(
                                (y) => x.type === y.key
                              );

                            return {
                              key: x.type,
                              value: x.price.toFixed(2),
                              description: pType.description,
                            };
                          })
                        ).then((res) => {
                          if (res) {
                            setCompleteEnable(true);
                          }
                          setShowPrintDocPopup(false);
                        });
                      }}
                      title="Tamamla"
                      buttonColorType={ColorType.Brand}
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
        </BlurView>
      )}

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          setRfdm(barcode);
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />
    </View>
  );
};
export default ReturnProductFichePaymentResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fm: {
    fontFamily: "Poppins_500Medium",
    marginVertical: 10,
  },
});

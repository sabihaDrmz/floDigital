import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useProductService } from "../../contexts/ProductService";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";
import {
  PerfectFontSize,
  PerfectPixelSize,
} from "../../helper/PerfectPixel";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { ToImageCdnUri } from "../../helper/ImageCdnExtensions";
import { useMessageBoxService, } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import AppTextBox, {
  TextManipulator,
} from "../../NewComponents/FormElements/AppTextBox";
import MainCamera from "../../components/MainCamera";
const { width, height } = Dimensions.get("window");
const ProductQrPreview: React.FC<any> = (props) => {
  const [isCameraShow, setIsCameraShow] = useState(false);
  const { product, kzQrCode, approveQrCode, kzQrCodeId, getQrCode, findKzQrCodeWithQrCode, findQrCode } = useProductService();
  const { selectedPrinter, printerConfig, printKzkQrCode } = usePrinterConfigService();
  const productData = product?.product;
  const { show } = useMessageBoxService();

  const [selectedRadio, setSelectedRadio] = useState<1 | 2 | 3 | 4>();
  const [openQrPopup, setOpenQrPopup] = useState(false);
  const [qrResult, setQrResult] = useState<boolean>();
  const [searchId, setSearchId] = useState<string>();
  const [isResidualWithMaterial, setIsResidualWithMaterial] = useState(false);
  const [residualSearch, setResidualSearch] = useState(productData!.barcode);
  const closePopup = () => {
    setSelectedRadio(undefined);
    setOpenQrPopup(false);
    setQrResult(undefined);
    setSearchId(undefined);
  };

  const choseRadio = (radio: any) => {
    setSelectedRadio(radio);
    setOpenQrPopup(true);
    setQrResult(undefined);
    setSearchId(undefined);
  };

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={" "}
        showLogo
      />
      <View style={{ flex: 1 }}>
        {product && (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              padding: 20,
              borderWidth: 0,
              borderBottomWidth: 2,
              borderColor: "rgb(228,228,228)",
            }}
          >
            {productData.images && productData.images.indexOf("flo-logo.svg") ? (
              <Image
                source={require("../../../assets/ruNoImage.png")}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 14,
                }}
              />
            ) : (
              <Image
                source={ToImageCdnUri(productData.images[0], 100, 100)}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 14,
                }}
              />
            )}

            <View style={styles.productHeaderProductInfo}>
              <Text style={styles.productHeaderProductTitle}>
                {productData.brand}
              </Text>
              <Text style={styles.productHeaderProductDescription}>
                {productData.name}
              </Text>
              <Text style={styles.productHeaderProductDescription}>
                {productData.color} | {productData.size}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderWidth: 0,
            borderBottomWidth: 2,
            borderColor: "rgb(228,228,228)",
          }}
          onPress={() => {
            choseRadio(1);
          }}
        >
          <AppText
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: "#707070",
              fontSize: PerfectFontSize(13),
              fontStyle: "normal",
              lineHeight: PerfectFontSize(26),
              letterSpacing: 0.7,
            }}
          >
            Остаток
          </AppText>
          <View
            style={{
              width: PerfectPixelSize(20),
              height: PerfectPixelSize(20),
              marginTop: "1%",
              borderRadius: 10,
              backgroundColor: selectedRadio === 1 ? "#ff8600" : "#fff",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: selectedRadio === 1 ? "#000" : "#ff8600",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderWidth: 0,
            borderBottomWidth: 2,
            borderColor: "rgb(228,228,228)",
          }}
          onPress={() => {
            choseRadio(2);
          }}
        >
          <AppText
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: "#707070",
              fontSize: PerfectFontSize(13),
              fontStyle: "normal",
              lineHeight: PerfectFontSize(26),
              letterSpacing: 0.7,
            }}
          >
            Распечатать QR-этикетку
          </AppText>
          <View
            style={{
              width: PerfectPixelSize(20),
              height: PerfectPixelSize(20),
              marginTop: "1%",
              borderRadius: 10,
              backgroundColor: selectedRadio === 2 ? "#ff8600" : "#fff",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: selectedRadio === 2 ? "#000" : "#ff8600",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderWidth: 0,
            borderBottomWidth: 2,
            borderColor: "rgb(228,228,228)",
          }}
          onPress={() => {
            choseRadio(3);
          }}
        >
          <AppText
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: "#707070",
              fontSize: PerfectFontSize(13),
              fontStyle: "normal",
              lineHeight: PerfectFontSize(26),
              letterSpacing: 0.7,
            }}
          >
            Печать этикеток для возвратного товара
          </AppText>
          <View
            style={{
              width: PerfectPixelSize(20),
              height: PerfectPixelSize(20),
              marginTop: "1%",
              borderRadius: 10,
              backgroundColor: selectedRadio === 3 ? "#ff8600" : "#fff",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: selectedRadio === 3 ? "#000" : "#ff8600",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderWidth: 0,
            borderBottomWidth: 2,
            borderColor: "rgb(228,228,228)",
          }}
          onPress={() => {
            choseRadio(4);
          }}
        >
          <AppText
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: "#707070",
              fontSize: PerfectFontSize(13),
              fontStyle: "normal",
              lineHeight: PerfectFontSize(26),
              letterSpacing: 0.7,
            }}
          >
            Распечатать этикетку для изменения цены
          </AppText>
          <View
            style={{
              width: PerfectPixelSize(20),
              height: PerfectPixelSize(20),
              marginTop: "1%",
              borderRadius: 10,
              backgroundColor: selectedRadio === 4 ? "#ff8600" : "#fff",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: selectedRadio === 4 ? "#000" : "#ff8600",
            }}
          />
        </TouchableOpacity>

        {selectedRadio === 1 && (
          <View style={{ margin: 20 }}>
            {qrResult && (
              <View style={{ flexDirection: "row" }}>
                <MaterialIcons
                  name="qr-code-2"
                  size={50}
                  color={"#ff8600"}
                  style={{ marginRight: 5 }}
                />
                <View style={{ justifyContent: "center" }}>
                  <AppText
                    style={{ fontSize: PerfectFontSize(15) }}
                    labelColorType={ColorType.Brand}
                  >
                    QR создан
                  </AppText>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign
                      name={"infocirlceo"}
                      size={14}
                      color={"#7D7E81"}
                      style={{
                        marginRight: 3,
                      }}
                    />

                    <AppText
                      style={{
                        fontSize: PerfectFontSize(15),
                        color: "#7D7E81",
                      }}
                    >
                      Осталось {kzQrCode?.quantity} штук QR
                    </AppText>
                  </View>
                </View>
              </View>
            )}

            {qrResult !== undefined && !qrResult && (
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="qrcode-remove"
                  size={40}
                  color="red"
                  style={{ marginRight: 5 }}
                />
                <View style={{ justifyContent: "center" }}>
                  <AppText
                    style={{ fontSize: PerfectFontSize(15) }}
                    labelColorType={ColorType.Danger}
                  >
                    QR-код не найден
                  </AppText>
                </View>
              </View>
            )}
          </View>
        )}

        {(selectedRadio === 2 ||
          selectedRadio === 3 ||
          selectedRadio === 4) && (
            <View style={{ margin: 20 }}>
              {qrResult && (
                <View style={{ flexDirection: "row" }}>
                  <MaterialIcons
                    name="qr-code-2"
                    size={50}
                    color={"#ff8600"}
                    style={{ marginRight: 5 }}
                  />
                  <View style={{ justifyContent: "center" }}>
                    <AppText
                      style={{ fontSize: PerfectFontSize(15) }}
                      labelColorType={ColorType.Brand}
                    >
                      QR-код найден
                    </AppText>
                  </View>
                </View>
              )}

              {qrResult !== undefined && !qrResult && (
                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="qrcode-remove"
                    size={40}
                    color="red"
                    style={{ marginRight: 5 }}
                  />
                  <View style={{ justifyContent: "center" }}>
                    <AppText
                      style={{ fontSize: PerfectFontSize(15) }}
                      labelColorType={ColorType.Danger}
                    >
                      QR-код не найден
                    </AppText>
                  </View>
                </View>
              )}
            </View>
          )}

        <View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            width: width,
            marginBottom: 30,
          }}
        >
          <AppButton
            title={"Этикетка басып шығар"}
            style={{
              width: width - 70,
            }}
            buttonColorType={
              qrResult === undefined || !qrResult
                ? ColorType.Gray
                : ColorType.Brand
            }
            disabled={qrResult === undefined || !qrResult}
            onPress={() => {
              let printer = selectedPrinter;
              let printerConfigData = printerConfig;
              if (
                printer === undefined ||
                printerConfigData === undefined ||
                Object.keys(printer).length == 0 ||
                Object.keys(printerConfigData).length == 0
              ) {
                show("Пожалуйста, выберите конфигурацию этикетки", {
                  type: MessageBoxType.Standart,
                  yesButtonTitle: "Жақсы",
                  yesButtonEvent: () => { },
                });
                return;
              }

              if (selectedRadio === 1) {
                approveQrCode().then((res: number) => {
                  if (res !== -1) {
                    show("QR этикетка сақталды", {
                      type: MessageBoxType.Standart,
                      yesButtonTitle: "Жақсы",
                      yesButtonEvent: () => {
                        closePopup();
                      },
                    });
                    printKzkQrCode(res);
                  }
                });
              } else if (
                selectedRadio === 2 ||
                selectedRadio === 3 ||
                selectedRadio === 4
              ) {
                printKzkQrCode(kzQrCodeId);
                closePopup();
              }
            }}
          />
        </View>
      </View>

      {openQrPopup && (
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
              padding: 20,
              backgroundColor: "rgba(52, 52, 52, 0.8)",
            }}
          >
            <View
              style={{
                minHeight: 100,
                backgroundColor: "#fff",
                borderRadius: 10,
                paddingVertical: 40,
                paddingHorizontal: 20,
                opacity: 1,
              }}
            >
              {selectedRadio === 1 ? (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name="qr-code-2"
                      size={35}
                      color={"#ff8600"}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText
                      style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: PerfectFontSize(15),
                        fontStyle: "normal",
                        lineHeight: PerfectFontSize(27),
                      }}
                    >
                      Вы уверены, что хотите создать QR?
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 10,
                      marginTop: 5,
                      marginBottom: isResidualWithMaterial ? 0 : 10,
                    }}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => {
                        setIsResidualWithMaterial(false);
                        setResidualSearch(productData!.barcode);
                      }}
                    >
                      <AppText
                        style={{
                          fontFamily: "Poppins_600SemiBold",
                          color: "#707070",
                          marginRight: 5,
                          fontSize: PerfectFontSize(13),
                        }}
                      >
                        Со штрих-кодом
                      </AppText>
                      <View
                        style={{
                          width: 21,
                          height: 21,
                          borderRadius: 10.5,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: "#ff8600",
                        }}
                      >
                        <View
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 7.5,
                            backgroundColor: !isResidualWithMaterial
                              ? "#ff8600"
                              : "#fff",
                          }}
                        ></View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => {
                        setIsResidualWithMaterial(true);
                        setResidualSearch("");
                      }}
                    >
                      <AppText
                        style={{
                          fontFamily: "Poppins_600SemiBold",
                          color: "#707070",
                          marginRight: 5,
                          fontSize: PerfectFontSize(13),
                        }}
                      >
                        По номеру малземе
                      </AppText>
                      <View
                        style={{
                          width: 21,
                          height: 21,
                          borderRadius: 10.5,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: "#ff8600",
                        }}
                      >
                        <View
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 7.5,
                            backgroundColor: isResidualWithMaterial
                              ? "#ff8600"
                              : "#fff",
                          }}
                        ></View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {isResidualWithMaterial && (
                    <FloTextBoxNew
                      placeholder={"Материал номер"}
                      keyboardType={"number-pad"}
                      value={residualSearch}
                      maxLength={15}
                      onChangeText={(txt) =>
                        setResidualSearch(TextManipulator(txt, "onlyNumber"))
                      }
                    />
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <AppButton
                      title="Да"
                      buttonColorType={ColorType.Brand}
                      style={{ flex: 1, margin: 3 }}
                      onPress={() => {
                        if (
                          !isResidualWithMaterial &&
                          productData!.barcode.startsWith("20")
                        ) {
                          show(
                            "Пожалуйста, сделайте поиск  по номеру малземе"
                          );
                          return;
                        }

                        if (
                          residualSearch === undefined ||
                          residualSearch === null ||
                          residualSearch === ""
                        ) {
                          show(
                            isResidualWithMaterial
                              ? "Пожалуйста, введите номер малземе"
                              : "Пожалуйста, введите штрих-код"
                          );
                          return;
                        }

                        getQrCode(
                          true,
                          isResidualWithMaterial,
                          residualSearch
                        ).then((res) => {
                          setOpenQrPopup(false);
                          res ? setQrResult(true) : setQrResult(false);
                        });
                      }}
                    />
                    <AppButton
                      title="Нет"
                      buttonColorType={ColorType.Danger}
                      style={{ flex: 1, margin: 3 }}
                      onPress={() => {
                        closePopup();
                      }}
                    />
                  </View>
                </View>
              ) : selectedRadio === 2 ? (
                <View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText
                      style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: PerfectFontSize(14),
                        fontStyle: "normal",
                        lineHeight: PerfectFontSize(20),
                        marginBottom: 5,
                      }}
                    >
                      Напишите QR-ID на этикетке
                    </AppText>
                  </View>
                  <AppTextBox
                    placeholder={"Введите QR-ID"}
                    keyboardType={"number-pad"}
                    onChangeText={setSearchId}
                    maxLength={6}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <AppButton
                      title="Да"
                      buttonColorType={ColorType.Brand}
                      style={{ flex: 1, marginRight: 3 }}
                      onPress={() => {
                        if (!searchId || searchId === "") {
                          show("Пожалуйста, введите QR-ID");
                          return;
                        }

                        findQrCode(parseInt(searchId)).then(
                          (res) => {
                            setOpenQrPopup(false);
                            res ? setQrResult(true) : setQrResult(false);
                          }
                        );
                      }}
                    />
                    <AppButton
                      title="Нет"
                      buttonColorType={ColorType.Danger}
                      style={{ flex: 1, marginLeft: 3 }}
                      onPress={() => {
                        closePopup();
                      }}
                    />
                  </View>
                </View>
              ) : selectedRadio === 3 ? (
                <View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText
                      style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: PerfectFontSize(14),
                        fontStyle: "normal",
                        lineHeight: PerfectFontSize(20),
                        marginBottom: 5,
                      }}
                    >
                      Вы уверены, что хотите распечатать возвратные этикетки?
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <AppButton
                      title="Да"
                      buttonColorType={ColorType.Brand}
                      style={{ flex: 1, marginRight: 3 }}
                      onPress={() => {
                        getQrCode(false, false, "").then(
                          (res) => {
                            setOpenQrPopup(false);
                            res ? setQrResult(true) : setQrResult(false);
                          }
                        );
                      }}
                    />
                    <AppButton
                      title="Нет"
                      buttonColorType={ColorType.Danger}
                      style={{ flex: 1, marginLeft: 3 }}
                      onPress={() => {
                        closePopup();
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        fontWeight: "600",
                        marginBottom: 20,
                      }}
                    >
                      Отсканируйте QR, чтобы обновить цену
                    </AppText>
                    <TouchableOpacity
                      onPress={() => setIsCameraShow(true)}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 0,
                        marginBottom: PerfectPixelSize(30),
                      }}
                    >
                      <Image
                        source={require("../../../assets/S.png")}
                        style={{
                          width: PerfectPixelSize(112),
                          height: PerfectPixelSize(103),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <AppButton
                      title="сдаться"
                      buttonColorType={ColorType.Danger}
                      style={{ flex: 1 }}
                      onPress={() => {
                        closePopup();
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </BlurView>
      )}

      <MainCamera
        isShow={isCameraShow}
        isKazakistan={true}
        onReadComplete={(barcode) => {
          findKzQrCodeWithQrCode(barcode as string).then(
            (res) => {
              setOpenQrPopup(false);
              res ? setQrResult(true) : setQrResult(false);
            }
          );
          setIsCameraShow(false);
        }}
        onHide={() => {
          setIsCameraShow(false);
          setOpenQrPopup(false);
        }}
      />
    </View>
  );
};
export default ProductQrPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {},
  productHeaderProductInfo: {
    width: 150,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  productHeaderProductTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(15),
  },
  productHeaderProductDescription: {
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(14),
  },
});

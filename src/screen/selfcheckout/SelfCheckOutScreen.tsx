import {
  AppButton,
  AppCheckBox,
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import BlurView from "../../components/BlurView";
import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
  Image,
  ScrollView
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useSelfCheckOutService } from "../../contexts/SelfCheckOutService";
import {
  PerfectFontSize,
  PerfectPixelSize,
} from "../../helper/PerfectPixel";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import BarcodeSearchBar from "../../components/Oms/partials/BarcodeSearchBar";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const SelfCheckOutScreen = ({ }: any) => {
  const navigation = useNavigation();
  const { show } = useMessageBoxService();
  const { selfCheckOut, isLoading, approve, reject } = useSelfCheckOutService();
  const { showFullScreenImage } = useApplicationGlobalService();
  const STORE_COLOR = "#41A563";
  const [showResult, setShowResult] = React.useState(false);
  const [result, setResult] = React.useState(false);
  const [readedBarcodeList, setReadedBarcodeList] = React.useState<{ barcode: string, quantity: number }[]>([]);
  const [loadingResult, setLoadingResult] = React.useState(false);

  const readBarcode = (barcode: string) => {
    var findBasket = selfCheckOut?.orderInfo.list.find(x => x.barcode === barcode);
    if (findBasket) {
      var findBarcode = readedBarcodeList.find(x => x.barcode === barcode);
      if (findBarcode) {
        if (findBasket.rowQty === findBarcode.quantity) {
          show("Bu ürünü daha önce okuttunuz");
        } else {
          const updatedList = readedBarcodeList.map((item: any) => {
            //@ts-ignore
            if (item.barcode === findBarcode.barcode) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          });
          setReadedBarcodeList(updatedList);
        }
      }
      else {
        setReadedBarcodeList([...readedBarcodeList, { barcode: barcode, quantity: 1 }]);
        if (findBasket.rowQty > 1) {
          show(`Sepette okuttuğunuz üründen ${findBasket.rowQty} adet istenmektedir`);
        }
      }
    }
    else
      show("Okuttuğunuz ürün sepette bulunamadı");
  }

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={" "}
        showLogo
      />

      <View
        style={{
          backgroundColor: "#fff",
          flexDirection: "row",
          padding: 20,
        }}
      >
        <AppText
          style={{
            fontFamily: "Poppins_600SemiBold",
            color: "#000",
          }}
        >
          Müşteri Adı ve Soyadı :
        </AppText>
        <AppText style={{ fontFamily: "Poppins_400Regular", paddingLeft: 5 }}>
          {selfCheckOut?.customerInfo.name +
            " " +
            selfCheckOut?.customerInfo.surname}
        </AppText>
      </View>
      <View style={{
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderColor: "#cecece",
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
      }}>
        <BarcodeSearchBar
          onSearch={readBarcode}
        />
      </View>
      <ScrollView>
        {selfCheckOut?.orderInfo.list.map((item, index) => (
          <View
            style={{
              borderBottomColor: "#cecece",
              borderBottomWidth: 1,
              padding: 20,
              backgroundColor: "#fff",
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  showFullScreenImage(item.image)
                }
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: PerfectPixelSize(100),
                    height: PerfectPixelSize(100),
                    borderRadius: 14,
                    borderColor: STORE_COLOR,
                    borderWidth: 3,
                  }}
                  resizeMode="center"
                />
                <View style={styles.checkboxContainer}>
                  <AppCheckBox disabled checked={readedBarcodeList.some(x => x.barcode === item.barcode && x.quantity === item.rowQty)} />
                </View>
              </TouchableOpacity>
              <View style={{ marginHorizontal: 30 }}>
                <AppText
                  style={{
                    fontSize: PerfectFontSize(14),
                    fontWeight: "700",
                    color: "#000",
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  {item?.brand ? item.brand.toUpperCase() : ""}
                </AppText>
                <AppText
                  style={{
                    fontSize: PerfectFontSize(14),
                    fontFamily: "Poppins_400Regular",
                  }}
                  selectable
                >
                  {item.barcode}
                </AppText>
                <AppText
                  style={{
                    fontSize: PerfectFontSize(14),
                    fontFamily: "Poppins_400Regular",
                  }}
                  selectable
                >
                  {item.sku}
                </AppText>
                <AppText
                  style={{
                    fontSize: PerfectFontSize(13),
                    fontFamily: "Poppins_400Regular",
                    width: width / 2,
                  }}
                >
                  {item?.name ? item.name.toUpperCase() : ""}
                </AppText>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <AppText style={{ fontFamily: "Poppins_400Regular" }}>
                    Renk :{" "}
                  </AppText>
                  <AppText
                    style={{
                      color: "#000",
                      fontSize: PerfectFontSize(13),
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    {item.color}
                  </AppText>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <AppText style={{ fontFamily: "Poppins_400Regular" }}>
                    Beden :{" "}
                  </AppText>
                  <AppText
                    style={{
                      color: "#000",
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: PerfectFontSize(13),
                    }}
                  >
                    {item.size}
                  </AppText>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <AppText style={{ fontFamily: "Poppins_400Regular" }}>
                    Adet :{" "}
                  </AppText>
                  <AppText
                    style={{
                      color: "#000",
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: PerfectFontSize(13),
                    }}
                  >
                    {item.rowQty}
                  </AppText>
                </View>
                <AppText
                  style={{
                    color: "#ff8600",
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: PerfectFontSize(20),
                  }}
                >
                  {item.rowTotal} ₺
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            paddingTop: 10,
            paddingLeft: 20,
          }}
        >
          <AppText style={{ fontFamily: "Poppins_400Regular" }}>
            Toplam Ürün Adedi :
          </AppText>
          <AppText
            style={{
              paddingLeft: 5,
              color: "#000",
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            {selfCheckOut?.orderInfo.totalQty}
          </AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            paddingTop: 10,
            paddingRight: 20,
          }}
        >
          <AppText
            style={{
              fontFamily: "Poppins_400Regular",
            }}
          >
            Toplam Fiyat :
          </AppText>
          <AppText
            style={{
              paddingHorizontal: 5,
              fontFamily: "Poppins_600SemiBold",
              color: "#000",
            }}
          >
            {selfCheckOut?.orderInfo.total}
          </AppText>
        </View>
      </View>
      <View
        style={{
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        <AppButton
          onPress={() => {
            setLoadingResult(true);
            approve().then((res) => {
              if (res) {
                setShowResult(true);
                setResult(true);
              }
            });
          }}
          loading={isLoading && loadingResult}
          buttonColorType={selfCheckOut?.orderInfo.totalQty !== readedBarcodeList.reduce((total, item) => total + item.quantity, 0) ? ColorType.Gray : ColorType.Brand}
          title={"Ürünleri Kontrol Et Ve Onayla"}
          disabled={selfCheckOut?.orderInfo.totalQty !== readedBarcodeList.reduce((total, item) => total + item.quantity, 0) || isLoading}
        />
        <AppButton
          onPress={() => {
            show("Sipariş iptal edilecek emin misiniz?", {
              type: MessageBoxType.YesNo,
              yesButtonEvent: () => {
                setLoadingResult(false);
                reject().then((res) => {
                  if (res) {
                    setShowResult(true);
                    setResult(false);
                  }
                });
              },
            });
          }}
          loading={isLoading && !loadingResult}
          buttonColorType={ColorType.Danger}
          title={"İptal Et"}
          disabled={isLoading}
        />
      </View>

      {showResult && (
        <BlurView
          style={{
            position: "absolute",
            flex: 1,
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
                width: width - 50,
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
              }}
            >
              {result ? (
                <View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <AntDesign name="checkcircle" size={40} color="#ff8600" />
                    <AppText
                      labelColorType={ColorType.Brand}
                      style={{
                        marginVertical: 5,
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: PerfectFontSize(20),
                      }}
                    >
                      Teşekkürler
                    </AppText>

                    <AppText
                      labelType={LabelType.Label}
                      style={{
                        fontWeight: "500",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "center",
                        color: "#6f6f6f",
                      }}
                    >
                      İşlem başarıyla tamamlanmıştır
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      padding: PerfectPixelSize(2),
                      paddingTop: PerfectPixelSize(30),
                    }}
                  >
                    <AppText
                      style={{
                        borderColor: "#ff8600",
                        borderWidth: 1,
                        height: PerfectPixelSize(24),
                        width: PerfectPixelSize(24),
                        borderRadius: PerfectPixelSize(12),
                        color: "#ff8600",
                        textAlign: "center",
                      }}
                    >
                      1
                    </AppText>
                    <AppText
                      labelType={LabelType.Label}
                      style={{
                        fontWeight: "500",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        fontSize: PerfectFontSize(13),
                        marginLeft: 5,
                      }}
                    >
                      Lütfen ürün üzerinde bulunan alarmları sökünüz
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      padding: PerfectPixelSize(2),
                      paddingTop: PerfectPixelSize(15),
                      paddingBottom: PerfectPixelSize(30),
                    }}
                  >
                    <AppText
                      style={{
                        borderColor: "#ff8600",
                        borderWidth: 1,
                        height: PerfectPixelSize(24),
                        width: PerfectPixelSize(24),
                        borderRadius: PerfectPixelSize(12),
                        color: "#ff8600",
                        textAlign: "center",
                      }}
                    >
                      2
                    </AppText>
                    <AppText
                      labelType={LabelType.Label}
                      style={{
                        fontWeight: "500",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        fontSize: PerfectFontSize(13),
                        marginLeft: 5,
                      }}
                    >
                      Ürünü kontrol edin ve talebe göre bez poşete koyup
                      müşteriye teslim ediniz
                    </AppText>
                  </View>
                </View>
              ) : (
                <View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <FontAwesome
                      name="times-circle"
                      size={40}
                      color="#D10D0D"
                    />
                    <AppText
                      labelColorType={ColorType.Danger}
                      style={{
                        marginVertical: 5,
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: PerfectFontSize(20),
                      }}
                    >
                      Sipariş İptal Edilmiştir
                    </AppText>

                    <AppText
                      labelType={LabelType.Label}
                      style={{
                        fontWeight: "500",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        fontSize: PerfectFontSize(14),
                        marginVertical: PerfectPixelSize(25),
                        textAlign: "center",
                      }}
                    >
                      Sipariş iptal edilmiştir. Ücret iadeniz kartınıza
                      yapılmıştır.
                    </AppText>
                  </View>
                </View>
              )}
              <AppButton
                buttonColorType={ColorType.Brand}
                title={"Ana Sayfaya Dön"}
                onPress={() => navigation.navigate("Home" as never)}
              />
            </View>
          </View>
        </BlurView>
      )}
    </View>
  );
};

export default SelfCheckOutScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  productHeaderImageContainer: {
    borderColor: "#41A563",
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 5,
    marginRight: 20,
  },
  productHeaderImageContainerIconContainer: {
    width: 43,
    height: 43,
    borderRadius: 43 / 2,
    backgroundColor: "#41A563",
    position: "absolute",
    top: -19,
    right: -19,
    justifyContent: "center",
    alignItems: "center",
  },
  productHeaderProductInfo: {
    width: width - (72 * 2 + 20),
    justifyContent: "center",
  },
  productHeaderProductTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(15),
  },
  productHeaderProductDescription: {
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(14),
  },
  checkboxContainer: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    top: -20,
    right: -10,
  },
});

import BlurView from "../../components/BlurView";
import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import Svg, { Path, SvgXml } from "react-native-svg";
//TODO: EXPO exPrint
// import * as exPrint from "expo-print";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { useMediaSelector } from "../../components/MediaSelector/MediaSelector";
//TODO: EXPO expo-image-picker
// import { ImageInfo } from "expo-image-picker";
import { translate } from "../../helper/localization/locaizationMain";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import FloLoading from "../../components/FloLoading";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { MenuIcon } from "../../components/Oms/partials/ReaseonRadios";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { Portal } from "react-native-portalize";
//@ts-ignore
import { Base64 } from "js-base64";
import { colors } from "../../theme/colors";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
import { useAccountService } from "../../contexts/AccountService";
import { useNavigation } from "@react-navigation/native";


const BrokenComplete: React.FC = ({ }: any) => {
  const navigation = useNavigation();
  const [showPopup, setShowPopup] = useState(false);
  const [showSubGroup, setShowSubGroup] = useState(false);
  const [description, setDescription] = useState("");
  const [productGroup, setProductGroup] = useState<any>();
  const [productSubGroup, setProductSubGroup] = useState<any>();
  const [images, setImages] = useState<any>([]);
  const [loadingStart, setLoadingStart] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [showGeniusResult, setShowGeniusResult] = useState(false);
  const [storeChiefChk, setStoreChiefChk] = useState<boolean>();
  const [sapAIApprove, setSapAIApprove] = useState(false);
  const { medias, setMediasData } = useMediaSelector();
  const [showDropdown, setShowDropdown] = useState(false);
  const { getAllProductGroup, getAllProductGroupReasons } = useApplicationGlobalService();
  const { show } = useMessageBoxService();
  const {
    erCurrentFiche,
    erSelectedReturnProducts,
    isBrokenComplete,
    isLoading,
    transaction,
    brokenProductTemplate,
    CleanTransaction,
    BrokenProductComplete,
    setIsBrokenCompleteTrue,
    updateTransactionLineDetail,
    ErFindFicheResult,
    CreateBrokenProductDocument,
    CheckAIState
  } = useEasyReturnService();
  const { isInRole } = useAccountService();
  const comboboxData = [
    {
      value: 1,
      name: "Onay",
    },
    {
      value: 0,
      name: "Red",
    },
  ];

  useEffect(() => {
    getAllProductGroup();
    getAllProductGroupReasons();
  }, []);

  const openDocument = (documentHTML: string) => {
    var w = window.open("", "_blank");
    if (w) {
      w.document.open();
      w.document.write(
        '<html><body onload="window.print()">' + documentHTML + "</body></html>"
      );
      w.document.close();
    }
  };

  const [loadingImages, setLoadingImages] = useState(0);
  const removePicture = (uri: string) => {
    setImages(images.filter((x) => x.uri !== uri));
  };
  const [copyCount, setCopyCount] = useState(1);
  const [AIReturnState, setAIReturnState] = useState(4);

  const product = erCurrentFiche?.data.find(
    (x) => x.barcode === erSelectedReturnProducts[0].barcode
  );

  if (product === undefined) return null;
  let pg = product.productGroupReasonDetails;

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back"]}
        headerTitle="İDES Detaylandırma"
      />

      <KeyboardAwareScrollView scrollEnabled={!showPopup && !showSubGroup}>
        <View>
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 20,
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
              paddingBottom: 20,
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
                paddingLeft: 20,
                flexDirection: "row",
                paddingTop: 20,
              }}
            >
              <Image
                source={{
                  uri: product.picture,
                }}
                style={{ height: 70, width: 70 }}
              />
              <View>
                <AppText
                  selectable
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    maxWidth: "80%",
                  }}
                  numberOfLines={1}
                >
                  {product.productName}
                </AppText>
                <AppText selectable>Beden: {product.size} | Adet : 1</AppText>
                <AppText
                  selectable
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    marginTop: 5,
                  }}
                >
                  Satış Fiyatı : {Number(product.price).toFixed(2)}
                </AppText>
                <AppText
                  selectable
                  labelColorType={ColorType.Brand}
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    marginTop: 5,
                  }}
                >
                  İade Tutarı : {product.returnPrice}
                </AppText>
              </View>
            </View>
          </View>
          <AppText
            style={{
              marginLeft: 40,
              fontFamily: "Poppins_500Medium",
              marginTop: 10,
              marginBottom: -15,
              color: AppColor.FD.Brand.Solid,
            }}
          >
            İDES Grubu
          </AppText>
          <TouchableOpacity
            onPress={() => setShowPopup(true)}
            style={{
              height: 50,
              borderWidth: 1,
              marginHorizontal: 30,
              marginTop: 20,
              borderRadius: 5,
              borderColor: "#c1bdbd",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 20,
              backgroundColor: "#fff",
            }}
          >
            <AppText selectable>{productGroup?.name || "-"}</AppText>
            <View
              style={{
                backgroundColor: "#919191",
                width: 50,
                height: 50,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.7,
              }}
            >
              <MenuIcon />
            </View>
          </TouchableOpacity>
          <AppText
            style={{
              marginLeft: 40,
              fontFamily: "Poppins_500Medium",
              marginTop: 10,
              marginBottom: -15,
              color: AppColor.FD.Brand.Solid,
            }}
          >
            İDES Türü
          </AppText>
          <TouchableOpacity
            onPress={() => setShowSubGroup(true)}
            style={{
              height: 50,
              borderWidth: 1,
              marginHorizontal: 30,
              marginTop: 20,
              borderRadius: 5,
              borderColor: "#c1bdbd",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 20,
              backgroundColor: "#fff",
            }}
          >
            <AppText selectable>{productSubGroup?.name || "-"}</AppText>
            <View
              style={{
                backgroundColor: "#919191",
                width: 50,
                height: 50,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.7,
              }}
            >
              <MenuIcon />
            </View>
          </TouchableOpacity>
          {/* //#region AI State */}
          {AIReturnState === 1 ? (
            <View
              style={{
                marginHorizontal: 30,
                marginVertical: 20,
                flexDirection: "row",
                alignItems: "center",
                maxWidth: 350,
                borderRadius: 27,
                backgroundColor: '#47CA47',
                padding: 5,
              }}
            >
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  backgroundColor: colors.white,
                  borderWidth: 4,
                  borderColor: "#28A128"
                }}
              >
                <FontAwesome5 name="check" size={22} color={"#28A128"} />
              </View>
              <AppText style={{ fontFamily: "Poppins_600SemiBold", fontSize: PerfectFontSize(Platform.OS === 'web' ? 16 : 14), color: colors.white }}>
                Ürünü kasadan iade alabilirsiniz.
              </AppText>
            </View>
          ) : AIReturnState === 2 ? (
            <View
              style={{
                marginHorizontal: 30,
                marginVertical: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: AppColor.FD.Text.Default,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <FontAwesome5 name="info" size={20} color={"#fff"} />
              </View>
              <AppText style={{ fontFamily: "Poppins_500Medium" }}>
                Ürün Kontrolü için incelenmesi gerekmektedir
              </AppText>
            </View>
          ) : AIReturnState === 3 ? (
            <View
              style={{
                marginHorizontal: 30,
                marginVertical: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: AppColor.OMS.Background.OpacityOrange,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <ActivityIndicator color={"white"} />
              </View>
              <AppText
                labelColorType={ColorType.Warning}
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                İade durumu kontrol ediliyor
              </AppText>
            </View>
          ) : null}
          <AppText
            style={{
              marginLeft: 40,
              fontFamily: "Poppins_500Medium",
              marginTop: 10,
              marginBottom: -15,
              color: AppColor.FD.Brand.Solid,
            }}
          >
            İDES Detayı
          </AppText>
          <View
            style={{
              marginHorizontal: 30,
              marginTop: 20,
              backgroundColor: "#fff",
              borderRadius: 8,
            }}
          >
            <AppTextBox
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
          {isInRole("omc-store-chief") && (
            <>
              <AppText
                style={{
                  marginLeft: 40,
                  fontFamily: "Poppins_500Medium",
                  marginTop: 10,
                  marginBottom: -15,
                  color: AppColor.FD.Brand.Solid,
                }}
              >
                Yönetici Kararı
              </AppText>
              <View
                style={{
                  marginHorizontal: 30,
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setShowDropdown(!showDropdown)}
                  style={{
                    borderWidth: 1,
                    borderColor: "#a1a1a1",
                    padding: 10,
                    borderRadius: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    zIndex: 2,
                  }}
                >
                  <AppText style={{ fontFamily: "Poppins_500Medium" }}>
                    {storeChiefChk !== undefined
                      ? storeChiefChk
                        ? comboboxData[0].name
                        : comboboxData[1].name
                      : "Seçiniz"}
                  </AppText>
                  <AntDesign
                    name={showDropdown ? "up" : "down"}
                    size={16}
                    color="#a1a1a1"
                  />
                </TouchableOpacity>
                {showDropdown && (
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderColor: "#a3a3a3",
                      borderRadius: 10,
                      marginTop: -15,
                      zIndex: 1,
                    }}
                  >
                    {comboboxData.map((x, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setShowDropdown(false);
                            setStoreChiefChk(Boolean(x.value));
                          }}
                          style={{
                            paddingTop: index === 0 ? 15 : 0,
                          }}
                        >
                          <AppText
                            style={{
                              fontFamily: "Poppins_500Medium",
                              fontSize: PerfectFontSize(14),
                              fontStyle: "normal",
                              letterSpacing: 0,
                              textAlign: "left",
                              color: "#6f7070",
                              paddingVertical: 10,
                              paddingHorizontal: 15,
                            }}
                          >
                            {x?.name}
                          </AppText>
                          <View
                            style={{
                              borderBottomWidth: index === 0 ? 1 : 0,
                              borderBottomColor: "#a3a3a3",
                              marginHorizontal: 8,
                            }}
                          ></View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </>
          )}

          <View
            style={{
              marginHorizontal: 30,
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {storeChiefChk && (
              <>
                <AntDesign name="checkcircle" size={24} color="#29C735" />
                <View style={{ marginLeft: 10 }}>
                  <AppText
                    style={{
                      color: "#29C735",
                      fontSize: PerfectFontSize(14),
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    Nihai Karar:
                  </AppText>
                  <AppText
                    style={{
                      color: "#29C735",
                      fontSize: PerfectFontSize(14),
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    Ürün iade alınabilir
                  </AppText>
                </View>
              </>
            )}
            {storeChiefChk !== undefined && !storeChiefChk && (
              <>
                <FontAwesome name="times-circle" size={24} color="#DD0A0A" />
                <View style={{ marginLeft: 10 }}>
                  <AppText
                    style={{
                      color: "#DD0A0A",
                      fontSize: PerfectFontSize(14),
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    Nihai Karar:
                  </AppText>
                  <AppText
                    style={{
                      color: "#DD0A0A",
                      fontSize: PerfectFontSize(14),
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    Ürün kontrolü için incelenmesi gerekmektedir
                  </AppText>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={{ paddingHorizontal: 30, marginTop: 30 }}></View>

        <View
          style={{
            paddingHorizontal: 30,
            marginTop: 20,
            paddingBottom: 20,
          }}
        >
          <AppButton
            title={storeChiefChk ? "Tamamla" : "Belge Oluştur"}
            buttonColorType={ColorType.Brand}
            loading={isLoading}
            onPress={() => {
              if (isBrokenComplete) {
                show(
                  "Tekrar İDES Kaydı oluşturamazsınız. Süreci baştan ilerletmelisiniz.",
                  {
                    type: MessageBoxType.Standart,
                    onHide: () => {
                      navigation.goBack();
                      navigation.goBack();
                      CleanTransaction();
                    },
                  }
                );
                return;
              }

              if (
                productSubGroup === undefined ||
                productSubGroup === null ||
                productSubGroup.id === 0 ||
                description === ""
              ) {
                show("Lütfen tüm alanları eksiksiz doldurun.");
                return;
              }

              if (storeChiefChk === undefined || storeChiefChk === null) {
                show("Lütfen Yönetici Kararı Seçiniz");
                return;
              }

              updateTransactionLineDetail(
                0,
                product.barcode,
                productSubGroup.id,
                description,
                storeChiefChk,
                sapAIApprove
              ).then((res) => {
                setLoadingImages(0);
                setLoadingStart(true);

                if (storeChiefChk) {
                  BrokenProductComplete().then(() => {
                    ErFindFicheResult(
                      // @ts-ignore
                      transaction?.ficheNumber,
                      true,
                      true
                    ).then(() => {
                      setIsBrokenCompleteTrue();
                    });

                    setShowGeniusResult(true);
                    // MessageBox.show("Genius üzerinden iade alabilirsiniz.", {
                    //   yesButtonEvent: () => {
                    //     navigation.back();
                    //     navigation.back();
                    //   },
                    // });
                  });
                } else {
                  CreateBrokenProductDocument()
                    .then((res) => {
                      if (res) {
                        setShowCompletePopup(true);
                        setIsBrokenCompleteTrue();
                      }
                    })
                    .finally(() => {
                      setLoadingStart(false);
                    });
                }
              });
            }}
          />
        </View>

        {showPopup && (
          <Portal>
            <BlurView
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                elevation: 5,
                zIndex: 5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  padding: 20,
                  justifyContent: "center",
                  backgroundColor: " rgba(0,0,0,0.5)",
                }}
              >
                <View style={{ marginTop: 3, alignItems: "flex-end" }}>
                  <View style={{ width: 50 }}>
                    <AppButton
                      rounded
                      onPress={() => {
                        setShowPopup(false);
                        setShowSubGroup(false);
                        setProductGroup(undefined);
                      }}
                    >
                      <AntDesign name="close" size={20} color={"white"} />
                    </AppButton>
                  </View>
                </View>
                <View
                  style={{
                    minHeight: 100,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 10,
                    maxHeight: Dimensions.get("window").height / 3,
                    height: Dimensions.get("window").height / 3,
                  }}
                >
                  <FlatList
                    nestedScrollEnabled
                    style={{ marginTop: 10 }}
                    data={product.productGroupReasonDetails}
                    renderItem={({ item }) => (
                      <AppButton
                        onPress={() => {
                          setShowPopup(false);
                          setProductGroup(item);
                          setProductSubGroup(undefined);
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
                    keyExtractor={(x) => x.id?.toString()}
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
                </View>
              </View>
            </BlurView>
          </Portal>
        )}

        {showSubGroup && (
          <Portal>
            <BlurView
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                zIndex: 5,
                elevation: 5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  padding: 20,
                  justifyContent: "center",
                  backgroundColor: " rgba(0,0,0,0.5)",
                }}
              >
                <View style={{ marginTop: 3, alignItems: "flex-end" }}>
                  <View style={{ width: 50 }}>
                    <AppButton
                      rounded
                      onPress={() => {
                        setShowPopup(false);
                        setShowSubGroup(false);
                        setProductSubGroup(undefined);
                      }}
                    >
                      <AntDesign name="close" size={20} color={"white"} />
                    </AppButton>
                  </View>
                </View>
                <View
                  style={{
                    minHeight: 100,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 10,
                    maxHeight: "50%",
                  }}
                >
                  <FlatList
                    style={{ marginTop: 10 }}
                    data={
                      productGroup === undefined
                        ? []
                        : product.productGroupReasonDetails.find(
                          (x: any) => x.id === productGroup?.id
                        ).productGroups
                    }
                    renderItem={({ item }) => (
                      <AppButton
                        onPress={() => {
                          setShowSubGroup(false);
                          setProductSubGroup(item);
                          setAIReturnState(3);
                          if (
                            transaction === undefined ||
                            transaction
                              .easyReturnTrasactionLines === undefined
                          ) {
                            setAIReturnState(2);
                            return;
                          }

                          if (item.mainId === 207) {
                            setSapAIApprove(true);
                            setAIReturnState(1);
                            return;
                          }

                          if (item.sapCode === 0) {
                            setSapAIApprove(false);
                            setAIReturnState(2);
                            return;
                          }

                          let model = {
                            returnReason: item.sapCode,
                            ficheNumber:
                              transaction?.ficheNumber,
                            orderDate: transaction?.ficheDate,
                          };

                          CheckAIState(model).then((res) => {
                            setSapAIApprove(res);
                            setAIReturnState(res ? 1 : 2);
                          });
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
                </View>
              </View>
            </BlurView>
          </Portal>
        )}
      </KeyboardAwareScrollView>

      {loadingStart && <FloLoading />}
      {showCompletePopup && (
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
              backgroundColor: " rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                minHeight: 100,
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <AppText
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    marginLeft: 10,
                    fontSize: 14,
                  }}
                >
                  Kayıt No :
                </AppText>
                <AppText
                  labelColorType={ColorType.Brand}
                  selectable
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 14,
                  }}
                >
                  {" "}
                  {/*@ts-ignore */}
                  {transaction?.brokenProductDocumentNo}
                </AppText>
              </View>
              <AppText
                style={{ fontSize: 11 }}
                labelColorType={ColorType.Danger}
              >
                ** İşlemi bitirmeden önce bilgilendirme çıktılarını alın.
              </AppText>
              {/* <AppText style={{marginTop: 10, marginBottom: 10}}>
                Kopya Sayısı
              </AppText> */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                {/* {Platform.OS !== 'ios' && (
                  <>
                    <AppButton
                      onPress={() => {
                        if (copyCount > 1) setCopyCount(copyCount - 1);
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderColor: 'rgb(199,202,202)',
                        borderWidth: 1,
                      }}
                      transparent>
                      <AntDesign name="minus" />
                    </AppButton>
                    <AppText
                      style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 20,
                        marginHorizontal: 14,
                        width: 30,
                        textAlign: 'center',
                      }}>
                      {copyCount}
                    </AppText>
                    <AppButton
                      onPress={() => {
                        if (copyCount < 4) setCopyCount(copyCount + 1);
                      }}
                      transparent
                      style={{
                        width: 40,
                        height: 40,
                        borderColor: 'rgb(199,202,202)',
                        borderWidth: 1,
                      }}>
                      <AntDesign name="plus" />
                    </AppButton>
                  </>
                )} */}
              </View>

              <AppButton
                // transparent
                buttonColorType={ColorType.Brand}
                onPress={async () => {
                /*  Platform.OS === "web"
                    ? openDocument(brokenProductTemplate)
                    : await exPrint.printAsync({
                      html: brokenProductTemplate,
                    });

                 */
                }}
              >
                <AntDesign name="printer" size={20} color={"white"} />
                <AppText
                  labelType={LabelType.Label}
                  labelColorType={ColorType.Light}
                  size={FontSizes.L}
                  // style={props.textStyle}s
                  style={{ marginLeft: 10 }}
                >
                  Yazdır
                </AppText>
              </AppButton>

              <AppButton
                loading={isLoading}
                title={translate(
                  "easyReturnBrokenProductCompletePopup.completeTransaction"
                )}
                onPress={() => {
                  show(
                    translate("easyReturnBrokenProductCompletePopup.idesDocumentRecordPopupMessageBox"),
                    {
                      type: MessageBoxType.YesNo,
                      yesButtonEvent: () => {
                        show("Talep başarıyla oluşturuldu");
                        setShowCompletePopup(false);
                        navigation.goBack();
                        navigation.goBack();
                        CleanTransaction();
                      },
                    }
                  );
                }}
                buttonColorType={ColorType.Brand}
              />
            </View>
          </View>
        </BlurView>
      )}
      {showGeniusResult && (
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
              backgroundColor: " rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                minHeight: 100,
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <AppText
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 14,
                  }}
                >
                  Fiş Numarası :
                </AppText>
                <AppText
                  labelColorType={ColorType.Brand}
                  selectable
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 14,
                  }}
                >
                  {" "}
                  {/*@ts-ignore */}
                  {transaction?.ficheNumber}
                </AppText>
              </View>
              <AppText
                style={{ fontSize: 14 }}
                labelColorType={ColorType.Danger}
              >
                ** Genius üzerinden iade alabilirsiniz **
              </AppText>
              {Platform.OS === "web" ?
                <Image
                  source={{ uri: `data:image/svg+xml;base64,${transaction?.ficheBarcode}` }}
                  resizeMode="contain"
                  style={{ width: Dimensions.get("window").width - 80, height: Dimensions.get("window").height / 6, marginVertical: 20 }}
                />
                :
                <SvgXml
                  xml={Base64.atob(transaction?.ficheBarcode)}
                  width={Dimensions.get("window").width - 80}
                  height={Dimensions.get("window").height / 6}
                  style={{ marginVertical: 20 }}
                />
              }
              <AppButton
                buttonColorType={ColorType.Brand}
                onPress={() => {
                  setShowGeniusResult(false);
                  navigation.goBack();
                  navigation.goBack();
                }}
              >
                <AppText
                  labelType={LabelType.Label}
                  labelColorType={ColorType.Light}
                  size={FontSizes.L}
                >
                  Tamam
                </AppText>
              </AppButton>
            </View>
          </View>
        </BlurView>
      )}
    </View>
  );
};
export default BrokenComplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fm: {
    fontFamily: "Poppins_500Medium",
    marginVertical: 10,
  },
});

export const AppCardColorizeSvg: React.FC<{ color: string }> = (props) => {
  return (
    <Svg width={10} height={53} {...props}>
      <Path
        data-name="AGT Siparis karti"
        d="M10 0v43A10 10 0 0 1 0 53V10A10 10 0 0 1 10 0Z"
        fill={props.color}
      />
    </Svg>
  );
};

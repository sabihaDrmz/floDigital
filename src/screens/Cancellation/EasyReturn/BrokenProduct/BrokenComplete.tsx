import BlurView from "../../../../components/BlurView";
import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Actions } from "react-native-router-flux";
import Svg, { Path } from "react-native-svg";
import { AntDesign, FontAwesome5 } from "../../../../components";
import { FloHeader } from "../../../../components/Header";
import ApplicationGlobalService from "../../../../core/services/ApplicationGlobalService";
import EasyReturnService from "../../../../core/services/EasyReturnService";
import AppTextBox from "../../../../NewComponents/FormElements/AppTextBox";
import { MenuIcon } from "../../../OMS/Partials/OmsReasonRadios";
//TODO: EXPO expo-image-picker
// import * as exImp from "expo-image-picker";
import MessageBoxNew from "../../../../core/services/MessageBoxNew";
import { translate } from "../../../../helper/localization/locaizationMain";
//TODO: EXPO expo-image-picker
// import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import FloLoading from "../../../../components/FloLoading";
//TODO: EXPO exPrint
// import * as exPrint from "expo-print";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../../../core/services/MessageBox";
import { isInRole } from "../../../../components/RoleGroup";
import AccountService from "../../../../core/services/AccountService";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import MediaSelectorPopup from "../../../../components/MediaSelector/MediaSelectorPopup";
import { useMediaSelector } from "../../../../components/MediaSelector/MediaSelector";
import AppComboSelect from "../../../../components/AppComboSelect";
import FloComboBox from "../../../../components/FloComobox";
import { PerfectFontSize } from "../../../../helper/PerfectPixel";
const BrokenComplete: React.FC = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSubGroup, setShowSubGroup] = useState(false);
  const [description, setDescription] = useState("");
  const [productGroup, setProductGroup] = useState<any>();
  const [productSubGroup, setProductSubGroup] = useState<any>();
  const [images, setImages] = useState<any>([]);
  const [loadingStart, setLoadingStart] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [storeChiefChk, setStoreChiefChk] = useState<boolean>();
  const [sapAIApprove, setSapAIApprove] = useState(false);
  const { medias, setMedias } = useMediaSelector();
  const [showDropdown, setShowDropdown] = useState(false);

  const openCamera = () => {
    const currentState = Actions.currentScene;
    Actions["easyReturnCamera"]({
      onReadComplete: (barcode: string) => {
        Actions.popTo(currentState);
      },
      headerTitle: translate("OmsBarcodeSearchBar.barcodeScanning"),
    });
  };

  const toPad = (num?: number) => {
    let size = num?.toString().length || 0;
    var s = "000000000000000000" + num;
    return s.substring(size);
  };

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
    ApplicationGlobalService.getAllProductGroup();
    ApplicationGlobalService.getAllProductGroupReasons();
    setMedias([]);
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

  const PickImage = async () => {
    /*
    let permState = await exImp.getMediaLibraryPermissionsAsync();

    if (!permState.granted && permState.canAskAgain) {
      await exImp.requestMediaLibraryPermissionsAsync();
      permState = await exImp.getMediaLibraryPermissionsAsync();
    }

    if (!permState.granted) {
      MessageBoxNew.show(translate("errorMsgs.filePermissionError"), {
        yesButtonTitle: translate("messageBox.settings"),
        noButtonTitle: translate("messageBox.cancel"),
        yesButtonEvent: () => {
          Linking.openSettings();
        },
      });
      return;
    }

    exImp
      .launchImageLibraryAsync({
        mediaTypes: exImp.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [18, 9],
        quality: 0.5,
      })
      .then((pickImageResult) => {
        if (pickImageResult.cancelled) return;
        let image: ImageInfo = {
          ...pickImageResult,
        };
        setImages([...images, image]);
      });

     */
  };

  const [loadingImages, setLoadingImages] = useState(0);
  const removePicture = (uri: string) => {
    setImages(images.filter((x) => x.uri !== uri));
  };
  const [copyCount, setCopyCount] = useState(1);
  const [AIReturnState, setAIReturnState] = useState(4);
  return (
    <View style={styles.container}>
      <FloHeader
        headerType="standart"
        enableButtons={["back"]}
        headerTitle="İDES Detaylandırma"
      />
      <Observer>
        {() => {
          const product = EasyReturnService.erCurrentFiche?.data.find(
            (x) =>
              x.barcode ===
              EasyReturnService.erSelectedReturnProducts[0].barcode
          );

          if (product === undefined) return null;

          let pg = product.productGroupReasonDetails;
          return (
            <KeyboardAwareScrollView
              scrollEnabled={!showPopup && !showSubGroup}
            >
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
                      <AppText selectable>
                        Beden: {product.size} | Adet : 1
                      </AppText>
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
                    }}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 10,
                        backgroundColor: AppColor.FD.Functional.Success,
                      }}
                    >
                      <FontAwesome5 name="check" size={20} color={"#fff"} />
                    </View>
                    <AppText style={{ fontFamily: "Poppins_500Medium" }}>
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
                {/* //#endregion */}
                {/* {isInRole("omc-store-chief") && !sapAIApprove && (
                  <View style={{ paddingHorizontal: 30, marginTop: 20 }}>
                    <TouchableOpacity
                      onPress={() => setStoreChiefChk(!storeChiefChk)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 5,
                          backgroundColor: storeChiefChk
                            ? AppColor.OMS.Background.Success
                            : "#fff",
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,

                          elevation: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {storeChiefChk && (
                          <FontAwesome5 name="check" color="#fff" size={20} />
                        )}
                      </View>
                      <AppText
                        style={{
                          fontFamily: "Poppins_500Medium",
                          marginLeft: 10,
                        }}
                      >
                        Ürün İade Kararı
                      </AppText>
                    </TouchableOpacity>
                  </View>
                )} */}
                <AppText
                  style={{
                    marginLeft: 40,
                    fontFamily: "Poppins_500Medium",
                    marginTop: 10,
                  }}
                >
                  İDES Detayı
                </AppText>
                <View
                  style={{
                    marginHorizontal: 30,
                    marginTop: 10,
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
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 30,
                      marginVertical: 15,
                      justifyContent:
                        Platform.OS === "web" ? "flex-start" : "space-between",
                    }}
                  >
                    <AppText
                      style={{
                        marginTop: 5,
                        fontFamily: "Poppins_700Bold",
                        marginRight: Platform.OS === "web" ? 20 : 0,
                      }}
                    >
                      Yönetici Kararı
                    </AppText>
                    <View>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setShowDropdown(!showDropdown)}
                        style={{
                          borderWidth: 1,
                          borderColor: "#a1a1a1",
                          width: 200,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 10,
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          backgroundColor: "#fff",
                          zIndex: 99,
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
                  </View>
                )}
              </View>

              <View style={{ paddingHorizontal: 30, marginTop: 30 }}>
                {/* <MediaSelectorPopup settings={{ canEditable: true }} /> */}
              </View>

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
                  loading={EasyReturnService.isLoading}
                  onPress={() => {
                    if (EasyReturnService.isBrokenComplete) {
                      MessageBoxNew.show(
                        "Tekrar İDES Kaydı oluşturamazsınız. Süreci baştan ilerletmelisiniz.",
                        {
                          type: MessageBoxType.Standart,
                          onHide: () => {
                            Actions.popTo("erBrokenFindFiche");
                            EasyReturnService.CleanTransaction();
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
                      MessageBoxNew.show(
                        "Lütfen tüm alanları eksiksiz doldurun."
                      );
                      return;
                    }

                    if (storeChiefChk === undefined || storeChiefChk === null) {
                      MessageBoxNew.show("Lütfen Yönetici Kararı Seçiniz");
                      return;
                    }

                    EasyReturnService.updateTransactionLineDetail(
                      0,
                      product.barcode,
                      productSubGroup?.id,
                      description,
                      storeChiefChk,
                      sapAIApprove
                    ).then((res) => {
                      setLoadingImages(0);
                      setMedias([]);
                      setLoadingStart(true);

                      if (storeChiefChk) {
                        EasyReturnService.BrokenProductComplete().then(() => {
                          EasyReturnService.ErFindFicheResult(
                            // @ts-ignore
                            EasyReturnService.transaction?.ficheNumber,
                            true,
                            true
                          ).then(() => {
                            EasyReturnService.isBrokenComplete = true;
                          });
                          if (
                            EasyReturnService.transaction
                              ?.easyReturnTrasactionLine === undefined &&
                            EasyReturnService.transaction
                              ?.easyReturnTrasactionLines !== undefined
                          )
                            EasyReturnService.transaction.easyReturnTrasactionLine =
                              EasyReturnService.transaction.easyReturnTrasactionLines;
                          //TODO: Bu kısım kolay iade ile birlikte açılacaktır.
                          // Actions.replace('erBrokenPaymetTypes');
                          MessageBoxNew.show(
                            "Genius üzerinden iade alabilirsiniz.",
                            {
                              yesButtonEvent: () => {
                                Actions.popTo("erBrokenFindFiche");
                              },
                            }
                          );
                        });
                      } else {
                        EasyReturnService.CreateBrokenProductDocument(medias)
                          .then(async (res) => {
                            if (res) {
                              setShowCompletePopup(true);
                              EasyReturnService.isBrokenComplete = true;
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
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").height,
                      padding: 20,
                      justifyContent: "center",
                      backgroundColor: "transparent",
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
                        maxHeight: Dimensions.get("window").height / 2,
                        height: Dimensions.get("window").height / 2,
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
              )}

              {showSubGroup && (
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
                      backgroundColor: "transparent",
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
                                EasyReturnService.transaction === undefined ||
                                EasyReturnService.transaction
                                  .easyReturnTrasactionLines === undefined
                              ) {
                                setAIReturnState(2);
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
                                  EasyReturnService.transaction?.ficheNumber,
                                orderDate:
                                  EasyReturnService.transaction?.ficheDate,
                              };

                              EasyReturnService.CheckAIState(model).then(
                                (res) => {
                                  setSapAIApprove(res);
                                  setAIReturnState(res ? 1 : 2);
                                }
                              );
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
              )}
            </KeyboardAwareScrollView>
          );
        }}
      </Observer>
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
              backgroundColor: "transparent",
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
                  {EasyReturnService.transaction?.brokenProductDocumentNo}
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
              <Observer>
                {() => (
                  <AppButton
                    // transparent
                    buttonColorType={ColorType.Brand}
                    onPress={async () => {
                      /*Platform.OS === "web"
                        ? openDocument(EasyReturnService.brokenProductTemplate)
                        : await exPrint.printAsync({
                            html: EasyReturnService.brokenProductTemplate,
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
                )}
              </Observer>
              <Observer>
                {() => (
                  <AppButton
                    loading={EasyReturnService.isLoading}
                    title={translate(
                      "easyReturnBrokenProductCompletePopup.completeTransaction"
                    )}
                    onPress={() => {
                      MessageBoxNew.show(
                        "İşlem tamamlandığında her hangi bir değişiklik yapılamayacaktır. Tüm işlemlerin tamamlandığına eminmisiniz ?",
                        {
                          type: MessageBoxType.YesNo,
                          yesButtonEvent: () => {
                            MessageBox.Show(
                              "Talep başarıyla oluşturuldu",
                              MessageBoxDetailType.Danger,
                              MessageBoxType.Standart,
                              () => {},
                              () => {}
                            );
                            setShowCompletePopup(false);
                            Actions.popTo("erBrokenFindFiche");
                            EasyReturnService.CleanTransaction();
                          },
                        }
                      );
                    }}
                    buttonColorType={ColorType.Brand}
                  />
                )}
              </Observer>
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

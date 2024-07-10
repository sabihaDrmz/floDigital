import BlurView from "../../components/BlurView";
import {
  AppButton,
  AppCheckBox,
  AppColor,
  AppIcon,
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
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LinearGradient from "../../components/LinearGradient";
import { Portal } from "react-native-portalize";
import { Actions } from "react-native-router-flux";
import Svg, { Defs, G, Rect, Path } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "../../components";
import { SearchQR } from "../../components/CustomIcons/MainPageIcons";
import { FloHeader } from "../../components/Header";
import { OmsErrorReasonModel } from "../../core/models/OmsErrorReasonModel";
import { PackageOrder } from "../../core/models/OmsPackageModel";
import AccountService from "../../core/services/AccountService";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import OmsService from "../../core/services/OmsService";
import AppTextBox, {
  TextManipulator,
} from "../../NewComponents/FormElements/AppTextBox";
import OmsBarcodeSearchBar from "./Partials/OmsBarcodeSearchBar";
import { MenuIcon } from "./Partials/OmsReasonRadios";
import Radio from "./Partials/Radio";
import { translate } from "../../helper/localization/locaizationMain";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
interface CProps extends PackageOrder {
  selected: boolean;
  isExpand: boolean;
  onExpand: (state: boolean) => void;
  onPopup: (state: boolean) => void;
}

const SearchBarcodeIco = () => {
  return (
    <View
      style={{
        width: 100,
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        backgroundColor: "#fff",
        borderRadius: 70,
        marginTop: 30,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LinearGradient
        colors={AppColor.FD.Brand.Linear1}
        style={{
          width: 130,
          height: 130,
          borderRadius: 65,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 2.84,

          elevation: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              height: 60,
              backgroundColor: "#fff",

              width: 5,
              marginRight: 5,
            }}
          />
          <View
            style={{
              height: 60,
              backgroundColor: "#fff",

              width: 10,
              marginRight: 5,
            }}
          />
          <View
            style={{
              height: 60,
              backgroundColor: "#fff",

              marginRight: 5,
              width: 5,
            }}
          />
          <View
            style={{
              height: 60,
              backgroundColor: "#fff",

              marginRight: 5,
              width: 4,
            }}
          />
          <View
            style={{
              height: 60,
              backgroundColor: "#fff",

              marginRight: 5,
              width: 7,
            }}
          />
          <View
            style={{
              height: 60,
              backgroundColor: "#fff",

              width: 13,
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};
const OmsPackage: React.FC = (props) => {
  //#region Sub components
  const ProductCard: React.FC<CProps> = (props) => {
    return (
      <View>
        <View style={styles.productCardContainer}>
          <View style={styles.checkboxContainer}>
            <AppCheckBox disabled checked={props.selected} />
          </View>
          <View>
            <Image
              resizeMethod={"scale"}
              resizeMode={"cover"}
              style={styles.imageStyle}
              source={{
                uri: props.ImageUrl,
              }}
            />
          </View>
          <View style={styles.productCardInfoContainer}>
            <AppText selectable size={FontSizes.L}>
              {props.Color}
            </AppText>
            <AppText selectable labelType={LabelType.Label}>
              {props.ModelName}
            </AppText>
            <View style={styles.productCardInfoSizeBlock}>
              <AppText selectable size={FontSizes.L} style={{ flex: 1 }}>
                {props.BarcodeNo}
              </AppText>
              <View style={styles.productCardInfoSizeBlock}>
                <AppText size={FontSizes.L}>|{"  "}</AppText>
                <AppText selectable size={FontSizes.L}>
                  {props.BodySize}
                </AppText>
                <AppText size={FontSizes.L} style={{ marginLeft: 10 }}>
                  |{"  "}
                </AppText>
                <AppText size={FontSizes.L} selectable>
                  {props.Quantity} {translate("OmsNotFoundProducts.quantity")}
                </AppText>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => props.onExpand(!props.isExpand)}
            style={styles.expandContainer}
          >
            <AntDesign
              name={!props.isExpand ? "caretright" : "caretdown"}
              size={20}
              color={AppColor.FD.Text.Ash}
            />
          </TouchableOpacity>
        </View>
        {props.isExpand && (
          <TouchableOpacity
            onPress={() => props.onPopup(!props.isExpand)}
            style={{
              height: 44,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#c1bdbd",
              opacity: 0.42,
              borderRadius: 4,
              backgroundColor: "#ffffff",
              alignItems: "center",
              flexDirection: "row",
              paddingLeft: 15,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <AppText selectable style={{ fontWeight: "400" }}>
                {reasons ? reasons.OmsName : "-"}
              </AppText>
              {currentReason === undefined && (
                <AppText style={{ fontWeight: "400" }}>
                  {translate("OmsPackageCard.whyChooseList")}
                </AppText>
              )}
            </View>
            <MenuIcon />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const Sperator: React.FC = (props) => <View style={styles.sperator} />;
  //#endregion

  const GetOrderNumber = () => {
    let order = OmsService.omsPickListOrder.find(
      (x) => x.OrderNo === OmsService.continiousOrder
    );

    if (order) return order.OrderNo;

    let pOrder = OmsService.omsPickList.find(
      (x) => x.OrderNo === OmsService.continiousOrder
    );

    if (pOrder) return pOrder.OrderNo;

    return "-";
  };

  const [currentPopup, setCurrentPopup] = useState(0);
  const [currentExpanded, setCurrentExpanded] = useState(0);
  const [reasons, setReasons] = useState<OmsErrorReasonModel>();
  const [currentReason, setCurrentReason] = useState<OmsErrorReasonModel>();
  const [showBagPopup, setShowBagPopup] = useState(false);
  const [bagBarcode, setBagBarcode] = useState("");
  const [packageCount, setPackageCount] = useState("");
  const [okBag, setOkBag] = useState(false);

  const CheckCompleteBarcodeRading = () => {
    var olist = OmsService.packageList
      .filter((x) => x.OrderNo === OmsService.packageContiniousOrder)
      .reduce((x, y) => x + y.Orders.length, 0);

    return olist <= OmsService.packagingTemp.length;
  };

  const [loading, setLoading] = useState(true);
  const [salesOrg, setSalesOrg] = useState("");

  useEffect(() => {
    OmsService.loadErrorReasons();

    if (loading) {
      setLoading(false);

      setSalesOrg(
        ApplicationGlobalService.allStore.find(
          (x) => x.werks === AccountService.getUserStoreId()
        )?.salesOrg || ""
      );
    }
  });
  const getOrderByProduct = (barcode: string) => {
    let order = OmsService.packageList
      .filter((x) => x.Orders && x.Orders.length > 0)
      .find(
        (x) =>
          x.Orders.find(
            (y) =>
              y.BarcodeNo === barcode &&
              y.OrderNo === OmsService.packageContiniousOrder
          ) !== undefined
      );

    if (order) return order.OrderNo;
    order = OmsService.packageList.find(
      (x) => x.Orders.find((y) => y.BarcodeNo === barcode) !== undefined
    );

    if (order) return order.OrderNo;

    return "-1";
  };

  const packageCountControl = () => {
    if (Number(packageCount) === 0 || Number(packageCount) < 0) {
      MessageBoxNew.show(translate("OmsPackageCard.enterNumberPackage"));
      return true;
    }

    const order = OmsService.packageList.find(
      (x) => x.OrderNo === OmsService.packageContiniousOrder
    );

    if (order) {
      var totalQuantity = 0;
      var valizQuantity = 0;
      var isFindValizCategory = false;
      order.Orders.forEach((x) => {
        totalQuantity += Number(x.Quantity);
        if (x.Category && x.Category === "Valiz") {
          isFindValizCategory = true;
          valizQuantity += Number(x.Quantity);
        }
      });

      if (isFindValizCategory && valizQuantity > Number(packageCount)) {
        MessageBoxNew.show(translate("OmsPackageCard.packageCannotBeLess"));
        return true;
      }

      if (Number(packageCount) > totalQuantity) {
        MessageBoxNew.show(translate("OmsPackageCard.packageCannotBeGreater"));
        return true;
      }
    } else {
      return true;
    }

    return false;
  };

  const getContiniousCargoCampony = () => {
    const order = OmsService.packageList.find(
      (x) => x.OrderNo === OmsService.packageContiniousOrder
    );
    if (order && order.Orders.length > 0) {
      return order.Orders[0].CargoCompany;
    }
    return "";
  };

  const [approveContract, setApproveContract] = useState(false);
  return (
    <View style={styles.container}>
      <FloHeader
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={`${translate("OmsPackageCard.packed")} (${
          OmsService.packageContiniousOrder
        })`}
      />
      <View style={{ marginTop: 40 }}>
        <OmsBarcodeSearchBar
          onSearch={(barcode) => {
            let orderId = getOrderByProduct(barcode);

            var product = OmsService.packageList
              .find((x) => x.OrderNo === orderId)
              ?.Orders.find((x) => x.BarcodeNo === barcode);
            if (product) OmsService.pickItem(orderId, product.BarcodeNo);
          }}
        />
      </View>
      <ScrollView
        bounces={false}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <Observer>
          {() => {
            return (
              <>
                {OmsService.packageList
                  .filter(
                    (x) => x.OrderNo === OmsService.packageContiniousOrder
                  )
                  .map((x, index) => {
                    return x.Orders.map((y) => {
                      return (
                        <>
                          <ProductCard
                            key={y.ID}
                            {...y}
                            onExpand={(state) => {
                              if (state) setCurrentExpanded(y.ID);
                              else setCurrentExpanded(0);

                              setCurrentReason(undefined);
                              setReasons(undefined);
                            }}
                            onPopup={() => {
                              setCurrentReason(undefined);
                              setCurrentPopup(y.ID);
                            }}
                            isExpand={y.ID === currentExpanded}
                            selected={
                              OmsService.packagingTemp.findIndex(
                                (z) =>
                                  z.BarcodeNo === y.BarcodeNo && y.ID === z.ID
                              ) > -1
                            }
                          />
                          {index < OmsService.pickingTemp.length - 1 && (
                            <Sperator />
                          )}
                        </>
                      );
                    });
                  })}
              </>
            );
          }}
        </Observer>
        <View style={{ height: 90 }} />
      </ScrollView>
      <SafeAreaView>
        <View style={styles.buttonContainer}>
          <Observer>
            {() => {
              let quantity =
                OmsService.packageList.find(
                  (x) => x.OrderNo === OmsService.packageContiniousOrder
                )?.Orders.length || 0;
              return (
                <>
                  {reasons ? (
                    <AppButton
                      title={translate("ProductDetail.cancelOrder")}
                      buttonColorType={ColorType.Danger}
                      loading={OmsService.cancelLoading}
                      onPress={() => {
                        let ordermodel = OmsService.packageList
                          .find(
                            (x) =>
                              x.OrderNo === OmsService.packageContiniousOrder
                          )
                          ?.Orders.find((x) => x.ID === currentExpanded);
                        if (ordermodel)
                          OmsService.cancelOrder(
                            {
                              ...ordermodel,
                              SourceCode: ordermodel.SourceCode,
                            },
                            reasons.OmsName
                          ).then((res) => {
                            if (res) Actions.popTo("omsDb");
                          });
                      }}
                    />
                  ) : OmsService.packagingTemp.filter(
                      (x) => x.ChannelCode !== "BC"
                    ).length > 0 ? (
                    <View>
                      <View>
                        <TouchableOpacity
                          onPress={() => setApproveContract(!approveContract)}
                          style={{ marginBottom: 15, flexDirection: "row" }}
                        >
                          <View
                            style={{
                              width: 27,
                              height: 27,
                              backgroundColor: "#119d47",
                              borderRadius: 5,
                              margin: 5,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {approveContract && (
                              <FontAwesome
                                name={"check"}
                                size={20}
                                color={"#fff"}
                              />
                            )}
                          </View>
                          <AppText
                            style={{
                              width: Dimensions.get("window").width - 90,
                            }}
                          >
                            {translate("OmsPackageCard.allConfirm")}
                          </AppText>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <AppButton
                          disabled={!approveContract}
                          style={{
                            width: (Dimensions.get("window").width - 60) / 2,
                          }}
                          onPress={() => {
                            if (CheckCompleteBarcodeRading()) {
                              setShowBagPopup(true);
                            } else
                              MessageBoxNew.show(
                                translate("OmsPackageCard.parcelBagScanned"),
                                {
                                  icon: <CloseIco />,
                                }
                              );
                          }}
                          title={translate("OmsPackageCard.selectParselBag")}
                          buttonColorType={
                            approveContract ? ColorType.Success : ColorType.Gray
                          }
                        />
                        {/* Kazakistan kontrolü */}
                        {salesOrg !== "3111" && (
                          <Observer>
                            {() => (
                              <AppButton
                                style={{
                                  width:
                                    (Dimensions.get("window").width - 70) / 2,
                                }}
                                disabled={!OmsService.completePickBag}
                                loading={OmsService.waybillLoading}
                                buttonColorType={
                                  OmsService.completePickBag
                                    ? ColorType.Success
                                    : ColorType.Gray
                                }
                                title={translate(
                                  "OmsPackageCard.printIrsaliye"
                                )}
                                onPress={() =>
                                  OmsService.waybillPrint(bagBarcode)
                                }
                              />
                            )}
                          </Observer>
                        )}
                        {salesOrg === "3111" && (
                          <AppButton
                            style={{
                              width: (Dimensions.get("window").width - 70) / 2,
                            }}
                            disabled={!OmsService.completePickBag}
                            loading={OmsService.waybillLoading}
                            buttonColorType={
                              OmsService.completePickBag
                                ? ColorType.Success
                                : ColorType.Gray
                            }
                            title={translate("foundProduct.printLabel")}
                            onPress={() => {
                              OmsService.printOrderLabel(bagBarcode);
                            }}
                          />
                        )}
                      </View>
                      <Observer>
                        {() => {
                          return (
                            <AppButton
                              title={translate(
                                "OmsWaybillStatus.completeTheOrder"
                              )}
                              disabled={
                                !OmsService.completePickBag ||
                                !OmsService.hasWaybillComplete
                              }
                              loading={OmsService.completePackageLoading}
                              buttonColorType={
                                !OmsService.completePickBag ||
                                !OmsService.hasWaybillComplete
                                  ? ColorType.Gray
                                  : ColorType.Success
                              }
                              onPress={() => OmsService.completePackage()}
                            />
                          );
                        }}
                      </Observer>
                    </View>
                  ) : (
                    !reasons && (
                      <AppButton
                        title={translate("foundProduct.printLabel")}
                        buttonColorType={
                          quantity > OmsService.packagingTemp.length
                            ? ColorType.Gray
                            : ColorType.Success
                        }
                        disabled={quantity > OmsService.packagingTemp.length}
                        loading={OmsService.onLoadingPrintLabel}
                        onPress={() => OmsService.printLabel()}
                      />
                    )
                  )}
                </>
              );
            }}
          </Observer>
          {/* <Observer>
            {() => {
              let order = OmsService.omsPickListOrder.find(
                (x) => x.ID === OmsService.continiousOrder,
              );
              let quantity =
                OmsService.omsPickList.filter(
                  (x) => x.OrderID === OmsService.continiousOrder,
                ).length + (order ? order.OrderItems.length : 0);

              return (
                <AppButton
                  title={'Etiket Bas'}
                  buttonColorType={
                    quantity > OmsService.pickingTemp.length
                      ? ColorType.Gray
                      : ColorType.Success
                  }
                />
              );
            }}
          </Observer> */}
          {/* <AppButton title={'Etiket Bas'} buttonColorType={ColorType.Gray} /> */}
        </View>
      </SafeAreaView>
      {showBagPopup && (
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
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <KeyboardAvoidingView behavior="position">
              <View
                style={{
                  width: Dimensions.get("window").width - 40,
                  backgroundColor: "#fff",
                  minHeight: 100,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 25,
                  maxHeight: 500,
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText
                    style={{
                      fontSize: 18,
                      fontFamily: "Poppins_400Regular",
                      textAlign: "center",
                    }}
                  >
                    {translate("OmsPackageCard.pleaseReadBarcode")}
                  </AppText>
                  <Observer>
                    {() => (
                      <TouchableOpacity
                        disabled={OmsService.isPackageLoading}
                        onPress={() => {
                          const currentState = Actions.currentScene;
                          Actions["omsCamera"]({
                            onReadComplete: (barcode: string) => {
                              Actions.popTo(currentState);
                              setBagBarcode(barcode);
                              // // Koli Paket Sayısı Kontrolü
                              // if (packageCountControl()) {
                              //   setBagBarcode(barcode);
                              //   return;
                              // }
                              // MessageBoxNew.show(
                              //   translate(
                              //     "OmsPackageList.afterThisOperationAreyousure"
                              //   ),
                              //   {
                              //     type: MessageBoxType.YesNo,
                              //     yesButtonEvent: () => {
                              //       OmsService.pickBagBarcodeStep2(
                              //         barcode,
                              //         packageCount
                              //       ).then((res) => {
                              //         if (res) {
                              //           setShowBagPopup(false);
                              //           setOkBag(true);

                              //           setBagBarcode(barcode);
                              //         }
                              //       });
                              //     },
                              //     noButtonEvent: () => {
                              //       MessageBoxNew.hide();
                              //     },
                              //   }
                              // );
                            },
                            headerTitle: translate(
                              "OmsBarcodeSearchBar.barcodeScanning"
                            ),
                          });
                        }}
                      >
                        <SearchBarcodeIco />
                      </TouchableOpacity>
                    )}
                  </Observer>
                  <View
                    style={{
                      width: Dimensions.get("window").width - 100,
                      marginTop: 20,
                    }}
                  >
                    <View style={{ marginTop: 10 }}>
                      <AppText>
                        {translate("OmsPackageCard.parcelPackageBarcode")}
                      </AppText>
                      <FloTextBoxNew
                        value={bagBarcode}
                        onChangeText={setBagBarcode}
                        style={{
                          borderColor: "#CECACA",
                          backgroundColor: "#fff",
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderRadius: 8,
                          height: 40,
                          paddingHorizontal: 10,
                          fontFamily: "Poppins_200ExtraLight",
                          fontSize: 14,
                          color: "#707070",
                        }}
                      />
                    </View>
                    {getContiniousCargoCampony() !== "Kaspi" && (
                      <View style={{ marginTop: 10 }}>
                        <AppText>
                          {translate("OmsPackageCard.packageCount")}
                        </AppText>
                        <FloTextBoxNew
                          keyboardType={"number-pad"}
                          value={packageCount}
                          onChangeText={(txt) =>
                            setPackageCount(TextManipulator(txt, "onlyNumber"))
                          }
                          style={{
                            borderColor: "#CECACA",
                            backgroundColor: "#fff",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderRadius: 8,
                            height: 40,
                            paddingHorizontal: 10,
                            fontFamily: "Poppins_200ExtraLight",
                            fontSize: 14,
                            color: "#707070",
                          }}
                        />
                        <AppText
                          style={{ marginTop: 5, fontSize: 10, color: "red" }}
                        >
                          ** {translate("OmsPackageCard.packageCountInfo")} **
                        </AppText>
                      </View>
                    )}
                    <Observer>
                      {() => (
                        <AppButton
                          title={translate("OmsCargoConsensusDatePopup.ok")}
                          buttonColorType={ColorType.Success}
                          onPress={() => {
                            // Koli Paket Sayısı Kontrolü
                            if (
                              getContiniousCargoCampony() !== "Kaspi" &&
                              packageCountControl()
                            ) {
                              return;
                            }

                            MessageBoxNew.show(
                              translate(
                                "OmsPackageList.afterThisOperationAreyousure"
                              ),
                              {
                                type: MessageBoxType.YesNo,
                                yesButtonEvent: () => {
                                  OmsService.pickBagBarcodeStep2(
                                    bagBarcode,
                                    Number(packageCount)
                                  ).then((res) => {
                                    if (res) {
                                      setShowBagPopup(false);
                                      setOkBag(true);
                                    }
                                  });
                                },
                                noButtonEvent: () => {
                                  MessageBoxNew.hide();
                                },
                              }
                            );
                          }}
                          loading={OmsService.isPackageLoading}
                          style={{ marginTop: 20 }}
                        />
                      )}
                    </Observer>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </BlurView>
      )}
      {currentPopup !== 0 && (
        <Portal>
          <TouchableWithoutFeedback
            onPress={() => {
              setReasons(currentReason);

              setCurrentPopup(0);
            }}
          >
            <View
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "90%",
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  minHeight: 250,
                  padding: 15,
                }}
              >
                <TouchableWithoutFeedback style={{}}>
                  <React.Fragment>
                    <Observer>
                      {() => {
                        return (
                          <React.Fragment>
                            {OmsService.errorReasons.map((x) => {
                              return (
                                <Radio
                                  key={x.OmsName}
                                  selected={x === currentReason}
                                  onSelect={() =>
                                    setCurrentReason(
                                      x === currentReason ? undefined : x
                                    )
                                  }
                                  label={x.OmsName}
                                />
                              );
                            })}
                          </React.Fragment>
                        );
                      }}
                    </Observer>
                    <AppButton
                      buttonColorType={ColorType.Success}
                      title={translate("OmsCargoConsensusDatePopup.ok")}
                      onPress={() => {
                        setReasons(currentReason);

                        setCurrentPopup(0);
                      }}
                    />
                  </React.Fragment>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      )}
    </View>
  );
};
export default OmsPackage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 30,
  },
  scrollContainer: {
    marginHorizontal: 32,
    paddingTop: 72,
  },
  sperator: {
    height: 1,
    backgroundColor: "#ededed",
    marginHorizontal: 15,
    marginVertical: 20,
  },
  productCardContainer: {
    flexDirection: "row",
  },
  productCardInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productCardInfoSizeBlock: {
    flexDirection: "row",
  },
  imageStyle: {
    width: 76,
    height: 86,
    top: -10,
  },
  checkboxContainer: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    top: -10,
    left: 5,
  },
  expandContainer: {
    justifyContent: "center",
    width: 35,
    alignItems: "flex-end",
  },
});

export const CloseIco = (props: any) => {
  return (
    <View
      style={{
        width: 72,
        height: 72,
        backgroundColor: "#d10d0d",
        borderRadius: 36,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -10,
      }}
    >
      <FontAwesome name="close" size={60} color={"#fff"} />
    </View>
  );
  // return (
  //   <Svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     width={90}
  //     height={90}
  //     viewBox="0 0 90 90"
  //     {...props}>
  //     <Defs></Defs>
  //     <G data-name="Group 3177">
  //       <G>
  //         <Rect
  //           data-name="Rectangle 421"
  //           width={72}
  //           height={74}
  //           rx={36}
  //           transform="translate(9 6)"
  //           fill="#d10d0d"
  //         />
  //       </G>
  //       <Path
  //         data-name="Path 2216"
  //         d="M31.918 24.969L63.031 56.08l-4.95 4.95L26.97 29.918z"
  //         fill="#fff"
  //       />
  //       <Path
  //         data-name="Rectangle 131"
  //         d="M26.216 56.02l31.805-31.804 5.209 5.209-31.804 31.804z"
  //         fill="#fff"
  //       />
  //     </G>
  //   </Svg>
  // );
};

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
  ScrollView,
  TextInput,
  Platform
} from "react-native";
import LinearGradient from "../../components/LinearGradient/LinearGradientView";
import { Portal } from "react-native-portalize";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { PackageOrder } from "../../core/models/OmsPackageModel";
import { translate } from "../../helper/localization/locaizationMain";
import { MenuIcon } from "../../components/Oms/partials/ReaseonRadios";
import { OmsErrorReasonModel } from "../../core/models/OmsErrorReasonModel";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import BarcodeSearchBar from "../../components/Oms/partials/BarcodeSearchBar";
import AppTextBox, {
  TextManipulator,
} from "../../NewComponents/FormElements/AppTextBox";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import Radio from "../../components/Oms/partials/Radio";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import MainCamera from "../../components/MainCamera";
import { useOmsService } from "../../contexts/OmsService";
import { useAccountService } from "../../contexts/AccountService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useNavigation } from "@react-navigation/native";

interface CProps extends PackageOrder {
  selected: boolean;
  isExpand: boolean;
  isKazakistanQrRead?: boolean;
  isQrSelected?: boolean;
  index: number;
  onExpand: (state: boolean) => void;
  onPopup: (state: boolean) => void;
  onSelectBarcode: () => void;
  onReadQR: (qrCode: string) => void;
}

const OmsPackage: React.FC = (props) => {
  const {
    completePickBag,
    packageList,
    packageContiniousOrder,
    packagingTemp,
    kzkQrTemp,
    pickingTemp,
    errorReasons,
    completePackageLoading,
    hasWaybillComplete,
    waybillLoading,
    cancelLoading,
    isPackageLoading,
    onLoadingPrintLabel,
    printLabel,
    pickKzkQr,
    pickItem,
    cancelOrder,
    CheckPrinterConfiguration,
    waybillPrint,
    printOrderLabel,
    completePackage,
    pickBagBarcodeStep2
  } = useOmsService();
  const { allStore } = useApplicationGlobalService();
  const { getUserStoreId } = useAccountService();
  const { show, hide } = useMessageBoxService();
  const navigation = useNavigation();

  //#region Sub components
  const ProductCard: React.FC<CProps> = (props) => {
    const [kzkQrValues, setKzkQrValues] = useState([]);
    const handleKzkQrChange = (index: number, text: string) => {
      setKzkQrValues((prevKzkQrValues) => {
        const updatedValues = [...prevKzkQrValues];
        //@ts-ignore
        updatedValues[index] = text;
        return updatedValues;
      });
    };
    return (
      <View>
        <View style={styles.productCardContainer}>
          <View style={styles.checkboxContainer}>
            {props.isKazakistanQrRead &&
              !props.isQrSelected &&
              !completePickBag ? (
              <AppText
                style={{
                  backgroundColor: "orange",
                  color: "#fff",
                  paddingHorizontal: 10,
                  marginTop: 10,
                  fontFamily: "Poppins_600SemiBold",
                  fontWeight: "700",
                  fontSize: 18,
                }}
              >
                !
              </AppText>
            ) : (
              <AppCheckBox disabled checked={props.selected} />
            )}
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
                  {props.Quantity +
                    " " +
                    translate("OmsNotFoundProducts.quantity")}
                </AppText>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => props.onExpand(!props.isExpand)}
            style={styles.expandContainer}
          >
            <FontAwesomeIcon
              icon={!props.isExpand ? "caretright" : "caretdown"}
              size={20}
              color={AppColor.FD.Text.Ash}
            />
          </TouchableOpacity>
        </View>

        {props.isExpand && (
          <View
            style={{
              flexDirection:
                props.isKazakistanQrRead && !props.isQrSelected
                  ? "row"
                  : "column",
            }}
          >
            {props.isKazakistanQrRead && !props.isQrSelected && (
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <TextInput
                  placeholderTextColor={AppColor.FD.Text.Default}
                  selectionColor={AppColor.FD.Brand.Solid}
                  underlineColorAndroid={"transparent"}
                  placeholder={translate("OmsBarcodeSearchBar.qrRead")}
                  value={kzkQrValues[props.index]}
                  onChangeText={(text) => handleKzkQrChange(props.index, text)}
                  style={{
                    borderRadius: 4,
                    flex: 1,
                    height: 44,
                    borderStyle: "solid",
                    borderWidth: 1,
                    backgroundColor: "#fff",
                    borderColor: "#c1bdbd",
                    marginRight: 20,
                    paddingHorizontal: 5,
                    color: "#a2a2a2",
                    opacity: 0.42,
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    props.onSelectBarcode();
                    if (kzkQrValues[props.index]) {
                      props.onReadQR(kzkQrValues[props.index]);
                    } else {
                      setIsQrCameraShow(true);
                    }
                  }}
                  style={{
                    position: "absolute",
                    right: 5,
                    backgroundColor: "#ff8600",
                    borderRadius: 100,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                    zIndex: 5,
                    height: 44,
                    width: 44,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon="qrcode-scan"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPress={() => props.onPopup(!props.isExpand)}
              style={{
                flex: 1,
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
                  {reasons ? reasons.OmsName : ""}
                </AppText>
                {currentReason === undefined && (
                  <AppText style={{ fontWeight: "400" }}>
                    {translate("OmsPackageCard.whyChooseList")}
                  </AppText>
                )}
              </View>
              <MenuIcon />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const Sperator: React.FC = (props) => <View style={styles.sperator} />;
  //#endregion

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
          marginTop: 20,
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

  const [currentPopup, setCurrentPopup] = useState(0);
  const [currentExpanded, setCurrentExpanded] = useState(0);
  const [reasons, setReasons] = useState<OmsErrorReasonModel>();
  const [currentReason, setCurrentReason] = useState<OmsErrorReasonModel>();
  const [showBagPopup, setShowBagPopup] = useState(false);
  const [bagBarcode, setBagBarcode] = useState("");
  const [okBag, setOkBag] = useState(false);
  const [packageCount, setPackageCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [salesOrg, setSalesOrg] = useState("");
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [isQrCameraShow, setIsQrCameraShow] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState("");

  const CheckCompleteBarcodeRading = () => {
    var olist = packageList
      .filter((x) => x.OrderNo === packageContiniousOrder)
      .reduce((x, y) => x + y.Orders.length, 0);

    return olist <= packagingTemp.length;
  };

  const CheckCompleteQRRading = () => {
    var olist = packageList
      .filter((x) => x.OrderNo === packageContiniousOrder)
      .reduce(
        (x, y) =>
          x +
          y.Orders.filter(
            (z) =>
              z.Category.toUpperCase() === "AYAKKABI" ||
              z.Category.toUpperCase() === "SHOES"
          ).length,
        0
      );

    return olist <= kzkQrTemp.length;
  };

  const packageCountControl = () => {
    if (packageCount === "" || Number(packageCount) <= 0) {
      show(translate("OmsPackageCard.enterNumberPackage"));
      return true;
    }

    const order = packageList.find(
      (x) => x.OrderNo === packageContiniousOrder
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
        show(translate("OmsPackageCard.packageCannotBeLess"));
        return true;
      }

      if (Number(packageCount) > totalQuantity) {
        show(translate("OmsPackageCard.packageCannotBeGreater"));
        return true;
      }
    } else {
      return true;
    }

    return false;
  };

  const isShowPackageCount = () => {
    const order = packageList.find(
      (x) => x.OrderNo === packageContiniousOrder
    );
    if (order && order.Orders.length > 0) {
      if (order.Orders[0].CargoCompany === "Kaspi") return false;
      if (
        order.Orders[0].ChannelCargoCode &&
        order.Orders[0].ChannelCargoCode.length > 0
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  const getOrderByProduct = (barcode: string) => {
    let order = packageList
      .filter((x) => x.Orders && x.Orders.length > 0)
      .find(
        (x) =>
          x.Orders.find(
            (y) =>
              y.BarcodeNo === barcode &&
              y.OrderNo === packageContiniousOrder
          ) !== undefined
      );

    if (order) return order.OrderNo;
    order = packageList.find(
      (x) => x.Orders.find((y) => y.BarcodeNo === barcode) !== undefined
    );

    if (order) return order.OrderNo;

    return "-1";
  };

  const readKzkQrCode = (qrCode: string, barcode: string) => {
    try {
      if (qrCode) {
        if (qrCode.includes(barcode)) {
          pickKzkQr({
            barcode,
            qrCode,
          });
          setCurrentExpanded(0);
          readBarcode(barcode);
        } else {
          show(translate("OmsPackageCard.packageQrNotCorrect"));
        }
      }
    } catch (error) {
      show(translate("OmsPackageCard.packageQrNotCorrect"));
    }
  };

  const readBarcode = (barcode: string) => {
    let orderId = getOrderByProduct(barcode);

    var product = packageList
      .find((x) => x.OrderNo === orderId)
      ?.Orders.find((x) => x.BarcodeNo === barcode);
    if (product) pickItem(orderId, product.BarcodeNo);
  }

  const [approveContract, setApproveContract] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);

      setSalesOrg(
        allStore.find(
          (x) => x.werks === getUserStoreId()
        )?.salesOrg || ""
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={`${translate("OmsPackageCard.packed")} (${packageContiniousOrder
          })`}
      />
      <View style={{ marginTop: 40 }}>
        <BarcodeSearchBar
          onSearch={readBarcode}
        />
      </View>
      <ScrollView
        bounces={false}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {packageList
          .filter((x) => x.OrderNo === packageContiniousOrder)
          .map((x, index) => {
            return x.Orders.map((y, ind) => {
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
                      packagingTemp.findIndex(
                        (z) => z.BarcodeNo === y.BarcodeNo && y.ID === z.ID
                      ) > -1
                    }
                    isQrSelected={
                      kzkQrTemp.findIndex(
                        (z) => z.barcode === y.BarcodeNo
                      ) > -1
                    }
                    isKazakistanQrRead={
                      (salesOrg === "3111" ||
                        salesOrg === "3112" ||
                        salesOrg === "3114") &&
                      (y.Category.toUpperCase() === "AYAKKABI" ||
                        y.Category.toUpperCase() === "SHOES")
                    }
                    onSelectBarcode={() => setSelectedBarcode(y.BarcodeNo)}
                    onReadQR={(qrCode) => readKzkQrCode(qrCode, y.BarcodeNo)}
                    index={ind}
                  />
                  {index < pickingTemp.length - 1 && <Sperator />}
                </>
              );
            });
          })}
        <View style={{ height: 90 }} />
      </ScrollView>
      <SafeAreaView>
        <View style={styles.buttonContainer}>
          {/* let quantity =
                OmsService.packageList.find(
                  (x) => x.OrderNo === OmsService.packageContiniousOrder
                )?.Orders.length || 0; */}

          {reasons ? (
            <AppButton
              title={translate("ProductDetail.cancelOrder")}
              buttonColorType={ColorType.Danger}
              loading={cancelLoading}
              onPress={() => {
                let ordermodel = packageList
                  .find((x) => x.OrderNo === packageContiniousOrder)
                  ?.Orders.find((x) => x.ID === currentExpanded);
                if (ordermodel)
                  cancelOrder(
                    {
                      ...ordermodel,
                      SourceCode: ordermodel.SourceCode,
                    },
                    reasons.OmsName
                  ).then((res) => navigation.goBack());
              }}
            />
          ) : packagingTemp.filter((x) => x.ChannelCode !== "BC")
            .length > 0 ? (
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    var isPackaged = packageList
                      .filter(
                        (x) => x.OrderNo === packageContiniousOrder
                      )
                      .find((x) => x.IsPackaged);
                    if (
                      isPackaged &&
                      isPackaged.Orders[0].CargoCompany !== "Kaspi"
                    ) {
                      show(
                        translate("OmsPackageCard.packageAlreadyBeenMade")
                      );
                      return;
                    }
                    setApproveContract(!approveContract);
                  }}
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
                      <FontAwesomeIcon icon={"check"} size={20} color={"#fff"} />
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
                    if (
                      !CheckPrinterConfiguration(
                        translate("omsService.configurePackagegingProcess")
                      )
                    )
                      return;

                    if (CheckCompleteBarcodeRading()) {
                      if (
                        salesOrg === "3111" ||
                        salesOrg === "3112" ||
                        salesOrg === "3114"
                      ) {
                        if (CheckCompleteQRRading()) {
                          setShowBagPopup(true);
                        } else {
                          show(
                            translate("OmsPackageCard.packageQrMissing"),
                            {
                              icon: <CloseIco />,
                            }
                          );
                        }
                      } else setShowBagPopup(true);
                    } else
                      show(
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
                {salesOrg !== "3111" &&
                  salesOrg !== "3112" &&
                  salesOrg !== "3114" && (
                    <AppButton
                      style={{
                        width: (Dimensions.get("window").width - 70) / 2,
                      }}
                      disabled={!completePickBag}
                      loading={waybillLoading}
                      buttonColorType={
                        completePickBag
                          ? ColorType.Success
                          : ColorType.Gray
                      }
                      title={translate("OmsPackageCard.printIrsaliye")}
                      onPress={() => waybillPrint()}
                    />
                  )}
                {(salesOrg === "3111" ||
                  salesOrg === "3112" ||
                  salesOrg === "3114") && (
                    <AppButton
                      style={{
                        width: (Dimensions.get("window").width - 70) / 2,
                      }}
                      disabled={!completePickBag}
                      loading={waybillLoading}
                      buttonColorType={
                        completePickBag
                          ? ColorType.Success
                          : ColorType.Gray
                      }
                      title={translate("foundProduct.printLabel")}
                      onPress={() => printOrderLabel()}
                    />
                  )}
              </View>
              <AppButton
                title={translate("OmsWaybillStatus.completeTheOrder")}
                disabled={
                  !completePickBag || !hasWaybillComplete
                }
                loading={completePackageLoading}
                buttonColorType={
                  !completePickBag || !hasWaybillComplete
                    ? ColorType.Gray
                    : ColorType.Success
                }
                onPress={() => {
                  completePackage().then((res) => {
                    if (res) {
                      //@ts-ignore
                      navigation.navigate('Oms', { screen: 'OmsMain', params: { tab: 3 } })
                    }
                  });
                }}
              />
            </View>
          ) : (
            !reasons && (
              <AppButton
                title={translate("foundProduct.printLabel")}
                buttonColorType={
                  (packageList.find(
                    (x) => x.OrderNo === packageContiniousOrder
                  )?.Orders.length || 0) > packagingTemp.length
                    ? ColorType.Gray
                    : ColorType.Success
                }
                disabled={
                  (packageList.find(
                    (x) => x.OrderNo === packageContiniousOrder
                  )?.Orders.length || 0) > packagingTemp.length
                    ? true
                    : false
                }
                loading={onLoadingPrintLabel}
                onPress={() => {
                  printLabel().then((res) => {
                    if (res) {
                      //@ts-ignore
                      navigation.navigate('Oms', { screen: 'OmsMain', params: { tab: 3 } });
                    }
                  });
                }}
              />
            )
          )}
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
              ...Platform.select({
                android: {
                  backgroundColor: "rgba(0,0,0,0.5)",
                }
              })
            }}
          >
            <KeyboardAvoidingView behavior="position">
              <View
                style={{
                  width: Dimensions.get("window").width - 40,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                  }}
                  onPress={() => setShowBagPopup(false)}
                >
                  <FontAwesomeIcon icon="times-circle" size={36} color="red" />
                </TouchableOpacity>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText
                    style={{
                      fontSize: 17,
                      fontFamily: "Poppins_400Regular",
                      textAlign: "center",
                    }}
                  >
                    {translate("OmsPackageCard.pleaseReadBarcode")}
                  </AppText>

                  <TouchableOpacity
                    disabled={isPackageLoading}
                    onPress={() => setIsCameraShow(true)}
                  >
                    <SearchBarcodeIco />
                  </TouchableOpacity>

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
                      {!isShowPackageCount() && (
                        <AppText
                          style={{ marginTop: 5, fontSize: 10, color: "red" }}
                        >
                          ** {translate("OmsPackageCard.packageNotCountInfo")}{" "}
                          **
                        </AppText>
                      )}
                    </View>
                    {isShowPackageCount() && (
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
                    <AppButton
                      title={translate("OmsCargoConsensusDatePopup.ok")}
                      buttonColorType={ColorType.Success}
                      onPress={() => {
                        // Koli Paket Sayısı Kontrolü
                        if (isShowPackageCount() && packageCountControl()) {
                          return;
                        }

                        show(
                          translate(
                            "OmsPackageList.afterThisOperationAreyousure"
                          ),
                          {
                            type: MessageBoxType.YesNo,
                            yesButtonEvent: () => {
                              pickBagBarcodeStep2(
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
                              hide();
                            },
                          }
                        );
                      }}
                      loading={isPackageLoading}
                      style={{ marginTop: 20 }}
                    />
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
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 15,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MenuIcon color2={"#919191"} color={"#fff"} />
                    <AppText size={FontSizes.L} style={{ color: "#919191" }}>
                      {translate("OmsReaseonRadios.selectReason")}
                    </AppText>
                  </View>
                  <View style={{ paddingHorizontal: 5 }}>
                    <View style={{ marginBottom: 10, marginTop: 10 }}>
                      {errorReasons.map((reason) => {
                        return (
                          <Radio
                            selected={reason === currentReason}
                            onSelect={() =>
                              setCurrentReason(
                                reason === currentReason ? undefined : reason
                              )
                            }
                            label={reason.OmsName}
                          />
                        );
                      })}
                    </View>
                    <AppButton
                      onPress={() => {
                        setReasons(currentReason);

                        setCurrentPopup(0);
                      }}
                      buttonColorType={ColorType.Success}
                      title={translate("OmsReaseonRadios.continue")}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      )}

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          setBagBarcode(barcode);
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />

      {/* Kazakistan QR için */}
      <MainCamera
        isShow={isQrCameraShow}
        isKazakistan={true}
        onReadComplete={(qrCode) => {
          setIsQrCameraShow(false);
          readKzkQrCode(qrCode, selectedBarcode);
        }}
        onHide={() => setIsQrCameraShow(false)}
      />
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
  qrContainer: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    top: 0,
    left: 45,
  },
  expandContainer: {
    justifyContent: "center",
    width: 35,
    alignItems: "flex-end",
  },
});

const CloseIco = (props: any) => {
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
      <FontAwesomeIcon icon="close" size={60} color={"#fff"} />
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

import {
  AppButton,
  AppCard,
  AppCheckBox,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,Clipboard,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideInRight,
} from "react-native-reanimated";
import { AntDesign, Entypo, FontAwesome, Fontisto } from "../../components";
import linq from "linq";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { Portal } from "react-native-portalize";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useOmsService } from "../../contexts/OmsService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import CargoConsensusDatePopup from "./partials/CargoConsensusDatePopup";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import LinearGradient from "../LinearGradient/LinearGradientView";
import MainCamera from "../../components/MainCamera";

const CargoConsensus: React.FC = (props) => {
  const OmsService = useOmsService();
  const MessageBox = useMessageBoxService();
  const ApplicationGlobalService = useApplicationGlobalService();
  const [showCargoPopup, setShowCargoPopup] = useState(false);
  const [cargoCompany, setCargoCompany] = useState(
    ApplicationGlobalService.cargoList.filter(
      (x) =>
        x.SalesOrganization === ApplicationGlobalService.getSalesOrganization()
    )[0]
  );
  const [isChecked, setChecked] = useState(true);
  const [isInitialize, setInitialize] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string>();
  const [details, setDetails] = useState<any>();
  const [showConfirmConsensus, setShowConfirmConsensus] = useState(false);
  const [showReadOrderPopup, setShowReadOrderPopup] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [textColor, setTextColor] = useState("#A2A2A2");
  const [copyText, setCopyText] = useState('')
  useEffect(() => {
    const Initialize = () => {
      OmsService.omsConsensusStartDate = new Date();
      OmsService.getCargoConsensus(
        ApplicationGlobalService.cargoList.filter(
          (x) =>
            x.SalesOrganization ===
            ApplicationGlobalService.getSalesOrganization()
        )[0].CargoCompany,
        isChecked
      );
      setInitialize(true);
    };
    if (!isInitialize) Initialize();
  }, [isInitialize, OmsService.cargoConsensusRes]);

  const copyToClipboard = async (code: string) => {
    await Clipboard.setString(code);
    setCopyText(code)
    setTextColor("#00FF00");
    setTimeout(() => {
      setTextColor("#A2A2A2");
    }, 3000);
  };

  const onShowPopup = async (orderNo: string) => {
    setShowDetailPopup(true);

    setDetailLoading(true);
    setDetailError(undefined);
    OmsService.GetOrderProductList(orderNo)
      .then((x) => {
        setDetails(x);
      })
      .catch((x) => {
        setDetailError(translate("errorMsgs.unexceptedError"));
      })
      .finally(() => setDetailLoading(false));
  };

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


  const ConsensusCard: React.FC<any> = (props) => {
    return (
      <Animated.View
        key={props.ID + "_" + props.index}
        entering={SlideInRight.delay(props.index * 100).duration(300)}
      >
        <AppCard>
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {/* <AntDesign name="caretright" size={20} color={'#dedede'} /> */}
              <AppText
                selectable
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: copyText === props.OrderNo ? textColor : '#707070'
                }}
                onPress={() => copyToClipboard(props.OrderNo)}
              >
                {props.OrderNo}{" "}
                {props.ZplCodeCount && props.ZplCodeCount > 1
                  ? "(Parçalanan Adet: " + props.ZplCodeCount + " )"
                  : undefined}
              </AppText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "row" }}>
                <AppText selectable>
                  {translate("OmsCargoConsensus.cargo")} :{" "}
                  {props.CargoCompany}
                </AppText>
              </View>
            </View>
          </View>
          <View style={{ paddingTop: 10 }}>
            <AppText selectable style={{ fontFamily: "Poppins_500Medium" }}>
              {translate("OmsCargoConsensus.omsBarcode")} :{" "}
              {props.CargoBarcode}
            </AppText>
            <AppText selectable style={{ fontFamily: "Poppins_500Medium" }}>
              {translate("OmsCargoConsensus.AcceptNo")} :{" "}
              {props.AccetptenceNo}
            </AppText>
            <AppText onPress={() => copyToClipboard(props.IBMBarcode)} selectable style={{ fontFamily: "Poppins_500Medium", color: copyText === props.IBMBarcode ? textColor : '#A2A2A2' }}>
              {"IBM NO"} :{" "}
              {props.IBMBarcode}
            </AppText>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#dedede",
              marginVertical: 14,
            }}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <AppButton
                title={translate("OmsCargoConsensus.generateBarcode")}
                buttonColorType={ColorType.Brand}
                style={{ height: 40, paddingHorizontal: 10 }}
                textStyle={{ fontSize: 13 }}
                onPress={() => OmsService.printZpl(props.OrderNo)}
              />
              <AppButton
                title={translate("OmsCargoConsensus.seeContent")}
                buttonColorType={ColorType.Brand}
                style={{ height: 40, paddingHorizontal: 10, marginLeft: 10 }}
                textStyle={{ fontSize: 13 }}
                onPress={props.onShowProductListPopup}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!ApplicationGlobalService.omsManuelCargoConsensus && isChecked && props.ZplCodeCount > 1 &&
                <AppText style={{ marginRight: 10, color: "red", fontFamily: "Poppins_600SemiBold" }}>{OmsService.selectedCensusListTemp.find(x => x.orderNo === props.OrderNo) ? OmsService.selectedCensusListTemp.find(x => x.orderNo === props.OrderNo)?.quantity : 0} / {props.ZplCodeCount}</AppText>
              }
              <TouchableOpacity
                onPress={() =>
                  OmsService.setSelectedCensusListData("order", props.OrderNo)
                }
                disabled={
                  !ApplicationGlobalService.omsManuelCargoConsensus &&
                  isChecked &&
                  (!OmsService.selectedCensusListTemp.find(x => x.orderNo === props.OrderNo) ||
                    (OmsService.selectedCensusListTemp.find(x => x.orderNo === props.OrderNo) &&
                      OmsService.selectedCensusListTemp.find(x => x.orderNo === props.OrderNo)?.quantity !== parseInt(props.ZplCodeCount)))
                }
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    OmsService.selectedCensusList.findIndex(
                      (x) => x === props.OrderNo
                    ) >= 0
                      ? AppColor.FD.Functional.Success
                      : "rgba(0,0,0,.4)",
                  backgroundColor:
                    OmsService.selectedCensusList.findIndex(
                      (x) => x === props.OrderNo
                    ) >= 0
                      ? AppColor.FD.Functional.Success
                      : "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {OmsService.selectedCensusList.findIndex(
                  (x) => x === props.OrderNo
                ) >= 0 && <FontAwesome name="check" size={20} color={"#fff"} />}
              </TouchableOpacity>
            </View>
          </View>
        </AppCard>
      </Animated.View>
    );
  };

  const DetailProduct: React.FC<any> = (props) => {
    let sku = Number(props.SKUNo) - (Number(props.SKUNo) % 1000);
    if (sku > 100000000000) sku = sku / 1000;

    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#efefef",
          padding: 12,
          borderRadius: 5,
        }}
      >
        <Image
          source={{
            uri: "https://www.flo.com.tr/V1/product/image?sku=" + sku,
          }}
          style={{
            width: 60,
            height: 60,
          }}
          resizeMethod={"scale"}
          resizeMode={"cover"}
        />
        <View style={{ width: width - 180 }}>
          <AppText selectable numberOfLines={1} style={{ fontWeight: "500" }}>
            {props.ModelName}
          </AppText>
          <AppText selectable style={{ fontWeight: "500", fontSize: 13 }}>
            {props.BarcodeNo} / {props.SKUNo}
          </AppText>
          <AppText selectable style={{ fontWeight: "500", fontSize: 13 }}>
            {/* <AppText style={{fontWeight: 'bold'}}>Fiyat :</AppText> 100.00 |{' '} */}
            <AppText style={{ fontWeight: "bold" }}>
              {translate("OmsCargoConsensus.quantity")} :
            </AppText>{" "}
            {props.Quantity} |{" "}
            <AppText selectable style={{ fontWeight: "bold" }}>
              {translate("OmsCargoConsensus.bodySize")} :
            </AppText>{" "}
            {props.BodySize} |{" "}
            <AppText selectable style={{ fontWeight: "bold" }}>
              {translate("OmsCargoConsensus.color")} :
            </AppText>{" "}
            {props.Color} |{" "}
            <AppText selectable style={{ fontWeight: "bold" }}>
              {translate("OmsCargoConsensus.brand")} :
            </AppText>{" "}
            {props.Brand}
          </AppText>
        </View>
      </View>
    );
  };

  const readIBMorOrderNo = (data: string) => {
    OmsService.setSelectedCensusListTempData(data);
    setOrderNo("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

          <AppCheckBox
            checked={isChecked}
            onSelect={(res: boolean) => {
              setChecked(res);
              OmsService.getCargoConsensus(cargoCompany.CargoCompany, res);
            }}
          // title={translate("OmsCargoConsensus.cargoWaiting")}
          />
          <Pressable onPress={() => {
            setChecked(!isChecked);
            OmsService.getCargoConsensus(cargoCompany.CargoCompany, !isChecked);
          }}>
            <AppText style={{ fontSize: PerfectFontSize(12), marginLeft: 5 }}>{translate("OmsCargoConsensus.cargoWaiting")}</AppText>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {!ApplicationGlobalService.omsManuelCargoConsensus && isChecked ?
            <>
              <AppButton
                style={{ height: 40, paddingHorizontal: 10 }}
                buttonColorType={ColorType.Success}
                loading={OmsService.printContractLoadingState}
                textStyle={{ fontSize: PerfectFontSize(10) }}
                title={translate("OmsCargoConsensus.readOrders")}
                onPress={() => setShowReadOrderPopup(true)}
              />
              {OmsService.selectedCensusList.length > 0 &&
                <AppButton
                  style={{ height: 40, paddingHorizontal: 10, marginHorizontal: 5 }}
                  buttonColorType={ColorType.Success}
                  loading={OmsService.printContractLoadingState}
                  textStyle={{ fontSize: PerfectFontSize(10) }}
                  title={translate("OmsCargoConsensus.printSelected")}
                  onPress={() => setShowConfirmConsensus(true)}
                />
              }
            </>
            :
            <AppButton
              style={{ height: 40, paddingHorizontal: 10 }}
              buttonColorType={ColorType.Success}
              loading={OmsService.printContractLoadingState}
              textStyle={{ fontSize: PerfectFontSize(12) }}
              title={
                OmsService.selectedCensusList.length === 0 ||
                  OmsService.selectedCensusList.length ===
                  OmsService.cargoConsensusRes.length
                  ? translate("OmsCargoConsensus.generateConsensus")
                  : translate("OmsCargoConsensus.printSelected")
              }
              onPress={() => setShowConfirmConsensus(true)}
            />
          }


        </View>

      </View>
      <View style={styles.p}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={[
              styles.comboButton,
              { width: Dimensions.get("window").width - 100 },
            ]}
            onPress={() => setShowCargoPopup(true)}
          >
            <AppText selectable>
              {cargoCompany !== ""
                ? cargoCompany.FullCargoName
                : translate("OmsCargoConsensus.selectCargo")}
            </AppText>
            <View style={styles.downIco}>
              <Entypo name={"chevron-down"} size={30} color={"#fff"} />
            </View>
          </TouchableOpacity>
          <AppButton
            style={{ width: 54, height: 53 }}
            buttonColorType={ColorType.Brand}
            onPress={() => setShowDatePicker(true)}
          >
            <Fontisto name="date" size={23} color={"#fff"} />
          </AppButton>
        </View>
      </View>
      <View
        style={[
          styles.p,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          },
        ]}
      >
        <AppText
          labelColorType={ColorType.Brand}
          style={{ fontFamily: "Poppins_700Bold", fontSize: 15 }}
        >
          {
            OmsService.cargoConsensusRes.filter((x) =>
              x.OrderNo.includes(searchQuery)
            ).length
          }
          <AppText>
            {"  "}
            {translate("OmsCargoConsensus.numberOrderList")}
          </AppText>
        </AppText>
        {(!isChecked || ApplicationGlobalService.omsManuelCargoConsensus) &&
          <AppButton
            onPress={() => OmsService.setSelectedCensusListData("all", 0)}
            textStyle={{ fontSize: PerfectFontSize(12) }}
            style={{ height: 40, paddingHorizontal: 10 }}
            buttonColorType={ColorType.Success}
            title={
              OmsService.selectedCensusList.length ===
                OmsService.cargoConsensusRes.length
                ? translate("OmsCargoConsensus.deSelect")
                : translate("OmsCargoConsensus.selectAll")
            }
          />
        }
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
        <FloTextBoxNew
          style={{
            height: 50,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,.4)",
            padding: 3,
            borderRadius: 5,
            backgroundColor: "#fff",
            fontSize: 15,
            paddingHorizontal: 10,
          }}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={translate("OmsCargoConsensus.search")}
        />
      </View>
      {OmsService.isConsensusCargoLoading ? (
        <ActivityIndicator size={"large"} color={AppColor.FD.Brand.Solid} />
      ) : (
        <FlatList
          nestedScrollEnabled
          data={OmsService.cargoConsensusRes.filter((x) =>
            x.OrderNo.includes(searchQuery)
          )}
          keyExtractor={(item) => item.orderNo}
          renderItem={({ item, index }) => {
            return (
              <ConsensusCard
                onShowProductListPopup={() => onShowPopup(item.OrderNo)}
                {...item}
                key={`${item.orderNo}`}
                index={index}
              />
            );
          }}
        />
      )}

      {showCargoPopup && (
        <Portal>
          <Animated.View
            entering={FadeIn.duration(200)}
            style={{
              position: "absolute",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,.4)",
            }}
          >
            <Animated.View
              entering={SlideInDown.delay(100).duration(200)}
              style={{
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                width: Dimensions.get("window").width - 40,
                minHeight: 100,
                borderRadius: 10,
                padding: 20,
              }}
            >
              {ApplicationGlobalService.cargoList
                .filter(
                  (x) =>
                    x.SalesOrganization ===
                    ApplicationGlobalService.getSalesOrganization()
                )
                .map((x, index) => {
                  return (
                    <View key={index}>
                      <AppButton
                        onPress={() => {
                          setShowCargoPopup(false);
                          setCargoCompany(x);
                          // OmsService.omsConsensusStartDate = new Date();
                          OmsService.getCargoConsensus(
                            x.CargoCompany,
                            isChecked
                          );
                        }}
                        key={x.CargoCompany}
                        transparent
                        style={{
                          borderBottomWidth: 1,
                          borderColor: "rgba(0,0,0,.2)",
                          justifyContent: "flex-start",
                          marginHorizontal: 10,
                          height: 40,
                        }}
                      >
                        <AppText selectable>{x.FullCargoName}</AppText>
                      </AppButton>
                    </View>
                  );
                })}

              <AppButton
                style={{ marginTop: 20 }}
                buttonColorType={ColorType.Danger}
                title={translate("messageBox.cancel")}
                onPress={() => setShowCargoPopup(false)}
              />
            </Animated.View>
          </Animated.View>
        </Portal>
      )}

      {showDatePicker && (
        <CargoConsensusDatePopup
          onClose={() => {
            setShowDatePicker(false);
            OmsService.getCargoConsensus(cargoCompany.CargoCompany, isChecked);
          }}
        />
      )}

      {showDetailPopup && (
        <Portal>
          <View
            style={{
              position: "absolute",
              width,
              height,
              backgroundColor: "rgba(0,0,0,.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "transparent",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  // padding: 20,
                  borderRadius: 10,
                  minHeight: 150,
                  width: width - 40,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eaeaea",
                  }}
                >
                  <AppText
                    style={{ fontFamily: "Poppins_600SemiBold", fontSize: 15 }}
                  >
                    {translate("OmsCargoConsensus.productList")}
                  </AppText>
                  <TouchableOpacity
                    onPress={() => setShowDetailPopup(false)}
                    style={{
                      backgroundColor: "rgba(0,0,0,.4)",
                      padding: 5,
                      borderRadius: 40,
                    }}
                    hitSlop={{ bottom: 15, right: 15, left: 15, top: 15 }}
                  >
                    <AntDesign name={"close"} color={"#fff"} size={20} />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                  {detailLoading && <ActivityIndicator />}
                  {!detailLoading && detailError === undefined && (
                    <React.Fragment>
                      <FlatList
                        data={details}
                        renderItem={({ item }) => <DetailProduct {...item} />}
                      />
                    </React.Fragment>
                  )}
                  {detailError !== undefined && (
                    <AppText
                      selectable
                      style={{ fontSize: 15, fontFamily: "Poppins_400Regular" }}
                    >
                      {detailError}
                    </AppText>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Portal>
      )}

      {showConfirmConsensus && (
        <Portal>
          <View
            style={{
              position: "absolute",
              width: width,
              bottom: 0,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "center",
                height: 150,
              }}
            >
              <AppText
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: PerfectFontSize(16),
                  marginHorizontal: 10,
                  marginBottom: 20,
                }}
              >
                {translate(
                  "OmsCargoConsensus.iConfirmThatTheCourierHasArrived"
                )}
              </AppText>
              <View style={{ flexDirection: "row" }}>
                <AppButton
                  title={translate("warehouseRequest.cancel")}
                  style={{
                    width: Platform.OS === "web" ? 180 : width / 2 - 20,
                    marginRight: 5,
                  }}
                  onPress={() => setShowConfirmConsensus(false)}
                  buttonColorType={ColorType.Danger}
                />
                <AppButton
                  title={translate("warehouseRequest.yes")}
                  style={{
                    width: Platform.OS === "web" ? 180 : width / 2 - 20,
                    marginLeft: 5,
                  }}
                  onPress={() => {
                    if (!ApplicationGlobalService.omsManuelCargoConsensus && isChecked) {
                      const filterList = OmsService.cargoConsensusRes.filter(
                        (x) => OmsService.selectedCensusList.includes(x.OrderNo)
                      );
                      const item = linq
                        .from(filterList)
                        .select((x: any) => {
                          return {
                            OrderNo: x.OrderNo,
                            AccetptenceNo: x.AccetptenceNo,
                          };
                        })
                        .toArray();
                      OmsService.printContract(item).then((x) => {
                        if (x) {
                          MessageBox.show(
                            translate("OmsCargoConsensus.printSuccesful")
                          );
                          OmsService.setSelectedCensusListData("remove", 0);
                          OmsService.getCargoConsensus(
                            cargoCompany.CargoCompany,
                            isChecked
                          );
                        }
                        setShowConfirmConsensus(false);
                      });
                    } else {
                      if (OmsService.selectedCensusList.length > 0) {
                        const filterList = OmsService.cargoConsensusRes.filter(
                          (x) => OmsService.selectedCensusList.includes(x.OrderNo)
                        );
                        const item = linq
                          .from(filterList)
                          .select((x: any) => {
                            return {
                              OrderNo: x.OrderNo,
                              AccetptenceNo: x.AccetptenceNo,
                            };
                          })
                          .toArray();
                        OmsService.printContract(item).then((x) => {
                          if (x) {
                            MessageBox.show(
                              translate("OmsCargoConsensus.printSuccesful")
                            );
                            OmsService.setSelectedCensusListData("remove", 0);
                            OmsService.getCargoConsensus(
                              cargoCompany.CargoCompany,
                              isChecked
                            );
                          }
                          setShowConfirmConsensus(false);
                        });
                      }
                      else {
                        const item = linq
                          .from(OmsService.cargoConsensusRes)
                          .select((x: any) => {
                            return {
                              OrderNo: x.OrderNo,
                              AccetptenceNo: x.AccetptenceNo,
                            };
                          })
                          .toArray();
                        OmsService.printContract(item).then((x) => {
                          if (x) {
                            MessageBox.show(
                              translate("OmsCargoConsensus.printSuccesful")
                            );
                            OmsService.setSelectedCensusListData("remove", 0);
                            OmsService.getCargoConsensus(
                              cargoCompany.CargoCompany,
                              isChecked
                            );
                          }
                          setShowConfirmConsensus(false);
                        });
                      }
                    }
                  }}
                  buttonColorType={ColorType.Brand}
                />
              </View>
            </View>
          </View>
        </Portal>
      )}

      {showReadOrderPopup && (
        <View
          style={{
            position: "absolute",
            width,
            height,
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
              marginBottom: 100
            }}
          >
            <KeyboardAvoidingView keyboardVerticalOffset={40} behavior="position">
              <View
                style={{
                  width: Dimensions.get("window").width - 40,
                  backgroundColor: "#fff",
                  minHeight: 100,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  maxHeight: 500,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                  }}
                  onPress={() => setShowReadOrderPopup(false)}
                >
                  <FontAwesome name="times-circle" size={36} color="red" />
                </TouchableOpacity>
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
                    {translate("OmsCargoConsensus.pleaseReadIBMOrOrderNo")}
                  </AppText>
                  <TouchableOpacity
                    disabled={OmsService.isPackageLoading}
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
                    {OmsService.selectedCensusListTemp.reduce((total, item) => total + item.quantity, 0) > 0 &&
                      <AppText style={{ color: "red", fontFamily: "Poppins_600SemiBold", fontSize: PerfectFontSize(14) }}>
                        {translate("OmsCargoConsensus.qtyReadPackage", { qty: OmsService.selectedCensusListTemp.reduce((total, item) => total + item.quantity, 0) })}
                      </AppText>
                    }
                    <View style={{ marginTop: 10 }}>
                      <AppText>
                        IBM/Sipariş No
                      </AppText>
                      <FloTextBoxNew
                        value={orderNo}
                        onChangeText={setOrderNo}
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
                    <AppButton
                      title={translate("OmsCargoConsensusDatePopup.ok")}
                      buttonColorType={ColorType.Success}
                      onPress={() => readIBMorOrderNo(orderNo)}
                      loading={OmsService.isPackageLoading}
                      style={{ marginTop: 20 }}
                    />
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      )
      }

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          readIBMorOrderNo(barcode);
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />
    </View >
  );
};

export default CargoConsensus;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  p: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  comboButton: {
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#c1bdbd",
    height: 54,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    borderRadius: 5,
  },
  downIco: {
    width: 44,
    height: 54,
    backgroundColor: "#919191",
    borderRadius: 5,
    opacity: 0.42,
    justifyContent: "center",
    alignItems: "center",
  },
});

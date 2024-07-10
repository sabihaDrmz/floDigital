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
  ScrollView,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideInRight,
} from "react-native-reanimated";
import { AntDesign, Entypo, FontAwesome, Fontisto } from "../../components";
import OmsService from "../../core/services/OmsService";
import { Observer } from "mobx-react";
import linq from "linq";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { Portal } from "react-native-portalize";
import OmsCargoConsensusDatePopup from "./Partials/OmsCargoConsensusDatePopup";
import { translate } from "../../helper/localization/locaizationMain";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import { PerfectFontSize } from "../../helper/PerfectPixel";
// Aras
// UPS
// Hepsi Jet

const CargoCompanies = ["ARAS", "UPS", "HJET", "BGK"];

const ConsensusCard: React.FC<any> = (props) => {
  return (
    <Animated.View
      key={props.ID + "_" + props.index}
      entering={SlideInRight.delay(props.index * 100).duration(300)}
    >
      <AppCard>
        <TouchableOpacity onPress={props.onShowProductListPopup}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {/* <AntDesign name="caretright" size={20} color={'#dedede'} /> */}
              <AppText
                selectable
                style={{
                  marginLeft: 10,
                  fontFamily: "Poppins_600SemiBold",
                  color: "#707070",
                }}
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
                  {translate("OmsCargoConsensus.cargo")} : {props.CargoCompany}
                </AppText>
              </View>
            </View>
          </View>
          <View style={{ paddingLeft: 10, paddingTop: 10 }}>
            <AppText selectable style={{ fontFamily: "Poppins_500Medium" }}>
              {translate("OmsCargoConsensus.omsBarcode")} : {props.CargoBarcode}
            </AppText>
            <AppText selectable style={{ fontFamily: "Poppins_500Medium" }}>
              {translate("OmsCargoConsensus.AcceptNo")} : {props.AccetptenceNo}
            </AppText>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 1,
            backgroundColor: "#dedede",
            marginVertical: 14,
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppButton
            title={translate("OmsCargoConsensus.generateBarcode")}
            buttonColorType={ColorType.Brand}
            style={{ height: 40, paddingHorizontal: 20 }}
            textStyle={{ fontSize: 13 }}
            onPress={() => OmsService.printZpl(props.OrderNo)}
          />
          <Observer>
            {() => {
              const index = OmsService.selectedCensusList.findIndex(
                (x) => x === props.OrderNo
              );
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (index < 0)
                      OmsService.selectedCensusList.push(props.OrderNo);
                    else
                      OmsService.selectedCensusList =
                        OmsService.selectedCensusList.filter(
                          (x) => x !== props.OrderNo
                        );
                  }}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor:
                      index >= 0
                        ? AppColor.FD.Functional.Success
                        : "rgba(0,0,0,.4)",
                    backgroundColor:
                      index >= 0 ? AppColor.FD.Functional.Success : "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {index >= 0 && (
                    <FontAwesome name="check" size={20} color={"#fff"} />
                  )}
                </TouchableOpacity>
              );
            }}
          </Observer>
        </View>
      </AppCard>
    </Animated.View>
  );
};

const OmsCargoConsensus: React.FC = (props) => {
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
  useEffect(() => {
    const Initialize = () => {
      OmsService.omsConsensusStartDate = new Date();
      OmsService.getCargoConsensus("ARAS", isChecked);
    };
    if (!isInitialize) Initialize();
  }, [isInitialize]);

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

  return (
    <View style={styles.container}>
      <ScrollView
        nestedScrollEnabled
        style={{
          height: showConfirmConsensus
            ? Dimensions.get("window").height - 300
            : Dimensions.get("window").height,
        }}
      >
        <View style={styles.header}>
          <AppCheckBox
            checked={isChecked}
            onSelect={(res: boolean) => {
              setChecked(res);
              // OmsService.omsConsensusStartDate = new Date();
              OmsService.getCargoConsensus(cargoCompany.CargoCompany, res);
            }}
            title={translate("OmsCargoConsensus.cargoWaiting")}
          />
          <Observer>
            {() => (
              <AppButton
                style={{ height: 40, paddingHorizontal: 20 }}
                buttonColorType={ColorType.Success}
                loading={OmsService.printContractLoadingState}
                textStyle={{ fontSize: 13 }}
                title={
                  OmsService.selectedCensusList.length === 0 ||
                    OmsService.selectedCensusList.length ===
                    OmsService.cargoConsensusRes.length
                    ? translate("OmsCargoConsensus.generateConsensus")
                    : translate("OmsCargoConsensus.printSelected")
                }
                onPress={() => setShowConfirmConsensus(true)}
              />
            )}
          </Observer>
        </View>
        <View style={styles.p}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
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
          <Observer>
            {() => (
              <>
                <AppText
                  labelColorType={ColorType.Brand}
                  style={{ fontFamily: "Poppins_700Bold", fontSize: 15 }}
                >
                  {OmsService.cargoConsensusRes.length}
                  <AppText>
                    {"  "}
                    {translate("OmsCargoConsensus.numberOrderList")}
                  </AppText>
                </AppText>
                <AppButton
                  onPress={() =>
                    OmsService.selectedCensusList.length ===
                      OmsService.cargoConsensusRes.length
                      ? (OmsService.selectedCensusList = [])
                      : (OmsService.selectedCensusList = linq
                        .from(OmsService.cargoConsensusRes)
                        .select((x) => x.OrderNo)
                        .toArray())
                  }
                  textStyle={{ fontSize: 13 }}
                  style={{ height: 40, paddingHorizontal: 20 }}
                  buttonColorType={ColorType.Success}
                  title={
                    OmsService.selectedCensusList.length ===
                      OmsService.cargoConsensusRes.length
                      ? translate("OmsCargoConsensus.deSelect")
                      : translate("OmsCargoConsensus.selectAll")
                  }
                />
              </>
            )}
          </Observer>
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
        <Observer>
          {() =>
            OmsService.isConsensusCargoLoading ? (
              <ActivityIndicator
                size={"large"}
                color={AppColor.FD.Brand.Solid}
              />
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
            )
          }
        </Observer>
      </ScrollView>
      {showCargoPopup && (
        <View
          style={{
            position: "absolute",
            ...Dimensions.get("window"),
            height: Dimensions.get("window").height - 160,
          }}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            style={{
              flex: 1,
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
              <ScrollView>
                {ApplicationGlobalService.cargoList
                  .filter(
                    (x) =>
                      x.SalesOrganization ===
                      ApplicationGlobalService.getSalesOrganization()
                  )
                  .map((x, index) => {
                    return (
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
                    );
                  })}
              </ScrollView>
              <AppButton
                style={{ marginTop: 20 }}
                buttonColorType={ColorType.Danger}
                title={translate("messageBox.cancel")}
                onPress={() => setShowCargoPopup(false)}
              />
            </Animated.View>
          </Animated.View>
        </View>
      )}
      {showDatePicker && (
        <OmsCargoConsensusDatePopup
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
        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 20,
            paddingVertical: 30,
            alignItems: "center",
            justifyContent: "center",
            width: width,
            height: 150,
          }}
        >
          <View>
            <AppText
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: PerfectFontSize(16),
                marginHorizontal: 10,
                marginBottom: 20,
              }}
            >
              {translate("OmsCargoConsensus.iConfirmThatTheCourierHasArrived")}
            </AppText>
            <View style={{ flexDirection: "row" }}>
              <AppButton
                title={translate("warehouseRequest.cancel")}
                style={{
                  flex: 1,
                  marginRight: 4,
                }}
                onPress={() => setShowConfirmConsensus(false)}
                buttonColorType={ColorType.Danger}
              />
              <AppButton
                title={translate("warehouseRequest.yes")}
                style={{
                  flex: 1,
                  marginLeft: 4,
                }}
                onPress={() => {
                  if (OmsService.selectedCensusList.length > 0) {
                    const filterList = OmsService.cargoConsensusRes.filter(
                      (x) => OmsService.selectedCensusList.includes(x.OrderNo)
                    );
                    const item = linq
                      .from(filterList)
                      .select((x) => {
                        return {
                          OrderNo: x.OrderNo,
                          AccetptenceNo: x.AccetptenceNo,
                        };
                      })
                      .toArray();
                    OmsService.printContract(item).then((x) => {
                      if (x) {
                        MessageBoxNew.show(
                          translate("OmsCargoConsensus.printSuccesful")
                        );
                        OmsService.selectedCensusList = [];
                        OmsService.getCargoConsensus(
                          cargoCompany.CargoCompany,
                          isChecked
                        );
                      }
                      setShowConfirmConsensus(false);
                    });
                  } else {
                    const item = linq
                      .from(OmsService.cargoConsensusRes)
                      .select((x) => {
                        return {
                          OrderNo: x.OrderNo,
                          AccetptenceNo: x.AccetptenceNo,
                        };
                      })
                      .toArray();
                    OmsService.printContract(item).then((x) => {
                      if (x) {
                        MessageBoxNew.show(
                          translate("OmsCargoConsensus.printSuccesful")
                        );
                        OmsService.selectedCensusList = [];
                        OmsService.getCargoConsensus(
                          cargoCompany.CargoCompany,
                          isChecked
                        );
                      }
                      setShowConfirmConsensus(false);
                    });
                  }
                }}
                buttonColorType={ColorType.Brand}
              />
            </View>
          </View>
        </View>
      )}
    </View>
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
export default OmsCargoConsensus;
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

import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { BlurView } from "expo-blur";
import {
  AppButton,
  AppColor,
  AppComboBox,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import moment from "moment";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Actions } from "react-native-router-flux";
import Svg, { Defs, G, Path } from "react-native-svg";
import { FloTextBox } from "../../components";
import { SearchQR } from "../../components/CustomIcons/MainPageIcons";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import AccountService from "../../core/services/AccountService";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import EasyReturnService from "../../core/services/EasyReturnService";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import {
  getLocale,
  translate,
} from "../../helper/localization/locaizationMain";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import { Platform } from "expo-modules-core";
import { Portal } from "react-native-portalize";

const FindFiche: React.FC = (props) => {
  const [phone, setPhone] = useState("0");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStorePopup, setShowStorePopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [query, setQuery] = useState("");

  const paymentTypes = ApplicationGlobalService.allPaymentTypes.map((x) => {
    return {
      value: x,
      key: x.id.toString(),
      title: x.title,
    };
  });

  const openCamera = () => {
    Actions["easyReturnCamera"]({
      onReadComplete: (barcode: string) => {
        setQuery(barcode);
        Actions.popTo("erFindFiche");
      },
      headerTitle: translate("OmsBarcodeSearchBar.barcodeScanning"),
    });
  };
  return (
    <Observer>
      {() => {
        return (
          <View style={{ flex: 1 }}>
            <FloHeaderNew
              headerType="standart"
              enableButtons={["back"]}
              headerTitle="Belge Bul"
            />
            <KeyboardAwareScrollView>
              <View style={styles.container}>
                <View style={{ padding: 20 }}>
                  <AppText style={styles.titleText}>Telefon Numarası</AppText>
                  <FloTextBox
                    style={{
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      borderColor: "rgb(228,228,228)",
                      paddingBottom: 0,
                      lineHeight: 0,
                    }}
                    value={phone}
                    onChangeText={setPhone}
                    mask="cel-phone"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "rgb(228,228,228)",
                      width: 130,
                    }}
                  />
                  <AppText style={{ marginHorizontal: 20 }}>veya</AppText>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "rgb(228,228,228)",
                      width: 130,
                    }}
                  />
                </View>
                <View style={{ padding: 20 }}>
                  <AppText style={styles.titleText}>Başlangıç Tarih</AppText>
                  {Platform.OS === "web" ? (
                    <AppTextBox
                      onChangeText={(text) => {
                        if (text.length === "gg/aa/yyyy".length) {
                          const splitted = text.split("/");

                          const date = new Date(
                            `${splitted[2]}-${splitted[1]}-${splitted[0]}`
                          );

                          EasyReturnService.findFicheRequest.shippingDate =
                            moment(date).format();
                        }
                      }}
                      placeholder="gg/aa/yyyy"
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setShowDatePicker(true);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 20,
                        borderBottomWidth: 1,
                        borderColor: "rgb(228,228,228)",
                        paddingBottom: 10,
                      }}
                    >
                      <DateIco />
                      <AppText selectable style={{ marginLeft: 10 }}>
                        {selectedDate !== ""
                          ? selectedDate
                          : "Başlangıç Tarih Seçin"}
                      </AppText>
                    </TouchableOpacity>
                  )}
                  <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    cancelTextIOS={translate(
                      `easyRerturnFindFicheManual.dtpCancel`
                    )}
                    confirmTextIOS={translate(
                      `easyRerturnFindFicheManual.dtpOk`
                    )}
                    headerTextIOS={translate(
                      `easyRerturnFindFicheManual.dtpTitle`
                    )}
                    neutralButtonLabel={"Temizle"}
                    locale={getLocale()}
                    onConfirm={(res: any) => {
                      EasyReturnService.findFicheRequest.shippingDate =
                        moment(res).format();
                      setShowDatePicker(false);
                      setSelectedDate(
                        res.toLocaleString(getLocale(), {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      );
                      setStartDate(res);
                    }}
                    onCancel={() => {
                      setShowDatePicker(false);
                      setSelectedDate("");
                    }}
                  />

                  <AppText style={[styles.titleText, { marginTop: 30 }]}>
                    Bitiş Tarihi
                  </AppText>
                  {Platform.OS === "web" ? (
                    <AppTextBox
                      onChangeText={(text) => {
                        if (text.length === "gg/aa/yyyy".length) {
                          const splitted = text.split("/");

                          const date = new Date(
                            `${splitted[2]}-${splitted[1]}-${splitted[0]}`
                          );

                          setEndDate(date);
                        }
                      }}
                      placeholder="gg/aa/yyyy"
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setShowEndDatePicker(true);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 20,
                        borderBottomWidth: 1,
                        borderColor: "rgb(228,228,228)",
                        paddingBottom: 10,
                      }}
                    >
                      <DateIco />
                      <AppText style={{ marginLeft: 10 }}>
                        {selectedEndDate !== ""
                          ? selectedEndDate
                          : "Bitiş Tarih Seçin"}
                      </AppText>
                    </TouchableOpacity>
                  )}
                  <DateTimePickerModal
                    isVisible={showEndDatePicker}
                    mode="date"
                    cancelTextIOS={translate(
                      `easyRerturnFindFicheManual.dtpCancel`
                    )}
                    confirmTextIOS={translate(
                      `easyRerturnFindFicheManual.dtpOk`
                    )}
                    headerTextIOS={translate(
                      `easyRerturnFindFicheManual.dtpTitle`
                    )}
                    neutralButtonLabel={"Temizle"}
                    locale={getLocale()}
                    onConfirm={(res: any) => {
                      setShowEndDatePicker(false);
                      setEndDate(res);
                      setSelectedEndDate(
                        res.toLocaleString(getLocale(), {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      );
                    }}
                    onCancel={() => {
                      setShowEndDatePicker(false);
                      setSelectedEndDate("");
                    }}
                  />

                  <View
                    style={{
                      marginTop: 20,
                      elevation: showStorePopup
                        ? 200
                        : showPaymentPopup
                        ? -1
                        : 0,
                      zIndex: showStorePopup ? 200 : showPaymentPopup ? -1 : 0,
                    }}
                  >
                    <AppButton
                      onPress={() => {
                        setShowStorePopup(true);
                      }}
                      transparent
                      style={{
                        borderWidth: 1,
                        borderColor: "#C1BDBD",
                        borderRadius: 4,
                        height: 44,
                        marginLeft: 10,
                        marginRight: 10,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingLeft: 15,
                      }}
                    >
                      <View>
                        <AppText selectable>
                          {EasyReturnService.findFicheRequest.shippingStore
                            ? ApplicationGlobalService.allStore.find(
                                (x) =>
                                  x.werks ===
                                  EasyReturnService.findFicheRequest
                                    .shippingStore
                              )?.name
                            : "Mağaza Seç"}
                        </AppText>
                      </View>
                      <View>
                        <View style={styles.dropDownButton}>
                          <DownIco />
                        </View>
                      </View>
                    </AppButton>
                  </View>
                  <View
                    style={{
                      marginTop: 20,
                      elevation: showStorePopup ? -1 : 0,
                      zIndex: showStorePopup ? -1 : 0,
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        borderColor: "#b7b5b5",
                        borderWidth: 1,
                        marginLeft: 0,
                        marginRight: 20,
                        height: 45,
                        borderRadius: 30,
                        paddingLeft: 20,
                        paddingRight: 20,
                        marginTop: 40,
                      }}
                    >
                      <TextInput
                        maxLength={13}
                        placeholderTextColor={AppColor.FD.Text.Default}
                        selectionColor={AppColor.FD.Brand.Solid}
                        underlineColorAndroid={"transparent"}
                        placeholder={"Tara veya Ürün Kodu gir"}
                        onChangeText={setQuery}
                        value={query}
                        keyboardType={"number-pad"}
                      />
                      <AppButton
                        activeOpacity={0.8}
                        transparent
                        onPress={openCamera}
                        style={{
                          position: "absolute",
                          right: -25,
                          justifyContent: "center",
                          alignItems: "center",
                          width: 65,
                          height: 65,
                        }}
                      >
                        <SearchQR />
                        <View
                          style={{
                            borderWidth: 1,
                            width: 60,
                            height: 60,
                            position: "absolute",
                            borderRadius: 30,
                            borderColor: "rgba(0,0,0,.3)",
                            top: 2,
                          }}
                        ></View>
                      </AppButton>
                    </View>
                  </View>
                  <AppButton
                    style={{ marginTop: 30 }}
                    buttonColorType={ColorType.Brand}
                    loading={EasyReturnService.isLoading}
                    onPress={() => {
                      if (
                        phone === "0" &&
                        (startDate === undefined ||
                          endDate === undefined ||
                          query === "" ||
                          EasyReturnService.findFicheRequest.shippingStore ===
                            undefined ||
                          EasyReturnService.findFicheRequest.shippingStore ===
                            "")
                      ) {
                        MessageBoxNew.show(
                          "Lütfen tarih aralığı, mağaza ve barkod ile arama yapınız."
                        );
                        return;
                      }
                      let model = {
                        phone: phone === "0" ? "" : phone,
                        startDate: startDate,
                        endDate: endDate,
                        barcode: query,
                        storeNo: EasyReturnService.findFicheRequest
                          .shippingStore
                          ? Number(
                              EasyReturnService.findFicheRequest.shippingStore
                            )
                          : Number(AccountService.getUserStoreId()),
                      };

                      EasyReturnService.FindFiche(model).then(() => {});
                    }}
                    title="Sorgula"
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
            {showStorePopup && (
              <Portal>
                <BlurView
                  style={{
                    width,
                    height,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      flex: 1,
                      padding: 20,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        width: Dimensions.get("window").width - 40,
                        backgroundColor: "#fff",
                        padding: 16,
                        borderRadius: 10,
                        maxHeight: "60%",
                        marginTop: -150,
                      }}
                    >
                      <View style={{ height: 30 }}>
                        <AppButton
                          transparent
                          onPress={() => {
                            setShowStorePopup(false);
                          }}
                        >
                          <View
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 0,
                              width: 25,
                              height: 25,
                              backgroundColor: "rgba(0,0,0,.1)",
                              borderRadius: 12.5,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <AppText>X</AppText>
                          </View>
                        </AppButton>
                      </View>
                      <FlatList
                        data={ApplicationGlobalService.allStore}
                        renderItem={({ item }) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setShowStorePopup(false);
                                EasyReturnService.findFicheRequest.shippingStore =
                                  item.werks;
                              }}
                              style={{ paddingVertical: 10 }}
                            >
                              <AppText selectable>{item.name}</AppText>
                            </TouchableOpacity>
                          );
                        }}
                        ItemSeparatorComponent={() => (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: "rgba(0,0,0,.1)",
                            }}
                          />
                        )}
                      />
                      {EasyReturnService.findFicheRequest.shippingStore !==
                        undefined &&
                        EasyReturnService.findFicheRequest.shippingStore !==
                          null &&
                        EasyReturnService.findFicheRequest.shippingStore !==
                          "" && (
                          <AppButton
                            style={{ marginTop: 20 }}
                            onPress={() => {
                              setShowStorePopup(false);
                              EasyReturnService.findFicheRequest.shippingStore =
                                "";
                            }}
                            buttonColorType={ColorType.Danger}
                            title="Seçimi Kaldır"
                          />
                        )}
                    </View>
                  </View>
                </BlurView>
              </Portal>
            )}
          </View>
        );
      }}
    </Observer>
  );
};
export default FindFiche;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  titleText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  dropDownButton: {
    height: 44,
    width: 44,
    margin: 0,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#919191",
  },
});

const DateIco = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={14.646} height={14.626}>
      <Defs></Defs>
      <G id="UunPsr" transform="translate(1319.081 238.934)">
        <G
          id="Group_3108"
          data-name="Group 3108"
          transform="translate(-1319.081 -238.934)"
        >
          <Path
            id="Path_2215"
            data-name="Path 2215"
            className="cls-1"
            d="M-1316.826-237.826v-1.108h1.128v1.094h7.883v-1.095h1.128v1.11h.534a1.691 1.691 0 0 1 1.718 1.728v9.983a1.7 1.7 0 0 1-1.8 1.8h-11.109a1.681 1.681 0 0 1-1.733-1.713q-.01-5.042 0-10.084a1.686 1.686 0 0 1 1.756-1.719zm11.262 4.524h-12.386v7.146c0 .537.181.718.721.718h10.935c.557 0 .729-.173.729-.734v-6.831zm-1.119-2.28h-1.14v-1.1h-7.88v1.1h-1.131v-1.1c-.227 0-.418-.012-.608 0a.486.486 0 0 0-.49.448c-.022.589-.007 1.178-.007 1.767h12.372c0-.588.01-1.154 0-1.72a.487.487 0 0 0-.449-.489 6.521 6.521 0 0 0-.661 0z"
            transform="translate(1319.08 238.934)"
          />
          <Path
            id="Path_2216"
            data-name="Path 2216"
            className="cls-1"
            d="M-1228.739-104h1.1v1.1h-1.1z"
            transform="translate(1233.261 110.756)"
          />
          <Path
            id="Path_2217"
            data-name="Path 2217"
            className="cls-1"
            d="M-1182.626-102.884h-1.094v-1.105h1.094z"
            transform="translate(1190.496 110.743)"
          />
          <Path
            id="Path_2218"
            data-name="Path 2218"
            className="cls-1"
            d="M-1138.749-102.747v-1.091h1.1v1.091z"
            transform="translate(1147.775 110.6)"
          />
          <Path
            id="Path_2219"
            data-name="Path 2219"
            className="cls-1"
            d="M-1093.748-104.022h1.1v1.1h-1.1z"
            transform="translate(1105.026 110.775)"
          />
          <Path
            id="Path_2220"
            data-name="Path 2220"
            className="cls-1"
            d="M-1273.668-59.011h1.1v1.1h-1.1z"
            transform="translate(1275.941 68.017)"
          />
          <Path
            id="Path_2221"
            data-name="Path 2221"
            className="cls-1"
            d="M-1228.643-59.014h1.1v1.1h-1.1z"
            transform="translate(1233.17 68.019)"
          />
          <Path
            id="Path_2222"
            data-name="Path 2222"
            className="cls-1"
            d="M-1183.746-57.748v-1.092h1.1v1.092z"
            transform="translate(1190.52 67.854)"
          />
          <Path
            id="Path_2223"
            data-name="Path 2223"
            className="cls-1"
            d="M-1138.754-57.76v-1.094h1.1v1.094z"
            transform="translate(1147.78 67.867)"
          />
          <Path
            id="Path_2224"
            data-name="Path 2224"
            className="cls-1"
            d="M-1092.652-57.745h-1.1v-1.1h1.1z"
            transform="translate(1105.028 67.855)"
          />
          <Path
            id="Path_2225"
            data-name="Path 2225"
            className="cls-1"
            d="M-1273.724-12.727v-1.09h1.1v1.09z"
            transform="translate(1275.994 25.085)"
          />
          <Path
            id="Path_2226"
            data-name="Path 2226"
            className="cls-1"
            d="M-1227.522-12.787h-1.087v-1.1h1.087z"
            transform="translate(1233.137 25.154)"
          />
          <Path
            id="Path_2227"
            data-name="Path 2227"
            className="cls-1"
            d="M-1182.558-12.832h-1.1v-1.1h1.1z"
            transform="translate(1190.435 25.195)"
          />
        </G>
      </G>
    </Svg>
  );
};

const DownIco: React.FC<{ color?: string }> = (props) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={17}
      height={9.795}
      {...props}
    >
      <Path
        d="M.359.388a1.217 1.217 0 0 1 1.7.008c5.246 4.615 7.59 4.615 12.813.041a1.2 1.2 0 0 1 2.1.5 1.213 1.213 0 0 1-.38 1.189l-7.25 7.3a1.185 1.185 0 0 1-1.71.007L.355 2.102A1.211 1.211 0 0 1 .362.387Z"
        fill={props.color || "#fff"}
        data-name="back_2 copy"
        opacity={0.422}
      />
    </Svg>
  );
};

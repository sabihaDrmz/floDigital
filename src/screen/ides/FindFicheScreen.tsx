import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import BlurView from "../../components/BlurView";
import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import Svg, { Defs, G, Path } from "react-native-svg";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { Portal } from "react-native-portalize";
import { getLocale, translate } from "../../helper/localization/locaizationMain";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { FloTextBox } from "../../components";
import { SearchQR } from "../../components/CustomIcons/MainPageIcons";
import MainCamera from "../../components/MainCamera";
import { useApplicationGlobalService } from '../../contexts/ApplicationGlobalService';
import { useAccountService } from '../../contexts/AccountService';
import { useMessageBoxService } from '../../contexts/MessageBoxService';
import { useEasyReturnService } from '../../contexts/EasyReturnService';

const FindFiche: React.FC = (props) => {
  const { allStore } = useApplicationGlobalService();
  const { show } = useMessageBoxService();
  const { getUserStoreId } = useAccountService();
  const { ErFindFiche, isLoading } = useEasyReturnService();
  const [phone, setPhone] = useState("0");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStorePopup, setShowStorePopup] = useState(false);
  const [query, setQuery] = useState("");
  const [isCameraShow, setIsCameraShow] = useState(false);

  const StorePopup: React.FC<{ visible: boolean; onHide: () => void }> = (
    props
  ) => {
    const [searchQuery, setSearchQuery] = useState("");

    if (!props.visible) return null;
    return (
      <BlurView
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
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
              height: "60%",
              marginTop: -150,
            }}
          >
            <View style={{ height: 30 }}>
              <AppButton transparent onPress={() => props.onHide()}>
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
            <View>
              <AppTextBox
                placeholder="Ara"
                onChangeText={setSearchQuery}
                value={searchQuery}
              ></AppTextBox>
            </View>
            <FlatList
              data={allStore.filter(
                (x) =>
                  searchQuery === "" ||
                  x.name.includes(searchQuery) ||
                  x.werks.includes(searchQuery)
              )}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      props.onHide();
                      setSelectedStore(item.werks);
                    }}
                    style={{ paddingVertical: 10 }}
                  >
                    <AppText
                      selectable
                    >{`${item.werks} - ${item.name}`}</AppText>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{ height: 1, backgroundColor: "rgba(0,0,0,.1)" }}
                />
              )}
            />
            {selectedStore !== "" && (
              <AppButton
                style={{ marginTop: 20 }}
                onPress={() => {
                  props.onHide();
                  setSelectedStore("");
                }}
                buttonColorType={ColorType.Danger}
                title="Seçimi Kaldır"
              />
            )}
          </View>
        </View>
      </BlurView>
    );
  };

  return (
    <>
      <FloHeaderNew headerType="standart" enableButtons={["back"]} />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{
            height: Dimensions.get("window").height - 250,
            padding: 30,
          }}
        >
          <View
            style={{
              padding: 20,
            }}
          >
            <AppText style={styles.titleText} labelColorType={ColorType.Brand}>
              Telefon Numarası
            </AppText>
            <FloTextBox
              style={{
                borderWidth: 1,
                borderColor: "rgb(228,228,228)",
                paddingBottom: 0,
                lineHeight: 0,
                backgroundColor: "#fff",
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
            <AppText style={styles.titleText} labelColorType={ColorType.Brand}>
              Başlangıç Tarih
            </AppText>
            {Platform.OS === "web" ? (
              <FloTextBox
                onChangeText={(text) => {
                  if (text.length === "gg/aa/yyyy".length) {
                    const splitted = text.split("/");

                    const date = new Date(
                      `${splitted[2]}-${splitted[1]}-${splitted[0]}`
                    );
                    if (date) {
                      setShowDatePicker(false);
                      setSelectedDate(moment(date).format("DD/MM/YYYY"));
                      setStartDate(date);
                    }
                  }
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "rgb(228,228,228)",
                  paddingBottom: 0,
                  lineHeight: 0,
                  backgroundColor: "#fff",
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
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: "rgb(228,228,228)",
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <AppText selectable>
                  {selectedDate !== "" ? selectedDate : "Başlangıç Tarih Seçin"}
                </AppText>
                <DownIco color="#000" />
              </TouchableOpacity>
            )}
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              cancelTextIOS={translate(`easyRerturnFindFicheManual.dtpCancel`)}
              confirmTextIOS={translate(`easyRerturnFindFicheManual.dtpOk`)}
              //@ts-ignore
              headerTextIOS={translate(`easyRerturnFindFicheManual.dtpTitle`)}
              neutralButtonLabel={"Temizle"}
              locale={getLocale()}
              onConfirm={(res: any) => {
                setShowDatePicker(false);
                setSelectedDate(moment(res).format("DD/MM/YYYY"));
                setStartDate(res);
              }}
              onCancel={() => {
                setShowDatePicker(false);
                setSelectedDate("");
              }}
            />

            <View
              style={{
                marginTop: 20,
                elevation: showStorePopup ? 200 : 0,
                zIndex: showStorePopup ? 200 : 0,
              }}
            >
              <AppButton
                onPress={() => {
                  setShowStorePopup(true);
                }}
                transparent
                style={{
                  borderWidth: 1,
                  borderColor: "rgb(228,228,228)",
                  borderRadius: 10,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 15,
                  backgroundColor: "#fff",
                }}
              >
                <AppText selectable>
                  {selectedStore
                    ? allStore.find(
                      (x) => x.werks === selectedStore
                    )?.name
                    : "Mağaza Seç"}
                </AppText>

                <DownIco color="#000" />
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
                  backgroundColor: "#fff",
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
                  onPress={() => setIsCameraShow(true)}
                  style={{
                    position: "absolute",
                    right: -25,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 65,
                    height: 65,
                  }}
                >
                  <View style={{ zIndex: 9999 }}>
                    <SearchQR />
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      width: 60,
                      height: 60,
                      position: "absolute",
                      borderRadius: 30,
                      borderColor: "rgba(0,0,0,.3)",
                      top: 2,
                      backgroundColor: "#fff",
                    }}
                  ></View>
                </AppButton>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            height: 120,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#000",
          }}
        >
          <AppButton
            style={{
              position: "absolute",
              bottom: 30,
              left: 30,
              right: 30,
            }}
            buttonColorType={ColorType.Brand}
            loading={isLoading}
            onPress={() => {
              if (phone === "0" && !selectedDate && !query && !selectedStore) {
                show(
                  "Telefon numarası yada diğer alanları eksiksiz doldurunuz."
                );
                return;
              }
              ErFindFiche({
                gsm: phone === "0" ? "" : phone,
                barcode: query,
                shippingDate: selectedDate,
                activeStore: getUserStoreId(),
                shippingStore: selectedStore !== "" ? selectedStore : undefined,
                receiptNumber: "",
              }).then(() => { });
            }}
            title="Sorgula"
          />
        </View>
        {showStorePopup && (
          <Portal>
            <StorePopup
              visible={showStorePopup}
              onHide={() => setShowStorePopup(false)}
            />
          </Portal>
        )}
      </View>

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          setQuery(barcode);
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />
    </>
  );
};
export default FindFiche;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
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

const DownIco: React.FC<{ color?: string }> = (props) => {
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={17}
      height={9.795}
      {...props}
    >
      <Path
        d="M.359.388a1.217 1.217 0 0 1 1.7.008c5.246 4.615 7.59 4.615 12.813.041a1.2 1.2 0 0 1 2.1.5 1.213 1.213 0 0 1-.38 1.189l-7.25 7.3a1.185 1.185 0 0 1-1.71.007L.355 2.102A1.211 1.211 0 0 1 .362.387Z"
        data-name="back_2 copy"
        opacity={0.422}
        fill={props.color || "#fff"}
      />
    </Svg>
  );
};

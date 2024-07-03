import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import { FloHeader } from "../../../../components/Header";
import EasyReturnService from "../../../../core/services/EasyReturnService";
import { PerfectPixelSize } from "../../../../helper/PerfectPixel";
import AppTextBox from "../../../../NewComponents/FormElements/AppTextBox";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../../../core/services/MessageBox";
const phonePrefix = [
  // Turk Telekom
  "501",
  "505",
  "506",
  "507",
  "551",
  // BIM Cell
  "552",
  "553",
  "554",
  "555",
  "559",
  // Bursa Mobile
  "516",
  // Turkcell
  "530",
  "531",
  "532",
  "533",
  "534",
  "535",
  "536",
  "537",
  "538",
  "539",
  // 61 Cell
  "561",
  // Vodafone
  "541",
  "542",
  "543",
  "544",
  "545",
  "546",
  "547",
  "548",
  "549",
  // KKTC Telsim
  "54285",
  "54286",
  "54287",
  // KKTC Turkcell
  "53383",
  "53384",
  "53385",
  "53386",
  "53387",
];

const removePhoneMask = (phone: string) => {
  if (phone === "") return phone;
  phone = phone.trim();
  if (phone === "") return phone;
  phone = phone.replace("(", "");
  phone = phone.replace(")", "");
  while (phone.indexOf(" ") > 0) phone = phone.replace(" ", "");
  phone = phone.startsWith("0") ? phone.substring(1) : phone;
  return phone;
};

const isPhone = (phone: string) => {
  phone = removePhoneMask(phone);

  return phone.startsWith("0")
    ? phone.length > 3 &&
        phonePrefix.filter(
          (x) =>
            x === phone.substring(0, 3) || x.includes(phone.substring(0, 3))
        ).length > 0
    : phone.length >= 3 &&
        phonePrefix.filter(
          (x) =>
            x === phone.substring(0, 3) || x.includes(phone.substring(0, 3))
        ).length > 0;
};
const { width, height } = Dimensions.get("window");
const FindFiche: React.FC = (props) => {
  const [ficheNumber, setFichenumber] = useState("");
  const [selectedButton, setSelectedButton] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    EasyReturnService.source = 2;
  });
  return (
    <View style={styles.container}>
      <FloHeader
        enableButtons={["back"]}
        headerTitle="İDES İşlemleri"
        headerType="standart"
      />
      <ScrollView style={{ width, height }}>
        <View style={{ margin: 25 }}>
          <AppButton
            title="İDES"
            buttonColorType={
              selectedButton == 1 ? ColorType.Brand : ColorType.Gray
            }
            onPress={() => {
              setSelectedButton(1);
            }}
          ></AppButton>

          <AppButton
            title="BELGE SORGULA"
            buttonColorType={
              selectedButton == 2 ? ColorType.Brand : ColorType.Gray
            }
            onPress={() => {
              setSelectedButton(2);
            }}
            style={{}}
          ></AppButton>
          <>
            <View style={{ padding: 20, marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  Actions["easyReturnCamera"]({
                    onReadComplete: (barcode: string) => {
                      setIsLoading(true);
                      if (Actions.currentScene === "easyReturnCamera")
                        Actions.pop();
                      if (isLoading) return;
                      if (selectedButton === 1) {
                        EasyReturnService.ErFindFicheResult(barcode, true).then(
                          () => setIsLoading(false)
                        );
                      } else {
                        EasyReturnService.CheckAUINumber(barcode).then(() =>
                          setIsLoading(false)
                        );
                      }
                    },
                  });
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 0,
                  marginBottom: PerfectPixelSize(30),
                }}
              >
                <Image
                  source={require("../../../../../assets/S.png")}
                  style={{
                    width: PerfectPixelSize(112),
                    height: PerfectPixelSize(103),
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <View
              style={{
                height: 1,
                width: width / 4,
                backgroundColor: "rgb(228, 228, 228)",
              }}
            />
            <AppText>veya</AppText>
            <View
              style={{
                height: 1,
                width: width / 4,
                backgroundColor: "rgb(228, 228, 228)",
              }}
            />
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <AppTextBox
              label={
                selectedButton == 1
                  ? "Fiş / Sipariş No"
                  : "Fiş / İDES / Telefon No"
              }
              value={ficheNumber}
              onChangeText={setFichenumber}
              format={isPhone(ficheNumber) ? "phone" : undefined}
              placeholder={
                selectedButton == 1
                  ? "Fiş / Sipariş No Giriniz "
                  : "Fiş / İDES / Telefon No Giriniz"
              }
            ></AppTextBox>
          </View>
        </View>

        <View>
          <AppButton
            style={{ marginHorizontal: 25, marginTop: 30 }}
            title={"Sorgula"}
            onPress={() => {
              if (ficheNumber === "") return;
              setIsLoading(true);
              EasyReturnService.CleanTransaction().then(() => {
                if (selectedButton === 2) {
                  if (removePhoneMask(ficheNumber) && isPhone(ficheNumber)) {
                    EasyReturnService.CheckAUINumber(
                      removePhoneMask(ficheNumber),
                      true
                    ).then(() => {
                      setIsLoading(false);
                    });
                  } else {
                    EasyReturnService.CheckAUINumber(ficheNumber).then(() => {
                      setIsLoading(false);
                    });
                  }
                } else {
                  EasyReturnService.ErFindFicheResult(ficheNumber, true).then(
                    () => {
                      setIsLoading(false);
                    }
                  );
                }
              });
            }}
            buttonColorType={ColorType.Brand}
            loading={isLoading}
            disabled={isLoading}
          />
          {/* {selectedButton == 1 && (
            <AppButton
              style={{ width: width / 2.5, borderRadius: 0 }}
              title={"Belge Bul"}
              onPress={() => {
                Actions["erFindFiche"]();
              }}
              buttonColorType={ColorType.Gray}
              loading={EasyReturnService.isRejectCargoLoading}
              disabled={EasyReturnService.isRejectCargoLoading}
            />
          )} */}
        </View>
      </ScrollView>
    </View>
  );
};
export default FindFiche;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

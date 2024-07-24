import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
import { PerfectPixelSize } from "../../helper/PerfectPixel";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import MainCamera from "../../components/MainCamera";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const FindFiche: React.FC = ({ }: any) => {
  const navigation = useNavigation();
  const { setSourceData, CleanTransaction, CheckAUINumber, ErFindFicheResult } = useEasyReturnService();
  const [ficheNumber, setFicheNumber] = useState("");
  const [selectedButton, setSelectedButton] = useState<1 | 2>(1);
  const [selectedRadio, setSelectedRadio] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCameraShow, setIsCameraShow] = useState(false);

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

  useEffect(() => {
    setSourceData(2);
  }, []);

  const customButtonAction = () => {
    navigation.navigate("Home" as never);
  };

  return (
    <View style={styles.container}>
      <FloHeaderNew
        enableButtons={["back"]}
        headerTitle="İDES İşlemleri"
        headerType="standart"
        customButtonActions={[
          {
            customAction: customButtonAction,
            buttonType: "back",
          },
        ]}
      />

      <KeyboardAwareScrollView bounces={false} style={{ width, height }}>
        <View style={{ margin: 25 }}>
          <AppButton
            title="İDES"
            buttonColorType={
              selectedButton == 1 ? ColorType.Brand : ColorType.Gray
            }
            onPress={() => {
              setSelectedButton(1);
              setSelectedRadio(1);
            }}
          ></AppButton>

          <AppButton
            title="BELGE SORGULA"
            buttonColorType={
              selectedButton == 2 ? ColorType.Brand : ColorType.Gray
            }
            onPress={() => {
              setSelectedButton(2);
              setSelectedRadio(1);
            }}
            style={{}}
          ></AppButton>
          <>
            <View style={{ padding: 20, marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => setIsCameraShow(true)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 0,
                  marginBottom: PerfectPixelSize(30),
                }}
              >
                <Image
                  source={require("../../assets/S.png")}
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 20,
              paddingHorizontal: 2,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                setSelectedRadio(1);
                setFicheNumber("");
              }}
            >
              <AppText
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: "#707070",
                  marginRight: 10,
                }}
              >
                Fiş No
              </AppText>
              <View
                style={{
                  width: 21,
                  height: 21,
                  borderRadius: 10.5,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ff8600",
                }}
              >
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 7.5,
                    backgroundColor: selectedRadio === 1 ? "#ff8600" : "#fff",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                setSelectedRadio(2);
                setFicheNumber("");
              }}
            >
              <AppText
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: "#707070",
                  marginRight: 10,
                }}
              >
                {selectedButton === 1 ? " Sipariş No" : "İDES No"}
              </AppText>
              <View
                style={{
                  width: 21,
                  height: 21,
                  borderRadius: 10.5,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ff8600",
                }}
              >
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 7.5,
                    backgroundColor: selectedRadio === 2 ? "#ff8600" : "#fff",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
            {selectedButton === 2 && (
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  setSelectedRadio(3);
                  setFicheNumber("");
                }}
              >
                <AppText
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    color: "#707070",
                    marginRight: 10,
                  }}
                >
                  Telefon No
                </AppText>
                <View
                  style={{
                    width: 21,
                    height: 21,
                    borderRadius: 10.5,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#ff8600",
                  }}
                >
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 7.5,
                      backgroundColor: selectedRadio === 3 ? "#ff8600" : "#fff",
                    }}
                  ></View>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <AppTextBox
            value={ficheNumber}
            onChangeText={setFicheNumber}
            format={
              selectedButton === 2 && selectedRadio === 3 ? "phone" : undefined
            }
            placeholder={
              selectedButton === 1
                ? selectedRadio === 1
                  ? "Fiş No Giriniz "
                  : "Sipariş No Giriniz "
                : selectedRadio === 1
                  ? "Fiş No Giriniz"
                  : selectedRadio === 2
                    ? "İDES No Giriniz"
                    : "Telefon No Giriniz"
            }
          ></AppTextBox>
        </View>

        <View>
          <AppButton
            style={{ marginHorizontal: 25, marginTop: 30 }}
            title={"Sorgula"}
            onPress={() => {
              if (ficheNumber === "") return;
              setIsLoading(true);
              CleanTransaction().then(() => {
                if (selectedButton === 2) {
                  if (removePhoneMask(ficheNumber) && selectedRadio === 3) {
                    CheckAUINumber(
                      removePhoneMask(ficheNumber),
                      true
                    ).then(() => {
                      setIsLoading(false);
                    });
                  } else {
                    CheckAUINumber(ficheNumber).then(() => {
                      setIsLoading(false);
                    });
                  }
                } else {
                  ErFindFicheResult(ficheNumber, true).then(
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
        </View>
      </KeyboardAwareScrollView>

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          setIsLoading(true);
          if (selectedButton === 1) {
            ErFindFicheResult(barcode, true).then(() =>
              setIsLoading(false)
            );
          } else {
            CheckAUINumber(barcode).then(() =>
              setIsLoading(false)
            );
          }
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />
    </View>
  );
};
export default FindFiche;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

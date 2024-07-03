import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { FloHeader } from "../../components/Header";
import { PerfectPixelSize } from "../../helper/PerfectPixel";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
import MainCamera from "../../components/MainCamera";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window"),
  ReturnProductFindFiche: React.FC = ({ }: any) => {
    const navigation = useNavigation();
    const { setSourceData, CleanTransaction, ErFindFicheResult, isRejectCargoLoading, isLoading, FindRejectCargoFiche } = useEasyReturnService();
    const [isCameraShow, setIsCameraShow] = useState(false);
    const [ficheNumber, setFichenumber] = useState("");

    useEffect(() => {
      setSourceData(1);
    }, []);

    return (
      <View style={styles.container}>
        <FloHeader
          enableButtons={["back"]}
          headerTitle="İade İşlemi"
          headerType="standart"
        />
        <View style={{ marginBottom: 30 }}>
          <>
            <View style={{ padding: 20, marginTop: 30 }}>
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
                  source={require("../../../assets/S.png")}
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
              label={"Fiş No /Sipariş No:"}
              value={ficheNumber}
              onChangeText={setFichenumber}
              placeholder={"Sipariş Numarasını Girin"}
            ></AppTextBox>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <>
            <AppButton
              title={"Sorgula"}
              onPress={() => {
                CleanTransaction().then(() =>
                  ErFindFicheResult(ficheNumber)
                );
              }}
              buttonColorType={ColorType.Brand}
              loading={
                isRejectCargoLoading ||
                isLoading
              }
              disabled={
                isRejectCargoLoading ||
                isLoading
              }
            />
            <View style={{}}>
              <AppButton
                title={"Belge Bul"}
                style={{ marginTop: 15 }}
                //@ts-ignore
                onPress={() => navigation.navigate("Ides", { screen: "FindFiche" })}
                buttonColorType={ColorType.Gray}
                loading={isRejectCargoLoading}
                disabled={isRejectCargoLoading}
              />
            </View>
          </>
        </View>

        <MainCamera
          isShow={isCameraShow}
          onReadComplete={(barcode) => {
            FindRejectCargoFiche({
              orderBarcode: barcode,
            });
            setIsCameraShow(false);
          }}
          onHide={() => setIsCameraShow(false)}
        />
      </View>
    );
  };
export default ReturnProductFindFiche;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

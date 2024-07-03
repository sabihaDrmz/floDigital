import {
  AppButton,
  AppText,
  ColorType,
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
import { Actions } from "react-native-router-flux";
import { FloHeader } from "../../../../components/Header";
import EasyReturnService from "../../../../core/services/EasyReturnService";
import { PerfectPixelSize } from "../../../../helper/PerfectPixel";
import AppTextBox from "../../../../NewComponents/FormElements/AppTextBox";

const { width } = Dimensions.get("window");
const FindFiche: React.FC = (props) => {
  const [ficheNumber, setFichenumber] = useState("");
  useEffect(() => {
    EasyReturnService.source = 1;
  });
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
              onPress={() => {
                Actions["easyReturnCamera"]({
                  onReadComplete: (barcode: string) => {
                    if (Actions.currentScene === "isoCamera") Actions.pop();

                    EasyReturnService.FindRejectCargoFiche({
                      orderBarcode: barcode,
                    });
                    // this.findProduct(barcode);
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
            label={"Fiş No /Sipariş No:"}
            value={ficheNumber}
            onChangeText={setFichenumber}
            placeholder={"Sipariş Numarasını Girin"}
          ></AppTextBox>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <Observer>
          {() => {
            return (
              <>
                <AppButton
                  title={"Sorgula"}
                  onPress={() => {
                    EasyReturnService.CleanTransaction().then(() =>
                      EasyReturnService.ErFindFicheResult(ficheNumber)
                    );
                  }}
                  buttonColorType={ColorType.Brand}
                  loading={
                    EasyReturnService.isRejectCargoLoading ||
                    EasyReturnService.isLoading
                  }
                  disabled={
                    EasyReturnService.isRejectCargoLoading ||
                    EasyReturnService.isLoading
                  }
                />
                <View style={{}}>
                  <AppButton
                    title={"Belge Bul"}
                    style={{ marginTop: 15 }}
                    onPress={() => {
                      Actions["erFindFiche"]();
                    }}
                    buttonColorType={ColorType.Gray}
                    loading={EasyReturnService.isRejectCargoLoading}
                    disabled={EasyReturnService.isRejectCargoLoading}
                  />
                </View>
              </>
            );
          }}
        </Observer>
      </View>
    </View>
  );
};
export default FindFiche;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

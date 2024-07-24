import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { FloHeader } from "../../components/Header";
import { PerfectPixelSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import BlurView from "../../components/BlurView";
import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import NotFoundIcon from "../../components/IdesComponents/SVG/NotFoundIcon";
import MainCamera from "../../components/MainCamera";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window"),
  MAX_WIDTH = (width / 4) * 3 - 50,
  MIN_WIDTH = (width / 4) * 1 - 20,
  AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity),
  CancellationScreen: React.FC = ({ }: any) => {
    const navigation = useNavigation();
    const [isCameraShow, setIsCameraShow] = useState(false);
    const { FindRejectCargoFiche, SearchFiche, isRejectCargoLoading, isLoading, cancellationOrderNotFoundPopup } = useEasyReturnService();
    const [eventType, setEventType] = useState<1 | 2>(1),
      selectedType = useSharedValue(eventType === 1 ? 0 : 1),
      [ficheNumber, setFicheNumber] = useState(""),
      animatedCargoStyle = useAnimatedStyle(() => {
        return {
          width: interpolate(
            selectedType.value,
            [0, 1],
            [MAX_WIDTH, MIN_WIDTH],
            Extrapolate.CLAMP
          ),
          backgroundColor: interpolateColor(
            selectedType.value,
            [0, 1],
            [AppColor.FD.Brand.Solid, "#fff"]
          ),
        };
      }),
      animatedCargoInfoStyle = useAnimatedStyle(() => {
        return {
          width: interpolate(
            selectedType.value,
            [0, 1],
            [MAX_WIDTH - 100, 0.01]
          ),
          opacity: interpolate(selectedType.value, [0, 1], [1, 0]),
        };
      }),
      animatedCargoInfoStyle2 = useAnimatedStyle(() => {
        return {
          marginRight: interpolate(selectedType.value, [0, 1], [20, 0]),
          width: interpolate(selectedType.value, [0, 1], [1, 0]),
          opacity: interpolate(selectedType.value, [0, 1], [1, 0]),
        };
      }),
      animatedStoreInfoStyle = useAnimatedStyle(() => {
        return {
          width: interpolate(
            selectedType.value,
            [0, 1],
            [0.01, MAX_WIDTH - 100]
          ),
          opacity: interpolate(selectedType.value, [0, 1], [0, 1]),
        };
      }),
      animatedStoreInfoStyle2 = useAnimatedStyle(() => {
        return {
          marginRight: interpolate(selectedType.value, [0, 1], [0, 20]),
          width: interpolate(selectedType.value, [0, 1], [0, 1]),
        };
      }),
      animatedStoreStyle = useAnimatedStyle(() => {
        return {
          width: interpolate(
            selectedType.value,
            [0, 1],
            [MIN_WIDTH, MAX_WIDTH],
            Extrapolate.CLAMP
          ),
          backgroundColor: interpolateColor(
            selectedType.value,
            [0, 1],
            ["#fff", AppColor.FD.Brand.Solid]
          ),
        };
      });

    return (
      <>
        <View style={styles.container}>
          <FloHeader
            headerType={"standart"}
            headerTitle={"İptal İşlemleri"}
            enableButtons={["back"]}
          />
          <View style={{ marginVertical: 20 }}></View>
          <View style={{ paddingHorizontal: 20, flexDirection: "row" }}>
            <AnimatedTouchable
              // disabled
              onPress={() => {
                setEventType(1);
                selectedType.value = withTiming(0);
              }}
              style={[
                {
                  height: 63,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.16,
                  shadowRadius: 3.84,

                  elevation: 5,
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexDirection: "row",
                  marginRight: 20,
                },
                animatedCargoStyle,
              ]}
            >
              <Animated.View style={animatedCargoInfoStyle}>
                <AppText
                  style={{ textAlign: "center" }}
                  labelType={LabelType.Label}
                  size={FontSizes.XS}
                  labelColorType={ColorType.Light}
                >
                  Oms Ret Kargo
                </AppText>
              </Animated.View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Animated.View
                  style={[
                    {
                      width: 1,
                      height: 50,
                      backgroundColor: "#fff",
                    },
                    animatedCargoInfoStyle2,
                  ]}
                />
                <View
                  style={{
                    height: 53,
                    width: 53,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/cargoret.png")}
                    style={{ width: 40, height: 53, resizeMode: "cover" }}
                  />
                </View>
              </View>
            </AnimatedTouchable>

            <AnimatedTouchable
              // disabled
              onPress={() => {
                setEventType(2);
                selectedType.value = withTiming(1);
              }}
              style={[
                {
                  height: 63,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.16,
                  shadowRadius: 3.84,

                  elevation: 5,
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexDirection: "row",
                },
                animatedStoreStyle,
              ]}
            >
              <Animated.View style={animatedStoreInfoStyle}>
                <AppText
                  labelType={LabelType.Label}
                  style={{ textAlign: "center" }}
                  size={FontSizes.XS}
                  labelColorType={ColorType.Light}
                >
                  Mağazadan İptal
                </AppText>
              </Animated.View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Animated.View
                  style={[
                    {
                      height: 50,
                      backgroundColor: "#fff",
                      marginRight: 20,
                    },
                    animatedStoreInfoStyle2,
                  ]}
                />
                <View
                  style={{
                    height: 53,
                    width: 53,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/storeret.png")}
                    style={{ width: 32, height: 53, resizeMode: "cover" }}
                  />
                </View>
              </View>
            </AnimatedTouchable>
          </View>
          <KeyboardAwareScrollView>
            <View style={{ marginHorizontal: 20, paddingTop: 40 }}>
              <View style={{ marginBottom: 30 }}>
                <>
                  <View style={styles.basketButtonContainer}>
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
                <View style={{ marginHorizontal: 20 }}>
                  <AppTextBox
                    label={"Fiş No /Sipariş No:"}
                    value={ficheNumber}
                    onChangeText={setFicheNumber}
                    labelStyle={{
                      fontWeight: "600",
                      opacity: 0.5,
                      marginBottom: 20,
                    }}
                    placeholder={"Sipariş Numarasını Girin"}
                  ></AppTextBox>
                </View>
              </View>
              <>
                <AppButton
                  title={"Sorgula"}
                  onPress={() => {
                    if (eventType === 1)
                      FindRejectCargoFiche({
                        orderBarcode: ficheNumber,
                      });
                    else if (eventType === 2)
                      SearchFiche({
                        orderNo: ficheNumber.trim().startsWith("9")
                          ? ficheNumber
                          : "",
                        voucherNo: "",
                        ficheNumber: ficheNumber.trim().startsWith("9")
                          ? ""
                          : ficheNumber,
                      });
                  }}
                  style={{ height: 60 }}
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
                {console.log('isRejectCargoLoading:', isRejectCargoLoading)}

                {console.log('eventType:', eventType)}
                {console.log('  isRejectCargoLoading || eventType !== 2', isRejectCargoLoading ||
                  eventType !== 2)}
                {eventType === 2 && (
                  <View style={{}}>
                    <AppButton
                      title={"Belge Bul"}
                      style={{ marginTop: 15, height: 60 }}
                      //@ts-ignore
                      onPress={() => navigation.navigate("Crm", { screen: "CrmFindFiche" })}
                      buttonColorType={ColorType.Gray}
                      loading={isRejectCargoLoading}

                    />
                  </View>
                )}
              </>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <>
          {cancellationOrderNotFoundPopup && (
            <BlurView
              style={{
                position: "absolute",
                width,
                height,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: width - 50,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <NotFoundIcon />
                </View>
                <AppText
                  labelType={LabelType.Label}
                  style={{
                    fontWeight: "500",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "center",
                    color: "#6f6f6f",
                    marginTop: 40,
                    marginBottom: 40,
                  }}
                >
                  Şipariş Bulunamadı
                </AppText>
                <AppButton buttonColorType={ColorType.Brand} title={"Tamam"} />
              </View>
            </BlurView>
          )}
        </>

        <MainCamera
          isShow={isCameraShow}
          onReadComplete={(barcode) => {
            if (eventType === 1)
              FindRejectCargoFiche({
                orderBarcode: barcode,
              });
            else if (eventType === 2)
              SearchFiche({
                orderNo: barcode.trim().startsWith("9") ? barcode : "",
                voucherNo: "",
                ficheNumber: barcode.trim().startsWith("9") ? "" : barcode,
              });
            setIsCameraShow(false);
          }}
          onHide={() => setIsCameraShow(false)}
        />
      </>
    );
  };
export default CancellationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  basketButtonContainer: {
    padding: 20,
    paddingBottom: 0,
    borderBottomColor: colors.whiteThree,
    borderBottomWidth: 0,
  },
});

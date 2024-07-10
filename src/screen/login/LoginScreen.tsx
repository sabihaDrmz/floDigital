import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { VersionInfo } from "../../constant/ApplicationVersionInfo";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useVersionService } from "../../contexts/VersionService";
import LinearGradient from "../../components/LinearGradient";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Image, Platform, AppState, TextInput, TouchableOpacity, ScrollView, Linking } from "react-native";
import { FloButton, FloTextBox } from "../../components";
import { CrmApi, OmsApi, OmsPdfApi, SystemApi, useAccountService } from "../../contexts/AccountService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import { paddings } from "../../theme/paddingConst";
import { useFcmService } from "../../contexts/FcmService";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountUserNameKey, accountUserRememberNameKey } from "../../core/StorageKeys";
import { AppText } from "@flomagazacilik/flo-digital-components";

interface LoginScreenProps { }

const LoginScreen: React.FC<LoginScreenProps> = (props) => {
  const { restore, testMode, accountInfo, employeeInfo, getUserStoreId, logout, loginWithRefreshToken, login, isLoading } = useAccountService();
  const { readBadgeCount } = useFcmService();
  const { showVersionError } = useVersionService();
  const { show } = useMessageBoxService();
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUserName, setRememberUserName] = useState("");
  const txtPassword = useRef<TextInput>(null);
  const textUsername = useRef<TextInput>(null);
  const _login = () => {
    login(userName, password);
  };
  const isFocused = useIsFocused();

  useEffect(() => {
    restore();
  }, []);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        readBadgeCount();
      }

      appState.current = nextAppState;
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const baseUrl = testMode
      ? "http://10.0.60.12:5902/"
      : "https://digital.flo.com.tr/";

    const requestInterceptor = (config: any) => {
      config.headers = {
        ...config.headers,
        appVer: VersionInfo.versionNormalizer,
        appType: Platform.OS === "web" ? 2 : 1,
        Authorization: accountInfo?.token || "",
        cid: accountInfo?.cid || "",
        storeId: getUserStoreId(),
        employeeId: employeeInfo?.EfficiencyRecord || "-1",
        refreshToken: accountInfo?.refreshToken || "",
      };
      return config;
    };

    var systemInterceptor =
      SystemApi.interceptors.request.use(requestInterceptor);
    var omsInterceptor = OmsApi.interceptors.request.use(requestInterceptor);
    var crmInterceptor = CrmApi.interceptors.request.use(requestInterceptor);
    var omsPdfInterceptor =
      OmsPdfApi.interceptors.request.use(requestInterceptor);

    SystemApi.defaults.baseURL = `${baseUrl}sys/api`;
    OmsApi.defaults.baseURL = `${baseUrl}oms/api`;
    CrmApi.defaults.baseURL = `${baseUrl}crm/api`;
    OmsPdfApi.defaults.baseURL = `${baseUrl}omspdf/api`;

    return () => {
      SystemApi.interceptors.request.eject(systemInterceptor);
      OmsApi.interceptors.request.eject(omsInterceptor);
      CrmApi.interceptors.request.eject(crmInterceptor);
      OmsPdfApi.interceptors.request.eject(omsPdfInterceptor);
    };
  }, [testMode, accountInfo, employeeInfo]);

  useEffect(() => {
    const responseInterceptor = (response: any) => {
      if (response.status === 200) return response;
    };

    const errorInterceptor = async (error: any) => {
      const config = error?.config;
      if (error.response.status === 503 || error.response.status === 404) {
        show(translate("errorMsgs.systemCurrentlyMaintenance"));
        return;
      }

      if (error.response.status === 401) {
        if (employeeInfo && Number(employeeInfo.EfficiencyRecord) > 10000000) {
          logout();
          show(translate("errorMsgs.sessionTimeout"));
          return Promise.reject(error);
        }

        if (config.headers.refreshToken) {
          await loginWithRefreshToken();
          return axios(config);
        }
      } else if (error.response.status === 402) {
        logout();
        show(translate("errorMsgs.sessionTimeout"));
        return;
      }
      if (
        config.headers.Authorization !== undefined &&
        config.headers.refreshToken === undefined
      ) {
        if (error.response.status === 401) {
          show(translate("errorMsgs.sessionTimeout"));
          logout();
          return;
        }
        if (error.response?.status === 409) {
          show(error.response.data.message);
          return;
        } else {
          show(translate("errorMsgs.unexceptedError"));
          return;
        }
      } else {
        if (error.response?.status === 700) {
          showVersionError(
            true,
            translate(error.response.data.message)
          );
          return;
        }
      }
    };

    var systemInterceptor = SystemApi.interceptors.response.use(
      responseInterceptor,
      errorInterceptor
    );
    var omsInterceptor = OmsApi.interceptors.response.use(
      responseInterceptor,
      errorInterceptor
    );
    var crmInterceptor = CrmApi.interceptors.response.use(
      responseInterceptor,
      errorInterceptor
    );
    var omsPdfInterceptor = OmsPdfApi.interceptors.response.use(
      responseInterceptor,
      errorInterceptor
    );

    return () => {
      SystemApi.interceptors.response.eject(systemInterceptor);
      OmsApi.interceptors.response.eject(omsInterceptor);
      CrmApi.interceptors.response.eject(crmInterceptor);
      OmsPdfApi.interceptors.response.eject(omsPdfInterceptor);
    };
  }, []);

  const clearRememberMe = async () => {
    await AsyncStorage.removeItem(accountUserRememberNameKey);
    await AsyncStorage.removeItem(accountUserNameKey);
    setRememberUserName("");
    setUsername("");
  }

  const checkRememberUser = async () => {
    const rememberUser = await AsyncStorage.getItem(accountUserRememberNameKey);
    if (rememberUser) {
      setRememberUserName(rememberUser)
    }

    const accUserKey = await AsyncStorage.getItem(accountUserNameKey);
    if (accUserKey) {
      setUsername(accUserKey);
    }
  }

  const capitalizedUserName = (name: string) => {
    return name.toLocaleLowerCase("tr").split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  const getInitials = (name) => {
    const parts = name.split(' ');

    if (parts.length === 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    } else {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
  };

  useEffect(() => {
    checkRememberUser()
  }, [isFocused])

  return (
    <LinearGradient
      colors={["rgb(232,176,66)", "rgb(238,139,51)", "rgb(238,129,51)"]}
      style={{ flex: 1 }}
    >
      <KeyboardAwareScrollView
        style={styles.container}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {rememberUserName !== "" ?
          <>
            <View style={{ justifyContent: "center", alignItems: "center", }}>
              <Image
                source={require("../../../assets/fdheaderlogo.png")}
                style={{
                  width:
                    Platform.OS === "web"
                      ? 150
                      : PerfectPixelSize(Dimensions.get("window").width - 160),
                  height:
                    Platform.OS === "web"
                      ? 150
                      : PerfectPixelSize(Dimensions.get("window").width - 160),
                  resizeMode: "contain",
                  marginHorizontal: PerfectPixelSize(20),
                  maxWidth: Platform.OS === "web" ? 150 : 400,
                  maxHeight: Platform.OS === "web" ? 150 : 400,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <View style={styles.rememberProfileFrame}>
                <AppText style={styles.profileFrameText}>{getInitials(rememberUserName)}</AppText>
              </View>
            </View>

            <AppText style={styles.welcomeText}>{translate("loginScreen.welcome")}</AppText>
            <AppText style={styles.rememberUser}>{capitalizedUserName(rememberUserName)}</AppText>

            <View style={styles.textInputs}>
              <FloTextBox
                style={{
                  backgroundColor: "#fff",
                  borderRadius: PerfectPixelSize(44),
                  borderColor: "#cecaca",
                  marginBottom: PerfectPixelSize(20),
                }}
                textStyle={{
                  fontFamily: "Poppins_400Regular",
                  color: "#707070",
                  fontSize: PerfectFontSize(15),
                  lineHeight: PerfectFontSize(22),
                  fontWeight: "300",
                }}
                placeholderTextColor={"#707070"}
                placeholder={translate("loginScreen.password")}
                secureTextEntry
                refText={txtPassword}
                onChangeText={setPassword}
                onSubmitEditing={() => (isLoading ? null : _login)}
              />

              <FloButton
                title={translate("loginScreen.signIn")}
                isLoading={isLoading}
                containerStyle={{
                  backgroundColor: "#fff",
                  shadowColor: "rgba(0, 0, 0, 0.16)",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 6,
                  shadowOpacity: 1,
                  borderRadius: 30,
                }}
                style={{ color: "#ff8600" }}
                activeColor={"#ff8600"}
                onPress={() => (isLoading ? undefined : _login())}
              />
            </View>
            <TouchableOpacity
              onPress={clearRememberMe}
              style={styles.forgotPassButton}
            >
              <AppText style={styles.forgotUserText}>
                {translate("loginScreen.otherLogin")}
              </AppText>
            </TouchableOpacity>
          </>
          :
          <>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={require("../../../assets/loginLogo.png")}
                style={{
                  width:
                    Platform.OS === "web"
                      ? 150
                      : PerfectPixelSize(Dimensions.get("window").width - 160),
                  height:
                    Platform.OS === "web"
                      ? 150
                      : PerfectPixelSize(Dimensions.get("window").width - 160),
                  resizeMode: "contain",
                  marginHorizontal: PerfectPixelSize(25),
                  marginTop: PerfectPixelSize(25),
                  marginBottom: PerfectPixelSize(50),
                  maxWidth: Platform.OS === "web" ? 150 : 400,
                  maxHeight: Platform.OS === "web" ? 150 : 400,
                }}
              />
            </View>
            <View style={styles.textInputs}>
              <FloTextBox
                style={{
                  backgroundColor: "#fff",
                  borderRadius: PerfectPixelSize(44),
                  borderColor: "#cecaca",
                  marginBottom: PerfectPixelSize(40),
                }}
                textStyle={{
                  fontFamily: "Poppins_400Regular",
                  color: "#707070",
                  fontSize: PerfectFontSize(15),
                  lineHeight: PerfectFontSize(22),
                  fontWeight: "300",
                }}
                placeholderTextColor={"#707070"}
                placeholder={translate("loginScreen.username")}
                refText={textUsername}
                returnKeyType={"next"}
                onSubmitEditing={() => txtPassword.current?.focus()}
                onChangeText={setUsername}
              />
              <FloTextBox
                style={{
                  backgroundColor: "#fff",
                  borderRadius: PerfectPixelSize(44),
                  borderColor: "#cecaca",
                  marginBottom: PerfectPixelSize(44),
                }}
                textStyle={{
                  fontFamily: "Poppins_400Regular",
                  color: "#707070",
                  fontSize: PerfectFontSize(15),
                  lineHeight: PerfectFontSize(22),
                  fontWeight: "300",
                }}
                placeholderTextColor={"#707070"}
                placeholder={translate("loginScreen.password")}
                secureTextEntry
                refText={txtPassword}
                onChangeText={setPassword}
                onSubmitEditing={() => (isLoading ? null : _login)}
              />
            </View>
            <FloButton
              title={translate("loginScreen.signIn")}
              isLoading={isLoading}
              containerStyle={{
                backgroundColor: "#fff",
                shadowColor: "rgba(0, 0, 0, 0.16)",
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 6,
                shadowOpacity: 1,
                borderRadius: 30,
              }}
              style={{ color: "#ff8600" }}
              activeColor={"#ff8600"}
              onPress={() => (isLoading ? undefined : _login())}
            />
            {Platform.OS !== "web" && <View style={{ height: 150 }} />}
          </>
        }
        {
          Platform.OS === "web" &&
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  width: 62,
                  height: 15,
                  borderTopColor: colors.white,
                  borderLeftColor: colors.white,
                  borderLeftWidth: 1,
                  borderTopWidth: 1,
                  marginTop: 15,
                }}
              ></View>
              <AppText
                style={{
                  fontWeight: "600",
                  color: colors.white,
                  paddingHorizontal: 10,
                  width: 120,
                  textAlign: 'center'
                }}
              >
                Şimdi Store'da
              </AppText>
              <View
                style={{
                  width: 62,
                  height: 15,
                  borderTopColor: colors.white,
                  borderRightColor: colors.white,
                  borderRightWidth: 1,
                  borderTopWidth: 1,
                  marginTop: 15,
                }}
              ></View>
            </View>
            <View style={{justifyContent:"center",flexDirection:"row",alignItems:"center"}}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width:330,
                gap: 32,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 70, height: 70, marginTop: 20 }}
                  source={require("../../../assets/IosMarketQr.png")}
                ></Image>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      "https://apps.apple.com/tr/app/flo-digital/id1559904113"
                    );
                  }}
                >
                  <Image
                    style={{ width: 90, marginTop: 10 }}
                    source={require("../../../assets/StoreIosButton.png")}
                    resizeMode="contain"
                  ></Image>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 70, height: 70, marginTop: 20 }}
                  source={require("../../../assets/AndroidMarketQr.png")}
                ></Image>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      "https://play.google.com/store/apps/details?id=com.ziylan.flodijital"
                    );
                  }}
                >
                  <Image
                    style={{ width: 90, marginTop: 10 }}
                    source={require("../../../assets/StoreAndroidButton.png")}
                    resizeMode="contain"
                  ></Image>
                </TouchableOpacity>
              </View>
              {/* <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 70, height: 70, marginTop: 20, }}
                  source={require("../../img/huaweiAppGalleryQr.png")}
                ></Image>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      "https://appgallery.huawei.com/app/C110077507"
                    );
                  }}
                >
                  <Image
                    style={{ width: 90, marginTop: 10 }}
                    source={require("../../img/huaweiAppGallery.png")}
                    resizeMode="contain"
                  ></Image>
                </TouchableOpacity>
              </View> */}
            </View>
            </View>
          </>
        }

      </KeyboardAwareScrollView>
      {/* <Image
        source={require("../../../assets/loginRightLogo.png")}
        style={{
          width: PerfectPixelSize(180),
          height: PerfectPixelSize(180),
          position: "absolute",
          backgroundColor: "transparent",
          right: -PerfectPixelSize(80),
          bottom: -PerfectPixelSize(50),
        }}
      /> */}
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: PerfectPixelSize(paddings.loginTop),
    paddingLeft: PerfectPixelSize(paddings.defaultLeft),
    paddingRight: PerfectPixelSize(paddings.defaultRight),
  },
  title: {
    fontSize: PerfectFontSize(24),
    lineHeight: PerfectFontSize(29),
    color: colors.darkGrey,
    fontFamily: "Poppins_500Medium",
  },
  textInputs: { paddingTop: 0 },
  rememberProfileFrame: {
    width: 130,
    height: 130,
    padding: 5,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.floOrange
  },
  profileFrameText: {
    fontSize: PerfectFontSize(38),
    fontFamily: "Poppins_600SemiBold",
    color: colors.white,
  },
  welcomeText: {
    fontSize: PerfectFontSize(14),
    fontFamily: "Poppins_500Medium",
    color: colors.white,
    marginTop: 20,
    textAlign: "center"
  },
  rememberUser: {
    fontSize: PerfectFontSize(20),
    fontFamily: "Poppins_500Medium",
    color: colors.white,
    marginTop: 5,
    textAlign: "center",
    marginBottom: 30
  },
  forgotUserText: {
    fontSize: PerfectFontSize(13),
    fontFamily: "Poppins_500Medium",
    color: colors.white,
    marginTop: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  forgotPassButton: {
    alignItems: "center",
    marginTop: 5
  },
});

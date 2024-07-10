import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import LinearGradient from "../../components/LinearGradient";
import { Observer } from "mobx-react";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { FloButton, FloTextBox } from "../../components";
import AccountService from "../../core/services/AccountService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import { paddings } from "../../theme/paddingConst";

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = (props) => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const txtPassword = useRef<TextInput>(null);
  const textUsername = useRef<TextInput>(null);
  const _login = () => {
    AccountService.login(userName, password);
  };

  return (
    <Observer>
      {() => (
        <LinearGradient
          colors={["rgb(232,176,66)", "rgb(238,139,51)", "rgb(238,129,51)"]}
          style={{ flex: 1 }}
        >
          <KeyboardAwareScrollView
            style={styles.container}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
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
                onSubmitEditing={() =>
                  AccountService.isLoading ? null : _login
                }
              />
            </View>
            <FloButton
              title={translate("loginScreen.signIn")}
              isLoading={AccountService.isLoading}
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
              onPress={() => (AccountService.isLoading ? undefined : _login())}
            />
            <View style={{ height: 150 }} />
          </KeyboardAwareScrollView>

          <Image
            source={require("../../../assets/loginRightLogo.png")}
            style={{
              width: PerfectPixelSize(180),
              height: PerfectPixelSize(180),
              position: "absolute",
              backgroundColor: "transparent",
              right: -PerfectPixelSize(80),
              bottom: -PerfectPixelSize(50),
            }}
          />
        </LinearGradient>
      )}
    </Observer>
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
});

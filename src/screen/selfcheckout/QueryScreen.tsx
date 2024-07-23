import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import MainCamera from "../../components/MainCamera";
import { useSelfCheckOutService } from "../../contexts/SelfCheckOutService";
import { translate } from "../../helper/localization/locaizationMain";
import {
  PerfectFontSize,
  PerfectPixelSize,
} from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { FloButton } from "../../components";
import { TextManipulator } from "../../NewComponents/FormElements/AppTextBox";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
interface QueryScreenProps { }

const QueryScreen: React.FC<QueryScreenProps> = (props) => {
  const { getOrders } = useSelfCheckOutService();
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [qrCode, setQRCode] = useState("");
  const txtInput = useRef<TextInput>(null);

  useEffect(() => {
    if (Platform.OS === "web") txtInput.current.focus();
  });

  const cameraButton = () => {
    return (
      <TouchableOpacity
        onPress={() => setIsCameraShow(true)}
        style={{
          justifyContent: "center",
          alignItems: "center",
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
    );
  };

  const orLine = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              height: 1,
              width: "25%",
              backgroundColor: colors.warm_grey_three,
            }}
          ></View>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: PerfectFontSize(16),
              fontWeight: "500",
              fontStyle: "normal",
              lineHeight: PerfectFontSize(21),
              letterSpacing: 0,
              textAlign: "center",
              color: "rgb(171,170,172)",
              // backgroundColor: colors.white,
              padding: 5,
            }}
          >
            {translate("or")}
          </Text>
          <View
            style={{
              width: "25%",
              height: 1,
              backgroundColor: colors.warm_grey_three,
            }}
          ></View>
        </View>
      </View>
    );
  };

  const renderManual = () => {
    return (
      <View style={{ marginVertical: 50 }}>
        <FloTextBoxNew
          placeholder={translate("OmsBarcodeSearchBar.enterQR")}
          value={qrCode}
          onChangeText={setQRCode}
          refText={txtInput}
        />
        <FloButton
          title={translate("findBarcode.check")}
          onPress={() => findOrder(qrCode)}
          containerStyle={{
            marginVertical: PerfectPixelSize(20),
            borderRadius: 8,
          }}
        />
      </View>
    );
  };

  const findOrder = (barcode: string) => {
    getOrders(barcode);
    setIsCameraShow(false);
  };

  return (
    <>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={" "}
        showLogo
      />

      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        {cameraButton()}
        {orLine()}
        {renderManual()}
      </KeyboardAwareScrollView>

      <MainCamera
        isShow={isCameraShow}
        isSelfCheckOut={true}
        onReadComplete={(barcode) => findOrder(barcode)}
        onHide={() => setIsCameraShow(false)}
      />
    </>
  );
};
export default QueryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});

import { observer } from "mobx-react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { FloHeader } from "../../components/Header";
import { BrokenProductSearchModel } from "../../core/models/BrokenProductSearchModel";
import EasyReturnService from "../../core/services/EasyReturnService";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import { translate } from "../../helper/localization/locaizationMain";

@observer
class EasyReturnUibListScreen extends React.Component<{
  sapRes: BrokenProductSearchModel[];
}> {
  render() {
    return (
      <View style={styles.container}>
        <FloHeader
          headerTitle={"İDES fişleri"}
          enableButtons={["back"]}
          headerType={"standart"}
        />
        <KeyboardAwareScrollView>
          {this.props.sapRes.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  EasyReturnService.searchBrokenProduct(
                    "",
                    item.sapResult.mgZ_UIB_NO
                  )
                }
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                  padding: 10,
                  borderWidth: 0.3,
                  borderColor: "rgba(0,0,0,0.3)",
                }}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Müşteri Adı:</Text>
                  <Text style={styles.detail}>
                    {item.sapResult.mgZ_MUSTERI_ADI}
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Müşteri Tel:</Text>
                  <Text style={styles.detail}>
                    {item.sapResult.mgZ_MUSTERI_TEL}
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>İade Sebebi:</Text>
                  <Text style={styles.detail}>
                    {item.sapResult.iadE_SEBEBI}
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Karar:</Text>
                  <Text style={styles.detail}>{item.sapResult.karaR_TEXT}</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Ürün:</Text>
                  <Text style={styles.detail}>
                    {item.sapResult.uruN_MARKASI}-{item.sapResult.uruN_ADI}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </KeyboardAwareScrollView>
        {EasyReturnService.isLoading && (
          <View
            style={{
              position: "absolute",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: Dimensions.get("window").width - 100,
                padding: 20,
                borderRadius: 15,
              }}
            >
              <ActivityIndicator size={"large"} color={colors.brightOrange} />
              <Text
                style={{
                  marginTop: 20,
                  fontFamily: "Poppins_700Bold",
                  textAlign: "center",
                }}
              >
                {translate("loginScreen.pleaseWait")}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
export default EasyReturnUibListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: PerfectFontSize(14),
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
  detail: {
    fontSize: PerfectFontSize(11),
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
});

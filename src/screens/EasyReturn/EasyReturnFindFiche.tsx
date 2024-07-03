import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { Entypo, FloButton, FloTextBox, Ionicons } from "../../components";
import { FloHeader } from "../../components/Header";
import FloLoadingModal from "../../components/Modal/FloLoadingModal";
import EasyReturnService from "../../core/services/EasyReturnService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";

@observer
class EasyReturnFindFiche extends Component {
  txtRef: TextInput | null | undefined;
  state = {
    showCam: true,
    selectedType: 1,
    barcode: __DEV__ ? "M400300102G904270001" : "",
    phone: "",
  };
  render() {
    return (
      <>
        <FloHeader
          headerType={"standart"}
          headerTitle={translate("easyReturnFindFiche.title")}
          enableButtons={["back", "profile"]}
        />
        <KeyboardAwareScrollView>
          <View
            style={{
              marginTop: 21,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",

                borderColor: "rgba(222,222,222,1)",
                borderRadius: 20,
                borderWidth: 1,
              }}
            >
              <TouchableOpacity
                disabled={this.state.selectedType === 1}
                onPress={() => this.setState({ selectedType: 1 })}
                style={[
                  {
                    backgroundColor: colors.white,
                    padding: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 20,
                  },
                  this.state.selectedType === 1
                    ? {
                        backgroundColor: colors.brightOrange,
                      }
                    : null,
                ]}
              >
                <Text
                  style={[
                    {
                      paddingRight: 10,
                      paddingLeft: 10,
                      fontFamily: "Poppins_400Regular",
                      fontSize: PerfectFontSize(14),
                      lineHeight: PerfectFontSize(19),
                    },
                    this.state.selectedType === 1
                      ? {
                          color: colors.white,
                        }
                      : {
                          color: colors.warm_grey_two,
                        },
                  ]}
                >
                  {translate("easyReturnFindFiche.docNumber")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={this.state.selectedType === 2}
                onPress={() => this.setState({ selectedType: 2 })}
                style={[
                  {
                    backgroundColor: colors.white,
                    padding: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 20,
                  },
                  this.state.selectedType === 2
                    ? {
                        backgroundColor: colors.brightOrange,
                      }
                    : null,
                ]}
              >
                <Text
                  style={[
                    {
                      paddingRight: 10,
                      paddingLeft: 10,
                      fontFamily: "Poppins_400Regular",
                      fontSize: PerfectFontSize(14),
                      lineHeight: PerfectFontSize(19),
                    },
                    this.state.selectedType === 2
                      ? {
                          color: colors.white,
                        }
                      : {
                          color: colors.warm_grey_two,
                        },
                  ]}
                >
                  {translate("easyReturnFindFiche.returnNumber")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={this.state.selectedType === 3}
                onPress={() => this.setState({ selectedType: 3 })}
                style={[
                  {
                    backgroundColor: colors.white,
                    padding: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 20,
                  },
                  this.state.selectedType === 3
                    ? {
                        backgroundColor: colors.brightOrange,
                      }
                    : null,
                ]}
              >
                <Text
                  style={[
                    {
                      paddingRight: 10,
                      paddingLeft: 10,
                      fontFamily: "Poppins_400Regular",
                      fontSize: PerfectFontSize(14),
                      lineHeight: PerfectFontSize(19),
                    },
                    this.state.selectedType === 3
                      ? {
                          color: colors.white,
                        }
                      : {
                          color: colors.warm_grey_two,
                        },
                  ]}
                >
                  {translate("easyReturnFindFiche.AINo")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: PerfectFontSize(14),
                lineHeight: PerfectFontSize(18),
                color: colors.darkGrey,
                marginBottom: 30,
              }}
            >
              {translate(
                this.state.selectedType === 1
                  ? "easyReturnFindFiche.enterDocNumber"
                  : this.state.selectedType === 2
                  ? "easyReturnFindFiche.enterReturnNumber"
                  : "easyReturnFindFiche.enterAINo"
              )}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Actions["easyReturnCamera"]({
                  onReadComplete: (barcode: string) => {
                    if (Actions.currentScene === "easyReturnCamera")
                      Actions.pop();
                    EasyReturnService.findFicheRequest.receiptNumber = barcode;
                    EasyReturnService.checkEasyReturn().then((x) => {
                      EasyReturnService.findFicheRequest.receiptNumber = "";
                    });
                  },
                  headerTitle: translate(
                    this.state.selectedType === 1
                      ? "easyReturnCamera.scanDocNumber"
                      : this.state.selectedType === 2
                      ? "easyReturnCamera.scanReturnNumber"
                      : "easyReturnCamera.scanAINo"
                  ),
                })
              }
            >
              <Entypo name={"camera"} size={80} color={colors.warmGrey} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 30,
              marginBottom: 30,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <View
              style={{
                height: 1,
                backgroundColor: colors.warm_grey_three,
              }}
            ></View>
            <Text
              style={{
                width: 58,
                textAlign: "center",
                position: "absolute",
                left: Dimensions.get("window").width / 2 - 55,
                top: -13,
                backgroundColor: colors.white,
                fontFamily: "Poppins_500Medium",
                fontSize: PerfectFontSize(16),
                lineHeight: PerfectFontSize(21),
                color: colors.darkGrey,
              }}
            >
              {translate("or")}
            </Text>
          </View>

          <View style={{ padding: 20 }}>
            <FloTextBox
              placeholder={translate(
                this.state.selectedType === 1
                  ? "easyReturnFindFiche.enterDocNumber"
                  : this.state.selectedType === 2
                  ? "easyReturnFindFiche.enterReturnNumber"
                  : "easyReturnFindFiche.enterAINo"
              )}
              floatingLabel
              refText={(input) => (this.txtRef = input)}
              value={EasyReturnService.findFicheRequest.receiptNumber}
              onChangeText={(txt) =>
                (EasyReturnService.findFicheRequest.receiptNumber = txt)
              }
            />
            {this.state.selectedType === 4 && (
              <FloTextBox
                placeholder={"Telefon Numarası"}
                value={this.state.phone}
                mask={"cel-phone"}
                onChangeText={(input) => this.setState({ phone: input })}
              />
            )}

            <FloButton
              title={translate("easyReturnFindFiche.query")}
              onPress={() => {
                this.state.selectedType === 1
                  ? EasyReturnService.checkEasyReturn()
                  : this.state.selectedType === 3
                  ? EasyReturnService.searchBrokenProduct(
                      this.state.phone,
                      EasyReturnService?.findFicheRequest?.receiptNumber
                    )
                  : null;
              }}
            />
            {this.state.selectedType !== 3 && (
              <FloButton
                containerStyle={{
                  marginTop: 20,
                  backgroundColor: colors.white,
                  borderColor: colors.warmGrey,
                  borderWidth: 1,
                }}
                onPress={() => Actions["easyFindFicheManual"]()}
                renderTitle={() => (
                  <View style={{ flexDirection: "row" }}>
                    <Ionicons
                      name={"ios-newspaper-outline"}
                      size={20}
                      color={colors.darkGrey}
                    />
                    <Text
                      style={{
                        color: colors.darkGrey,
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: PerfectFontSize(18),
                        marginLeft: 10,
                      }}
                    >
                      {translate("easyReturnFindFiche.findDocument")}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </KeyboardAwareScrollView>

        <FloLoadingModal />
      </>
    );
  }
}
export default EasyReturnFindFiche;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 20,
    zIndex: 9999,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 20,
    shadowColor: "#828287",
    shadowOffset: { width: 1, height: 3 },
    elevation: 4,
    shadowOpacity: 0.2,
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
  },
});

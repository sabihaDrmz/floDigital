import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Entypo, FloButton, FloTextBox } from "../../components";
import FloComboBox from "../../components/FloComobox";
import { FloHeader } from "../../components/Header";
import { colors } from "../../theme/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { Actions } from "react-native-router-flux";
import FloLoadingModal from "../../components/Modal/FloLoadingModal";
import { observer } from "mobx-react";
import EasyReturnService from "../../core/services/EasyReturnService";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getLocale,
  translate,
} from "../../helper/localization/locaizationMain";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { PerfectFontSize } from "../../helper/PerfectPixel";

const _LangPrefix = "easyRerturnFindFicheManual.";
const _CameraLangPrefix = "easyReturnCamera.";
@observer
class EasyReturnFindFicheManual extends Component {
  state = {
    showDatePicker: false,
    selectedDate: "",
    phone: "",
    barcode: "",
  };
  dateInput: TextInput | null | undefined;
  camera: any;
  txtRef: TextInput | null | undefined;
  txtRefContainer: FloTextBox | null | undefined;

  async componentDidMount() {
    await ApplicationGlobalService.getAllStores();
  }
  render(): JSX.Element {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          headerTitle={translate(`${_LangPrefix}title`)}
          enableButtons={["back"]}
        />
        <KeyboardAwareScrollView style={styles.container}>
          <FloTextBox
            floatingLabel
            keyboardType={"phone-pad"}
            mask={"cel-phone"}
            onChangeText={(input) =>
              (EasyReturnService.findFicheRequest.gsm = input)
            }
            value={EasyReturnService.findFicheRequest.gsm}
            placeholder={translate(`${_LangPrefix}enterGsm`)}
          />

          <View style={{ marginTop: 10, marginBottom: 30 }}>
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

          <FloComboBox
            showClearButton
            data={ApplicationGlobalService.allStore}
            keyProp={"werks"}
            valueProp={"name"}
            placeholder={translate(`${_LangPrefix}store`)}
            onSelectItem={(itm) => {
              EasyReturnService.findFicheRequest.shippingStore = itm.werks;
            }}
            selectedItem={ApplicationGlobalService.allStore.find(
              (x) =>
                x.werks === EasyReturnService.findFicheRequest.shippingStore
            )}
          />

          <DateTimePickerModal
            isVisible={this.state.showDatePicker}
            mode="date"
            cancelTextIOS={translate(`${_LangPrefix}dtpCancel`)}
            confirmTextIOS={translate(`${_LangPrefix}dtpOk`)}
            headerTextIOS={translate(`${_LangPrefix}dtpTitle`)}
            neutralButtonLabel={"Temizle"}
            locale={getLocale()}
            onConfirm={(res) => {
              EasyReturnService.findFicheRequest.shippingDate =
                moment(res).format();
              this.setState({
                showDatePicker: false,
                selectedDate: res.toLocaleString(getLocale(), {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
              });
            }}
            onCancel={(res) => {
              this.setState({
                showDatePicker: false,
                selectedDate: "",
              });
            }}
          />

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => this.setState({ showDatePicker: true })}
            style={{
              borderColor: colors.warmGrey,
              borderWidth: 1,
              borderRadius: 8,
              padding: 16,
              paddingTop: 20,
              paddingBottom: 17,
              marginBottom: 23,
            }}
          >
            <Text
              style={{
                color: colors.darkGrey,
                lineHeight: PerfectFontSize(16),
                fontSize: PerfectFontSize(16),
                fontFamily: "Poppins_500Medium",
              }}
            >
              {this.state.selectedDate !== ""
                ? this.state.selectedDate
                : translate(`${_LangPrefix}date`)}
            </Text>
          </TouchableOpacity>
          {/* <FloTextBox
            floatingLabel
            placeholder={'Fatura Tarihinizi Girin'}
            onFocus={() => this.setState({showDatePicker: true})}
            value={this.state.selectedDate}
            refText={(input) => (this.dateInput = input)}
            // editable={false}
          /> */}
          <FloComboBox
            showClearButton
            data={ApplicationGlobalService.allPaymentTypes}
            onSelectItem={(item) =>
              (EasyReturnService.findFicheRequest.paymentType = item.id)
            }
            keyProp={"id"}
            valueProp={"title"}
            placeholder={translate(`${_LangPrefix}paymentType`)}
            selectedItem={ApplicationGlobalService.allPaymentTypes.find(
              (x) =>
                x.id === Number(EasyReturnService.findFicheRequest.paymentType)
            )}
          />

          <View>
            <FloTextBox
              placeholder={translate(`${_LangPrefix}enterProductBarcode`)}
              keyboardType={"numeric"}
              floatingLabel
              refText={(input) => (this.txtRef = input)}
              ref={(input) => (this.txtRefContainer = input)}
              value={EasyReturnService.findFicheRequest.barcode}
              onChangeText={(input) => {
                EasyReturnService.findFicheRequest.barcode = input;
              }}
              onFocus={(e) => {
                this.setState({ showCam: false });
                this.camera ? this.camera.pausePreview() : null;
              }}
              onBlur={(e) => {
                this.setState({ showCam: true });
                this.camera ? this.camera.resumePreview() : null;
              }}
            />

            <TouchableOpacity
              onPress={() =>
                Actions["easyReturnCamera"]({
                  onReadComplete: (barcode: string) => {
                    if (Actions.currentScene !== "easyFindFicheManual") {
                      Actions.pop();
                      this.txtRefContainer?.textChange(barcode);
                      this.txtRefContainer?.AnimatedTiming.start();
                    }
                  },
                  headerTitle: translate(`${_CameraLangPrefix}infoText`),
                })
              }
              style={{
                marginBottom: 30,
                position: "absolute",
                right: 9,
                top: 5,
              }}
            >
              <Entypo name={"camera"} size={40} color={colors.warmGrey} />
            </TouchableOpacity>
          </View>
          <View style={{ height: 90 }}></View>
        </KeyboardAwareScrollView>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "rgba(0,0,0,0.4)",
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <FloButton
            title={translate(`${_LangPrefix}query`)}
            onPress={() => {
              EasyReturnService.findFicheRequest.receiptNumber = "";
              EasyReturnService.findFiche();
            }}
          />
          <SafeAreaView />
        </View>
        <FloLoadingModal />
      </React.Fragment>
    );
  }
}
export default EasyReturnFindFicheManual;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

import { observer } from "mobx-react";
import React, { Component } from "react";
import { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { AntDesign, Entypo, FloButton, FloTextBox } from "../../components";
import FloCheckBox from "../../components/FloCheckBox";
import { FloHeader } from "../../components/Header";
import { PaymentTypeDetail } from "../../core/models/PaymentType";
import EasyReturnService from "../../core/services/EasyReturnService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { brightOrangeAlpha, colors } from "../../theme/colors";

interface EasyReturnSelectReturnTypeProps {}
interface EasyReturnSelectReturnTypeState {
  selectedPaymentTypes: PaymentTypeDetail[];
  totalAmount: number;
  allPaymentOptions: PaymentTypeDetail[];
  isPrintDocument: boolean;
  remainderAmount: number;
  showInfoSetPopup: boolean;
  name: string;
  rfdm: string;
  address: string;
  tckn: string;
}

// Fiche : 41790031602917720037 8681711511911
const _LangPrefix = "easyReturnSelectReturnType.";
@observer
class EasyReturnSelectReturnType extends Component<
  EasyReturnSelectReturnTypeProps,
  EasyReturnSelectReturnTypeState
> {
  state = {
    selectedPaymentTypes: [],
    totalAmount: 0,
    allPaymentOptions: [],
    isPrintDocument: false,
    remainderAmount: 0,
    showInfoSetPopup: false,
    infoSetPopupState: 1,
    name: "",
    rfdm: "",
    address: "",
    tckn: "",
  };
  txtRefContainer: FloTextBox | null | undefined;
  txtRef: any;

  // Component ilk yüklenirken
  componentDidMount() {
    this._calcPaymentOptionsMaksPrice();

    let amount = EasyReturnService.returnSelectItemPropMap.reduce(
      (a, b) => a + Number(b.item_quantity) * Number(b.returnPrice),
      0
    );

    this.setState(
      {
        totalAmount: amount,
        name: EasyReturnService.transaction
          ? EasyReturnService.transaction.customerName
          : "",
      },
      this._calcPaymentOptionsMaksPrice
    );
  }

  // Her hangi bir ödeme tipi seçilirse
  _onSelectPaymentOptions = (
    isChecked: boolean | undefined,
    paymentTypeId: string
  ) => {
    // Seçildi
    if (isChecked) {
      //@ts-ignore
      let item = this.state.allPaymentOptions.find(
        (x: PaymentTypeDetail) => x.key === paymentTypeId
      );

      // @ts-ignore
      if (item) this.state.selectedPaymentTypes.push(item);
      this.setState(
        {
          selectedPaymentTypes: this.state.selectedPaymentTypes,
        },
        this._calcPaymentOptionsMaksPrice
      );
    }
    // Çıkarıldı
    else {
      let items = this.state.selectedPaymentTypes.map(
        (x: PaymentTypeDetail) => {
          if (!x) return undefined;
          if (x.key === paymentTypeId) return undefined;
          else return x;
        }
      );

      if (items !== undefined) {
        // let newList = this.state.selectedPaymentTypes.slice(0, 1);
        // @ts-ignore
        this.setState(
          //@ts-ignore
          { selectedPaymentTypes: items },
          this._calcPaymentOptionsMaksPrice
        );
      }
    }
  };

  // Ödeme tiplerinin maksimum tutarları
  _calcPaymentOptionsMaksPrice = () => {
    let remainPrice = this._remaininAmount();

    let paymentOptions: PaymentTypeDetail[] = [];

    if (EasyReturnService.currentFiche) {
      for (var i = 0; i < EasyReturnService.currentFiche.odeme.length; i++) {
        let item = EasyReturnService.currentFiche.odeme[i];

        let amount = Number(item.value);

        let hasSelected = this.state.selectedPaymentTypes.find(
          (x: PaymentTypeDetail) => x && x.key === item.key
        );

        if (hasSelected) {
          paymentOptions.push(hasSelected);
          continue;
        }
        if (amount > remainPrice && hasSelected === undefined)
          amount = remainPrice;
        else {
          if (amount > this.state.totalAmount)
            amount = Number(this.state.totalAmount);
          else amount = Number(item.value);
        }

        paymentOptions.push({
          key: item.key,
          value: amount.toFixed(2),
          description: item.description,
        });
      }
    }

    this.setState({ allPaymentOptions: paymentOptions });
  };

  // Seçilen ödeme türüne göre toplam tutar
  _getTotalPaymentPrice = () => {
    return this.state.selectedPaymentTypes.reduce(
      (a: number, b: PaymentTypeDetail) => a + (b ? Number(b.value) : 0),
      0
    );
  };

  // Kalan ödeme tutarı
  _remaininAmount = () => {
    let amount = this.state.totalAmount - this._getTotalPaymentPrice();

    return amount > 0 ? amount : 0;
  };

  _remainderAmount = () => {
    let amount = this.state.totalAmount - this._getTotalPaymentPrice();

    return amount < 0 ? Math.abs(amount) : 0;
  };
  render() {
    return (
      <View style={styles.container}>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back"]}
          headerTitle={translate(`${_LangPrefix}title`)}
        />
        {this._renderPaymentTypeHeader()}
        <View style={styles.content}>
          {this.state.allPaymentOptions.map((item: PaymentTypeDetail) => {
            return (
              <FloCheckBox
                key={item.key}
                title={`${item.description} ( ${Number(item.value).toFixed(
                  2
                )} ₺ )`}
                disabled={Number(item.value) === 0}
                onChangeChecked={(checked) =>
                  this._onSelectPaymentOptions(checked, item.key)
                }
                textStyle={styles.checkBoxText}
              />
            );
          })}
        </View>
        <View style={styles.bottom}>
          <View style={styles.content}>
            <View style={styles.bottomInfoLine}>
              <Text style={styles.bottomInfoLineBoldText}>
                {translate(`${_LangPrefix}total`)}
              </Text>
              <Text style={styles.bottomInfoLineNomralText}>
                {`${this.state.totalAmount.toFixed(2)} ₺`}
              </Text>
            </View>
            <View style={styles.bottomInfoLine}>
              <Text style={styles.bottomInfoLineBoldText}>
                {translate(`${_LangPrefix}remain`)}
              </Text>
              <Text style={styles.bottomInfoLineNomralText}>
                {`${this._remaininAmount().toFixed(2)} ₺`}
              </Text>
            </View>
            {this._remainderAmount() > 0 && (
              <View style={styles.bottomInfoLine}>
                <Text style={styles.bottomInfoLineBoldText}>
                  {translate(`${_LangPrefix}reminder`)}
                </Text>
                <Text style={styles.bottomInfoLineNomralText}>
                  {`${this._remainderAmount().toFixed(2)} ₺`}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.content}>
            <FloButton
              title={translate(`${_LangPrefix}printDoc`)}
              containerStyle={[
                this._remaininAmount().toFixed(2) != "0.00"
                  ? { backgroundColor: colors.warm_grey_three }
                  : null,
              ]}
              onPress={() => {
                if (this._remaininAmount().toFixed(2) != "0.00") return;
                else this.setState({ showInfoSetPopup: true });
              }}
            />
            <FloButton
              containerStyle={[
                {
                  marginTop: 10,
                },
                !this.state.isPrintDocument
                  ? {
                      backgroundColor: colors.warm_grey_three,
                    }
                  : null,
              ]}
              title={translate(`${_LangPrefix}completeTransaction`)}
              activeOpacity={this.state.isPrintDocument ? 0.7 : 1}
              onPress={() =>
                EasyReturnService.returnCommit().then((r) => {
                  if (r) {
                    this.state.isPrintDocument
                      ? Actions["easyReturnComplete"]()
                      : null;
                  }
                })
              }
            />
          </View>
        </View>
        <SafeAreaView />
        {this.state.showInfoSetPopup && (
          <View
            style={{
              position: "absolute",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: (Dimensions.get("window").height - 500) / 2,
            }}
          >
            <KeyboardAwareScrollView>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  padding: 15,
                  width: Dimensions.get("window").width - 40,
                  minHeight: 200,
                }}
              >
                <FloTextBox
                  placeholder={"Müşteri Adı"}
                  floatingLabel
                  value={this.state.name}
                  onChangeText={(input) => this.setState({ name: input })}
                />
                <FloTextBox
                  placeholder={"Müşteri TCKN / Müşteri VKN"}
                  floatingLabel
                  onChangeText={(input) => this.setState({ tckn: input })}
                />
                <FloTextBox
                  placeholder={"Müşteri Adresi"}
                  multiline
                  floatingLabel
                  inputHeight={200}
                  onChangeText={(input) => this.setState({ address: input })}
                />
                <View>
                  <FloTextBox
                    placeholder={"RFDM Fiş Numarası"}
                    floatingLabel
                    onChangeText={(input) => this.setState({ rfdm: input })}
                    refText={(input) => (this.txtRef = input)}
                    ref={(input) => (this.txtRefContainer = input)}
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: 13,
                      top: 5,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        Actions["easyReturnCamera"]({
                          onReadComplete: (barcode: string) => {
                            if (
                              Actions.currentScene !==
                              "easyReturnSelectReturnType"
                            ) {
                              this.txtRefContainer?.textChange(barcode);
                              this.txtRefContainer?.AnimatedTiming.start();
                              Actions.pop();
                            }
                          },
                          headerTitle: translate(`easyReturnCamera.infoText`),
                        });
                      }}
                    >
                      <Entypo
                        name={"camera"}
                        size={40}
                        color={colors.warmGrey}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <FloButton
                    containerStyle={{
                      backgroundColor: "red",
                      width: (Dimensions.get("window").width - 80) / 2,
                    }}
                    onPress={() => this.setState({ showInfoSetPopup: false })}
                    title={translate("messageBox.cancel")}
                  />
                  <FloButton
                    containerStyle={{
                      width: (Dimensions.get("window").width - 80) / 2,
                    }}
                    onPress={() => {
                      if (
                        this.state.name &&
                        this.state.tckn &&
                        this.state.address &&
                        this.state.rfdm &&
                        this.state.selectedPaymentTypes
                      ) {
                        EasyReturnService.printDoc(
                          this.state.name,
                          this.state.tckn,
                          this.state.address,
                          this.state.rfdm,
                          this.state.selectedPaymentTypes
                        ).then((r) => {
                          if (r) {
                            this.setState({
                              isPrintDocument: true,
                              showInfoSetPopup: false,
                            });
                          }
                        });
                      } else {
                        MessageBox.Show(
                          "Tüm alanların eksiksiz doldurulması gerekmektedir.",
                          MessageBoxDetailType.Danger,
                          MessageBoxType.Standart,
                          () => {},
                          () => {}
                        );
                      }
                    }}
                    title={"Tamamla"}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        )}
      </View>
    );
  }

  _renderPaymentTypeHeader = () => {
    return (
      <React.Fragment>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {translate(`${_LangPrefix}headerTotalAmount`)}
          </Text>
          <Text style={styles.headerPrice}>
            {`${this.state.totalAmount.toFixed(2)} ₺`}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoTitle}>
            {translate(`${_LangPrefix}selectPaymentType`)}
          </Text>
        </View>
      </React.Fragment>
    );
  };
}
export default EasyReturnSelectReturnType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  checkBoxText: {
    textTransform: "capitalize",
  },
  header: {
    backgroundColor: brightOrangeAlpha(0.05),
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: PerfectFontSize(14),
    lineHeight: PerfectFontSize(18),
    color: colors.darkGrey,
  },
  headerPrice: {
    fontFamily: "Poppins_700Bold",
    fontSize: PerfectFontSize(16),
    lineHeight: PerfectFontSize(19),
    color: colors.brightOrange,
  },
  info: {
    paddingTop: 20,
    paddingLeft: 20,
    borderBottomColor: colors.pinkishGrey,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  infoTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: PerfectFontSize(14),
    lineHeight: PerfectFontSize(18),
    color: colors.darkGrey,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomInfoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomInfoLineBoldText: {
    fontFamily: "Poppins_700Bold",
  },
  bottomInfoLineNomralText: {
    fontFamily: "Poppins_400Regular",
  },
});

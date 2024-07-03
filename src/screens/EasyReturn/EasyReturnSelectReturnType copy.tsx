import { observer } from "mobx-react";
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import { AntDesign, FloButton, FontAwesome } from "../../components";
import FloCheckBox from "../../components/FloCheckBox";
import { FloHeader } from "../../components/Header";
import EasyReturnService from "../../core/services/EasyReturnService";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { brightOrangeAlpha, colors } from "../../theme/colors";

@observer
class EasyReturnSelectReturnType extends Component {
  state = {
    selectedRadio: 1,
    isPrintDocument: false,
    totalAmount: 0,
    selectedAmount: 0,
    selectedAmounts: [],
  };

  componentDidMount() {
    this.setState(
      {
        totalAmount: EasyReturnService.returnSelectItemPropMap
          .reduce(
            (a, b) => a + Number(b.returnPrice) * Number(b.item_quantity),
            0
          )
          .toFixed(2),
      },
      () => {
        for (
          var index = 0;
          index < EasyReturnService.returnSelectItemPropMap[0].odeme.length;
          index++
        ) {
          let amount: number = Number(
            EasyReturnService.returnSelectItemPropMap[0].odeme[index].value
          );

          if (amount > this.state.totalAmount) {
            // @ts-ignore
            EasyReturnService.returnSelectItemPropMap[0].odeme[index].value =
              this.state.totalAmount;
          }
        }
      }
    );
  }

  _amountPlus = (index: number) => {
    //@ts-ignore
    let amount: number = Number(this.state.selectedAmounts[index].value);

    if (amount + 1 > this.state.totalAmount) {
      amount = this.state.totalAmount;
    } else {
      amount++;
    }

    //@ts-ignore
    this.state.selectedAmounts[index].value = amount;

    this.setState(this.state, this._calcTotalAmount);
  };

  _amountMinus = (index: number) => {
    //@ts-ignore
    let amount: number = Number(this.state.selectedAmounts[index].value);

    if (amount - 1 > 0) {
      amount--;
    }

    //@ts-ignore
    this.state.selectedAmounts[index].value = amount;

    this.setState(this.state, this._calcTotalAmount);
  };

  _calcTotalAmount = () => {
    let selectedAmount = this.state.selectedAmounts.reduce(
      //@ts-ignore
      (a, b) => a + Number(b.value),
      0
    );

    this.setState({ selectedAmount });
  };

  _renderRadio = (
    radioIndex: number,
    title: string,
    isSelect: boolean = false
  ) => {
    return (
      <TouchableOpacity
        style={styles.radio}
        onPress={() => this.setState({ selectedRadio: radioIndex })}
      >
        <View style={styles.radioIconContainer}>
          <FontAwesome
            size={25}
            name={isSelect ? "dot-circle-o" : "circle-o"}
            color={colors.brightOrange}
          />
        </View>
        <Text
          style={[
            styles.radioTitle,
            isSelect ? styles.radioTitleSelected : null,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back"]}
          headerTitle={"İade Türü"}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>İade Edilecek Toplam Tutar</Text>
            <Text style={styles.headerPrice}>
              {this.state.totalAmount}
              TL
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoTitle}>İade Yöntemini Seçiniz</Text>
          </View>
          <View style={styles.radioContainer}>
            {EasyReturnService.returnSelectItemPropMap[0].odeme.map((item) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <FloCheckBox
                    onChangeChecked={(it) => {
                      if (it) {
                        this.setState(
                          {
                            selectedAmounts: [
                              ...this.state.selectedAmounts,
                              item,
                            ],
                          },
                          this._calcTotalAmount
                        );
                      } else {
                        this.setState(
                          {
                            selectedAmounts: this.state.selectedAmounts
                              .map((x: any) => {
                                if (x === undefined) return;

                                if (x && x.key === item.key) {
                                } else {
                                  return x;
                                }
                              })
                              .filter((x) => x),
                          },
                          this._calcTotalAmount
                        );
                      }
                    }}
                    title={`${item.description} ( ${Number(item.value).toFixed(
                      2
                    )} ₺ )`}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.buttonContainer}>
            <View style={{ height: 0.3, backgroundColor: "#999" }}></View>
            <View style={{ marginBottom: 20, paddingTop: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    lineHeight: PerfectFontSize(25),
                  }}
                >
                  Toplam
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    lineHeight: PerfectFontSize(25),
                  }}
                >{`${this.state.totalAmount} ₺`}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    lineHeight: PerfectFontSize(25),
                  }}
                >
                  Kalan
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular", lineHeight: 25 }}
                >
                  {(this.state.totalAmount - this.state.selectedAmount).toFixed(
                    2
                  )}{" "}
                  ₺
                </Text>
              </View>
            </View>
            <FloButton
              title={"Gider Pusulasını Yazdır"}
              onPress={() => this.setState({ isPrintDocument: true })}
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
              title={"İadeyi Tamamla"}
              activeOpacity={this.state.isPrintDocument ? 0.7 : 1}
              onPress={() =>
                this.state.isPrintDocument
                  ? Actions["easyReturnComplete"]()
                  : null
              }
            />
          </View>
        </View>
      </React.Fragment>
    );
  }
}
export default EasyReturnSelectReturnType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    lineHeight: 18,
    color: colors.darkGrey,
  },
  headerPrice: {
    fontFamily: "Poppins_700Bold",
    fontSize: PerfectFontSize(16),
    lineHeight: 19,
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
    lineHeight: 18,
    color: colors.darkGrey,
  },
  radioContainer: {
    paddingLeft: 30,
    paddingTop: 15,
  },
  radio: { flexDirection: "row", paddingBottom: 14, alignItems: "center" },
  radioIconContainer: {
    marginRight: 10,
  },
  radioTitle: {
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(15),
    lineHeight: 17.6,
    letterSpacing: -0.38,
    color: colors.darkGrey,
  },
  radioTitleSelected: {
    fontFamily: "Poppins_500Medium",
    color: colors.brightOrange,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 30,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

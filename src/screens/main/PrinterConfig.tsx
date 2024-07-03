import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native";
import { FloButton } from "../../components";
import { colors } from "../../theme/colors";
import FloSlidingModal from "../../components/Modal/FloSlidingModal";
import { FloHeader } from "../../components/Header";
import { toOrganizationScheme } from "../../core/Util";
import { translate } from "../../helper/localization/locaizationMain";
import PrinterConfigService from "../../core/services/PrinterConfigService";
import { observer } from "mobx-react";
import * as bleLib from "react-native-ble-plx";
import { PerfectFontSize } from "../../helper/PerfectPixel";

@observer
class PrinterConfig extends Component {
  blManager: bleLib.BleManager | undefined;
  state = {
    devices: [],
    modalVisible: false,
    selectedDevice: null,
    config: null,
    isLoading: false,
  };
  componentDidMount() {
    this.getDevices();
    PrinterConfigService.loadAllPrinterConfigs();
  }

  constructor(props: any) {
    super(props);
    this.blManager = new bleLib.BleManager();
  }

  getDevices = async () => {};

  setPrinterConfig = async () => {
    if (this.state.selectedDevice === null && Platform.OS !== "ios") {
      Alert.alert(translate("printerConfig.pleaseSelectDevice"));
    } else if (this.state.config === null || this.state.config === undefined) {
      Alert.alert(translate("printerConfig.pleaseSelectDevice"));
    } else {
      // PrinterConfigService.setConfig(this.state.config);
      // PrinterConfigService.selectedPrinter(this.state.selectedDevice);
      PrinterConfigService.setPrintConfig(
        this.state.selectedDevice,
        this.state.config
      );
    }
  };

  printProductTag = async () => {
    let data = {
      product: { barcode: "" },
      tagValue: [
        {
          tag: "DATAB1",
          key: "<fiyatTarihi>",
          title: "Price Creation Date",
          value: "2020-10-01",
        },
        {
          tag: "ZZTSHKD",
          key: "",
          title: "Teşhir Kodu",
          value: "10-LUMBERJACK-ERKEK-OUTDOOR",
        },
        {
          tag: "KBETR4",
          key: "<f4>",
          title: "Installment price",
          value: "269.99",
        },
        {
          tag: "KBETR2",
          key: "<f3>",
          title: "First Installment Price",
          value: "369.99",
        },
        {
          tag: "KBETR3",
          key: "<f2>",
          title: "Advance Price",
          value: "249.99",
        },
        {
          tag: "KBETR1",
          key: "<f1>",
          title: "First Advance Price",
          value: "339.99",
        },
        {
          tag: "LANDX",
          key: "<uretimyeri>",
          title: "Origin",
          value: "Çin",
        },
        {
          tag: "SIZE1",
          key: "<size>",
          title: "Body Size",
          value: "41",
        },
        {
          tag: "TANIM",
          key: "<renk>",
          title: "Color",
          value: "SIYAH",
        },
        {
          tag: "MAKTX",
          key: "<stokadi>",
          title: "Product Description",
          value: "9W URSA 9PR,SIYAH/MAVI, 41",
        },
        {
          tag: "EAN11",
          key: "1234567890123",
          title: "Ean Code",
          value: "8682222042062",
        },
        {
          tag: "SATNR",
          key: "",
          title: "Generic",
          value: "000000000100420726",
        },
        {
          tag: "MATNR",
          key: "<urunkodu>",
          title: "Material",
          value: "000000100420726002",
        },
      ],
    };
    PrinterConfigService.printProductTag(data);
  };
  render() {
    return (
      <>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back", "profile"]}
          headerTitle={"Etiket"}
        />

        {Platform.OS === "ios" ? (
          <Text>Ios</Text>
        ) : Platform.OS === "android" ? (
          <Text>Android</Text>
        ) : null}
        <FloSlidingModal
          isVisible={this.state.modalVisible}
          onClosing={() => this.setState({ modalVisible: false })}
          onClosingCancel={() => this.setState({ modalVisible: true })}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <FlatList
              data={this.state.devices}
              ListEmptyComponent={
                <Text>{translate("printerConfig.deviceNotFound")}</Text>
              }
              renderItem={(item: any) => (
                <TouchableOpacity
                  style={[
                    {
                      height: 60,
                      width: Dimensions.get("window").width - 80,
                      borderWidth: 1,
                      borderRadius: 5,
                      margin: 10,
                      marginTop: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => {
                    this.setState({
                      modalVisible: false,
                      selectedDevice: item.item,
                    });
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: "center" }}>
                      {item.item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            ></FlatList>
          </View>
        </FloSlidingModal>
        {/* <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
					
				</Modal> */}

        <View style={[styles.container, { flexDirection: "row" }]}>
          <FlatList
            data={this.props.printerConfigList.filter(
              (x) =>
                x.siteId ===
                toOrganizationScheme(
                  this.props.employeeInfo.ExpenseLocationCode
                )
            )}
            keyExtractor={(item) => item.id}
            renderItem={(item) => {
              return (
                <TouchableOpacity
                  key={item.item.id}
                  style={[
                    styles.configListButton,
                    item.item.id === this.state.config?.id
                      ? { borderColor: colors.brightOrange }
                      : null,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => this.setState({ config: item.item })}
                >
                  <View style={{ flex: 2 }}>
                    <Text style={{ textAlign: "center" }}>
                      {item.item.title}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: PerfectFontSize(10) }}> | </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image
                      style={styles.configListImage}
                      source={{
                        uri: item.item.image?.substring(1),
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          ></FlatList>
        </View>
        <View style={{ margin: 10 }}>
          <FloButton
            title={translate("printerConfig.setSetingsAndPrintBarcode")}
            onPress={() => this.setPrinterConfig()}
          />
        </View>
      </>
    );
  }
}

export default PrinterConfig;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  configListButton: {
    height: 90,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  configListImage: {
    height: 80,
    width: 80,
    resizeMode: "contain",
  },
});

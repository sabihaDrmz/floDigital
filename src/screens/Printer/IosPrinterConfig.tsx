import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import * as bleLib from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloHeader } from "../../components/Header";
import { AntDesign, FloButton, Foundation } from "../../components";
import PrinterConfigService from "../../core/services/PrinterConfigService";
import { observer } from "mobx-react";
import FloPrinterConfigLoadingModal from "../../components/Modal/FloPrinterConfigLoadingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate } from "../../helper/localization/locaizationMain";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import StickerTag from "./StickerCard";
import {
  DiscountIcon,
  NewIcon,
} from "../../components/CustomIcons/MainPageIcons";
import DevicePicker from "./DevicePicker";
import PrinterImagePopup from "./PrinterImagePopup";
import { GetServiceUri, ServiceUrlType } from "../../core/Settings";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import StickerAccordion from "./StickerAccordion";
import OmsIcon from "../../components/CustomIcons/OmsIcon";
import { AppColor } from "@flomagazacilik/flo-digital-components";

@observer
class IosPrinterConfig extends Component {
  state = {
    devices: [],
    modalVisible: false,
    selectedDevice: undefined,
    isSearch: false,
    config: undefined,
    image: null,
    showImageModal: false,
  };
  bleManager: bleLib.BleManager | undefined;

  constructor(props: any) {
    super(props);
    this.bleManager = new bleLib.BleManager();
    this.findDevices();
  }

  componentDidMount() {
    PrinterConfigService.loadAllPrinterConfigs();
    // this.restoreConfig();
    if (
      PrinterConfigService.selectedPrinter &&
      PrinterConfigService.selectedPrinter !== this.state.selectedDevice
    )
      this.setState({ selectedDevice: PrinterConfigService.selectedPrinter });
  }

  restoreConfig = async () => {
    let result = await AsyncStorage.getItem("@floDigital_PrinterConfig");

    if (result) {
      let parsedResult = JSON.parse(result);

      this.setState({
        selectedDevice: parsedResult.printer,
        config: parsedResult.config,
      });
    }
  };

  saveSettings() {
    this.bleManager?.stopDeviceScan();
    PrinterConfigService.setPrintConfig(
      this.state.selectedDevice,
      this.state.config
    );
  }

  findDevices() {
    if (this.bleManager) {
      this.bleManager.onStateChange((state) => {
        if (state === bleLib.State.PoweredOn) {
          AsyncStorage.getItem("@key_BtDevice").then((x) => {
            let a: string[] | null = (x + " ").split(" ");
            this.bleManager
              ?.connectedDevices(a)
              .then((t) => {})
              .catch((err) => "hata burda");
          });
          this.setState({ isSearch: true });
          this.bleManager?.startDeviceScan(null, null, (error, device) => {
            if (
              !error &&
              device &&
              device.name &&
              device.serviceUUIDs &&
              device.serviceUUIDs.length > 0
            ) {
              let last = this.state.devices.find(
                (x: any) => x?.id === device.id
              );

              if (!last) {
                this.setState({
                  devices: [
                    ...this.state.devices,
                    {
                      id: device.id,
                      deviceUUID: device.serviceUUIDs[0],
                      name: device.name,
                      localName: device.localName,
                    },
                  ],
                });
              }
            }
          });
        }
      });

      setTimeout(() => {
        this.bleManager?.stopDeviceScan();
        this.setState({ isSearch: false });
      }, 4000);
    }
  }

  CheckRSS = (rss?: number) => {
    if (rss === undefined) return false;
    if (rss > -15) return false;
    else if (rss < -80) return false;

    return true;
  };

  render() {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          headerTitle={translate("moreScreen.printerConfig")}
          enableButtons={["back"]}
        />
        <View style={styles.container}>
          <View
            style={{ marginTop: 20, position: "absolute", top: 80, left: 20 }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: Dimensions.get("window").height - 330 }}
            >
              {PrinterConfigService.printerConfigList
                .filter((x) => x.ptcConfigs.length > 0)
                .map((x) => {
                  return (
                    <StickerAccordion
                      title={x.name}
                      items={x.ptcConfigs}
                      icon={
                        x.icon === "discount" ? (
                          <DiscountIcon />
                        ) : x.icon === "season" ? (
                          <NewIcon />
                        ) : (
                          <Foundation
                            name={"indent-more"}
                            size={30}
                            color={AppColor.FD.Brand.Solid}
                          />
                        )
                      }
                      renderItem={(item, index) => {
                        return (
                          <StickerTag
                            //@ts-ignore
                            selectedTag={this.state.config?.id}
                            onSelect={(config) => {
                              this.setState({ config });
                            }}
                            sticker={item}
                            onImageClick={() => {
                              this.setState({
                                image: {
                                  uri: item.image,
                                },
                                showImageModal: true,
                              });
                            }}
                          />
                        );
                      }}
                    />
                  );
                })}
            </ScrollView>
          </View>
          <DevicePicker
            onSelectDevice={(device) =>
              this.setState({ selectedDevice: device })
            }
            selectedDevice={this.state.selectedDevice}
            devices={this.state.devices}
          />
        </View>
        <View style={{ marginLeft: 20, marginRight: 20 }}>
          <FloButton
            onPress={() => this.saveSettings()}
            activeOpacity={0.8}
            title={translate("printerConfig.setSetingsAndPrintBarcode")}
          />
        </View>
        <SafeAreaView />
        <FloPrinterConfigLoadingModal />
        {this.state.showImageModal && (
          <PrinterImagePopup
            onClose={() => this.setState({ showImageModal: false })}
            image={this.state.image}
          />
        )}
      </React.Fragment>
    );
  }
}
export default IosPrinterConfig;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  configListButton: {
    height: 90,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  configListImage: {
    height: 80,
    width: 80,
    resizeMode: "contain",
  },
});

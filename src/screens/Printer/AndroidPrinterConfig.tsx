import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { FloButton, Foundation } from "../../components";
import { FloHeader } from "../../components/Header";
import PrinterConfigService from "../../core/services/PrinterConfigService";
import { FloZebraPrinter } from "@flomagazacilik/flo-zebra-bt";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import { translate } from "../../helper/localization/locaizationMain";
import StickerTag from "./StickerCard";
import DevicePicker from "./DevicePicker";
import {
  NewIcon,
  DiscountIcon,
} from "../../components/CustomIcons/MainPageIcons";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StickerAccordion from "./StickerAccordion";
import { AppColor } from "@flomagazacilik/flo-digital-components";

@observer
class AndroidPrinterConfig extends Component {
  state = {
    selectedDevice: undefined,
    modalVisible: false,
    devices: [],
    isSearch: false,
    config: undefined,
  };

  componentDidMount() {
    PrinterConfigService.loadAllPrinterConfigs();
    this.restoreConfig();
    this.loadDevices();
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

  loadDevices = async () => {
    FloZebraPrinter.pairedDevices().then((devices) => {
      if (devices) this.setState({ devices });
    });
  };

  saveSettings() {
    if (this.state.selectedDevice && this.state.config) {
      PrinterConfigService.setPrintConfig(
        this.state.selectedDevice,
        this.state.config
      );
    } else {
      if (!this.state.selectedDevice)
        MessageBox.Show(
          translate("printerConfig.pleaseSelectDevice"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
      else if (!this.state.config)
        MessageBox.Show(
          translate("printerConfig.pleaseSelectConfig"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
    }
  }
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
        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
            ...Platform.select({ android: { marginBottom: 10 } }),
          }}
        >
          <FloButton
            onPress={() => this.saveSettings()}
            activeOpacity={0.8}
            title={translate("printerConfig.setSetingsAndPrintBarcode")}
          />
        </View>
        <SafeAreaView />
        {/* <FloPrinterConfigLoadingModal /> */}
      </React.Fragment>
    );
  }
}
export default AndroidPrinterConfig;

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

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { FloButton, Foundation } from "../../components";
import { FloZebraBtInfo, FloZebraPrinter } from "@flomagazacilik/flo-zebra-bt";
import { translate } from "../../helper/localization/locaizationMain";
import DevicePicker from "./DevicePicker";
import {
  NewIcon,
  DiscountIcon,
} from "../../components/CustomIcons/MainPageIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppButton, AppColor, ColorType } from "@flomagazacilik/flo-digital-components";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";
import FloHeaderNew from "../Header/FloHeaderNew";
import StickerAccordion from "./StickerAccordion";
import StickerCard from "./StickerCard";
import { PrinterConfigProp } from "../../contexts/model/PrinterConfigGroupModel";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { TextManipulator } from "../../NewComponents/FormElements/AppTextBox";
import PrinterImagePopup from "./PrinterImagePopup";
import { useBluetoothModuleService } from "../../contexts/BluetoothModuleService";

const AndroidPrinterConfig = () => {
  const PrinterConfigService = usePrinterConfigService();
  const MessageBox = useMessageBoxService();
  const [selectedDevice, setSelectedDevice] = useState();
  const [devices, setDevices] = useState<FloZebraBtInfo[]>([]);
  const [config, setConfig] = useState<PrinterConfigProp>({
    id: 0,
    alias: "",
    title: "",
    contents: "",
    image: "",
    siteId: 0,
    config: "",
    twiceGroup: null,
  });
  const [image, setImage] = useState<any>();
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState("0")
  const { requestPermissions } = useBluetoothModuleService();

  useEffect(() => {
    requestPermissions();
    if (!isLoading) {
      PrinterConfigService.loadAllPrinterConfigs();
      restoreConfig();
      loadDevices();
      if (
        PrinterConfigService.selectedPrinter &&
        PrinterConfigService.selectedPrinter !== selectedDevice
      )
        setSelectedDevice(PrinterConfigService.selectedPrinter);

      setIsLoading(true);
    }
  }, []);

  const restoreConfig = async () => {
    let result = await AsyncStorage.getItem("@floDigital_PrinterConfig");

    if (result) {
      let parsedResult = JSON.parse(result);

      setSelectedDevice(parsedResult.printer);
      setConfig(parsedResult.config);
    }
  };
  const loadDevices = async () => {
    FloZebraPrinter.pairedDevices().then((devices) => {
      if (devices) setDevices(devices);
    });
  };
  const saveSettings = () => {
    if (selectedDevice && config) {
      PrinterConfigService.setPrintConfig(selectedDevice, config);
    } else {
      if (!selectedDevice)
        MessageBox.show(translate("printerConfig.pleaseSelectDevice"));
      else if (!config)
        MessageBox.show(translate("printerConfig.pleaseSelectConfig"));
    }
  };

  return (
    <React.Fragment>
      <FloHeaderNew
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
            {PrinterConfigService.printerConfigList.map((x) => {
              const uniqueTwiceGroups = {};
              const filteredPrinterConfigProps = [];
              for (const printerConfigProp of x.ptcConfigs) {
                const { twiceGroup } = printerConfigProp;
                if (twiceGroup) {
                  if (!uniqueTwiceGroups[twiceGroup]) {
                    uniqueTwiceGroups[twiceGroup] = true;
                    filteredPrinterConfigProps.push(printerConfigProp);
                  }
                } else {
                  filteredPrinterConfigProps.push(printerConfigProp);
                }
              }

              return (
                <StickerAccordion
                  title={x.name}
                  items={filteredPrinterConfigProps}
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
                      <StickerCard
                        selectedTag={config?.id || 0}
                        onSelect={() => {
                          setConfig(item);
                        }}
                        sticker={item}
                        onImageClick={() => {
                          setImage({
                            uri: item.image,
                          });
                          setShowImageModal(true);
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
          onSelectDevice={(device) => setSelectedDevice(device)}
          selectedDevice={selectedDevice}
          devices={devices}
        />
      </View>
      {PrinterConfigService.selectedPrinter && PrinterConfigService.printerConfig.alias === "ADRESMK" && (
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
          <FloTextBoxNew
            keyboardType={"numeric"}
            value={quantity}
            onChangeText={(txt) =>
              setQuantity(TextManipulator(txt, "onlyNumber"))
            }
            style={{
              borderColor: "#CECACA",
              backgroundColor: "#fff",
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: 8,
              height: 50,
              paddingHorizontal: 20,
              marginRight: 30,
              fontFamily: "Poppins_200ExtraLight",
              fontSize: 18,
              color: "#707070",
              marginBottom: 5
            }}
            maxLength={2}
          />
          <AppButton
            style={{ paddingHorizontal: 10 }}
            onPress={async () => {
              if (parseInt(quantity) > 0) {
                if (parseInt(quantity) > 20) {
                  MessageBox.show("Мојата компанија одобрува повеќе од 20 кандидати за печатење етикети?", {
                    type: MessageBoxType.YesNo,
                    yesButtonEvent: async () => {
                      await PrinterConfigService.quantiyOfTextPrint(parseInt(quantity));
                      setQuantity("0");
                    },
                    yesButtonTitle: "Да",
                    noButtonTitle: "бр"
                  });
                } else {
                  await PrinterConfigService.quantiyOfTextPrint(parseInt(quantity));
                  MessageBox.show("Печатењето заврши успешно");
                  setQuantity("0");
                }
              } else
                MessageBox.show("Ве молиме внесете валидна количина");
            }}
            buttonColorType={ColorType.Danger}
            title="печатење етикета"
          />
        </View>

      )}
      <View
        style={{
          marginLeft: 20,
          marginRight: 20,
          ...Platform.select({ android: { marginBottom: 10 } }),
        }}
      >
        <FloButton
          onPress={saveSettings}
          activeOpacity={0.8}
          title={translate("printerConfig.setSetingsAndPrintBarcode")}
        />
      </View>
      <SafeAreaView />
      {showImageModal && (
        <PrinterImagePopup
          onClose={() => setShowImageModal(false)}
          image={image}
        />
      )}
    </React.Fragment>
  );
};
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

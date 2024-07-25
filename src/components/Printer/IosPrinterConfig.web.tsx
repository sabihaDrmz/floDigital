import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloButton } from "../../components";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import FloPrinterConfigLoadingModal from "../../components/Modal/FloPrinterConfigLoadingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate } from "../../helper/localization/locaizationMain";
import {
  DiscountIcon,
  NewIcon,
} from "../../components/CustomIcons/MainPageIcons";
import { AppButton, AppColor, AppText, ColorType } from "@flomagazacilik/flo-digital-components";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";
import FloHeaderNew from "../Header/FloHeaderNew";
import DevicePicker from "./DevicePicker";
import PrinterImagePopup from "./PrinterImagePopup";
import StickerCard from "./StickerCard";
import { PrinterConfigProp } from "../../contexts/model/PrinterConfigGroupModel";
import StickerAccordion from "./StickerAccordion";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { TextManipulator } from "../../NewComponents/FormElements/AppTextBox";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";

const IosPrinterConfig = () => {
  var PrinterConfigService = usePrinterConfigService();
  var MessageBox = useMessageBoxService();
  const [devices, setDevices] = useState<any>([]);
  const [selectedDevice, setSelectedDevice] = useState();
  const [isSearch, setIsSearch] = useState(false);
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
  const bleManager: undefined = null;
  const [quantity, setQuantity] = useState("0")

  useEffect(() => {
    if (!isLoading) {
      findDevices();
      PrinterConfigService.loadAllPrinterConfigs();

      if (
        PrinterConfigService.selectedPrinter &&
        PrinterConfigService.selectedPrinter !== selectedDevice
      )
        setSelectedDevice(PrinterConfigService.selectedPrinter);

      setIsLoading(true);
    }
  }, []);

  const findDevices = () => {

  };

  const saveSettings = () => {
    bleManager?.stopDeviceScan();
    PrinterConfigService.setPrintConfig(selectedDevice, config);
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
                      <FontAwesomeIcon
                        icon={"indent-more"}
                        size={30}
                        color={AppColor.FD.Brand.Solid}
                      />
                    )
                  }
                  renderItem={(item, index) => {
                    return (
                      <StickerCard
                        //@ts-ignore
                        selectedTag={config?.id}
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
        <KeyboardAvoidingView behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 30 }}>
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
      <View style={{ marginLeft: 20, marginRight: 20 }}>
        <FloButton
          onPress={saveSettings}
          activeOpacity={0.8}
          title={translate("printerConfig.setSetingsAndPrintBarcode")}
        />
      </View>
      <SafeAreaView />
      <FloPrinterConfigLoadingModal />
      {showImageModal && (
        <PrinterImagePopup
          onClose={() => setShowImageModal(false)}
          image={image}
        />
      )}
    </React.Fragment>
  );
};
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

import axios from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { Platform } from "react-native";
import AccountService from "./AccountService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
import { translate } from "../../helper/localization/locaizationMain";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import {
  formatKzkChars,
  formatLabel,
} from "../../helper/localization/PrintLabelFormatter";
import MessageBoxNew from "./MessageBoxNew";
import { ServiceResponseBase } from "../models/ServiceResponseBase";
import { FloZebraPrinter } from "@flomagazacilik/flo-zebra-bt";
import { FloDigitalErrorParse } from "../HttpModule";
import ApplicationGlobalService from "./ApplicationGlobalService";
import ProductService from "./ProductService";
//@ts-ignore
import base64 from "react-native-base64";

//TODO:EXPO pathfinder
// import * as Pathfinder from "@flomagazacilik/flo-pathfinder";
import moment from "moment";
class PrinterConfigService {
  @observable printerConfigList: PrinterConfigGroup[] = [];
  @observable isLoading: boolean = false;
  @observable selectedPrinter: any | undefined;
  @observable printerConfig: any | undefined;
  @observable showLoadingPopup: boolean = false;
  @observable iosConnection: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  @action setPrinter = async (printer: any) => {
    this.selectedPrinter = printer;
  };

  @action setConfig = async (config: any) => {
    this.printerConfig = config;
  };

  @action loadAllPrinterConfigs = async () => {
    try {
      let uri = GetServiceUri(ServiceUrlType.PRINTER_CONFIG);
      this.isLoading = true;
      var res = await axios.get<ServiceResponseBase<PrinterConfigGroup[]>>(
        uri,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );
      if (res.data) {
        this.printerConfigList = res.data.model;
      } else {
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      // if (chekcAuthError(err)) {
      //   AccountService.logOut();
      //   MessageBox.Show(
      //     translate("errorMsgs.sessionTimeout"),
      //     MessageBoxDetailType.Information,
      //     MessageBoxType.Standart,
      //     () => {},
      //     () => {}
      //   );
      // }
    } finally {
      this.isLoading = false;
    }
  };

  @action restorePrinterConfig = async () => {
    let result = await AsyncStorage.getItem("@floDigital_PrinterConfig");
    if (result) {
      let parsedResult = JSON.parse(result);
      this.selectedPrinter = parsedResult.printer;
      this.printerConfig = parsedResult.config;
    }
  };

  @action setPrintConfig = async (printer: any, printerConfig: any) => {
    try {
      if (
        printer === undefined ||
        printerConfig === undefined ||
        Object.keys(printer).length == 0 ||
        Object.keys(printerConfig).length == 0
      ) {
        MessageBox.Show(
          translate("printerConfig.pleaseSelectConfig"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
      } else {
        this.isLoading = true;
        this.selectedPrinter = printer;
        this.printerConfig = printerConfig;

        await AsyncStorage.setItem(
          "@floDigital_PrinterConfig",
          JSON.stringify({
            printer: this.selectedPrinter,
            config: this.printerConfig,
          })
        );

        if (Platform.OS === "ios") {
          await this.print(
            printer.id,
            printerConfig.config,
            printer.deviceUUID
          );
        } else {
          await this.print(
            this.selectedPrinter.address,
            this.printerConfig.config
          );
        }

        MessageBoxNew.show(translate("errorMsgs.completeLabelConfig"));
      }
    } catch (err: any) {
      if (
        err.toString().indexOf("Broken pipe") > 0 &&
        Platform.OS === "android"
      ) {
        let res = await FloZebraPrinter.retryConnection(
          this.selectedPrinter.address
        );
        if (res) this.setPrintConfig(printer, printerConfig);
      }
      this.isLoading = false;
      this.showLoadingPopup = false;
    } finally {
      this.isLoading = false;
    }
  };

  @action print = async (
    printerId: any,
    data: any,
    printerUUID: string = ""
  ) => {
    this.showLoadingPopup = true;
    if (Platform.OS === "android") {
      await FloZebraPrinter.print(printerId, data);
    } else if (Platform.OS === "ios") {
      try {
        if (!this.iosConnection) {
          let connState = await FloZebraPrinter.isEnabledBluetooth();
          while (connState === "false") {
            connState = await FloZebraPrinter.isEnabledBluetooth();
          }
          let res = await FloZebraPrinter.connectDevice(printerId);
          console.log("connection", res);
          this.iosConnection = true;
          await new Promise((x) => setTimeout((y) => x(true), 500));
        }

        var salesOrg = ApplicationGlobalService.getSalesOrganization();
        // if (!res) return;
        await AsyncStorage.setItem("@key_BtDevice", printerUUID);

        // Kazakistan Kiril alfabesi olanı basıyor
        if (salesOrg === "3111" || salesOrg === "3112" || salesOrg === "3114") {
          // Kiril alfabesi için düzenleme yapıldı
          var newData = formatKzkChars(data);
          FloZebraPrinter.print(newData);
        } else {
          FloZebraPrinter.print(data);
        }

        setTimeout(
          () =>
            runInAction(() => {
              this.showLoadingPopup = false;
            }),
          1500
        );
      } catch (err: any) {
        FloDigitalErrorParse(err);
      }
    }
    this.showLoadingPopup = false;
  };

  @action printProductTag = async (data: any) => {
    let printer = this.selectedPrinter;
    let printerConfig = this.printerConfig;
    console.log(data);
    const store = ApplicationGlobalService.allStore.find(
      (x) => x.werks === AccountService.getUserStoreId().toString()
    );
    if (
      (AccountService?.employeeInfo?.ExpenseLocationCode?.substring(3) ===
        "8801" ||
        store?.country === "RU") &&
      Platform.OS === "ios"
    ) {
      console.log(data);
      var rawSaveData = await AsyncStorage.getItem("@flo_ru_printer_info");
      if (rawSaveData !== null) {
        const parsedSaveData = JSON.parse(rawSaveData);
        console.log(new Date());
        axios
          .post(
            GetServiceUri(ServiceUrlType.SYSTEM_API) + "label",
            {
              barcode: data.product.barcode,
              date: new Date(),
              storeCode: AccountService.getUserStoreId(),
            },
            { headers: AccountService.tokenizeHeader() }
          )
          .then((res) => {
            const resData = res.data;

            if (!resData) return;

            AsyncStorage.getItem("@flo_ru_printer_info").then((rawSaveData) => {
              if (rawSaveData != null) {
                const parsedSaveData = JSON.parse(rawSaveData);
                const d = moment();
                var printData = `${resData.price};${d.format(
                  "YYYY"
                )}-${d.format("MM")}-${d.format("DD")};${this.maxLengthCheck(
                  resData.landx,
                  14
                )};${this.maxLengthCheck(resData.matkl, 14)};${
                  resData.size
                };${this.maxLengthCheck(
                  resData.ztaban,
                  14
                )};${this.maxLengthCheck(
                  resData.zicastar,
                  14
                )};${this.maxLengthCheck(resData.fiberCode, 14)};${Number(
                  resData.matnr
                )};${data.product.barcode}`;

                if (parsedSaveData.alias === "LabelDiscount") {
                  printData = `${resData.price};${resData.oldPrice};${d.format(
                    "YYYY"
                  )}-${d.format("MM")}-${d.format("DD")};${this.maxLengthCheck(
                    resData.landx,
                    14
                  )};${this.maxLengthCheck(resData.matkl, 14)};${
                    resData.size
                  };${this.maxLengthCheck(
                    resData.ztaban,
                    14
                  )};${this.maxLengthCheck(
                    resData.zicastar,
                    14
                  )};${this.maxLengthCheck(resData.fiberCode, 14)};${Number(
                    resData.matnr
                  )};${data.product.barcode}`;
                }
/*
                Pathfinder.print(
                  printData,
                  //"STD;22.11.2022;5999;Турция;3999;BX;СИНТЕТИЧЕСКИЙ ТЕКСТИЛЬ;FiberPart2;FiberPart1;100000268;ЛЕГГИНСЫ;8683121136074",
                  parsedSaveData.alias,
                  1
                );

 */
              }
            });
          })
          .catch((err) => console.log(err));

        return;
      }
    } else if (
      printer === undefined ||
      printerConfig === undefined ||
      Object.keys(printer).length == 0 ||
      Object.keys(printerConfig).length == 0
    ) {
      MessageBox.Show(
        translate("printerConfig.pleaseSelectConfig"),
        MessageBoxDetailType.Information,
        MessageBoxType.Standart,
        () => {},
        () => {}
      );
      this.isLoading = false;
      return false;
    } else {
      try {
        // console.log('Content formatting')
        let content = printerConfig.contents;
        console.log("Content formatting", content);

        content = formatLabel(
          printerConfig.contents,
          printerConfig.alias,
          data
        );

        console.log("format ok ");

        this.isLoading = true;
        console.log("print ");

        await this.print(
          Platform.OS === "ios" ? printer.id : this.selectedPrinter.address,
          content
        );
        console.log("print ok");
      } catch (err: any) {
        if (
          err.toString().indexOf("Broken pipe") > 0 &&
          Platform.OS === "android"
        ) {
          let res = await FloZebraPrinter.retryConnection(
            this.selectedPrinter.address
          );
          if (res) await this.printProductTag(data);
        }
        this.isLoading = false;
        this.showLoadingPopup = false;
      } finally {
        this.isLoading = false;

        return true;
      }
    }
  };

  @action printKzkQrCode = () => {
    try {
      var tagValue = ProductService.product?.tagValue;
      if (tagValue) {
        var f2Tag = tagValue.find((x: any) => x.tag === "KBETR3");
        if (f2Tag) {
          // f2'nin eski değeri tutuluyor
          var oldF2Tag = tagValue.find((x: any) => x.tag === "OLD_KBETR3");
          if (oldF2Tag) {
            f2Tag.value = oldF2Tag.value;
          } else {
            tagValue.push({
              tag: "OLD_KBETR3",
              key: "<oldf2>",
              title: "Old Advance Price",
              value: f2Tag.value,
            });
          }

          var f2Value = parseInt(f2Tag.value.replace(",", ".").split(".")[0]);
          var findF5Value = "";
          if (f2Value > 999) {
            // F2'nin değeri değiştirildi
            tagValue[tagValue.findIndex((x: any) => x.tag == "KBETR3")].value =
              f2Value.toString().substring(0, f2Value.toString().length - 3);
          }

          // F5 son 3 hane eklendi
          findF5Value = f2Value
            .toString()
            .substring(
              f2Value.toString().length - 3,
              f2Value.toString().length
            );
          if (tagValue.find((x: any) => x.tag === "KBETR5")) {
            tagValue[tagValue.findIndex((x: any) => x.tag === "KBETR5")].value =
              findF5Value;
          } else {
            tagValue.push({
              tag: "KBETR5",
              key: "<f5>",
              title: "Fractional number",
              value: findF5Value,
            });
          }
        }

        // Sap'den gelen QrCode decode ediliyor.
        var decodeKzQrCode = "";
        var qrCode = ProductService.kzQrCode?.qrCode;
        if (qrCode) {
          decodeKzQrCode = base64.decode(qrCode);
        }

        if (tagValue.find((x: any) => x.tag === "QRCODE")) {
          tagValue[tagValue.findIndex((x: any) => x.tag === "QRCODE")].value =
            decodeKzQrCode;
        } else {
          tagValue.push({
            tag: "QRCODE",
            key: "<qr>",
            title: "QR Code",
            value: decodeKzQrCode,
          });
        }

        if (tagValue.find((x: any) => x.tag === "GUID")) {
          tagValue[tagValue.findIndex((x: any) => x.tag === "GUID")].value =
            "QR ID : " + ProductService.kzQrCodeId?.toString() ?? "";
        } else {
          tagValue.push({
            tag: "GUID",
            key: "<guid>",
            title: "Guid",
            value: "QR ID : " + ProductService.kzQrCodeId?.toString() ?? "",
          });
        }

        this.printProductTag({
          product: {
            barcode: ProductService.product?.product.barcode,
          },
          tagValue: tagValue,
        });
      }
    } catch (error) {
      MessageBoxNew.show("Etiket basarken hata oluştu");
    }
  };
  maxLengthCheck(str: string, maxLength: number = 30) {
    if (str && str.length > maxLength) return str.substring(0, maxLength);

    return str;
  }
}

export default new PrinterConfigService();

export interface PrinterConfigProp {
  id: number;
  alias: string;
  title: string;
  contents: string;
  image: string;
  siteId: number;
  config: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface PrinterConfigGroup {
  createDate: Date;
  icon: string;
  id: number;
  name: string;
  ptcConfigs: PrinterConfigProp[];
}

import { FloZebraPrinter } from "@flomagazacilik/flo-zebra-bt";
import moment from "moment";
import { Platform } from "react-native";
import { ServiceResponseBase } from "../core/models/ServiceResponseBase";
import { translate } from "../helper/localization/locaizationMain";
import {
    formatKzkChars,
    formatLabel,
    formatLabelRussia,
} from "../helper/localization/PrintLabelFormatter";
import { PrinterConfigGroupModel } from "./model/PrinterConfigGroupModel";
//TODO: EXPO pathfinder
// import * as Pathfinder from "@flomagazacilik/flo-pathfinder";
import AsyncStorage from "@react-native-async-storage/async-storage";
//@ts-ignore
import { Base64 } from "js-base64";
import linq from "linq";
import { MessageBoxType } from "./model/MessageBoxOptions";
import { create } from "zustand";
import { useMessageBoxService } from "./MessageBoxService";
import { useApplicationGlobalService } from "./ApplicationGlobalService";
import { SystemApi, useAccountService } from "./AccountService";
import { useProductService } from "./ProductService";
import { useBluetoothModuleService } from "./BluetoothModuleService";

export enum PrinterType {
    PATHFINDER,
    MERTECH,
    ZEBRA
}
interface PrinterConfigServiceModel {
    isLoading: boolean;
    printerConfigList: PrinterConfigGroupModel[];
    selectedPrinter: any | undefined;
    printerConfig: any | undefined;
    showLoadingPopup: boolean;
    iosConnection: boolean;
    printerType: number;
    setPrinterType: (value: number) => void;
    setPrinter: (printer: any) => void;
    setConfig: (config: any) => void;
    loadAllPrinterConfigs: () => Promise<void>;
    restorePrinterConfig: () => Promise<void>;
    setPrintConfig: (printer: any, printerConfig: any) => Promise<void>;
    print: (printerId: any, data: any, printerUUID?: string) => Promise<void>;
    printProductTag: (data: any) => Promise<void>;
    printProductTagRussia: (data: any) => Promise<void>;
    printKzkQrCode: (kzQrCodeId: number) => Promise<void>;
    printRussiankQrCode: (russiQrCodeId: number,item:any) => Promise<void>;
    quantiyOfTextPrint: (quantity: number) => Promise<void>;
    printQrUnit: (list: string[]) => Promise<void>;
    maxLengthCheck: (str: string, maxLength: number) => string;
    setPtcPrint: (
        data: any,
        araFiyat: any,
        deri: any,
        numberRange: any,
        ilkPesinFiyat: any,
        pesinFiyat: any
    ) => Promise<void>;
}

export const usePrinterConfigService = create<PrinterConfigServiceModel>((set, get) => ({
    isLoading: false,
    printerConfigList: [],
    selectedPrinter: undefined,
    printerConfig: undefined,
    showLoadingPopup: false,
    iosConnection: false,
    printerType: -1,
    setPrinterType: (value: number) => {
        set((state) => ({
            ...state,
            printerType: value,
        }));
    },
    setPrinter: (printer: any) => {
        set((state) => ({
            ...state,
            selectedPrinter: printer,
        }));
    },
    setConfig: async (config: any) => {
        set((state) => ({
            ...state,
            printerConfig: config,
        }));
    },
    loadAllPrinterConfigs: async () => {
        try {
            // console.log(23132131232132132)
            let uri = "PtcConfigCategory/GetCategoryWithPtcConfig";
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            var res = await SystemApi.get<
                ServiceResponseBase<PrinterConfigGroupModel[]>
            >(uri);
            if (res.data) {
                var newData = res.data.model.filter((x) => x.ptcConfigs.length > 0);
                set((state) => ({
                    ...state,
                    printerConfigList: newData,
                }));
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    restorePrinterConfig: async () => {
        let result = await AsyncStorage.getItem("@floDigital_PrinterConfig");
        if (result) {
            let parsedResult = JSON.parse(result);
            set((state) => ({
                ...state,
                selectedPrinter: parsedResult.printer,
                printerConfigList: parsedResult.config,
            }));
        }
    },
    setPrintConfig: async (printer: any, printerConfig: any) => {
        const MessageBoxService = useMessageBoxService.getState();
        const { selectedPrinter, setPrintConfig, print,printerType } = get();
        console.log("2",printer,printerConfig)
        try {
            if (
                printer === undefined ||
                printerConfig === undefined ||
                Object.keys(printer).length == 0 ||
                Object.keys(printerConfig).length == 0
            ) {
                MessageBoxService.show(translate("printerConfig.pleaseSelectConfig"));
            } else {
                set((state) => ({
                    ...state,
                    isLoading: true,
                    selectedPrinter: printer,
                    printerConfig: printerConfig,
                }));

                await AsyncStorage.setItem(
                    "@floDigital_PrinterConfig",
                    JSON.stringify({
                        printer: selectedPrinter,
                        config: printerConfig,
                    })
                );
                if(printerType !== PrinterType.MERTECH) {
                    if (Platform.OS === "ios") {
                        await print(printer.id, printerConfig.config, printer.deviceUUID);
                    } else {
                        await print(selectedPrinter.address, printerConfig.config);
                    }
                }


                MessageBoxService.show(translate("errorMsgs.completeLabelConfig"));
            }
        } catch (err: any) {
            if (
                err.toString().indexOf("Broken pipe") > 0 &&
                Platform.OS === "android"
            ) {
                let res = await FloZebraPrinter.retryConnection(
                    selectedPrinter.address
                );
                if (res) setPrintConfig(printer, printerConfig);
            }
            set((state) => ({
                ...state,
                isLoading: false,
                showLoadingPopup: false,
            }));
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    print: async (printerId: any, data: any, printerUUID: string = "") => {
        set((state) => ({
            ...state,
            showLoadingPopup: true,
        }));
        const { iosConnection } = get();
        if (Platform.OS === "android") {
            await FloZebraPrinter.print(printerId, data);
        } else if (Platform.OS === "ios") {
            try {
                if (!iosConnection) {
                    let connState = await FloZebraPrinter.isEnabledBluetooth();
                    while (connState === "false") {
                        connState = await FloZebraPrinter.isEnabledBluetooth();
                    }
                    let res = await FloZebraPrinter.connectDevice(printerId);
                    set((state) => ({
                        ...state,
                        iosConnection: true,
                    }));
                    await new Promise((x) => setTimeout((y) => x(true), 500));
                }

                await AsyncStorage.setItem("@key_BtDevice", printerUUID);

                var newData = formatKzkChars(data);
                FloZebraPrinter.print(newData);

                set((state) => ({
                    ...state,
                    showLoadingPopup: false,
                }));
            } catch (err: any) { }
        }
        set((state) => ({
            ...state,
            showLoadingPopup: false,
        }));
    },
    maxLengthCheck: (str: string, maxLength: number = 30) => {
        if (str && str.length > maxLength) return str.substring(0, maxLength);
        return str;
    },
    setPtcPrint: async (
        data: any,
        araFiyat: any,
        deri: any,
        numberRange: any,
        ilkPesinFiyat: any,
        pesinFiyat: any
    ) => {
        const { printerConfig, printerConfigList, print, selectedPrinter,printerType } = get();
        let content = printerConfig.contents;
        let alias = printerConfig.alias;
        console.log(222,content);
        console.log(3333,alias)

        if (
            parseFloat(araFiyat) < parseFloat(ilkPesinFiyat) &&
            parseFloat(araFiyat) > parseFloat(pesinFiyat)
        ) {
            var findTwiceData = linq
                .from(printerConfigList)
                .select((x) =>
                    x.ptcConfigs.find(
                        (y) =>
                            y.id !== printerConfig.id &&
                            y.twiceGroup === printerConfig.twiceGroup
                    )
                )
                .firstOrDefault();
            if (findTwiceData) {
                content = findTwiceData.contents;
                alias = findTwiceData.alias;
            }
        }

        content = formatLabel(content, alias, data);
        console.log(444,content)

        content = content.replaceAll("<ARA_FIYAT1>", araFiyat.split(".")[0]);
        content = content.replaceAll(
            "<ARA_FIYAT2>",
            araFiyat.split(".")[1] ?? "00"
        );
        content = content.replaceAll("<Deri>", deri);
        content = content.replaceAll("<numberrange>", numberRange);
        if(printerType === PrinterType.MERTECH){
            const languageEdited = formatKzkChars(content);
            useBluetoothModuleService.getState().write(languageEdited,0)
        } else {
            await print(
                Platform.OS === "ios" ? selectedPrinter.id : selectedPrinter.address,
                content
            );
        }

    },
    printProductTag: async (data: any) => {
        //  const {bluModule} = get();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const { selectedPrinter, printerConfig, printProductTag, print, maxLengthCheck, setPtcPrint,printerType } = get();

        const store = ApplicationGlobalService.allStore.find(
            (x) => x.werks === AccountService.getUserStoreId()
        );
        if (
            (AccountService?.employeeInfo?.ExpenseLocationCode?.substring(3) === "8801" ||
                store?.country === "RU") &&
            Platform.OS === "ios" && printerType === PrinterType.PATHFINDER
        ) {
            var rawSaveData = await AsyncStorage.getItem("@flo_ru_printer_info");
            if (rawSaveData !== null) {
                const parsedSaveData = JSON.parse(rawSaveData);
                SystemApi.post("label", {
                    barcode: data.product.barcode,
                    date: new Date(),
                    storeCode: AccountService.getUserStoreId(),
                })
                    .then((res) => {
                        const resData = res.data;
                        console.log(111,resData)
                        if (resData) {
                            AsyncStorage.getItem("@flo_ru_printer_info").then(
                                async (rawSaveData: any) => {
                                    if (rawSaveData != null) {
                                        const parsedSaveData = JSON.parse(rawSaveData);
                                        const d = moment();
                                        var printData = `${resData.price};${d.format(
                                            "YYYY"
                                        )}-${d.format("MM")}-${d.format("DD")};${maxLengthCheck(
                                            resData.landx,
                                            14
                                        )};${maxLengthCheck(resData.matkl, 14)};${resData.size
                                            };${maxLengthCheck(resData.ztaban, 14)};${maxLengthCheck(
                                                resData.zicastar,
                                                14
                                            )};${maxLengthCheck(resData.fiberCode, 14)};${Number(
                                                resData.matnr
                                            )};${data.product.barcode}`;

                                        if (parsedSaveData.alias === "LabelDiscount") {
                                            printData = `${resData.price};${resData.oldPrice
                                                };${d.format("YYYY")}-${d.format("MM")}-${d.format(
                                                    "DD"
                                                )};${maxLengthCheck(resData.landx, 14)};${maxLengthCheck(
                                                    resData.matkl,
                                                    14
                                                )};${resData.size};${maxLengthCheck(
                                                    resData.ztaban,
                                                    14
                                                )};${maxLengthCheck(
                                                    resData.zicastar,
                                                    14
                                                )};${maxLengthCheck(resData.fiberCode, 14)};${Number(
                                                    resData.matnr
                                                )};${data.product.barcode}`;
                                        }

                                      /* TODO: EXPO pathfinder
                                        await Pathfinder.reconnectDevice();

                                        await Pathfinder.print(
                                            printData,
                                            //"STD;22.11.2022;5999;Турция;3999;BX;СИНТЕТИЧЕСКИЙ ТЕКСТИЛЬ;FiberPart2;FiberPart1;100000268;ЛЕГГИНСЫ;8683121136074",
                                            parsedSaveData.alias,
                                            1
                                        );

                                       */
                                    }
                                }
                            );
                        }
                    })
                    .catch((err) => console.log(err));
            }
        } else if (
            selectedPrinter === undefined ||
            printerConfig === undefined ||
            Object.keys(selectedPrinter).length == 0 ||
            Object.keys(printerConfig).length == 0
        ) {
            console.log("deneme1")
            MessageBoxService.show(translate("printerConfig.pleaseSelectConfig"));
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        } else {
            try {
                // PTC Etiket İşlemleri
                if (printerConfig.twiceGroup) {
                    set((state) => ({
                        ...state,
                        isLoading: true,
                    }));
                    var label = await SystemApi.post("label", {
                        barcode: data.product.barcode,
                        date: new Date(),
                        storeCode: AccountService.getUserStoreId(),
                    });
                    console.log(111,label.data)

                    var araFiyat = label.data.intermediatePrice.replace(",", ".");
                    var ilkPesinFiyat = label.data.oldPrice.replace(",", ".");
                    var pesinFiyat = label.data.price.replace(",", ".");
                    var deri = label.data.leather;
                    var numberRange = label.data.numberRange;

                    if (
                        parseFloat(pesinFiyat) >= parseFloat(ilkPesinFiyat) &&
                        !printerConfig.title.toLowerCase().includes("sezon")
                    ) {
                        MessageBoxService.show(
                            "Ürün indirime girmedi/Ürün ilk satış fiyatına geri döndü. Sezon etiketi basmalısınız. Yine de etiket basmak istiyor musunuz?",
                            {
                                type: MessageBoxType.YesNo,
                                yesButtonEvent: async () => {
                                    await setPtcPrint(
                                        data,
                                        araFiyat,
                                        deri,
                                        numberRange,
                                        ilkPesinFiyat,
                                        pesinFiyat
                                    );
                                    return;
                                },
                                noButtonEvent: () => {
                                    return;
                                },
                            }
                        );
                    } else {
                       const res = await setPtcPrint(
                            data,
                            araFiyat,
                            deri,
                            numberRange,
                            ilkPesinFiyat,
                            pesinFiyat
                        );
                        return res
                    }
                } else {
                    // console.l  og('Content formatting')
                    let content = printerConfig.contents;
                    console.log("Content formatting", content);

                    content = formatLabel(
                        printerConfig.contents,
                        printerConfig.alias,
                        data
                    );

                    console.log("format ok ");
                    set((state) => ({
                        ...state,
                        isLoading: true,
                    }));
                    console.log("print ",content);

                    if(printerType === PrinterType.MERTECH){
                        const languageEdited = formatKzkChars(content);
                        useBluetoothModuleService.getState().write(languageEdited,0)
                    } else {
                        await print(
                            Platform.OS === "ios"
                                ? selectedPrinter.id
                                : selectedPrinter.address,
                            content
                        );
                    }
                    console.log("print ok");
                }
            } catch (err: any) {
               if(printerType !== PrinterType.MERTECH){
                 if (
                    err.toString().indexOf("Broken pipe") > 0 &&
                    Platform.OS === "android"
                ) {
                    let res = await FloZebraPrinter.retryConnection(
                        selectedPrinter.address
                    );
                    if (res) await printProductTag(data);
                }
               }
                set((state) => ({
                    ...state,
                    isLoading: false,
                    showLoadingPopup: false,
                }));
            } finally {
                set((state) => ({
                    ...state,
                    showLoadingPopup: false,
                }));
            }
        }
    },
    printProductTagRussia: async (data: any) => {
        //  const {bluModule} = get();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const { selectedPrinter, printerConfig, printProductTag, print, maxLengthCheck, setPtcPrint,printerType } = get();
        console.log(88787,data)
        const store = ApplicationGlobalService.allStore.find(
            (x) => x.werks === AccountService.getUserStoreId()
        );
            try {
                    let content = printerConfig.contents;
                    console.log("Content formatting", content);

                    content = formatLabelRussia(
                        printerConfig.contents,
                        printerConfig.alias,
                        data
                    );

                    console.log("format ok ");
                    set((state) => ({
                        ...state,
                        isLoading: true,
                    }));
                    console.log("print ",content);

                    if(printerType === PrinterType.MERTECH){
                        const languageEdited = formatKzkChars(content);
                        useBluetoothModuleService.getState().write(languageEdited,0)
                    } else {
                        await print(
                            Platform.OS === "ios"
                                ? selectedPrinter.id
                                : selectedPrinter.address,
                            content
                        );
                    }
                    console.log("print ok");
            } catch (err: any) {
                set((state) => ({
                    ...state,
                    isLoading: false,
                    showLoadingPopup: false,
                }));
            } finally {
                set((state) => ({
                    ...state,
                    showLoadingPopup: false,
                }));
            }
    },
    printKzkQrCode: async (kzQrCodeId: number) => {
        const ProductService = useProductService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const { printProductTag } = get();
        try {
            var tagValue = ProductService.product!.tagValue;
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
                var qrCode = ProductService.kzQrCode!.qrCode;
                if (qrCode) {
                    decodeKzQrCode = Base64.decode(qrCode);
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
                        "QR ID : " + kzQrCodeId.toString() ?? "";
                } else {
                    tagValue.push({
                        tag: "GUID",
                        key: "<guid>",
                        title: "Guid",
                        value: "QR ID : " + kzQrCodeId.toString() ?? "",
                    });
                }

                printProductTag({
                    product: {
                        barcode: ProductService.product!.product.barcode,
                    },
                    tagValue: tagValue,
                });
            }
        } catch (error) {
            MessageBoxService.show("Etiket basarken hata oluştu");
        }
    },
    quantiyOfTextPrint: async (quantity: number) => {
        const { print, selectedPrinter, printerConfig } = get();
        for (let i = 0; i < quantity; i++) {
            await print(
                Platform.OS === "ios"
                    ? selectedPrinter.id
                    : selectedPrinter.address,
                printerConfig.contents
            );
        }

    },
    printQrUnit: async (list: string[]) => {
        const { selectedPrinter, printerConfig, print } = get();
        const MessageBoxService = useMessageBoxService.getState();

        if (
            selectedPrinter === undefined ||
            printerConfig === undefined ||
            Object.keys(selectedPrinter).length == 0 ||
            Object.keys(printerConfig).length == 0
        ) {
            MessageBoxService.show(translate("printerConfig.pleaseSelectConfig"));
        } else {
            let content = printerConfig.contents;
            list.forEach(async item => {
                const data = content.replaceAll("<name>", item);
                var newData = formatKzkChars(data);
                await print(
                    Platform.OS === "ios"
                        ? selectedPrinter.id
                        : selectedPrinter.address,
                    newData
                );
            })
        }
    },
    printRussiankQrCode: async (russiaQrCodeId: number,item:any) => {
        const ProductService = useProductService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const {  printProductTagRussia } = get();
        try {
            var tagValue = item.tagValueList;
            console.log("item:" ,item);
            console.log("tagvalue",tagValue)
            if (tagValue) {
                let qrCode = "";
                if( item.tagValueList.qrCode)
                qrCode = item.tagValueList.qrCode

                if (tagValue.find((x: any) => x.tag === "QRCODE")) {
                    tagValue[tagValue.findIndex((x: any) => x.tag === "QRCODE")].value =
                    qrCode;
                } else {
                    tagValue.push({
                        tag: "QRCODE",
                        key: "<qrcode>",
                        title: "QR Code",
                        value: qrCode,
                    });
                }

                if (tagValue.find((x: any) => x.tag === "QrCodeId")) {
                    tagValue[tagValue.findIndex((x: any) => x.tag === "QrCodeId")].value =
                        "QR ID : " + russiaQrCodeId.toString() ?? "";
                } else {
                    tagValue.push({
                        tag: "QrCodeId",
                        key: "<qrcodeid>",
                        title: "Qr Code Id",
                        value: "QR ID : " + russiaQrCodeId.toString() ?? "",
                    });
                }
                if (tagValue.find((x: any) => x.tag === "SerialNo")) {
                    tagValue[tagValue.findIndex((x: any) => x.tag === "SerialNo")].value =
                    item.serialNo ?? "";
                } else {
                    tagValue.push({
                        tag: "SerialNo",
                        key: "<qrserialno>",
                        title: "Serial No",
                        value: item.serialNo ?? "",
                    });
                }
                if (tagValue.find((x: any) => x.tag === "GTIN")) {
                    tagValue[tagValue.findIndex((x: any) => x.tag === "GTIN")].value = item.gtin ?? "";
                } else {
                    tagValue.push({
                        tag: "GTIN",
                        key: "<qrgtin>",
                        title: "GTIN",
                        value: item.gtin ?? "",
                    });
                }
                if (tagValue.find((x: any) => x.tag === "Generic")) {
                    tagValue[tagValue.findIndex((x: any) => x.tag === "Generic")].value =
                    item.generic  ?? "";
                } else {
                    tagValue.push({
                        tag: "Generic",
                        key: "<qrgeneric>",
                        title: "Generic",
                        value: item.generic ?? "",
                    });
                }

                if (tagValue.find((x: any) => x.tag === "Size")) {
                    tagValue[tagValue.findIndex((x: any) => x.tag === "Size")].value =
                    item.size  ?? "";
                } else {
                    tagValue.push({
                        tag: "Size",
                        key: "<qrsize>",
                        title: "Size",
                        value: item.size ?? "",
                    });
                }
                console.log(32132131,tagValue)
                printProductTagRussia({
                    product: {
                        barcode: item.gtin,
                    },
                    tagValue: tagValue,
                });
            }
        } catch (error) {
            MessageBoxService.show("Etiket basarken hata oluştu");
        }
    },

}));

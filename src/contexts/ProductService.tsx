import linq from "linq";
import { createContext, useContext, useEffect, useState } from "react";
import { toOrganization } from "../core/Util";
import { translate } from "../helper/localization/locaizationMain";
import { KzQrCodeModel } from "./model/KzQrCodeModel";
import { MessageBoxType } from "./model/MessageBoxOptions";
import { ProductProp } from "./model/ProductModel";
import { SystemApi, useAccountService } from "./AccountService";
import { useMessageBoxService } from "./MessageBoxService";
//@ts-ignore
import { Base64 } from "js-base64";
import { useApplicationGlobalService } from "./ApplicationGlobalService";
import { create } from "zustand";
import * as RootNavigation from "../core/RootNavigation"
import { QrCodeResponse, QrResponseList } from "./model/RussiaQrResponseList";
import { ServiceResponseBase } from "core/models/ServiceResponseBase";


interface ProductServiceModel {
    isLoading: boolean;
    product: ProductProp | undefined | null;
    animationType: number | undefined | null;
    kzQrCode: KzQrCodeModel | undefined | null;
    kzQrCodeId: number;
    isOmsSearchProduct: boolean;
    russiaQrlist: QrResponseList | undefined;
    isResidualProduct: boolean;
    setIsResidualProduct: (isResidualProduct:boolean) => void;
    getProduct: (
        barcode: string,
        animationType?: number,
        isGeneric?: boolean,
        isOmsSearchProduct?: boolean
    ) => Promise<boolean>;
    getQrCode: (
        isResidualProduct: boolean,
        isMaterialCode: boolean,
        materialOrEanCode: string
    ) => Promise<boolean>;
    approveQrCode: () => Promise<number>;
    findQrCode: (id: number) => Promise<boolean>;
    findKzQrCodeWithQrCode: (qrCode: string) => Promise<boolean>;
    findRussiaQrCode: (id: number) => Promise<boolean>;
    getRussiaQrCode: (
        isResidualProduct: boolean,
           barcodes: string[],
        generics: string[]
    ) => Promise<boolean>;
    approveRussiaQrCode: (indexes: number[]) => Promise<QrCodeResponse[] | number>;
}

export const useProductService = create<ProductServiceModel>((set, get) => ({
    isLoading: false,
    animationType: undefined,
    product: undefined,
    kzQrCode: undefined,
    kzQrCodeId: 0,
    isOmsSearchProduct: false,
    russiaQrlist: undefined,
    isResidualProduct:false,
    setIsResidualProduct: (isResidualProduct:boolean) => {
        set((state) => ({
            ...state,
            isResidualProduct: isResidualProduct,
        }));
    },
    getProduct: async (
        barcode: string,
        animationType: number = 1,
        isGeneric: boolean = false,
        isOmsSearchProduct = false
    ) => {
        const AccountService = useAccountService.getState();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        if (barcode === undefined || barcode === null) {
            MessageBoxService.show(translate("errorMsgs.enterBarcode"));
            return false;
        }
        set((state) => ({
            ...state,
            isLoading: true,
            animationType: animationType,
            isOmsSearchProduct: isOmsSearchProduct
        }));

        try {
            const storeId = AccountService.getUserStoreId();
            var store = ApplicationGlobalService.allStore.find((x) => x.werks === storeId);

            let model = {
                barcode: barcode,
                vkorg: toOrganization(AccountService.employeeInfo.ExpenseLocationCode, store),
                storeId: storeId,
                isGeneric: false,
                genericCode: "",
            };

            if (isGeneric) {
                model.barcode = "";
                model.genericCode = barcode;
                model.isGeneric = true;
            }

            var res = await SystemApi.post("Stock", model);
            if (
                res.status &&
                res.data &&
                (res.data.status.code === 200 || res.data.status.code === 300)
            ) {
                const productData = res.data.data as ProductProp;
                if (productData && productData.stores.length > 0) {
                    // E-Ticaret başta ve diğerleri Distance Göre sıralı
                    var notEticaretData = linq
                        .from(productData.stores)
                        .where((x) => x.storeName !== "E-TİCARET")
                        .orderBy((x) => x.distance)
                        .toArray();
                    var eticaretData = linq
                        .from(productData.stores)
                        .where((x) => x.storeName === "E-TİCARET")
                        .toArray();
                    eticaretData[0].storeName = translate(
                        "crmCrmCreateCustomerComplaint.eCommerce"
                    );
                    //@ts-ignore
                    productData.stores = [...eticaretData, ...notEticaretData];
                }
                set((state) => ({
                    ...state,
                    product: productData,
                }));

                return true;
                // Mevcut sahne ürün ekranı değil ise ürün ekranına yönlendir.
            } else if (res.data.status.code === 450) {
                MessageBoxService.show(translate("errorMsgs.ecomServiceError"));
            } else if (res.data.status.code === 400) {
                MessageBoxService.show(translate("errorMsgs.sapServiceError"));
            } else {
                if (isOmsSearchProduct)
                    MessageBoxService.show(translate("errorMsgs.omsStockNotFound"));
                else
                    MessageBoxService.show(translate("errorMsgs.productNotFound"));
            }
            return false;
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getQrCode: async (
        isResidualProduct: boolean,
        isMaterialCode: boolean,
        materialOrEanCode: string
    ) => {
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const { product } = get();
        try {
            var model = {
                eanCode: product?.product.barcode,
                storeCode: AccountService.getUserStoreId(),
                isResidualProduct: isResidualProduct,
                employeeId: AccountService.employeeInfo.EfficiencyRecord,
                materialCode: "",
            };

            if (isResidualProduct) {
                if (isMaterialCode) {
                    model.materialCode = materialOrEanCode;
                    model.eanCode = "";
                } else {
                    model.eanCode = materialOrEanCode;
                    model.materialCode = "";
                }
            }
            var res = await SystemApi.post("QrCodeGenerate/KzQrCode", model);

            if (res.data && res.data.state === 1) {
                set((state) => ({
                    ...state,
                    kzQrCode: res.data.model,
                }));

                if (res.data.model.kzQrCodeId) {
                    set((state) => ({
                        ...state,
                        kzQrCodeId: res.data.model.kzQrCodeId,
                    }));
                }

                return true;
            } else {
                //SAP Servisine Ulaşılamıyor
                var message = "SAP қызметі қолжетімсіз";
                if (res.data && res.data.state === 2) {
                    switch (res.data.message) {
                        case "028":
                            //Hatalı Mağaza Kodu
                            message = "Қате көрсетілген дүкен коды";
                            break;
                        case "029":
                            //EAN Kodunu doldurunuz
                            message = "Штрихкодты енгізіңіз";
                            break;
                        case "030":
                            //Sipariş İçin Henüz QR Kod Oluşmamış
                            message = "Тапсырыс үшін әлі QR код тағайындалмады";
                            break;
                        case "031":
                            //QR Kod Bulunamadı
                            message = "QR код табылмады";
                            break;

                        default:
                            break;
                    }
                }

                MessageBoxService.show(message, {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
                return false;
            }
        } catch (err: any) {
            return false;
        }
    },
    approveQrCode: async () => {
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const { kzQrCode, product } = get();
        try {
            var model = {
                guid: kzQrCode?.guid,
                qrCode: kzQrCode?.qrCode,
                storeCode: AccountService.getUserStoreId(),
                eanCode: product?.product.barcode,
                employeeId: AccountService.employeeInfo.EfficiencyRecord,
            };

            var res = await SystemApi.post("QrCodeGenerate/KzQrCodeApprove", model);

            if (res.data && res.data.state === 1) {
                //Qr Onaylandı
                set((state) => ({
                    ...state,
                    kzQrCodeId: res.data.model.kzQrCodeId,
                }));
                return res.data.model.kzQrCodeId;
            } else if (res.data && res.data.state === 2) {
                //Qr Onaylanamadı
                MessageBoxService.show("QR этикетка сақтамады", {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
            } else {
                // SAP servisine ulaşılamadı
                MessageBoxService.show("SAP қызметі қолжетімсіз", {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
            }
            return -1;
        } catch (err: any) {
            return -1;
        }
    },
    findQrCode: async (id: number) => {
        const { product } = get();
        const MessageBoxService = useMessageBoxService.getState();

        try {
            var model = {
                id,
                barcode: product?.product.barcode,
            };

            var res = await SystemApi.post("QrCodeGenerate/FindKzQrCode", model);
            if (res.data && res.data.state === 1) {
                //Qr Onaylandı
                let dataModel: KzQrCodeModel = {
                    qrCode: res.data.model.qrCode,
                    guid: res.data.model.guid,
                    quantity: 0,
                };
                set((state) => ({
                    ...state,
                    kzQrCode: dataModel,
                    kzQrCodeId: id,
                }));
                return true;
            } else {
                // exception hata
                MessageBoxService.show(res.data.message, {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
            }
            return false;
        } catch (err: any) {
            return false;
        }
    },
    findKzQrCodeWithQrCode: async (qrCode: string) => {
        const { product } = get();
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();

        try {
            var model = {
                qrCode: Base64.encode(qrCode),
                barcode: product?.product.barcode,
                storeCode: AccountService.getUserStoreId(),
                employeeId: AccountService.employeeInfo.EfficiencyRecord,
            };

            var res = await SystemApi.post(
                "QrCodeGenerate/FindKzQrCodeIdWithQrCode",
                model
            );

            if (res.data && res.data.state === 1) {
                //Qr Onaylandı
                let dataModel: KzQrCodeModel = {
                    qrCode: res.data.model.qrCode,
                    guid: res.data.model.guid,
                    quantity: 0,
                };
                set((state) => ({
                    ...state,
                    kzQrCode: dataModel,
                    kzQrCodeId: res.data.model.id,
                }));
                return true;
            } else {
                // exception hata
                MessageBoxService.show(res.data.message, {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
            }
            return false;
        } catch (err: any) {
            return false;
        }
    },
    findRussiaQrCode: async (id: number) => {
        const { product } = get();
        const MessageBoxService = useMessageBoxService.getState();

        try {
            var model = {
                id,
            };

            var res = await SystemApi.post("QrCodeGenerate/FindQrCode", model);
            if (res.data && res.data.state === 1) {
                // //Qr Onaylandı
                let dataModel: KzQrCodeModel = {
                    qrCode: res.data.model.qrCode,
                    guid: res.data.model.guid,
                    quantity: 0,
                };
                let qrList: QrResponseList = {
                    qrResponseList: [
                        res.data.model
                    ]
                }
                set((state) => ({
                    ...state,
                    kzQrCode: dataModel,
                    kzQrCodeId: id,
                    russiaQrlist: qrList
                }));
                return true;
            } else {
                // exception hata
                MessageBoxService.show(res.data.message, {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
            }
            return false;
        } catch (err: any) {
            return false;
        }
    },
    getRussiaQrCode: async (
        isResidualProduc1: boolean,
        barcodes: string[],
        generics: string[]
    ) => {
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const { product,isResidualProduct } = get();
        const storeId = AccountService.getUserStoreId()
        try {
            var model = {
                barcodes: barcodes,
                skus: generics,
                storeCode: AccountService.getUserStoreId(),
                isResidualProduct: isResidualProduct,
                employeeId:  AccountService.employeeInfo.EfficiencyRecord,
            };
                set((state) => ({
                    ...state,
                    isLoading: true,
                }));
            var res = await SystemApi.post("QrCodeGenerate/GetQrCode", model);
            if (res.data && res.data.state === 1) {
                let qrList = res.data.model
                //@ts-ignore
                let tmpQrResponseList = res.data.model.qrResponseList.filter(item => item.generic !== null)
                qrList.qrResponseList = tmpQrResponseList
                if(qrList.qrResponseList.length > 0){
                    set((state) => ({
                        ...state,
                        isLoading: false,
                        russiaQrlist: qrList,
                    }));
                    RootNavigation.navigate('Iso', { screen: 'RussiaQrList' })
                } else {
                    set((state) => ({
                        ...state,
                        isLoading: false,
                    }));
                    MessageBoxService.show("Qr bulunamadı.", {
                        type: MessageBoxType.Standart,
                        yesButtonTitle: "Жақсы",
                        yesButtonEvent: () => { },
                    });
                }
                return true;
            } else {
                set((state) => ({
                    ...state,
                    isLoading: false,
                }));
                //SAP Servisine Ulaşılamıyor
                var message = "SAP қызметі қолжетімсіз";
                if (res.data && res.data.state === 2) {
                    switch (res.data.message) {
                        case "028":
                            //Hatalı Mağaza Kodu
                            message = "Қате көрсетілген дүкен коды";
                            break;
                        case "029":
                            //EAN Kodunu doldurunuz
                            message = "Штрихкодты енгізіңіз";
                            break;
                        case "030":
                            //Sipariş İçin Henüz QR Kod Oluşmamış
                            message = "Тапсырыс үшін әлі QR код тағайындалмады";
                            break;
                        case "031":
                            //QR Kod Bulunamadı
                            message = "QR код табылмады";
                            break;

                        default:
                            break;
                    }
                }

                MessageBoxService.show(message, {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
                return false;
            }
        } catch (err: any) {
            return false;
        }
    },
    approveRussiaQrCode: async (indexes: number[]) => {
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const { russiaQrlist } = get();
        try {
            // var model = {
            //     guid: russiaQrlist?.qrResponseList[index].guid ,
            //     qrCode: russiaQrlist?.qrResponseList[index].qrCode,
            //     storeCode: "8801",
            //     eanCode:russiaQrlist?.qrResponseList[index].gtin,
            //     employeeId:"0007890",
            // };

            var model: any = {
                storeCode: AccountService.getUserStoreId(),
                employeeId: AccountService.employeeInfo.EfficiencyRecord,
                QrCodeProductList: []
            };
            if(russiaQrlist?.qrResponseList) {
                let selectedData = indexes.map(index => russiaQrlist?.qrResponseList[index]).filter(item => item !== undefined);
                selectedData.map(x => {
                    model.QrCodeProductList.push({
                        guid: x.guid ,
                        qrCode:  Base64.encode(x.qrCode),
                        eanCode: x.gtin,
                    })
                })
            }            
            var res = await SystemApi.post<ServiceResponseBase<QrCodeResponse[]>>("QrCodeGenerate/QrCodeApprove", model);
            if (res.data && res.data.state === 1) {
                //Qr Onaylandı
                return res.data.model

            } else if (res.data && res.data.state === 2) {
                //Qr Onaylanamadı
                MessageBoxService.show("QR этикетка сақтамады", {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
            } else {                
                // SAP servisine ulaşılamadı
                MessageBoxService.show("SAP қызметі қолжетімсіз", {
                    type: MessageBoxType.Standart,
                    yesButtonTitle: "Жақсы",
                    yesButtonEvent: () => { },
                });
                
            }
            return -1;
        } catch (err: any) {
            return -1;
        }
    },
}));

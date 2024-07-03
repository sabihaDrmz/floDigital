import { OmsErrorReasonModel } from "../core/models/OmsErrorReasonModel";
import { OmsOrderDetail, OmsOrderModel } from "../core/models/OmsOrderModel";
import { OmsOrderResponse } from "../core/models/OmsOrderResponse";
import { OmsPackageModel, PackageOrder } from "../core/models/OmsPackageModel";
import { OmsResponseBase } from "../core/models/OmsResponseBase";
import { OmsStatePageData } from "../core/models/OmsStatePageData";
import React, { useEffect } from "react";
import { OmsChiefReportModel } from "../core/models/OmsChiefReportModel";
import { translate } from "../helper/localization/locaizationMain";
import { tr } from "../helper/localization/lang/_tr";
import { useContext, createContext, useState } from "react";
import linq from "linq";
import { Platform } from "react-native";
import moment from "moment";
import { MessageBoxType } from "./model/MessageBoxOptions";
import { CloseIco } from "../../src/components/Oms/partials/CloseIco";
import {
    NotFoundProductModel,
    OrderHistoryModel,
    OrderItemDetail,
} from "./model/OmsModels";
import { useStateCallback } from "../hooks/StateCallback";
import { OmsKzkQrTempModel } from "../contexts/model/OmsKzkQrTempModel";
import { create } from "zustand";
import { useAccountService, OmsApi, OmsPdfApi } from "./AccountService";
import { useMessageBoxService } from "./MessageBoxService";
import { useApplicationGlobalService } from "./ApplicationGlobalService";
import { usePrinterConfigService } from "./PrinterConfigService";
import * as RootNavigation from "../core/RootNavigation"

interface OmsServiceModel {
    omsConsensusStartDate: Date;
    omsConsensusEndDate?: Date;
    statePageData?: OmsStatePageData;
    omsOrders?: OmsOrderModel[];
    loadingContent: boolean;
    assignLoading: { isLoading: boolean; orderId: number };
    omsPickList: OmsOrderDetail[];
    omsPickListGroup: OmsOrderDetail[];
    omsPickListOrder: OmsOrderModel[];
    errorReasons: OmsErrorReasonModel[];
    assignTemp: any[];
    chiefReport: OmsChiefReportModel[];
    cancelLoading: boolean;
    packageList: OmsPackageModel[];
    continiousOrder: string | undefined;
    pickingTemp: OmsOrderDetail[];
    loadingGroupCollect: boolean;
    assignableEmployee: any[];
    packageContiniousOrder: string | undefined;
    packagingTemp: PackageOrder[];
    kzkQrTemp: OmsKzkQrTempModel[];
    hasWaybillComplete: boolean;
    tempZpl: string[];
    tempPdf: string[];
    onLoadingPrintLabel: boolean;
    isPackageLoading: boolean;
    completePickBag: boolean;
    waybillLoading: boolean;
    completePackageLoading: boolean;
    cargoConsensusRes: any[];
    isConsensusCargoLoading: boolean;
    selectedCensusList: any[];
    printContractLoadingState: boolean;
    notfoundItems: NotFoundProductModel[];
    startNotFoundDate?: Date;
    endNotFoundDate?: Date;
    orderHistory?: OrderHistoryModel;
    toPoolLoading: boolean;
    selectedCensusListTemp: any[];
    loadStatePage: () => Promise<void>;
    loadAllOrders: () => Promise<void>;
    loadMyPickList: () => Promise<void>;
    loadAllPackageList: () => Promise<void>;
    CleanPicklist: () => void;
    CleanPackageList: () => void;
    loadOrderHistory: (
        query: string,
        pageNumber?: number
    ) => Promise<OrderHistoryModel | undefined>;
    loadAssignableEmployee: () => Promise<void>;
    addAssignQueue: (
        assignType: "all" | "order" | "timeLeft",
        type: "check" | "uncheck",
        orderNumber: number
    ) => Promise<void>;
    userOrdersToPool: (actionById: number) => Promise<void>;
    collectGroupProduct: (
        productGroup: OmsOrderDetail,
        quantity: number,
        reason?: OmsErrorReasonModel,
        continueLater?: boolean
    ) => Promise<void>;
    cancelOrder: (
        orderDetail: OmsOrderDetail,
        reason: string,
        skipRefresh?: boolean
    ) => Promise<boolean>;
    loadErrorReasons: () => Promise<void>;
    collectProduct: (
        order: { type: string; orderNo: string },
        productId: string,
        quantity?: number,
        isPathPickList?: boolean
    ) => Promise<void>;
    pickItem: (orderId: string, productId: string, isPathPackageList?: boolean) => Promise<void>;
    getCargoConsensus: (
        cargoCompany: string,
        isWaitingCargo: boolean
    ) => Promise<void>;
    GetOrderProductList: (orderNo: string) => Promise<void>;
    printZpl: (orderId: string) => Promise<void>;
    printContract: (
        model: { OrderNo: string; AccetptenceNo: string }[]
    ) => Promise<boolean>;
    loadNotFoundItems: () => Promise<void>;
    getOrderItemByOrderNo: (orderNo: string) => Promise<OrderItemDetail | any[]>;
    getChiefReport: () => Promise<void>;
    assignOrderToMe: (orderId: number) => Promise<void>;
    makeGroupPicking: (model: OmsOrderDetail[]) => Promise<OmsOrderDetail[]>;
    groupingBC: (model: OmsOrderDetail[], d: any, oi: number) => OmsOrderDetail[];
    GetWaybillStatus: (startDate: Date, endDate: Date) => Promise<any>;
    printWaybillTry: (orderId: string) => Promise<void>;
    waybillComplete: (sendOrderModel: any) => Promise<any>;
    completeAssignQueue: (UserID: number) => Promise<any>;
    setOmsConsensusStartDateData: (date: Date) => void;
    setStartNotFoundDateData: (date: Date) => void;
    setEndNotFoundDateData: (date: Date) => void;
    completeCancelMethod: (
        model: any,
        orderDetail: any,
        skipRefresh: any
    ) => Promise<Boolean>;
    completeCollect: (data: any) => Promise<Boolean>;
    printLabel: () => Promise<boolean>;
    pickBagBarcodeStart: () => Promise<void>;
    pickBagBarcodeStep2: (
        barcode: string,
        packageCount: number
    ) => Promise<Boolean>;
    saveSize: (
        order: OmsPackageModel,
        barcode: string,
        desi: any,
        sapDesi: any,
        isPackage: boolean,
        packageCount: number
    ) => Promise<void>;
    waybillPrint: () => Promise<void>;
    printOrderLabel: () => Promise<void>;
    completePackage: () => Promise<boolean>;
    getZplData: (orderNo: string) => Promise<string[]>;
    downloadPdf: (b64: string) => void;
    CheckPrinterConfiguration: (errorMsg: string) => boolean;
    Print: (zpl: string, orderId?: string) => void;
    mergeMessages: (obj: any) => string;
    setSelectedCensusListData: (
        assignType: "all" | "order" | "remove",
        orderNumber: number
    ) => void;
    setSelectedCensusListTempData: (data: string) => void;
    pickKzkQr: (data: OmsKzkQrTempModel) => void;
}
export const useOmsService = create<OmsServiceModel>((set, get) => ({
    loadingContent: true,
    statePageData: undefined,
    assignTemp: [],
    omsOrders: [],
    chiefReport: [],
    assignLoading:
    {
        isLoading: false,
        orderId: 0,
    },
    omsPickList: [],
    omsPickListGroup: [],
    omsPickListOrder: [],
    errorReasons: [],
    cancelLoading: false,
    packageList: [],
    continiousOrder: undefined,
    pickingTemp: [],
    loadingGroupCollect: false,
    assignableEmployee: [],
    packageContiniousOrder: undefined,
    packagingTemp: [],
    kzkQrTemp: [],
    hasWaybillComplete: true,
    tempZpl: [],
    tempPdf: [],
    onLoadingPrintLabel: false,
    isPackageLoading: false,
    completePickBag: false,
    waybillLoading: false,
    completePackageLoading: false,
    cargoConsensusRes: [],
    isConsensusCargoLoading: false,
    omsConsensusStartDate: new Date(),
    omsConsensusEndDate: new Date(),
    selectedCensusList: [],
    selectedCensusListTemp: [],
    printContractLoadingState: false,
    notfoundItems: [],
    startNotFoundDate: undefined,
    endNotFoundDate: undefined,
    orderHistory: undefined,
    toPoolLoading: false,
    getChiefReport: async () => {
        const response = await OmsApi.post<OmsResponseBase<OmsChiefReportModel[]>>(
            "OMC/GetEmployeeOrderReport"
        );
        if (response.data.Status === 1) {
            set((state) => ({
                ...state,
                chiefReport: response.data.Data,
            }));
        }
    },
    loadStatePage: async () => {
        const AccountService = useAccountService.getState();
        const { getChiefReport } = get();
        try {
            set((state) => ({
                ...state,
                loadingContent: true,
                statePageData: undefined
            }));
            if (AccountService.isInRole("omc-oms-store-chief")) {
                await getChiefReport();
            }
            const response = await OmsApi.post<OmsResponseBase<OmsStatePageData>>(
                "omc/orderreport"
            );

            if (response.data.Status === 1) {
                set((state) => ({
                    ...state,
                    loadingContent: false,
                    statePageData: response.data.Data
                }));
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                loadingContent: false,
            }));
        }
    },
    loadAllOrders: async () => {
        const AccountService = useAccountService.getState();
        try {
            set((state) => ({
                ...state,
                loadingContent: true,
            }));
            const response = await OmsApi.post<OmsResponseBase<OmsOrderResponse>>(
                "collectall/getlist",
                { storeId: AccountService.getUserStoreId() }
            );

            if (response.data.Status === 1) {
                let model: OmsOrderModel[] = [];
                response.data.Data.Orders.map((x) => {
                    model.push({
                        ...x,
                        OrderItems: response.data.Data.OrderItems.filter(
                            (y) => y.OrderID === x.ID
                        ),
                    });
                });
                set((state) => ({
                    ...state,
                    assignTemp: [],
                    omsOrders: model
                }));
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                loadingContent: false,
            }));
        }
    },
    addAssignQueue: async (
        assignType: "all" | "order" | "timeLeft",
        type: "check" | "uncheck",
        orderNumber: number
    ) => {
        const { omsOrders, assignTemp } = get();
        if (assignType === "all") {
            if (type === "uncheck")
                set((state) => ({
                    ...state,
                    assignTemp: [],
                }));
            else {
                if (omsOrders) {
                    var newList: any = [];
                    omsOrders.map((x: any) => {
                        if (!assignTemp.includes(x.ID)) {
                            newList.push(x.ID);
                        }
                    });
                    set((state) => ({
                        ...state,
                        assignTemp: [...assignTemp, ...newList],
                    }));
                }
            }
        } else if (assignType === "order") {
            if (type === "uncheck") {
                var newList: any = assignTemp.filter((x: any) => x !== orderNumber);
                set((state) => ({
                    ...state,
                    assignTemp: [...newList],
                }));
            } else {
                if (!assignTemp.includes(orderNumber)) {
                    var oldList: any = assignTemp;
                    set((state) => ({
                        ...state,
                        assignTemp: [...oldList, orderNumber],
                    }));
                }
            }
        }
    },
    assignOrderToMe: async (orderId: number) => {
        const { omsOrders, loadAllOrders } = get();
        try {
            set((state) => ({
                ...state,
                assignLoading: { isLoading: true, orderId }
            }));

            const order = omsOrders?.find((x: any) => x.ID === orderId);
            if (!order) {
                set((state) => ({
                    ...state,
                    assignLoading: { isLoading: false, orderId: -1 }
                }));
                return;
            }

            let model = [
                {
                    OrderNo: order.OrderNo,
                    ID: orderId,
                    CreateDate: order?.CreateDate,
                    ProductCount: order?.ProductCount,
                    picklistCount: 0,
                    ChannelCode: "BC",
                    SourceCode: "FLO",
                    Duration: order.Duration,
                    Remainder: order.Remainder,
                    DurationName: order.DurationName,
                    StatusID: 0,
                    OrderStatusID: 2,
                    ActionByID: null,
                },
            ];
            // {"BarcodeNo": "8681711368614", "BodySize": "37", "Brand": "POLARİS 5 NOKTA", "CargoCompany": null, "Category": "AKSESUAR", "ChannelCode": "BC", "Color": "TABA", "CreateDate": "0001-01-01T00:00:00", "CreatedDate": null, "CurrentStock": null, "Desi": 1, "FoundCount": 0, "GiftNote": null, "ID": 4627, "ImageUrl": "https://www.flo.com.tr/V1/product/image?sku=100314025", "IsGift": 0, "IsPackaged": null, "IsPrinted": false, "LeftHours": 0, "ModelName": "81.111080.Z", "NotFoundProductPrintStatusID": 0, "OrderID": 4627, "OrderItemID": null, "OrderNo": "72900000001959", "OrderStatusID": "2", "ProductBarcode": "8681711368614                                     ", "ProductBarcodes": null, "ProductNo": "POLARİS 5 NOKTA 81.111080.Z TABA KADIN BASİC COMFORT", "ProductStatus": true, "ProductStatusDescription": "", "ProductStatusImage": "assets/images/approve.png", "Quantity": "1", "SKUNo": "000000100314025002", "SourceCode": null, "StoreCode": "4081", "StoreIP": null, "StoreName": "41 Gebze Center"}, {"BarcodeNo": "8681711368614", "BodySize": "37", "Brand": "POLARİS 5 NOKTA", "CargoCompany": null, "Category": "AKSESUAR", "ChannelCode": "BC", "Color": "TABA", "CreateDate": "0001-01-01T00:00:00", "CreatedDate": null, "CurrentStock": null, "Desi": 1, "FoundCount": 0, "GiftNote": null, "ID": 4627, "ImageUrl": "https://www.flo.com.tr/V1/product/image?sku=100314025", "IsGift": 0, "IsPackaged": null, "IsPrinted": false, "LeftHours": 0, "ModelName": "81.111080.Z", "NotFoundProductPrintStatusID": 0, "OrderID": 4627, "OrderItemID": null, "OrderNo": "72900000001959", "OrderStatusID": "2", "ProductBarcode": "8681711368614                                     ", "ProductBarcodes": null, "ProductNo": "POLARİS 5 NOKTA 81.111080.Z TABA KADIN BASİC COMFORT", "ProductStatus": true, "ProductStatusDescription": "", "ProductStatusImage": "assets/images/approve.png", "Quantity": "1", "SKUNo": "000000100314025002", "SourceCode": null, "StoreCode": "4081", "StoreIP": null, "StoreName": "41 Gebze Center"}

            const response = await OmsApi.post<OmsResponseBase<any>>(
                "OrderStats/SetStatusByOrderNo",
                model
            );

            if (response.data.Status === 1) {
                await loadAllOrders();
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                assignLoading: { isLoading: false, orderId: -1 }
            }));
        }
    },
    makeGroupPicking: async (model: OmsOrderDetail[]) => {
        let m: OmsOrderDetail[] = [];

        model.map((x) => {
            let index = m.findIndex(
                (y) =>
                    y.BarcodeNo === x.BarcodeNo &&
                    y.OrderNo === x.OrderNo &&
                    ((y.ChannelCode === "CC" && x.ChannelCode === "CC") ||
                        (y.ChannelCode === "BC" && x.ChannelCode === "CC") ||
                        (y.ChannelCode !== "PACKUPP" && y.ChannelCode !== "BC"))
            );

            if (index === -1) m.push({ ...x });
            else {
                m[index].Quantity = (
                    Number(m[index].Quantity) + Number(x.Quantity)
                ).toString();
            }
        });

        return m;
    },
    groupingBC: (model: OmsOrderDetail[], d: any, oi: number) => {
        let m: OmsOrderDetail[] = [];

        model
            .filter((x) => x.OrderID === oi)
            .map((x) => {
                x.ChannelCode = "BC";
                x.CreateDate = d;
                m.push(x);
            });

        return m;
    },
    loadMyPickList: async () => {
        const { makeGroupPicking, groupingBC } = get();
        try {
            set((state) => ({
                ...state,
                loadingContent: true
            }));
            let result = await OmsApi.post<OmsResponseBase<any>>(
                "Mypicklist/GetAllListForPicklistNoBC"
            );
            let result2 = await OmsApi.post<OmsResponseBase<OmsOrderResponse>>(
                "Mypicklist/GetBCPickList"
            );

            if (result.data.Status === 1) {
                let d = await makeGroupPicking(result.data.Data);
                set((state) => ({
                    ...state,
                    omsPickList: result.data.Data,
                    omsPickListGroup: d
                }));
            }

            if (result2.data.Status === 1) {
                let model: OmsOrderModel[] = [];
                result2.data.Data.Orders.map((x) => {
                    model.push({
                        ...x,
                        OrderItems: groupingBC(
                            result2.data.Data.OrderItems,
                            x.CreateDate,
                            x.ID
                        ),
                    });
                });
                set((state) => ({
                    ...state,
                    assignTemp: [],
                    omsOrders: model,
                    omsPickListOrder: model
                }));
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                loadingContent: false
            }));
        }
    },
    loadErrorReasons: async () => {
        const { errorReasons } = get();
        if (errorReasons.length === 0) {
            let response = await OmsApi.post<
                OmsResponseBase<OmsErrorReasonModel[]>
            >("Mypicklist/GetNotFoundReasonList");

            // Servisten gelen datayı isme göre yakalayıp çeviriyor
            response.data.Data.forEach((x) => {
                Object.entries(tr.omsErrorReasons).forEach(([key, value]) => {
                    if (value == x.OmsName) {
                        x.OmsName = translate("omsErrorReasons." + key);
                    }
                });
            });
            set((state) => ({
                ...state,
                errorReasons: response.data.Data
            }));
        }
    },
    loadAllPackageList: async () => {
        set((state) => ({
            ...state,
            loadingContent: true
        }));
        try {
            const response = await OmsApi.post<OmsResponseBase<OmsPackageModel[]>>(
                "PackageList/GetList"
            );

            if (response.data.Status === 1)
                set((state) => ({
                    ...state,
                    packageList: response.data.Data
                }));
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                loadingContent: false
            }));
        }
    },
    completeCancelMethod: async (
        model: any,
        orderDetail: any,
        skipRefresh: any
    ) => {
        const { loadAllPackageList, loadMyPickList, loadStatePage } = get();
        try {
            let result2 = await OmsApi.post<OmsResponseBase<any>>(
                "MyPickList/SaveOrder",
                [model]
            );

            // if (orderDetail.ChannelCode === "BC") {
            //     await OmsApi.post(`OMC/CancelOrderBC?orderNo=${orderDetail.OrderNo}`);
            // }

            if (result2.data.Status === 1 && !skipRefresh) {
                await loadMyPickList();
                await loadAllPackageList();
                await loadStatePage();
                return true;
            } else if (result2.data.Data && skipRefresh) {
                await loadMyPickList();
                return true;
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                cancelLoading: false
            }));
        }
        return false;
    },
    cancelOrder: async (
        orderDetail: OmsOrderDetail,
        reason: string,
        skipRefresh?: boolean
    ) => {
        const { completeCancelMethod } = get();
        const MessageBoxService = useMessageBoxService.getState();
        let model = {
            ID: orderDetail.ID,
            Brand: orderDetail.Brand,
            ModelName: orderDetail.ModelName,
            Color: orderDetail.Color,
            Category: orderDetail.Category,
            BodySize: orderDetail.BodySize,
            Quantity: orderDetail.Quantity,
            BarcodeNo: orderDetail.BarcodeNo,
            ProductBarcode: orderDetail.ProductBarcode,
            ProductBarcodes: orderDetail.ProductBarcodes,
            SKUNo: orderDetail.SKUNo,
            CurrentStock: null,
            OrderNo: orderDetail.OrderNo,
            OrderID: 0,
            ProductNo: orderDetail.ProductNo,
            OrderStatusID: "2",
            StoreCode: orderDetail.StoreCode,
            StoreName: orderDetail.StoreName,
            ImageUrl: orderDetail.ImageUrl,
            ProductStatus: 0,
            ProductStatusImage: null,
            ProductStatusDescription: reason,
            SourceCode: orderDetail.SourceCode,
            IsPackaged: null,
            CreateDate: orderDetail.CreateDate,
            CreatedDate: null,
            LeftHours: 0,
            IsPrinted: false,
            NotFoundProductPrintStatusID: 0,
            OrderItemID: null,
            IsGift: 0,
            GiftNote: null,
            FoundCount: 0,
            StoreIP: null,
            CargoCompany: null,
            Desi: orderDetail.Desi,
            ChannelCode: orderDetail.ChannelCode,
        };
        try {
            set((state) => ({
                ...state,
                cancelLoading: true
            }));

            let response = await OmsApi.post<OmsResponseBase<boolean>>(
                "PackageList/WayBillControl",
                { OrderNo: model.OrderNo }
            );

            if (response.data.Data) {
                MessageBoxService.show(translate("omsService.ordersCannotCanceled"));
                set((state) => ({
                    ...state,
                    cancelLoading: false
                }));
                return false;
            }

            let result = await OmsApi.post<OmsResponseBase<any>>(
                "SAP/GetRealTimeStock",
                model
            );

            MessageBoxService.show(
                result.data.Data < 1
                    ? `${translate("ProductDetail.areYouSure")}`
                    : `Bu üründen ${result.data.Data} adet stok bulunuyor, yinede iptal etmek istiyormusun ?`,
                {
                    type: MessageBoxType.YesNo,
                    yesButtonEvent: async () => {
                        await completeCancelMethod(model, orderDetail, skipRefresh);
                    },
                    noButtonEvent: () => {
                        set((state) => ({
                            ...state,
                            cancelLoading: false
                        }));
                    },
                }
            );

            return true;
        } catch (err: any) {
            MessageBoxService.show(translate("omsService.orderCancelingError"));
            return false;
        } finally {
        }
    },
    collectProduct: async (
        order: { type: string; orderNo: string },
        productId: string,
        quantity?: number,
        isPathPickList?: boolean
    ) => {
        const MessageBoxService = useMessageBoxService.getState();
        const { continiousOrder, collectProduct, omsPickListOrder, pickingTemp, completeCollect, omsPickList } = get();
        if (continiousOrder && continiousOrder != order.orderNo) {
            MessageBoxService.show(translate("omsService.cancelTransactionQuestion"), {
                yesButtonTitle: translate("omsService.cancel"),
                type: MessageBoxType.YesNo,
                yesButtonEvent: () => {
                    set((state) => ({
                        ...state,
                        continiousOrder: undefined,
                        pickingTemp: [],
                    }));
                    collectProduct(order, productId, quantity, isPathPickList);
                },
            });
            return;
        }

        set((state) => ({
            ...state,
            continiousOrder: order.orderNo,
        }));

        if (order.type === "BC") {
            var orderr = omsPickListOrder.find(
                (x: any) => x.OrderNo === order.orderNo
            );

            var items = orderr?.OrderItems.filter(
                (x: any) =>
                    x.ProductBarcode === productId ||
                    x.ProductBarcode.includes(productId)
            );

            var item: OmsOrderDetail | undefined = undefined;

            if (items && items.length > 0) {
                for (var i = 0; i < items?.length; i++) {
                    let x = items[i];
                    if (pickingTemp.findIndex((y: any) => y.ID === x.ID) === -1) {
                        item = x;
                        break;
                    }
                }

                if (!item) item = items[0];
            }

            if (
                item &&
                !pickingTemp.find(
                    (x: any) => x.BarcodeNo === item?.BarcodeNo && x.ID === item?.ID
                )
            ) {
                set((state) => ({
                    ...state,
                    continiousOrder: order.orderNo,
                }));
                var newData = [...pickingTemp, item];
                set((state) => ({
                    ...state,
                    pickingTemp: newData
                }))

                let ord = omsPickListOrder.find(
                    (x: any) => x.OrderNo === order.orderNo
                );
                if (ord && ord.OrderItems.length > newData.length) {
                    if (isPathPickList) RootNavigation.navigate("Oms", { screen: "Pick" });
                } else {
                    MessageBoxService.show(
                        order.orderNo + "|" + (item ? item.ImageUrl : ""),
                        {
                            type: MessageBoxType.OmsComplete,
                            yesButtonEvent: async () => {
                                set((state) => ({
                                    ...state,
                                    loadingContent: true,
                                }));
                                if (!isPathPickList) RootNavigation.navigate("Oms");
                                // Tamamlandı işlemi
                                let res = await completeCollect(newData);
                                if (res) {
                                    set((state) => ({
                                        ...state,
                                        continiousOrder: undefined,
                                        pickingTemp: []
                                    }));
                                }
                            },
                        }
                    );
                }
            } else if (
                item &&
                pickingTemp.find((x: any) => x.BarcodeNo === item?.BarcodeNo)
            ) {
                let index = pickingTemp.findIndex(
                    (x: any) => x.BarcodeNo === item?.BarcodeNo
                );

                if (index !== -1 && quantity) {
                    pickingTemp[index].Quantity = (
                        Number(pickingTemp[index].Quantity) + quantity
                    ).toString();
                    var newData = pickingTemp;
                    set((state) => ({
                        ...state,
                        pickingTemp: newData
                    }))

                    let ord = omsPickListOrder.find(
                        (x: any) => x.OrderNo === order.orderNo
                    );
                    if (ord && ord.OrderItems.length > newData.length) {
                        if (isPathPickList) RootNavigation.navigate("Oms", { screen: "Pick" });
                    } else {
                        MessageBoxService.show(
                            order.orderNo + "|" + (item ? item.ImageUrl : ""),
                            {
                                type: MessageBoxType.OmsComplete,
                                yesButtonEvent: async () => {
                                    set((state) => ({
                                        ...state,
                                        loadingContent: true,
                                    }));
                                    if (!isPathPickList) RootNavigation.navigate("Oms");
                                    // Tamamlandı işlemi
                                    let res = await completeCollect(newData);
                                    if (res) {
                                        set((state) => ({
                                            ...state,
                                            continiousOrder: undefined,
                                            pickingTemp: []
                                        }));
                                    }
                                },
                            }
                        );
                    }
                }
            }
        } else {
            item = omsPickList.find(
                (x: any) =>
                    x.ProductBarcode === productId ||
                    x.ProductBarcode.includes(productId)
            );

            if (
                item &&
                !pickingTemp.find((x: any) => x.BarcodeNo === item?.BarcodeNo)
            ) {
                var newData = [...pickingTemp, item];
                set((state) => ({
                    ...state,
                    pickingTemp: newData
                }))

                if (
                    omsPickList.filter((x: any) => x.OrderNo === order.orderNo)
                        .length > newData.length
                ) {
                    if (isPathPickList) RootNavigation.navigate("Oms", { screen: "Pick" });
                } else
                    MessageBoxService.show(
                        order.orderNo + "|" + (item ? item.ImageUrl : ""),
                        {
                            type: MessageBoxType.OmsComplete,
                            yesButtonEvent: async () => {
                                if (!isPathPickList) RootNavigation.navigate("Oms");
                                set((state) => ({
                                    ...state,
                                    loadingContent: true,
                                }));
                                // Tamamlandı işlemi
                                let res = await completeCollect(newData);
                                if (res) {
                                    set((state) => ({
                                        ...state,
                                        continiousOrder: undefined,
                                        pickingTemp: []
                                    }));
                                }
                            },
                        }
                    );
            }
        }
    },
    collectGroupProduct: async (
        productGroup: OmsOrderDetail,
        quantity: number,
        reason?: OmsErrorReasonModel,
        continueLater?: boolean
    ) => {
        const { omsPickList, cancelOrder, loadMyPickList } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                loadingGroupCollect: true
            }));

            let collectModel: OmsOrderDetail[] = [];
            let removeModel: OmsOrderDetail[] = [];
            let remainingQuantity = quantity;

            // Toplama listesinde okutulan ürünü bul
            var bpick: any = linq
                .from(omsPickList)
                .firstOrDefault((x: any) => x.BarcodeNo === productGroup.BarcodeNo);

            // Toplama listesinde okutulan üründen başka aynı siparişe ait ürün var mı ?
            let c = linq
                .from(omsPickList)
                .any(
                    (x: any) =>
                        bpick !== undefined &&
                        x.OrderNo === bpick.OrderNo &&
                        x.BarcodeNo !== bpick.BarcodeNo
                );

            omsPickList
                .filter((x: any) => x.BarcodeNo === productGroup.BarcodeNo)
                .sort((x: any) => Number(x.Quantity))
                .map((x: any) => {
                    if (Number(x.Quantity) <= remainingQuantity) {
                        let temp = { ...x };
                        temp.ProductStatus = 1;
                        temp.ProductStatusDescription = translate(
                            "omsService.productHasFound"
                        );
                        collectModel.push(x);
                        remainingQuantity = remainingQuantity - Number(x.Quantity);
                    } else if (!continueLater && reason) {
                        let temp = { ...x };
                        temp.ProductStatus = 0;
                        temp.ProductStatusDescription = reason.OmsName;
                        removeModel.push(x);
                    } else if (
                        Number(x.Quantity) > remainingQuantity &&
                        continueLater
                    ) {
                        let temp = { ...x };
                        temp.Quantity = remainingQuantity.toString();
                        temp.ProductStatus = 1;
                        temp.ProductStatusDescription = translate(
                            "omsService.productHasFound"
                        );
                        collectModel.push(x);
                        remainingQuantity = 0;
                    }
                });

            if (reason) {
                for (var i = 0; i < removeModel.length; i++) {
                    await cancelOrder(removeModel[i], reason.OmsName, true);
                }
            } else {
                let m = collectModel.map((x) => {
                    return {
                        ID: x.ID,
                        OrderNo: x.OrderNo,
                        Quantity: x.Quantity,
                        Desi: x.Desi,
                        Brand: "",
                        ModelName: "",
                        Color: "",
                        Category: "",
                        BodySize: "",
                        BarcodeNo: "",
                        ProductBarcode: "",
                        ProductBarcodes: "",
                        SKUNo: "",
                        CurrentStock: null,
                        OrderID: 0,
                        ProductNo: "",
                        OrderStatusID: "2",
                        StoreCode: "",
                        StoreName: null,
                        ImageUrl: "",
                        ProductStatus: 1,
                        ProductStatusImage: null,
                        ProductStatusDescription: "",
                        SourceCode: null,
                        IsPackaged: null,
                        CreateDate: x.CreateDate,
                        CreatedDate: null,
                        LeftHours: 0,
                        IsPrinted: false,
                        NotFoundProductPrintStatusID: 0,
                        OrderItemID: null,
                        IsGift: 0,
                        GiftNote: null,
                        FoundCount: 0,
                        StoreIP: null,
                        CargoCompany: null,
                        ChannelCode: "",
                    };
                });

                let result = await OmsApi.post<OmsResponseBase<any>>(
                    "MyPickList/SaveOrder",
                    m
                );

                if (result.data.Status === 1) {
                    await loadMyPickList();

                    if (c)
                        MessageBoxService.show(
                            translate("omsService.allOrdersPackingCompleted")
                        );
                }
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                loadingGroupCollect: false
            }));
        }
    },
    completeCollect: async (data: any) => {
        try {
            const { loadMyPickList } = get();
            var m: any[] = [];
            data.map((x: any) => {
                m.push({
                    ID: x.ID,
                    OrderNo: x.OrderNo,
                    Quantity: x.Quantity,
                    Desi: x.Desi,
                    Brand: "",
                    ModelName: "",
                    Color: "",
                    Category: "",
                    BodySize: "",
                    BarcodeNo: "",
                    ProductBarcode: "",
                    ProductBarcodes: "",
                    SKUNo: "",
                    CurrentStock: null,
                    OrderID: 0,
                    ProductNo: "",
                    OrderStatusID: "2",
                    StoreCode: "",
                    StoreName: null,
                    ImageUrl: "",
                    ProductStatus: 1,
                    ProductStatusImage: null,
                    ProductStatusDescription: "",
                    SourceCode: null,
                    IsPackaged: null,
                    CreateDate: x.CreateDate,
                    CreatedDate: null,
                    LeftHours: 0,
                    IsPrinted: false,
                    NotFoundProductPrintStatusID: 0,
                    OrderItemID: null,
                    IsGift: 0,
                    GiftNote: null,
                    FoundCount: 0,
                    StoreIP: null,
                    CargoCompany: null,
                    ChannelCode: "",
                });
            });

            let result = await OmsApi.post<OmsResponseBase<any>>(
                "MyPickList/SaveOrder",
                m
            );

            if (result.data.Status === 1) {
                await loadMyPickList();
                return true;
            }
            return false;
        } catch (err: any) {
        } finally {
        }
        return false;
    },
    loadAssignableEmployee: async () => {
        const { assignableEmployee } = get();
        try {
            if (assignableEmployee && assignableEmployee.length > 0) return;
            let response = await OmsApi.post<OmsResponseBase<any>>(
                "CollectAll/GetUsers",
                {}
            );
            set((state) => ({
                ...state,
                assignableEmployee: response.data.Data,
                pickingTemp: []
            }));
        } catch (err) { }
    },
    completeAssignQueue: async (UserID: number) => {
        const { assignTemp, omsOrders, loadAllOrders } = get();
        const MessageBoxService = useMessageBoxService.getState();
        const model: any[] = [];
        if (!assignTemp || assignTemp.length === 0) {
            MessageBoxService.show(translate("omsService.selectOrderAssign"));
            return;
        }
        assignTemp.forEach((x: any) => {
            let order = omsOrders?.find((y: any) => y.ID === x);

            if (order) {
                model.push({
                    ActionByID: UserID,
                    ChannelCode: order?.ChannelCode,
                    CreateDate: order?.CreateDate,
                    Duration: order?.Duration,
                    DurationName: order?.DurationName,
                    ID: order?.ID,
                    OrderNo: order?.OrderNo,
                    OrderStatusID: 2,
                    ProductCount: order?.ProductCount,
                    Remainder: order?.Remainder,
                    SourceCode: order?.SourceCode,
                    StatusID: order?.StatusID,
                    picklistCount: order?.picklistCount,
                });
            }
        });

        let response = await OmsApi.post<OmsResponseBase<any>>(
            "OrderStats/SetStatusByOrderNo",
            model
        );

        if (response.data.Status === 1) await loadAllOrders();
    },
    pickItem: async (orderId: string, productId: string, isPathPackageList?: boolean) => {
        const { packageContiniousOrder, pickItem, packageList, packagingTemp } = get();
        const MessageBoxService = useMessageBoxService.getState();
        if (packageContiniousOrder && packageContiniousOrder != orderId) {
            MessageBoxService.show(translate("omsService.packageTransactionQuestion"), {
                type: MessageBoxType.YesNo,
                yesButtonEvent: () => {
                    set((state) => ({
                        ...state,
                        packageContiniousOrder: undefined,
                        packagingTemp: [],
                        kzkQrTemp: [],
                    }));
                    pickItem(orderId, productId, isPathPackageList);
                },
            });
            return;
        }
        set((state) => ({
            ...state,
            packageContiniousOrder: orderId,
            tempZpl: [],
            hasWaybillComplete: false,
        }));
        var order = packageList.find((x: any) => x.OrderNo === orderId);
        if (order) {
            // Koli/Poşet Seç yapılmış
            if (order.IsPackaged) {
                if (isPathPackageList) {
                    set((state) => ({
                        ...state,
                        completePickBag: true,
                    }));
                    // Tüm siparişleri tikliyor.
                    var items: any = [];
                    order.Orders.forEach((x: any) => {
                        x.ProductStatus = true;
                        items.push(x);
                    });
                    set((state) => ({
                        ...state,
                        packagingTemp: items,
                    }));
                    RootNavigation.navigate("Oms", { screen: "Package" });
                }
            } else {
                set((state) => ({
                    ...state,
                    completePickBag: false,
                }));

                const items = order.Orders.filter(
                    (x: any) => x.BarcodeNo === productId
                );
                let item: PackageOrder | undefined = undefined;
                for (var i = 0; i < items.length; i++) {
                    const x = items[i];
                    if (packagingTemp.findIndex((y: any) => y.ID === x.ID) === -1) {
                        item = x;
                        break;
                    }
                }
                if (item === undefined && items.length > 0) {
                    item = items[0];
                }
                if (item) {
                    if (packagingTemp.findIndex((x: any) => x.ID === item?.ID) === -1) {
                        item.ProductStatus = true;
                        //@ts-ignore
                        set((state) => ({
                            ...state,
                            packagingTemp: [...packagingTemp, item],
                        }));
                    }
                    if (Number(item.Quantity) > 1) {
                        MessageBoxService.show(
                            translate("OmsPackageCard.requiredOrder", {
                                qty: item.Quantity,
                            }),
                            {
                                type: MessageBoxType.Standart,
                                yesButtonEvent: () => {
                                    if (isPathPackageList) RootNavigation.navigate("Oms", { screen: "Package" });


                                },
                            }
                        );
                    } else if (isPathPackageList) RootNavigation.navigate("Oms", { screen: "Package" });
                }
            }
        }
    },
    pickKzkQr: (data: OmsKzkQrTempModel) => {
        const { packageList, packageContiniousOrder, kzkQrTemp } = get();
        var order = packageList.find(
            (x: any) => x.OrderNo === packageContiniousOrder
        );
        if (order) {
            const items = order.Orders.filter(
                (x: any) => x.BarcodeNo === data.barcode
            );
            let item: PackageOrder | undefined = undefined;
            for (var i = 0; i < items.length; i++) {
                const x = items[i];
                if (kzkQrTemp.findIndex((y: any) => y.ID === x.ID) === -1) {
                    item = x;
                    break;
                }
            }
            if (item === undefined && items.length > 0) {
                item = items[0];
            }
            if (item && kzkQrTemp.findIndex((x: any) => x.ID === item?.ID) === -1) {
                var model: OmsKzkQrTempModel = {
                    ID: item.ID,
                    barcode: data.barcode,
                    qrCode: data.qrCode,
                };
                set((state) => ({
                    ...state,
                    kzkQrTemp: [...kzkQrTemp, model],
                }));
            }
        }
    },
    printLabel: async () => {
        const { CheckPrinterConfiguration, packageList, packageContiniousOrder, Print, loadAllPackageList } = get();
        if (
            !CheckPrinterConfiguration(
                translate("omsService.configurePackagegingProcess")
            )
        ) {
            return false;
        }
        set((state) => ({
            ...state,
            onLoadingPrintLabel: true
        }));
        const order = packageList.find(
            (x: any) => x.OrderNo === packageContiniousOrder
        );

        if (order) {
            const sendOrderModel = {
                OrderNo: order.OrderNo,
                TotalCount: order.TotalCount,
                CompletedCount: order.TotalCount,
                IsAllOrderPackaged: order.IsAllOrderPackaged,
                IsWayBill: false,
                IsOrderDesi: false,
                IsGibMatbu: false,
                IsSentGib: false,
                OrderDesi: null,
                IsGift: 0,
                StoreIP: order.StoreIP,
                Orders: null,
                CargoCompany: "BC",
            };

            let result = await OmsApi.post<OmsResponseBase<any>>(
                "SAP/SendOrder",
                sendOrderModel
            );

            if (result.data.Status === 1 || result.data.Status === 2) {
                const desiControlModel = {
                    TotalCount: order.TotalCount,
                    SourceCode: "BC",
                    CargoCompany: "BC",
                    OrderNo: order.OrderNo,
                };

                let desiResult = await OmsApi.post<OmsResponseBase<any>>(
                    "PackageList/OrderDesiControl",
                    desiControlModel
                );

                if (desiResult.data.Status === 1) {
                    const saveDesiModel = {
                        OrderNo: order.OrderNo,
                        Barcode: "BC",
                        Desi: "3",
                        SAPDesi: "1",
                        IsPackage: true,
                    };

                    let desires = await OmsApi.post<OmsResponseBase<any>>(
                        "PackageList/SaveOrderDesi",
                        saveDesiModel
                    );

                    const zpl: string[] =
                        desires.data.Messages["BCdummyBarcode"].split("SECOSULO");
                    sendOrderModel.IsAllOrderPackaged = true;
                    sendOrderModel.IsWayBill = true;
                    sendOrderModel.IsOrderDesi = true;

                    await OmsApi.post<OmsResponseBase<any>>(
                        "Gib/BelgeGonder",
                        sendOrderModel
                    );

                    await OmsApi.post<OmsResponseBase<any>>(
                        "PackageList/CompleteOrder",
                        [sendOrderModel]
                    );

                    zpl.forEach((e: string) => {
                        Print(e, order.OrderNo);
                    });
                    await loadAllPackageList();
                    RootNavigation.navigate("Oms")
                    set((state) => ({
                        ...state,
                        onLoadingPrintLabel: false,
                        packageContiniousOrder: undefined,
                        packagingTemp: [],
                        kzkQrTemp: []
                    }));
                    return true;
                }
            }
        }
        return false;
    },
    pickBagBarcodeStart: async () => {
        const { packageList, packageContiniousOrder, kzkQrTemp, mergeMessages } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                isPackageLoading: true
            }));
            const order = packageList.find(
                (x: any) => x.OrderNo === packageContiniousOrder
            );

            if (order) {
                const sendOrderModel = {
                    OrderNo: order.OrderNo,
                    TotalCount: order.TotalCount,
                    CompletedCount: order.TotalCount,
                    IsAllOrderPackaged: true,
                    IsWayBill: true,
                    IsOrderDesi: true,
                    IsGibMatbu: false,
                    IsSentGib: true,
                    OrderDesi: null,
                    IsGift: 0,
                    StoreIP: "00",
                    Orders: null,
                    CargoCompany:
                        order.Orders.length > 0 ? order.Orders[0].CargoCompany : "",
                };

                let result = await OmsApi.post<OmsResponseBase<any>>(
                    "SAP/SendOrder",
                    sendOrderModel
                );

                if (kzkQrTemp.length > 0) {
                    await OmsApi.post<OmsResponseBase<any>>(
                        "PackageList/AddQrCode",
                        kzkQrTemp
                    );
                }

                set((state) => ({
                    ...state,
                    isPackageLoading: false
                }));
                if (!result.data.Data) {
                    MessageBoxService.show(mergeMessages(result.data.Messages), {
                        icon: <CloseIco />,
                    });
                    return;
                }
                return;
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isPackageLoading: false
            }));
        }
    },
    pickBagBarcodeStep2: async (barcode: string, packageCount: number) => {
        const { packageList, packageContiniousOrder, mergeMessages, saveSize, pickBagBarcodeStart } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                isPackageLoading: true
            }));
            const order = packageList.find(
                (x: any) => x.OrderNo === packageContiniousOrder
            );

            if (order) {
                const desiControlModel = {
                    TotalCount: 2,
                    SourceCode: barcode,
                    OrderNo: order.OrderNo,
                };

                let desiResult = await OmsApi.post<OmsResponseBase<any>>(
                    "PackageList/OrderDesiControl",
                    desiControlModel
                );

                if (!desiResult.data.Data) {
                    MessageBoxService.show(mergeMessages(desiResult.data.Messages), {
                        icon: <CloseIco />,
                    });
                    set((state) => ({
                        ...state,
                        isPackageLoading: false
                    }));
                    return false;
                }

                if (desiResult.data.Data.IsPackaged) {
                    MessageBoxService.show(translate("omsService.scannedBarcocedIncorrect"), {
                        icon: <CloseIco />,
                    });
                    set((state) => ({
                        ...state,
                        isPackageLoading: false
                    }));
                    return false;
                }

                let IsPackage = desiResult.data.Data.ImageUrl === "Koli";

                if (IsPackage) {
                    MessageBoxService.show(
                        translate("omsService.totalDecisQuestion1") +
                        " " +
                        desiResult.data.Data.CurrentStock +
                        " " +
                        translate("omsService.totalDecisQuestion2") +
                        " " +
                        desiResult.data.Data.GiftNote +
                        " " +
                        translate("omsService.totalDecisQuestion3"),
                        {
                            type: MessageBoxType.YesNo,
                            yesButtonEvent: async () => {
                                saveSize(
                                    order,
                                    barcode,
                                    desiResult.data.Data.GiftNote,
                                    desiResult.data.Data.CurrentStock,
                                    IsPackage,
                                    packageCount
                                );
                                await pickBagBarcodeStart();
                            },
                        }
                    );
                } else {
                    saveSize(
                        order,
                        barcode,
                        desiResult.data.Data.GiftNote,
                        desiResult.data.Data.CurrentStock,
                        IsPackage,
                        packageCount
                    );
                    await pickBagBarcodeStart();
                }

                return true;
            }
            return false;
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isPackageLoading: false
            }));
        }
    },
    saveSize: async (
        order: OmsPackageModel,
        barcode: string,
        desi: any,
        sapDesi: any,
        isPackage: boolean,
        packageCount: number
    ) => {
        const MessageBoxService = useMessageBoxService.getState();
        const { mergeMessages } = get();
        set((state) => ({
            ...state,
            tempZpl: [],
            hasWaybillComplete: false,
        }));
        const saveDesiModel = {
            OrderNo: order.OrderNo,
            Barcode: barcode,
            Desi: desi,
            SAPDesi: sapDesi.replace(",", "."),
            IsPackage: isPackage,
            PackageCount: packageCount,
        };
        let desires = await OmsApi.post<OmsResponseBase<any>>(
            "PackageList/SaveOrderDesi",
            saveDesiModel
        );

        if (desires.data.Messages && desires.data.Messages["BCdummyBarcode"]) {
            set((state) => ({
                ...state,
                tempZpl: desires.data.Messages["BCdummyBarcode"].split("SECOSULO")
            }));
        }

        if (desires.data.Data) {
            set((state) => ({
                ...state,
                completePickBag: true
            }));
            MessageBoxService.show(translate("omsService.parcelAndBagScanSuccess"), {
                type: MessageBoxType.Standart,
            });
        } else {
            if (desires.data.Messages) {
                // SaveOrderDesi Error
                if (desires.data.Messages["SaveOrderDesi"]) {
                    desires.data.Messages["SaveOrderDesi"] = translate(
                        "omsService.selectParselAndBagWarning"
                    );
                    set((state) => ({
                        ...state,
                        completePickBag: true
                    }));
                }

                MessageBoxService.show(mergeMessages(desires.data.Messages));
            } else {
                MessageBoxService.show("Bilinmeyen bir hata oluştu");
            }
        }
    },
    waybillPrint: async () => {
        const { packageList, packageContiniousOrder, getZplData, Print, downloadPdf, mergeMessages } = get();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                waybillLoading: true
            }));
            const order = packageList.find(
                (x: any) => x.OrderNo === packageContiniousOrder
            );

            if (order) {
                const sendOrderModel = {
                    OrderNo: order.OrderNo,
                    TotalCount: order.TotalCount,
                    CompletedCount: order.TotalCount,
                    IsGibMatbu: false,
                    IsSentGib: false,
                    IsAllOrderPackaged: true,
                    IsWayBill: true,
                    IsOrderDesi: true,
                    OrderDesi: null,
                    IsGift: 0,
                    StoreIP: "00",
                    Orders: null,
                    CargoCompany:
                        order.Orders.length > 0 ? order.Orders[0].CargoCompany : "",
                };

                var res = await OmsApi.post<OmsResponseBase<any>>(
                    "Gib/BelgeGonder",
                    sendOrderModel
                );

                if (res.data.Status) {
                    if (
                        ApplicationGlobalService.omsPrintPdfBarcode &&
                        Platform.OS === "web"
                    ) {
                        const result = await OmsApi.post("CargoReconciliation/PrintPdf", {
                            orderNo: order.OrderNo,
                        });
                        set((state) => ({
                            ...state,
                            hasWaybillComplete: true
                        }));
                        result.data.Data.forEach((x: any) => {
                            downloadPdf(x);
                        });
                    } else {
                        var zpls = await getZplData(order.OrderNo);
                        set((state) => ({
                            ...state,
                            hasWaybillComplete: true
                        }));
                        zpls.forEach((x) => {
                            if (x.length > 0) Print(x, order.OrderNo);
                        });
                    }
                } else {
                    MessageBoxService.show(mergeMessages(res.data.Messages), {
                        type: MessageBoxType.Standart,
                    });
                }
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                waybillLoading: false
            }));
        }
    },
    getZplData: async (orderNo: string) => {
        let result = await OmsApi.post<OmsResponseBase<string>>(
            "ARASCargo/GetBarcode",
            { OrderNo: orderNo }
        );

        if (result.data.Data) return result.data.Data.split("SECOSULO");

        return [];
    },
    completePackage: async () => {
        const { packageList, packageContiniousOrder, loadAllPackageList, mergeMessages } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                completePackageLoading: true
            }));
            const order = packageList.find(
                (x: any) => x.OrderNo === packageContiniousOrder
            );

            if (order) {
                const sendOrderModel = {
                    OrderNo: order.OrderNo,
                    TotalCount: order.TotalCount,
                    CompletedCount: order.TotalCount,
                    IsGibMatbu: false,
                    IsSentGib: false,
                    IsAllOrderPackaged: true,
                    IsWayBill: true,
                    IsOrderDesi: true,
                    OrderDesi: null,
                    IsGift: 0,
                    StoreIP: "00",
                    Orders: null,
                    CargoCompany:
                        order.Orders.length > 0 ? order.Orders[0].CargoCompany : "",
                };

                var res = await OmsApi.post<OmsResponseBase<any>>(
                    "PackageList/CompleteOrder",
                    [sendOrderModel]
                );
                if (res.data.Data) {
                    loadAllPackageList();
                    RootNavigation.navigate("Oms");
                    set((state) => ({
                        ...state,
                        completePackageLoading: false,
                        waybillLoading: false,
                        tempZpl: [],
                        packagingTemp: [],
                        kzkQrTemp: [],
                        completePickBag: false,
                        packageContiniousOrder: ""
                    }));
                    return true;
                } else {
                    MessageBoxService.show(mergeMessages(res.data.Messages), {
                        type: MessageBoxType.Standart,
                    });
                    return false;
                }
            }
            return false;
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                completePackageLoading: false,
            }));
        }
    },
    getCargoConsensus: async (
        cargoCompany: string,
        isWaitingCargo: boolean
    ) => {
        const { omsConsensusStartDate, omsConsensusEndDate } = get();
        try {
            set((state) => ({
                ...state,
                isConsensusCargoLoading: true,
            }));
            let result = await OmsApi.post<OmsResponseBase<any>>(
                "CargoReconciliation/GetList",
                isWaitingCargo
                    ? {
                        CargoCompany: cargoCompany.trim(),
                        AccetptenceNo: "0",
                        OrderNo: "",
                        OrderDate: `${omsConsensusStartDate.getDate()}.${omsConsensusStartDate.getMonth() + 1
                            }.${omsConsensusStartDate.getFullYear()}`,
                        ChannelCode: "0",
                        IsGift: isWaitingCargo,
                    }
                    : {
                        CargoCompany: cargoCompany.trim(),
                        OrderDate: `${omsConsensusStartDate.getDate()}.${omsConsensusStartDate.getMonth() + 1
                            }.${omsConsensusStartDate.getFullYear()}`,
                        ChannelCode: "0",
                        IsGift: isWaitingCargo,
                    }
            );
            set((state) => ({
                ...state,
                cargoConsensusRes: result.data.Data || []
            }));
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isConsensusCargoLoading: false
            }));
        }
    },
    setOmsConsensusStartDateData: (date: Date) => {
        set((state) => ({
            ...state,
            omsConsensusStartDate: date
        }));
    },
    printContract: async (
        model: { OrderNo: string; AccetptenceNo: string }[]
    ) => {
        const { CheckPrinterConfiguration, downloadPdf, Print } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            if (
                !CheckPrinterConfiguration(
                    translate("printerConfig.pleaseSelectConfig")
                )
            ) {
                return false;
            }
            set((state) => ({
                ...state,
                printContractLoadingState: false,
            }));
            let act = linq
                .from(model)
                .select((x) => x.AccetptenceNo)
                .distinct()
                .where((x) => x !== null && x !== undefined && x !== "")
                .toArray();

            if (act.length > 0) {
                act.map(async (x) => {
                    if (Platform.OS === "web") {
                        const result = await OmsApi.post(
                            "CargoReconciliation/GetCargoReconciliationPdf",
                            { AccetptenceNo: x }
                        );
                        if (result.data.Data.length > 0) {
                            result.data.Data.forEach((element: string) => {
                                downloadPdf(element)
                            });
                        }
                    } else {
                        let zplRes = await OmsApi.post<OmsResponseBase<string[]>>(
                            "CargoReconciliation/GetZpl",
                            { AccetptenceNo: x }
                        );

                        zplRes.data.Data.map((x) => {
                            setTimeout(() => Print(x), 3000);
                        });
                    }
                });

                return true;
            }

            let result = await OmsApi.post<OmsResponseBase<any>>(
                "CargoReconciliation/SaveCargoReconciliation",
                model
            );

            if (Platform.OS === "web") {
                const res2 = await OmsApi.post("CargoReconciliation/GetCargoReconciliationPdf", {
                    AccetptenceNo: result.data.Data.AccetptenceNo,
                });
                downloadPdf(res2.data.Data);
            } else {
                let zplRes = await OmsApi.post<OmsResponseBase<string[]>>(
                    "CargoReconciliation/GetZpl",
                    { AccetptenceNo: result.data.Data.AccetptenceNo }
                );
                zplRes.data.Data.map((x) => {
                    setTimeout(() => Print(x), 3000);
                });
            }
            set((state) => ({
                ...state,
                printContractLoadingState: false,
            }));
            return true;
        } catch (err: any) {
            if (
                err?.response?.status === 700 ||
                err?.response?.status === 401 ||
                err?.response?.status === 409
            )
                MessageBoxService.show(translate("omsService.suppressionFailed"));
            return false;
        } finally {
            set((state) => ({
                ...state,
                printContractLoadingState: false,
            }));
        }
    },
    downloadPdf: (b64: string) => {
        const linkSource = `data:application/octet-stream;base64,${b64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download =
            "mutabakat-" + moment(new Date()).format("DD-MM-YYYY") + ".pdf";
        downloadLink.click();
        downloadLink.remove();
    },
    printZpl: async (orderId: string) => {
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const { downloadPdf, CheckPrinterConfiguration, getZplData, Print } = get();
        try {
            if (
                ApplicationGlobalService.omsPrintPdfBarcode &&
                Platform.OS === "web"
            ) {
                const result = await OmsApi.post("CargoReconciliation/PrintPdf", {
                    orderNo: orderId,
                });
                result.data.Data.forEach((x: any) => {
                    downloadPdf(x);
                });
                set((state) => ({
                    ...state,
                    hasWaybillComplete: true,
                }));
            } else {
                if (
                    !CheckPrinterConfiguration(
                        translate("omsService.configurePackagegingProcess")
                    )
                ) {
                    return;
                }
                var zpls = await getZplData(orderId);
                set((state) => ({
                    ...state,
                    hasWaybillComplete: true,
                }));
                zpls.forEach((x) => {
                    if (x.length > 0) Print(x, orderId);
                });
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                tempZpl: [],
            }));
        }
    },
    printOrderLabel: async () => {
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        const { downloadPdf, packageContiniousOrder, getZplData, Print } = get();
        try {
            if (
                ApplicationGlobalService.omsPrintPdfBarcode &&
                Platform.OS === "web"
            ) {
                const result = await OmsApi.post("CargoReconciliation/PrintPdf", {
                    orderNo: packageContiniousOrder,
                });
                set((state) => ({
                    ...state,
                    hasWaybillComplete: true,
                }));
                result.data.Data.forEach((x: any) => {
                    downloadPdf(x);
                });
            } else {
                var zpls = await getZplData(packageContiniousOrder ?? "");
                set((state) => ({
                    ...state,
                    hasWaybillComplete: true,
                }));
                zpls.forEach((x) => {
                    if (x.length > 0) Print(x, packageContiniousOrder);
                });
            }
        } catch {
            MessageBoxService.show(translate("omsService.printingFailed"));
        }
    },
    loadNotFoundItems: async () => {
        try {
            const { startNotFoundDate, endNotFoundDate } = get();
            set((state) => ({
                ...state,
                loadingContent: true,
                notfoundItems: []
            }));

            var model = {
                StartDate: moment(startNotFoundDate).format("YYYY-MM-DD 00:00:00"),
                FinishDate: moment(endNotFoundDate).format("YYYY-MM-DD 23:59:59"),
            };

            let result = await OmsApi.post<OmsResponseBase<NotFoundProductModel[]>>(
                "NotFoundProduct/GetNotFoundList",
                model
            );

            if (result.data.Data.length > 0) {
                set((state) => ({
                    ...state,
                    notfoundItems: result.data.Data
                }));

                if (Platform.OS === "web") {
                    set((state) => ({
                        ...state,
                        startNotFoundDate: moment(startNotFoundDate).add(1, "day").toDate(),
                        endNotFoundDate: moment(endNotFoundDate).add(1, "day").toDate()
                    }));
                }
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                loadingContent: false,
            }));
        }
    },
    GetOrderProductList: async (orderNo: string) => {
        let result = await OmsApi.post<OmsResponseBase<any>>(
            "CargoReconciliation/GetOrderDetail",
            { OrderNo: orderNo }
        );
        return result.data.Data;
    },
    loadOrderHistory: async (query: string, pageNumber?: number) => {
        const { orderHistory } = get();
        try {
            if (query === "" && (pageNumber === undefined || pageNumber === 1))
                set((state) => ({
                    ...state,
                    loadingContent: true,
                }));

            let response = await OmsApi.post<OmsResponseBase<OrderHistoryModel>>(
                "History/GetList",
                { searchCriteria: query, PageNumber: pageNumber || 1 }
            );

            // Servisten gelen datayı isme göre yakalayıp çeviriyor
            response.data.Data.Orders.forEach((x) => {
                Object.entries(tr.OmsOrderHistoryActions).forEach(([key, value]) => {
                    if (value == x.Action) {
                        x.Action = translate("OmsOrderHistoryActions." + key);
                    }
                });
            });

            response.data.Data.OrderStats.forEach((x) => {
                Object.entries(tr.OmsOrderHistoryActions).forEach(([key, value]) => {
                    if (value == x.Action) {
                        x.Action = translate("OmsOrderHistoryActions." + key);
                    }
                });
            });

            if (pageNumber === 1 || pageNumber === undefined) {
                set((state) => ({
                    ...state,
                    orderHistory: response.data.Data,
                }));
            } else if (orderHistory) {
                orderHistory.Orders = [
                    ...orderHistory.Orders,
                    ...response.data.Data.Orders,
                ];
                orderHistory.OrderStats = [
                    ...orderHistory.OrderStats,
                    ...response.data.Data.OrderStats,
                ];
                orderHistory.HistoryCharts = [
                    ...orderHistory.HistoryCharts,
                    ...response.data.Data.HistoryCharts,
                ];
            } else {
                set((state) => ({
                    ...state,
                    orderHistory: response.data.Data,
                }));
            }
            return response.data.Data;
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                loadingContent: false
            }));
        }
    },
    GetWaybillStatus: async (startDate: Date, endDate: Date) => {
        try {
            const result = await OmsApi.post("Reporting/GetStatusWaybillStore", {
                StartDate: startDate,
                FinishDate: endDate,
            });
            return result.data.Data;
        } catch (err: any) {
            return [];
        }
    },
    printWaybillTry: async (orderId: string) => {
        const { CheckPrinterConfiguration, downloadPdf, getZplData, Print } = get();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        try {
            if (
                !CheckPrinterConfiguration(
                    translate("omsService.configurePrinterBeforeWaybill")
                )
            ) {
                return;
            }

            if (
                ApplicationGlobalService.omsPrintPdfBarcode &&
                Platform.OS === "web"
            ) {
                const result = await OmsApi.post("CargoReconciliation/PrintPdf", {
                    orderNo: orderId,
                });
                result.data.Data.forEach((x: any) => {
                    downloadPdf(x);
                });
                set((state) => ({
                    ...state,
                    hasWaybillComplete: true
                }));
            } else {
                var zpls = await getZplData(orderId);
                set((state) => ({
                    ...state,
                    hasWaybillComplete: true
                }));
                zpls.forEach((x) => {
                    if (x.length > 0) Print(x, orderId);
                });
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                tempZpl: []
            }));
        }
    },
    waybillComplete: async (sendOrderModel: any) => {
        try {
            var res = await OmsApi.post<OmsResponseBase<any>>(
                "PackageList/CompleteOrder",
                [sendOrderModel]
            );
            return res.data.Data;
        } catch (err: any) {
            return [];
        }
    },
    getOrderItemByOrderNo: async (orderNo: string) => {
        try {
            var res = await OmsApi.post<OmsResponseBase<OrderItemDetail>>(
                `History/GetOrderItemByOrderNo?orderNo=${orderNo}`,
                {}
            );
            return res.data.Data;
        } catch (err: any) {
            return [];
        }
    },
    userOrdersToPool: async (actionById: number) => {
        const { getChiefReport } = get();
        try {
            set((state) => ({
                ...state,
                toPoolLoading: true
            }));
            const result = await OmsApi.post<
                OmsResponseBase<OmsChiefReportModel[]>
            >(`OMC/UnAssignEmployeeOrder?ActionByID=${actionById}`, {});
            if (result.data.Status === 1) {
                getChiefReport();
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                toPoolLoading: false
            }));
        }
    },
    CheckPrinterConfiguration: (errorMsg: string) => {
        const PrinterConfigService = usePrinterConfigService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        if (Platform.OS === "web") return true;
        if (
            PrinterConfigService.selectedPrinter === undefined ||
            PrinterConfigService.printerConfig === undefined ||
            Object.keys(PrinterConfigService.selectedPrinter).length == 0 ||
            Object.keys(PrinterConfigService.printerConfig).length == 0
        ) {
            MessageBoxService.show(errorMsg, {
                type: MessageBoxType.Standart,
            });
            return false;
        }
        return true;
    },
    Print: (zpl: string, orderId?: string) => {
        const { CheckPrinterConfiguration } = get();
        const AccountService = useAccountService.getState();
        const PrinterConfigService = usePrinterConfigService.getState();
        if (Platform.OS === "web") {
            if (orderId === undefined) return;

            const uri = AccountService.testMode
                ? "http://10.203.2.5:4326/?OrderNo="
                : "http://10.201.12.4:4325/?OrderNo=";

            var w = window.open(uri + orderId, "_blank ");
        } else {
            if (
                !CheckPrinterConfiguration(
                    translate("printerConfig.pleaseSelectConfig")
                )
            ) {
                return;
            }
            PrinterConfigService.print(
                Platform.OS === "ios"
                    ? PrinterConfigService.selectedPrinter.id
                    : PrinterConfigService.selectedPrinter.address,
                zpl
            );
        }
    },
    CleanPicklist: () => {
        set((state) => ({
            ...state,
            pickingTemp: [],
            continiousOrder: ""
        }));
    },
    mergeMessages: (obj: any) => {
        let messageStr = "";
        for (var key in obj) {
            messageStr += `${obj[key]}`;
        }
        return messageStr;
    },
    CleanPackageList: () => {
        set((state) => ({
            ...state,
            packagingTemp: [],
            continiousOrder: ""
        }));
    },
    setStartNotFoundDateData: (date: Date) => {
        set((state) => ({
            ...state,
            startNotFoundDate: date
        }));
    },
    setEndNotFoundDateData: (date: Date) => {
        set((state) => ({
            ...state,
            endNotFoundDate: date
        }));
    },
    setSelectedCensusListData: (
        assignType: "all" | "order" | "remove",
        orderNumber: number,
    ) => {
        const { selectedCensusList, selectedCensusListTemp, cargoConsensusRes } = get();
        if (assignType === "all") {
            selectedCensusList.length === cargoConsensusRes.length
                ? set((state) => ({
                    ...state,
                    selectedCensusList: []
                }))
                : set((state) => ({
                    ...state,
                    selectedCensusList: linq
                        .from(cargoConsensusRes)
                        .select((x: any) => x.OrderNo)
                        .toArray()
                }))

        } else if (assignType === "order") {
            if (selectedCensusList.findIndex((x: any) => x === orderNumber) < 0)
                set((state) => ({
                    ...state,
                    selectedCensusList: [...selectedCensusList, orderNumber]
                }))
            else {
                set((state) => ({
                    ...state,
                    selectedCensusList: [...selectedCensusList.filter((x: any) => x !== orderNumber)],
                    selectedCensusListTemp: selectedCensusListTemp.filter((x: any) => x.orderNo !== orderNumber)
                }))
            }
        } else {
            set((state) => ({
                ...state,
                selectedCensusList: [],
                selectedCensusListTemp: []
            }))
        }
    },
    setSelectedCensusListTempData: (data: string) => {
        const MessageBoxService = useMessageBoxService.getState();
        const { cargoConsensusRes, selectedCensusListTemp, setSelectedCensusListData } = get();
        if (data === undefined || data === null || data === "") {
            MessageBoxService.show(translate("OmsPackageList.orderNotFound"));
            return;
        }
        var findData = cargoConsensusRes.find((x: any) => x.OrderNo === data || x.IBMBarcode === data);
        if (findData) {
            if (findData.ZplCodeCount > 1) {
                var findTempData = selectedCensusListTemp.find((x: any) => x.orderNo === findData.OrderNo);
                if (findTempData) {
                    if (parseInt(findData.ZplCodeCount) !== findTempData.quantity) {
                        const updatedList = selectedCensusListTemp.map((item: any) => {
                            //@ts-ignore
                            if (item.orderNo === findTempData.orderNo) {
                                return { ...item, quantity: item.quantity + 1 };
                            }
                            return item;
                        });
                        set((state) => ({
                            ...state,
                            selectedCensusListTemp: updatedList
                        }))

                        // Okutma dolduysa tikliyoruz
                        if (findTempData.quantity + 1 === parseInt(findData.ZplCodeCount))
                            setSelectedCensusListData("order", findData.OrderNo);

                    } else
                        MessageBoxService.show(translate("OmsCargoConsensus.readBeforeOrder"));

                } else {
                    set((state) => ({
                        ...state,
                        selectedCensusListTemp: [...selectedCensusListTemp, { orderNo: findData.OrderNo, quantity: 1 }]
                    }))
                    MessageBoxService.show(translate("OmsCargoConsensus.orderScanned", { qty: findData.ZplCodeCount }));
                }
            } else if (selectedCensusListTemp.findIndex((x: any) => x.orderNo === findData.OrderNo) === -1) {
                setSelectedCensusListData("order", findData.OrderNo);
                set((state) => ({
                    ...state,
                    selectedCensusListTemp: [...selectedCensusListTemp, { orderNo: findData.OrderNo, quantity: 1 }]
                }))
            } else
                MessageBoxService.show(translate("OmsCargoConsensus.readBeforeOrder"));
        } else {
            MessageBoxService.show(translate("OmsPackageList.orderNotFound"));
        }
    }
}));

import { CameraCapturedPicture } from "expo-camera";
import { createContext, useContext, useEffect, useState } from "react";
import { ErFiche, ErOrder } from "../core/models/ErFindFicheItem";
import { OmcRejectCargoFindResult } from "../core/models/OmcRejectCargoFindResult";
import { ErFindFicheResult } from "../core/models/ReturnedProduct/ErFindFicheResult";
import {
    FloResultCode,
    ServiceResponseBase,
} from "../core/models/ServiceResponseBase";
import { translate } from "../helper/localization/locaizationMain";
import { BrokenProductDetailMapModel } from "./model/BrokenProductDetailMapModel";
import {
    BrokenProductSapResult,
    BrokenProductSearchModel,
} from "./model/BrokenProductSearchModel";
import { CheckEasyReturnRequestModel } from "./model/CheckEasyReturnRequestModel";
import { DetailImageModel } from "./model/DetailImageModel";
import { EasyReturnTrasactionLineModel } from "./model/EasyReturnTrasactionLineModel";
import {
    EasyReturnTrasactionModel,
    TransactionSource,
    TransactionState,
    TransactionType,
} from "./model/EasyReturnTrasactionModel";
import { ErRejectModel } from "./model/ErRejectModel";
import { GeniusFicheDetailModel } from "./model/GeniusFicheDetailModel";
import { GeniusFicheModel } from "./model/GeniusFicheModel";
import { GeniusFicheRequestDetailModel } from "./model/GeniusFicheRequestDetailModel";
import { MessageBoxType } from "./model/MessageBoxOptions";
import { PaymentTypeDetailModel } from "./model/PaymentTypeDetailModel";
import { TransactionLineDetailModel } from "./model/TransactionLineDetailModel";
import * as MediaLibrary from "expo-media-library";
import * as exPrint from "expo-print";
import { useMessageBoxService } from "./MessageBoxService";
import { SystemApi, useAccountService } from "./AccountService";
import { useApplicationGlobalService } from "./ApplicationGlobalService";
import { create } from "zustand";
import * as RootNavigation from "../core/RootNavigation"

interface EasyReturnServiceModel {
    isLoading: boolean;
    currentFiche?: GeniusFicheModel;
    currentFicheList: GeniusFicheModel[];
    isBrokenComplete: boolean;
    findFicheRequest?: CheckEasyReturnRequestModel;
    returnType: number;
    returnSelectItemPropMap: GeniusFicheRequestDetailModel[];
    transaction?: EasyReturnTrasactionModel;
    transactionLineDetails: BrokenProductDetailMapModel[];
    isRejectCargoLoading: boolean;
    omsRejectCargoRes?: OmcRejectCargoFindResult;
    selectedRejectCargos: ErRejectModel[];
    loadingCompleteReject: boolean;
    erFicheList: ErFiche[];
    erOrder: ErOrder[];
    erCurrentFiche?: ErFindFicheResult;
    erSelectedReturnProducts: {
        barcode: string;
        combo: any;
        quantit: number;
    }[];
    source: number;
    brokenProductTemplate: string;
    brokenProductSapFiches: BrokenProductSapResult[];
    brokenProductFindResultList?: BrokenProductSearchModel[];
    brokenProductFindResult?: BrokenProductSearchModel;
    selectedPaymentTypes: { type: string; price: number }[];
    cancellationOrderNotFoundPopup: boolean;
    selectReasonForProduct: (barcode: string, reason: any) => Promise<void>;
    selectQuantityForProduct: (barcode: string, quantity: any) => Promise<void>;
    setReturnType: (rtnType: number) => Promise<void>;
    selectReturneeItem: (model: GeniusFicheDetailModel) => Promise<void>;
    findFiche: (isRouting: boolean) => Promise<void>;
    checkEasyReturn: (
        customSource: TransactionSource,
        isRouting: boolean
    ) => Promise<void>;
    makeTransaction: (source: TransactionSource) => Promise<void>;
    updateTransaction: (
        type: TransactionType,
        source: TransactionSource
    ) => Promise<void>;
    transactionAddLine: (rowBarcode: string) => Promise<boolean>;
    transactionUpdateline: (rowBarcode: string) => Promise<void>;
    transactionRemoveLine: (rowBarcode: string) => Promise<boolean>;
    clearTransaction: () => Promise<void>;
    getTransactionLineDetail: (
        index: number,
        barcode: string
    ) => Promise<BrokenProductDetailMapModel | undefined>;
    updateTransactionLineDetail: (
        index: number,
        barcode: string,
        reasonId: number,
        description: string,
        isStoreChiefApprove?: boolean,
        sapAIApprove?: boolean
    ) => Promise<void>;
    detailAddPicture: (
        index: number,
        barcode: string,
        picture: CameraCapturedPicture
    ) => Promise<void>;
    detailDeletePicture: (
        index: number,
        barcode: string,
        pictureId: number
    ) => Promise<void>;
    printDoc: (
        name: string,
        tckn: string,
        address: string,
        rfdm: string,
        paymentTypes: PaymentTypeDetailModel[],
        processOverride?: TransactionType
    ) => Promise<boolean>;
    returnCommit: () => Promise<boolean>;
    FindRejectCargoFiche: (props: { orderBarcode: string }) => Promise<void>;
    CompleteRejectCargo: (_props: any) => Promise<void>;
    RemoveRejectCargo: (tempList: ErRejectModel[]) => Promise<void>;
    FindFiche: (query: {
        phone: string;
        startDate?: string;
        endDate?: string;
        barcode: string;
        storeNo: number;
    }) => Promise<void>;
    SearchFiche: (query: {
        voucherNo: string;
        orderNo: string;
        ficheNumber: string;
    }) => Promise<void>;
    InitializeCancellationEvent: (query: any) => Promise<void>;
    CompleteCancelEvent: (validationCode: string) => Promise<void>;
    ErFindFicheResult: (
        ficheNumber: string,
        brokenProduct?: boolean,
        cancelNavigation?: boolean
    ) => Promise<void>;
    ErMakeTransaction: (
        customerGsm?: string,
        customerFullName?: string,
        cancelRouting?: boolean
    ) => Promise<EasyReturnTrasactionModel | undefined>;
    CreateTransaction: (
        customerGsm?: string,
        customerFullName?: string
    ) => Promise<EasyReturnTrasactionModel | undefined>;
    InsertTransactionLine: (
        rowBarcode: string,
        quantity: number,
        transaction: EasyReturnTrasactionModel
    ) => Promise<boolean>;
    ErFindFiche: (filter: {
        orderId?: string;
        activeStore?: string;
        gsm?: string;
        paymentType?: string;
        receiptNumber?: string;
        shippingStore?: string;
        shippingDate?: string;
        barcode?: string;
    }) => Promise<void>;
    CreateBrokenProductDocument: () => Promise<boolean>;
    BrokenProductComplete: () => Promise<void>;
    CheckAUINumber: (transactionId: string, withPhone?: boolean) => Promise<void>;
    CleanTransaction: () => Promise<void>;
    CheckAIState: (model: {
        returnReason: number;
        ficheNumber: string;
        orderDate: string;
    }) => Promise<boolean>;
    sentValidationSms: (
        customerGsm: string,
        transaction: EasyReturnTrasactionModel
    ) => Promise<number>;
    validateSms: (
        validationCode: string,
        smsValidationTemp: number
    ) => Promise<boolean>;
    GetBrokenProductDocumentWithTransactionId: () => Promise<boolean>;
    SendBrokenProductCompletedSms: () => Promise<void>;
    SetErSelectedReturnProductsData: (
        data: {
            barcode: string;
            combo: any;
            quantit: number;
        }[]
    ) => void;
    setSourceData: (source: number) => void;
    setBrokenProductFicheListWithPhone: (props: any) => void;
    setIsBrokenCompleteTrue: () => void;
    sendRejectionSms: (ficheNumber: string, uibNumber: string) => Promise<boolean>;
    sendRejectionApproveSms: (ficheNumber: string, uibNumber: string, approveCode: string) => Promise<boolean>;
    removePhoneMask: (phone: string) => string;
}
export const useEasyReturnService = create<EasyReturnServiceModel>((set, get) => ({
    isLoading: false,
    returnSelectItemPropMap: [],
    currentFiche: undefined,
    currentFicheList: [],
    returnType: 0,
    transaction: undefined,
    findFicheRequest: undefined,
    transactionLineDetails: [],
    isRejectCargoLoading: false,
    omsRejectCargoRes: undefined,
    selectedRejectCargos: [],
    loadingCompleteReject: false,
    erFicheList: [],
    erOrder: [],
    erCurrentFiche: undefined,
    erSelectedReturnProducts: [],
    source: 1,
    brokenProductTemplate: "",
    brokenProductSapFiches: [],
    brokenProductFindResultList: undefined,
    brokenProductFindResult: undefined,
    isBrokenComplete: false,
    selectedPaymentTypes: [],
    cancellationOrderNotFoundPopup: false,
    selectReasonForProduct: async (barcode: string, reason: any) => {
        const { returnSelectItemPropMap, transactionUpdateline } = get();
        let product = returnSelectItemPropMap.find((x) => x.barcode == barcode);

        if (product) {
            product.reason = reason;

            await transactionUpdateline(barcode);
        }
    },
    selectQuantityForProduct: async (barcode: string, quantity: any) => {
        const { returnSelectItemPropMap, transactionUpdateline } = get();
        let product = returnSelectItemPropMap.find((x) => x.barcode == barcode);

        if (product) {
            product.item_quantity = quantity.id;
            await transactionUpdateline(barcode);
        }
    },
    setReturnType: async (rtnType: number = 1) => {
        const { updateTransaction, currentFiche, transaction, returnType } = get();
        set((state) => ({
            ...state,
            returnType: rtnType,
            returnSelectItemPropMap: []
        }));
        if (rtnType === 3) {
            let items = currentFiche?.data.filter((x) => x.isCancel && x.isOmc);
            if (items) {
                var itemDatas: any[] = [];
                for (var i = 0; i < items.length; i++) {
                    let model = items[i];
                    itemDatas.push(model);
                }
                set((state) => ({
                    ...state,
                    returnSelectItemPropMap: itemDatas
                }));
            }
        }

        if (transaction)
            await updateTransaction(returnType + 1, transaction.processTypeSource);
    },
    selectReturneeItem: async (model: GeniusFicheDetailModel) => {
        const { returnSelectItemPropMap, transactionRemoveLine, transactionAddLine } = get();
        var findItem = returnSelectItemPropMap.find(
            (x) => x.barcode === model.barcode
        );

        if (findItem) {
            var findIndex = returnSelectItemPropMap.findIndex(
                (x) => x.barcode === model.barcode
            );

            var r = await transactionRemoveLine(model.barcode);
            if (r) {
                returnSelectItemPropMap.splice(findIndex, 1);
            }
        } else {
            returnSelectItemPropMap.push({
                barcode: model.barcode,
                productName: model.productName,
                sku: model.sku,
                picture: model.picture,
                variantNo: model.variantNo,
                quantity: model.quantity,
                color: model.color,
                size: model.size,
                productDescription: model.productDescription,
                price: model.price,
                returnItemCount: model.returnItemCount,
                returnPrice: model.returnPrice,
                reason: undefined,
                item_quantity: 1,
                isCancel: model.isCancel,
                isOmc: model.isOmc,
                kdv: model.kdv,
            });

            let r = await transactionAddLine(model.barcode);

            // Eğer sunucuya yazma başarısız olursa işlemi geri al
            if (!r) {
                findIndex = returnSelectItemPropMap.findIndex(
                    (x) => x.barcode === model.barcode
                );

                returnSelectItemPropMap.splice(findIndex, 1);
            }
        }
    },
    findFiche: async (isRouting: boolean = true) => {
        const { isLoading, findFicheRequest } = get();
        const MessageBoxService = useMessageBoxService.getState();
        if (isLoading) return;
        try {
            set((state) => ({
                ...state,
                isLoading: true,
                returnSelectItemPropMap: [],
                returnType: 0
            }));

            var tempModel = Object.assign({}, findFicheRequest);
            if (findFicheRequest)
                tempModel.paymentType = findFicheRequest.paymentType;

            if (
                tempModel.gsm === "" &&
                tempModel.barcode === "" &&
                tempModel.shippingStore === "" &&
                tempModel.gsm === ""
            ) {
                MessageBoxService.show(translate("servicesEasyReturnService.voucherNotFound"));
                return;
            }

            tempModel.gsm = tempModel.gsm
                ?.substring(1)
                // @ts-ignoreFlo
                .replace(" ", "")
                .replace("(", ")")
                .replace(")", "");
            var result = await SystemApi.post("Genius/GetByCustomerInfo", tempModel);

            if (result.status === 200) {
                if (result.data.isValid && result.data.state === 1) {
                    if (result.data.model.length < 1) {
                        MessageBoxService.show(
                            translate("servicesEasyReturnService.voucherNotFound")
                        );
                    } else {
                        set((state) => ({
                            ...state,
                            currentFicheList: result.data.model
                        }));
                        RootNavigation.navigate('Ides', { screen: 'FindFicheListScreen' })
                    }
                }
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    checkEasyReturn: async (
        customSource: TransactionSource = TransactionSource.WithDocNumber,
        isRouting: boolean = true
    ) => {
        const { isLoading, makeTransaction, findFicheRequest } = get();
        const MessageBoxService = useMessageBoxService.getState();
        if (isLoading && isRouting) return;
        try {
            if (isRouting)
                set((state) => ({
                    ...state,
                    transaction: undefined,
                }));

            set((state) => ({
                ...state,
                isLoading: false,
                returnSelectItemPropMap: [],
                transactionLineDetails: [],
                returnType: 0
            }));

            if (
                findFicheRequest &&
                (findFicheRequest.receiptNumber === undefined ||
                    findFicheRequest.receiptNumber === "")
            ) {
                MessageBoxService.show(translate("servicesEasyReturnService.voucherNotFound"));
                return;
            }

            var result = await SystemApi.post(
                "Genius/GetByFicheKey",
                findFicheRequest
            );

            if (result.status === 200) {
                if (result.data.isValid && result.data.state === 1) {
                    if (result.data.model.length < 1) {
                        MessageBoxService.show(
                            translate("servicesEasyReturnService.voucherNotFound")
                        );
                    } else {
                        set((state) => ({
                            ...state,
                            currentFiche: result.data.model[0],
                        }));
                        if (isRouting) {
                            await makeTransaction(customSource);
                            //TODO: Actions yap
                            //   Actions.replace("easyReturnProduct");
                        }
                    }
                }
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    makeTransaction: async (source: TransactionSource) => {
        const { currentFiche } = get();
        const AccountService = useAccountService.getState();
        try {
            // Fiş yok ise işlem yapma
            if (!currentFiche) return;

            // model oluştur
            let model = {
                id: 0,
                ficheNumber: currentFiche.ficheKey,
                ficheDate: currentFiche.ficheDate,
                ficheTotal: Number(currentFiche.totalPrice),
                paymentTypeId: 1,

                sellerStore: currentFiche.storeNumber,
                inquiryStore: AccountService.getUserStoreId(),
                inquiryPerson: AccountService.employeeInfo.EfficiencyRecord,

                customerName: currentFiche.customerName,
                customerGsm: currentFiche.customerPhone,

                processType: TransactionType.Return,
                processTypeSource: source,
                status: TransactionState.Draft,
                brokenProductDocumentNo: "",
            };

            // Network işlemleri
            let res = await SystemApi.post("EasyReturnTransaction/Create", model);

            if (res.data.state === FloResultCode.Successfully) {
                res.data.model.easyReturnTrasactionLines = [];
                set((state) => ({
                    ...state,
                    transaction: res.data.model,
                }));
            }
        } catch (err: any) {
        } finally {
        }
    },
    updateTransaction: async (
        type: TransactionType,
        source: TransactionSource = TransactionSource.WithDocNumber
    ) => {
        const { makeTransaction, transaction } = get();
        try {
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            console.trace(
                `Update Transaction with Source : ${source} - Type: ${type}`
            );

            // Bir transaction değil ise önde bir transaction oluştur
            if (!transaction) {
                await makeTransaction(source);
            }

            if (transaction) {
                // bir sunucu modeli oluşturalım
                transaction.processType = type;
                transaction.processTypeSource = source;

                let model: any = {
                    id: transaction.id,
                    ficheNumber: transaction.ficheNumber,
                    ficheDate: transaction.ficheDate,
                    ficheTotal: transaction.ficheTotal,
                    paymentTypeId: transaction.paymentTypeId,

                    sellerStore: transaction.sellerStore,
                    inquiryStore: transaction.inquiryStore,
                    inquiryPerson: transaction.inquiryPerson,

                    customerName: transaction.customerName,
                    customerGsm: transaction.customerGsm,

                    processType: transaction.processType,
                    processTypeSource: transaction.processTypeSource,
                    status: transaction.status,
                };

                let res = await SystemApi.post<
                    ServiceResponseBase<EasyReturnTrasactionModel>
                >("EasyReturnTransaction/UPDATE", model);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    transactionAddLine: async (rowBarcode: string): Promise<boolean> => {
        try {
            const { returnSelectItemPropMap, transaction } = get();
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            let selectedProduct = returnSelectItemPropMap.find(
                (x) => x.barcode == rowBarcode
            );

            if (!selectedProduct) return false;

            if (!transaction) return false;

            let model: EasyReturnTrasactionLineModel = {
                id: 0,
                transactionId: transaction.id,
                barcode: selectedProduct.barcode,
                productName: selectedProduct.productName,
                productDescription: selectedProduct.productDescription,
                sku: selectedProduct.sku,
                quantity: Number(selectedProduct.quantity),
                colour: selectedProduct.color,
                size: selectedProduct.size,
                productPrice: Number(selectedProduct.price),
                productReturnCount: Number(1),
                productAlreadyReturnCount: Number(selectedProduct.returnItemCount),
                productReturnPrice: Number(selectedProduct.returnPrice),
                reasonId: 0,
                picture: "",
            };

            let res = await SystemApi.post<
                ServiceResponseBase<EasyReturnTrasactionLineModel>
            >("EasyReturnTransactionLine/CREATE");

            if (res.data.state === FloResultCode.Successfully) {
                transaction.easyReturnTrasactionLines?.push(res.data.model);
                return true;
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
    transactionUpdateline: async (rowBarcode: string) => {
        const { currentFiche, transaction, returnSelectItemPropMap } = get();
        try {
            if (!currentFiche || !transaction) {
                return;
            }
            // line boş ise devam etme
            if (!transaction.easyReturnTrasactionLines) return;

            var line = transaction.easyReturnTrasactionLines.find(
                (x) => x.barcode === rowBarcode
            );

            if (!line) return;

            line.quantity = Number(
                returnSelectItemPropMap.find((x) => x.barcode === rowBarcode)?.quantity
            );

            line.reasonId = Number(
                returnSelectItemPropMap.find((x) => x.barcode === rowBarcode)?.reason
                    ?.id
            );

            let res = await SystemApi.post<
                ServiceResponseBase<EasyReturnTrasactionLineModel>
            >("EasyReturnTransactionLine/UPDATE");

            if (res.data.state === FloResultCode.Successfully) {
                return;
            }
        } catch (err: any) {
        } finally {
        }
    },
    transactionRemoveLine: async (
        rowBarcode: string
    ): Promise<boolean> => {
        const { currentFiche, transaction } = get();
        try {
            // Eğer geçerli bir fiş üzerinde işlem yapılmıyorsa
            // Transaction boş ise kullanma
            if (!currentFiche || !transaction) {
                return false;
            }
            // line boş ise devam etme
            if (!transaction.easyReturnTrasactionLines) return false;

            var line = transaction.easyReturnTrasactionLines.find(
                (x) => x.barcode === rowBarcode
            );

            // Eğer satır bulunamazsa devam etme
            if (!line) return false;

            // Model oluştur
            let model = {
                id: line.id,
            };

            let result = await SystemApi.post<
                ServiceResponseBase<EasyReturnTrasactionModel>
            >(`EasyReturnTransactionLine/Delete?id=${model.id}`);

            if (result.data.state === FloResultCode.Successfully) {
                let index = transaction.easyReturnTrasactionLines.findIndex(
                    (x) => x.barcode === rowBarcode
                );

                transaction.easyReturnTrasactionLines.splice(index, 1);
                return true;
            }
            return false;
        } catch (err: any) {
            return false;
        } finally {
        }

        return false;
    },
    clearTransaction: async () => {
        set((state) => ({
            ...state,
            transaction: undefined,
            transactionLineDetails: []
        }));
    },
    getTransactionLineDetail: async (index: number, barcode: string) => {
        const { transactionLineDetails, transaction } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            // Detay satırını ara
            let currentDetail = transactionLineDetails!.find(
                (x) => x.index === index && x.barcode === barcode
            );

            // Bir detay satırı var mı ?
            if (currentDetail)
                // Detay satırını geri gönder
                return currentDetail;

            if (transaction?.easyReturnTrasactionLines) {
                // Transaction line
                var line = transaction.easyReturnTrasactionLines.find(
                    (x) => x.barcode === barcode
                );

                // Yeni bir detay sayası oluştur.
                let result = await SystemApi.post("ertld/DetailCreate", {
                    easyReturnTransactionLineId: line?.id,
                    reasonId: 0,
                    description: "",
                    isStoreChiefApprove: false,
                });

                if (result.data.state === FloResultCode.Successfully) {
                    var res = [
                        ...transactionLineDetails,
                        {
                            index,
                            barcode,
                            detail: result.data.model,
                        },
                    ];
                    set((state) => ({
                        ...state,
                        transactionLineDetails: res,
                    }));

                    return res.find((x) => x.index === index && x.barcode === barcode);
                } else {
                    MessageBoxService.show(result.data.message);
                }
            }
            return undefined;
        } catch (err: any) {
            return undefined;
        } finally {
        }
    },

    updateTransactionLineDetail: async (
        index: number,
        barcode: string,
        reasonId: number,
        description: string,
        isStoreChiefApprove?: boolean,
        sapAIApprove?: boolean
    ) => {
        const { getTransactionLineDetail, transactionLineDetails } = get();
        const MessageBoxService = useMessageBoxService.getState();

        try {
            let dline = await getTransactionLineDetail(index, barcode);
            if (dline) {
                let model: TransactionLineDetailModel = {
                    reasonId,
                    description,
                    id: dline?.detail.id,
                    easyReturnTransactionLineId:
                        dline?.detail.easyReturnTransactionLineId,
                    isStoreChiefApprove:
                        isStoreChiefApprove !== undefined && isStoreChiefApprove
                            ? true
                            : false,
                    aIResult: sapAIApprove !== undefined && sapAIApprove ? true : false,
                };

                var result = await SystemApi.post<
                    ServiceResponseBase<TransactionLineDetailModel>
                >("ertld/DetailUpdate", model);

                if (result.data.state === FloResultCode.Successfully) {
                    let lineIndex = transactionLineDetails.findIndex(
                        (x) => x.barcode === barcode && x.index === index
                    );

                    transactionLineDetails[lineIndex].detail.description = description;
                    transactionLineDetails[lineIndex].detail.reasonId = reasonId;
                    set((state) => ({
                        ...state,
                        transactionLineDetails: transactionLineDetails,
                    }));
                } else {
                    MessageBoxService.show(result.data.message);
                    throw new Error(result.data.message);
                }
            }
        } catch (err: any) {
        } finally {
        }
    },
    detailAddPicture: async (
        index: number,
        barcode: string,
        picture: CameraCapturedPicture
    ) => {
        const { transactionLineDetails } = get();
        try {
            let currentDetail = transactionLineDetails[0];

            // Upload the image using the fetch and FormData APIs
            let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects

            let localUri = picture.uri;
            let filename = localUri.split("/").pop();

            if (filename) {
                // Infer the type of the image
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

                //@ts-ignore
                formData.append("detailId", currentDetail.detail.id);
                //@ts-ignore
                formData.append("image", { uri: localUri, name: filename, type });
            }

            var result = await SystemApi.post<ServiceResponseBase<DetailImageModel>>(
                "ertld/ImageCreate",
                formData,
                {
                    headers: { ...{ "content-type": "multipart/form-data" } },
                }
            );

            if (result.data.state === FloResultCode.Successfully) {
                let lineIndex = transactionLineDetails.findIndex(
                    (x) => x.barcode === barcode && x.index === index
                );

                if (!transactionLineDetails[lineIndex].detail.images)
                    transactionLineDetails[lineIndex].detail.images = [];

                transactionLineDetails[lineIndex].detail.images?.push(
                    result.data.model
                );
                set((state) => ({
                    ...state,
                    transactionLineDetails: transactionLineDetails,
                }));
            }
        } catch (err: any) {
        } finally {
        }
    },
    detailDeletePicture: async (
        index: number,
        barcode: string,
        pictureId: number
    ): Promise<any> => {
        const { transactionLineDetails } = get();
        try {
            var result = await SystemApi.post<ServiceResponseBase<DetailImageModel>>(
                `ertld/ImageDelete?id=${pictureId}`
            );

            if (result.data.state === FloResultCode.Successfully) {
                let lineIndex = transactionLineDetails.findIndex(
                    (x) => x.barcode === barcode && x.index === index
                );

                if (
                    transactionLineDetails[lineIndex] !== undefined &&
                    transactionLineDetails[lineIndex].detail !== undefined &&
                    transactionLineDetails[lineIndex].detail.images !== undefined
                ) {
                    let pictureIndex = transactionLineDetails[
                        lineIndex
                    ].detail.images?.findIndex((x: any) => x.id === pictureId);

                    if (pictureIndex !== undefined)
                        transactionLineDetails[lineIndex].detail.images?.splice(
                            pictureIndex,
                            1
                        );
                }
            }
        } catch (err: any) {
        } finally {
        }
    },
    printDoc: async (
        name: string,
        tckn: string,
        address: string,
        rfdm: string,
        paymentTypes: PaymentTypeDetailModel[],
        processOverride?: TransactionType
    ) => {
        const { isLoading, transaction } = get();
        const MessageBoxService = useMessageBoxService.getState();

        if (isLoading) return false;
        try {
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            if (transaction) {
                let trn: any = {
                    id: transaction.id,
                    ficheNumber: transaction.ficheNumber,
                    ficheDate: transaction.ficheDate,
                    ficheTotal: transaction.ficheTotal,
                    paymentTypeId: transaction.paymentTypeId,

                    sellerStore: transaction.sellerStore,
                    inquiryStore: transaction.inquiryStore,
                    inquiryPerson: transaction.inquiryPerson,

                    customerName: transaction.customerName,
                    customerGsm: transaction.customerGsm,

                    processType: processOverride !== undefined ? processOverride : 2,
                    processTypeSource: transaction.processTypeSource,
                    status: transaction.status,
                };

                trn.rfdm = rfdm;
                trn.nameSurname = name;
                trn.tckn = tckn;
                trn.adress = address;

                trn.transactionPaymentTpyes = {
                    transactionId: transaction?.id,
                    paymentTypes: paymentTypes
                        .filter((x: PaymentTypeDetailModel) => x !== undefined)
                        .map((x: PaymentTypeDetailModel) => {
                            return {
                                key: x.key,
                                value: Number(x.value),
                                description: x.description,
                            };
                        }),
                };

                let result = await SystemApi.post<
                    ServiceResponseBase<EasyReturnTrasactionModel>
                >("EasyReturnTransaction/UPDATE", trn);
                if (result.data.state === FloResultCode.Successfully) return true;
                else {
                    MessageBoxService.show(result.data.message);
                }
            }
            return false;
        } catch (err: any) {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    returnCommit: async () => {
        const { transaction } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            let saveUri = "genius/SendReturnProduct?transactionId=" + transaction?.id;

            let result = await SystemApi.post(saveUri);

            if (result.data.state === FloResultCode.Successfully) {
                exPrint.printAsync({
                    html: result.data.model.expenseSlipUrl,
                });

                MessageBoxService.show("Gider pusulası başarı ile oluşturuldu.");
                RootNavigation.goBack()
                return true;
            } else {
                MessageBoxService.show(result.data.message);
            }

            return false;
        } catch (err: any) {
            if (
                err?.response?.status !== 700 &&
                err?.response?.status !== 401 &&
                err?.response?.status !== 409
            )
                MessageBoxService.show(translate("servicesEasyReturnService.errorTryAgain"));
            return false;
        } finally {
        }
    },
    FindRejectCargoFiche: async (props: { orderBarcode: string }) => {
        const MessageBoxService = useMessageBoxService.getState();
        try {
            if (props.orderBarcode === "") {
                MessageBoxService.show("Sipariş Bulunamadı", {
                    type: MessageBoxType.OrderNotFound,
                    customParameters: {
                        description: "Lütfen sipariş numaranızı kontrol ediniz",
                        orderNumber: props.orderBarcode,
                    },
                });
                return;
            }
            set((state) => ({
                ...state,
                isRejectCargoLoading: true,
            }));

            let model = {
                orderId: `${props.orderBarcode}`,
            };

            let result = await SystemApi.post<
                ServiceResponseBase<OmcRejectCargoFindResult>
            >("Genius/GetByOrderId", model);

            if (result.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    omsRejectCargoRes: result.data.model,
                    selectedRejectCargos: []
                }));
                RootNavigation.navigate('Ides', { screen: 'BackCargoScreen' })
            } else {
                if (result.data.message === "Virman bilgisi bulunamadı !") {
                    MessageBoxService.show(translate("messageBox.refundComplete"), {
                        type: MessageBoxType.OrderNotFound,
                        customParameters: {
                            description: translate("messageBox.fitTicket"),
                            type: "2",
                            orderNumber: props.orderBarcode,
                        },
                    });
                    return;
                }
                MessageBoxService.show("Sipariş Bulunamadı", {
                    type: MessageBoxType.OrderNotFound,
                    customParameters: {
                        description: "Lütfen sipariş numaranızı kontrol ediniz",
                        orderNumber: props.orderBarcode,
                    },
                });
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isRejectCargoLoading: false,
            }));
        }
    },
    CompleteRejectCargo: async (_props: any) => {
        const { omsRejectCargoRes, selectedRejectCargos } = get();
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        set((state) => ({
            ...state,
            loadingCompleteReject: true,
        }));
        if (!omsRejectCargoRes) return;

        let model: any[] = [];
        let warehouses: any[] = [];
        selectedRejectCargos.map((x) => {
            let m: any[] = [];

            for (var i = 0; i < x.qty; i++) {
                let item = omsRejectCargoRes?.basketItems.find(
                    (y) =>
                        m.findIndex(
                            (t) =>
                                t.returnNumber === `FD-${y.ecomLineId}` &&
                                t.barcode === y.barcode
                        ) === -1 && y.isEasyReturn
                );

                if (!warehouses.includes(item?.sourceStore))
                    warehouses.push(item?.sourceStore);

                if (item) {
                    m.push({
                        processType: 2,
                        fisKey: omsRejectCargoRes?.order.ficheNumber,
                        returnNumber: `FD-${item.ecomLineId}`,
                        orderId: omsRejectCargoRes?.order.orderId,
                        orderSplitId: omsRejectCargoRes?.order.orderId,
                        sku: item.sku,
                        barcode: item.barcode,
                        quantity: 1,
                        returnStore: AccountService.getUserStoreId(),
                        sendStore: omsRejectCargoRes?.order.storeId.toString(),
                        returnWareHouse: "",
                        sendWareHouse: "",
                        returnDate: `${new Date().toISOString()}`,
                        cancelSource: "-",
                        serviceRequestSource: 2,
                        endDate: `${new Date().toISOString()}`,
                        ProcessUser: AccountService.employeeInfo.EfficiencyRecord, //'09991',
                        EcomBasketItemId: item.ecomLineId.toString(),
                    });
                }
            }

            model = [...model, ...m];
        });

        let validate = true;
        // Validation
        warehouses.map((wh) => {
            omsRejectCargoRes?.basketItems
                .filter((bi) => bi.sourceStore === wh)
                .map((bi) => {
                    if (
                        model.findIndex((m) => m.returnNumber === `FD-${bi.ecomLineId}`) ===
                        -1
                    )
                        validate = false;
                });
        });
        set((state) => ({
            ...state,
            loadingCompleteReject: false,
        }));

        if (!validate) {
            MessageBoxService.show(
                "Bu iade işleminde siparişe ait, okutulmamış ürünler vardır",
                {
                    customParameters: {
                        description: "İade işlemine nasıl devam etmek istersiniz?",
                        type: "10",
                        orderNo: omsRejectCargoRes.order.orderId,
                    },
                    type: MessageBoxType.OrderNotFound,
                    yesButtonEvent: async () => {
                        set((state) => ({
                            ...state,
                            loadingCompleteReject: true,
                        }));
                        await SystemApi.post("EasyReturn/EasyReturnOmcQueueAdd", model)
                            .then((res) => {
                                RootNavigation.navigate('Ides', { screen: 'CancellationScreen' })
                                set((state) => ({
                                    ...state,
                                    omsRejectCargoRes: undefined,
                                    selectedRejectCargos: []
                                }));

                                if (res?.data?.errorList?.length > 0) {
                                    MessageBoxService.show(
                                        "Bu siparişe ait ürün daha önce iade edilmiştir.",
                                        {
                                            type: MessageBoxType.OrderNotFound,
                                        }
                                    );
                                } else {
                                    MessageBoxService.show("İşlem başarıyla tamamlandı.", {
                                        type: MessageBoxType.Standart,
                                    });
                                }
                            })

                            .catch()
                            .finally(() =>
                                set((state) => ({
                                    ...state,
                                    loadingCompleteReject: false,
                                }))
                            );
                    },
                    noButtonEvent: () => {
                        set((state) => ({
                            ...state,
                            isLoading: false,
                            isRejectCargoLoading: false,
                        }));
                    },
                }
            );
        } else {
            set((state) => ({
                ...state,
                loadingCompleteReject: true,
            }));
            await SystemApi.post("EasyReturn/EasyReturnOmcQueueAdd", model)
                .then((res) => {
                    set((state) => ({
                        ...state,
                        omsRejectCargoRes: undefined,
                        selectedRejectCargos: [],
                    }));
                    RootNavigation.navigate('Ides', { screen: 'CancellationScreen' })
                    if (res !== undefined && res?.data?.errorList?.length > 0) {
                        MessageBoxService.show("Bu siparişe ait ürün daha önce iade edilmiştir.", {
                            type: MessageBoxType.OrderNotFound,
                        });
                    } else {
                        MessageBoxService.show("İşlem başarıyla tamamlandı.", {
                            type: MessageBoxType.Standart,
                        });
                    }
                })
                .catch()
                .finally(() => set((state) => ({
                    ...state,
                    loadingCompleteReject: false,
                })));
        }
    },
    RemoveRejectCargo: async (tempList: ErRejectModel[]) => {
        set((state) => ({
            ...state,
            selectedRejectCargos: tempList,
        }));
    },
    FindFiche: async (query: {
        phone: string;
        startDate?: string;
        endDate?: string;
        barcode: string;
        storeNo: number;
    }) => {
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                isLoading: true,
            }));

            let result = await SystemApi.post<ServiceResponseBase<ErFiche[]>>(
                "Cancel/FindDocument",
                query
            );

            if (result.data.isValid) {
                set((state) => ({
                    ...state,
                    erFicheList: result.data.model,
                }));
                RootNavigation.navigate('Ides', { screen: 'FindFicheListScreen' })
            } else {
                MessageBoxService.show(
                    "Girdiğiniz bilgiler ile eşleşen \nFiş / Sipariş bulunamadı"
                );
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    SearchFiche: async (query: {
        voucherNo: string;
        orderNo: string;
        ficheNumber: string;
    }) => {
        const MessageBoxService = useMessageBoxService.getState();

        try {
            set((state) => ({
                ...state,
                isLoading: true,
            }));

            let result = await SystemApi.post<ServiceResponseBase<ErOrder[]>>(
                "Cancel/Search",
                query
            );

            if (result.data.isValid) {
                set((state) => ({
                    ...state,
                    erOrder: result.data.model,
                }));
                RootNavigation.navigate('Ides', { screen: 'CancelList' })
            } else {
                MessageBoxService.show(result.data.message);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    InitializeCancellationEvent: async (query: any) => {
        const MessageBoxService = useMessageBoxService.getState();

        set((state) => ({
            ...state,
            isLoading: true,
        }));

        try {
            let result = await SystemApi.post<ServiceResponseBase<boolean>>(
                "Cancel/InitializeCancel",
                query
            );

            if (result.data.state === FloResultCode.Successfully) {
                RootNavigation.navigate('Ides', { screen: 'CancelListComplete' })
            } else {
                MessageBoxService.show(result.data.message);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    CompleteCancelEvent: async (validationCode: string) => {
        const { erOrder } = get();
        const MessageBoxService = useMessageBoxService.getState();

        set((state) => ({
            ...state,
            isLoading: true,
        }));

        try {
            let result = await SystemApi.post<ServiceResponseBase<boolean>>(
                "Cancel/ApproveSms",
                {
                    orderId: erOrder[0].orderNo,
                    approveCode: validationCode,
                }
            );

            if (result.data.state === FloResultCode.Successfully) {
                MessageBoxService.show(`İade alım işlemi\nbaşarıyla tamamlanmıştır`, {
                    customParameters: { type: "11" },
                    type: MessageBoxType.OrderNotFound,
                    yesButtonEvent: () => {
                        RootNavigation.navigate('Ides', { screen: 'CancellationScreen' })
                    },
                });
            } else {
                MessageBoxService.show(result.data.message);
            }

            // // (result);
        } catch (err: any) {
            // (err);
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    ErFindFicheResult: async (
        ficheNumber: string,
        brokenProduct?: boolean,
        cancelNavigation?: boolean
    ) => {
        const MessageBoxService = useMessageBoxService.getState();
        const AccountService = useAccountService.getState();
        try {
            set((state) => ({
                ...state,
                isLoading: true,
            }));

            let model = {
                orderId: "",
                activeStore: AccountService.getUserStoreId(),
                gsm: "",
                paymentType: "",
                receiptNumber: ficheNumber,
                shippingStore: "",
                shippingDate: "",
                barcode: "",
            };

            var result = await SystemApi.post<ServiceResponseBase<any>>(
                "Genius/GetByFicheKey",
                model
            );

            if (
                result.data?.message !== null &&
                result.data?.message !== undefined &&
                result.data?.message !== "" &&
                result.data.message === "CancelOrderDontCreateAUI"
            ) {
                MessageBoxService.show(
                    "İptal edilen siparişler için İDES kaydı oluşturulamaz",
                    {
                        type: MessageBoxType.Standart,
                    }
                );
                return;
            }

            if (!result.data.model || result.data.model.length < 1) {
                MessageBoxService.show("Sipariş bulunamadı.", {
                    type: MessageBoxType.OrderNotFound,
                });

                return;
            }
            set((state) => ({
                ...state,
                erCurrentFiche: result.data.model[0],
            }));
            const pathName = RootNavigation.getPathName()
            if (!cancelNavigation) {
                if (
                    pathName !== "FicheProductList" &&
                    pathName !== "ReturnFicheProductList"
                )
                    if (brokenProduct) RootNavigation.navigate('Ides', { screen: 'FicheProductList' })
                    else RootNavigation.navigate('Ides', { screen: 'ReturnFicheProductList' })
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    ErMakeTransaction: async (
        customerGsm?: string,
        customerFullName?: string,
        cancelRouting?: boolean
    ) => {
        const { erSelectedReturnProducts, source, CreateTransaction, InsertTransactionLine } = get();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        try {
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            if (erSelectedReturnProducts && source === 2) {
                let v = ApplicationGlobalService.allEasyReturnReasons.find(
                    (x) =>
                        x.name.includes("AUİ") ||
                        x.name.includes("AÜİ") ||
                        x.name.includes("Arızalı ürün")
                );
                if (
                    erSelectedReturnProducts[0] === undefined ||
                    erSelectedReturnProducts[0] === null
                )
                    return;
                erSelectedReturnProducts[0].combo = v;
            }
            let l = erSelectedReturnProducts.filter((x) => x.combo === "");

            if (l.length > 0) throw "Lütfen\nTüm Alanları Eksiksiz Doldurun";

            const trans = await CreateTransaction(customerGsm, customerFullName);
            if (!trans) throw "transaction oluşturulamadı";
            for (var i = 0; i < erSelectedReturnProducts.length; i++) {
                let x = erSelectedReturnProducts[i];
                let res = await InsertTransactionLine(x.barcode, x.quantit, trans);
                if (!res) {
                    throw "Satırlar oluşturulamadı";
                }
            }

            if (!cancelRouting) {
                if (source === 2) RootNavigation.navigate('Ides', { screen: 'BrokenComplete' })
                else RootNavigation.navigate('Ides', { screen: 'ReturnProductFichePaymentResult' })
            }

            return trans;
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    CreateTransaction: async (
        customerGsm?: string,
        customerFullName?: string
    ) => {
        const { erCurrentFiche, source } = get();
        const AccountService = useAccountService.getState();
        if (erCurrentFiche !== undefined && erCurrentFiche !== null) {
            let model = {
                id: 0,
                ficheNumber: erCurrentFiche.ficheKey,
                ficheDate: erCurrentFiche.ficheDate,
                ficheTotal: Number(erCurrentFiche.totalPrice),
                paymentTypeId: 1, // this.source === 2 ? 5 : 1,

                sellerStore: erCurrentFiche.storeNumber,
                inquiryStore: AccountService.getUserStoreId(),
                inquiryPerson: AccountService.employeeInfo.EfficiencyRecord,

                customerName: customerFullName ?? erCurrentFiche.customerName,
                customerGsm:
                    customerGsm !== undefined && customerGsm !== "0"
                        ? customerGsm
                        : erCurrentFiche.customerPhone,

                processType:
                    source === 2 ? TransactionType.Broken : TransactionType.Return,
                processTypeSource: 1,
                status: TransactionState.Draft,
                brokenProductDocumentNo: "",
            };

            // Network işlemleri
            let res = await SystemApi.post<
                ServiceResponseBase<EasyReturnTrasactionModel>
            >("EasyReturnTransaction/Create", model);

            if (res.data.state === FloResultCode.Successfully) {
                res.data.model.easyReturnTrasactionLines = [];
                set((state) => ({
                    ...state,
                    transaction: res.data.model,
                }));
                return res.data.model;
            } else {
                throw res.data.message;
            }
        }
    },
    InsertTransactionLine: async (
        rowBarcode: string,
        quantity: number,
        transaction: EasyReturnTrasactionModel
    ) => {
        const { erSelectedReturnProducts, erCurrentFiche, source } = get();
        try {
            let selectedProduct = erSelectedReturnProducts.find(
                (x) => x.barcode == rowBarcode
            );

            let productPrice = erCurrentFiche?.data.find(
                (x) => x.barcode === rowBarcode
            );

            if (!selectedProduct || !productPrice) return false;
            if (!transaction) return false;

            let model: EasyReturnTrasactionLineModel = {
                id: 0,
                transactionId: transaction.id,
                barcode: selectedProduct.barcode,
                productName: productPrice.productName,
                productDescription: productPrice.productDescription,
                sku: productPrice.sku,
                quantity: Number(productPrice.quantity),
                colour: productPrice.color,
                size: productPrice.size,
                productPrice: Number(productPrice.price),
                productReturnCount: Number(quantity),
                productAlreadyReturnCount: Number(productPrice.returnItemCount),
                productReturnPrice: Number(productPrice.returnPrice),
                kdv: productPrice.kdv,
                // Reason Id ürün listesinde seçilen iade nedeni id si buraya basılır
                reasonId:
                    source === 2
                        ? erSelectedReturnProducts[0]?.combo?.id
                        : erSelectedReturnProducts.find((x) => x.barcode === rowBarcode)
                            ?.combo?.id,
                picture: "",
            };

            let res = await SystemApi.post<
                ServiceResponseBase<EasyReturnTrasactionLineModel>
            >("EasyReturnTransactionLine/Create", model);

            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    transaction: {
                        ...transaction,
                        easyReturnTrasactionLines: [
                            ...(transaction.easyReturnTrasactionLines || []),
                            res.data.model,
                        ],
                    },
                }));
                return true;
            }
            return false;
        } catch (err: any) {
            return false;
        } finally {
        }
    },
    removePhoneMask: (phone: string) => {
        phone = phone.trim();
        phone = phone.replace("(", "");
        phone = phone.replace(")", "");
        while (phone.indexOf(" ") > 0) phone = phone.replace(" ", "");
        phone = phone.startsWith("0") ? phone.substring(1) : phone;
        return phone;
    },
    ErFindFiche: async (filter: {
        orderId?: string;
        activeStore?: string;
        gsm?: string;
        paymentType?: string;
        receiptNumber?: string;
        shippingStore?: string;
        shippingDate?: string;
        barcode?: string;
    }) => {
        const { removePhoneMask } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));
            if (
                filter.gsm === "" &&
                filter.barcode === "" &&
                filter.shippingStore === "" &&
                filter.gsm === "" &&
                filter.receiptNumber === ""
            ) {
                MessageBoxService.show(translate("servicesEasyReturnService.voucherNotFound"));
                return;
            }

            filter.shippingDate = filter.shippingDate || "";

            filter.gsm = removePhoneMask(filter.gsm || "");

            var result = await SystemApi.post("Genius/GetByCustomerInfo", filter);

            if (result.status === 200) {
                if (result.data.isValid && result.data.state === 1) {
                    if (result.data.model.length < 1) {
                        MessageBoxService.show(
                            translate("servicesEasyReturnService.voucherNotFound")
                        );
                    } else {
                        set((state) => ({
                            ...state,
                            currentFicheList: result.data.model
                        }));
                        RootNavigation.navigate('Ides', { screen: 'FicheResult' })
                    }
                }
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    CreateBrokenProductDocument: async () => {
        try {
            const { BrokenProductComplete, transaction } = get();
            const MessageBoxService = useMessageBoxService.getState();

            await BrokenProductComplete();

            // formData.append("detailId", transactionLineDetails[0].detail.id);
            // for (var i = 0; i < images.length; i++) {
            //   if (images[i].Url.includes("base64,")) continue;

            //   let localUri = images[i].Url;
            //   // telefondaki sabit dosyalardan seçili ise
            //   if (images[i].Url.startsWith("ph://")) {
            //     var ml = await MediaLibrary.getAssetInfoAsync(images[i].Url.slice(5));
            //     if (ml.localUri === undefined) continue;
            //     localUri = ml.localUri;
            //   }

            //   let filename = localUri.split("/").pop();

            //   if (filename === undefined) continue;

            //   // Infer the type of the image
            //   let match = /\.(\w+)$/.exec(filename);
            //   let type = match ? `image/${match[1]}` : `image`;

            //   //@ts-ignore
            //   formData.append("image", { uri: localUri, name: filename, type });
            // }
            var result = await SystemApi.post<ServiceResponseBase<any>>(
                `EasyReturnTransaction/CreateBrokenProductDocument?transactionId=${transaction?.id}`
            );

            if (result.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    brokenProductTemplate: result.data.model.brokenProductUrl
                }));
                return true;
            } else {
                MessageBoxService.show(result.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
        }
    },
    BrokenProductComplete: async () => {
        try {
            const { transaction } = get();
            set((state) => ({
                ...state,
                isLoading: true
            }));
            let saveUri = "genius/SendReturnProduct?transactionId=" + transaction?.id;
            let result = await SystemApi.post(saveUri);

            if (result.data.state === FloResultCode.Successfully && transaction) {
                var trans = transaction;
                trans.brokenProductDocumentNo = result.data.model.receipt_Barcode;
                trans.ficheBarcode = result.data.model.ficheBarcode;
                set((state) => ({
                    ...state,
                    transaction: trans
                }));
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    CheckAUINumber: async (transactionId: string, withPhone?: boolean) => {
        try {
            const { ErFindFicheResult } = get();
            const MessageBoxService = useMessageBoxService.getState();
            set((state) => ({
                ...state,
                isLoading: true
            }));
            const phone = withPhone ? transactionId : "0";
            var code = withPhone ? "" : transactionId;
            var ficheNumber = "";

            if (code !== "" && !code.startsWith("M")) {
                ficheNumber = code;
                code = "";
            }

            let result = await SystemApi.post<
                ServiceResponseBase<BrokenProductSearchModel[]>
            >(
                `Genius/BrokenProductSearch?aui=${code}&phone=${phone}&ficheno=${ficheNumber}`
            );

            if (
                result.data.state === FloResultCode.Successfully &&
                result.data.model.length > 0
            ) {
                const pathName = RootNavigation.getPathName()
                if (
                    result.data.model[0].easyReturnTransaction === null ||
                    result.data.model[0].easyReturnTransaction === undefined
                ) {
                    var sapResult = result.data.model.map((x) => x.sapResult);
                    set((state) => ({
                        ...state,
                        brokenProductSapFiches: sapResult
                    }));

                    if (pathName !== "BrokenProductResult")
                        RootNavigation.navigate('Ides', { screen: 'BrokenProductResult' })

                    
                    return;
                } else if (phone !== "" && phone !== "0") {
                    set((state) => ({
                        ...state,
                        brokenProductFindResultList: result.data.model
                    }));
                    if (pathName !== "BrokenProductFicheListWithPhone")
                        RootNavigation.navigate('Ides', { screen: 'BrokenProductFicheListWithPhone' })

                } else {
                    await ErFindFicheResult(
                        result.data.model[0].easyReturnTransaction?.ficheNumber,
                        false,
                        true
                    );
                    set((state) => ({
                        ...state,
                        brokenProductFindResult: result.data.model[0]
                    }));
                    result.data.model[0].easyReturnTransaction.processType =
                        TransactionType.BrokenComplete;
                    set((state) => ({
                        ...state,
                        transaction: result.data.model[0].easyReturnTransaction
                    }));

                    if (pathName !== "BrokenProductResult")
                        RootNavigation.navigate('Ides', { screen: 'BrokenProductResult' })
                }
            } else MessageBoxService.show("Her hangi bir belge bulunamadı");
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    CleanTransaction: async () => {
        set((state) => ({
            ...state,
            brokenProductFindResultList: undefined,
            brokenProductFindResult: undefined,
            brokenProductTemplate: "",
            isBrokenComplete: false,
            selectedPaymentTypes: [],
            erSelectedReturnProducts: [],
            erCurrentFiche: undefined,
            erOrder: [],
            erFicheList: [],
            loadingCompleteReject: false,
            transaction: undefined,
            transactionLineDetails: [],
            cancellationOrderNotFoundPopup: false,
            isRejectCargoLoading: false,
            omsRejectCargoRes: undefined,
            selectedRejectCargos: []
        }));
    },

    CheckAIState: async (model: {
        returnReason: number;
        ficheNumber: string;
        orderDate: string;
    }) => {
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));

            let result = await SystemApi.post<
                ServiceResponseBase<{ isAccepted: boolean }>
            >("EasyReturnTransaction/SapAICheck", model);

            if (result.data.state === FloResultCode.Successfully) {
                return result.data.model.isAccepted;
            } else if (result.data.state === FloResultCode.Exception) {
                MessageBoxService.show(result.data.message);
            }
            return false;
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    sentValidationSms: async (
        customerGsm: string,
        transaction: EasyReturnTrasactionModel
    ) => {
        const MessageBoxService = useMessageBoxService.getState();
        try {
            let res = await SystemApi.post<ServiceResponseBase<any>>(
                "EasyReturnTransaction/SendSms",
                { phone: customerGsm, transactionId: transaction.id }
            );

            if (res.data.state === FloResultCode.Successfully) {
                return res.data.model.id;
            }
            MessageBoxService.show(
                "Doğrulama kodu gönderilemedi, Lütfen daha sonra tekrar deneyin."
            );
            return 0;
        } catch (err: any) {
            return 0;
        } finally {
        }
    },
    validateSms: async (
        validationCode: string,
        smsValidationTemp: number
    ) => {
        const MessageBoxService = useMessageBoxService.getState();
        const { source } = get();
        try {
            let res = await SystemApi.post<ServiceResponseBase<any>>(
                "EasyReturnTransaction/ApproveSms",
                { code: validationCode, id: smsValidationTemp }
            );

            if (res.data.state === FloResultCode.Successfully) {
                MessageBoxService.hide();
                if (source === 2) RootNavigation.navigate("Ides", { screen: "BrokenComplete" });
                else RootNavigation.navigate("Ides", { screen: "ReturnProductFichePaymentResult" });
                return true;
            }
            return false;
        } catch (err: any) {
            return false;
        } finally {
        }
    },
    GetBrokenProductDocumentWithTransactionId: async () => {
        const MessageBoxService = useMessageBoxService.getState();
        const { transaction } = get();
        try {
            let formData = new FormData();
            formData.append("detailId", "11");

            var result = await SystemApi.post<ServiceResponseBase<any>>(
                `EasyReturnTransaction/CreateBrokenProductDocument?transactionId=${transaction?.id}`,
                formData,
                {
                    headers: { ...{ "content-type": "multipart/form-data" } },
                }
            );

            if (result.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    brokenProductTemplate: result.data.model.brokenProductUrl
                }));
                return true;
            } else {
                MessageBoxService.show(result.data.message);
                return false;
            }
        } catch (err: any) {
            MessageBoxService.show(err);
            return false;
        } finally {
        }
    },
    SendBrokenProductCompletedSms: async () => {
        const MessageBoxService = useMessageBoxService.getState();
        const { transaction } = get();
        try {
            let saveUri =
                "genius/SendBrokenProductCompletedSms?transactionId=" + transaction?.id;

            var result = await SystemApi.post(saveUri);

            if (result.data.state === FloResultCode.Successfully)
                MessageBoxService.show("SMS Başarıyla Gönderilmiştir.");
            else MessageBoxService.show(result.data.message);
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    SetErSelectedReturnProductsData: (
        data: {
            barcode: string;
            combo: any;
            quantit: number;
        }[]
    ) => {
        set((state) => ({
            ...state,
            erSelectedReturnProducts: data
        }));
    },
    setSourceData: (source: number) => {
        set((state) => ({
            ...state,
            source: source
        }));
    },
    setBrokenProductFicheListWithPhone: (props: any) => {
        set((state) => ({
            ...state,
            brokenProductFindResult: props
        }));
        var transaction = props.easyReturnTransaction;
        transaction.processType = TransactionType.BrokenComplete;
        set((state) => ({
            ...state,
            transaction: transaction
        }));
    },
    setIsBrokenCompleteTrue: () => {
        set((state) => ({
            ...state,
            isBrokenComplete: true
        }));
    },
    sendRejectionSms: async (ficheNumber: string, uibNumber: string) => {
        const MessageBoxService = useMessageBoxService.getState();
        try {
            let saveUri =
                `EasyReturn/RejectionApprovalSendSms?ficheNumber=${ficheNumber}&uibNumber=${uibNumber}`;
            var result = await SystemApi.post<ServiceResponseBase<boolean>>(saveUri);

            if (result.data.state === FloResultCode.Successfully) {
                return true;
            }
            MessageBoxService.show(result.data.message);
            return false;
        } catch (err: any) {
            return false
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    sendRejectionApproveSms: async (ficheNumber: string, uibNumber: string, approveCode: string) => {
        try {
            let saveUri =
                `EasyReturn/RejectionApprovalApproveSms?ficheNumber=${ficheNumber}&uibNumber=${uibNumber}&approveCode=${approveCode}`;
            var result = await SystemApi.post<ServiceResponseBase<boolean>>(saveUri);
            console.log(result.data)
            if (result.data.state === FloResultCode.Successfully) {
                return true;
            }
            else {
                return false;
            }

        } catch (err: any) {
            return false
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    }
}));

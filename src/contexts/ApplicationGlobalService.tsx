import { tr } from "../helper/localization/lang/_tr";
import { OmsApi, SystemApi, useAccountService } from "../contexts/AccountService";
import {
    FloResultCode,
    ServiceResponseBase,
} from "../core/models/ServiceResponseBase";
import { SapStore } from "../core/models/SapStoreModel";
import { translate } from "../helper/localization/locaizationMain";
import { PaymentType } from "../core/models/PaymentType";
import { EasyReturnReason } from "../core/models/EasyReturnReason";
import { ProductGroup, ProductGroupReason } from "../core/models/ProductGroup";
import { EcomStore } from "../core/models/EcomStoreModel";
import { create } from "zustand";
import { useMessageBoxService } from "../contexts/MessageBoxService";
import { useFcmService } from "../contexts/FcmService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { salesOrgKey } from "../core/StorageKeys";

interface ApplicationGlobalServiceModel {
    cities: any[];
    districts: any[];
    neighborhoods: any[];
    allStore: SapStore[];
    allPaymentTypes: PaymentType[];
    allEasyReturnReasons: EasyReturnReason[];
    productReasons: ProductGroup[];
    productGroupReasons: ProductGroupReason[];
    isShowFullScreenImage: boolean;
    fullScreenImageUri: string;
    omsPrintPdfBarcode: boolean;
    omsManuelCargoConsensus: boolean;
    ecomStoreList: EcomStore[];
    cargoList: any[];
    wrCancelReasons: {
        id: number;
        description: string;
        trDescription: string;
    }[];
    isLoading: boolean;
    selectedStoreId: string;
    getDistrictByCity: (cityId: number) => Promise<any>;
    getNeighborhoodByDistrictId: (districtId: number) => Promise<any>;
    fetchAllStores: () => Promise<SapStore[]>;
    getAllStores: () => Promise<SapStore[]>;
    getAllEcomStoreList: () => Promise<void>;
    getAllPaymentType: () => Promise<void>;
    getAllEasyReasons: () => Promise<void>;
    getAllProductGroup: () => Promise<void>;
    getAllProductGroupReasons: () => Promise<void>;
    getStoreSalesOrganization: (storeId: string) => string | undefined | null;
    getSalesOrganization: () => string | undefined | null;
    getCargoList: () => Promise<void>;
    getWrCancelReasons: () => Promise<void>;
    applicationRestoration: () => Promise<void>;
    getAllCities: () => Promise<void>;
    showFullScreenImage: (uri: string) => void;
    hideFullScreenImage: () => void;
    restoreStorePermission: () => Promise<void>;
    setSelectedStore: (storeId: string) => Promise<void>;
}


export const useApplicationGlobalService = create<ApplicationGlobalServiceModel>((set, get) => ({
    fullScreenImageUri: "",
    isShowFullScreenImage: false,
    cities: [],
    districts: [],
    neighborhoods: [],
    allStore: [],
    ecomStoreList: [],
    allPaymentTypes: [],
    allEasyReturnReasons: [],
    productReasons: [],
    productGroupReasons: [],
    omsPrintPdfBarcode: false,
    omsManuelCargoConsensus: false,
    cargoList: [],
    wrCancelReasons: [],
    isLoading: false,
    selectedStoreId: '',
    showFullScreenImage: (uri: string) => {
        set((state) => ({
            ...state,
            fullScreenImageUri: uri,
            isShowFullScreenImage: true,
        }));
    },
    hideFullScreenImage: () => {
        set((state) => ({
            ...state,
            fullScreenImageUri: "",
            isShowFullScreenImage: false
        }));
    },
    getAllCities: async () => {
        const { cities } = get();
        if (cities.length === 0) {
            let result = await SystemApi.post("city/GetCity");
            if (result.status === 200 && result.data.state === 1) {
                set((state) => ({
                    ...state,
                    cities: result.data.model,
                }));
            }
        }
    },
    getDistrictByCity: async (cityId?: number) => {
        if (!cityId) return;

        let result = await SystemApi.post(
            `city/GetDistrictByCityId/?cityId=${cityId}`
        );
        if (result.status === 200 && result.data.state === 1) {
            set((state) => ({
                ...state,
                districts: result.data.model,
            }));
            return result.data.model;
        }
        set((state) => ({
            ...state,
            districts: []
        }));
        return [];
    },
    getNeighborhoodByDistrictId: async (districtId: number) => {
        let result = await SystemApi.post(
            `city/GetNeighborhoodByDistrictId/?districtId=${districtId}`
        );
        if (result.status === 200 && result.data.state === 1) {
            set((state) => ({
                ...state,
                neighborhoods: result.data.model
            }));
            return result.data.model;
        } else {
            set((state) => ({
                ...state,
                neighborhoods: []
            }));
            return [];
        }
    },
    fetchAllStores: async () => {
        const AccountService = useAccountService.getState()
        let response = await SystemApi.get<ServiceResponseBase<SapStore[]>>(
            "SapStore"
        );
        if (
            response.status === 200 &&
            response.data.state === FloResultCode.Successfully
        ) {
            set((state) => ({
                ...state,
                allStore: response.data.model
            }));
            if (response.data.model.length > 0) {
                const salesOrg = response.data.model.find((x: { werks: string; }) => x.werks === AccountService.getUserStoreId());
                await AsyncStorage.setItem(salesOrgKey, JSON.stringify(salesOrg?.salesOrg))
            }
            return response.data.model;
        }
        return [];
    },
    getAllStores: async () => {
        const { allStore, fetchAllStores } = get();
        if (allStore.length === 0) return await fetchAllStores();
        return allStore;
    },
    getAllEcomStoreList: async () => {
        let response = await SystemApi.get("EcomStore");
        if (
            response.status === 200 &&
            response.data.state === FloResultCode.Successfully
        ) {
            set((state) => ({
                ...state,
                ecomStoreList: response.data.model.data
            }));
        }
    },
    getAllPaymentType: async () => {
        const { allPaymentTypes } = get();
        // Ödeme tipleri istendi

        if (allPaymentTypes.length === 0) {
            let response = await SystemApi.get("PaymentType");
            if (
                response.status === 200 &&
                response.data.state === FloResultCode.Successfully
            ) {
                set((state) => ({
                    ...state,
                    allPaymentTypes: response.data.model
                }));
            }
        }
    },
    getAllEasyReasons: async () => {
        const MessageBoxService = useMessageBoxService.getState();
        // İade nedenleri istendi
        let response = await SystemApi.get("EasyReturn");
        if (
            response.status === 200 &&
            response.data.state === FloResultCode.Successfully
        ) {
            set((state) => ({
                ...state,
                allEasyReturnReasons: response.data.model
            }));
        } else {
            MessageBoxService.show(translate("errorMsgs.unexceptedError"));
        }
    },
    getAllProductGroup: async () => {
        // Ürün grupları istendi
        let response = await SystemApi.post("ProductGroup/Get");
        if (
            response.status === 200 &&
            response.data.state === FloResultCode.Successfully
        ) {
            set((state) => ({
                ...state,
                productReasons: response.data.model
            }));
        }
    },
    getAllProductGroupReasons: async () => {
        // Ürün guruplarına özel iade nedenleri istendi
        let response = await SystemApi.post("ProductGroupReason/Get");

        if (response.data.state === FloResultCode.Successfully) {
            set((state) => ({
                ...state,
                productGroupReasons: response.data.model
            }));
        }
    },
    restoreStorePermission: async () => {
        const AccountService = useAccountService.getState();
        let response = await OmsApi.post(
            `Panel/GetStoreByStoreCode`, {
            storeCode: AccountService.getUserStoreId()
        });

        if (response?.data?.Status === FloResultCode.Successfully && response.data.Data) {
            set((state) => ({
                ...state,
                omsPrintPdfBarcode: response.data.Data.IsPrintBtn,
                omsManuelCargoConsensus: response.data.Data.IsCargoReconcilationManuel
            }));
        }
    },
    getStoreSalesOrganization: (storeId: string) => {
        const { allStore } = get();
        return allStore.find((x: any) => x.werks === storeId)?.salesOrg;
    },
    getSalesOrganization: () => {
        const { getStoreSalesOrganization } = get();
        const AccountService = useAccountService.getState();
        return getStoreSalesOrganization(AccountService.getUserStoreId());
    },
    getCargoList: async () => {
        const { cargoList } = get();
        if (cargoList.length === 0) {
            let response = await OmsApi.post("CargoReconciliation/GetCargoList");
            set((state) => ({
                ...state,
                cargoList: response.data.Data,
            }));
        }
    },
    getWrCancelReasons: async () => {
        const response = await SystemApi.get("Notification/GetCancelReasons");
        var newData = response.data.model.forEach((x: any) => {
            Object.entries(tr.omsErrorReasons).forEach(([key, value]) => {
                if (value.toUpperCase() == x.description.toUpperCase()) {
                    x.trDescription = x.description;
                    x.description = translate("omsErrorReasons." + key);
                }
            });
        });
        set((state) => ({
            ...state,
            wrCancelReasons: newData
        }));
    },
    applicationRestoration: async () => {
        const AccountService = useAccountService.getState();
        const FcmService = useFcmService.getState();
        const { getAllStores, restoreStorePermission, getCargoList, getAllCities, getAllEcomStoreList, getAllEasyReasons, getAllPaymentType, getAllProductGroup, getAllProductGroupReasons, getWrCancelReasons } = get();
        const delay = (time: number) => new Promise((res) => setTimeout(res, time));
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));
            await delay(300);
            if (AccountService.accountInfo?.token) {
                // Uygulama açıldı kendini hazır hale getiriyor...
                var stores = await getAllStores();
                const storeId = AccountService.getUserStoreId();
                var store = stores.find((x) => x.werks === storeId);
                await FcmService.getNoficationPermission(store);

                if (AccountService.isInRole("omc-oms")) {
                    restoreStorePermission();
                    getCargoList();
                }

                if (AccountService.isInRole("omc-basket")) {
                    getAllCities();
                    getAllEcomStoreList();
                }

                if (
                    AccountService.isInRole("omc-easy-return") ||
                    AccountService.isInRole("omc-easy-return-cancel")
                ) {
                    getAllEasyReasons();
                    getAllPaymentType();
                    getAllProductGroup();
                    getAllProductGroupReasons();
                }

                if (AccountService.isInRole("omc-warehouse-request"))
                    getWrCancelReasons();
            }
        } catch (err) {
            AccountService.restore();
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    setSelectedStore: (storeId: string) => {
        set((state) => ({
            ...state,
            selectedStoreId: storeId,
        }));
        return true
    },
}));
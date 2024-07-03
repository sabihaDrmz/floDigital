import { create } from "zustand";
import { SystemApi, useAccountService } from "./AccountService";
import { useMessageBoxService } from "./MessageBoxService";

interface CompletionOfSalesShortageServiceModel {
    isLoading: boolean;
    categoriesData: any;
    productGroupsData: any;
    brandsData: any;
    gendersData: any;
    geniusSalesData: any;
    listData: any;
    reportData: any;
    reasonsData: any;
    storeWorkingPlansData: any;
    getCategories: () => Promise<void>;
    getProductGroups: () => Promise<void>;
    getBrands: () => Promise<void>;
    getGenders: () => Promise<void>;
    getGeniusSales: (startDate: any, endDate: any) => Promise<any>;
    createLackProductOrderList: (itemId: any) => Promise<any>;
    getList: () => Promise<any>;
    getReasons: () => Promise<void>;
    getStoreWorkingPlans: (storeCode: string) => Promise<void>;
    updateStatus: (data: any) => Promise<boolean | undefined>;
    updateStoreWorkingPlan: (data: any) => Promise<boolean | undefined>;
    deleteStoreWorkingPlan: (data: number[]) => Promise<boolean | undefined>;
    createStoreWorkingPlan: (data: any) => Promise<boolean | undefined>;
    getReport: (data: any) => Promise<boolean | undefined>;
};

export const useCompletionOfSalesShortageService = create<CompletionOfSalesShortageServiceModel>((set, get) => ({
    categoriesData: undefined,
    productGroupsData: undefined,
    brandsData: undefined,
    gendersData: undefined,
    geniusSalesData: undefined,
    listData: undefined,
    reportData: undefined,
    reasonsData: undefined,
    storeWorkingPlansData: undefined,
    isLoading: false,
    getCategories: async () => {
        var res = await SystemApi.get("LackProductOrder/GetCategories");
        if (res.data.model !== undefined) {
            set((state) => ({
                ...state,
                categoriesData: res.data.model,
            }));
        } else {
            console.log("hata");
        };
    },
    getProductGroups: async () => {
        var res = await SystemApi.get("LackProductOrder/GetProductGroups");
        if (res.data.model !== undefined) {
            set((state) => ({
                ...state,
                productGroupsData: res.data.model,
            }));
        } else {
            console.log("hata");
        };
    },
    getBrands: async () => {
        var res = await SystemApi.get("LackProductOrder/GetBrands");
        if (res.data.model !== undefined) {
            set((state) => ({
                ...state,
                brandsData: res.data.model,
            }));
        } else {
            console.log("hata");
        };
    },

    getGenders: async () => {
        var res = await SystemApi.get("LackProductOrder/GetGenders");
        if (res.data.model !== undefined) {
            set((state) => ({
                ...state,
                gendersData: res.data.model,
            }));
        } else {
            console.log("hata");
        };
    },
    getGeniusSales: async (startDate: any, endDate: any) => {
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        var res = await SystemApi.post("LackProductOrder/GetGeniusSales", {
            storeId: AccountService.getUserStoreId(),
            StartDate: startDate,
            EndDate: endDate,
            brand: "",
            productGroup: "",
            category: "",
            gender: "",
        });
        if (res.data && !res.data.isValid) {
            MessageBoxService.show(res.data.message);
        }

        if (res.data.model !== undefined) {
            set((state) => ({
                ...state,
                geniusSalesData: res.data.model,
            }));
            return res.data.model;
        } else {
            console.log("hata");
            return undefined
        };
    },
    createLackProductOrderList: async (item: []) => {
        await SystemApi.post("/LackProductOrder/CreateLackProductOrderList",
            item
        );
    },
    getList: async () => {
        const AccountService = useAccountService.getState();

        var res = await SystemApi.post("LackProductOrder/GetList", {
            storeId: AccountService.getUserStoreId(),
            brand: "",
            productGroup: "",
            category: "",
            gender: "",
        });

        if (res.data.model !== undefined) {
            set((state) => ({
                ...state,
                listData: res.data.model,
            }));
        } else {
            console.log("hata");
            return undefined;
        };
    },
    getReasons: async () => {
        var res = await SystemApi.get("LackProductOrder/GetReasons");

        if (res?.data?.model !== undefined) {
            set((state) => ({
                ...state,
                reasonsData: res.data.model,
            }));
        } else {
            console.log("hata");
        };
    },
    updateStatus: async (data: any) => {
        var res = await SystemApi.post(
            "LackProductOrder/UpdateLackProductStatusList",
            data
        );
        if (res && res.data.model !== undefined) {
            if (data.length > 0) {
                return true;
            }
            return undefined;
        } else {
            return false;
        };
    },
    getStoreWorkingPlans: async (storeCode: string) => {
        var res = await SystemApi.get("LackProductOrder/GetStoreWorkingPlans?storeCode=" + storeCode);

        if (res.data.model !== undefined) {
            set((state) => ({
                ...state,
                storeWorkingPlansData: res.data.model,
            }));
            return res.data.model
        } else {
            console.log("hata");
        };
    },
    updateStoreWorkingPlan: async (data: any) => {
        var res = await SystemApi.post("LackProductOrder/UpdateStoreWorkingPlan", data);

        if (res && res.data.model !== undefined) {
            return res.data.model
        } else {
            return false;
        };
    },
    deleteStoreWorkingPlan: async (data: number[]) => {
        var res = await SystemApi.post("LackProductOrder/DeleteStoreWorkingPlan", data);

        if (res && res.data.model !== undefined) {
            return res.data.model
        } else {
            return false;
        };
    },
    createStoreWorkingPlan: async (data: any) => {
        var res = await SystemApi.post("LackProductOrder/CreateStoreWorkingPlan", data);
        if (res && res.data.model !== undefined) {
            return res.data.model
        } else {
            return false;
        };
    },
    getReport: async (data: any) => {
        set((state) => ({
            ...state,
            isLoading: true
        }));
        var res = await SystemApi.post("LackProductOrder/GetLackProductComletionReport", data);
        if (res && res.data.model !== undefined) {
            set((state) => ({
                ...state,
                reportData: res.data.model,
                isLoading: false
            }));
            return res.data.model
        } else {
            set((state) => ({
                ...state,
                isLoading: false
            }));
            return false;
        };
    }


}));

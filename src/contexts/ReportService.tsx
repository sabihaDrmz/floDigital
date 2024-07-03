import { SystemApi } from "./AccountService";
import { create } from "zustand";


interface ReportServiceModel {
    isLoading: boolean;
    salesLossReportData: any;
    floDigitalUsageReportData: any;
    getSalesLossReport: (data: any) => Promise<void>;
    getFloDigitalUsageReport: (data: any) => Promise<void>;
}


export const useReportService = create<ReportServiceModel>((set, get) => ({
    salesLossReportData: undefined,
    floDigitalUsageReportData: undefined,
    isLoading: false,
    getSalesLossReport: async (data: any) => {
        set((state) => ({
            ...state,
            isLoading: true,
        }));
        var res = await SystemApi.post("Report/SalesLoss", data);
        if (res && res.data.model !== undefined) {
            set((state) => ({
                ...state,
                salesLossReportData: res.data.model,
                isLoading: false,
            }));
        } else {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        };
    },
    getFloDigitalUsageReport: async (data: any) => {
        set((state) => ({
            ...state,
            isLoading: true,
        }));
        var res = await SystemApi.post("Report/FloDigitalUsage", data);
        if (res && res.data.model !== undefined) {
            set((state) => ({
                ...state,
                floDigitalUsageReportData: res.data.model,
                isLoading: false,
            }));
        } else {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        };
    },
}));


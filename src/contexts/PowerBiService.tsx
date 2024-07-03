import { ServiceResponseBase } from "../core/models/ServiceResponseBase";
import { ReportInfoModel } from "./model/ReportInfoModel";
import { SystemApi } from "./AccountService";
import { create } from "zustand";
import { useAccountService } from "./AccountService";
import { useMessageBoxService } from "./MessageBoxService";
import * as RootNavigation from "../core/RootNavigation"

interface PowerBiServiceModel {
    loadReports: () => Promise<ReportInfoModel[] | undefined>;
    getReportEmbeddedInfo: (
        reportId: any
    ) => Promise<ReportInfoModel | undefined>;
}

export const usePowerBiService = create<PowerBiServiceModel>((set, get) => ({
    loadReports: async () => {
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            var result = await SystemApi.get<ServiceResponseBase<ReportInfoModel[]>>(
                "PowerBI/ReportList?expenseCentre=" + AccountService.employeeInfo.ExpenseLocationCode
            );

            if (!result.data.isValid) {
                MessageBoxService.show("Rapor bilgileri alınamadı.");
                return;
            }
            return result.data.model;
        } catch (err) {
        } finally {
        }
    },
    getReportEmbeddedInfo: async (reportId: any) => {
        try {
            const MessageBoxService = useMessageBoxService.getState();

            var result = await SystemApi.get<ServiceResponseBase<ReportInfoModel>>(
                "PowerBI/GetReport?reportId=" + reportId
            );

            if (!result.data.isValid) {
                MessageBoxService.show("Rapor bilgileri alınamadı.", {
                    yesButtonEvent: () => RootNavigation.goBack()
                });
                return;
            }
            return result.data.model;
        } catch (err) {
        } finally {
        }
    }
}));

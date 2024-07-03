import { SystemApi } from "./AccountService";
import { SelfCheckOutModel } from "../contexts/model/SelfCheckOutModel";
import {
    FloResultCode,
    ServiceResponseBase,
} from "../core/models/ServiceResponseBase";
import { create } from "zustand";
import { useAccountService } from "./AccountService";
import { useMessageBoxService } from "./MessageBoxService";
import * as RootNavigation from "../core/RootNavigation"

interface SelfCheckOutServiceModel {
    selfCheckOut: SelfCheckOutModel | undefined | null;
    isLoading: boolean;
    qrCode: string;
    getOrders: (qrCode: string) => Promise<void>;
    approve: () => Promise<boolean | undefined>;
    reject: () => Promise<boolean | undefined>;
}

export const useSelfCheckOutService = create<SelfCheckOutServiceModel>((set, get) => ({
    isLoading: false,
    qrCode: "",
    selfCheckOut: undefined,
    getOrders: async (qrCode: string) => {
        const { isLoading } = get();
        const AccountService = useAccountService.getState();
        const MessageBox = useMessageBoxService.getState();
        try {
            if (isLoading) return;

            set((state) => ({
                ...state,
                isLoading: true,
                qrCode: qrCode
            }));
            var model = {
                qrcode: qrCode,
                staffInfo: [
                    {
                        name: AccountService.employeeInfo.FirstName,
                        lastname: AccountService.employeeInfo.LastName,
                        email: AccountService.employeeInfo.Email,
                        id: AccountService.employeeInfo.EfficiencyRecord,
                        sapStoreCode: AccountService.getUserStoreId(),
                    },
                ],
            };

            const uri = `SelfCheck/GetSelfCheck`;
            var res = await SystemApi.post<ServiceResponseBase<SelfCheckOutModel>>(
                uri,
                model
            );

            set((state) => ({
                ...state,
                isLoading: false,
            }));
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    selfCheckOut: res.data.model,
                }));
                RootNavigation.navigate("SelfCheckout", { screen: "SelfCheckOutScreen" });
            } else {
                MessageBox.show(res.data.message);
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    approve: async () => {
        const { isLoading, qrCode } = get();
        const AccountService = useAccountService.getState();
        const MessageBox = useMessageBoxService.getState();
        try {
            if (isLoading) return;
            set((state) => ({
                ...state,
                isLoading: true,
            }));

            var model = {
                qrcode: qrCode,
                staffInfo: [
                    {
                        name: AccountService.employeeInfo.FirstName,
                        lastname: AccountService.employeeInfo.LastName,
                        email: AccountService.employeeInfo.Email,
                        id: AccountService.employeeInfo.EfficiencyRecord,
                        sapStoreCode: AccountService.getUserStoreId(),
                    },
                ],
            };

            const uri = `SelfCheck/SelfCheckApprove`;
            var res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);

            set((state) => ({
                ...state,
                isLoading: false,
            }));

            if (res.data.state === FloResultCode.Successfully) {
                return true;
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },

    reject: async () => {
        const { isLoading, qrCode } = get();
        const AccountService = useAccountService.getState();
        const MessageBox = useMessageBoxService.getState();
        try {
            if (isLoading) return;
            set((state) => ({
                ...state,
                isLoading: true,
            }));

            var model = {
                qrcode: qrCode,
                staffInfo: [
                    {
                        name: AccountService.employeeInfo.FirstName,
                        lastname: AccountService.employeeInfo.LastName,
                        email: AccountService.employeeInfo.Email,
                        id: AccountService.employeeInfo.EfficiencyRecord,
                        sapStoreCode: AccountService.getUserStoreId(),
                    },
                ],
            };

            const uri = `SelfCheck/SelfCheckReject`;
            var res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            set((state) => ({
                ...state,
                isLoading: false,
            }));

            if (res.data.state === FloResultCode.Successfully) {
                return true;
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
}));

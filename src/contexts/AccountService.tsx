import linq from "linq";
import { AccountTokenModel } from "./model/AccountTokenModel";
import { Role } from "./model/RoleModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountInfoKey, accountUserNameKey, accountUserRememberNameKey, appIntroKey, storeIdKey } from "../core/StorageKeys";
import { Platform } from "react-native";
import { AccountLoginResult } from "./model/AccountLoginResult";
import axios from "axios";
import * as Device from "expo-device";
import RNExitApp from "react-native-exit-app";
import { create } from "zustand";
import * as RootNavigation from "../core/RootNavigation"
import { useMessageBoxService } from "./MessageBoxService";
import { translate } from "../helper/localization/locaizationMain";
import { useApplicationGlobalService } from "./ApplicationGlobalService";

export interface AccountServiceModel {
    organizationCode?: string;
    accountInfo?: AccountTokenModel;
    employeeInfo: any;
    userRoles: Role[];
    isLoading: boolean;
    testMode: boolean;
    userExtensionInfo?: any;
    changeTestMode: (mode: boolean) => void;
    login: (username: string, password: string) => Promise<void>;
    loginWithRefreshToken: () => Promise<void>;
    logout: () => Promise<void>;
    completeIntro: () => Promise<void>;
    isInRole: (checkRole: string) => boolean;
    getUserStoreId: () => string;
    restore: () => Promise<void>;
    getUserStoreWarehouseId: () => string;
    updateUserInfo: (result: any) => Promise<void>;
    LogDevice: (employeeInfo: any) => Promise<void>;
    changeProccessModal: (value: any) => Promise<void>;
    proccessModal: boolean;
}

const roles = [
    "omc-home",
    "omc-document",
    "omc-find-product",
    "omc-help",
    "omc-other",
    "omc-basket",
    "omc-basket-pos",
    "omc-crm",
    "omc-crm2",
    "omc-printer-config",
    "omc-easy-return",
    "omc-test-mode",
    "omc-help-links",
    "omc-oms-store-chief",
    "omc-oms",
    "omc-store-chief",
    "omc-easy-return-cancel",
    "omc-warehouse-request",
    "omc-easy-return-ides",
    "omc-rapor",
    "omc-self-check-out",
    "omc-depo"
];

export const SystemApi = axios.create({
    baseURL: "https://digital.flo.com.tr/sys/api",
});

export const CrmApi = axios.create({
    baseURL: "https://digital.flo.com.tr/crm/api",
});

export const OmsApi = axios.create({
    baseURL: "https://digital.flo.com.tr/oms/api",
});

export const OmsPdfApi = axios.create({
    baseURL: "https://digital.flo.com.tr/omspdf/api",
});

export const useAccountService = create<AccountServiceModel>((set, get) => ({
    organizationCode: "",
    accountInfo: undefined,
    userRoles: [],
    employeeInfo: undefined,
    userExtensionInfo: undefined,
    isLoading: false,
    testMode: true,
    proccessModal: false,
    getUserStoreId: () => {
        const { employeeInfo } = get();
        if (
            employeeInfo === null ||
            employeeInfo === undefined ||
            employeeInfo.ExpenseLocationCode === null ||
            employeeInfo.ExpenseLocationCode === undefined
        )
            return undefined;
        else return employeeInfo.ExpenseLocationCode.substring(3);
    },
    getUserStoreWarehouseId: () => {
        const { userExtensionInfo } = get();
        if (
            userExtensionInfo === null ||
            userExtensionInfo === undefined ||
            !Array.isArray(userExtensionInfo) ||
            userExtensionInfo.length === 0 || 
            !userExtensionInfo.every(item => item.StoreWarehouseId !== null && item.StoreWarehouseId !== undefined)
        )
            return undefined;
            else return  userExtensionInfo.map(item => item.StoreWarehouseId);
    },
    restore: async () => {
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        let userInfoJson = await AsyncStorage.getItem(accountInfoKey);
        let appIntroComple = await AsyncStorage.getItem(appIntroKey);
        let applicationTestMode = await AsyncStorage.getItem("@Keys.testModeAllow");

        set((state) => ({
            ...state,
            testMode: applicationTestMode === "open"
        }));

        const baseUrl =
            applicationTestMode === "open"
                ? "http://10.0.60.12:5902/"
                : "https://digital.flo.com.tr/";

        SystemApi.defaults.baseURL = `${baseUrl}sys/api`;
        OmsApi.defaults.baseURL = `${baseUrl}oms/api`;
        CrmApi.defaults.baseURL = `${baseUrl}crm/api`;
        OmsPdfApi.defaults.baseURL = `${baseUrl}omspdf/api`;

        if (userInfoJson) {
            var userInfo = JSON.parse(userInfoJson);
            set((state) => ({
                ...state,
                accountInfo: userInfo.accInfo,
                employeeInfo: userInfo.employeeInfo,
                userExtensionInfo: userInfo.userExtensionInfo,
                userRoles: userInfo.roles,
            }));

            await AsyncStorage.setItem(
                storeIdKey,
                userInfo.employeeInfo.ExpenseLocationCode.substring(3)
            );
            ApplicationGlobalService.applicationRestoration();
            if (
                (!appIntroComple || appIntroComple !== "ok") &&
                Platform.OS != "web"
            ) {
                RootNavigation.navigate("Intro");
            } else {
                RootNavigation.navigate("Main");
            }
        } else {
            RootNavigation.navigate("Login");
        }
    },
    login: async (username: string, password: string): Promise<void> => {
        const { updateUserInfo, restore, LogDevice } = get();
        const MessageBoxService = useMessageBoxService.getState();
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));
            var model = {
                username: username,
                password: password,
            };

            var result = await SystemApi.post<AccountLoginResult>(
                `User/LoginNew`,
                model
            );

            if (result.data && result.data.isValid) {
                await updateUserInfo(result);
                await restore();
                var { FirstName, LastName } = JSON.parse(result.data.employeeInfo);
                await AsyncStorage.setItem(accountUserRememberNameKey, FirstName + " " + LastName)
                await AsyncStorage.setItem(accountUserNameKey, username);
                //Cihaz kaydı
                if (Platform.OS !== "web")
                    await LogDevice(JSON.parse(result.data.employeeInfo));
            } else {
                MessageBoxService.show("Kullanıcı adı veya parola hatalı");
            }
        } catch (err) {
            console.log(err);
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    loginWithRefreshToken: async (): Promise<void> => {
        const { updateUserInfo } = get();
        try {
            const result = await SystemApi.post("User/LoginWithRefreshTokenNew");
            if (result && result.data && result.data.isValid) {
                await updateUserInfo(result);
            }
        } catch (err) {
            console.log(err);
        }
    },
    updateUserInfo: async (result: any): Promise<void> => {
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const accountInfo: AccountTokenModel = {
            token: result.data.token,
            refreshToken: result.data.refreshToken,
            cid: result.data.clientId,
        };
        set((state) => ({
            ...state,
            accountInfo: accountInfo,
            employeeInfo: JSON.parse(result.data.employeeInfo),
            userExtensionInfo: result.data.userExtensionInfo ? JSON.parse(result.data.userExtensionInfo) : undefined,
        }));
        await AsyncStorage.setItem(
            storeIdKey,
            JSON.parse(result.data.employeeInfo).ExpenseLocationCode.substring(3)
        );

        const rr: Role[] = [];

        result.data.roles.split("|").map((roleRaw: string) => {
            const roleParsed = roleRaw.split(";");
            if (linq.from(roles).any((x) => x == roleParsed[0]))
                rr.push({
                    roleName: roleParsed[0],
                    permissions: {
                        CanAdd: roleParsed[1] == "1",
                        CanDelete: roleParsed[2] == "1",
                        CanRead: roleParsed[3] == "1",
                        CanUpdate: roleParsed[4] == "1",
                    },
                });
        });
        set((state) => ({
            ...state,
            userRoles: rr,
        }));

        let orgCode = result?.data?.organizationCode ? JSON.parse(result.data.organizationCode).toString() : ""     
        await AsyncStorage.setItem("organizationCode", orgCode)
        set((state) => ({
            ...state,
            organizationCode: orgCode,
        }));

        await AsyncStorage.setItem(
            accountInfoKey,
            JSON.stringify({
                accInfo: accountInfo,
                employeeInfo: JSON.parse(result.data.employeeInfo),
                roles: rr,
                userExtensionInfo: result.data.userExtensionInfo ? JSON.parse(result.data.userExtensionInfo) : undefined,
                organizationCode: orgCode
            })
        );
    },
    logout: async (): Promise<void> => {
        set((state) => ({
            ...state,
            accountInfo: undefined,
            employeeInfo: undefined,
            userExtensionInfo: undefined,
            userRoles: []
        }));
        await AsyncStorage.removeItem(accountInfoKey);
        setTimeout(() => RootNavigation.navigate('Login'), 200);
    },
    completeIntro: async () => {
        await AsyncStorage.setItem(appIntroKey, "ok");
        RootNavigation.navigate('Main')
    },
    isInRole: (r: string) => {
        const { userRoles } = get();
        let role = userRoles.findIndex(
            (x) => x.roleName === r && x.permissions.CanRead
        );
        return role !== -1;
    },
    changeTestMode: (mode: boolean) => {
        const MessageBoxService = useMessageBoxService.getState();
        set((state) => ({
            ...state,
            testMode: mode,
        }));
        AsyncStorage.setItem("@Keys.testModeAllow", mode ? "open" : "close");

        MessageBoxService.show(
            translate("servicesApplicationGlobalService.reopenTheApp"),
            {
                yesButtonEvent: () => {
                    Platform.OS === "web"
                        ? window.location.reload()
                        : RNExitApp.exitApp();
                },
            }
        );
    },
    LogDevice: async (employeeInfo: any) => {
        var rooted = await Device.isRootedExperimentalAsync();
        let deviceBrokenModel = {
            employeeId: employeeInfo.EfficiencyRecord || "",
            employeeName: employeeInfo?.FirstName,
            rooted,
            brand: Device.brand || "",
            designName: Device.designName || "",
            deviceName: Device.deviceName || "",
            isEmulator: !Device.isDevice,
            yearClass: Device.deviceYearClass || "",
            manufacturer: Device.manufacturer || "",
            modelName: Device.modelName || "",
            osName: Device.osName || "",
            osVersion: Device.osVersion || "",
        };

        SystemApi.post("App/LogDevice", deviceBrokenModel);
    },
    changeProccessModal: async (value: any) => {
        console.log('value:', value)
        set((state) => ({
            ...state,
            proccessModal: value
        }))
    }
}));
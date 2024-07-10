import { AppState, Platform } from "react-native";
//TODO: EXPO Device
// import * as Device from "expo-device";
import DeviceInfo from "react-native-device-info";
// TODO: EXPO exNotification
// import * as exNotification from "expo-notifications";
import { toOrganization } from "../core/Util";
import {
    FloResultCode,
    ServiceResponseBase,
} from "../core/models/ServiceResponseBase";
import { create } from 'zustand'
import { SystemApi, useAccountService } from "./AccountService";

type Badge = {
    totalBadgeCount?: number;
    subBadgeCount?: any[];
};

type Notify = {
    actionType: number;
    appId?: any;
    body: string;
    createDate: Date;
    dataJson?: any;
    fcmMessageId: string;
    id: number;
    isRead: boolean;
    readDate: Date;
    sendTo: string;
    sendType: number;
    title: string;
};

interface FcmServiceModel {
    showingIds: string[];
    isConfigured: boolean;
    lastNotificationId: string;
    notification: {
        title: string;
        body: string;
    };
    currentShowingId: string;
    badgeCnt: number;
    subBadgeCount: any[];
    notifications: Notify[];
    readedNotificationIds: string[];
    getNoficationPermission: (store: any) => Promise<void>;
    readSingle: (notificationId: string) => Promise<void>;
    readBadgeCount: () => Promise<void>;
    getNotifications: (currentPage: number, appId: string) => Promise<void>;
    registerFloDigitalByDevice: (token: string, store: any) => Promise<void>;
    configureBackgroundMessage: (remoteMessage: any) => Promise<void>;
    updateShowingList: (messageId: string) => Promise<void>;
    emptyShowingList: () => void;
}

export const useFcmService = create<FcmServiceModel>((set, get) => ({
    showingIds: [],
    isConfigured: false,
    lastNotificationId: "",
    notification: { title: "", body: "" },
    currentShowingId: "-",
    badgeCnt: 0,
    subBadgeCount: [],
    readedNotificationIds: [],
    notifications: [],
    getNoficationPermission: async (store: any) => {
        try {
            /*
            const { isConfigured, registerFloDigitalByDevice, readBadgeCount } = get();
            if (isConfigured || Platform.OS === "web") return;
            let token = "";

            if (!DeviceInfo.isEmulator()) {
                const { status: existingStatus } =
                    await exNotification.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== "granted") {
                    const { status } = await exNotification.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== "granted") {
                    alert("Failed to get push token for push notification!");
                    return;
                }

                token = (
                    await exNotification.getExpoPushTokenAsync({
                        experienceId: "@fatih.kose/FloDigital",
                    })
                ).data;
            }

            let permission = await exNotification.getPermissionsAsync();

            if (!permission.granted) {
                if (permission.canAskAgain)
                    permission = await exNotification.requestPermissionsAsync();

                if (!permission.granted) {
                    return;
                }
            }

            set((state) => ({
                ...state,
                isConfigured: true
            }));
            await registerFloDigitalByDevice(token, store);
            await readBadgeCount();

            if (Platform.OS === "android") {
                await exNotification.setNotificationChannelAsync("OMS", {
                    importance: exNotification.AndroidImportance.HIGH,
                    enableVibrate: true,
                    name: "OMS",
                    showBadge: true,
                    bypassDnd: true,
                    lockscreenVisibility:
                        exNotification.AndroidNotificationVisibility.PUBLIC,
                    vibrationPattern: [0, 250, 250, 250],
                });

                await exNotification.setNotificationChannelAsync("OMC_WR", {
                    importance: exNotification.AndroidImportance.HIGH,
                    enableVibrate: true,
                    name: "OMC_WR",
                    showBadge: true,
                    bypassDnd: true,
                    lockscreenVisibility:
                        exNotification.AndroidNotificationVisibility.PUBLIC,
                    vibrationPattern: [0, 250, 250, 250],
                });

                await exNotification.setNotificationChannelAsync("default", {
                    importance: exNotification.AndroidImportance.HIGH,
                    enableVibrate: true,
                    name: "OMC",
                    showBadge: true,
                    bypassDnd: true,
                    lockscreenVisibility:
                        exNotification.AndroidNotificationVisibility.PUBLIC,
                    vibrationPattern: [0, 250, 250, 250],
                });

                await exNotification.setNotificationChannelAsync("OMC", {
                    importance: exNotification.AndroidImportance.HIGH,
                    enableVibrate: true,
                    name: "OMC",
                    showBadge: true,
                    bypassDnd: true,
                    lockscreenVisibility:
                        exNotification.AndroidNotificationVisibility.PUBLIC,
                    vibrationPattern: [0, 250, 250, 250],
                });

                await exNotification.setNotificationChannelAsync("CRM", {
                    importance: exNotification.AndroidImportance.HIGH,
                    enableVibrate: true,
                    name: "CRM",
                    showBadge: true,
                    bypassDnd: true,
                    lockscreenVisibility:
                        exNotification.AndroidNotificationVisibility.PUBLIC,
                    vibrationPattern: [0, 250, 250, 250],
                });

                await exNotification.setNotificationChannelAsync("ECOM_SC", {
                    importance: exNotification.AndroidImportance.HIGH,
                    enableVibrate: true,
                    name: "ECOM_SC",
                    showBadge: true,
                    bypassDnd: true,
                    lockscreenVisibility:
                        exNotification.AndroidNotificationVisibility.PUBLIC,
                    vibrationPattern: [0, 250, 250, 250],
                });
            }
            */
        } catch (err) { }
    },
    updateShowingList: async (messageId: string) => {
        const { showingIds } = get();
        set((state) => ({
            ...state,
            showingIds: [messageId, ...showingIds].slice(0, 20)
        }));
    },
    emptyShowingList: () => {
        set((state) => ({
            ...state,
            showingIds: []
        }));
    },
    configureBackgroundMessage: async (remoteMessage: any) => {
        const AccountService = useAccountService.getState();
        if (
            remoteMessage.data?.actionType &&
            Number(remoteMessage.data?.actionType) === 2
        ) {
            AccountService.logout();
            return;
        }
    },
    registerFloDigitalByDevice: async (token: string, store: any) => {
        if (Platform.OS === "web") return;
        const AccountService = useAccountService.getState();
        const storeId = AccountService.getUserStoreId();
        await SystemApi.post("Notification/RegisterDeviceAdd", {
            employeeId: AccountService.employeeInfo.EfficiencyRecord || "-1",
            storeId: storeId,
            organizationId: toOrganization(
                AccountService.employeeInfo.EfficiencyRecord,
                store
            ),
            deviceKey: token === "" ? "emulator" : token,
        });
    },
    getNotifications: async (currentPage: number, appId: string) => {
        const { readBadgeCount, notifications } = get();
        const AccountService = useAccountService.getState();

        let uri =
            "Notification/Get" +
            `?page=${currentPage}&size=20&employeeId=${AccountService.employeeInfo.EfficiencyRecord}&appId=${appId}`;

        const result = await SystemApi.get<ServiceResponseBase<Notify[]>>(uri);

        if (result.data.state === FloResultCode.Successfully) {
            if (currentPage === 1)
                set((state) => ({
                    ...state,
                    notifications: result.data.model
                }));
            else if (currentPage > 1)
                set((state) => ({
                    ...state,
                    notifications: [...notifications, ...result.data.model]
                }));
        }

        await readBadgeCount();
    },
    readBadgeCount: async () => {
        const result = await SystemApi.get<ServiceResponseBase<any>>(
            "Notification/GetBadgeByEmploeeId"
        );
        var localBadgeCnt = result.data?.model?.totalBadgeCount;
        set((state) => ({
            ...state,
            badgeCnt: result.data?.model?.totalBadgeCount,
            subBadgeCount: result.data?.model?.subBadgeCount
        }));

        if (result.data?.model?.totalBadgeCount < 0) {
            set((state) => ({
                ...state,
                badgeCnt: 0,
            }));
            localBadgeCnt = 0;
        }

        if (result.data?.model?.subBadgeCount === undefined)
            set((state) => ({
                ...state,
                subBadgeCount: []
            }));

       // if (Platform.OS === "ios") exNotification.setBadgeCountAsync(localBadgeCnt);
    },
    readSingle: async (notificationId: string) => {
        const { readedNotificationIds, readBadgeCount } = get();
        if (readedNotificationIds.includes(notificationId)) return;
        set((state) => ({
            ...state,
            readedNotificationIds: [...readedNotificationIds, notificationId]
        }));

        SystemApi.get("Notification/NotificationReadById?id=" + notificationId);
        await readBadgeCount();
    },
}));

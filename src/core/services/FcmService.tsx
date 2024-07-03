import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { Platform } from "react-native";
import AccountService from "./AccountService";
import axios from "axios";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import { toOrganization } from "../Util";
import {
  FloResultCode,
  ServiceResponseBase,
} from "../models/ServiceResponseBase";
import ApplicationGlobalService from "./ApplicationGlobalService";
import { notificationEvent } from "../libraries/FcmFroground";
import * as exNotification from "expo-notifications";
import * as Device from "expo-device";
import { FloDigitalErrorParse } from "../HttpModule";
class FcmService {
  constructor() {
    makeAutoObservable(this);
  }

  @observable showingIds: string[] = [];
  @observable isConfigured: boolean = false;
  @observable lastNotificationId: string = "";
  @observable notification: { title: string; body: string } = {
    title: "",
    body: "",
  };
  @observable currentShowingId: string = "-";
  @observable badgeCnt: number = 0;
  @observable subBadgeCount: any[] = [];
  @action getNoficationPermission = async () => {
    try {
      if (this.isConfigured || Platform.OS === "web") return;

      let token = "";
      if (Device.isDevice) {
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

      // if (Platform.OS === "ios") {
      let permission = await exNotification.getPermissionsAsync();

      if (!permission.granted) {
        if (permission.canAskAgain)
          permission = await exNotification.requestPermissionsAsync();

        if (!permission.granted) {
          return;
        }
      }
      await ApplicationGlobalService.fetchAllStores();
      this.isConfigured = true;

      this.registerFloDigitalByDevice(token);
      await this.readBadgeCount();

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
      }
    } catch (err) {
      if (ApplicationGlobalService.testMode) {
        alert(err);
      }
    }
  };

  @observable waitingRemoteRouting?: any;

  @action async updateShowingList(messageId: string) {
    this.showingIds = [messageId, ...this.showingIds].slice(0, 20);
  }

  @action configureBackgroundMessage = async (
    remoteMessage: any //FirebaseMessagingTypes.RemoteMessage
  ) => {
    if (
      remoteMessage.data?.actionType &&
      Number(remoteMessage.data?.actionType) === ActionType.LogOut
    ) {
      AccountService.logOut();
      return;
    }

    notificationEvent(remoteMessage.data);
  };

  @action registerFloDigitalByDevice = async (token: string) => {
    try {
      if (Platform.OS === "web") return;

      let result = await axios.post(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "Notification/RegisterDeviceAdd",
        {
          employeeId: AccountService.employeeInfo.EfficiencyRecord || "-1",
          storeId: AccountService.getUserStoreId(),
          organizationId: toOrganization(
            AccountService.employeeInfo.EfficiencyRecord
          ),
          deviceKey: token === "" ? "emulator" : token,
        },
        { headers: AccountService.tokenizeHeader() }
      );
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @observable notifications: Notify[] = [];
  @action async getNotifications(currentPage: number, appId: string) {
    try {
      let uri =
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
        "Notification/Get" +
        `?page=${currentPage}&size=20&employeeId=${AccountService.employeeInfo.EfficiencyRecord}&appId=${appId}`;

      let result = await axios.get<ServiceResponseBase<Notify[]>>(uri, {
        headers: AccountService.tokenizeHeader(),
      });
      console.log(result.data);

      if (result.data.state === FloResultCode.Successfully) {
        if (currentPage === 1)
          runInAction(() => (this.notifications = result.data.model));
        else if (currentPage > 1)
          runInAction(
            () =>
              (this.notifications = [
                ...this.notifications,
                ...result.data.model,
              ])
          );

        await this.readBadgeCount();
        if (Platform.OS === "android") {
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  }

  @action async readBadgeCount() {
    try {
      let result = await axios.get<ServiceResponseBase<any>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "Notification/GetBadgeByEmploeeId",
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      let oldCount = this.badgeCnt;
      this.badgeCnt = result.data?.model?.totalBadgeCount;
      this.subBadgeCount = result.data?.model?.subBadgeCount;
      if (this.badgeCnt < 0) this.badgeCnt = 0;

      if (this.subBadgeCount === undefined) this.subBadgeCount = [];

      if (Platform.OS === "ios")
        exNotification.setBadgeCountAsync(this.badgeCnt);
    } catch (err: any) {
      this.badgeCnt = 0;
      FloDigitalErrorParse(err);
    } finally {
    }
  }

  @observable readedNotificationIds: string[] = [];
  @action async readSingle(notificationId: string) {
    try {
      console.log(notificationId);
      if (this.readedNotificationIds.includes(notificationId)) return;

      this.readedNotificationIds.push(notificationId);

      let result = await axios.get(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "Notification/NotificationReadById?id=" +
          notificationId,
        { headers: AccountService.tokenizeHeader() }
      );

      console.log(result.data, "ntf");
      await this.readBadgeCount();
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  }
}

enum TriggerType {
  Undefined = 0,
  OMS = 1,
  CRM = 2,
  OMC = 3,
  SYSTEM = 4,
  IAMHUB = 5,
}

enum ActionType {
  Undefined = 0,
  Redirect = 1,
  LogOut = 2,
}

export interface Notify {
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
}

export default new FcmService();

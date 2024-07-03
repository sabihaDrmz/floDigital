import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  makeObservable,
  action,
  observable,
  runInAction,
  configure,
} from "mobx";
import { Actions } from "react-native-router-flux";
import { VersionInfo } from "../../constant/ApplicationVersionInfo";
import { translate } from "../../helper/localization/locaizationMain";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import { accountInfoKey, appIntroKey } from "../StorageKeys";
import BasketService from "./BasketService";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
// import crashlytics from '@react-native-firebase/crashlytics';
import FcmService from "./FcmService";
import CrmService from "./CrmService";
// import messaging from '@react-native-firebase/messaging';
import { notificationEvent } from "../libraries/FcmFroground";
import { Platform } from "react-native";
import { FloDigitalErrorParse } from "../HttpModule";
import MessageBoxNew from "./MessageBoxNew";
import linq from "linq";
configure({
  enforceActions: "never",
});

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
];

class AccountService {
  accountInfo: { token?: string; refreshToken?: string; cid?: string } = {};
  testToken: string = "";
  testCid: string = "";
  employeeInfo: any = {};
  userRoles: Role[] = [];
  isLoading: boolean = false;
  refreshCount: number = 1;
  blockAllRequest: boolean = false;
  constructor() {
    makeObservable(this, {
      accountInfo: observable,
      employeeInfo: observable,
      isLoading: observable,
      login: action,
      logOut: action,
      restore: action,
      tokenizeHeader: action,
    });
  }

  loginWithRefreshToken = async () => {
    try {
      if (
        this.employeeInfo &&
        Number(this.employeeInfo.EfficiencyRecord) > 10000000
      )
        return true;

      this.blockAllRequest = true;
      if (this.refreshCount > 10) return false;
      this.refreshCount++;
      const res = await axios.post(
        `${GetServiceUri(ServiceUrlType.SYSTEM_API)}User/LoginWithRefreshToken`
      );

      if (res.data && res.data.isValid) await this.updateUserInfo(res);

      this.refreshCount = 0;
      return true;
    } catch (err) {
    } finally {
      this.blockAllRequest = false;
    }

    return false;
  };

  login = async (userName: string, password: string) => {
    try {
      this.isLoading = true;
      this.refreshCount = 0;

      var model = {
        username: userName,
        password: password,
      };

      var result = await axios.post<{
        token: string;
        refreshToken: string;
        userInfo: string;
        employeeInfo: string;
        isValid: boolean;
        message: string;
        roles: string;
        clientId: string;
      }>(`${GetServiceUri(ServiceUrlType.SYSTEM_API)}User/Login`, model);

      if (result.data && result.data.isValid) {
        await this.updateUserInfo(result);

        await AsyncStorage.setItem(
          "@FloStore:AccountInfo",
          JSON.stringify({
            accInfo: this.accountInfo,
            employeeInfo: this.employeeInfo,
            roles: this.userRoles,
          })
        );

        Actions.reset("appBase");
        FcmService.getNoficationPermission();
      } else {
        console.log(result.data);
        MessageBoxNew.show(translate(result.data.message));
      }
    } catch (err) {
    } finally {
      this.isLoading = false;
    }
  };

  updateUserInfo = async (result: any) => {
    this.accountInfo = {
      token: result.data.token,
      refreshToken: result.data.refreshToken,
      cid: result.data.clientId,
    };

    this.employeeInfo = JSON.parse(result.data.employeeInfo);

    const userRoles: Role[] = [];

    result.data.roles.split("|").map((roleRaw: string) => {
      const roleParsed = roleRaw.split(";");
      if (linq.from(roles).any((x) => x == roleParsed[0]))
        userRoles.push({
          roleName: roleParsed[0],
          permissions: {
            CanAdd: roleParsed[1] == "1",
            CanDelete: roleParsed[2] == "1",
            CanRead: roleParsed[3] == "1",
            CanUpdate: roleParsed[4] == "1",
          },
        });
    });

    this.userRoles = userRoles;
  };

  logOut() {
    // crashlytics().log('log Out');
    // crashlytics().setUserId('');
    axios.post(`${GetServiceUri(ServiceUrlType.SYSTEM_API)}User/LogOut`);
    BasketService.clearBasket();
    AsyncStorage.removeItem(accountInfoKey).then((userInfoJson) => {
      this.userRoles = [];
      Actions.replace("authStack");
    });
  }

  restore = async () => {
    // crashlytics().log('Account restore');
    this.refreshCount = 0;

    let userInfoJson = await AsyncStorage.getItem(accountInfoKey);
    let appIntroComple = await AsyncStorage.getItem(appIntroKey);

    var initMessage = undefined; // await messaging().getInitialNotification();

    if (initMessage) {
      FcmService.waitingRemoteRouting = initMessage;
    }
    runInAction(async () => {
      if (userInfoJson) {
        var userInfo = JSON.parse(userInfoJson);
        this.accountInfo = userInfo.accInfo;
        this.employeeInfo = userInfo.employeeInfo;
        this.userRoles = userInfo.roles;
        var token = this.accountInfo?.token;
        var cid = this.accountInfo?.cid;

        if (this.accountInfo.refreshToken) {
          await this.loginWithRefreshToken();
        }
        // analytics().logEvent('account_restoration', {
        //   employee: this.employeeInfo,
        // });

        // if (this.employeeInfo.EfficiencyRecord) {
        //   crashlytics().setUserId(this.employeeInfo.EfficiencyRecord);
        // } else crashlytics().setUserId('testuser');

        if (
          (!appIntroComple || appIntroComple !== "ok") &&
          Platform.OS !== "web"
        ) {
          Actions.replace("introStack");
        } else {
          if (token && cid) {
            Actions.replace("mainStack");
          } else Actions.replace("authStack");
        }
      } else {
        Actions.replace("authStack");
      }
      CrmService.complaints = [];
    });
  };

  tokenizeHeader(omsTest: boolean = false): any {
    var token = this.accountInfo?.token;
    var cid = this.accountInfo?.cid;

    return {
      Authorization: token,
      cid: cid,
      storeId: this.getUserStoreId(),
      employeeId: this.employeeInfo?.EfficiencyRecord || "-1",
      refreshToken: this.accountInfo.refreshToken,
      appVer: VersionInfo.versionNormalizer,
      appType: Platform.OS === "web" ? 2 : 1,
    };
  }

  getUserStoreId() {
    if (
      this.employeeInfo === null ||
      this.employeeInfo === undefined ||
      this.employeeInfo.ExpenseLocationCode === null ||
      this.employeeInfo.ExpenseLocationCode === undefined
    )
      return undefined;
    else return this.employeeInfo.ExpenseLocationCode.substring(3);
  }
}

export default new AccountService();

export interface Role {
  roleName: string;
  permissions: RolePermission;
}

export interface RolePermission {
  CanAdd: boolean;
  CanDelete: boolean;
  CanRead: boolean;
  CanUpdate: boolean;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import AccountService from "./AccountService";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import {
  FloResultCode,
  ServiceResponseBase,
} from "../models/ServiceResponseBase";
import { SapStore } from "../models/SapStoreModel";
import { chekcAuthError, RNExitAppCustom } from "../Util";
import { translate } from "../../helper/localization/locaizationMain";
import { PaymentType } from "../models/PaymentType";
import { EasyReturnReason } from "../models/EasyReturnReason";
import { ProductGroup, ProductGroupReason } from "../models/ProductGroup";
import { VersionInfo } from "../../constant/ApplicationVersionInfo";
import PrinterConfigService from "./PrinterConfigService";
// import crashlytics from '@react-native-firebase/crashlytics';
import { FloDigitalErrorParse } from "../HttpModule";
import { Platform } from "react-native";
import { isInRole } from "../../components/RoleGroup";
import { EcomStore } from "../models/EcomStoreModel";
import { tr } from "../../helper/localization/lang/_tr";
class ApplicationGlobalService {
  @observable cityes: any[] = [];
  @observable districts: any[] = [];
  @observable neighbourhoods: any[] = [];
  @observable testMode: boolean = false;
  @observable restoredTestMode: boolean = false;
  @observable allStore: SapStore[] = [];
  @observable allPaymentTypes: PaymentType[] = [];
  @observable allEasyReturnReasons: EasyReturnReason[] = [];
  @observable productReasons: ProductGroup[] = [];
  @observable productGroupReasons: ProductGroupReason[] = [];
  @observable isOpenDrawer: boolean = false;

  @observable isShowFullScreenImage: boolean = false;
  @observable fullScreenImageUri: string = "";
  @observable omsPrintPdfBarcode: boolean = false;
  @observable ecomStoreList: EcomStore[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action showFullScreenImage = (uri: string) => {
    this.fullScreenImageUri = uri;
    this.isShowFullScreenImage = true;
  };

  @observable isShowVersionError: boolean = false;
  @observable versionErrorMessage: string = "";
  @observable isForceVersion: boolean = false;
  @action checkVersion = async () => {
    if (__DEV__) return true;
    if (Platform.OS === "web") return true;
    try {
      let version = await axios.get<{
        isForceUpdate: boolean;
        message: string;
        showNewVersionAlert: boolean;
      }>(
        `${GetServiceUri(
          ServiceUrlType.VERSION
        )}?applicationType=1&versionNumber=${VersionInfo.versionNormalizer}`
      );

      console.log(version.data);
      if (version.data.isForceUpdate || version.data.showNewVersionAlert) {
        this.isShowVersionError = true;
        this.versionErrorMessage = version.data.message;
        this.isForceVersion = version.data.isForceUpdate;
      }

      return !version.data.isForceUpdate;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return true;
    }
  };

  @action restoreTestMode = async () => {
    // crashlytics().log('Test Modu Cihaz içinden okunuyor');
    this.restoredTestMode = true;
    let currentMode = await AsyncStorage.getItem("@Keys.testModeAllow");
    this.testMode = currentMode === "open";
    return this.testMode;
  };
  @action changeApplicationTestMode = async () => {
    // crashlytics().log('Test Modu durumu değiştirlidi');
    let currentMode = await AsyncStorage.getItem("@Keys.testModeAllow");
    if (currentMode) {
      this.testMode = currentMode === "open";
      await AsyncStorage.setItem(
        "@Keys.testModeAllow",
        this.testMode ? "closed" : "open"
      );
    } else {
      this.testMode = false;
      await AsyncStorage.setItem(
        "@Keys.testModeAllow",
        this.testMode ? "closed" : "open"
      );
    }

    MessageBox.Show(
      translate("servicesApplicationGlobalService.reopenTheApp"),
      MessageBoxDetailType.Information,
      MessageBoxType.Standart,
      () => {
        Platform.OS === "web" ? window.location.reload() : RNExitAppCustom?.exitApp();
      },
      () => {}
    );
  };

  @action getAllCities = async () => {
    // crashlytics().log('Şehir Listesi Okundu');
    try {
      if (this.cityes.length === 0) {
        let result = await axios.post(
          GetServiceUri(ServiceUrlType.ALL_CITY),
          {},
          { headers: AccountService.tokenizeHeader() }
        );

        if (result.status === 200 && result.data.state === 1) {
          this.cityes = result.data.model;
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action getDistrictByCity = async (cityId: number) => {
    // crashlytics().log('İlçe listesi eklendi [Şehir=' + cityId + ']');
    try {
      this.districts = [];
      let result = await axios.post(
        GetServiceUri(ServiceUrlType.GET_DISTRICT_BY_CITY_ID) +
          "?cityId=" +
          cityId,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.status === 200 && result.data.state === 1) {
        this.districts = result.data.model;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action getNeighborhoodByDistrictId = async (districtId: number) => {
    try {
      this.neighbourhoods = [];
      let result = await axios.post(
        GetServiceUri(ServiceUrlType.GET_NEIGHBOURHOOD_BY_DISTRICT_ID) +
          "?districtId=" +
          districtId,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.status === 200 && result.data.state === 1) {
        this.neighbourhoods = result.data.model;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action fetchAllStores = async () => {
    // crashlytics().log('Mağaza listesi istendi');
    await new Promise((r) => setTimeout(r, 2000));
    try {
      let response = await axios.get<ServiceResponseBase<SapStore[]>>(
        GetServiceUri(ServiceUrlType.SAP_STORE),
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (
        response.status === 200 &&
        response.data.state === FloResultCode.Successfully
      ) {
        this.allStore = response.data.model;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action getAllStores = async () => {
    if (this.allStore.length === 0) await this.fetchAllStores();
    // crashlytics().log('Daha önceden istenen mağaza listesi kullanılıyor');
    return this.allStore;
  };

  @action getAllEcomStoreList = async () => {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      let response = await axios.get<ServiceResponseBase<EcomStore[]>>(
        GetServiceUri(ServiceUrlType.ECOM_STORE),
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (
        response.status === 200 &&
        response.data.state === FloResultCode.Successfully
      ) {
        //@ts-ignore
        this.ecomStoreList = response.data.model.data;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action getAllPaymentType = async () => {
    // crashlytics().log('Ödeme Tipleri istendi');
    if (this.allPaymentTypes.length === 0) {
      var result = await axios.get<ServiceResponseBase<PaymentType[]>>(
        GetServiceUri(ServiceUrlType.PAYMENT_TYPE),
        { headers: AccountService.tokenizeHeader() }
      );

      if (
        result.status === 200 &&
        result.data.state === FloResultCode.Successfully
      ) {
        this.allPaymentTypes = result.data.model;
      }
    }

    return this.allPaymentTypes;
  };

  @action getAllEasyReasons = async () => {
    // crashlytics().log('İade nedenleri istendi.');
    try {
      var result = await axios.get<ServiceResponseBase<EasyReturnReason[]>>(
        GetServiceUri(ServiceUrlType.EASY_RETURN_REASONS),
        { headers: AccountService.tokenizeHeader() }
      );

      if (
        result.status === 200 &&
        result.data.state === FloResultCode.Successfully
      ) {
        this.allEasyReturnReasons = result.data.model;
      } else {
        MessageBox.Show(
          translate("errorMsgs.unexceptedError"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @action getAllProductGroup = async () => {
    // crashlytics().log('Ürün gurupları istendi');
    try {
      var result = await axios.post<ServiceResponseBase<ProductGroup[]>>(
        GetServiceUri(ServiceUrlType.ER_PRODUCT_GROUPS),
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully)
        this.productReasons = result.data.model;
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @action getAllProductGroupReasons = async () => {
    // crashlytics().log('Ürün guruplarına özel iade nedenleri istendi.');
    try {
      var result = await axios.post<ServiceResponseBase<ProductGroupReason[]>>(
        GetServiceUri(ServiceUrlType.ER_PRODUCT_GROUPS_REASONS),
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully)
        this.productGroupReasons = result.data.model;
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @action applicationRestoration = async () => {
    if (AccountService.accountInfo?.token) {
      console.log("****");
      await new Promise((r) => setTimeout(r, 2000));
      // crashlytics().log('Uygulama açıldı kendini hazyır hale getiriyor...');
      if (isInRole("omc-oms")) {
        await this.restoreStorePermission();
        await this.getCargoList();
      }

      if (isInRole("omc-basket")) {
        await this.getAllCities();
      }

      if (isInRole("omc-easy-return") || isInRole("omc-easy-return-cancel")) {
        await this.getAllEasyReasons();
        await this.getAllPaymentType();
        await this.getAllProductGroup();
        await this.getAllProductGroupReasons();
      }

      if (isInRole("omc-warehouse-request")) await this.getWrCancelReasons();
    }
  };

  @action turkishtoEnglish = (txt: String) => {
    return txt
      .replace("Ğ", "g")
      .replace("Ü", "u")
      .replace("Ş", "s")
      .replace("I", "i")
      .replace("İ", "i")
      .replace("Ö", "o")
      .replace("Ç", "c")
      .replace("ğ", "g")
      .replace("ü", "u")
      .replace("ş", "s")
      .replace("ı", "i")
      .replace("ö", "o")
      .replace("ç", "c");
  };

  @observable WrCancelReasons: {
    id: number;
    description: string;
    trDescription: string;
  }[] = [];
  @action getWrCancelReasons = async () => {
    try {
      var result = await axios.get<ServiceResponseBase<any>>(
        `${GetServiceUri(
          ServiceUrlType.SYSTEM_API
        )}Notification/GetCancelReasons`,
        { headers: AccountService.tokenizeHeader() }
      );

      this.WrCancelReasons = result.data.model;
      this.WrCancelReasons.forEach((x) => {
        Object.entries(tr.omsErrorReasons).forEach(([key, value]) => {
          if (value.toUpperCase() == x.description.toUpperCase()) {
            x.trDescription = x.description;
            x.description = translate("omsErrorReasons." + key);
          }
        });
      });
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @observable cargoList: any[] = [];
  @action getCargoList = async () => {
    try {
      var result = await axios.post(
        `${GetServiceUri(
          ServiceUrlType.OMS_BASE
        )}CargoReconciliation/GetCargoList`,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      this.cargoList = result.data.Data;
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @action sendJailBrokenInfo = async (isJailBroken: boolean) => {
    try {
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action getStoreSalesOrganization = (storeId: string) => {
    return this.allStore.find((x) => x.werks === storeId)?.salesOrg;
  };

  @action getSalesOrganization = () => {
    return this.getStoreSalesOrganization(AccountService.getUserStoreId());
  };

  @action restoreStorePermission = async () => {
    try {
      var result = await axios.post<ServiceResponseBase<any>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "StorePermission/GetById?storeId=" +
          AccountService.getUserStoreId(),
        {},
        { headers: AccountService.tokenizeHeader() }
      );
      if (result.data.state === FloResultCode.Successfully) {
        this.omsPrintPdfBarcode = result.data.model.printPermission;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };
}

export default new ApplicationGlobalService();

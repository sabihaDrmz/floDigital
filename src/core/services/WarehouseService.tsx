import axios from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { translate } from "../../helper/localization/locaizationMain";
import { FloDigitalErrorParse } from "../HttpModule";
import {
  FloResultCode,
  ServiceResponseBase,
} from "../models/ServiceResponseBase";
import { WarehouseResModel } from "../models/WarehouseModel";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import AccountService from "./AccountService";
import FcmService from "./FcmService";
import MessageBoxNew from "./MessageBoxNew";
import { ProductModel } from "./ProductService";
import ApplicationGlobalService from "./ApplicationGlobalService";

class WarehouseService {
  constructor() {
    makeAutoObservable(this);
  }

  @observable userList: WarehouseResModel[] = [];
  @observable warehouseList: WarehouseResModel[] = [];
  @observable isLoading: boolean = false;

  @action getStoreEmployee = async (storeId: string) => {
    const uri =
      GetServiceUri(ServiceUrlType.SYSTEM_API) +
      "Notification/GetStoreEmployees?storeId=" +
      storeId;

    var result = await axios.get<ServiceResponseBase<EmployeeModel[]>>(uri, {
      headers: AccountService.tokenizeHeader(),
    });

    if (result.data.state === FloResultCode.Successfully) {
      return result.data.model;
    }

    return [] as EmployeeModel[];
  };

  @action createWarehouseRequest = async (
    product: ProductModel,
    note: string,
    requestEmployee: EmployeeModel,
    completeEmployee: EmployeeModel
  ) => {
    try {
      const model = {
        requestPerson: requestEmployee.employeeId,
        requestPersonName: requestEmployee.employeeName,
        source: "string",
        status: 0,
        completePerson: completeEmployee.employeeId,
        completePersonName: completeEmployee.employeeName,
        barcode: product.barcode,
        name: product.name,
        brand: product.brand,
        color: product.color,
        size: product.size,
        sku: product.sku,
        parentSku: product.parentSku,
        model: product.model,
        store: AccountService.getUserStoreId(),
        userName: AccountService.employeeInfo.FirstName,
        requestNote: note,
        completeNote: "",
      };

      const result = await axios.post<ServiceResponseBase<any>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Notification/WrInsert",
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (result.data.state === FloResultCode.Successfully) {
        return true;
      } else {
        return false;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    }
  };

  @action getListForWarehouse = async (
    page: number,
    offeset: number = 20,
    status: number = 1
  ) => {
    try {
      if (this.isLoading === true) return;

      this.isLoading = true;
      if (page === 1) this.warehouseList = [];

      const uri = `${GetServiceUri(
        ServiceUrlType.SYSTEM_API
      )}Notification/GetWr?page=${page}&size=${offeset}&employeeId=${
        AccountService.tokenizeHeader().employeeId
      }&appId=OMC_WR&status=${status}`;

      const res = await axios.get<ServiceResponseBase<WarehouseResModel[]>>(
        uri,
        { headers: AccountService.tokenizeHeader() }
      );

      if (res.data.state === FloResultCode.Successfully) {
        this.warehouseList = [...this.warehouseList, ...res.data.model];
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action getListForUser = async (page: number, offeset: number = 20) => {
    try {
      if (this.isLoading === true) return;

      this.isLoading = true;
      if (page === 1) this.userList = [];

      const uri = `${GetServiceUri(
        ServiceUrlType.SYSTEM_API
      )}Notification/GetWr?page=${page}&size=${offeset}&employeeId=${
        AccountService.tokenizeHeader().employeeId
      }&appId=OMC_WR&status=99`;

      const res = await axios.get<ServiceResponseBase<WarehouseResModel[]>>(
        uri,
        { headers: AccountService.tokenizeHeader() }
      );

      if (res.data.state === FloResultCode.Successfully) {
        this.userList = [...this.userList, ...res.data.model];
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action updateRequestState = async (
    id: number,
    productState: 0 | 1,
    note: string,
    reason: string
  ) => {
    try {
      const recordIndex = this.warehouseList.findIndex((x) => x.id === id);
      if (recordIndex < 0) {
        MessageBoxNew.show(translate("warehouseRequest.operationFailed"));
        return;
      }

      let trReason = reason;
      var findReason = ApplicationGlobalService.WrCancelReasons.find(
        (x) => x.description === reason
      )?.trDescription;

      if (findReason) {
        trReason = findReason;
      }

      const record = this.warehouseList[recordIndex];

      const model = {
        ...record,
        status: 1,
        productState,
        completeNote: note,
        cancelReason: trReason,
      };

      const uri = `${GetServiceUri(
        ServiceUrlType.SYSTEM_API
      )}Notification/WrUpdate`;

      const result = await axios.post<ServiceResponseBase<any>>(uri, model, {
        headers: AccountService.tokenizeHeader(),
      });

      if (result.data.state === FloResultCode.Successfully) {
        this.warehouseList = this.warehouseList.filter((x) => x.id !== id);
        MessageBoxNew.show(translate("warehouseRequest.operationSuccessfully"));
        FcmService.readSingle(id.toString());
      } else {
        MessageBoxNew.show(translate("warehouseRequest.operationFailed"));
        console.log(result.data);
        return;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };
}

export interface EmployeeModel {
  storeId?: string;
  employeeId: string;
  employeeName: string;
}
export default new WarehouseService();

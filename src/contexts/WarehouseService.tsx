import {
    FloResultCode,
    ServiceResponseBase,
} from "../core/models/ServiceResponseBase";
import { translate } from "../helper/localization/locaizationMain";
import { EmployeeModel } from "./model/EmployeeModel";
import { ProductModel } from "./model/ProductModel";
import { WarehouseGetProduct, WarehouseResModel } from "./model/WarehouseResModel";
import { create } from "zustand";
import { useAccountService, SystemApi } from "./AccountService";
import { useApplicationGlobalService } from "./ApplicationGlobalService";
import { useFcmService } from "./FcmService";
import { useMessageBoxService } from "./MessageBoxService";
export interface WarehouseServiceModel {
    isLoading: boolean;
    userList: WarehouseResModel[];
    warehouseList: WarehouseResModel[];
    getStoreEmployee: (storeId: string) => Promise<EmployeeModel[] | undefined>;
    createWarehouseRequest: (
        product: ProductModel,
        note: string,
        requestEmployee: EmployeeModel,
        completeEmployee: EmployeeModel
    ) => Promise<boolean>;
    getListForWarehouse: (
        page: number,
        offeset: number,
        status: number
    ) => Promise<void>;
    getListForUser: (page: number, offeset: number) => Promise<void>;
    updateRequestState: (
        id: number,
        productState: 0 | 1,
        note: string,
        reason: string
    ) => Promise<void>;
    setWarehouseList: (model: WarehouseResModel[]) => void;
    getStoreWarehouseProduct: (
        skuNo: string,
    ) => Promise<WarehouseGetProduct[]>;
    createStoreWarehouseRequest: (
        product: ProductModel,
        storeWhId: string,
        requestEmployee: EmployeeModel,
        requestNote: string,
        qr: string,
    ) => Promise<boolean>;
}
const MessageBox = useMessageBoxService.getState();
export const useWarehouseService = create<WarehouseServiceModel>((set, get) => ({
    // const Account = useUser();
    // const Fcm = useFcm();
    // const ApplicationGlobalService = useApplicationGlobal();
    // const MessageBox = useMessageBox();
    isLoading: false,
    warehouseList: [],
    userList: [],
    productStoreWarehouseList: [],
    getStoreEmployee: async (storeId: string) => {
        const { isLoading } = get();
        if (isLoading === true) return;
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));
            const uri = "Notification/GetStoreEmployees?storeId=" + storeId;
            var result = await SystemApi.get<ServiceResponseBase<EmployeeModel[]>>(
                uri
            );

            if (result.data.state === FloResultCode.Successfully) {
                return result.data.model;
            }

            return [] as EmployeeModel[];
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    createWarehouseRequest: async (
        product: ProductModel,
        note: string,
        requestEmployee: EmployeeModel,
        completeEmployee: EmployeeModel
    ) => {
        try {
            const AccountService = useAccountService.getState();
            const model = {
                requestPerson: AccountService.employeeInfo.EfficiencyRecord,
                requestPersonName: `${AccountService.employeeInfo.FirstName} ${AccountService.employeeInfo.LastName}`,
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

            const result = await SystemApi.post<ServiceResponseBase<any>>(
                "Notification/WrInsert",
                model
            );

            if (result.data.state === FloResultCode.Successfully) {
                return true;
            } else {
                return false;
            }
        } catch (err: any) {
            return false;
        }
    },
    getListForWarehouse: async (
        page: number,
        offeset: number = 20,
        status: number = 1
    ) => {
        try {
            const { isLoading, warehouseList } = get();
            const AccountService = useAccountService.getState();
            if (isLoading === true) return;

            set((state) => ({
                ...state,
                isLoading: true
            }));
            const uri = `Notification/GetWr?page=${page}&size=${offeset}&employeeId=${AccountService.employeeInfo.EfficiencyRecord}&appId=OMC_WR&status=${status}`;

            const res = await SystemApi.get<ServiceResponseBase<WarehouseResModel[]>>(
                uri
            );

            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    warehouseList: [...warehouseList, ...res.data.model]
                }));
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    getListForUser: async (page: number, offeset: number = 20) => {
        const AccountService = useAccountService.getState();
        const { isLoading, userList } = get();
        try {
            if (isLoading === true) return;

            set((state) => ({
                ...state,
                isLoading: true
            }));

            if (page === 1)
                set((state) => ({
                    ...state,
                    userList: []
                }));

            const uri = `Notification/GetWr?page=${page}&size=${offeset}&employeeId=${AccountService.employeeInfo.EfficiencyRecord}&appId=OMC_WR&status=99`;

            const res = await SystemApi.get<ServiceResponseBase<WarehouseResModel[]>>(
                uri
            );

            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    userList: [...userList, ...res.data.model]
                }));
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    updateRequestState: async (
        id: number,
        productState: 0 | 1,
        note: string,
        reason: string
    ) => {
        const { warehouseList } = get();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const FcmService = useFcmService.getState();
        try {
            const recordIndex = warehouseList.findIndex((x) => x.id === id);
            if (recordIndex < 0) {
                MessageBox.show(translate("warehouseRequest.operationFailed"));
                return;
            }

            let trReason = reason;
            var findReason = ApplicationGlobalService.wrCancelReasons.find(
                (x) => x.description === reason
            )?.trDescription;

            if (findReason) {
                trReason = findReason;
            }

            const record = warehouseList[recordIndex];

            const model = {
                ...record,
                status: 1,
                productState,
                completeNote: note,
                cancelReason: trReason,
            };

            const uri = `Notification/WrUpdate`;

            const result = await SystemApi.post<ServiceResponseBase<any>>(uri, model);

            if (result.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    warehouseList: warehouseList.filter((x) => x.id !== id)
                }));
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                FcmService.readSingle(id.toString());
            } else {
                MessageBox.show(translate("warehouseRequest.operationFailed"));
                console.log(result.data);
                return;
            }
        } catch (err: any) {
        } finally {
        }
    },
    getStoreWarehouseProduct: async (skuNo: string) => {
        const { isLoading } = get();
        const AccountService = useAccountService.getState();
        if (isLoading === true) return;
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));

            const result = await SystemApi.post<ServiceResponseBase<WarehouseGetProduct[]>>(
                `StoreWarehouse/GetByProduct?storeCode=${AccountService.getUserStoreId()}&skuNo=${skuNo}`
            );

            if (result.data.state === FloResultCode.Successfully) {
                return result.data.model;
            } else {
                return [] as WarehouseGetProduct[];
            }
        } catch (err: any) {
            console.log('result.data:', err)
            return [] as WarehouseGetProduct[];
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    createStoreWarehouseRequest: async (
        product: ProductModel,
        storeWhId: string,
        requestEmployee: EmployeeModel,
        requestNote: string,
        qr: string
    ) => {
        try {
            const AccountService = useAccountService.getState();
            const model = {
                store: AccountService.getUserStoreId(),
                storeWhId: storeWhId,
                unitQr: product.unitQr,
                barcode: product.barcode,
                sku: product.sku,
                model: product.model,
                color: product.color,
                size: product.size,
                requestPerson: requestEmployee.EfficiencyRecord,
                requestPersonName: `${requestEmployee.FirstName} ${requestEmployee.LastName}`,
                requestNote: requestNote,
                productState: 0,
                status: 0,
            };
            if (!product.model.includes(product?.brand)) {
                model.model = `${product?.brand} ${product.model}`
            }
            const result = await SystemApi.post<ServiceResponseBase<any>>(
                "StoreWarehouseRequest/Add",
                model
            );
            if (result.data.state === FloResultCode.Successfully) {
                return true;
            } else {
                MessageBox.show(result.data.message)
                return false;
            }
        } catch (err: any) {
            return false;
        }
    },
}));

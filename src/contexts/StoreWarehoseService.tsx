import {
    FloResultCode,
    ServiceResponseBase,
} from "../core/models/ServiceResponseBase";
import { translate } from "../helper/localization/locaizationMain";
import { useApplicationGlobalService } from "./ApplicationGlobalService";
import { useFcmService } from "./FcmService";
import { EmployeeModel } from "./model/EmployeeModel";
import {
    StoreWarehouseRequest,
    StoreWarehouseResModel,
    StoreWarehouseResUnitModel,
    StoreWarehouseResUnitProductModel,
    StoreWarehouseUserExtensionCreateModel,
    StoreWhLabelAddProductListRequestModel,
} from "./model/StoreWarehouseModal";
import { StoreRayonCreateModel, StoreRayonDeviceList, StoreRayonListModel, StoreRayonUpdateModel } from "./model/StoreRayonModel";
import { WarehouseRequestGroupReponseModel } from "../contexts/model/WarehouseRequestGroupReponseModel";
import { create } from "zustand";
import { useAccountService, SystemApi } from "./AccountService";
import { useMessageBoxService } from "./MessageBoxService";

export interface StoreWarehouseServiceModel {
    isLoading: boolean;
    isModalVisible: boolean;
    userList: StoreWarehouseResModel[];
    storeWarehouseList: StoreWarehouseResModel[];
    storeWarehouseReqList: StoreWarehouseResModel[];
    storeWarehouseUnitList: StoreWarehouseResUnitModel[];
    personalData: [];
    createStoreWarehouseRequest: (code: string, name: string, note: string) => Promise<boolean>;
    getListForStoreWarehouse: () => Promise<void>;
    setStoreWarehouseList: (model: StoreWarehouseResModel[]) => void;
    setStoreWarehouseReqList: (model: StoreWarehouseResModel[]) => void;
    changeModalVisible: () => Promise<void>;
    updateStoreWarehouseRequest: (code: string, name: string, id: string) => Promise<boolean>;
    deleteStoreWarehouseRequest: (id: string) => Promise<boolean>;
    changeOpenEditVisible: () => Promise<void>;
    changeCloseEditVisible: () => Promise<void>;
    isEdit: boolean;
    getListForStoreWarehouseUnit: (id: string) => Promise<void>;
    createProductForStoreWarehouseUnit: (product: StoreWarehouseResUnitProductModel[]) => Promise<boolean>;
    createForStoreWarehouseUnit: (storeWhId: string, code: string) => Promise<boolean>;
    updateForStoreWarehouseUnit: (storeWhId: string, code: string, id: string) => Promise<boolean>;
    deleteForStoreWarehouseUnit: (storeWhId: string, code: string) => Promise<boolean>;
    getListForStoreWarehouseReq: () => Promise<StoreWarehouseResModel[]>;
    setStatusForStoreWarehouseReq: (model: any) => Promise<boolean>;
    getStoreWarehousePersonal: () => Promise<boolean>;
    getStorePersonal: () => Promise<boolean>;
    getStoreRayonList: () => Promise<boolean>;
    rayonData: StoreRayonListModel[];
    createStoreRayon: (data: StoreRayonCreateModel) => Promise<boolean | undefined>;
    updateStoreRayon: (data: StoreRayonUpdateModel) => Promise<boolean | undefined>;
    deleteStoreRayon: (id: number) => Promise<boolean | undefined>;
    warehousePersonalData: [];
    getUserExtensionList: () => Promise<boolean | undefined>;
    createUserExtension: (data: StoreWarehouseUserExtensionCreateModel) => Promise<boolean | undefined>;
    userExtensionList: [];
    deleteUserExtension: (id: number) => Promise<boolean | undefined>;
    deleteProductsFromUnit: (whId: string, labelCode: string) => Promise<boolean | undefined>;
    deleteProductsFromWh: (whId: string) => Promise<boolean | undefined>;
    getWarehouseRapor: (startDate: Date, endDate: Date) => Promise<boolean | undefined>;
    warehouseRaporList: [];
    warehouseProductList: [];
    getWarehouseProductList: (sku: string, storeWhId: string) => Promise<boolean | undefined>;
    getProductAllReport: (storeWhId: string, isUnit: boolean) => Promise<boolean | undefined>;
    warehouseProductAllReport: []
    setWharehouseProductAllReport: (model: StoreWarehouseResModel[]) => void;
    getRayonDeviceList: (id: number) => void;
    rayonDeviceList: StoreRayonDeviceList[]
    rayonDeviceCreate: (storeReyonId: number, code: string, name: string) => void;
    rayonDeviceUpdate: (storeReyonId: number, code: string, name: string, id: number) => void;
    rayonDeviceDelete: (storeReyonId: number, id: number) => void;
    getAllWarehouseRequestGroupWithBasketKey: (storeCode: string) => Promise<WarehouseRequestGroupReponseModel[]>;
    addProductList: (data: StoreWhLabelAddProductListRequestModel) => Promise<boolean | undefined>;
}
const MessageBox = useMessageBoxService.getState();

export const useStoreWarehouseService = create<StoreWarehouseServiceModel>((set, get) => ({
    // const Account = useUser();
    // const MessageBox = useMessageBox();
    isLoading: false,
    isModalVisible: false,
    storeWarehouseList: [],
    storeWarehouseUnitList: [],
    userList: [],
    isEdit: false,
    storeWarehouseReqList: [],
    personalData: [],
    warehousePersonalData: [],
    rayonData: [],
    userExtensionList: [],
    warehouseRaporList: [],
    warehouseProductList: [],
    warehouseProductAllReport: [],
    rayonDeviceList: [],
    changeModalVisible: async () => {
        const { isModalVisible } = get();
        set((state) => ({
            ...state,
            isModalVisible: !isModalVisible,
        }));
    },
    setWharehouseProductAllReport: async (model: []) => {
        set((state) => ({
            ...state,
            warehouseProductAllReport: model,
        }));
    },
    changeOpenEditVisible: async () => {
        set((state) => ({
            ...state,
            isEdit: true,
        }));
    },
    changeCloseEditVisible: async () => {
        set((state) => ({
            ...state,
            isEdit: false,
        }));
    },
    getListForStoreWarehouse: async () => {
        try {
            const { isLoading } = get();
            const AccountService = useAccountService.getState();
            const MessageBox = useMessageBoxService.getState();
            if (isLoading === true) return;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreWarehouse/GetAll?storeCode=${AccountService.getUserStoreId()}`;
            const res = await SystemApi.post<
                ServiceResponseBase<StoreWarehouseResModel[]>
            >(uri);

            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    storeWarehouseList: res.data.model,
                }));
            } else {
                MessageBox.show(res.data.message);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    createStoreWarehouseRequest: async (code: string, name: string, note: string) => {
        try {
            const { storeWarehouseList, changeModalVisible, getListForStoreWarehouse } = get();
            const AccountService = useAccountService.getState();
            const MessageBox = useMessageBoxService.getState();

            const model = {
                code: code,
                name: name,
                storeCode: AccountService.getUserStoreId(),
                whType: 1,
                order: storeWarehouseList.length + 1,
                id: 0,
            };


            const result = await SystemApi.post<ServiceResponseBase<any>>(
                "StoreWarehouse/Create",
                model
            );

            if (result.data.state === FloResultCode.Successfully) {
                getListForStoreWarehouse();
                changeModalVisible();
                return true;
            } else {
                MessageBox.show(result.data.message);
            }

        } catch (err: any) {
            return false;
        }
    },
    updateStoreWarehouseRequest: async (code: string, name: string, id: string) => {
        try {
            const AccountService = useAccountService.getState();
            const { storeWarehouseList, changeModalVisible, changeEditVisible, getListForStoreWarehouse } = get();
            const MessageBox = useMessageBoxService.getState();

            const model = {
                code: code,
                name: name,
                storeCode: AccountService.getUserStoreId(),
                whType: 1,
                order: storeWarehouseList.length + 1,
                createDate: "2023-09-19T15:14:39.16",
                isDeleted: false,
                isActive: false,
                id: id,
                modifiedDate: "2023-09-19T15:14:39.16"
            };
            const result = await SystemApi.post<ServiceResponseBase<any>>(
                "StoreWarehouse/Update",
                model
            );
            if (result.data.state === FloResultCode.Successfully) {
                console.log('update başarılı');
                getListForStoreWarehouse();
                changeModalVisible();
                changeEditVisible();
                return true;
            } else {

                changeModalVisible();
                changeEditVisible();
                MessageBox.show(result.data.message);
            }
        } catch (err: any) {
            changeModalVisible();
            changeEditVisible();
            return false;
        }
    },
    deleteStoreWarehouseRequest: async (id: string) => {
        try {
            const { changeModalVisible, getListForStoreWarehouse } = get();

            const result = await SystemApi.post<ServiceResponseBase<any>>(
                `StoreWarehouse/Delete?Id=${id}`
            );
            if (result.data.state === FloResultCode.Successfully) {
                getListForStoreWarehouse();
                changeModalVisible();
                changeEditVisible();
                return true;
            } else {
                MessageBox.show(result.data.message);
                changeModalVisible();
                changeEditVisible();
                return false;
            }
        } catch (err: any) {
            changeModalVisible();
            changeEditVisible();
            return false;
        }
    },
    getListForStoreWarehouseUnit: async (id: string) => {
        try {
            const { isLoading } = get();
            if (isLoading === true) return;

            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreWhLabel/GetAll?&storeWhId=${id}`;
            const res = await SystemApi.post<
                ServiceResponseBase<StoreWarehouseResUnitModel[]>
            >(uri);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    storeWarehouseUnitList: res.data.model,
                }));
            } else {
                set((state) => ({
                    ...state,
                    storeWarehouseUnitList: [],
                }));
                MessageBox.show(res.data.message);
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                storeWarehouseUnitList: [],
            }));
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    createProductForStoreWarehouseUnit: async (product: StoreWarehouseResUnitProductModel[]) => {
        try {
            const result = await SystemApi.post<ServiceResponseBase<any>>(
                "StoreWhLabel/AddProducts",
                product
            );
            if (result.data.state === FloResultCode.Successfully) {
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                return true;
            } else {
                MessageBox.show(result.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        }
    },
    createForStoreWarehouseUnit: async (storeWhId: string, code: string) => {
        const { getListForStoreWarehouseUnit } = get();
        try {
            const model = {
                code: code,
                storeWhId: storeWhId,
            };
            const result = await SystemApi.post<ServiceResponseBase<any>>(
                "StoreWhLabel/Create",
                model
            );
            if (result.data.state === FloResultCode.Successfully) {

                getListForStoreWarehouseUnit(storeWhId)
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                return true;
            } else {
                MessageBox.show(result.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        }
    },
    updateForStoreWarehouseUnit: async (storeWhId: string, code: string, id: string) => {
        const { getListForStoreWarehouseUnit } = get();
        try {
            const model = {
                code: code,
                storeWhId: storeWhId,
                id: id
            };
            const result = await SystemApi.post<ServiceResponseBase<any>>(
                "StoreWhLabel/Update",
                model
            );
            if (result.data.state === FloResultCode.Successfully) {
                getListForStoreWarehouseUnit(storeWhId)
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                return true;
            } else {
                MessageBox.show(result.data.message);
            }
        } catch (err: any) {
            return false;
        }
    },
    deleteForStoreWarehouseUnit: async (storeWhId: string, id: string) => {
        const { getListForStoreWarehouseUnit } = get();
        try {

            const result = await SystemApi.post<ServiceResponseBase<any>>(
                `StoreWhLabel/Delete?Id=${id}`,
            );
            if (result.data.state === FloResultCode.Successfully) {
                getListForStoreWarehouseUnit(storeWhId)
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                return true;
            } else {
                MessageBox.show(result.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        }
    },
    getListForStoreWarehouseReq: async () => {
        const { isLoading } = get();
        const AccountService = useAccountService.getState();
        try {
            if (isLoading === true) return;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const warehouseId = AccountService.getUserStoreWarehouseId()
            const uri = warehouseId.length >= 2 ? "StoreWarehouseRequest/GetAllWithWhIdList" : `StoreWarehouseRequest/GetAll/${warehouseId[0]}`;
            const model = warehouseId.length >= 2 ? warehouseId : null
            const res = await SystemApi.post<
                ServiceResponseBase<StoreWarehouseResModel[]>
            >(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    storeWarehouseReqList: res.data.model,
                }));
                return res.data.model
            } else {
                MessageBox.show(res.data.message);
                return []
            }
        } catch (err: any) {
            return []
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    setStatusForStoreWarehouseReq: async (model) => {
        const { isLoading, getListForStoreWarehouseReq } = get();
        try {
            if (isLoading === true) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreWarehouseRequest/SetStatus`;
            const res = await SystemApi.post<
                ServiceResponseBase<StoreWarehouseResModel[]>
            >(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                await getListForStoreWarehouseReq();
                return true
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getStorePersonal: async () => {
        const { isLoading } = get();
        const AccountService = useAccountService.getState();
        try {
            if (isLoading === true) return false;
            set((state) => ({
                ...state,
                isLoading: false,
            }));
            const uri = `User/GetUsersByStoreCode?storeCode=${AccountService.getUserStoreId()}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    personalData: res.data.model,
                }));
                //getListForStoreWarehouseReq();
                return true
            } else {
                MessageBox.show(res.data.message);
                return false
            }
        } catch (err: any) {
            return false
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },

    getStoreWarehousePersonal: async () => {
        const { isLoading } = get();
        const AccountService = useAccountService.getState();
        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `UserExtension/GetAll?storeCode=${AccountService.getUserStoreId()}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    warehousePersonalData: res.data.model,
                }));
                //getListForStoreWarehouseReq();
                return true
            } else {
                MessageBox.show(res.data.message);
                return false
            }
        } catch (err: any) {
            return false
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getStoreRayonList: async () => {
        console.log('getStoreRayonList:')
        const { isLoading } = get();
        const AccountService = useAccountService.getState();
        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreReyon/GetAll?storeCode=${AccountService.getUserStoreId()}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    rayonData: res.data.model,
                }));
                return true
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    createStoreRayon: async (data: StoreRayonCreateModel) => {
        const { isLoading, changeModalVisible, getStoreRayonList } = get();
        const AccountService = useAccountService.getState();
        try {
            const model = {
                code: data.code,
                name: data.name,
                storeCode: AccountService.getUserStoreId(),
                ryType: data.ryType
            };
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreReyon/Create`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                changeModalVisible();
                getStoreRayonList()
                return true
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            return false
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    updateStoreRayon: async (data: StoreRayonUpdateModel) => {
        const { isLoading, changeModalVisible, getStoreRayonList } = get();
        const AccountService = useAccountService.getState();
        try {
            const model = {
                code: data.code,
                name: data.name,
                id: data.id,
                storeCode: AccountService.getUserStoreId()
            };
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreReyon/Update`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                changeModalVisible();
                getStoreRayonList()
                return true
            } else {
                MessageBox.show(res.data.message);
                changeModalVisible();
                return false
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    deleteStoreRayon: async (id: number) => {
        const { isLoading, changeModalVisible, getStoreRayonList, changeCloseEditVisible } = get();
        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreReyon/Delete?id=${id}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                changeModalVisible();
                getStoreRayonList()
                changeCloseEditVisible();
                return true
            } else {
                changeModalVisible();
                changeCloseEditVisible();
                getStoreRayonList()
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            changeModalVisible();
            getStoreRayonList()
            changeCloseEditVisible();
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    createUserExtension: async (data: StoreWarehouseUserExtensionCreateModel) => {
        const AccountService = useAccountService.getState();
        const { isLoading, getUserExtensionList } = get();
        try {
            const model = {
                employeeId: data?.userId,
                storeCode: AccountService.getUserStoreId(),
                storeReyonUser: data?.storeReyonUser,
                storeReyonId: data?.storeReyonId,
                storeWarehouseId: data?.storeWarehouseId,
                name: data?.name
            };
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `UserExtension/Create`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            console.log('res?.data?.state === FloResultCode.Successfully:', res?.data?.state === FloResultCode.Successfully)
            if (res?.data?.state === FloResultCode.Successfully) {
                await get().getUserExtensionList()
                console.log('createUserExtension')
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                return true
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getUserExtensionList: async () => {
        const AccountService = useAccountService.getState();
        const { isLoading } = get();
        console.log('getUserExtensionList ====>>>')
        try {
            if (isLoading) return;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `UserExtension/GetAllDetails?storeCode=${AccountService.getUserStoreId()}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    userExtensionList: res.data.model,
                }));
                console.log('res.data.model:', res.data.model)
                return true
            } else {
                console.log('getUserExtensionList ====>>> else')

                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            console.log('getUserExtensionList ====>>> catch')

            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
            console.log('getUserExtensionList ====>>> finally')

        }
    },
    deleteUserExtension: async (id: number) => {
        const { isLoading, getUserExtensionList } = get();
        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `UserExtension/Delete?EmployeeId=${id}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            console.log('res?.data?.state === FloResultCode.Successfully:', res?.data?.state === FloResultCode.Successfully)
            if (res.data.state === FloResultCode.Successfully) {
                await get().getUserExtensionList()
                console.log('deleteUserExtension')
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                return true
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    deleteProductsFromUnit: async (whId: string, labelCode: string) => {
        const { isLoading, getUserExtensionList } = get();
        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreWhLabel/DeleteProductsFromUnit?storeWhId=${whId}&labelCode=${labelCode}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                await getUserExtensionList();
                return true
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    deleteProductsFromWh: async (whId: string) => {
        const { isLoading, getUserExtensionList } = get();
        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreWhLabel/DeleteProductsFromWh?storeWhId=${whId}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                MessageBox.show(translate("warehouseRequest.operationSuccessfully"));
                getUserExtensionList()
                return true
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getWarehouseRapor: async (startDate: Date, endDate: Date) => {
        const AccountService = useAccountService.getState();
        const { isLoading } = get();

        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const model = {
                storeCode: AccountService.getUserStoreId(),
                startDate: startDate,
                endDate: endDate
            }
            const uri = `StoreWarehouseRequest/Report`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    warehouseRaporList: res.data.model,
                }));
                return true
            } else {
                MessageBox.show(res.data.message);
                set((state) => ({
                    ...state,
                    warehouseRaporList: [],
                }));
                return false;
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getWarehouseProductList: async (sku: string, storeWhId: string) => {
        const AccountService = useAccountService.getState();
        const { isLoading } = get();

        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const model = {
                sku: sku,
                storeCode: AccountService.getUserStoreId(),
                storeWhId: storeWhId
            }
            const uri = `StoreWarehouseRequest/GetProductReport`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    warehouseProductList: res.data.model,
                }));
                return true
            } else {
                MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getProductAllReport: async (storeWhId: string, isUnit: boolean) => {
        const AccountService = useAccountService.getState();
        const { isLoading } = get();

        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));

            const model = {
                isUnit: isUnit,
                storeCode: AccountService.getUserStoreId(),
                storeWhId: storeWhId
            }

            const uri = `StoreWarehouseRequest/GetProductAllReport`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    warehouseProductAllReport: res.data.model,
                }));
                return true
            } else {
                MessageBox.show(res.data.message);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getRayonDeviceList: async (id: number) => {
        const { isLoading } = get();

        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreDevice/GetAll/${id}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    rayonDeviceList: res.data.model,
                }));
                return true
            } else {
                set((state) => ({
                    ...state,
                    rayonDeviceList: [],
                }));
                MessageBox.show(res.data.message);
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                rayonDeviceList: [],
            }));
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    rayonDeviceCreate: async (storeRayonId: number, code: string, name: string) => {
        const { isLoading, changeModalVisible, getRayonDeviceList } = get();
        try {

            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const model = {
                code: code,
                name: name,
                storeReyonId: storeRayonId,
            };
            const uri = `StoreDevice/Create`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                changeModalVisible();
                getRayonDeviceList(storeRayonId)
                return true
            } else {
                MessageBox.show(res.data.message);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    rayonDeviceUpdate: async (storeRayonId: number, code: string, name: string, id: number) => {
        const { isLoading, changeModalVisible, getRayonDeviceList, changeCloseEditVisible } = get();

        try {
            const model = {
                code: code,
                name: name,
                storeReyonId: storeRayonId,
                id: id
            };
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreDevice/Update`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, model);
            if (res.data.state === FloResultCode.Successfully) {
                changeModalVisible();
                changeCloseEditVisible();
                getRayonDeviceList(storeRayonId)
                return true
            } else {
                changeModalVisible();
                changeCloseEditVisible();
                MessageBox.show(res.data.message);
            }
        } catch (err: any) {
            changeModalVisible();
            changeCloseEditVisible();
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    rayonDeviceDelete: async (storeRayonId: number, id: number) => {
        const { isLoading, getRayonDeviceList } = get();
        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreDevice/Delete?Id${id}`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri);
            if (res.data.state === FloResultCode.Successfully) {
                getRayonDeviceList(storeRayonId)
                return true
            } else {
                MessageBox.show(res.data.message);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    getAllWarehouseRequestGroupWithBasketKey: async (storeCode: string) => {
        try {
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreWarehouseRequest/GetAllWarehouseRequestGroupWithBasketKey/` + storeCode;
            const res = await SystemApi.post<ServiceResponseBase<WarehouseRequestGroupReponseModel[]>>(uri);
            set((state) => ({
                ...state,
                isLoading: false,
            }));
            if (res.data.state === FloResultCode.Successfully) {
                return res.data.model;
            } else {
                return [];
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
            return [];
        }
    },
    addProductList: async (data: StoreWhLabelAddProductListRequestModel) => {
        const { isLoading } = get();
        try {
            if (isLoading) return false;
            set((state) => ({
                ...state,
                isLoading: true,
            }));
            const uri = `StoreWhLabel/AddProductList`;
            const res = await SystemApi.post<ServiceResponseBase<any>>(uri, data);
            if (res.data.state === FloResultCode.Successfully) {
                MessageBox.show(translate("storeWarehouse.operationSuccessful"));
                return true
            } else {
                MessageBox.show(translate("storeWarehouse.problemOccurredDuringDrocessingMessage"));
                // MessageBox.show(res.data.message);
                return false;
            }
        } catch (err: any) {
            return false
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
}));

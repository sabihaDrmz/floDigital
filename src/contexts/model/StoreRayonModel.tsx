export interface StoreWarehouseRequest {
    id: string;
    code: string;
    name: string;
    storeCode: string;
    whType: number;
    order: number;
    createDate: Date;
    isDeleted: boolean;
    isActive: boolean;
    modifiedDate: Date;
}

export interface StoreWarehouseResModel extends StoreWarehouseRequest {
    // title: string;
    // body: string;
    // isRead: boolean;
    // readDate?: any;
    // sendTo: string;
    // dataJson: string;
    // actionType: number;
    // fcmMessageId?: any;
    // appId: string;
    // sendType: number;
    // announcementId?: any;
    // warehouseRequestId: number;
    // announcements?: any;
    // notificationRead?: any[];
    // warehouseRequest: WarehouseRequest;
    // id: number;
    // createDate: Date;
}

export interface StoreWarehouseResUnitModel {
    id: string;
    storeWhId: string;
    code: string;
}

export interface StoreWarehouseResUnitProductModel {
    storeWhId: string;
    storeWhLabelCode: string;
    sku: string;
    quantity?: number | undefined;
}


export interface StoreRayonListModel {
    id: number,
    code: string,
    name: string,
    storeCode: string,
    ryType: number
}

export interface StoreRayonCreateModel {
    code: string,
    name: string,
    ryType: number
}

export interface StoreRayonUpdateModel {
    id: number,
    code: string,
    name: string,
    ryType: number
}

export interface StoreRayonDeviceList {
    id: number,
    code: string,
    name: string,
    storeReyonId: number
}
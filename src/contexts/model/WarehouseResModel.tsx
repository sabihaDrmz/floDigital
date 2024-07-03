export interface WarehouseRequest {
  barcode: string;
  sku: string;
  parentSku: string;
  color: string;
  size: string;
  model: string;
  requestPerson: string;
  requestPersonName: string;
  store: string;
  source: string;
  requestNote: string;
  status: number;
  completeNote: string;
  completePerson: string;
  completePersonName: string;
  id: number;
  createDate: Date;
  productState: 0 | 1;
  cancelReason: string;
}

export interface WarehouseResModel extends WarehouseRequest {
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

export interface WarehouseGetProduct {
  code: string,
  name: string,
  storeCode: string,
  whType: number,
  order: number,
  id: string,
  createDate: string
}
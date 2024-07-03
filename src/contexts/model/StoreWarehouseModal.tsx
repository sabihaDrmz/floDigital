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

export interface StoreWarehouseResModel {
  barcode?: string | null | undefined;
  cancelReason?: string | null | undefined;
  color?: string | null | undefined;
  completeNote?: string | null | undefined;
  completePerson?: string | null | undefined;
  completePersonName?: string | null | undefined;
  createDate?: string | null | undefined;
  id?: number | null | undefined;
  isDigitalStore?: boolean | null | undefined;
  isSalesPersonRequest?: boolean | null | undefined;
  model?: string | null | undefined;
  parentSku?: string | null | undefined;
  productState?: number | null | undefined;
  requestNote?: string | null | undefined;
  requestPerson?: string | null | undefined;
  requestPersonName?: string | null | undefined;
  size?: string | null | undefined;
  sku?: string | null | undefined;
  source?: string | null | undefined;
  status?: number | null | undefined;
  store?: string | null | undefined;
  unitQr?: string | null | undefined;
  whId?: number | null | undefined;
  tableItem?: any
  tableItemDetail?: any
}

export interface StoreWarehouseResUnitModel {
  id: string;
  storeWhId: string;
  code: string;
}

export interface StoreWarehouseResUnitProductModel {
  storeWhId?: string;
  storeWhLabelCode?: string;
  sku?: string;
  quantity?: number | undefined;
}

export interface StoreWarehouseUserExtensionCreateModel {
  userId?: string | null,
  storeCode?: string | null,
  storeReyonUser?: boolean,
  storeReyonId?: string | null,
  storeWarehouseId?: string | null,
  name?: string | null
}

export interface StoreWhLabelAddProductListRequestModel {
  items: Item[];
  storeWhId: number;
}

interface Item {
  barcode: string;
  storeWhLabelCode?: string;
}
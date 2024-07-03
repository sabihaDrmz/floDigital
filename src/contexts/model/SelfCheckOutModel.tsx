export interface SelfCheckOutModel {
  storeInfo: StoreInfo;
  orderInfo: OrderInfo;
  customerInfo: CustomerInfo;
}

export interface CustomerInfo {
  name: string;
  surname: string;
  email: string;
}

export interface OrderInfo {
  totalQty: number;
  total: number;
  list: List[];
}

export interface List {
  sku: string;
  barcode: string;
  brand: string;
  name: string;
  color: string;
  size: string;
  image: string;
  price: number;
  rowTotal: number;
  rowQty: number;
}

export interface StoreInfo {
  name: string;
}

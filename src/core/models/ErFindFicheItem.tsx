export interface ErFindFicheItem {
  basketId: number;
  sku: string;
  parentSKU: string;
  barcode: string;
  quantity: number;
  price: number;
  geniusPrice: string;
  isOmc: boolean;
  productImage: string;
  title: string;
  description: string;
  size: string;
  color: string;
  storeId: number;
  ecomStatus: string;
  ecomStatuscode: string;
}

export interface ErFiche {
  ficheNumber: string;
  orderNo: string;
  store: number;
  sepetId: number;
  phoneNumber: string;
  orderDate: Date;
  nameSurname: string;
  email: string;
  storeId: number;
  storeName: string;
  sumTotal: 0;
  name: string;
  surname: string;
  phone: string;
  eposta: string;
  basketId: 0;
  basketItems: ErFindFicheItem[];
}

export interface ErOrder {
  ficheNumber: string;
  orderNo: string;
  store: 0;
  sepetId: 0;
  phoneNumber: string;
  orderDate: Date;
  nameSurname: string;
  email: string;
  basketItems: ErOrderItem[];
}

export interface ErOrderItem {
  basketId: number;
  sku: string;
  parentSKU: string;
  barcode: string;
  quantity: number;
  price: number;
  geniusPrice: string;
  isOmc: boolean;
  productImage: string;
  title: string;
  description: string;
  size: string;
  color: string;
  ecomStatus: string;
  ecomStatuscode: string;
}

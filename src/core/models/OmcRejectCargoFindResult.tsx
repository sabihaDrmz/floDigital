export interface OmcRejectCargoFindResult {
  order: Order;
  basketItems: BasketItem[];
}

export interface BasketItem {
  id: number;
  basketId: number;
  ecomLineId: number;
  sku: string;
  parentSKU: string;
  barcode: string;
  isEasyReturn: boolean;
  virmanStatusId: number;
  quantity: number;
  price: number;
  isOmc: boolean;
  productImage: string;
  title: string;
  description: string;
  size: string;
  color: string;
  storeStock: number;
  ecomStock: number;
  ecomPrice: number;
  sourceStore: string;
  destinationStore: string;
}

export interface Order {
  newCustomer: boolean;
  sepetId: string;
  musteriId: number;
  basketStatusId: number;
  platformId: number;
  platform: null;
  createdDate: Date;
  aliciAdi: string;
  aliciSoyadi: string;
  adres: string;
  ilce: string;
  il: string;
  telefon: null;
  ficheNumber: string;
  ePosta: null;
  orderId: string;
  storeId: number;
}

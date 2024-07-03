export interface Product {
  barcode: string;
  ecomLineItemId?: any;
  productName: string;
  sku: string;
  picture: string;
  variantNo: string;
  quantity: string;
  color: string;
  size: string;
  productDescription: string;
  price?: any;
  returnItemCount?: any;
  returnPrice: number;
  isCancel: boolean;
  isOmc: boolean;
  kdv: number;
  reasonDetails?: any;
  productGroup?: any;
  productGroupReasonDetails: any[];
  aiuAcceptedQuantity: number
}

export interface ErFindFicheResult {
  orderId?: any;
  customerName: string;
  customerPhone: string;
  gender: string;
  ficheKey: string;
  ficheDate: string;
  totalPrice: number;
  paymentType: string;
  storeNumber?: any;
  storeManagerPhoneList?: any;
  data: Product[];
  ficheRef: string;
  sepetNo?: any;
  sepetId?: any;
  odeme: any[];
}

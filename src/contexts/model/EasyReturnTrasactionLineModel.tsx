export interface EasyReturnTrasactionLineModel {
  id: number;
  transactionId: number;
  barcode: string;
  productName: string;
  productDescription: string;
  sku: string;
  quantity: number;
  colour: string;
  size: string;
  productPrice: number;
  productReturnCount: number;
  productAlreadyReturnCount: number;
  productReturnPrice: number;
  picture: string;
  reasonId?: number;
  kdv?: number;
}

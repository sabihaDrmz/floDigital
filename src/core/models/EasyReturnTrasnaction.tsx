export interface EasyReturnTrasaction {
  id: number;
  ficheNumber: string;
  ficheDate: string;
  ficheTotal: number;
  paymentTypeId: number;

  sellerStore: string;
  inquiryStore: string;
  inquiryPerson: string;

  customerName: string;
  customerGsm: string;

  createDate?: Date;

  processType: TransactionType;
  processTypeSource: TransactionSource;
  status: TransactionState;

  easyReturnTrasactionLine?: EasyReturnTrasactionLine[];
  easyReturnTrasactionLines?: EasyReturnTrasactionLine[];
}

export interface EasyReturnTrasactionLine {
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

export enum TransactionType {
  Return = 1,
  Change,
  Cancel,
  Broken = 5,
  BrokenComplete = 6,
}

export enum TransactionSource {
  WithDocNumber = 1,
  WithDocInquiry,
}

export enum TransactionState {
  Draft = 1,
  Complete,
  Success,
  Error,
}

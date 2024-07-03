import { EasyReturnTrasactionLineModel } from "./EasyReturnTrasactionLineModel";

export interface EasyReturnTrasactionModel {
  id: number;
  ficheNumber: string;
  ficheBarcode: string;
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
  brokenProductDocumentNo: string;

  easyReturnTrasactionLine?: EasyReturnTrasactionLineModel[];
  easyReturnTrasactionLines?: EasyReturnTrasactionLineModel[];
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

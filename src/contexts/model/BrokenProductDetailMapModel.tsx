import { TransactionLineDetailModel } from "./TransactionLineDetailModel";

export interface BrokenProductDetailMapModel {
  index: number;
  barcode: string;
  detail: TransactionLineDetailModel;
}

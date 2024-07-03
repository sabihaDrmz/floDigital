import { DetailImageModel } from "./DetailImageModel";

export interface TransactionLineDetailModel {
  id: number;
  easyReturnTransactionLineId: number;
  reasonId: number;
  description: string;
  isStoreChiefApprove: boolean;
  aIResult: boolean;
  images?: DetailImageModel[];
}

export interface TransactionLineDetail {
  id: number;
  easyReturnTransactionLineId: number;
  reasonId: number;
  description: string;
  isStoreChiefApprove: boolean;
  aIResult: boolean;
  images?: DetailImage[];
}

export interface DetailImage {
  detailId: number;
  image: string;
  id: number;
}

export interface ErSentSmsResult {
  id: number;
  transactionId: number;
  phone: string;
  code: string;
  approveCode: string;
  result: boolean;
}

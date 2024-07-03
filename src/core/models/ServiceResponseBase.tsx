export interface ServiceResponseBase<T> {
  state: FloResultCode;
  message: string;
  model: T;
  isValid: boolean;
  isError: boolean;
}

export enum FloResultCode {
  Undefined,
  Successfully,
  UnSuccessfully,
  Exception,
}

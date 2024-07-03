export interface OmsResponseBase<T> {
  Data: T;
  Messages: any;
  Status: number;
}

export interface EasyReturnReasonModel {
  id: number;
  name: string;
  conditionId: EasyReturnEventType;
  subId: number;
}

export enum EasyReturnEventType {
  BrokenProductEvent = 1,
  ChangeProductEvent = 2,
  WrongProcutEvent = 3,
}

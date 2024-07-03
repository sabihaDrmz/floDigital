export interface OmsOrderModel {
  OrderNo: string;
  ID: number;
  CreateDate: Date;
  ProductCount: number;
  picklistCount: number;
  ChannelCode: string;
  Duration: number;
  Remainder: number;
  DurationName: string;
  SourceCode: string;
  StatusID: number;
  OrderItems: OmsOrderDetail[];
}

export interface OmsOrderDetail {
  ID: number;
  Brand: string;
  ModelName: string;
  Color: string;
  Category: string;
  BodySize: string;
  Quantity: string;
  BarcodeNo: string;
  ProductBarcode: string;
  ProductBarcodes?: any;
  SKUNo: string;
  CurrentStock?: any;
  OrderNo: string;
  OrderID: number;
  ProductNo: string;
  OrderStatusID: string;
  StoreCode: string;
  StoreName: string;
  ImageUrl: string;
  ProductStatus?: any;
  ProductStatusImage?: any;
  ProductStatusDescription: string;
  IsPackaged?: any;
  CreateDate: Date;
  CreatedDate?: any;
  LeftHours: number;
  IsPrinted: boolean;
  NotFoundProductPrintStatusID: number;
  OrderItemID?: any;
  IsGift: number;
  GiftNote?: any;
  FoundCount: number;
  StoreIP?: any;
  CargoCompany?: any;
  Desi: number;
  ChannelCode: string;
  SourceCode: string;
}

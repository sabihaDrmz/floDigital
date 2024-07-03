export interface ProductBarcode {
  ID: number;
  SKUNo: string;
  BarcodeNo: string;
}

export interface PackageOrder {
  ID: number;
  Brand: string;
  ModelName: string;
  Color: string;
  Category: string;
  BodySize: string;
  Quantity: string;
  BarcodeNo: string;
  ProductBarcode: string;
  ProductBarcodes: ProductBarcode[];
  SKUNo: string;
  CurrentStock?: any;
  OrderNo: string;
  OrderID: number;
  ProductNo: string;
  OrderStatusID: string;
  StoreCode: string;
  StoreName: string;
  ImageUrl: string;
  ProductStatus: boolean;
  ProductStatusImage?: any;
  ProductStatusDescription: string;
  SourceCode?: any;
  IsPackaged?: any;
  CreateDate: Date;
  CreatedDate?: any;
  LeftHours: number;
  IsPrinted: boolean;
  NotFoundProductPrintStatusID: number;
  OrderItemID?: any;
  IsGift: number;
  GiftNote: string;
  FoundCount: number;
  StoreIP: string;
  CargoCompany: string;
  Desi: number;
  ChannelCode: string;
  ChannelCargoCode: string;
}

export interface OmsPackageModel {
  OrderNo: string;
  TotalCount: number;
  CompletedCount: number;
  IsAllOrderPackaged: boolean;
  IsWayBill: boolean;
  IsOrderDesi: boolean;
  IsGibMatbu: boolean;
  IsSentGib: boolean;
  OrderDesi?: any;
  IsGift: number;
  StoreIP: string;
  Orders: PackageOrder[];
  IsPackaged: boolean;
}

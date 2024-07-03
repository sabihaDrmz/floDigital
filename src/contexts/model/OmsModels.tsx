export interface HistoryOrder {
  OrderNo: string;
  Action: string;
  ActionID: number;
  ActionByName: string;
  ActionDate: Date;
  Duration: number;
  ActionFinishDate: Date;
  CargoRecDate: Date;
  Atf: string;
}

export interface OrderChartStats {
  OrderNo: string;
  Status1: number;
  Status2: number;
  Status3: number;
}

export interface OrderHistoryModel {
  Orders: HistoryOrder[];
  OrderStats: HistoryOrder[];
  HistoryCharts: OrderChartStats[];
}
export interface NotFoundProductModel {
  BarcodeNo: string;
  BodySize: string;
  Brand: string;
  CargoCompany?: any;
  Category: string;
  ChannelCode?: any;
  Color: string;
  CreateDate: Date;
  CreatedDate: Date;
  CurrentStock?: any;
  Desi: number;
  FoundCount: number;
  GiftNote?: any;
  ID: number;
  ImageUrl: string;
  IsGift: number;
  IsPackaged?: any;
  IsPrinted: boolean;
  LeftHours: number;
  ModelName: string;
  NotFoundProductPrintStatusID: number;
  OrderID: number;
  OrderItemID: number;
  OrderNo: string;
  OrderStatusID: string;
  ProductBarcode: string;
  ProductBarcodes?: any;
  ProductNo: string;
  ProductStatus: boolean;
  ProductStatusDescription: string;
  ProductStatusImage: string;
  Quantity: string;
  Remainder: number;
  SKUNo: string;
  SourceCode?: any;
  StoreCode: string;
  StoreIP?: any;
  StoreName: string;
  ActionDate?: Date;
}

export interface OrderItemDetail {
  BarcodeNo: string;
  Brand: string;
  Color: string;
  BodySize: string;
  Quantity: number;
}

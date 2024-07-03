export interface TagValue {
    key: string;
    tag: string;
    title: string;
    value: string | null;
  }
export interface QrResponse {
    generic: string;
    gtin: string;
    guid: string;
    message: string | null;
    qrCode: string;
    qrCodeId: string | null;
    serialNo: string;
    size: string;
    tagValueList: TagValue[]; // İçerik belirtilmemiş, gerekirse daha sonra detaylandırılabilir
  }
  
 export interface QrResponseList {
    qrResponseList: QrResponse[];
  }

 export interface QrCodeResponse {
    description: string;
    error: string;
    qrCodeId: number;
    barcodeOrEan: string;
    isSucces: boolean;
  }
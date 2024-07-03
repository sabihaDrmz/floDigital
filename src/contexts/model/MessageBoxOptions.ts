import { ColorType } from "@flomagazacilik/flo-digital-components";

export enum MessageBoxType {
  Standart,
  YesNo,
  BasketNumber,
  SmsValidation,
  Validation,
  StockOutValidation,
  OmsComplete,
  OrderNotFound,
  ErScanAllProduct,
  ErQuantityChange,
  ErShipping,
  ErVirement,
  IsoReturnCode,
  PrinterType
}

export interface MessageBoxOptions {
  /**
   * MessageBox Türü
   * 1- Standart
   * 2- Yes No
   * 3- Sepet Numarası
   * 4- Sms Doğrulama
   * 5- Doğrulama
   * 6- Stok yok devam etmek istiyormusun
   * 7- Oms Toplama
   * 8- Sipariş Bulunamadı
   */
  type?: MessageBoxType;
  /**
   * Açıklama Metni
   */
  customParameters?: any;
  /**
   * Özel ikon
   */
  icon?: any;
  /**
   * Tamam buton text
   */
  yesButtonTitle?: string;
  /**
   * Vazgeç buton text
   */
  noButtonTitle?: string;
  /**
   * Tamam butonuna tıklanırsa yaptırılacak işlem
   */
  yesButtonEvent?: (params?: any) => void;
  /**
   * Vazgeç butonuna tıklanırsa yaptırılacak işlem
   */
  noButtonEvent?: () => void;
  yesButtonColorType?: ColorType;
  noButtonColorType?: ColorType;
  /**
   * Özel sms doğrulama süresi
   */
  customSmsValidationTime?: number;
  /**
   * Tekrar sms gönder tıklandığında yapılacak işlem
   */
  reSendSms?: () => void;
  /**
   * Doğrulama işlemi yapıldığında yapılacak işlem
   */
  onValidate?: (validationCode: string) => void;

  customMessage?: React.ReactFragment;
  /**
   * Gizlenirken yapılacak işlem
   */
  onHide?: () => void;
}

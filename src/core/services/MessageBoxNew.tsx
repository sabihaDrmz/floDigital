import { ColorType } from "@flomagazacilik/flo-digital-components";
import { action, makeAutoObservable, observable } from "mobx";
import { MessageBoxType } from "./MessageBox";

class MessageBoxNew {
  @observable options?: MessageBoxOptions;
  @observable isShow: boolean = false;
  @observable message: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  @action show = (message: string, options?: MessageBoxOptions) => {
    this.isShow = true;
    this.message = message;
    this.options = options;
  };

  @action hide = () => {
    this.isShow = false;
    this.message = "";

    if (this.options !== undefined && this.options.onHide !== undefined) {
      setTimeout(this.options.onHide, 200);
    }
    this.options = undefined;
  };
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
  icon?: React.ReactFragment;
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
  onValidate?: () => void;

  customMessage?: React.ReactFragment;

  /**
   * Gizlenirken yapılacak işlem
   */
  onHide?: () => void;
}

export default new MessageBoxNew();

import { ColorType } from "@flomagazacilik/flo-digital-components";
import {
  action,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { translate } from "../../helper/localization/locaizationMain";

class MessageBox {
  @observable isShow: boolean = false;
  @observable buttonType: MessageBoxType = 0;
  @observable title: MessageBoxDetailType = 0;
  @observable message: string = "23472397523546|image";
  @observable timeLeft: number = 5;
  @observable onComplete: any | undefined = undefined;
  @observable onCancelled: any | undefined = undefined;
  @observable onValidate: any | undefined = undefined;
  @observable onResend: any | undefined = undefined;
  @observable timer: NodeJS.Timeout | undefined = undefined;
  @observable yesButton: string = translate("messageBox.delete");
  @observable noButton: string = translate("messageBox.cancel");
  @action Hide() {
    this.isShow = false;
    this.title = 0;
    this.message = "";
    if (this.timer) clearInterval(this.timer);

    this.yesButton = translate("messageBox.delete");
    this.noButton = translate("messageBox.cancel");
  }

  @action Show(
    message: string,
    title: MessageBoxDetailType = MessageBoxDetailType.Warning,
    buttonType: MessageBoxType = MessageBoxType.Standart,
    onComplete: () => void,
    onCancelled: () => void,
    onValidate?: (validationCode: string) => void,
    onResend?: () => void
  ) {
    this.isShow = true;
    this.message = message;
    this.title = title;
    this.buttonType = buttonType;
    this.onComplete = onComplete;
    this.onCancelled = onCancelled;
    this.onValidate = onValidate;
    this.onResend = onResend;

    if (buttonType === MessageBoxType.SmsValidation) {
      this.timeLeft = 180;

      if (this.timer !== undefined) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        runInAction(() => {
          this.timeLeft -= 1;

          if (this.timeLeft === 0 && this.timer) clearInterval(this.timer);
        });
      }, 1000);
    }
  }

  constructor() {
    makeAutoObservable(this);
  }

  @observable options?: MessageBoxOptions = {};
  show = (message: string, options?: MessageBoxOptions) => {
    this.isShow = true;
    this.message = message;
    this.options = options;

    if (
      this.options &&
      this.options.type !== undefined &&
      this.options.type === MessageBoxType.SmsValidation
    ) {
      this.startSmsTimer(this.options.customSmsValidationTime);
    }
  };

  private startSmsTimer = (customValidationTime?: number) => {
    this.timeLeft =
      customValidationTime !== undefined ? customValidationTime : 180;

    this.timer = setInterval(() => {
      runInAction(() => {
        this.timeLeft -= 1;

        if (this.timeLeft === 0 && this.timer) clearInterval(this.timer);
      });
    }, 1000);
  };
}

export default new MessageBox();

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
   * Özel ikon
   */
  icon?: React.ReactNode;
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
  yesButtonEvent?: () => void;
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
}

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
  PrinterType
}

export enum MessageBoxDetailType {
  Warning,
  Information,
  Danger,
}

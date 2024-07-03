import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { translate } from "../helper/localization/locaizationMain";
import {
  FloResultCode,
  ServiceResponseBase,
} from "./models/ServiceResponseBase";
import AccountService from "./services/AccountService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "./services/MessageBox";
import VersionService from "./services/VersionService";
import { GetServiceUri, ServiceUrlType } from "./Settings";

const FloDigitalErrorParse = (
  error: {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<ServiceResponseBase<any>>;
    isAxiosError: boolean;
    toJSON: () => object;
  },
  onComplete?: () => void
) => {
  // if (error.response?.status === 401) {
  //   MessageBox.Show(
  //     translate("errorMsgs.sessionTimeout"),
  //     MessageBoxDetailType.Danger,
  //     MessageBoxType.Standart,
  //     () => {},
  //     () => {}
  //   );
  //   AccountService.logOut();
  //   return;
  // }
  // Hata mesajı döndü
  // if (error.response?.status === 409) {
  //   MessageBox.Show(
  //     error.response.data.message,
  //     MessageBoxDetailType.Danger,
  //     MessageBoxType.Standart,
  //     () => {},
  //     () => {}
  //   );
  //   return;
  // }
  // Sunucu hatası
  // MessageBox.Show(
  //   translate("errorMsgs.unexceptedError"),
  //   MessageBoxDetailType.Danger,
  //   MessageBoxType.Standart,
  //   () => {},
  //   () => {}
  // );
};

function FloDigitalResponseParser<T = any>(
  response: AxiosResponse<ServiceResponseBase<T>>,
  onComplete?: (response: T) => void,
  customMessage?: string
) {
  if (response.data.state === FloResultCode.Successfully && onComplete) {
    onComplete(response.data.model);
  } else if (response.data.state === FloResultCode.Exception) {
    MessageBox.Show(
      customMessage !== undefined ? customMessage : response.data.message,
      MessageBoxDetailType.Danger,
      MessageBoxType.Standart,
      () => {},
      () => {}
    );
  } else if (response.data.state === FloResultCode.UnSuccessfully) {
    MessageBox.Show(
      customMessage !== undefined ? customMessage : response.data.message,
      MessageBoxDetailType.Danger,
      MessageBoxType.Standart,
      () => {},
      () => {}
    );
  }
}

const MakeRequestOptions = () => {
  return { headers: AccountService.tokenizeHeader() };
};
export { FloDigitalErrorParse, MakeRequestOptions, FloDigitalResponseParser };

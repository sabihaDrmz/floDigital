import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { FloDigitalErrorParse } from "./HttpModule";
import {
  FloResultCode,
  ServiceResponseBase,
} from "./models/ServiceResponseBase";
import AccountService from "./services/AccountService";
import MessageBoxNew from "./services/MessageBoxNew";

export class HttpHelper {
  public static async Get<T>(uri: string, config?: AxiosRequestConfig) {
    try {
      var result = await axios.get<ServiceResponseBase<T>>(uri, {
        ...config,
        headers: AccountService.tokenizeHeader(),
      });

      if (result.data.state !== FloResultCode.Successfully) {
      }

      return result.data;
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  }

  public static async Post<T>(
    uri: string,
    data: any,
    config?: AxiosRequestConfig
  ) {
    var result = await axios.post<ServiceResponseBase<T>>(uri, data, {
      ...config,
      headers: AccountService.tokenizeHeader(),
    });

    if (result.data.state !== FloResultCode.Successfully) {
    }

    return result.data;
  }

  public static async Put<T>(
    uri: string,
    data: any,
    config?: AxiosRequestConfig
  ) {
    var result = await axios.put<ServiceResponseBase<T>>(uri, data, {
      ...config,
      headers: AccountService.tokenizeHeader(),
    });

    if (result.data.state !== FloResultCode.Successfully) {
    }

    return result.data;
  }

  public static async Delete<T>(uri: string, config?: AxiosRequestConfig) {
    var result = await axios.delete<ServiceResponseBase<T>>(uri, {
      ...config,
      headers: AccountService.tokenizeHeader(),
    });

    if (result.data.state !== FloResultCode.Successfully)
      this.ParseError(result.data.state, result.data.message);

    return result.data;
  }

  private static ParseError(state: FloResultCode, message: string) {
    switch (state) {
      case FloResultCode.Exception:
      case FloResultCode.UnSuccessfully:
        MessageBoxNew.show(message);
        break;
    }
  }
}

export const AxiosCancelToken = axios.CancelToken.source();
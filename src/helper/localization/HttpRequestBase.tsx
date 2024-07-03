import axios, {AxiosRequestConfig} from 'axios';
import React from 'react';
import {
  FloResultCode,
  ServiceResponseBase,
} from '../../core/models/ServiceResponseBase';

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

async function Post<T = any>(
  url: string,
  data?: any,
  configuration?: AxiosRequestConfig,
) {
  try {
    let response = await axios.post<ServiceResponseBase<T>>(
      url,
      data,
      configuration,
    );

    if (response.data.state === FloResultCode.Successfully) {
      return response.data.model;
    } else if (response.data.state === FloResultCode.Exception) {
    } else if (response.data.state === FloResultCode.Undefined) {
    } else if (response.data.state === FloResultCode.UnSuccessfully) {
    }
  } catch (err) {}
}
function Get<T = any>(url: string) {}

export {Post};

import {EasyReturnTrasaction} from './EasyReturnTrasnaction';

export interface BrokenProductSearchModel {
  sapResult: BrokenProductSapResult;
  easyReturnTransaction: EasyReturnTrasaction;
  images?: string;
}

export type BrokenProductSapResult = {
  uruN_TAKIP_NO: string;
  karar: string;
  karaR_TEXT: string;
  soN_ISTASYON: string;
  istasyoN_TEXT: string;
  depoyA_GELIS_TARIHI: string;
  depoyA_GELIS_SAATI: string;
  soN_HAREKET_TARIHI: string;
  magazA_KODU: string;
  mgZ_MUSTERI_ADI: string;
  uruN_KODU: string;
  uruN_ADI: string;
  uruN_MARKASI: string;
  uruN_ACIKLAMASI: string;
  iadE_SEBEBI: string;
  hatA_DETAYI: string;
  mgZ_UIB_NO: string;
  mgZ_MUSTERI_TEL: string;
  iadE_TARIHI: string;
};
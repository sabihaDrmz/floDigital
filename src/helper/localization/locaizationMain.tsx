import I18n from "i18n-js";
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";

import { tr } from "./lang/_tr";
import { en } from "./lang/_en";
import { ru } from "./lang/_ru";
import { fr } from "./lang/_fr";
import { kk } from "./lang/_kk";
import moment from "moment";

const locales = Localization.locales;
I18n.locale = Localization.locale;
export const isRtl = Localization.isRTL;
I18nManager.forceRTL(isRtl);
I18n.locales.no = "en";
I18n.translations = {
  tr,
  en,
  ru,
  fr,
  kk,
};
I18n.fallbacks = true;

moment().locale(Localization.locale);

export function translate(
  scope: string | string[],
  options?: I18n.TranslateOptions | undefined
): string {
  return I18n.translate(scope, options);
}

export function toCurrency(n?: number | string): string {
  let num = n !== undefined ? n : 0;
  return I18n.toCurrency(Number(num));
}

export function getLocale() {
  return I18n.currentLocale();
}

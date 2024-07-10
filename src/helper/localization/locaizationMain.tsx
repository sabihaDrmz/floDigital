import i18n from 'i18next';
//TODO: EXPO localization
// import * as Localization from "expo-localization";
import { getLocales } from "react-native-localize";
import {initReactI18next} from 'react-i18next';

import { I18nManager } from "react-native";

import { tr } from "./lang/_tr";
import { en } from "./lang/_en";
import { ru } from "./lang/_ru";
import { fr } from "./lang/_fr";
import { kk } from "./lang/_kk";
import moment from "moment";

//const locales = Localization.locales;
//I18n.locale = getLocales()[0]?.languageCode?? 'en';
//export const isRtl = Localization.isRTL;
//I18nManager.forceRTL(isRtl);
//I18n.locales.no = "en";
/*I18n.translations = {
  tr,
  en,
  ru,
  fr,
  kk,
};
I18n.fallbacks = true;


 */
//TODO: EXPO Localization
 moment().locale(getLocales()[0].languageCode);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: getLocales()[0].languageCode,
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en,
    },
    tr: {
      translation: tr,
    },
    ru: {
      translation: ru,
    },
    fr: {
      translation: fr,
    },
    kk: {
      translation: kk,
    }

  },
});
export function translate(
  scope: string | string[],
  options?: I18n.TranslateOptions | undefined
): string {
 return i18n.t(scope, options);
}

export function toCurrency(n?: number | string): string {
  let num = n !== undefined ? n : 0;
  return I18n.toCurrency(Number(num));
}

export function getLocale() {
  return I18n.currentLocale();
}

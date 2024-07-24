import { useApplicationGlobal } from "contexts/ApplicationGlobalContext";
import { useUser } from "contexts/UserContext";
import React from "react";
import { Linking, Platform } from "react-native";

export const RNExitAppCustom = null ;

export function tokenizeHeader(st: any) {
  var token = st.get("accountInfo");
  var cid = st.get("cid");

  return { Authorization: token, cid: cid };
}

export function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export function guid() {
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

export function toOrganizationScheme(expenseCentre: string) {
  // 10M4126
  if (expenseCentre?.length > 3) {
    var storeId = Number(expenseCentre.substring(3));

    return storeId >= 6000 && storeId <= 6550
      ? 2
      : storeId >= 7500 && storeId <= 7550
      ? 3
      : 1;
  } else return -1;
}

export function toOrganization(expenseCentre: string, store: any) {
  if (
    store &&
    store.salesOrg !== undefined &&
    store.salesOrg !== null &&
    store.salesOrg !== ""
  )
    return store.salesOrg;

  if (expenseCentre?.length > 3) {
    var sid = expenseCentre.substring(0, 3);
    switch (sid) {
      case "10M":
      case "11M": // FLO
        return "1001";
      case "15M": // SIS
        return "1500";
      case "17M": // NW
        return "2101";
      case "90M":
      case "91M":
        return "5001";
      case "85M":
        return "8541";
      default:
        return "1001";
    }
  } else return "-1";
}

export function chekcAuthError(error: any) {
  return error?.response?.status === 401;
}

export function toCensorText(text: string): string {
  var txtSplist = text.split(" ");

  let string = "";
  txtSplist.map((t) => {
    if (t.length > 2) {
      if (t.includes("@")) {
        let m = t.split("@");
        let cenText = m[0].substring(2);
        string += t.substring(0, 2) + genStart(cenText.length) + "@" + m[1];
      } else {
        if (t.length > 5) {
          let cenText = t.substring(2);
          string +=
            t.substring(0, 2) +
            genStart(cenText.length - 2) +
            t.substring(cenText.length, cenText.length - 4) +
            " ";
        } else {
          let cenText = t.substring(2);
          string += t.substring(0, 2) + genStart(cenText.length) + " ";
        }
      }
    } else {
      let cenText = t.substring(1);
      string += t.substring(0, 1) + genStart(cenText.length) + " ";
    }
  });

  return string;
}

function genStart(len: number) {
  let star = "";

  for (var i = 0; i < len; i++) star += "*";
  return star;
}

export function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}

export const openGps = (lat: any, lng: any, storeName: any) => {
  console.log('lat:', lat);
  console.log('lng:', lng)
  const scheme = Platform.select({
    ios: "maps://0,0?q=",
    android: "geo:0,0?q=",
  });
  const latLng = `${lat},${lng}`;
  const label = storeName;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  if (url) Linking.openURL(url);
};

export const playSound = (soundPath:any) => {

};

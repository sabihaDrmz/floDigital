import { translate } from "./localization/locaizationMain";

export const DurationParse = (duration: number) => {
  const seconds = duration * 60;
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  return { d, h, m, s };
};

export const durationToString = (duration: number) => {
  const { d, h, m, s } = DurationParse(duration);

  var sD = d > 0 ? d + " " + translate("OmsOrders.day") + " " : "";
  var sH = h > 0 ? h + " " + translate("OmsOrders.hour") + " " : "";
  var sM =
    m > 0
      ? m + " " + translate("OmsOrders.min") + " "
      : d < 1 && h < 0
      ? translate("OmsOrders.justNow")
      : "";
  return `${sD}${sH}${sM}`;
};

import { PixelRatio, Platform } from "react-native";

export const PerfectPixelSize = (size: number) => {
  if (Platform.OS === "web") return size;
  let ratio = PixelRatio.get();
  if (ratio === 3) return size;
  if (ratio > 3) {
    return size * (ratio / 4);
  } else {
    return size * (ratio / 3);
  }
};

export const PerfectFontSize = (size: number) => {
  let ratio = PixelRatio.getFontScale();
  return size / ratio;
};

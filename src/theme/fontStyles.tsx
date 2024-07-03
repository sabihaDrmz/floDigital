import { StyleProp } from "react-native";
import { FontStyleProp } from "./FontStyleProp";

const ExtraLight: StyleProp<FontStyleProp> = {
  fontFamily: "Poppins_200ExtraLight",
};

const Light: StyleProp<FontStyleProp> = {
  fontFamily: "Poppins_300Light",
};

const Medium: StyleProp<FontStyleProp> = {
  fontFamily: "Poppins_500Medium",
};

const Regular: StyleProp<FontStyleProp> = {
  fontFamily: "Poppins_400Regular",
};

const SemiBold: StyleProp<FontStyleProp> = {
  fontFamily: "Poppins_600SemiBold",
};

const Bold: StyleProp<FontStyleProp> = {
  fontFamily: "Poppins_700Bold",
};

export const fontFamilies = {
  ExtraLight,
  Light,
  Medium,
  Bold,
  SemiBold,
  Regular,
};

import React, { ReactNode } from "react";
import { StyleSheet, Platform, StyleProp, ViewProps } from "react-native";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import FloHeaderNew from "./FloHeaderNew";

interface CustomButtonAction {
  buttonType:
    | "back"
    | "close"
    | "basket"
    | "findBarcode"
    | "profile"
    | "notification"
    | "profilePic";
  customAction: () => void;
}

interface FloHeaderProps {
  headerType: "standart" | "search" | "searchtab";
  enableButtons?: (
    | "back"
    | "close"
    | "basket"
    | "findBarcode"
    | "profile"
    | "notification"
    | "profilePic"
  )[];
  data?: any[];
  ignoreKeys?: string[];
  onSearch?: (query: string) => void;
  onFilterData?: (data: any[]) => void;
  showLogo?: boolean;
  headerTitle?: string;
  placeholder?: string;
  //TODO: Özelleştirilmiş buton işlemleri buton aksiyonlarına bağlanacak
  customButtonActions?: CustomButtonAction[];
  tabs?: any[];
  tabActiveStyle?: StyleProp<ViewProps>;
  tabTextActiveStyle?: StyleProp<ViewProps>;
  tabInActiveStyle?: StyleProp<ViewProps>;
  tabInTextActiveStyle?: StyleProp<ViewProps>;
  tabsScreen?: ReactNode[];
  onChangeTab?: (index: number) => void;
}

export const STANDART_HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 54;
export const SEARCH_HEADER_HEIGHT = Platform.OS === "ios" ? 120 : 110;
export const SEARCH_TAB_HEADER_HEIGHT = Platform.OS === "ios" ? 180 : 170;

const FloHeader: React.FC<FloHeaderProps> = (props) => {
  return <FloHeaderNew onChangeTab={props.onChangeTab} {...props} />;
};
export default FloHeader;

//#region  Style
const styles = StyleSheet.create({
  buttonLeft: { marginRight: 10 },
  buttonRight: { marginLeft: 10 },
  standartContainer: {
    backgroundColor: "#FFF",
    paddingTop: 0,
    height: STANDART_HEADER_HEIGHT,
    shadowColor: "#828287",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 4,
  },
  standartContentWrapper: {
    backgroundColor: "#fff",
    height: STANDART_HEADER_HEIGHT - 1,
    flexDirection: "row",
    ...Platform.select({
      ios: {
        marginLeft: 18,
        marginRight: 18,
      },
      android: {
        marginLeft: 18,
        marginRight: 18,
      },
      windows: {
        marginLeft: 18,
        marginRight: 18,
      },
    }),
    justifyContent: "space-between",
  },

  searchContainer: {
    backgroundColor: "#FFF",
    paddingTop: 0,
    height: SEARCH_HEADER_HEIGHT,
    shadowColor: "#828287",
    shadowOffset: { width: 1, height: 3 },
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    marginBottom: 10,
  },
  searchContentWrapper: {
    backgroundColor: "#fff",
    height: STANDART_HEADER_HEIGHT - 1,
    alignItems: "center",
    flexDirection: "row",
    ...Platform.select({
      ios: {
        marginLeft: 18,
        marginRight: 18,
      },
      android: {
        marginLeft: 18,
        marginRight: 18,
      },
      windows: {
        marginLeft: 18,
        marginRight: 18,
      },
    }),
    justifyContent: "space-between",
  },

  searchTabContainer: {
    backgroundColor: "#FFF",
    paddingTop: 0,
    shadowColor: "#828287",
  },
  searchTabContentWrapper: {
    backgroundColor: "#fff",
    height: STANDART_HEADER_HEIGHT - 1,
    alignItems: "center",
    flexDirection: "row",

    ...Platform.select({
      ios: {
        marginLeft: 18,
        marginRight: 18,
      },
      android: {
        marginLeft: 18,
        marginRight: 18,
      },
      windows: {
        marginLeft: 18,
        marginRight: 18,
      },
    }),
    justifyContent: "space-between",
  },
  tabContainer: {
    marginTop: 10,
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  tabHeader: {
    width: "50%",
    borderBottomColor: colors.inActive,
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  tabHeaderActive: {
    borderBottomColor: colors.brightOrange,
  },
  tabHeaderText: {
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(16),
    fontWeight: "700",
    color: colors.inActive,
  },
  tabHeaderTextActive: {
    color: colors.brightOrange,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logoContainer: {},
  searchBarContainer: {
    marginBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    maxHeight: 40,
    minHeight: 40,
  },
  searchBar: {
    backgroundColor: colors.gray,
    borderRadius: 12,
    padding: 0,
    ...Platform.select({
      ios: {
        height: 40,
        justifyContent: "center",
      },
    }),
  },
  searchBarIcon: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  searchBarTextInput: {
    paddingLeft: 40,
    fontSize: PerfectFontSize(14),
  },
});

//#endregion

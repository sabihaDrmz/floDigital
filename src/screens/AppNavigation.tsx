import React, { Component } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Stack, Scene, Router, Actions } from "react-native-router-flux";
import { colors } from "../theme/colors";
import LoginScreen from "./Auth/LoginScreen";
import HomeScreen from "./main/HomeScreen";
import {
  FontAwesome,
  Foundation,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { translate } from "../helper/localization/locaizationMain";
import CrmMainScreen from "./CRM/CrmMainScreen";
import ProfileScreen from "./Auth/ProfileScreen";
import AppMain from "./AppMain";
import ProfileDetailScreen from "./Auth/ProfileDetailScreen";
import EasyReturnCameraScreen from "./EasyReturn/EasyReturnCameraScreen";
import IsoBarcodeCheck from "./ISO/IsoBarcodeCheck";
import IsoCamera from "./ISO/IsoCamera";
import IsoBasket from "./ISO/IsoBasket";
import IsoBasketList from "./ISO/IsoBasketList";
import IsoAddressList from "./ISO/IsoAddressList";
import IsoNewAddress from "./ISO/IsoNewAdress";
import IsoProduct from "./ISO/IsoProduct";
import IosPrinterConfig from "./Printer/IosPrinterConfig";
import AndroidPrinterConfig from "./Printer/AndroidPrinterConfig";
import MessageBoxModal from "../components/Modal/MessageBoxModal";
import CaseDetailScreen from "./CRM/CaseDetailScreen";
import TabBar from "../components/BottomTabBar/TabBar";
import MainScreen from "./main/MainScreen";
import IntroScreen from "./Intro/IntroScreen";
import CrmNavScreen from "./CRM/CrmNavScreen";
import CrmFindOrder from "./CRM/CrmFindOrderScreen";
import CrmOrderDetail from "./CRM/CrmOrderDetailScreen";
import FloDrawerComponent from "../components/FloDrawerComponent";
import { PerfectFontSize } from "../helper/PerfectPixel";
import CrmDetailCustomerComplaint from "./CRM/CrmDetailCustomerComplaint";
import CrmCreateCustomerComplatint from "./CRM/CrmCreateCustomerComplatint";
import CrmCustomerComplaintList from "./CRM/CrmCustomerComplaintList";
import OmsMain from "./OMS/OmsMain";
import OmsPick from "./OMS/OmsPick";
import LinkScreen from "./main/LinkScreen";
import OmsPackage from "./OMS/OmsPackage";
import CancellationScreen from "./Cancellation/CancellationScreen";
import BackCargoScreen from "./Cancellation/BackCargoScreen";
import CancelFromStore from "./Cancellation/CancelFromStore";
import CancelList from "./Cancellation/CancelList";
import CancelListComplete from "./Cancellation/CancelListComplete";
import MessageboxNewModal from "../components/Modal/MessageBoxModalNew";
import FindFicheScreen from "./Cancellation/FindFicheScreen";
import FindFicheListScreen from "./Cancellation/FindFicheListScreen";
import SearchFiche from "./Cancellation/EasyReturn/SearchFiche";
import ErFindFiche from "./Cancellation/EasyReturn/ReturnedProduct/FindFiche";
import BrFindFiche from "./Cancellation/EasyReturn/BrokenProduct/FindFiche";
import ErFicheProductList from "./Cancellation/EasyReturn/ReturnedProduct/FicheProductList";
import BrFicheProductList from "./Cancellation/EasyReturn/BrokenProduct/FicheProductList";
import ErFichePaymentResult from "./Cancellation/EasyReturn/ReturnedProduct/FichePaymetResult";
import FicheResult from "./Cancellation/EasyReturn/FicheResult";
import BrokenComplete from "./Cancellation/EasyReturn/BrokenProduct/BrokenComplete";
import BrokenProductResult from "./Cancellation/EasyReturn/BrokenProduct/BrokenProductResult";
import BrokenFichePaymentResult from "./Cancellation/EasyReturn/BrokenProduct/BrokenFichePaymetResult";
import Animated from "react-native-reanimated";
import { Host } from "react-native-portalize";
import FullScreenImage from "../components/FullScreenImage";
import WarehouseRequestScreen from "./Warehouse/WarehouseRequestScreen";
import ListAuiDocScreen from "./Cancellation/EasyReturn/PrinterEvent/ListAuiDocScreen";
import VersionErrorModal from "../components/Modal/VersionErrorModal";
import IsoProductQrPreview from "./ISO/IsoProductQrPreview";
import IsoKzCamera from "./ISO/IsoKzCamera";
import PathfinderScreen from "./Printer/PathfinderScreen";
import AccountService from "../core/services/AccountService";
import { toOrganizationScheme } from "../core/Util";
import ApplicationGlobalService from "../core/services/ApplicationGlobalService";
import BrokenProductFicheListWithPhone from "./Cancellation/EasyReturn/BrokenProduct/BrokenProductFicheListWithPhone";
import CrmSearchFiche from "./CRM/CrmSearchFiche";
import ReportScreen from "./PowerBi/ReportScreen";
import ReportList from "./PowerBi/ReportList";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AppNavRoles = [{ tbFindBarcode: 8 }];

type AppNavigationProps = {
  isEnable?: boolean;
  applicationState?: any;
};
class AppNavigation extends Component<AppNavigationProps> {
  componentDidMount() {
    if (Platform.OS === "android")
      BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    if (Platform.OS === "android")
      BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress() {
    if (
      //@ts-expect-error
      Actions.state.index === 0 &&
      (Actions.currentScene === "mainStack" ||
        Actions.currentScene === "authStack" ||
        Actions.currentScene === "_scTbHome")
    ) {
      BackHandler.exitApp();
      return false;
    } else if (Actions.currentScene === "foundProduct") {
      Actions.reset("mainStack");
    }

    Actions.pop();
    return true;
  }

  render() {
    return (
      <Host>
        <React.Fragment>
          <StatusBar barStyle={"dark-content"} />
          <Router sceneStyle={{ backgroundColor: "rgb(246,246,246)" }}>
            <Stack key="root">
              <Scene
                hideNavBar
                key="reportScreen"
                component={ReportList}
              ></Scene>
              <Scene
                hideNavBar
                key="reportDetail"
                component={ReportScreen}
              ></Scene>
              {this._renderSplashScreen()}
              {this._renderIntroStack()}
              {this._renderAuthStack()}
              {this._renderOmsStack()}
              {this._renderCrmStack()}
              {this._renderPrinterConfig()}
              {this._renderProfileScreen()}
              {this._renderProfileDetailScreen()}
              {this._renderTabButtons()}
              {this._renderEasyReturnStack()}
              <Scene hideNavBar key={"listprint"}>
                <Scene key={"listPrintAui"} component={ListAuiDocScreen} />
              </Scene>
              {this._renderReturnedProductStack()}
              {this._renderBrokenProductStack()}
              {this._renderAnnounceScreen()}
              <Scene
                key="scWarehouseRequest"
                component={WarehouseRequestScreen}
                hideNavBar
              />
              {this._helpScreenStack()}
            </Stack>
          </Router>
          {/* <PatcherModal /> */}
          <MessageBoxModal />
          <MessageboxNewModal />
          <FloDrawerComponent />
          <FullScreenImage />
          <VersionErrorModal />
        </React.Fragment>
      </Host>
    );
  }

  _renderOmsStack = () => {
    return (
      <Scene hideNavBar key={"omsStack"}>
        <Scene key={"omsDb"} component={OmsMain} />
        <Scene key={"omsPick"} component={OmsPick} />
        <Scene key={"omsPackage"} component={OmsPackage} />
        <Scene key={"omsCamera"} component={EasyReturnCameraScreen} />
      </Scene>
    );
  };

  _renderIntroStack = () => {
    return <Scene component={IntroScreen} hideNavBar key={"introStack"} />;
  };
  _helpScreenStack = () => {
    return <Scene component={LinkScreen} hideNavBar key={"scnLinks"} />;
  };

  _renderIsoStack = () => {
    return (
      <Stack
        key={"scTbFindBarcode"}
        hideNavBar
        icon={tabsIcon}
        title={translate("menu.findProduct")}
      >
        <Scene component={IsoBarcodeCheck} hideNavBar key={"isoBarcodeCheck"} />
        <Scene component={IsoCamera} hideNavBar key={"isoCamera"} />
        <Scene component={IsoBasket} hideNavBar key={"isoBasket"} />
        <Scene component={IsoBasketList} hideNavBar key={"isoBasketList"} />
        <Scene component={IsoAddressList} hideNavBar key={"isoAddressList"} />
        <Scene component={IsoNewAddress} hideNavBar key={"isoNewAddress"} />
        <Scene
          component={IsoProductQrPreview}
          hideNavBar
          key={"isoProductQrPreview"}
        />
        <Scene component={IsoKzCamera} hideNavBar key={"isoKzCamera"} />
        <Scene component={IsoProduct} hideNavBar key={"isoProduct"} />
      </Stack>
    );
  };

  _render = () => {
    return (
      <Stack
        key={"scTbFindBarcode"}
        hideNavBar
        icon={tabsIcon}
        title={translate("menu.findProduct")}
      >
        <Scene component={IsoBarcodeCheck} hideNavBar key={"isoBarcodeCheck"} />
        <Scene component={IsoCamera} hideNavBar key={"isoCamera"} />
        <Scene component={IsoBasket} hideNavBar key={"isoBasket"} />
        <Scene component={IsoBasketList} hideNavBar key={"isoBasketList"} />
        <Scene component={IsoAddressList} hideNavBar key={"isoAddressList"} />
        <Scene component={IsoNewAddress} hideNavBar key={"isoNewAddress"} />
        <Scene component={IsoProduct} hideNavBar key={"isoProduct"} />
      </Stack>
    );
  };

  _renderReturnedProductStack = () => {
    return (
      <Stack key={"erReturnedStack"} hideNavBar>
        <Scene component={ErFindFiche} key={"erReturnFindFiche"} />
        <Scene component={ErFicheProductList} key={"erFicheProductList"} />
        <Scene component={ErFichePaymentResult} key={"erFichePaymetTypes"} />
        <Scene component={EasyReturnCameraScreen} key={"easyReturnCamera"} />
        <Scene component={SearchFiche} key={"erFindFiche"} />
        <Scene component={FicheResult} key={"erFicheResult"} />
        <Scene component={FicheResult} key={"erFicheResult"} />
      </Stack>
    );
  };

  _renderBrokenProductStack = () => {
    return (
      <Stack key={"erBrokenStack"} hideNavBar>
        <Scene component={BrFindFiche} key={"erBrokenFindFiche"} />
        <Scene component={BrFicheProductList} key={"erBrokenProductList"} />
        <Scene component={ErFichePaymentResult} key={"erBrokenPaymetTypes"} />
        <Scene component={BrokenComplete} key={"erBrokenComplete"} />
        <Scene component={EasyReturnCameraScreen} key={"easyReturnCamera"} />
        <Scene component={SearchFiche} key={"erFindFiche"} />
        <Scene component={FicheResult} key={"erFicheResult"} />
        <Scene
          component={BrokenFichePaymentResult}
          key={"erBrokenPaymetTypes"}
        />
        <Scene component={BrokenProductResult} key={"erBrokenResult"} />
        <Scene
          component={BrokenProductFicheListWithPhone}
          key={"erBrokenProductFicheListWithPhone"}
        />
      </Stack>
    );
  };

  _renderEasyReturnStack = () => {
    return (
      <Stack key={"easyReturnStack"} hideNavBar>
        <Scene component={CancellationScreen} key={"cancellationScreen"} />
        <Scene component={BackCargoScreen} key={"backCargoScreen"} />
        <Scene component={CancelFromStore} key={"cancelFromStore"} />
        <Scene component={CancelListComplete} key={"cancelListComplete"} />
        <Scene component={CancelList} key={"cancelList"} />
        <Scene component={FindFicheScreen} key={"erFindFiche"} />
        <Scene component={FindFicheListScreen} key={"erFindFicheList"} />
        <Scene component={SearchFiche} key={"erSearchFiche"} />
        <Scene component={EasyReturnCameraScreen} key={"easyReturnCamera"} />
      </Stack>
    );
  };

  _renderSplashScreen = () => {
    return <Scene key="appBase" component={AppMain} hideNavBar initial />;
  };

  _renderPrinterConfig = () => {
    const Printer = () => {
      console.log(
        AccountService?.employeeInfo?.ExpenseLocationCode?.substring(3)
      );
      const store = ApplicationGlobalService.allStore.find(
        (x) => x.werks === AccountService.getUserStoreId().toString()
      );
      const PrinterComponents =
        (AccountService?.employeeInfo?.ExpenseLocationCode?.substring(3) ===
          "8801" ||
          store?.country === "RU") &&
        Platform.OS !== "web"
          ? PathfinderScreen
          : Platform.OS === "ios"
          ? IosPrinterConfig
          : AndroidPrinterConfig;
      return <PrinterComponents />;
    };
    return <Scene hideNavBar key="printerConfig" component={Printer}></Scene>;
  };

  _renderProfileScreen = () => (
    <Scene key="profileScreen" component={ProfileScreen} hideNavBar />
  );

  _renderProfileDetailScreen = () => (
    <Scene
      key="profileDetailScreen"
      component={ProfileDetailScreen}
      hideNavBar
    />
  );

  _renderAnnounceScreen = () => (
    <Scene key="scnHome" component={HomeScreen} hideNavBar />
  );

  _renderCrmStack = () => {
    return (
      <Stack key="crmMain" hideNavBar>
        <Scene key="crmList" component={CrmNavScreen} hideNavBar />
        <Scene key="crmCaseList" component={CrmMainScreen} hideNavBar />
        <Scene key="CrmCaseDetail" component={CaseDetailScreen} hideNavBar />
        <Scene
          key="CrmCCList"
          component={CrmCustomerComplaintList}
          hideNavBar
        />
        <Scene
          key="CrmCCCreate"
          component={CrmCreateCustomerComplatint}
          hideNavBar
        />
        <Scene
          key="CrmCCDetail"
          component={CrmDetailCustomerComplaint}
          hideNavBar
        />
        <Scene key="crmFindOrder" component={CrmFindOrder} hideNavBar />
        <Scene
          component={EasyReturnCameraScreen}
          hideNavBar
          key={"crmCameraScreen"}
        />
        <Scene key="CrmOrderDetail" component={CrmOrderDetail} hideNavBar />
        <Scene component={SearchFiche} key={"erFindFiche"} hideNavBar />
        <Scene component={FicheResult} key={"erFicheResult"} hideNavBar />
        <Scene component={CrmSearchFiche} key={"crmSearchFiche"} hideNavBar />
        <Scene component={EasyReturnCameraScreen} key={"easyReturnCamera"} />
      </Stack>
    );
  };

  _renderAuthStack = () => {
    return (
      <Stack key="authStack" hideNavBar>
        <Scene
          key="signInPage"
          inactiveBackgroundColor={"#000"}
          component={LoginScreen}
        />
      </Stack>
    );
  };

  _renderTabButtons = () => {
    return (
      <Scene
        key="mainStack"
        tabs
        tabBarComponent={(props) => <TabBar {...props} />}
        activeTintColor={colors.brightOrange}
        labelStyle={styles.labelStyle}
        inactiveTintColor={colors.warmGrey}
        hideNavBar
      >
        <Scene
          hideNavBar
          key="scTbHome"
          component={MainScreen}
          tabBarLabel={translate("menu.home")}
          icon={tabsIcon}
        />
        {this._renderIsoStack()}
      </Scene>
    );
  };
}

export default AppNavigation;

const tabsIcon = (props: any) => {
  const { focused, activeTintColor, navigation, tintColor } = props;
  const { key } = navigation.state;
  switch (key) {
    case "scTbHome":
      return (
        <Foundation
          name={"home"}
          color={focused ? activeTintColor : tintColor}
          size={25}
        />
      );
    case "scTbDocument":
      return (
        <FontAwesome
          name={"folder"}
          color={focused ? activeTintColor : tintColor}
          size={25}
        />
      );
    case "scTbFindBarcode":
      return (
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: -30,
            backgroundColor: colors.brightOrange,
          }}
        >
          <MaterialCommunityIcons
            name={"barcode-scan"}
            color={colors.white}
            size={33}
          />
        </View>
      );
    case "scTbHelp":
      return (
        <MaterialIcons
          name="live-help"
          color={focused ? activeTintColor : tintColor}
          size={25}
        />
      );
    case "scTbMore":
      return (
        <Feather
          name={"more-vertical"}
          color={focused ? activeTintColor : tintColor}
          size={25}
        />
      );
  }

  return (
    <Foundation
      name={"home"}
      color={focused ? activeTintColor : tintColor}
      size={25}
    />
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: PerfectFontSize(11),
    lineHeight: PerfectFontSize(13),
    fontFamily: "Poppins_500Medium",
  },
});

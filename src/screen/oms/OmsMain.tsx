import {
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  FlatList
} from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { translate } from "../../helper/localization/locaizationMain";
import RoleGroup from "../../components/RoleGroup";
import CargoConsensus from "../../components/Oms/CargoConsensus";
import PackageList from "../../components/Oms/PackageList";
import Dashboard from "../../components/Oms/Dashboard";
import Orders from "../../components/Oms/Orders";
import PickList from "../../components/Oms/PickList";
import NotFoundProducts from "../../components/Oms/NotFoundProducts";
import OrderHistory from "../../components/Oms/OrderHistory";
import WaybillStatus from "../../components/Oms/WaybillStatus";
import FloLoading from "../../components/FloLoading";
import { useOmsService } from "../../contexts/OmsService";
import { useAccountService } from "../../contexts/AccountService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useRoute } from "@react-navigation/native";
const OmsMain: React.FC<any> = (props) => {
  const route = useRoute();
  const [currentTab, setCurrentTab] = useState(0);

  const {
    loadingContent,
    loadAllOrders,
    loadStatePage,
    loadAssignableEmployee,
    loadMyPickList,
    loadAllPackageList,
    CleanPicklist,
    CleanPackageList,
    loadOrderHistory,
    loadErrorReasons
  } = useOmsService();
  const { isInRole } = useAccountService();
  const { getCargoList } = useApplicationGlobalService();

  useEffect(() => {
    if (currentTab === 0) {
      loadStatePage();
      getCargoList();
    } else if (currentTab === 1) {
      loadAllOrders();
      loadAssignableEmployee();
    } else if (currentTab === 2) loadMyPickList();
    else if (currentTab === 3) loadAllPackageList();
    else if (currentTab === 4) getCargoList();

    if (currentTab !== 2) CleanPicklist();
    if (currentTab !== 3) CleanPackageList();
    if (currentTab === 6) loadOrderHistory("", 1);
    loadErrorReasons();
  }, [currentTab]);

  useEffect(() => {
    if (route.params) {
      //@ts-ignore
      const { tab } = route.params;
      setCurrentTab(tab);
    }
  }, [route.params])

  const GenerateTab = (title: string) => {
    let customWidth = (Platform.OS === "web" ? 9 : 8) * title.length;
    return {
      defaultItem: (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 0,
            width: customWidth + 50,
          }}
        >
          <AppText
            selectable
            labelType={LabelType.Label}
            labelColorType={ColorType.Light}
          >
            {title}
          </AppText>
        </View>
      ),
      selectedItem: (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <AppText
            selectable
            labelType={LabelType.Label}
            labelColorType={ColorType.Brand}
          >
            {title}
          </AppText>
        </View>
      ),
      customWidth,
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <FloHeaderNew
        onChangeTab={setCurrentTab}
        currentTab={currentTab}
        headerType={"standart"}
        enableButtons={["back", "profilePic"]}
        tabs={
          isInRole("omc-oms")
            ? [
              GenerateTab(translate("omsMain.statu")),
              GenerateTab(translate("omsMain.orders")),
              GenerateTab(translate("omsMain.collectionList")),
              GenerateTab(translate("omsMain.packingList")),
              GenerateTab(translate("omsMain.cargoSet")),
              GenerateTab(translate("omsMain.productNotFound")),
              GenerateTab(translate("omsMain.pastTransactions")),
              GenerateTab(translate("omsMain.wayBillStatus")),
            ]
            : undefined
        }
      />
      <RoleGroup roleName={"omc-oms"}>
        {loadingContent ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: Dimensions.get("window").height - 100,
            }}
          >
            <FloLoading />
          </View>
        ) : (
          <>
            {currentTab === 0 && <Dashboard />}
            {currentTab === 1 && <Orders />}
            {currentTab === 2 && <PickList />}
            {currentTab === 3 && <PackageList />}
            {currentTab === 4 && <CargoConsensus />}
            {currentTab === 5 && <NotFoundProducts />}
            {currentTab === 6 && <View style={{ flex: 1 }}>
              <OrderHistory />
            </View>}
            {currentTab === 7 && <WaybillStatus />}
          </>
        )}
      </RoleGroup>
    </View>
  );
};
export default OmsMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import {
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, ActivityIndicator } from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import OmsService from "../../core/services/OmsService";
import OmsDashboard from "./OmsDashboard";
import OmsOrders from "./OmsOrders";
import OmsPackageList from "./OmsPackageList";
import OmsPickList from "./OmsPickList";
import { Observer } from "mobx-react-lite";
import RoleGroup, { isInRole } from "../../components/RoleGroup";
import OmsCargoConsensus from "./OmsCargoConsensus";
import OmsNotFoundProducts from "./OmsNotFoundProducts";
import OmsOrderHistory from "./OmsOrderHistory";
import OmsWaybillStatus from "./OmsWaybillStatus";
import { translate } from "../../helper/localization/locaizationMain";

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
const OmsMain: React.FC<any> = (props) => {
  const [currentTab, setCurrentTab] = useState(
    props?.navigation?.state?.params?.currentTab || 0
  );

  useEffect(() => {
    if (currentTab === 0) {
      OmsService.loadStatePage();
    } else if (currentTab === 1) OmsService.loadAllOrders();
    else if (currentTab === 2) OmsService.loadMyPickList();
    else if (currentTab === 3) OmsService.loadAllPackageList();

    if (currentTab !== 2) {
      OmsService.CleanPicklist();
    }
    if (currentTab !== 3) {
      OmsService.CleanPackageList();
    }
    if (currentTab === 5) {
      // OmsService.loadNotFoundItems(new Date(), new Date());
    }
    if (currentTab === 6) {
      OmsService.loadOrderHistory("", 1);
    }
  });
  return (
    <>
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
        <Observer>
          {() => {
            if (OmsService.loadingContent)
              return (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <ActivityIndicator />
                </View>
              );
            else
              return (
                <>
                  {currentTab === 0 && <OmsDashboard />}
                  {currentTab === 1 && <OmsOrders />}
                  {currentTab === 2 && <OmsPickList />}
                  {currentTab === 3 && <OmsPackageList />}
                  {currentTab === 4 && <OmsCargoConsensus />}
                  {currentTab === 5 && <OmsNotFoundProducts />}
                  {currentTab === 6 && <OmsOrderHistory />}
                  {currentTab === 7 && <OmsWaybillStatus />}
                </>
              );
          }}
        </Observer>
      </RoleGroup>
    </>
  );
};
export default OmsMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

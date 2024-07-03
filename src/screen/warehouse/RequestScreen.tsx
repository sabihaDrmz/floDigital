import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import CompletedList from "../../components/Warehouse/CompletedList";
import UserList from "../../components/Warehouse/UserList";
import WaitingList from "../../components/Warehouse/WaitingList";
import { useAccountService } from "../../contexts/AccountService";
import { useWarehouseService } from "../../contexts/WarehouseService";
import { translate } from "../../helper/localization/locaizationMain";

interface RequestScreenProps {
  route?: any
}

const RequestScreen: React.FC<RequestScreenProps> = (props) => {
  const { getStoreEmployee, setWarehouseList } = useWarehouseService();
  const { getUserStoreId } = useAccountService();
  const searchParams = props.route?.params
  const [currentTab, setCurrentTab] = useState(0);
  const [hasInit, setHasInit] = useState(false);
  useEffect(() => {
    if (!hasInit) {
      setHasInit(true);
      getStoreEmployee(getUserStoreId()).then((res) =>
        console.log("res", res)
      );
    }
  }, [hasInit]);

  useEffect(() => {
    if (
      searchParams &&
      searchParams.currentTab &&
      Number(searchParams.currentTab as string) - 1 !== currentTab
    )
      setCurrentTab(Number(searchParams.currentTab as string) - 1 || 0);
  }, [searchParams.currentTab]);

  const TabMenu = (
    title: string,
    selected?: boolean,
    onSelect?: () => void
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={selected ? undefined : onSelect}
        style={{
          backgroundColor: selected ? AppColor.FD.Brand.Solid : "#fff",
          padding: 5,
          borderRadius: 10,
          height: 40,
          minWidth: 100,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          marginHorizontal: 5,
          elevation: 5,
        }}
      >
        <AppText
          selectable
          style={{ color: !selected ? AppColor.FD.Text.Dark : "#fff" }}
        >
          {title}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FloHeaderNew
        headerTitle={translate("warehouseRequest.title")}
        headerType="standart"
        enableButtons={["back"]}
      />

      <View
        style={{ flexDirection: "row", justifyContent: "center", padding: 10 }}
      >
        {TabMenu(
          translate("warehouseRequest.waiting"),
          currentTab === 0,
          () => {
            setCurrentTab(0);
            setWarehouseList([]);
          }
        )}
        {TabMenu(
          translate("warehouseRequest.completed"),
          currentTab === 1,
          () => {
            setCurrentTab(1);
            setWarehouseList([]);
          }
        )}
        {TabMenu(
          translate("warehouseRequest.created"),
          currentTab === 2,
          () => {
            setCurrentTab(2);
            setWarehouseList([]);
          }
        )}
      </View>
      <View
        style={{
          height: Dimensions.get("window").height - 200,
        }}
      >
        {currentTab === 0 && <WaitingList />}
        {currentTab === 1 && <CompletedList />}
        {currentTab === 2 && <UserList />}
      </View>
    </>
  );
};
export default RequestScreen;

import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import WaitingList from "./WaitingList";
import CompletedList from "./CompletedList";
import UserList from "./UserList";
import { ScrollView } from "react-native-gesture-handler";
import WarehouseService from "../../core/services/WarehouseService";
import AccountService from "../../core/services/AccountService";
import I18n from "i18n-js";

interface WarehouseRequestScreenProps {
  navigation?: any;
}

const WarehouseRequestScreen: React.FC<WarehouseRequestScreenProps> = (
  props
) => {
  const [currentTab, setCurrentTab] = useState(
    props?.navigation?.state?.params?.currentTab - 1 || 0
  );
  const [hasInit, setHasInit] = useState(false);
  useEffect(() => {
    if (!hasInit) {
      setHasInit(true);
      WarehouseService.getStoreEmployee(AccountService.getUserStoreId()).then(
        (res) => console.log("res", res)
      );
    }
  });

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
    <View style={styles.container}>
      <FloHeaderNew
        headerTitle={I18n.t("warehouseRequest.title")}
        headerType="standart"
        enableButtons={["back"]}
      />
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ padding: 10 }}
        bounces={false}
      > */}
      <View
        style={{ flexDirection: "row", justifyContent: "center", padding: 10 }}
      >
        {TabMenu(I18n.t("warehouseRequest.waiting"), currentTab === 0, () => {
          setCurrentTab(0);
          WarehouseService.warehouseList = [];
        })}
        {TabMenu(I18n.t("warehouseRequest.completed"), currentTab === 1, () => {
          setCurrentTab(1);
          WarehouseService.warehouseList = [];
        })}
        {TabMenu(I18n.t("warehouseRequest.created"), currentTab === 2, () =>
          setCurrentTab(2)
        )}
      </View>
      {/* </ScrollView> */}
      <View
        style={{
          height: Dimensions.get("window").height - 200,
        }}
      >
        {currentTab === 0 && <WaitingList />}
        {currentTab === 1 && <CompletedList />}
        {currentTab === 2 && <UserList />}
      </View>
    </View>
  );
};
export default WarehouseRequestScreen;

const styles = StyleSheet.create({
  container: {},
});

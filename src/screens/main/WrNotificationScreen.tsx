import { AppText } from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, RefreshControl, FlatList } from "react-native";
import NotificationCard from "../../components/NotificationCard";
import AccountService from "../../core/services/AccountService";
import FcmService from "../../core/services/FcmService";
import WarehouseService from "../../core/services/WarehouseService";
import { translate } from "../../helper/localization/locaizationMain";

interface WrNotificationScreenProps {}

const WrNotificationScreen: React.FC<WrNotificationScreenProps> = (props) => {
  const [onLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoading, setHasloading] = useState(false);
  useEffect(() => {
    if (onLoading) {
      setLoading(false);
      WarehouseService.getListForWarehouse(currentPage, 200, 0).then(
        unreadedToRead
      );
    }
  });

  const refresh = () => {
    setHasloading(true);

    WarehouseService.getListForWarehouse(currentPage, 200, 0).then(() => {
      setCurrentPage(1);
      setHasloading(false);
      unreadedToRead();
    });
  };

  const _nextPage = () => {
    let page = currentPage + 1;
    setCurrentPage(page);
    WarehouseService.getListForWarehouse(page, 200, 0).then(unreadedToRead);
  };

  const unreadedToRead = () => {
    const employeeId = AccountService.tokenizeHeader().employeeId;
    console.log(JSON.stringify(WarehouseService.warehouseList));
    const unreaded = WarehouseService.warehouseList.filter((x) => {
      return (
        x.warehouseRequest.completePerson === employeeId,
        x.notificationRead === null ||
          x.notificationRead === undefined ||
          !x.notificationRead.find((y) => y.employeeId === employeeId)
      );
    });

    unreaded.map((x) => {
      FcmService.readSingle(x.id.toString());
    });
  };
  return (
    <View style={styles.container}>
      <Observer>
        {() => (
          <FlatList
            data={WarehouseService.warehouseList.filter(
              (x) =>
                x.warehouseRequest.completePerson ===
                AccountService.tokenizeHeader().employeeId
            )}
            keyExtractor={(item) => `ntf_crd_${item.id}`}
            onEndReached={_nextPage}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refresh} />
            }
            renderItem={(itr) => (
              <NotificationCard
                //   onTabChanged={props.onTabChanged}
                key={`ntf_crd_${itr.item.id}`}
                {...{
                  actionType: itr.item.actionType,
                  appId: itr.item.appId,
                  body: itr.item.body,
                  createDate: itr.item.createDate,
                  dataJson: itr.item.dataJson,
                  fcmMessageId: itr.item.fcmMessageId,
                  id: itr.item.id,
                  isRead:
                    itr.item.notificationRead &&
                    itr.item.notificationRead.find(
                      (x) =>
                        x.employeeId ===
                        AccountService.tokenizeHeader().employeeId
                    ),
                  readDate: itr.item.readDate,
                  sendTo: itr.item.sendTo,
                  sendType: itr.item.sendType,
                  title: itr.item.title,
                }}
              />
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AppText style={{ fontSize: 15 }}>
                  {translate("announceMiddlewareAlerts.noNotification")}
                </AppText>
              </View>
            )}
          />
        )}
      </Observer>
    </View>
  );
};
export default WrNotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
});

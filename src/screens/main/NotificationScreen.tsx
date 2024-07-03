import { AppText } from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import NotificationCard from "../../components/NotificationCard";
import FcmService from "../../core/services/FcmService";
import { translate } from "../../helper/localization/locaizationMain";

const Sperator: React.FC = () => {
  return (
    <View
      style={{ height: 1, backgroundColor: "#e4e4e4", marginVertical: 10 }}
    />
  );
};

const NotificationScreen: React.FC<{
  onTabChanged?: (tab: number) => void;
  appType: string;
}> = (props) => {
  const [onLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoading, setHasloading] = useState(false);
  useEffect(() => {
    if (onLoading) {
      setLoading(false);
      FcmService.getNotifications(currentPage, props.appType);
    }
  });

  const refresh = () => {
    setHasloading(true);

    FcmService.getNotifications(currentPage, props.appType).then(() => {
      setCurrentPage(1);
      setHasloading(false);
    });
  };
  return (
    <View style={styles.container}>
      <Observer>
        {() => (
          <FlatList
            data={FcmService.notifications}
            keyExtractor={(item) => `ntf_crd_${item.id}`}
            onEndReached={() => {
              let page = currentPage + 1;
              setCurrentPage(page);
              FcmService.getNotifications(page, props.appType);
            }}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refresh} />
            }
            renderItem={(itr) =>
              props.appType === "" ? (
                <NotificationCard
                  onTabChanged={props.onTabChanged}
                  key={`ntf_crd_${itr.item.id}`}
                  {...itr.item}
                  // @ts-ignore
                  isRead={false}
                />
              ) : (
                <NotificationCard
                  onTabChanged={props.onTabChanged}
                  key={`ntf_crd_${itr.item.id}`}
                  {...itr.item}
                />
              )
            }
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
export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
});

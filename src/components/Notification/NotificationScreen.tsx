import { AppText } from "@flomagazacilik/flo-digital-components";
import { useFcm } from "contexts/FcmContext";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import NotificationCard from "../../components/NotificationCard";
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
  const FcmService = useFcm();
  const [onLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoading, setHasloading] = useState(false);
  useEffect(() => {
    if (onLoading) {
      setLoading(false);
      FcmService.getNotifications(1, props.appType).then(() => {
        setCurrentPage(1);
        setHasloading(false);
        setLoading(false);
      });
    }
  }, [props.appType]);

  const refresh = () => {
    setHasloading(true);

    FcmService.getNotifications(1, props.appType).then(() => {
      setCurrentPage(1);
      setHasloading(false);
    });
  };

  const pageLoad = () => {
    let page = currentPage + 1;
    setCurrentPage(page);
    FcmService.getNotifications(page, props.appType);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={FcmService.notifications}
        keyExtractor={(item) => `ntf_crd_${item.id}`}
        onEndReachedThreshold={0.5}
        onEndReached={() => pageLoad()}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
        renderItem={({ item }) => (
          <NotificationCard
            onTabChanged={props.onTabChanged}
            key={`ntf_crd_${item.id}`}
            {...item}
            isRead={props.appType === "" ? false : true}
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
    </View>
  );
};
export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});

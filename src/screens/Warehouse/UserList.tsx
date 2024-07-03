import { AppText } from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import WarehouseService from "../../core/services/WarehouseService";
import EmptyList from "./EmptyList";
import RequestCard from "./RequestCard";

interface UserListProps {}

const UserList: React.FC<UserListProps> = (props) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(true);

      _resetPage();
    }
  }, []);

  const _resetPage = () => {
    setPage(1);
    WarehouseService.getListForUser(1, 20);
  };
  const _nextPage = async () => {
    if (WarehouseService.warehouseList.length % 20 > 0) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setRefreshing(true);
    WarehouseService.getListForUser(nextPage, 20).then(() =>
      setRefreshing(false)
    );
  };

  return (
    <View style={styles.container}>
      <Observer>
        {() => {
          return (
            <View>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={_nextPage}
                  />
                }
                onEndReached={_nextPage}
                data={WarehouseService.userList}
                ListFooterComponent={<View style={{ height: 100 }} />}
                ListEmptyComponent={() => <EmptyList />}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <RequestCard {...item} mylist />}
              />
            </View>
          );
        }}
      </Observer>
    </View>
  );
};
export default UserList;

const styles = StyleSheet.create({
  container: {},
});

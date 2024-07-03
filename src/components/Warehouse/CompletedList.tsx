import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useWarehouseService } from "../../contexts/WarehouseService";
import EmptyList from "./EmptyList";
import RequestCard from "./RequestCard";

interface CompletedListProps { }

const CompletedList: React.FC<CompletedListProps> = (props) => {
  const WarehouseService = useWarehouseService();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
      _resetPage();
    }
  }, []);

  const _resetPage = () => {
    setPage(1);
    WarehouseService.getListForWarehouse(1, 20, 1);
  };

  const _nextPage = async () => {
    if (WarehouseService.warehouseList.length % (page * 20) > 0) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setRefreshing(true);
    WarehouseService.getListForWarehouse(nextPage, 20, 1).then(() =>
      setRefreshing(false)
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_nextPage} />
          }
          onEndReached={_nextPage}
          data={WarehouseService.warehouseList}
          ListFooterComponent={<View style={{ height: 100 }} />}
          ListEmptyComponent={() => <EmptyList />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RequestCard {...item} />}
        />
      </View>
    </View>
  );
};
export default CompletedList;

const styles = StyleSheet.create({
  container: {},
});

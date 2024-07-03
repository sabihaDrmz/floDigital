import linq from "linq";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatListProps,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import FloTextBoxNew from "./FloTextBoxNew";

interface FloInfiniteScrollProps {
  enableSearch?: boolean;
  searchPlaceholder?: string;
  filterProps?: string[];
  scrollProps?: FlatListProps<any>;
  data: any[];
  nextPage: (pageNumber: number) => Promise<any[]>;
  renderItem: ListRenderItem<any> | null | undefined;
}

const FloInfiniteScroll: React.FC<FloInfiniteScrollProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any[]>(props.data);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const filterData = () => {
    if (
      props.filterProps !== undefined &&
      props.filterProps.length > 0 &&
      searchQuery.length > 0
    ) {
      return data.filter((x) => {
        var filter = props.filterProps?.map((f) => {
          var isData = moment(x[f], moment.ISO_8601, true).isValid();

          if (
            isData &&
            moment(x[f]).format("DD/MM/YYYY HH:mm").includes(searchQuery)
          )
            return true;
          else if (
            x[f].toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
          )
            return true;

          return false;
        });
        return linq.from(filter || [false]).any((x) => x == true);
      });
    }
    return data;
  };

  const onNextPage = async () => {
    if (loadingNextPage) return;
    setLoadingNextPage(true);

    if (props.nextPage !== undefined) {
      var next = await props.nextPage(page);

      setData(
        linq
          .from([...data, ...next])
          .distinct()
          .toArray()
      );
      setPage(page + 1);
      setLoadingNextPage(false);
    }
  };

  useEffect(() => {
    onNextPage();
  }, []);

  return (
    <View style={styles.container}>
      {props.enableSearch && (
        <FloTextBoxNew
          placeholder={props.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode={"while-editing"}
        />
      )}
      <FlatList
        {...props}
        data={filterData()}
        renderItem={props.renderItem}
        onEndReached={onNextPage}
        ListFooterComponent={
          <View style={{ margin: 10 }}>
            {loadingNextPage && <ActivityIndicator />}
          </View>
        }
      />
    </View>
  );
};
export default FloInfiniteScroll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

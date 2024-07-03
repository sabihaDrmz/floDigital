import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Animated,
  Dimensions,
  ActivityIndicator,
  FlatList
} from "react-native";
import CrmCaseCard from "../../components/Crm/CrmCaseCard";
import { translate } from "../../helper/localization/locaizationMain";
import { useCrmService } from "../../contexts/CrmService";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import FloLoading from "../../components/FloLoading";
import { useNavigation } from "@react-navigation/native";

const PER_PAGE = 20,
  MainScreen: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [onLoad, setOnload] = useState(false),
      { container, itemSeperator } = styles;
    const { width, height } = Dimensions.get("window");
    const { cases, isLoading, GetCases, SetSelectedCaseModel } = useCrmService();
    const navigation = useNavigation();
    useEffect(() => {
      if (!onLoad) {
        _loadMore(true);
        setOnload(true);
      }
    }, []);

    const _loadMore = (resetPages: boolean = false) => {
      let tempPage = currentPage;
      if (cases.length === 0 && !resetPages) return;
      if (isLoading) return;
      if (resetPages) {
        tempPage = 1;
      } else tempPage = tempPage + 1;

      GetCases(tempPage, PER_PAGE);
      setCurrentPage(tempPage);
    };

    return (
      <View style={container}>
        <FloHeaderNew
          headerType={"standart"}
          enableButtons={["back"]}
          headerTitle={translate("crm.caseManagement")}
        />

        <FlatList
          data={cases}
          style={{ height: Dimensions.get("screen").height }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item) => item.activityid}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              tintColor={"#ff8600"}
              onRefresh={() => _loadMore(true)}
            />
          }
          onEndReached={() => _loadMore(false)}
          onEndReachedThreshold={0.2}
          ItemSeparatorComponent={() => <View style={itemSeperator} />}
          ListEmptyComponent={() => {
            return <Text>{translate("crm.caseNotFound")}</Text>;
          }}
          renderItem={({ item }) => (
            <CrmCaseCard
              subject={item.subject}
              description={item.description}
              createdon={item.createdon}
              firstname={item.incident?.incidentContact?.fisrtName ?? ""}
              phone={item.incident?.incidentContact?.mobilePhone ?? ""}
              ticketNumber={item.incident?.ticketNumber ?? ""}
              timeToClosingDate={item.timeToClosingDate}
              onSelect={() => {
                SetSelectedCaseModel(item);
                navigation.navigate('Crm', { screen: 'CaseDetailScreen' })
              }}
            />
          )}
        />
        {
          isLoading &&
          <View
            style={{
              position: "absolute",
              width,
              height,
              backgroundColor: "rgba(0,0,0,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FloLoading />
          </View>
        }
      </View>
    );
  };
export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemSeperator: {
    height: 1,
    backgroundColor: "#e4e4e4",
    marginRight: 33,
  },
});

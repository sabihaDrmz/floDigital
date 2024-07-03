import { AppColor } from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { usePowerBiService } from "../../contexts/PowerBiService";
import { translate } from "../../../src/helper/localization/locaizationMain";
import { useNavigation } from "@react-navigation/native";

interface ReportListProps {
}

const ReportList: React.FC<ReportListProps> = (props) => {
  const { loadReports } = usePowerBiService();
  const navigation = useNavigation();
  const [listData, setListData] = useState<any[]>()

  useEffect(() => {
    loadReports().then((e) => {
      setListData((e as any[])?.concat(inAppReports))
    });
  }, []);

  const inAppReports = [
    {
      type: 'inApp',
      //@ts-ignore
      navigate: () => navigation.navigate('Completionofsalesshortage', { screen: 'CompletionOfSalesShortageReport' }),
      name: translate("report.completionOfSalesShortageReport")
    },
    {
      type: 'inApp',
      //@ts-ignore
      navigate: () => navigation.navigate('PowerBi', { screen: 'SalesLossReport' }),
      name: translate("report.salesLossReport")
    },
    {
      type: 'inApp',
      //@ts-ignore
      navigate: () => navigation.navigate('PowerBi', { screen: 'FloDigitalUsageReport' }),
      name: translate("report.floDigitalUsageReport")
    }
  ]
  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back"]}
        headerTitle={"Raporlar"}
      />
      <FlatList
        data={listData}
        renderItem={({ item }) => {
          return (item.type && item.type === "inApp") ? (
            <TouchableOpacity
              onPress={item.navigate}
              style={{
                backgroundColor: AppColor.FD.Text.Light,
                height: 50,
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>) : (
            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                navigation.navigate('PowerBi', {
                  screen: 'ReportScreen', params: {
                    reportId: item.id.toString(),
                    reportName: item.name,
                  }
                });
              }}
              style={{
                backgroundColor: AppColor.FD.Text.Light,
                height: 50,
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
      />
    </View>
  );
};
export default ReportList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

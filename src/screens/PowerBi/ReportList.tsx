import { AppColor } from "@flomagazacilik/flo-digital-components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Actions } from "react-native-router-flux";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { ServiceResponseBase } from "../../core/models/ServiceResponseBase";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import { GetServiceUri, ServiceUrlType } from "../../core/Settings";
import { ReportInfo } from "./ReportScreen";

interface ReportListProps {}

const ReportList: React.FC<ReportListProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [reportInfo, setReportInfo] = useState<ReportInfo[]>();

  const loadReports = async () => {
    try {
      var result = await axios.get<ServiceResponseBase<ReportInfo[]>>(
        `${GetServiceUri(ServiceUrlType.SYSTEM_API)}PowerBI/ReportList`
      );
      console.log(result.data);
      if (!result.data.isValid) {
        MessageBoxNew.show("Rapor bilgileri alınamadı.");
        return;
      }
      setReportInfo(result.data.model);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back"]}
        headerTitle={"Raporlar"}
      />
      <FlatList
        data={reportInfo}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => Actions["reportDetail"]({ report: item })}
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

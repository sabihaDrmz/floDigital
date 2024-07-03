import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";
import { isIphoneX } from "react-native-iphone-x-helper";
import { ReportInfoModel } from "../../contexts/model/ReportInfoModel";
import { usePowerBiService } from "../../contexts/PowerBiService";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useRoute } from "@react-navigation/native";

interface ReportScreenProps {
  route: any
}

const ReportScreen: React.FC<ReportScreenProps> = (props: any) => {
  const { getReportEmbeddedInfo } = usePowerBiService();
  const { } = props?.route?.params;
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [reportId, setReportId] = useState(0);
  const [reportName, setReportName] = useState("");


  const [reportInfo, setReportInfo] = useState<ReportInfoModel | undefined>();

  useEffect(() => {
    if (route.params) {
      //@ts-ignore
      const { reportId, reportName } = route.params;
      if (reportId)
        setReportId(reportId);
      if (reportName)
        setReportName(reportName);
    }
  }, [route.params])

  useEffect(() => {
    if (loading && reportId)
      getReportEmbeddedInfo(reportId)
        .then((e) => setReportInfo(e))
        .then(() => setLoading(false));
  }, [reportId]);

  const setConfiguration = () => {
    let embedConfiguration = {
      type: "report",
      tokenType: 1,
      accessToken: reportInfo?.token,
      embedUrl: reportInfo?.reportUrl,
      id: reportInfo?.reportId,
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false,
        layoutType: 2,
      },
    };

    return JSON.stringify(embedConfiguration);
  };

  const merge = (target: any, source: any) => {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object)
        Object.assign(source[key], merge(target[key], source[key]));
    }
    Object.assign(target || {}, source);
    return target;
  };

  const getTemplate = (configuration: any) => `<!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <script src="https://cdn.jsdelivr.net/npm/powerbi-client@2.4.7/dist/powerbi.min.js"></script>
        <style>
            html,
            body,
            #reportContainer {
                width: 100%;
                height: 100%;
                margin: 0;
                background-color: 'white';
                -webkit-overflow-scrolling: touch;
            }
            iframe {
                border: 0px
            }
        </style>
    </head>
    
    <body>
        <div id="reportContainer"></div>
        <script>
        var models = window['powerbi-client'].models;
        var config = ${configuration};
        var reportContainer = document.getElementById('reportContainer');
        var report = powerbi.embed(reportContainer, config);
        </script>
    </body>
    </html>`;

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        headerTitle={reportName?.toString()}
        enableButtons={["back"]}
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <WebView
          originWhitelist={["*"]}
          style={{ ...StyleSheet.absoluteFillObject }}
          source={{ html: getTemplate(setConfiguration()) }}
        />
      )}
      <View style={{ height: !isIphoneX() ? 0 : 40 }} />
    </View>
  );
};
export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

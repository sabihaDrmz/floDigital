import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { ServiceResponseBase } from "../../core/models/ServiceResponseBase";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import { GetServiceUri, ServiceUrlType } from "../../core/Settings";
import WebView from "react-native-webview";
import { isIphoneX } from "react-native-iphone-x-helper";
import { Actions } from "react-native-router-flux";
import AccountService from "../../core/services/AccountService";

export interface ReportInfo {
  "@odata.context": string;
  token: string;
  tokenId: string;
  expiration: Date;
  reportUrl: string;
  groupId: string;
  reportId: string;
  dataset: string;
  name: string;
  tenantId: string;
}
interface ReportScreenProps {}

const ReportScreen: React.FC<ReportScreenProps> = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [reportInfo, setReportInfo] = useState<ReportInfo>();

  const getReportEmbeddedInfo = async () => {
    console.log(getTemplate(setConfiguration()));
    try {
      var result = await axios.get<ServiceResponseBase<ReportInfo>>(
        `${GetServiceUri(
          ServiceUrlType.SYSTEM_API
        )}PowerBI/GetReport?reportId=${props.navigation.state.params.report.id}`
      );
      console.log("*********", props.navigation.state.params.report);
      console.log("*********", result.data);
      if (!result.data.isValid) {
        MessageBoxNew.show("Rapor bilgileri alınamadı.", {
          yesButtonEvent: () => Actions.pop(),
        });
        return;
      }
      setReportInfo(result.data.model);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportEmbeddedInfo();
  }, []);

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
        headerTitle={props.navigation.state.params.report.name}
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

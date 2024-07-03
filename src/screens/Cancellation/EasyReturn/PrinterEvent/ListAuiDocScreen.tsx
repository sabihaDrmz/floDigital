import { AppText } from "@flomagazacilik/flo-digital-components";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FloHeader } from "../../../../components/Header";
import { FloDigitalErrorParse } from "../../../../core/HttpModule";
import {
  FloResultCode,
  ServiceResponseBase,
} from "../../../../core/models/ServiceResponseBase";
import AccountService from "../../../../core/services/AccountService";
import MessageBoxNew from "../../../../core/services/MessageBoxNew";
import { GetServiceUri, ServiceUrlType } from "../../../../core/Settings";

const DocElement: React.FC<any> = (props) => {
  return (
    <TouchableOpacity disabled={props.disabled} onPress={props.onSelect}>
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          padding: 10,
          borderRadius: 9,
          marginBottom: 10,
        }}
      >
        <AppText selectable>
          Müşteri Adı : [ {props.customerName} ] - Müşteri Tel No : [{" "}
          {props.customerGsm} ]{"\n"}Belge No : 
          {props.brokenProductDocumentNo} ] - Oluşturulma Tarihi : [{" "}
          {moment(props.createDate)
            .locale("tr")
            .format("DD/MM/YYYY HH:MM dddd")}{" "}
          ]
        </AppText>
      </View>
    </TouchableOpacity>
  );
};
const ListAuiDocScreen: React.FC = () => {
  const [fiches, setFiches] = useState<any[]>([]);
  const [onLoading, setLoading] = useState(false);
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        var result = await axios.get<ServiceResponseBase<any>>(
          `${GetServiceUri(
            ServiceUrlType.ER_TRANSACTION_BASE
          )}ListPrintDocuments?storeId=${AccountService.getUserStoreId()}`,
          { headers: AccountService.tokenizeHeader() }
        );

        if (result.data.state === FloResultCode.Successfully) {
          setFiches(result.data.model);
        } else {
          MessageBoxNew.show(result.data.message);
        }
      } catch (err: any) {
        FloDigitalErrorParse(err);
      }
    };

    if (fiches.length === 0) loadTransactions();
  });

  const printDocument = async (transactionId: any) => {
    try {
      var result = await axios.get<ServiceResponseBase<string>>(
        `${GetServiceUri(
          ServiceUrlType.ER_TRANSACTION_BASE
        )}getHtml?transactionId=${transactionId}`,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
        var w = window.open("", "_blank");
        if (w) {
          w.document.open();
          w.document.write(
            '<html><body onload="window.print()">' +
              result.data.model +
              "</body></html>"
          );
          w.document.close();
        }
      } else {
        MessageBoxNew.show(result.data.message);
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  return (
    <View style={styles.container}>
      <FloHeader
        headerType="standart"
        enableButtons={["back"]}
        headerTitle={"İDES Dokümanlar"}
      />
      {/* <View style={{ flexDirection: "row", padding: 20 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,.3)",
            borderRadius: 5,
            padding: 5,
          }}
        >
          <TextInputMask
            style={{ flex: 1, marginLeft: 10, height: 45 }}
            placeholder="Başlangıç Tarihi Seçin"
            value={dateStr}
            onChangeText={(txt) => {
              let map = txt.split("/");

              let str = "";
              if (map.length > 0) {
                if (Number(map[0]) > 31) str += "31/";
                else str += map[0] + "/";
              }
              if (map.length > 1) {
                if (Number(map[1]) > 12) str += "12/";
                else str += map[1] + "/";
              }
              if (map.length > 2) {
                if (Number(map[2]) > 2100) str += "2100";
                else str += map[2];
              }
              if (10 === str.length) {
                let date = new Date(`${map[2]}-${map[1]}-${map[0]}`);
                // @ts-ignore
                setStartDate(date);
              }
              setDateStr(str);
            }}
            type={"datetime"}
            maxLength={10}
            options={{
              withDDD: true,
              dddMask: "31/12/9999",
            }}
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,.3)",
            borderRadius: 5,
            padding: 5,
          }}
        >
          <TextInputMask
            style={{ flex: 1, marginLeft: 10, height: 45 }}
            placeholder="Bitiş Tarihi Seçin"
            value={dateStrEnd}
            onChangeText={(txt) => {
              let map = txt.split("/");

              let str = "";
              if (map.length > 0) {
                if (Number(map[0]) > 31) str += "31/";
                else str += map[0] + "/";
              }
              if (map.length > 1) {
                if (Number(map[1]) > 12) str += "12/";
                else str += map[1] + "/";
              }
              if (map.length > 2) {
                if (Number(map[2]) > 2100) str += "2100";
                else str += map[2];
              }
              if (10 === str.length) {
                let date = new Date(`${map[2]}-${map[1]}-${map[0]}`);
                // @ts-ignore
                setEndDate(date);
              }
              setDateStrEnd(str);
            }}
            type={"datetime"}
            maxLength={10}
            options={{
              withDDD: true,
              dddMask: "31/12/9999",
            }}
          />
        </View>
      </View> */}
      <FlatList
        style={{ padding: 20 }}
        data={fiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocElement
            key={item.id}
            disabled={onLoading}
            onSelect={() => printDocument(item.id)}
            {...item}
          />
        )}
      />
    </View>
  );
};
export default ListAuiDocScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

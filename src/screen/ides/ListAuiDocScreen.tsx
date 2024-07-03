import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import moment from "moment";
import { AppText } from "@flomagazacilik/flo-digital-components";
import {
  FloResultCode,
  ServiceResponseBase,
} from "../../core/models/ServiceResponseBase";
import { SystemApi, useAccountService } from "../../contexts/AccountService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import FloHeaderNew from "../../components/Header/FloHeaderNew";

const ListAuiDocScreen: React.FC = () => {
  const { getUserStoreId } = useAccountService();
  const { show } = useMessageBoxService();
  const [fiches, setFiches] = useState<any[]>([]),
    printDocument = async (transactionId: any) => {
      try {
        const result = await SystemApi.get<ServiceResponseBase<string>>(
          `EasyReturnTransaction/getHtml?transactionId=${transactionId}`
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
          show(result.data.message);
        }
      } catch (err: any) { }
    };

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
            {props.customerGsm} ]{"\n"}Belge No :{props.brokenProductDocumentNo}{" "}
            ] - Oluşturulma Tarihi : [{" "}
            {moment(props.createDate)
              .locale("tr")
              .format("DD/MM/YYYY HH:MM dddd")}{" "}
            ]
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const result = await SystemApi.get<ServiceResponseBase<any>>(
          `EasyReturnTransaction/ListPrintDocuments?storeId=${getUserStoreId()}`
        );
        if (result.data.state === FloResultCode.Successfully) {
          setFiches(result.data.model);
        } else {
          show(result.data.message);
        }
      } catch (err: any) { }
    };
    if (fiches.length === 0) loadTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back"]}
        headerTitle={"İDES Dokümanlar"}
      />
      <FlatList
        style={{ padding: 20 }}
        data={fiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocElement
            key={item.id}
            disabled={false}
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

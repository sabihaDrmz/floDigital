import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import { FloHeader } from "../../components/Header";
import { translate } from "../../helper/localization/locaizationMain";

class CrmMenuScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <FloHeader
          headerType={"standart"}
          headerTitle={"CRM"}
          enableButtons={["back"]}
        />
        <ScrollView bounces={false}>
          <TouchableOpacity
            style={{
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => Actions["crmList"]()}
          >
            <Text
              style={{
                fontSize: 20,
                marginLeft: 30,
              }}
            >
              {translate("crm.caseManagement")}
            </Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.1)" }} />
          <TouchableOpacity
            style={{
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => Actions["CrmOrderSearch"]()}
          >
            <Text
              style={{
                fontSize: 20,
                marginLeft: 30,
              }}
            >
              {translate("crm.checkOrder")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default CrmMenuScreen;

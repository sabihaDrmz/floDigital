import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../theme/colors";

import { Fontisto, AntDesign } from "@expo/vector-icons";
import { Actions } from "react-native-router-flux";
import { translate } from "../../helper/localization/locaizationMain";
import { FloHeader } from "../../components/Header";
import { MaterialCommunityIcons } from "../../components";
import { isInRole } from "../../components/RoleGroup";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import { observer } from "mobx-react";
import { PerfectFontSize } from "../../helper/PerfectPixel";
const customRoutes = [
  {
    id: 1,
    route: "crmMain",
    routeIcon: <AntDesign name={"customerservice"} size={30} />,
    routeName: translate("moreScreen.crmMainLink"),
    roleType: "omc-crm",
  },
  {
    id: 2,
    route: "printerConfig",
    routeIcon: <Fontisto name={"shopping-pos-machine"} size={30} />,
    routeName: translate("moreScreen.printerConfig"),
    roleType: "omc-printer-config",
  },
  {
    id: 3,
    route: "easyReturnStack",
    routeIcon: <MaterialCommunityIcons name={"cash-refund"} size={30} />,
    routeName: translate("moreScreen.easyReturn"),
    roleType: "omc-easy-return",
  },
];

@observer
class MoreScreen extends Component<any> {
  _renderMenu(title: any, icon: any, route: any, params?: any[] | undefined) {
    return (
      <TouchableOpacity
        style={[
          styles.routeItem,
          // itr.index === customRoutes.length - 1 ? { borderBottomWidth: 0 } : null
        ]}
        onPress={() => Actions[route](params)}
      >
        <View
          style={{ width: 50, justifyContent: "center", alignItems: "center" }}
        >
          {icon}
        </View>
        <Text style={styles.routeNameTitle}>{title}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <>
        <FloHeader
          headerType={"standart"}
          headerTitle={translate("moreScreen.title")}
          enableButtons={["profile"]}
        />
        <ScrollView style={styles.container}>
          {isInRole("omc-test-mode") ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>
                {ApplicationGlobalService.testMode
                  ? "Canlı Mod'a Geç"
                  : "Test Moduna Geç"}
              </Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: colors.darkGrey,
                  width: 100,
                  borderRadius: 20,
                  marginLeft: 30,
                  alignItems: ApplicationGlobalService.testMode
                    ? "flex-start"
                    : "flex-end",
                }}
                onPress={() =>
                  ApplicationGlobalService.changeApplicationTestMode()
                }
              >
                <View
                  style={{
                    width: 55,
                    borderRadius: 20,
                    padding: 20,
                    backgroundColor: ApplicationGlobalService.testMode
                      ? colors.brightOrange
                      : colors.warm_grey_three,
                  }}
                ></View>
              </TouchableOpacity>
            </View>
          ) : null}
          <FlatList
            data={customRoutes}
            renderItem={(itr) => {
              if (!isInRole(itr.item.roleType)) return null;
              return (
                <TouchableOpacity
                  style={[
                    styles.routeItem,
                    itr.index === customRoutes.length - 1
                      ? { borderBottomWidth: 0 }
                      : null,
                  ]}
                  onPress={() => Actions[itr.item.route]()}
                  key={itr.item.id.toString()}
                >
                  <View
                    style={{
                      width: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {itr.item.routeIcon}
                  </View>
                  <Text style={styles.routeNameTitle}>
                    {itr.item.routeName}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
          />
          {this.props.children}
        </ScrollView>
      </>
    );
  }
}
export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  routeNameTitle: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    lineHeight: PerfectFontSize(22),
    color: colors.darkGrey,
    marginLeft: 20,
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: 1,
  },
});

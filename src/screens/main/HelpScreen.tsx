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

import { AntDesign } from "@expo/vector-icons";
import { Actions } from "react-native-router-flux";
import { FloHeader } from "../../components/Header";
import { translate } from "../../helper/localization/locaizationMain";
import { isInRole, RoleType } from "../../components/RoleGroup";

const moreRoutes = [
  {
    id: 2,
    route: "scnLinks",
    routeIcon: <AntDesign name={"link"} size={30} />,
    routeName: translate("helpScreen.links"),
    roleType: RoleType.CONTACT_US,
  },
];

class HelpScreen extends Component<any> {
  render() {
    return (
      <>
        <FloHeader
          headerType={"standart"}
          headerTitle={translate("helpScreen.title")}
          enableButtons={["profile"]}
        />
        <ScrollView style={styles.container}>
          <FlatList
            data={moreRoutes}
            renderItem={(itr) => {
              if (itr.item.roleType === RoleType.UNK || !isInRole("omc-help"))
                return null;

              if (
                itr.item.roleType === RoleType.CONTACT_US &&
                !isInRole("omc-help-links")
              )
                return null;
              return (
                <TouchableOpacity
                  style={[
                    styles.routeItem,
                    itr.index === moreRoutes.length - 1
                      ? { borderBottomWidth: 0 }
                      : null,
                  ]}
                  key={itr.item.id.toString()}
                  onPress={() => Actions[itr.item.route]()}
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
export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  routeNameTitle: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    lineHeight: 22,
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

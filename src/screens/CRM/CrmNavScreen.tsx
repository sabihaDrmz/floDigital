import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import { MaterialIcons } from "../../components";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { isInRole } from "../../components/RoleGroup";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";

const CrmNavScreen: React.FC = (props) => {
  const NaviCard: React.FC<{
    title: string;
    route: string;
    ico: ImageSourcePropType;
  }> = (props) => {
    return (
      <TouchableOpacity
        style={styles.navCard}
        onPress={() => Actions[props.route]()}
      >
        <View style={styles.textIconContainer}>
          <Image
            source={props.ico}
            style={{
              width: 24,
              height: 24,
              marginRight: 20,
              resizeMode: "contain",
            }}
          />
          <Text style={styles.navText}>{props.title}</Text>
        </View>
        <MaterialIcons name={"chevron-right"} size={25} color={"#7d7e81"} />
      </TouchableOpacity>
    );
  };

  const Sperator: React.FC = (props) => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#f4f4f4",
          marginBottom: 20,
          marginTop: 20,
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FloHeaderNew
        headerType={"standart"}
        showLogo
        enableButtons={["back", "notification"]}
      />
      <View style={styles.container}>
        {isInRole("omc-crm") && (
          <React.Fragment>
            <NaviCard
              ico={require(`../../../assets/crm1ico.png`)}
              title={translate("crmNavSceen.caseManagement")}
              route={"crmCaseList"}
            />
            <Sperator />
          </React.Fragment>
        )}
        {isInRole("omc-crm2") && (
          <React.Fragment>
            <NaviCard
              ico={require(`../../../assets/crmcustomercomplaint.png`)}
              title={translate("crmNavSceen.customerComplaintManagement")}
              route={"CrmCCList"}
            />
            <Sperator />
          </React.Fragment>
        )}
        <React.Fragment>
          <NaviCard
            ico={require(`../../../assets/findorder.png`)}
            title={translate("crmNavSceen.checkOrder")}
            route={"crmFindOrder"}
          />
          <Sperator />
        </React.Fragment>
        <React.Fragment>
          <NaviCard
            ico={require(`../../../assets/crm2ico.png`)}
            title={translate("crmFindOrderScreen.findFiche")}
            route={"crmSearchFiche"}
          />
          <Sperator />
        </React.Fragment>
      </View>
    </View>
  );
};
export default CrmNavScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  navCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navText: {
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(16),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#7d7e81",
  },
  textIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

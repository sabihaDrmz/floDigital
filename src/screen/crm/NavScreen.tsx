import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { MaterialIcons } from "../../components";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useAccountService } from "../../contexts/AccountService";
import { useNavigation } from "@react-navigation/native";
import { NavigationType } from "../../../StackNavigator";

const NavScreen: React.FC = () => {
  const { isInRole } = useAccountService(),
    navigation = useNavigation(),
    { textIconContainer, navCard, navText, seperatorContainer, container } =
      styles,
    NaviCard: React.FC<{
      title: string;
      route: string;
      ico: ImageSourcePropType;
    }> = (props) => {
      return (
        <TouchableOpacity
          style={navCard}
          onPress={() => navigation.navigate(props.route)}
        >
          <View style={textIconContainer}>
            <Image
              source={props.ico}
              style={{
                width: 24,
                height: 24,
                marginRight: 20,
                resizeMode: "contain",
              }}
            />
            <Text style={navText}>{props.title}</Text>
          </View>
          <MaterialIcons name={"chevron-right"} size={25} color={"#7d7e81"} />
        </TouchableOpacity>
      );
    },
    Seperator: React.FC = () => {
      return <View style={seperatorContainer} />;
    };

  return (
    <View style={{ flex: 1 }}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back", "notification"]}
      />
      <View style={container}>
        {isInRole("omc-crm") && (
          <React.Fragment>
            <NaviCard
              ico={require(`../../../assets/crm1ico.png`)}
              title={translate("crmNavSceen.caseManagement")}
              route={"MainScreen"}
            />
            <Seperator />
          </React.Fragment>
        )}
        {isInRole("omc-crm2") && (
          <React.Fragment>
            <NaviCard
              ico={require(`../../../assets/crmcustomercomplaint.png`)}
              title={translate("crmNavSceen.customerComplaintManagement")}
              route={"CustomerComplaintList"}
            />
            <Seperator />
          </React.Fragment>
        )}
        <React.Fragment>
          <NaviCard
            ico={require(`../../../assets/findorder.png`)}
            title={translate("crmNavSceen.checkOrder")}
            route={"FindOrder"}
          />
          <Seperator />
        </React.Fragment>
        <React.Fragment>
          <NaviCard
            ico={require(`../../../assets/crm2ico.png`)}
            title={translate("crmFindOrderScreen.findFiche")}
            route={"CrmSearchFiche"}
          />
          <Seperator />
        </React.Fragment>
      </View>
    </View>
  );
};
export default NavScreen;

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
  seperatorContainer: {
    height: 1,
    backgroundColor: "#f4f4f4",
    marginBottom: 20,
    marginTop: 20,
  },
});

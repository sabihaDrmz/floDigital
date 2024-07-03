import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { FloButton, FontAwesome } from "../../components";
import { FloHeader } from "../../components/Header";
import BasketService, { EcomAddress } from "../../core/services/BasketService";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import { translate } from "../../helper/localization/locaizationMain";

@observer
class IsoAddressList extends Component {
  state = { selectedCard: 0 };
  render() {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back"]}
          headerTitle={translate("isoAddressList.title")}
        />
        <View style={styles.container}>
          <ScrollView>
            {BasketService.basketAddressSearch?.map((adress, index) => {
              return this._renderAdressCard(
                this.state.selectedCard === index,
                index,
                adress
              );
            })}
            <TouchableOpacity onPress={() => Actions.popTo("isoNewAddress")}>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 62,
                  marginTop: 16,
                  fontFamily: "Poppins_400Regular",
                  fontSize: PerfectFontSize(14),
                  fontWeight: "bold",
                  fontStyle: "normal",
                  lineHeight: PerfectFontSize(18),
                  letterSpacing: 0,
                }}
              >
                {translate("isoAddressList.newAddress")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {BasketService.basketAddressSearch &&
            this.state.selectedCard !== -1 && (
              <FloButton
                title={translate("isoAddressList.next")}
                containerStyle={{ marginBottom: 20 }}
                onPress={() => {
                  BasketService.selectAddress(this.state.selectedCard);
                }}
              />
            )}
        </View>
      </React.Fragment>
    );
  }

  _renderAdressCard = (selected: boolean, id: number, address: EcomAddress) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this.setState({ selectedCard: id })}
        style={{
          borderWidth: 1,
          borderColor: selected ? colors.brightOrange : colors.darkGrey,
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            paddingBottom: 18,
            borderBottomWidth: 1,
            flexDirection: "row",
            borderBottomColor: colors.whiteThree,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: selected ? colors.brightOrange : colors.white,
                justifyContent: "center",
                alignItems: "center",
                borderColor: selected ? colors.brightOrange : colors.darkGrey,
                borderWidth: 2,
              }}
            >
              {selected ? (
                <FontAwesome
                  name={"check"}
                  color={selected ? colors.white : colors.darkGrey}
                  size={15}
                />
              ) : null}
            </View>

            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: PerfectFontSize(14),
                fontWeight: "500",
                fontStyle: "normal",
                lineHeight: PerfectFontSize(16),
                letterSpacing: 0,
                textAlign: "left",
                marginLeft: 10,
                color: selected ? colors.brightOrange : colors.darkGrey,
              }}
            >
              {translate("isoAddressList.selected")}
            </Text>
          </View>
        </View>
        <View>
          <Text>{address.firstname + " " + address.lastname}</Text>
          <Text>{address.street}</Text>
          <Text>
            {address.region} / {address.city}
            {address.neighborhood_name
              ? " / " + address.neighborhood_name
              : undefined}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
}
export default IsoAddressList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

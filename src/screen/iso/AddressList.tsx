import { FloButton } from "../../components";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { useBasketService } from "../../contexts/BasketService";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { translate } from "../../helper/localization/locaizationMain";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors } from "../../theme/colors";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { EcomAddress } from "../../contexts/model/EcomAddress";
import { useNavigation } from "@react-navigation/native";

interface AddressListProps {
}

const AddressList: React.FC<AddressListProps> = (props) => {
  const navigation = useNavigation();
  const { basketAddressSearch, selectAddress } = useBasketService(),
    [selectedCard, setSelectedCard] = useState(-1),
    AdressCard = (selected: boolean, id: number, address: EcomAddress) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedCard(id)}
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
                  backgroundColor: selected
                    ? colors.brightOrange
                    : colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: selected ? colors.brightOrange : colors.darkGrey,
                  borderWidth: 2,
                }}
              >
                {selected ? (
                  <FontAwesomeIcon
                    icon={"check"}
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
  return (
    <React.Fragment>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={translate("isoAddressList.title")}
      />
      <View style={styles.container}>
        <ScrollView>
          {basketAddressSearch?.map((adress, index) => {
            return AdressCard(selectedCard === index, index, adress);
          })}

          <TouchableOpacity onPress={() => {
            //@ts-ignore
            navigation.navigate("Iso", { screen: "NewAddress" })
          }}>
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
        {basketAddressSearch && selectedCard !== -1 && (
          <FloButton
            title={translate("isoAddressList.next")}
            containerStyle={{ marginBottom: 20 }}
            onPress={() => {
              selectAddress(selectedCard).then((x) => {
                if (x) {
                  navigation.goBack();
                  navigation.goBack();
                } else navigation.goBack();
              });
            }}
          />
        )}
      </View>
    </React.Fragment >
  );
};
export default AddressList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

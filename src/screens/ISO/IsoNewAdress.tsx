import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { TextInputMask } from "react-native-masked-text";
import { Actions } from "react-native-router-flux";
import { Feather, FloButton } from "../../components";
import FloCheckBox from "../../components/FloCheckBox";
import FloLoading from "../../components/FloLoading";
import { FloHeader } from "../../components/Header";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import BasketService from "../../core/services/BasketService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import AccountService from "../../core/services/AccountService";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import AppComboSelect from "../../components/AppComboSelect";
import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import StoreAdressSelect from "./IsoScreenPartials/StoreAdressSelect";

@observer
class IsoNewAddress extends Component<any> {
  state = { searchText: "", canUseStoreAddress: false };
  modalizeRef:
    | string
    | number
    | boolean
    | {}
    | React.ReactPortal
    | React.ReactElement<
        any,
        | string
        | ((props: any) => React.ReactElement<any, any> | null)
        | (new (props: any) => React.Component<any, any, any>)
      >
    | React.ReactNodeArray
    | null
    | undefined;
  componentDidMount() {
    ApplicationGlobalService.getAllCities();
  }

  render() {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back"]}
          headerTitle={translate("isoNewAddress.title")}
          customButtonActions={[
            {
              buttonType: "back",
              customAction: () => {
                if (this.props.onBack) this.props.onBack();
                if (BasketService.address.isCreateCustomer)
                  BasketService.address.isCreateCustomer = false;
                if (Actions.currentScene === "isoNewAddress") Actions.pop();
              },
            },
          ]}
        />
        <View style={styles.container}>
          <View
            style={{
              backgroundColor: "#F4F4F4",
              marginTop: 10,
              marginBottom: 24,
              height: 40,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 20,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <Feather name={"search"} size={24} />
            <TextInputMask
              type={"cel-phone"}
              options={{
                withDDD: true,
                dddMask: "9 ( 999 ) 999 99 99",
              }}
              style={{ marginLeft: 10 }}
              placeholderTextColor={colors.darkGrey}
              underlineColorAndroid={"transparent"}
              placeholder={translate("isoNewAddress.phonePlaceHolder")}
              value={this.state.searchText}
              onChangeText={(input) => {
                this.setState({
                  searchText:
                    !input.startsWith("0") && input.length > 0
                      ? `0${input}`
                      : input,
                });

                if (input.length === 19) {
                  // Actions['isoAddressList']();
                  // this.setState({searchText: ''});
                  BasketService.checkAddress(input);
                }
              }}
              onSubmitEditing={() => {
                // if (this.state.searchText.length === 19) {
                //   Actions['isoAddressList']();
                // }
              }}
              maxLength={19}
            />
          </View>
          <KeyboardAwareScrollView
            style={{
              flex: 1,
              flexDirection: "column",
            }}
          >
            <ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 24,
                  fontWeight: "500",
                  fontStyle: "normal",
                  lineHeight: PerfectFontSize(29),
                  letterSpacing: 0,
                  textAlign: "left",
                  color: colors.darkGrey,
                  marginBottom: 15,
                }}
              >
                {translate("isoNewAddress.shipmentAddressCreate")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <FloCheckBox
                  // disabled
                  title={translate("isoNewAddress.newCustomer")}
                  style={{ marginBottom: 25 }}
                  onChangeChecked={(s) => {
                    if (s != undefined)
                      BasketService.address.isCreateCustomer = s;
                  }}
                  checked={BasketService.address.isCreateCustomer}
                />
                <StoreAdressSelect
                  onSelectAdress={(selected, adress) => {
                    this.setState({
                      disableAddress: adress.disableAddress,
                      city: adress.city,
                      district: adress.district,
                      address: adress.address,
                    });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <AppTextBox
                  style={{
                    width: Dimensions.get("window").width / 2 - 55,
                    fontFamily: "Poppins_400Regular",
                  }}
                  placeholder={translate("isoNewAddress.name")}
                  value={BasketService.address.aliciAdi}
                  onChangeText={(input) =>
                    (BasketService.address.aliciAdi = input)
                  }
                  placeholderTextColor={AppColor.FD.Text.Dark}
                />
                <AppTextBox
                  placeholder={translate("isoNewAddress.lastname")}
                  style={{
                    width: Dimensions.get("window").width / 2 - 55,
                    fontFamily: "Poppins_400Regular",
                  }}
                  value={BasketService.address.aliciSoyadi}
                  onChangeText={(input) =>
                    (BasketService.address.aliciSoyadi = input)
                  }
                  placeholderTextColor={AppColor.FD.Text.Dark}
                />
              </View>
              <AppTextBox
                onChangeText={(input) => (BasketService.address.ePosta = input)}
                keyboardType={"email-address"}
                placeholder={translate("isoNewAddress.email")}
                value={BasketService.address.ePosta}
                style={{ fontFamily: "Poppins_400Regular" }}
                placeholderTextColor={AppColor.FD.Text.Dark}
              />
              <View style={{ height: 10 }} />
              <AppTextBox
                format="phone"
                placeholder={translate("isoNewAddress.phone")}
                keyboardType={"phone-pad"}
                onChangeText={(input) =>
                  (BasketService.address.telefon = input)
                }
                value={BasketService.address.telefon}
                style={{ fontFamily: "Poppins_400Regular" }}
                placeholderTextColor={AppColor.FD.Text.Dark}
              />
              <AppComboSelect
                disabled={BasketService.isStoreAddress}
                data={ApplicationGlobalService.cityes}
                selected={BasketService.address.il}
                title={
                  BasketService.address.il?.name ||
                  translate("isoNewAddress.city")
                }
                onRenderItem={(item) => {
                  return (
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text>{item.name}</Text>
                    </View>
                  );
                }}
                onSelect={(item) => {
                  ApplicationGlobalService.getDistrictByCity(item.id).then(
                    () => {
                      BasketService.address.il = item;
                      BasketService.address.ilce = undefined;
                      BasketService.address.mahalle = undefined;
                    }
                  );
                }}
                textField={"name"}
              />
              <AppComboSelect
                disabled={
                  BasketService.isStoreAddress ||
                  BasketService.address.il === undefined
                }
                data={ApplicationGlobalService.districts}
                selected={BasketService.address.ilce}
                title={
                  BasketService.address.ilce?.name ||
                  translate("isoNewAddress.district")
                }
                onRenderItem={(item) => {
                  return (
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text>{item.name}</Text>
                    </View>
                  );
                }}
                onSelect={(item) => {
                  ApplicationGlobalService.getNeighborhoodByDistrictId(
                    item.id
                  ).then(() => {
                    BasketService.address.ilce = item;
                    BasketService.address.mahalle = undefined;
                  });
                }}
                textField={"name"}
              />
              {!BasketService.isStoreAddress && (
                <AppComboSelect
                  disabled={
                    BasketService.isStoreAddress ||
                    BasketService.address.ilce === undefined
                  }
                  data={ApplicationGlobalService.neighbourhoods}
                  selected={BasketService.address.mahalle}
                  title={
                    BasketService.address.mahalle?.name ||
                    translate("isoNewAddress.neighbourhood")
                  }
                  onRenderItem={(item) => {
                    return (
                      <View
                        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                      >
                        <Text>{item.name}</Text>
                      </View>
                    );
                  }}
                  onSelect={(item) => {
                    BasketService.address.mahalle = item;
                  }}
                  textField={"name"}
                />
              )}
              <View style={{ height: 10 }} />
              <AppTextBox
                editable={!BasketService.isStoreAddress}
                multiline
                placeholder={translate("isoNewAddress.address")}
                style={{ height: 144 }}
                onChangeText={(input) => (BasketService.address.adres = input)}
                value={BasketService.address.adres}
                placeholderTextColor={AppColor.FD.Text.Dark}
              />
              <View style={{ height: 20 }} />
              <FloButton
                onPress={() => {
                  const isValidAddress = BasketService.isValidAddress();
                  if (isValidAddress) {
                    BasketService.updateted = true;
                    if (
                      BasketService.address.isCreateCustomer &&
                      (BasketService.address.telefon !==
                        BasketService.lastPhone ||
                        BasketService.address.ePosta !==
                          BasketService.lastEmail)
                    ) {
                      BasketService.sentKvkk(this.props.onBack);
                    } else {
                      if (this.props.onBack) this.props.onBack();
                      Actions.currentScene === "isoNewAddress"
                        ? Actions.pop()
                        : null;
                    }
                    BasketService.updateted = false;
                  } else {
                    if (
                      BasketService.address.aliciAdi === null ||
                      BasketService.address.aliciSoyadi === null ||
                      BasketService.address.aliciAdi === undefined ||
                      BasketService.address.aliciSoyadi === undefined ||
                      BasketService.address.aliciAdi.trim().length === 0 ||
                      BasketService.address.aliciSoyadi.trim().length === 0
                    ) {
                      MessageBox.Show(
                        translate("errorMsgs.customerNameNotEmpty"),
                        MessageBoxDetailType.Information,
                        MessageBoxType.Standart,
                        () => {},
                        () => {}
                      );
                    } else if (
                      BasketService.address.telefon === null ||
                      BasketService.address.telefon === undefined ||
                      BasketService.address.telefon.length === 0 ||
                      BasketService.address.telefon.length <
                        "9 ( 999 ) 999 99 99".length
                    ) {
                      MessageBox.Show(
                        translate("errorMsgs.customerPhoneNotEmpty"),
                        MessageBoxDetailType.Information,
                        MessageBoxType.Standart,
                        () => {},
                        () => {}
                      );
                    } else if (
                      BasketService.address.adres === undefined ||
                      BasketService.address.adres === null ||
                      BasketService.address.ilce === undefined ||
                      BasketService.address.ilce === null ||
                      BasketService.address.il === undefined ||
                      BasketService.address.il === null ||
                      (!BasketService.isStoreAddress &&
                        (BasketService.address.mahalle === undefined ||
                          BasketService.address.mahalle === null))
                    ) {
                      MessageBox.Show(
                        translate("errorMsgs.customerAddressNotEmpty"),
                        MessageBoxDetailType.Information,
                        MessageBoxType.Standart,
                        () => {},
                        () => {}
                      );
                    } else if (
                      BasketService.address.adres?.trim().length <= 10
                    ) {
                      MessageBox.Show(
                        translate("errorMsgs.customerAddressMinLengthError", {
                          len: 10,
                        }),
                        MessageBoxDetailType.Information,
                        MessageBoxType.Standart,
                        () => {},
                        () => {}
                      );
                    }
                  }
                }}
                containerStyle={{ marginLeft: 20, marginRight: 20 }}
                title={translate("isoNewAddress.save")}
              />
              <View style={{ height: 50 }} />
              <View style={{ height: 50 }} />
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
        {BasketService.isLoading && <FloLoading />}
      </React.Fragment>
    );
  }
}
export default IsoNewAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});

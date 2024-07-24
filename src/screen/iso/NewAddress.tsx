import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import { AppColor } from "@flomagazacilik/flo-digital-components";
import AppTextBox, {
  TextManipulator,
} from "../../NewComponents/FormElements/AppTextBox";
import { Feather, FloButton } from "../../components";
import AppComboSelect from "../../components/AppComboSelect";
import FloCheckBox from "../../components/FloCheckBox";
import FloLoading from "../../components/FloLoading";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useBasketService } from "../../contexts/BasketService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { translate } from "../../helper/localization/locaizationMain";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { colors } from "../../theme/colors";
import StoreAdressSelect from "../../components/Iso/StoreAddressSelect";
import * as RootNavigation from "../../core/RootNavigation"
import { useNavigation } from "@react-navigation/native";

const NewAddress: React.FC<any> = (props) => {
  const { getAllCities, getDistrictByCity, cities, districts, getNeighborhoodByDistrictId, neighborhoods } = useApplicationGlobalService(),
    [neighborhoodList, setNeighborhoodList] = useState([]),
    { updateAddressIsCreateCustomer, address, checkAddress, updateAddressAliciAdi, updateAddressAliciSoyadi, updateAddressEmail, isStoreAddress, updateAddressTelefon, updateAdress, updateAddressText, isValidAddress, lastPhone, sentKvkk, isLoading } = useBasketService(),
    { show } = useMessageBoxService(),
    [searchText, setSearchText] = useState("");

  const navigation = useNavigation();
  useEffect(() => {
    getAllCities();
  }, []);

  return (
    <React.Fragment>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={translate("isoNewAddress.title")}
        customButtonActions={[
          {
            buttonType: "back",
            customAction: () => {
              if (props.onBack) props.onBack();
              if (address.isCreateCustomer)
                updateAddressIsCreateCustomer(false);
              if (RootNavigation.getPathName() === "NewAddress") navigation.goBack();
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
            style={{
              marginLeft: 10,
              minWidth: Dimensions.get("window").width / 2 - 55,
            }}
            placeholderTextColor={colors.darkGrey}
            underlineColorAndroid={"transparent"}
            placeholder={translate("isoNewAddress.phonePlaceHolder")}
            value={searchText}
            onChangeText={(input) => {
              const st =
                !input.startsWith("0") && input.length > 0
                  ? `0${input}`
                  : input;

              setSearchText(st);

              if (input.length === 19) {
                checkAddress(input);
              }
            }}
            onSubmitEditing={() => { }}
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
                    updateAddressIsCreateCustomer(s);
                }}
                checked={address.isCreateCustomer}
              />
              <StoreAdressSelect />
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
                value={address.aliciAdi}
                onChangeText={(input) => {
                  const textToNormalize = input.normalize('NFKC')
                  updateAddressAliciAdi(textToNormalize)
                }
                }
                placeholderTextColor={AppColor.FD.Text.Dark}
              />
              <AppTextBox
                placeholder={translate("isoNewAddress.lastname")}
                style={{
                  width: Dimensions.get("window").width / 2 - 55,
                  fontFamily: "Poppins_400Regular",
                }}
                value={address.aliciSoyadi}
                onChangeText={(input) => {
                  const textToNormalize = input.normalize('NFKC')
                  updateAddressAliciSoyadi(textToNormalize)
                }
                }
                placeholderTextColor={AppColor.FD.Text.Dark}
              />
            </View>
            <AppTextBox
              onChangeText={(input) => {
                const textToNormalize = input.normalize('NFKC')
                updateAddressEmail(textToNormalize)
              }}
              keyboardType={"email-address"}
              placeholder={translate("isoNewAddress.email")}
              value={address.ePosta}
              style={{ fontFamily: "Poppins_400Regular" }}
              placeholderTextColor={AppColor.FD.Text.Dark}
            />
            <View style={{ height: 10 }} />

            <View
              style={{
                borderWidth: 1,
                borderColor: AppColor.FD.Text.Light,
                minHeight: 42,
                borderRadius: 8,
                paddingHorizontal: 13,
                paddingTop: 8,
                paddingBottom: props.multiline ? 20 : 9,
                maxHeight: 130,
                justifyContent: "center",
              }}
            >
              <TextInput
                placeholder={translate("isoNewAddress.phone")}
                keyboardType={"phone-pad"}
                onChangeText={(input) => {
                  var newData = TextManipulator(input, "phone");
                  updateAddressTelefon(newData);
                }}
                value={address.telefon}
                style={{ fontFamily: "Poppins_400Regular", fontSize: 15 }}
                placeholderTextColor={AppColor.FD.Text.Dark}
                maxLength={19}
              />
            </View>
            <AppComboSelect
              disabled={isStoreAddress}
              data={cities}
              selected={address.il}
              title={
                address.il?.name ||
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
                getDistrictByCity(item.id).then(() => {
                  updateAdress(
                    item,
                    undefined,
                    undefined,
                    "",
                    false,
                    ""
                  );
                });
              }}
              textField={"name"}
            />
            <AppComboSelect
              disabled={
                isStoreAddress ||
                address.il === undefined
              }
              data={districts}
              selected={address.ilce}
              title={
                address.ilce?.name ||
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
                getNeighborhoodByDistrictId(item.id).then(
                  (res) => {
                    setNeighborhoodList(res);
                    updateAdress(
                      address.il,
                      item,
                      undefined,
                      "",
                      false,
                      ""
                    );
                  }
                );
              }}
              textField={"name"}
            />
            {!isStoreAddress && (
              <AppComboSelect
                disabled={
                  isStoreAddress ||
                  address.ilce === undefined
                }
                data={neighborhoods || neighborhoodList}
                selected={address.mahalle}
                title={
                  address.mahalle?.name ||
                  translate("isoNewAddress.neighbourhood")
                }
                onRenderItem={(item) => {
                  return (
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text>{item.name}</Text>
                    </View>
                  );
                }}
                onSelect={(item) => {
                  updateAdress(
                    address.il,
                    address.ilce,
                    item,
                    "",
                    false,
                    ""
                  );
                }}
                textField={"name"}
              />
            )}
            <View style={{ height: 10 }} />
            <AppTextBox
              editable={!isStoreAddress}
              multiline
              placeholder={translate("isoNewAddress.address")}
              style={{ height: 144, fontStyle: 'normal' }}
              onChangeText={(input) => {
                const textToNormalize = input.normalize('NFKC')
                updateAddressText(textToNormalize)
              }}
              value={address.adres}
              placeholderTextColor={AppColor.FD.Text.Dark}
            />
            <View style={{ height: 20 }} />
            <FloButton
              onPress={() => {
                const isValidAddressRes = isValidAddress();
                if (isValidAddressRes) {
                  if (
                    address.isCreateCustomer &&
                    address.telefon !== lastPhone
                  ) {
                    sentKvkk(props.onBack);
                  } else {
                    if (props.onBack) props.onBack();
                    RootNavigation.getPathName() === "NewAddress" ? navigation.goBack() : null;
                  }
                } else {
                  if (
                    address.aliciAdi === null ||
                    address.aliciSoyadi === null ||
                    address.aliciAdi === undefined ||
                    address.aliciSoyadi === undefined ||
                    address.aliciAdi.trim().length === 0 ||
                    address.aliciSoyadi.trim().length === 0
                  ) {
                    show(
                      translate("errorMsgs.customerNameNotEmpty")
                    );
                  }
                  //  else if (
                  //   address.isCreateCustomer == true && (address.ePosta === null ||
                  //     address.ePosta === null ||
                  //     address.ePosta === undefined ||
                  //     address.ePosta.trim().length === 0 ||
                  //     address.ePosta.trim().length === 0)
                  // ) {
                  //   show(
                  //     translate("errorMsgs.emailRequiredNewCustomer")
                  //   );
                  // }
                  else if (
                    address.telefon === null ||
                    address.telefon === undefined ||
                    address.telefon.length === 0 ||
                    address.telefon.length <
                    "9 ( 999 ) 999 99 99".length
                  ) {
                    show(
                      translate("errorMsgs.customerPhoneNotEmpty")
                    );
                  } else if (
                    address.adres === undefined ||
                    address.adres === null ||
                    address.ilce === undefined ||
                    address.ilce === null ||
                    address.il === undefined ||
                    address.il === null ||
                    (!isStoreAddress &&
                      (address.mahalle === undefined ||
                        address.mahalle === null))
                  ) {
                    show(
                      translate("errorMsgs.customerAddressNotEmpty")
                    );
                  } else if (address.adres?.trim().length <= 10) {
                    show(
                      translate("errorMsgs.customerAddressMinLengthError", {
                        len: 10,
                      })
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
      {isLoading && <FloLoading />}
    </React.Fragment>
  );
};
export default NewAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

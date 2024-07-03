import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { AntDesign, MaterialCommunityIcons } from "../../../components";
import ApplicationGlobalService from "../../../core/services/ApplicationGlobalService";
import BasketService from "../../../core/services/BasketService";
import AppTextBox from "../../../NewComponents/FormElements/AppTextBox";
import { colors } from "../../../theme/colors";
import { translate } from "../../../helper/localization/locaizationMain";

interface StoreAdressSelectProps {
  onSelectAdress?: (
    isSelected: boolean,
    adress: {
      disableAddress: boolean;
      city: any;
      district: any;
      address: string;
    }
  ) => void;
}

const StoreAdressSelect: React.FC<StoreAdressSelectProps> = (props) => {
  const modalizeRef = useRef<Modalize>(null);
  const [selectedStoreAdress, setSelectedStoreAdress] = useState("");
  const [canUseStoreAddress, setCanUseStoreAddress] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (BasketService.deliveredStore) {
      _selectStoreAdress(BasketService.deliveredStore);
    }
  }, []);

  const _selectStoreAdress = (werks: string) => {
    setSelectedStoreAdress(werks);

    const store = ApplicationGlobalService.allStore.find(
      (x) => x.werks === werks
    );

    if (store) {
      const city = ApplicationGlobalService.cityes.find(
        (x) => x.code === (store.city === "" ? "0" : store.city)
      );

      let locales = ["tr", "TR", "tr-TR", "tr-u-co-search", "tr-x-turkish"];
      ApplicationGlobalService.getDistrictByCity(city?.id || 0).then((x) => {
        const district = ApplicationGlobalService.districts.find(
          (x) =>
            ApplicationGlobalService.turkishtoEnglish(x.name).toLocaleUpperCase(
              locales
            ) ===
            ApplicationGlobalService.turkishtoEnglish(
              store.district
            ).toLocaleUpperCase(locales)
        );
        BasketService.isStoreAddress = true;
        BasketService.address.mahalle = undefined;
        BasketService.updateAdress(
          city,
          district,
          undefined,
          store.adres1 + " " + store.adres2,
          true,
          store.werks
        );
        if (city && district && props.onSelectAdress)
          props.onSelectAdress(true, {
            disableAddress: true,
            city,
            district,
            address: store.adres1 + " " + store.adres2,
          });
      });
    }
  };

  const _cleanStoreAddress = () => {
    setSelectedStoreAdress("");
    setCanUseStoreAddress(false);
    BasketService.isStoreAddress = false;
    BasketService.address.mahalle = undefined;
    BasketService.updateAdress(undefined, undefined, undefined, "", false, "");
    if (props.onSelectAdress)
      props.onSelectAdress(false, {
        disableAddress: false,
        city: undefined,
        district: undefined,
        address: "",
      });
  };

  return (
    <React.Fragment>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => {
            setCanUseStoreAddress(true);
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: colors.brightOrange,
              borderRadius: 4,
              marginRight: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedStoreAdress !== "" && (
              <MaterialCommunityIcons color={"white"} name="check" size={18} />
            )}
          </View>
          <AppText
            style={{
              fontFamily: "Poppins_400Regular",
            }}
            labelColorType={ColorType.Dark}
          >
            Mağazadan teslim
          </AppText>
        </TouchableOpacity>
      </View>
      <Portal>
        {canUseStoreAddress && (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,.4)",
              position: "absolute",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 400,
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  width: Dimensions.get("window").width - 40,
                  padding: 20,
                }}
              >
                <AppTextBox
                  placeholder="Ara"
                  value={query}
                  onChangeText={setQuery}
                />
                <View style={{ height: 20 }} />
                <FlatList
                  data={ApplicationGlobalService.ecomStoreList.filter(
                    (x) =>
                      x.storeCode !== undefined &&
                      x.storeCode !== null &&
                      x.storeCode !== "" &&
                      (query === "" ||
                        x.storeCode
                          .toLowerCase()
                          .includes(query.toLowerCase()) ||
                        x.storeName.toLowerCase().includes(query.toLowerCase()))
                  )}
                  initialNumToRender={20}
                  keyExtractor={(item, index) => `${item.storeCode}_${index}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      key={`${item.storeCode}_${index}`}
                      style={{
                        height: 40,
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                      onPress={() => _selectStoreAdress(item.storeCode)}
                    >
                      <View
                        style={[
                          {
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: AppColor.FD.Text.Light,
                            marginRight: 10,
                          },
                          selectedStoreAdress === item.storeCode && {
                            backgroundColor: colors.brightOrange,
                          },
                        ]}
                      />
                      <AppText
                        selectable
                        style={{ fontFamily: "Poppins_500Medium" }}
                      >
                        {item.storeCode + " - " + item.storeName}
                      </AppText>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: AppColor.FD.Text.Light,
                      }}
                    />
                  )}
                />
                <AppButton
                  title={translate("iso.ok")}
                  buttonColorType={ColorType.Brand}
                  onPress={() => setCanUseStoreAddress(false)}
                />
                <AppButton
                  title={translate("iso.cancel")}
                  buttonColorType={ColorType.Danger}
                  onPress={() => {
                    setCanUseStoreAddress(false);
                    _cleanStoreAddress();
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </Portal>
    </React.Fragment>
  );
};
export default StoreAdressSelect;

const styles = StyleSheet.create({
  container: {},
});

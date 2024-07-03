import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { MaterialCommunityIcons } from "../../components";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import { colors } from "../../theme/colors";
import { translate } from "../../helper/localization/locaizationMain";
import { useBasketService } from "../../contexts/BasketService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { turkishtoEnglish } from "../../helper";

interface StoreAdressSelectProps { }

const StoreAdressSelect: React.FC<StoreAdressSelectProps> = (props) => {
  const modalizeRef = useRef<Modalize>(null);
  const [selectedStoreAdress, setSelectedStoreAdress] = useState("");
  const [canUseStoreAddress, setCanUseStoreAddress] = useState(false);
  const [query, setQuery] = useState("");
  const BasketService = useBasketService();
  const ApplicationGlobalService = useApplicationGlobalService();

  useEffect(() => {
    (async () => {
      await ApplicationGlobalService.getAllStores();
      await ApplicationGlobalService.getAllCities();
      await ApplicationGlobalService.getAllEcomStoreList();
    })();

    if (BasketService.deliveredStore) {
      _selectStoreAdress(BasketService.deliveredStore);
    }
  }, []);

  const _selectStoreAdress = (werks: string) => {
    setSelectedStoreAdress(werks);
    ApplicationGlobalService.setSelectedStore(werks);

    const store = ApplicationGlobalService.allStore.find(
      (x) => x.werks === werks
    );

    if (store) {
      const city = ApplicationGlobalService.cities.find(
        (x) => x.code === (store.city === "" ? "0" : store.city)
      );

      ApplicationGlobalService.getDistrictByCity(city?.id || 0).then((x) => {
        const district = x.find(
          (y: any) =>
            turkishtoEnglish(y.name).toUpperCase() ===
            turkishtoEnglish(store.district).toUpperCase()
        );
        BasketService.updateAdress(
          city,
          district,
          undefined,
          store.adres1 + " " + store.adres2,
          true,
          store.werks
        );
      });
    }
  };

  const _cleanStoreAddress = () => {
    setSelectedStoreAdress("");
    setCanUseStoreAddress(false);
    BasketService.isStoreAddress = false;
    BasketService.updateAdress(undefined, undefined, undefined, "", false, "");
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

import { Feather } from "@expo/vector-icons";
import {
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  NativeScrollEvent,
} from "react-native";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import ProductService from "../../../core/services/ProductService";
import { openGps } from "../../../core/Util";
import { translate } from "../../../helper/localization/locaizationMain";
import AppTextBox from "../../../NewComponents/FormElements/AppTextBox";
import { colors } from "../../../theme/colors";

interface IsoProductStoreCardProps {
  placeholder?: string;
}

const IsoProductStoreCard: React.FC<IsoProductStoreCardProps> = (props) => {
  const [query, setQuery] = useState("");
  const [maxRender, setMaxRender] = useState(15);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <Observer>
      {() => (
        <View style={styles.container}>
          <View style={styles.searchBar}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: AppColor.FD.Text.Light,
                height: 42,
                paddingLeft: 60,
                textAlignVertical: "center",
                fontSize: 15,
                fontFamily: "Poppins_400Regular",
                borderRadius: 8,
              }}
              selectionColor={AppColor.FD.Brand.Solid}
              placeholder={
                props.placeholder ||
                translate("floAutoComplete.defaultPlaceholde")
              }
              onChangeText={setQuery}
              value={query}
            />
            <View style={styles.searchBarIcoContainer}>
              <Feather name="search" color={colors.black} size={25} />
              <View
                style={{
                  width: 1,
                  height: 30,
                  marginLeft: 10,
                  backgroundColor: colors.darkGrey,
                  borderRadius: 0.5,
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <ScrollView
              style={{ maxHeight: 280 }}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  setMaxRender(maxRender + 15);
                }
              }}
              scrollEventThrottle={400}
            >
              {ProductService.product?.stores
                ?.filter(
                  (x) =>
                    query === "" ||
                    x.storeName
                      .toLocaleLowerCase()
                      .includes(query.toLocaleLowerCase())
                )
                .map((item, index) => {
                  if (index >= maxRender) return null;
                  return (
                    <View key={`storeCard_${item.storeName}_${index}`}>
                      <TouchableWithoutFeedback
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          height: 40,
                        }}
                        onPress={() =>
                          openGps(item.latitude, item.longitude, item.storeName)
                        }
                      >
                        <View>
                          <AppText selectable>{item.storeName}</AppText>
                          <AppText
                            selectable
                            labelColorType={
                              item.qty < 3 &&
                              item.storeName !==
                                translate(
                                  "crmCrmCreateCustomerComplaint.eCommerce"
                                )
                                ? ColorType.Brand
                                : ColorType.Gray
                            }
                          >
                            {item.storeName ===
                              translate(
                                "crmCrmCreateCustomerComplaint.eCommerce"
                              ) && item.qty > 0
                              ? translate("isoStoreList.inStock")
                              : item.qty < 3 && item.qty > 0
                              ? translate("isoStoreList.lastStock", {
                                  stock: item.qty,
                                })
                              : item.qty > 0
                              ? translate("isoStoreList.stock", {
                                  stock: item.qty,
                                })
                              : translate("isoStoreList.stockOut")}
                          </AppText>
                        </View>
                        <AppText selectable>{item.distance} Km</AppText>
                      </TouchableWithoutFeedback>
                      {index + 1 <
                        (ProductService.product?.stores?.length || 0) && (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: "#dedede",
                            marginVertical: 5,
                          }}
                        />
                      )}
                    </View>
                  );
                })}
            </ScrollView>
            {/* {ProductService.product && (
              <FlatList
                style={{ maxHeight: 280 }}
                initialNumToRender={15}
                // scrollEnabled={false}
                nestedScrollEnabled
                data={ProductService.product?.stores.filter(
                  (x) =>
                    query === "" ||
                    x.storeName
                      .toLocaleLowerCase("tr-TR")
                      .includes(query.toLocaleLowerCase("tr-TR"))
                )}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableWithoutFeedback
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 40,
                      }}
                      onPress={() =>
                        openGps(item.latitude, item.longitude, item.storeName)
                      }
                    >
                      <View>
                        <AppText>{item.storeName}</AppText>
                        <AppText
                          labelColorType={
                            item.qty < 3 && item.storeName !== "E-TİCARET"
                              ? ColorType.Brand
                              : ColorType.Gray
                          }
                        >
                          {item.storeName === "E-TİCARET" && item.qty > 0
                            ? translate("isoStoreList.inStock")
                            : item.qty < 3 && item.qty > 0
                            ? translate("isoStoreList.lastStock", {
                                stock: item.qty,
                              })
                            : item.qty > 0
                            ? translate("isoStoreList.stock", {
                                stock: item.qty,
                              })
                            : translate("isoStoreList.stockOut")}
                        </AppText>
                      </View>
                      <AppText>{item.distance} Km</AppText>
                    </TouchableWithoutFeedback>
                  );
                }}
                keyExtractor={(item, index) => `store_${item.storeName}`}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#dedede",
                      marginVertical: 5,
                    }}
                  />
                )}
              />
            )} */}
          </View>
        </View>
      )}
    </Observer>
  );
};
export default IsoProductStoreCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderColor: "#dedede",
    borderWidth: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {},
  searchBarIcoContainer: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    left: 10,
    width: 45,
  },
});

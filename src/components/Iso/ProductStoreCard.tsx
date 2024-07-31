import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import {
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { useProductService } from "../../contexts/ProductService";
import { openGps } from "../../core/Util";
import { translate } from "../../helper/localization/locaizationMain";
import React, { useState } from "react";
import { View, StyleSheet, TextInput, NativeScrollEvent, ScrollView, TouchableOpacity } from "react-native";

import { colors } from "../../theme/colors";

interface IsoProductStoreCardProps {
  placeholder?: string;
}

const ProductStoreCard: React.FC<IsoProductStoreCardProps> = (props) => {
  const ProductService = useProductService();
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

  console.log('ProductService.product?.stores:', ProductService.product?.stores)

  return (
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
            props.placeholder || translate("floAutoComplete.defaultPlaceholde")
          }
          onChangeText={setQuery}
          value={query}
        />
        <View style={styles.searchBarIcoContainer}>
          <FontAwesomeIcon icon={faSearch} color={colors.black} size={25} />
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
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
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
                  <TouchableOpacity
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
                            translate("crmCrmCreateCustomerComplaint.eCommerce")
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
                  </TouchableOpacity>
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
      </View>
    </View>
  );
};
export default ProductStoreCard;

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

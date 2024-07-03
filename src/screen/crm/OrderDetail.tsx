import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  FlatList,
  ScrollView,
  Platform
} from "react-native";
import moment from "moment";
import FloIcon from "../../components/CustomIcons/FloIcon";
import {
  AppColor,
  AppText,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { GetCrmOrderItemStaus } from "../../constant/CrmStatusMapDefination";
import { translate } from "../../helper/localization/locaizationMain";
import AppCardColorizeSvg from "../../components/AppColorizeSvg";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useCrmService } from "../../contexts/CrmService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";

const { width } = Dimensions.get("window");
const OMC_COLOR = "rgba(140,38,160,1)";
const STORE_COLOR = "#41A563";

const OrderDetail: React.FC<any> = (props) => {
  const { crmOrders } = useCrmService();
  const [products, setProducts] = useState<any>();
  const [instores, setInstores] = useState<any>();
  const { allStore } = useApplicationGlobalService();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!isLoading && crmOrders) {
      const { products, instores, model } = crmOrders;

      setProducts(products);
      setInstores(instores);
      setIsLoading(true);
    }
  }, [isLoading, crmOrders]);

  const Title: React.FC<{ title1?: string; title2?: string }> = (props) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText
          numberOfLines={1}
          selectable
          style={{
            fontFamily: "Poppins_600SemiBold",
            width: width / 2 - 30,
            color: "rgb(112,112,113)",
          }}
        >
          {props.title1}
        </AppText>
        <AppText
          style={{
            fontFamily: "Poppins_400Regular",

            textAlign: "right",
          }}
          selectable
          numberOfLines={1}
        >
          {props.title2}
        </AppText>
      </View>
    );
  };

  const StockOutProductCard: React.FC<any> = (props) => {
    const isOmni = !(props.info === undefined || props.info === null);
    if (!props.stockOutQuantity) return null
    return (
      <View
        style={{
          minHeight: 200,
          marginBottom: 20,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ position: "absolute" }}>
          <AppCardColorizeSvg color={AppColor.OMS.Background.OpacityOrange} />
        </View>

        <View style={{ padding: 20, paddingLeft: 30 }}>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View
              style={{
                width: 83,
                height: 83,
                borderColor: isOmni ? OMC_COLOR : STORE_COLOR,
                borderWidth: 3,
                borderRadius: 10,
                padding: 10,
                marginRight: 20,
              }}
            >
              <Image
                source={{
                  uri: props.image
                    ? props.image.substring(
                      "https://floimages.mncdn.com/media/catalog/product/"
                        .length
                    )
                    : props.picture,
                }}
                style={{ height: 60, width: 60, borderRadius: 10 }}
              />
              <View
                style={[
                  {
                    width: 43,
                    height: 43,
                    borderRadius: 43 / 2,
                    backgroundColor: "#41A563",
                    position: "absolute",
                    top: -19,
                    right: -19,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  { backgroundColor: isOmni ? OMC_COLOR : STORE_COLOR },
                ]}
              >
                <FloIcon name={isOmni ? "product-omc" : "product-store"} />
              </View>
            </View>

            <View>
              <AppText
                selectable
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: "rgb(32,33,36)",
                }}
              >
                {props.info?.name || props.title}
              </AppText>
              <AppText
                selectable
                style={{ fontFamily: "Poppins_400Regular", fontSize: 12 }}
              >
                {`${props.info?.size || props.size} ${props.info?.color?.toUpperCase() || props.color
                  } `}
              </AppText>
              <AppText
                selectable
                style={{ fontFamily: "Poppins_400Regular", fontSize: 12 }}
              >
                {props.sku}
              </AppText>
              <AppText
                selectable
                style={{ fontFamily: "Poppins_400Regular", fontSize: 12 }}
              >
                {props.barcode}
              </AppText>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <AppText
                  size={FontSizes.S}
                  style={{ width: 70, fontWeight: "400" }}
                >
                  {translate("crmOrderDetailScreen.supply")}{" "}
                </AppText>
                <AppText
                  selectable
                  style={{
                    fontWeight: "700",
                    color: !isOmni ? STORE_COLOR : OMC_COLOR,
                    fontSize: 12,
                  }}
                >
                  {isOmni ? "OMNI STOK" : "MAGAZA STOK"}
                </AppText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                {isOmni && (
                  <AppText
                    size={FontSizes.S}
                    style={{ width: 70, fontWeight: "400" }}
                  >
                    {translate("crmOrderDetailScreen.status")}{" "}
                  </AppText>
                )}
                <AppText style={{ fontWeight: "700", fontSize: 12 }}>
                  İptal Edildi (StockOut)
                </AppText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <AppText
                  size={FontSizes.S}
                  style={{ width: 70, fontWeight: "400" }}
                >
                  Sipariş :{" "}
                </AppText>
                <AppText
                  selectable
                  style={{
                    fontWeight: "700",
                    fontSize: 12,
                  }}
                >
                  {props.stockOutQuantity} Adet
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              padding: 10,
              paddingLeft: 30,
              marginBottom: 10,
              flexDirection: "row",
            }}
          >
            <AppText
              selectable
              style={{
                fontWeight: "700",
                color: "rgb(255 ,182 ,102)",
                fontSize: 15,
              }}
            >
              {translate("crmOrderDetailScreen.amount")} :{" "}
              {isOmni ? props.amount : props.price}
            </AppText>
          </View>
        </View>
      </View>
    );
  };

  const ProductCard: React.FC<any> = (props) => {
    const isOmni = !(props.info === undefined || props.info === null);
    return (
      <View
        style={{
          minHeight: 200,
          marginBottom: 20,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ position: "absolute" }}>
          <AppCardColorizeSvg color={AppColor.OMS.Background.OpacityOrange} />
        </View>

        <View style={{ padding: 20, paddingLeft: 30 }}>
          <View style={{ flexDirection: "row", justifyContent: 'space-between', marginBottom: 20 }}>
            <View>
              <View
                style={{
                  width: 83,
                  height: 83,
                  borderColor: isOmni ? OMC_COLOR : STORE_COLOR,
                  borderWidth: 3,
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 20,
                }}
              >
                <Image
                  source={{
                    uri: props.image
                      ? props.image.substring(
                        "https://floimages.mncdn.com/media/catalog/product/"
                          .length
                      )
                      : props.picture,
                  }}
                  style={{ height: 60, width: 60, borderRadius: 10 }}
                />
                <View
                  style={[
                    {
                      width: 43,
                      height: 43,
                      borderRadius: 43 / 2,
                      backgroundColor: "#41A563",
                      position: "absolute",
                      top: -19,
                      right: -19,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    { backgroundColor: isOmni ? OMC_COLOR : STORE_COLOR },
                  ]}
                >
                  <FloIcon name={isOmni ? "product-omc" : "product-store"} />
                </View>
              </View>


              <View>
                <AppText
                  selectable
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "rgb(32,33,36)",
                  }}
                >
                  {props.info?.name || props.title}
                </AppText>
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_400Regular", fontSize: 12 }}
                >
                  {`${props.info?.size || props.size} ${props.info?.color?.toUpperCase() || props.color
                    } `}
                </AppText>
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_400Regular", fontSize: 12 }}
                >
                  {props.sku}
                </AppText>
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_400Regular", fontSize: 12 }}
                >
                  {props.barcode}
                </AppText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: Platform.OS === 'web' ? '90%' : '60%' }}>
              {props?.paymentType && props?.paymentType.length > 0 && <AppText size={FontSizes.S} style={{ fontWeight: "bold", fontSize: 12, color: 'red' }}>
                {props?.paymentType}
              </AppText>}
            </View>
            <View>

            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <AppText
                  size={FontSizes.S}
                  style={{ width: 70, fontWeight: "400" }}
                >
                  {translate("crmOrderDetailScreen.supply")}{" "}
                </AppText>
                <AppText
                  selectable
                  style={{
                    fontWeight: "700",
                    color: !isOmni ? STORE_COLOR : OMC_COLOR,
                    fontSize: 12,
                  }}
                >
                  {isOmni ? "OMNI STOK" : "MAGAZA STOK"}
                </AppText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                {isOmni && (
                  <AppText
                    size={FontSizes.S}
                    style={{ width: 70, fontWeight: "400" }}
                  >
                    {translate("crmOrderDetailScreen.status")}{" "}
                  </AppText>
                )}
                <AppText style={{ fontWeight: "700", fontSize: 12 }}>
                  {GetCrmOrderItemStaus(props.info?.status)}
                </AppText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <AppText
                  size={FontSizes.S}
                  style={{ width: 70, fontWeight: "400" }}
                >
                  Sipariş :{" "}
                </AppText>
                <AppText
                  selectable
                  style={{
                    fontWeight: "700",
                    fontSize: 12,
                  }}
                >
                  {props.qty || props.quantity} Adet
                </AppText>
              </View>
            </View>
            <View style={{ alignItems: "flex-end", width: "30%" }}>
              {props.info?.shipping_link_url && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(props.info?.shipping_link_url)}
                >
                  <Image
                    source={require("../../../assets/shippingIcon.png")}
                    style={{ width: 59, height: 59, marginLeft: 10 }}
                  />
                  <View style={{ position: "absolute" }}>
                    <Image
                      source={require("../../../assets/crmi.png")}
                      style={{
                        width: 38,
                        height: 38,
                        marginLeft: 30,
                        marginTop: -7,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View>
          <View style={{ paddingLeft: 30, flexDirection: "row" }}>
            <AppText selectable style={{ fontWeight: "700" }}>
              {translate("crmOrderDetailScreen.shippingStore")}
              {"  "}
            </AppText>
            <AppText selectable>
              {props?.info?.stock_source_id_map || props.name}
            </AppText>
          </View>
          <View
            style={{
              padding: 10,
              paddingLeft: 30,
              marginBottom: 10,
              flexDirection: "row",
            }}
          >
            <AppText
              selectable
              style={{
                fontWeight: "700",
                color: "rgb(255 ,182 ,102)",
                fontSize: 15,
              }}
            >
              {translate("crmOrderDetailScreen.amount")} :{" "}
              {isOmni ? props.amount : props.price}
            </AppText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        headerTitle={translate("crmOrderDetailScreen.title")}
        enableButtons={["back"]}
      />
      {isLoading && (
        <>
          <View style={{ paddingHorizontal: 31, paddingVertical: 20 }}>
            <Title
              title1={translate("crmOrderDetailScreen.orderNum")}
              title2={products[0]?.info?.increment_id}
            />
            <Title
              title1={translate("crmOrderDetailScreen.customerName")}
              title2={crmOrders.customerName}
            />
            <Title
              title1={translate("crmOrderDetailScreen.ficheNumber")}
              title2={crmOrders.ficheNumber}
            />

            <Title
              title1={translate("crmOrderDetailScreen.createdon")}
              title2={
                crmOrders?.createDate
                  ? moment(crmOrders.createDate).format(
                    "DD/MM/YYYY HH:mm"
                  )
                  : ""
              }
            />

            <Title
              title1={translate("crmOrderDetailScreen.createdStore")}
              title2={
                allStore.find(
                  (x) => x.werks === crmOrders.createdStore
                )?.name
              }
            />
          </View>

          <View
            style={{
              paddingHorizontal: 31,
              flexDirection: "row",
              alignSelf: "flex-end",
            }}
          >
            <Image
              source={require("../../../assets/storeico.png")}
              style={{ width: 35, height: 35 }}
            />
            <AppText selectable>{crmOrders.createdStore}</AppText>
          </View>
          <View
            style={{
              paddingHorizontal: 31,

              alignSelf: "flex-end",
            }}
          >
            <AppText
              selectable
              style={{
                fontWeight: "700",
                color: "rgb(255 ,182 ,102)",
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              {translate("crmOrderDetailScreen.totalAmount")} :
              {crmOrders.payment?.amount.toFixed(2)}
            </AppText>
          </View>
          <FlatList
            bounces={false}
            style={{ paddingHorizontal: 30, paddingTop: 5 }}
            data={[...products, ...(instores || [])]}
            renderItem={({ item }) => {
              return (
                <React.Fragment>
                  <ProductCard
                    {...item}
                    {...{
                      shippingStore: crmOrders.shippingStore,
                      paymentType: crmOrders.payment?.type
                    }}
                  />
                  <StockOutProductCard {...item} />
                </React.Fragment>
              );
            }}
          />
        </>
      )}
    </ScrollView>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

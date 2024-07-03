import {
  AppColor,
  AppText,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import moment from "moment";
import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import FloIcon from "../../components/CustomIcons/FloIcon";
import { FloHeader } from "../../components/Header";
import { GetCrmOrderItemStaus } from "../../constant/CrmStatusMapDefination";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";

const OMC_COLOR = "rgba(140,38,160,1)";
const STORE_COLOR = "#41A563";

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
              {`${props.info?.size || props.size} ${
                props.info?.color?.toUpperCase() || props.color
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

const StockOutProductCard: React.FC<any> = (props) => {
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
              {`${props.info?.size || props.size} ${
                props.info?.color?.toUpperCase() || props.color
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

const CrmOrderDetail: React.FC<any> = (props) => {
  const { products, instores } = props.navigation.getParam("orderDetail");
  const { shipping } = props.navigation.getParam("orderDetail");

  const model = props.navigation.getParam("orderDetail");
  const payment = props.navigation.getParam("orderDetail");

  return (
    <View style={styles.container}>
      <FloHeader
        headerType={"standart"}
        headerTitle={translate("crmOrderDetailScreen.title")}
        enableButtons={["back"]}
      />
      <View style={{ paddingHorizontal: 31, paddingVertical: 20 }}>
        <Title
          title1={translate("crmOrderDetailScreen.orderNum")}
          title2={products[0]?.info?.increment_id}
        />
        <Title
          title1={translate("crmOrderDetailScreen.customerName")}
          title2={model.customerName}
        />
        <Title
          title1={translate("crmOrderDetailScreen.ficheNumber")}
          title2={model.ficheNumber}
        />

        <Title
          title1={translate("crmOrderDetailScreen.createdon")}
          title2={moment(model.createDate)
            .tz("Europe/Istanbul")
            .format("DD/MM/YYYY HH:mm")}
        />

        <Title
          title1={translate("crmOrderDetailScreen.createdStore")}
          title2={
            ApplicationGlobalService.allStore.find(
              (x) => x.werks === model.createdStore
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
        <AppText selectable>{model.createdStore}</AppText>
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
          {model.payment?.amount.toFixed(2)}
        </AppText>
      </View>
      <Observer>
        {() => (
          <>
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
                        shippingStore: model.shippingStore,
                      }}
                    />
                    {item.stockOutQuantity && <StockOutProductCard {...item} />}
                  </React.Fragment>
                );
              }}
            />
          </>
        )}
      </Observer>
    </View>
  );
};

export default CrmOrderDetail;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    height: 180,
    width: Dimensions.get("window").width - 31,
    backgroundColor: "#fff",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 24,

    elevation: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: "row",
    marginBottom: 20,
  },
  cardLeftImage: {
    width: 10,
    height: 50,
    marginRight: 10,
  },
  crmİ: {
    width: 10,
    height: 53,
    marginRight: 10,
  },
  infoTextContainer: {
    marginVertical: 15,
    width: Dimensions.get("window").width - 40 - 210,
  },

  infoIncrementId: {
    fontFamily: "Poppins_600SemiBold",
    color: "rgb(112,112,112)",
    fontSize: PerfectFontSize(13),
    marginBottom: 8,
  },
  infoFicheNumber: {
    fontFamily: "Poppins_600SemiBold",
    color: "rgb(112,112,112)",
    fontSize: PerfectFontSize(13),
    marginBottom: 8,
  },
  infoCustomerName: {
    fontFamily: "Poppins_600SemiBold",
    color: "rgb(112,112,112)",
    fontSize: PerfectFontSize(13),
    marginBottom: 8,
  },
  infoCreateDate: {
    fontFamily: "Poppins_600SemiBold",
    color: "rgb(112,112,112)",
    fontSize: PerfectFontSize(13),
    marginBottom: 8,
  },
  infoCreateStore: {
    fontFamily: "Poppins_600SemiBold",
    color: "rgb(112,112,112)",
    fontSize: PerfectFontSize(13),
    marginBottom: 8,
  },

  stateText: {
    fontFamily: "Poppins_300Light_Italic",
    fontSize: PerfectFontSize(11),
    color: "rgb(112,112,112)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: 200,
  },
});
function setInputValue(arg0: any): JSX.IntrinsicAttributes &
  import("@flomagazacilik/flo-digital-components").AppTextProps & {
    children?: React.ReactNode;
  } {
  throw new Error("Function not implemented.");
}

function clearChars(txt: any): any {
  throw new Error("Function not implemented.");
}

const AppCardColorizeSvg: React.FC<{ color: string }> = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={10} height={53} {...props}>
      <Path
        data-name="AGT Siparis karti"
        d="M10 0v43A10 10 0 0 1 0 53V10A10 10 0 0 1 10 0Z"
        fill={props.color}
      />
    </Svg>
  );
};
function product(product: any) {
  throw new Error("Function not implemented.");
}

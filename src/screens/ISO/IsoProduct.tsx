import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import {
  FlatList,
  PanGestureHandler,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { TouchableOpacity as RNTouch } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";

import { FloButton } from "../../components";
import FloIcon from "../../components/CustomIcons/FloIcon";
import { FloHeader } from "../../components/Header";
import FloLoadingModal from "../../components/Modal/FloLoadingModal";
import FloPrinterConfigLoadingModal from "../../components/Modal/FloPrinterConfigLoadingModal";
import BasketService from "../../core/services/BasketService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import PrinterConfigService from "../../core/services/PrinterConfigService";
import ProductService from "../../core/services/ProductService";
import { ToImageCdnUri } from "../../helper/ImageCdnExtensions";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import IsoImageSlider from "./IsoScreenPartials/IsoImageSlider";
import IsoProductStoreCard from "./IsoScreenPartials/IsoProductStoreCard";
import { isInRole } from "../../components/RoleGroup";
import { Path, Svg } from "react-native-svg";
import {
  AppButton,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import WarehouseRequestPopup from "./IsoScreenPartials/WarehouseRequestPopup";
import { Actions } from "react-native-router-flux";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import AccountService from "../../core/services/AccountService";
import { isIphoneX } from "react-native-iphone-x-helper";
import { Octicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const PRODUCT_IMAGE_WIDTH = 81;
const INFORMATION_POPUP_HEIGHT = 420;
const IMAGE_WIDTH = 81;
const IMAGE_CONTAINER_BORDER = 5;
const OMC_COLOR = "rgba(140,38,160,1)";
const STORE_COLOR = "#41A563";
const STORE_STOCK_BUFFER = 2;
const POPUP_WIDTH = 450;
const IsoProductC = observer((props: any) => {
  const informationPopupTranslation = useSharedValue(
    INFORMATION_POPUP_HEIGHT + 50
  );
  const product = ProductService.product;
  const [isOmc, setIsOmc] = useState(false);
  const [init, setInit] = useState(false);
  const transformY = useSharedValue(POPUP_WIDTH);
  const [isOpenProcessMenu, setIsOpenProcessMenu] = useState(false);
  const scurrentSceneValue = useSharedValue(1);
  const [salesOrg, setSalesOrg] = useState("");
  const [showVerticalSimilarProducts, setShowVerticalSimilarProducts] =
    useState(false);

  const openPopup = () => {
    transformY.value = withTiming(0, {
      duration: 300,
      easing: Easing.cubic,
    });
    setIsOpenProcessMenu(true);
  };

  const gestureEvt = useAnimatedGestureHandler({
    onStart: (state, ctx: any) => {
      ctx.startY = transformY.value;
    },
    onActive: (state, ctx: any) => {
      transformY.value = ctx.startY + state.translationY;
    },
    onEnd: (state, ctx) => {
      if (state.translationY + state.velocityY < 95) {
        transformY.value = withTiming(0, {
          duration: 300,
          easing: Easing.ease,
        });
      } else {
        transformY.value = withTiming(POPUP_WIDTH + 10, {
          duration: 300,
          easing: Easing.ease,
        });
      }
    },
  });

  const onCloseModal = () => {
    transformY.value = withTiming(POPUP_WIDTH + 90, {
      duration: 300,
      easing: Easing.ease,
    });
    setIsOpenProcessMenu(false);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      transformY.value,
      [0, POPUP_WIDTH + 150],
      [1, 0.8]
    );
    return {
      transform: [
        { translateY: transformY.value < 0 ? 0 : transformY.value - 150 },
      ],
      opacity,
    };
  });

  const [imageModal, setImageModal] = useState(false);

  useEffect(() => {
    if (!init && ProductService.product) {
      var storeQty = ProductService.product?.sizes.store.find(
        // @ts-ignore
        (x) => ProductService.product?.product.barcode === x.barcode
      )?.qty;

      var ecomQty = ProductService.product?.sizes.ecom.find(
        // @ts-ignore
        (x) => ProductService.product?.product.barcode === x.barcode
      )?.qty;

      // Barkod okutulduğunda ürün stoğu mağazada varsa mağaza stok seçili gelmeli
      if (storeQty) setIsOmc(false);
      // Barkod okutulduğunda ürün stoğu mağazada yok ecomda varsa omni stok seçili gelmeli
      else if (ecomQty) setIsOmc(true);
      // İki stokta yoksa mağaza stok seçili gelmeli
      else setIsOmc(false);

      setInit(true);

      setSalesOrg(
        ApplicationGlobalService.allStore.find(
          (x) => x.werks === AccountService.getUserStoreId()
        )?.salesOrg || ""
      );
    }
  }, [init, ProductService.product]);

  const isStoreFitStock = () => {
    var qty = ProductService.product?.sizes.store.find(
      // @ts-ignore
      (x) => ProductService.product?.product.barcode === x.barcode
    )?.qty;

    // @ts-ignore
    var result = qty >= STORE_STOCK_BUFFER;
    return result;
  };
  const informationPopupAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: informationPopupTranslation.value }],
      position: "absolute",
      bottom: 0,
    };
  });

  const ProductHeader = (props: any) => {
    const { product, isOmc } = props;
    return (
      <View
        style={[
          styles.productHeaderContainer,
          { marginBottom: 30 },
          styles.bottomSperator,
        ]}
      >
        <RNTouch
          onPress={() => {
            if (props.onShowModal) props.onShowModal();
          }}
          style={[
            styles.productHeaderImageContainer,
            { borderColor: isOmc ? OMC_COLOR : STORE_COLOR },
          ]}
        >
          <Image
            source={ToImageCdnUri(product.images[0], IMAGE_WIDTH, IMAGE_WIDTH)}
            style={{
              width:
                IMAGE_WIDTH - IMAGE_CONTAINER_BORDER - IMAGE_CONTAINER_BORDER,
              height:
                IMAGE_WIDTH - IMAGE_CONTAINER_BORDER - IMAGE_CONTAINER_BORDER,
              borderRadius: 14,
            }}
          />
          <View
            style={[
              styles.productHeaderImageContainerIconContainer,
              { backgroundColor: isOmc ? OMC_COLOR : STORE_COLOR },
            ]}
          >
            <FloIcon name={isOmc ? "product-omc" : "product-store"} />
          </View>
        </RNTouch>
        <View style={styles.productHeaderProductInfo}>
          <Text style={styles.productHeaderProductTitle}>{product.brand}</Text>
          <Text style={styles.productHeaderProductDescription}>
            {product.name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => openPopup()}
          style={{ justifyContent: "center" }}
        >
          <AntDesign name={"infocirlceo"} size={20} color={"#848484"} />
        </TouchableOpacity>
      </View>
    );
  };

  const ProductColors = observer((props: any) => {
    const ColorCard = (props: any) => {
      const { image, price, color, barcode, sku } = props.option;
      const isSelected = ProductService.product?.product.sku.includes(sku);
      return (
        <TouchableOpacity
          onPress={() => {
            if (!isSelected) {
              setInit(false);
              ProductService.getProduct(barcode);
            }
          }}
          style={[
            {
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 9,
              shadowOpacity: 1,
              borderStyle: "solid",
              marginRight: 20,
            },
          ]}
        >
          <View
            style={{
              borderColor: isSelected ? "#FF671C" : "#707070",
              borderWidth: 1,
              width: 140,
              borderRadius: 12,
              paddingLeft: 9,
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#fff",
            }}
          >
            <Image
              source={{ uri: image }}
              style={{ width: 43, height: 43, marginRight: 12 }}
            />
            <View>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: PerfectFontSize(13),
                }}
              >
                {color}
              </Text>
              {/* <Text style={{fontFamily: 'Poppins_300Light', fontSize: PerfectFontSize(13)}}>
                {price} ₺
              </Text> */}
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={styles.bottomSperator}>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: PerfectFontSize(15),
            marginBottom: 12,
          }}
        >
          {translate("isoProduct.color")}
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={ProductService.product?.options}
          renderItem={({ item, index }) => (
            <ColorCard key={`${item.sku}_colors_${index}`} option={item} />
          )}
          keyExtractor={(item: any, index) => `${item.sku}_colors_${index}`}
        />
      </View>
    );
  });

  const ProductSizes = (props: any) => {
    const SizeCard = (props: any) => {
      const { sizeInfo } = props;

      const isSelected =
        ProductService.product?.product.barcode === sizeInfo.barcode;
      return (
        <TouchableOpacity
          onPress={() => {
            if (!isSelected) {
              ProductService.getProduct(sizeInfo.barcode).finally(() =>
                setInit(false)
              );
            }
          }}
          style={[
            {
              // shadowColor: 'rgba(0, 0, 0, 0.1)',
              // shadowOffset: {
              //   width: 0,
              //   height: 3,
              // },
              // shadowRadius: 9,
              // shadowOpacity: 1,
              borderStyle: "solid",
            },
          ]}
        >
          <View
            style={{
              borderColor: isSelected ? "#FF671C" : "#dedede",
              borderWidth: 1,
              width: 55,
              height: 55,
              marginRight: 15,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: isSelected
                    ? "Poppins_700Bold"
                    : "Poppins_500Medium",
                  fontSize: PerfectFontSize(17),
                  textAlign: "center",
                  color: sizeInfo.qty === 0 ? "#dedede" : "#000",
                  marginBottom: 5,
                }}
              >
                {sizeInfo.size}
              </Text>
            </View>
            {sizeInfo.qty === 0 && (
              <View
                style={{
                  width: 68,
                  height: 2,
                  position: "absolute",
                  backgroundColor: "#dedede",
                  transform: [{ rotate: "-45deg" }],
                }}
              />
            )}
            {sizeInfo.qty > 0 && sizeInfo.qty < 4 && (
              <View style={{ position: "absolute", bottom: 0, width: 50 }}>
                <Text
                  style={{
                    fontSize: PerfectFontSize(9),
                    textAlign: "center",
                    fontFamily: "Poppins_600SemiBold",
                    color: "#FF671C",
                    lineHeight: 10,
                  }}
                >
                  {translate("isoStoreList.lastStock", { stock: sizeInfo.qty })}
                </Text>
              </View>
            )}
            {sizeInfo.qty >= 4 && (
              <View style={{ position: "absolute", bottom: 0 }}>
                <Text
                  style={{
                    fontSize: PerfectFontSize(9),
                    fontFamily: "Poppins_600SemiBold",
                    textAlign: "center",
                    lineHeight: 10,
                    color: "#6f7070",
                  }}
                >
                  {translate("isoStoreList.stock", { stock: sizeInfo.qty })}
                </Text>
              </View>
            )}
            {sizeInfo.qty === 0 && (
              <View style={{ position: "absolute", bottom: 0 }}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={55.832}
                  height={24}
                  viewBox="0 0 55.832 24"
                  {...props}
                >
                  <Path
                    data-name="Intersection 47"
                    d="M18.838 52.3A12.006 12.006 0 0 1 .167 40.765V34.3H56v8.815a12.018 12.018 0 0 1-8.441 9.185z"
                    transform="translate(-.167 -28.297)"
                    fill={"#db013c"}
                  />
                </Svg>
                <AppText
                  selectable
                  style={{
                    position: "absolute",
                    width: 55,
                    lineHeight: 9,
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: PerfectFontSize(9),
                    height: 55 / 1.75,
                    textAlign: "center",
                    textAlignVertical: "center",
                    padding: 1,
                  }}
                  labelColorType={ColorType.Light}
                  size={FontSizes.XS}
                >
                  {translate("isoStoreList.stockOut")}
                </AppText>
              </View>
              // <Text
              //   style={{
              //     fontSize: 8,
              //     fontFamily: 'Poppins_400Regular',
              //     color: 'red',
              //   }}>
              //   {translate('isoStoreList.stockOut')}
              // </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.bottomSperator}>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: PerfectFontSize(15),
            marginBottom: 12,
          }}
        >
          {translate("isoProduct.size")}
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={ProductService.product?.sizes.store.sort((el, next) =>
            Number(el.size) === Number(next.size)
              ? 0
              : Number(el.size) < Number(next.size)
              ? -1
              : 1
          )}
          renderItem={({ item, index }) => (
            <SizeCard key={`${item.sku}_stores_${index}`} sizeInfo={item} />
          )}
          keyExtractor={(item: any, index) => `${item.sku}_stores_${index}`}
        />
      </View>
    );
  };

  const ProductPrices = (props: any) => {
    const PriceCard = (props: any) => {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: PerfectPixelSize(25),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                width: 120,
                fontFamily: "Poppins_300Light",
                fontSize: PerfectFontSize(15),
              }}
            >
              {props.title}
            </Text>
            <Text
              style={{
                width: 120,
                fontFamily: "Poppins_300Light",
                fontSize: PerfectFontSize(15),
              }}
            >
              :
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Poppins_300Light",
              fontSize: PerfectFontSize(15),
              fontWeight: props.bold ? "bold" : "normal",
            }}
          >
            {props.price}
          </Text>
        </View>
      );
    };

    const getProductCurrency = () => {
      if (product?.product.currency === "TRY") return "₺";

      return product?.product.currency;
    };

    return (
      <View style={styles.bottomSperator}>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: PerfectFontSize(15),
            marginBottom: 12,
          }}
        >
          {translate("isoProduct.priceLabel")}
        </Text>
        <PriceCard
          title={translate("isoProduct.firstPrice")}
          price={`${
            ProductService.product?.tagValue.find((x) => x.tag === "KBETR1")
              ?.value
          } ${getProductCurrency()}`}
        />
        <PriceCard
          title={translate("isoProduct.salesPrice")}
          price={`${
            ProductService.product?.tagValue.find((x) => x.tag === "KBETR3")
              ?.value
          } ${getProductCurrency()}`}
        />
        <PriceCard
          title={translate("isoProduct.firstInstallmentPrice")}
          price={`${
            ProductService.product?.tagValue.find((x) => x.tag === "KBETR2")
              ?.value
          } ${getProductCurrency()}`}
        />
        <PriceCard
          title={translate("isoProduct.installmentPrice")}
          bold={true}
          price={`${
            ProductService.product?.tagValue.find((x) => x.tag === "KBETR4")
              ?.value
          } ${getProductCurrency()}`}
        />
      </View>
    );
  };

  const ProductSource = (props: any) => {
    const fitStock = isStoreFitStock();
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => setIsOmc(false)}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: STORE_COLOR,
              marginRight: 10,
            }}
          >
            {translate("isoProduct.storeStock")}
          </Text>
          <View
            style={{
              width: 21,
              height: 21,
              borderRadius: 10.5,
              backgroundColor: !isOmc ? "#fff" : "#E4E4E4",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: !isOmc ? STORE_COLOR : "#E4E4E4",
            }}
          >
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 7.5,
                backgroundColor: !isOmc ? STORE_COLOR : "#E4E4E4",
              }}
            ></View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => setIsOmc(true)}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: OMC_COLOR,
              marginRight: 10,
            }}
          >
            {" "}
            {translate("isoProduct.ecomStock")}
          </Text>
          <View
            style={{
              width: 21,
              height: 21,
              borderRadius: 10.5,
              backgroundColor: isOmc ? "#fff" : "#E4E4E4",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: isOmc ? OMC_COLOR : "#E4E4E4",
            }}
          >
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 7.5,
                backgroundColor: isOmc ? OMC_COLOR : "#E4E4E4",
              }}
            ></View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const PrintTagButton = (props: any) => {
    return (
      <View style={styles.bottomSperator}>
        <TouchableOpacity
          onPress={() =>
            salesOrg === "3111" || salesOrg === "3112" || salesOrg === "3114"
              ? Actions["isoProductQrPreview"]({ hideTabBar: true })
              : PrinterConfigService.printProductTag({
                  product: {
                    barcode: ProductService.product?.product.barcode,
                  },
                  tagValue: ProductService.product?.tagValue,
                })
          }
          style={{
            borderRadius: 8,
            height: 50,
            borderWidth: 1,
            borderColor: "#FF8600",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#fff",
          }}
        >
          <AntDesign name={"printer"} size={25} color={"#707070"} />
          <Text style={{ marginLeft: 14, color: "#707070" }}>
            {salesOrg === "3111" || salesOrg === "3112" || salesOrg === "3114"
              ? "Печать этикетки и QR"
              : translate("foundProduct.printLabel")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const StoreDistance = (props: any) => {
    if (ProductService.product)
      return (
        <IsoProductStoreCard placeholder={translate("isoProduct.findStore")} />
      );

    return null;
  };

  const SimilarProducts = (props: any) => {
    const SimilarProductCard = (props: any) => {
      const product = props.product;
      return (
        <TouchableOpacity
          onPress={() => {
            setInit(false);
            ProductService.getProduct(product.barcode);
          }}
          style={[
            {
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderStyle: "solid",
              marginRight: showVerticalSimilarProducts ? 0 : 15,
            },
          ]}
        >
          <View
            style={{
              borderColor: "#dedede",
              borderWidth: 1,
              borderRadius: 12,
              padding: 10,
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#fff",
              minHeight: 100,
              marginVertical: showVerticalSimilarProducts ? 5 : 0,
            }}
          >
            <Image
              source={{ uri: product.imageUrl }}
              style={{
                width: 75,
                height: 75,
                marginRight: 10,
                resizeMode: "contain",
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: PerfectFontSize(15),
                }}
              >
                {product.category.toUpperCase()}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_300Light",
                  fontSize: PerfectFontSize(12),
                  width: showVerticalSimilarProducts ? width / 2 : width / 2.2,
                }}
              >
                {product.name}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_300Light",
                  fontSize: PerfectFontSize(12),
                }}
              >
                {product.color + " | " + product.size}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    if (
      ProductService.product?.similarProducts &&
      ProductService.product.similarProducts.similarProducts.length > 0
    ) {
      let similarProductList =
        ProductService.product?.similarProducts.similarProducts;
      return (
        <View style={styles.bottomSperator}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: PerfectFontSize(15),
                marginBottom: 12,
              }}
            >
              {translate("isoProduct.alternativeProducts")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowVerticalSimilarProducts(!showVerticalSimilarProducts);
              }}
              style={{ flexDirection: "row" }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: PerfectFontSize(15),
                  marginBottom: 12,
                }}
              >
                {showVerticalSimilarProducts
                  ? translate("isoProduct.hide")
                  : translate("isoProduct.seeAll")}
              </Text>
              <Octicons
                name={
                  showVerticalSimilarProducts ? "chevron-up" : "chevron-down"
                }
                size={20}
                color={"#000"}
                style={{ paddingHorizontal: 5, paddingVertical: 1 }}
              />
            </TouchableOpacity>
          </View>
          {showVerticalSimilarProducts ? (
            <ScrollView
              style={{ maxHeight: 350 }}
              nestedScrollEnabled
              scrollEventThrottle={1600}
            >
              {similarProductList.map((item, index) => (
                <SimilarProductCard
                  key={`${item?.barcode}_similarProduct_${index}`}
                  product={item}
                />
              ))}
            </ScrollView>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={similarProductList}
              renderItem={({ item, index }) => (
                <SimilarProductCard
                  key={`${item?.barcode}_similarProduct_${index}`}
                  product={item}
                />
              )}
              keyExtractor={(item: any, index) =>
                `${item.sku}_similarProduct_${index}`
              }
            />
          )}
        </View>
      );
    }
    return null;
  };

  if (!ProductService.isLoading && product) {
    const line = (title: string, value: string) => {
      return (
        <View style={styles.line}>
          <Text
            style={{
              width: width / 2 - 1 - 100,
              fontFamily: "Poppins_300Light",
              fontSize: PerfectFontSize(15),
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              marginRight: 15,
              fontFamily: "Poppins_600SemiBold",
              fontSize: PerfectFontSize(15),
            }}
          >
            :
          </Text>
          <Text
            selectable
            style={{
              width: width / 2 - 1 - 20,
              fontFamily: "Poppins_600SemiBold",
              fontSize: PerfectFontSize(15),
              fontWeight: "600",
            }}
          >
            {value}
          </Text>
        </View>
      );
    };
    const getStoc = (type: "omc" | "store"): boolean => {
      if (type === "omc") {
        let omcFind = ProductService.product?.stores.find(
          (x) =>
            x.storeName === translate("crmCrmCreateCustomerComplaint.eCommerce")
        );

        return omcFind && omcFind.qty > 0 ? true : false;
      }

      //@ts-expect-error
      if (ProductService.product?.sizes.store.length === 0) {
        return ProductService.product.product.qty > 0;
      }
      let find = ProductService.product?.sizes.store.find(
        (x) => x.barcode === ProductService.product?.product.barcode
      );

      return find?.qty && find?.qty > 0 ? true : false;
    };

    const AppContent = [
      { id: "prodcutsource", component: <ProductSource />, role: "omc-basket" },
      {
        id: "prodcutcolors",
        component: <ProductColors options={product.options} />,
        role: "",
      },
      { id: "productsizes", component: <ProductSizes />, role: "" },
      { id: "productprices", component: <ProductPrices />, role: "" },
      { id: "printtagbutton", component: <PrintTagButton />, role: "" },
      { id: "storedistance", component: <StoreDistance />, role: "" },
      { id: "similarproducts", component: <SimilarProducts />, role: "" },
    ];

    // const [note, setNote] = useState("");
    return (
      // <Pressable style={styles.container} onPress={() => onCloseModal()}>
      <>
        <FloHeader
          headerType={"standart"}
          showLogo
          enableButtons={
            isInRole("omc-basket-pos") ? ["basket", "back"] : ["back"]
          }
        />
        <View style={{ flex: 1 }}>
          <ScrollView style={{ height: Dimensions.get("window").height - 220 }}>
            <View style={[styles.contentArea]}>
              <ProductHeader
                onShowModal={() => setImageModal(true)}
                product={product.product}
                isOmc={isOmc}
              />
              {isInRole("omc-basket") && !showVerticalSimilarProducts && (
                <ProductSource />
              )}
              {!showVerticalSimilarProducts && (
                <ProductColors options={product.options} />
              )}
              <SimilarProducts />
              <ProductSizes />
              <ProductPrices />
              <View style={{ marginBottom: 10 }} />
              {Platform.OS !== "web" && <PrintTagButton />}
              <StoreDistance />
            </View>
          </ScrollView>
        </View>
        {(isInRole("omc-basket") || isInRole("omc-warehouse-request")) && (
          <View
            style={{
              width,
              backgroundColor: "#fff",
              padding: 20,
              borderTopWidth: 1,
              borderColor: "rgba(0,0,0,0.2)",
              paddingBottom: Platform.OS === "ios" && isIphoneX() ? 40 : 20,
            }}
          >
            {isInRole("omc-warehouse-request") && !isOmc && (
              <React.Fragment>
                <WarehouseRequestPopup product={product.product} />
              </React.Fragment>
            )}
            {isInRole("omc-basket") && (
              <AppButton
                title={translate("foundProduct.addBasket")}
                buttonColorType={
                  isOmc && !getStoc("omc") ? ColorType.Gray : ColorType.Brand
                }
                disabled={isOmc && !getStoc("omc")}
                onPress={() => {
                  const sizeQty = ProductService.product?.sizes.store.find(
                    (x) => x.barcode === product.product.barcode
                  );
                  const outlet = ProductService.product?.product.outlet;
                  if (
                    outlet !== null &&
                    outlet !== undefined &&
                    outlet === "X"
                  ) {
                    MessageBox.Show(
                      "Outlet ürünler FLO Dijital üzerinden satılamamaktadır.",
                      MessageBoxDetailType.Danger,
                      MessageBoxType.Standart,
                      () => {},
                      () => {}
                    );
                    return;
                  }
                  if (isOmc && !getStoc("omc")) {
                    MessageBox.Show(
                      translate("errorMsgs.ecomStockOut"),
                      MessageBoxDetailType.Danger,
                      MessageBoxType.Standart,
                      () => {},
                      () => {}
                    );
                    return;
                  }
                  if (getStoc("store") && isOmc === false)
                    BasketService.addProduct(isOmc);
                  else if (sizeQty?.qty === 0 && isOmc === false)
                    MessageBox.Show(
                      "",
                      MessageBoxDetailType.Danger,
                      MessageBoxType.StockOutValidation,
                      () => {
                        BasketService.addProduct(isOmc);
                      },
                      () => {}
                    );
                  else if (isOmc === false && sizeQty === undefined)
                    MessageBox.Show(
                      translate("errorMsgs.wrongStockAlert"),
                      MessageBoxDetailType.Danger,
                      MessageBoxType.Standart,
                      () => {},
                      () => {}
                    );
                  else BasketService.addProduct(isOmc);
                }}
              />
            )}
          </View>
        )}
        <PanGestureHandler onGestureEvent={gestureEvt}>
          <Animated.View
            style={[styles.informationPopup, animatedContainerStyle]}
          >
            <View>
              <View style={styles.popupHeader}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    color: "white",
                    fontSize: PerfectFontSize(18),
                  }}
                >
                  {translate("foundProduct.productFeatures")}
                </Text>
              </View>
              <View style={styles.modalContent}>
                {line(
                  translate("foundProduct.brand"),
                  // @ts-ignore
                  ProductService.product?.product.brand
                )}
                {line(
                  translate("foundProduct.model"),
                  // @ts-ignore
                  ProductService.product?.product.model
                )}
                {line(
                  translate("foundProduct.color"),
                  // @ts-ignore
                  ProductService.product?.product.color
                )}
                {line(
                  translate("foundProduct.barcode"),
                  // @ts-ignore
                  ProductService.product?.product.barcode
                )}
                {line(
                  translate("foundProduct.sku"),
                  // @ts-ignore
                  ProductService.product?.product.parentSku
                )}
                {line(
                  translate("foundProduct.gender"),
                  // @ts-ignore
                  ProductService.product?.product.gender
                )}
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
        <FloPrinterConfigLoadingModal />
        {imageModal && (
          <IsoImageSlider
            onCloseImageModal={() => setImageModal(false)}
            product={product.product}
          />
        )}
      </>
      // </Pressable>
    );
  } else {
    return <FloLoadingModal />;
  }
});

class IsoProduct extends React.Component {
  render() {
    return <IsoProductC {...this.props} />;
  }
}
export default IsoProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: { flexDirection: "row", marginBottom: 20 },
  popupHeader: {
    backgroundColor: "#FF8600",
    padding: 12,
    borderRadius: 16,
    marginBottom: 30,
  },
  modalContent: {
    alignItems: "center",
  },
  informationPopup: {
    height: INFORMATION_POPUP_HEIGHT,
    width: width - 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 16,
    padding: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderColor: "#E4E4E4",
    backgroundColor: "white",
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    zIndex: 124,
    bottom: -150,
    position: "absolute",
  },
  contentArea: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 50,
  },
  productHeaderContainer: {
    flexDirection: "row",
  },
  productHeaderImageContainer: {
    borderColor: "#41A563",
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 14,
    borderWidth: IMAGE_CONTAINER_BORDER,
    marginRight: 20,
  },
  productHeaderImageContainerIconContainer: {
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
  productHeaderProductInfo: {
    width: width - (PRODUCT_IMAGE_WIDTH * 2 + 20),
    justifyContent: "center",
  },
  productHeaderProductTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(15),
  },
  productHeaderProductDescription: {
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(14),
  },
  bottomSperator: {
    borderBottomColor: "#D8D8D8",
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginBottom: 15,
  },
});

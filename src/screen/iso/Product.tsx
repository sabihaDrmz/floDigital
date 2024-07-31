import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  Platform,
  Pressable,
  TouchableOpacity
} from "react-native";
import { TouchableOpacity as RNTouch } from "react-native";
import {
  PerfectFontSize,
  PerfectPixelSize,
} from "../../helper/PerfectPixel";
import FloPrinterConfigLoadingModal from "../../components/Modal/FloPrinterConfigLoadingModal";
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FloLoadingModal from "../../components/Modal/FloLoadingModal";
import { translate } from "../../helper/localization/locaizationMain";
import { useBasketService } from "../../contexts/BasketService";
import { useProductService } from "../../contexts/ProductService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useAccountService } from "../../contexts/AccountService";
import { ToImageCdnUri } from "../../helper/ImageCdnExtensions";
import FloIcon from "../../components/CustomIcons/FloIcon";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faChevronDown, faChevronUp, faInfoCircle, faPrint} from '@fortawesome/free-solid-svg-icons';


import Svg, { Path } from "react-native-svg";
import {
  AppButton,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import ProductStoreCard from "../../components/Iso/ProductStoreCard";
import IsoImageSlider from "../../components/Iso/IsoImageSlider";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import NewWarehouseRequestPopup from "../../components/Iso/NewWarehouseRequestPopup";
import BottomSheet from "../../components/BottomSheet";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";

const { width, height } = Dimensions.get("window");
const PRODUCT_IMAGE_WIDTH = 81;
const INFORMATION_POPUP_HEIGHT = 480;
const IMAGE_WIDTH = 81;
const IMAGE_CONTAINER_BORDER = 5;
const OMC_COLOR = "rgba(140,38,160,1)";
const STORE_COLOR = "#41A563";
const STORE_STOCK_BUFFER = 2;
const POPUP_WIDTH = 450;

interface ProductProps {
}

const Product: React.FC<ProductProps> = (props) => {
  const { addProduct } = useBasketService();
  const { product, getProduct, isLoading, isOmsSearchProduct } = useProductService();
  const { show, isShow } = useMessageBoxService();
  const navigation = useNavigation();
  const { allStore } = useApplicationGlobalService();
  const { isInRole, getUserStoreId } = useAccountService();
  const { printProductTag } = usePrinterConfigService();

  const productData = product;
  const [isOmc, setIsOmc] = useState(false);
  const [init, setInit] = useState(false);
  const transformY = useSharedValue(POPUP_WIDTH);
  const [isOpenProcessMenu, setIsOpenProcessMenu] = useState(false);
  const scurrentSceneValue = useSharedValue(1);
  const [salesOrg, setSalesOrg] = useState("");
  const [showData, setshowData] = useState(false)

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
    if (!init && product) {
      var storeQty = product?.sizes.store.find(
        // @ts-ignore
        (x) => product?.product.barcode === x.barcode
      )?.qty;

      var ecomQty = product?.sizes.ecom.find(
        // @ts-ignore
        (x) => product?.product.barcode === x.barcode
      )?.qty;

      // Barkod okutulduğunda ürün stoğu mağazada varsa mağaza stok seçili gelmeli
      if (storeQty) setIsOmc(false);
      // Barkod okutulduğunda ürün stoğu mağazada yok ecomda varsa omni stok seçili gelmeli
      else if (ecomQty) setIsOmc(true);
      // İki stokta yoksa mağaza stok seçili gelmeli
      else setIsOmc(false);

      setInit(true);

      setSalesOrg(
        allStore.find(
          (x) => x.werks === getUserStoreId()
        )?.salesOrg || ""
      );
    }
  }, [init, product]);

  const isStoreFitStock = () => {
    var qty = product?.sizes.store.find(
      // @ts-ignore
      (x) => product?.product.barcode === x.barcode
    )?.qty;

    // @ts-ignore
    var result = qty >= STORE_STOCK_BUFFER;
    return result;
  };

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
          onPress={() => setshowData(true)}
          style={{ justifyContent: "center" }}
        >
          <FontAwesomeIcon icon={faInfoCircle} size={20} color={"#848484"} />
        </TouchableOpacity>
      </View>
    );
  };

  const ProductColors = (props: any) => {
    const ColorCard = (props: any) => {
      const { image, price, color, barcode, sku } = props.option;
      const isSelected = product?.product.sku.includes(sku);
      return (
        <TouchableOpacity
          onPress={() => {
            if (!isSelected) {
              getProduct(barcode).finally(() =>
                setInit(false)
              );
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
          data={product?.options}
          renderItem={({ item, index }) => (
            <ColorCard key={`${item.sku}_colors_${index}`} option={item} />
          )}
          keyExtractor={(item: any, index) => `${item.sku}_colors_${index}`}
        />
      </View>
    );
  };

  const ProductSizes = (props: any) => {
    const SizeCard = (props: any) => {
      const { sizeInfo } = props;

      const isSelected =
        product?.product.barcode === sizeInfo.barcode;
      return (
        <TouchableOpacity
          onPress={() => {
            if (!isSelected) {
              getProduct(sizeInfo.barcode).finally(
                () => setInit(false)
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
                    fontSize: 8,
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
                    fontSize: 9,
                    fontFamily: "Poppins_600SemiBold",
                    textAlign: "center",
                    lineHeight: 20,
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
                  height={18}
                  viewBox="0 0 55.832 18"
                  {...props}
                >
                  <Path
                    data-name="Intersection 47"
                    d="M8.838 52.3A12.006 12.006 0 0 1 .167 40.765V34.3H56v8.815a12.018 12.018 0 0 1-8.441 9.185z"
                    transform="translate(-.167 -34.297)"
                    fill={"#db013c"}
                  />
                </Svg>
                <AppText
                  selectable
                  style={{
                    position: "absolute",
                    width: 55,
                    textAlign: "center",
                    lineHeight: 18,
                    fontFamily: "Poppins_600SemiBold",
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
          data={product?.sizes.store.sort((el, next) =>
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
      if (productData?.product.currency === "TRY") return "₺";

      return productData?.product.currency;
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
          price={`${product?.tagValue.find((x) => x.tag === "KBETR1")
            ?.value
            } ${getProductCurrency()}`}
        />
        <PriceCard
          title={translate("isoProduct.salesPrice")}
          price={`${product?.tagValue.find((x) => x.tag === "KBETR3")
            ?.value
            } ${getProductCurrency()}`}
        />
        <PriceCard
          title={translate("isoProduct.firstInstallmentPrice")}
          price={`${product?.tagValue.find((x) => x.tag === "KBETR2")
            ?.value
            } ${getProductCurrency()}`}
        />
        <PriceCard
          title={translate("isoProduct.installmentPrice")}
          bold={true}
          price={`${product?.tagValue.find((x) => x.tag === "KBETR4")
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
              //@ts-ignore
              ? navigation.navigate("Iso", { screen: "ProductQrPreview" })
              : printProductTag({
                product: {
                  barcode: product?.product.barcode,
                },
                tagValue: product?.tagValue,
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
          <FontAwesomeIcon icon={faPrint} size={25} color={colors.floOrange} />
          <Text style={{ marginLeft: 14, color: colors.floOrange }}>
            {salesOrg === "3111" || salesOrg === "3112" || salesOrg === "3114"
              ? "Этикетка және QR басып шығар"
              : translate("foundProduct.printLabel")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const StoreDistance = (props: any) => {
    if (product)
      return (
        <ProductStoreCard placeholder={translate("isoProduct.findStore")} />
      );

    return null;
  };

  const SimilarProducts = (props: any) => {
    const SimilarProductCard = (props: any) => {
      const product = props.product;
      return (
        <TouchableOpacity
          onPress={() => {
            getProduct(product.barcode).finally(() =>
              setInit(false)
            );
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
      product?.similarProducts &&
      product.similarProducts.similarProducts.length > 0
    ) {
      let similarProductList =
        product?.similarProducts.similarProducts;
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
              <FontAwesomeIcon
                icon={
                  showVerticalSimilarProducts ?  faChevronUp: faChevronDown
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

  const customButtonAction = () => {
    if (isOmsSearchProduct) {
      navigation.navigate("Oms" as never);
    } else {
      //@ts-ignore
      navigation.navigate("Main", { screen: "Search" })
    }
  }

  const hexToString = (hex: string) => {
    return decodeURIComponent(hex.replace(/_/g, '%'));
  }


  if (!isLoading && productData) {
    const line = (title: string, value: string) => {
      return (
        <View style={styles.line}>
          <Text
            style={{
              width: width / 2 - 50,
              fontFamily: "Poppins_300Light",
              fontSize: PerfectFontSize(14),
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              marginRight: 25,
              fontFamily: "Poppins_600SemiBold",
              fontSize: PerfectFontSize(14),
            }}
          >
            :
          </Text>
          <Text
            selectable
            style={{
              width: width / 2 - 30,
              fontFamily: "Poppins_600SemiBold",
              fontSize: PerfectFontSize(14),
              fontWeight: "600",
              textAlign: 'left',
              writingDirection: 'rtl'
            }}
          >
            {value}
          </Text>
        </View>
      );
    };
    const getStoc = (type: "omc" | "store"): boolean => {
      if (type === "omc") {
        let omcFind = product?.stores.find(
          (x) =>
            x.storeName === translate("crmCrmCreateCustomerComplaint.eCommerce")
        );

        return omcFind && omcFind.qty > 0 ? true : false;
      }
      //@ts-ignore
      if (product?.sizes.store.length === 0) {
        return product.product.qty > 0;
      }
      let find = product?.sizes.store.find(
        (x) => x.barcode === product?.product.barcode
      );

      return find?.qty && find?.qty > 0 ? true : false;
    };

    return (
      <View style={styles.container}>
        <FloHeaderNew
          headerType={"standart"}
          showLogo
          enableButtons={
            isInRole("omc-basket-pos")
              ? ["basket", "back"]
              : ["back"]
          }
          customButtonActions={[
            {
              customAction: customButtonAction,
              buttonType: "back",
            },
          ]}
        />

        <ScrollView nestedScrollEnabled={true}>
          <View style={[styles.contentArea]}>
            <ProductHeader
              onShowModal={() => setImageModal(true)}
              product={productData.product}
              isOmc={isOmc}
            />
            {Platform.OS !== "web" && <PrintTagButton />}
            {isInRole("omc-basket") &&
              !showVerticalSimilarProducts && <ProductSource />}
            {!showVerticalSimilarProducts && (
              <ProductColors options={productData.options} />
            )}
            <SimilarProducts />
            <ProductSizes />
            <ProductPrices />
            <View style={{ marginBottom: 10 }} />
            <StoreDistance />
          </View>
        </ScrollView>

        <FloPrinterConfigLoadingModal />
        {imageModal && (
          <IsoImageSlider
            onCloseImageModal={() => setImageModal(false)}
            product={productData.product}
          />
        )}

        {!imageModal && (isInRole("omc-basket") ||
          isInRole("omc-warehouse-request")) &&
          (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width,
                backgroundColor: "#fff",
                padding: 20,
                borderTopWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                zIndex: 10,
              }}
            >
              {isInRole("omc-warehouse-request") && !isOmc && (
                <NewWarehouseRequestPopup
                  product={productData.product}
                  showError={(msg, showAgain, callback) => {
                    show(msg, {
                      yesButtonEvent: () => {
                        if (showAgain && callback) callback();
                      },
                    });
                  }}
                />
              )}
              {isInRole("omc-basket") && (
                <AppButton
                  title={translate("foundProduct.addBasket")}
                  buttonColorType={
                    isOmc && !getStoc("omc")
                      ? ColorType.Gray
                      : ColorType.Brand
                  }
                  disabled={isOmc && !getStoc("omc")}
                  onPress={() => {
                    const sizeQty = product?.sizes.store.find(
                      (x) => x.barcode === productData.product.barcode
                    );
                    const outlet = product?.product.outlet;
                    if (
                      outlet !== null &&
                      outlet !== undefined &&
                      outlet === "X"
                    ) {
                      show(
                        "Outlet ürünler FLO Dijital üzerinden satılamamaktadır."
                      );
                      return;
                    }
                    if (isOmc && !getStoc("omc")) {
                      show(translate("errorMsgs.ecomStockOut"));
                      return;
                    }
                    if (getStoc("store") && isOmc === false)
                      addProduct(isOmc);
                    else if (sizeQty?.qty === 0 && isOmc === false)
                      show("", {
                        type: MessageBoxType.StockOutValidation,
                        yesButtonEvent: () => {
                          addProduct(isOmc);
                        },
                      });
                    else if (isOmc === false && sizeQty === undefined)
                      show(translate("errorMsgs.wrongStockAlert"));
                    else addProduct(isOmc);
                  }}
                />
              )}
            </View>
          )}


        <BottomSheet show={showData} onDissmiss={() => setshowData(false)} enableBackDropDismiss={true}>
          <ScrollView>
            <Pressable style={styles.popupHeader} onPress={() => setshowData(false)}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: "white",
                  fontSize: PerfectFontSize(18),
                }}
              >
                {translate("foundProduct.productFeatures")}
              </Text>
            </Pressable>
            <View style={styles.modalContent}>
              {line(
                translate("foundProduct.brand"),
                // @ts-ignore
                product?.product.brand
              )}
              {line(
                translate("foundProduct.model"),
                // @ts-ignore
                product?.product.model
              )}
              {line(
                translate("foundProduct.color"),
                // @ts-ignore
                product?.product.color
              )}
              {line(
                translate("foundProduct.barcode"),
                // @ts-ignore
                product?.product.barcode
              )}
              {line(
                translate("isoProduct.generic"),
                // @ts-ignore
                product?.product.parentSku
              )}
              {line(
                translate("foundProduct.gender"),
                // @ts-ignore
                product?.product.gender
              )}
              {line(
                translate("foundProduct.outletAndSeason"),
                // @ts-ignore
                product?.product.outlet === "X" ? "Outlet" : "Sezon"
              )}
              {line(
                translate("foundProduct.productClass"),
                // @ts-ignore
                product?.product.type
              )}
              {line(
                translate("foundProduct.productCategory"),
                // @ts-ignore
                product?.product.productClass
              )}
              {line(
                translate("foundProduct.productClassInfo"),
                // @ts-ignore
                product?.product.zzstkgR_TANIM
              )}
              {line(
                translate("foundProduct.baseMaterial"),
                // @ts-ignore
                product?.product.baseMaterial
              )}
              {line(
                translate("foundProduct.leatherInfo"),
                // @ts-ignore
                product?.product.sayaText
              )}

            </View>
          </ScrollView>
        </BottomSheet>
      </View>
    );
  } else {
    return <FloLoadingModal />;
  }
};
export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: { flexDirection: "row", marginBottom: 4 },
  popupHeader: {
    backgroundColor: "#FF8600",
    padding: 12,
    borderRadius: 16,
    margin: 10
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
    bottom: -180,
    position: "absolute",
  },
  contentArea: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 160,
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

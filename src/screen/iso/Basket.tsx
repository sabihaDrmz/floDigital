import { AppText, ColorType } from "@flomagazacilik/flo-digital-components";
import i18n from 'i18next';
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useBasketService } from "../../contexts/BasketService";
import FloIcon from "../../components/CustomIcons/FloIcon";
import { useProductService } from "../../contexts/ProductService";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import { translate } from "../../helper/localization/locaizationMain";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { FloButton} from "../../components";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { useAccountService } from "../../contexts/AccountService";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import FloLoading from "../../components/FloLoading";
import { BasketItem } from "../../contexts/model/BasketItem";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { useNavigation } from "@react-navigation/native";
import * as RootNavigation from "../../core/RootNavigation"

interface BasketProps {
}

const OMC_COLOR = "rgba(140,38,160,1)";
const STORE_COLOR = "#41A563";
const STORE_STOCK_BUFFER = 1;
const IMAGE_WIDTH = 81;
const IMAGE_CONTAINER_BORDER = 5;

const Basket: React.FC<BasketProps> = (props) => {
  const { isLoading, basketStockItems, selectedBasket, updateProduct, clearBasket, removeProduct, checkBasketEditableState, address, isValidAddress, sentContract, completeBasket } = useBasketService();
  const { getProduct, product } = useProductService();
  const { isInRole } = useAccountService();
  const { show } = useMessageBoxService();
  const [showBasketNumber, setShowBasketNumber] = useState(false);
  const navigation = useNavigation();
  const user = useAccountService();

  const IsOutStock = (sku: string) => {
    let item = basketStockItems.find((x) => x.sku === sku);

    if (item && item.availableQty < item.quantity) {
      let it = selectedBasket.basketItems.find(
        (x) => x.sku === item?.sku
      );

      if (it && it.quantity > item.availableQty) {
        updateProduct(
          it.barcode,
          true,
          item.availableQty,
          true,
          true
        );
      }
    }
    return item && item.availableQty < item.quantity;
  };

  const storeIdCheck = () => {
    const userStore = user.getUserStoreId()
    if (userStore == "4059" || userStore == "4458" || userStore == "4115") return true;
    else return false;
  }

  const ClearBasket = () => {
    show(
      translate(
        selectedBasket &&
          selectedBasket.basketTicketId
          ? "errorMsgs.basketCloseAlert"
          : "errorMsgs.allBasketRemovedQuestion"
      ),
      {
        type: MessageBoxType.YesNo,
        yesButtonColorType: ColorType.Danger,
        noButtonColorType: ColorType.Brand,
        yesButtonEvent: () => {
          //@ts-ignore
          navigation.navigate("Home");
          clearBasket();
        },
        noButtonTitle: i18n.t("messageBox.cancel"),
        yesButtonTitle: i18n.t(
          selectedBasket &&
            selectedBasket.basketTicketId
            ? "messageBox.exit"
            : "messageBox.delete"
        ),
      }
    );
  };
  const ProductCard: React.FC<BasketItem> = (props) => {
    return (
      <>
        <View
          key={props.id.toString()}
          style={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                styles.productHeaderImageContainer,
                { borderColor: props.isOmc ? OMC_COLOR : STORE_COLOR },
              ]}
            >
              <Image
                source={{
                  uri:
                    "https://floimages.mncdn.com/mncropresize/100/100/" +
                    props.productImage,
                }}
                style={{
                  width:
                    IMAGE_WIDTH -
                    IMAGE_CONTAINER_BORDER -
                    IMAGE_CONTAINER_BORDER,
                  height:
                    IMAGE_WIDTH -
                    IMAGE_CONTAINER_BORDER -
                    IMAGE_CONTAINER_BORDER,
                  borderRadius: 14,
                }}
              />
              <View
                style={[
                  styles.productHeaderImageContainerIconContainer,
                  {
                    backgroundColor: props.isOmc ? OMC_COLOR : STORE_COLOR,
                  },
                ]}
              >
                <FloIcon
                  name={props.isOmc ? "product-omc" : "product-store"}
                />
              </View>
            </View>
            <View style={{ flex: 1, flexWrap: "wrap" }}>
              <TouchableOpacity
                onPress={() => {
                  //@ts-ignore
                  navigation.navigate("Iso", { screen: "Product" });
                  getProduct(props.barcode, 2, false);
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: PerfectFontSize(14),
                    fontWeight: "bold",
                    fontStyle: "normal",
                    lineHeight: PerfectFontSize(18),
                    letterSpacing: 0,
                    color: colors.darkGrey,
                  }}
                >
                  {props.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: PerfectFontSize(14),
                    fontWeight: "normal",
                    fontStyle: "normal",
                    lineHeight: PerfectFontSize(17),
                    letterSpacing: 0,
                    textAlign: "left",
                    color: colors.lightGrayText,
                    marginTop: 5,
                    flexWrap: "wrap",
                  }}
                >
                  {props.barcode}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: PerfectFontSize(14),
                    fontWeight: "normal",
                    fontStyle: "normal",
                    lineHeight: PerfectFontSize(17),
                    letterSpacing: 0,
                    textAlign: "left",
                    color: colors.lightGrayText,
                    marginTop: 5,
                    flexWrap: "wrap",
                  }}
                >
                  {props.parentSKU}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: PerfectFontSize(14),
                    fontWeight: "normal",
                    fontStyle: "normal",
                    lineHeight: PerfectFontSize(17),
                    letterSpacing: 0,
                    textAlign: "left",
                    color: colors.darkGrey,
                    marginTop: 5,
                    flex: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {props.description}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(14),
                      fontWeight: "500",
                      fontStyle: "normal",
                      lineHeight: PerfectFontSize(19),
                      letterSpacing: 0,
                      textAlign: "left",
                      color: colors.darkGrey,
                    }}
                  >
                    {translate("isoBasket.color")}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(14),
                      fontWeight: "bold",
                      fontStyle: "normal",
                      lineHeight: PerfectFontSize(19),
                      letterSpacing: 0,
                      textAlign: "left",
                      color: colors.black,
                    }}
                  >
                    {props.color}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(14),
                      fontWeight: "500",
                      fontStyle: "normal",
                      lineHeight: PerfectFontSize(19),
                      letterSpacing: 0,
                      textAlign: "left",
                      color: colors.darkGrey,
                    }}
                  >
                    {translate("isoBasket.size")}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(14),
                      fontWeight: "bold",
                      fontStyle: "normal",
                      lineHeight: PerfectFontSize(19),
                      letterSpacing: 0,
                      textAlign: "left",
                      color: colors.black,
                    }}
                  >
                    {props.size}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 20,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    lineHeight: PerfectFontSize(24),
                    letterSpacing: 0,
                    textAlign: "left",
                    color: colors.darkGrey,
                    paddingTop: 5,
                  }}
                >
                  {props.price.toFixed(2)} TL
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 16,
                }}
              >
                <View
                  style={{
                    width: 106,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: colors.whiteTwo,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 32,
                      height: 32,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() =>
                      updateProduct(
                        props.barcode,
                        props.isOmc,
                        props.quantity - 1
                      )
                    }
                  >
                    <View
                      style={{
                        height: 1.7,
                        backgroundColor: colors.darkGrey,
                        width: 13.3,
                      }}
                    ></View>
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      backgroundColor: colors.whiteThree,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: PerfectFontSize(16),
                        fontWeight: "500",
                        fontStyle: "normal",
                        lineHeight: PerfectFontSize(16),
                        letterSpacing: 0,
                        textAlign: "left",
                        color: colors.darkGrey,
                      }}
                    >
                      {props.quantity}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      updateProduct(
                        props.barcode,
                        props.isOmc,
                        props.quantity + 1
                      )
                    }
                    style={{
                      width: 32,
                      height: 32,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    show(
                      i18n.t("isoBasket.deleteProductMessage", {
                        productName: props.description,
                      }),
                      {
                        yesButtonEvent: () =>
                          removeProduct(props.id),
                        yesButtonTitle: i18n.t("messageBox.delete"),
                        noButtonTitle: i18n.t("messageBox.cancel"),
                        type: MessageBoxType.YesNo,
                      }
                    )
                  }
                  style={{ marginLeft: 30 }}
                >
                  <FontAwesomeIcon
                    icon={"trash"}
                    size={24}
                    color={colors.brightOrange}
                  />
                </TouchableOpacity>
              </View>
              {IsOutStock(props.sku) && props.isOmc && (
                <Text
                  style={{
                    color: "red",
                    height: 25,
                    fontSize: PerfectFontSize(10),
                    lineHeight: 12,
                    marginTop: PerfectPixelSize(10),
                  }}
                >
                  {translate("isoBasket.awailableStockMessage", {
                    qty: basketStockItems.find(
                      (x) => x.sku === props.sku
                    )?.availableQty,
                  })}
                </Text>
              )}
              {selectedBasket.basketItemResults &&
                selectedBasket.basketItemResults.find(
                  (x) => x.sku === props.sku && props.isOmc
                ) && (
                  <Text
                    style={{
                      color: "red",
                      height: 25,
                      fontSize: PerfectFontSize(10),
                      lineHeight: 12,
                      marginTop: PerfectPixelSize(10),
                    }}
                  >
                    {translate("isoBasket.awailableStockMessage", {
                      qty: selectedBasket.basketItemResults.find(
                        (x) => x.sku === props.sku
                      )?.quantity,
                    })}
                  </Text>
                )}
            </View>
            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                navigation.navigate("Iso", { screen: "Product" });
                getProduct(props.barcode, 2, false);
              }}
              style={{ marginTop: 30, marginLeft: 10 }}
            >
              <FontAwesomeIcon icon={"infocirlceo"} size={24} color={"#707070"} />
            </TouchableOpacity>
          </View>

          {_renderProductSource(props)}
        </View>
      </>
    );
  };

  const isStoreFitStock = () => {
    var qty = product?.sizes.store.find(
      // @ts-ignore
      (x) => product?.product.barcode === x.barcode
    )?.qty;

    // @ts-ignore
    var result = qty >= STORE_STOCK_BUFFER;
    return result;
  };
  const _renderProductSource = (props: BasketItem) => {
    const fitStock = true; //isStoreFitStock();
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => {
            updateProduct(
              props.barcode,
              props.isOmc,
              props.quantity,
              true,
              false
            );
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: STORE_COLOR,
              marginRight: 10,
            }}
          >
            {translate("isoBasket.storeStock")}
          </Text>
          <View
            style={{
              width: 21,
              height: 21,
              borderRadius: 10.5,
              backgroundColor: !props.isOmc ? "#fff" : "#E4E4E4",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: !props.isOmc ? STORE_COLOR : "#E4E4E4",
            }}
          >
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 7.5,
                backgroundColor: !props.isOmc ? STORE_COLOR : "#E4E4E4",
              }}
            ></View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => {
            updateProduct(
              props.barcode,
              props.isOmc,
              props.quantity,
              true,
              true
            );
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: OMC_COLOR,
              marginRight: 10,
            }}
          >
            {translate("isoBasket.ecomStock")}
          </Text>
          <View
            style={{
              width: 21,
              height: 21,
              borderRadius: 10.5,
              backgroundColor: props.isOmc ? "#fff" : "#E4E4E4",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: props.isOmc ? OMC_COLOR : "#E4E4E4",
            }}
          >
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 7.5,
                backgroundColor: props.isOmc ? OMC_COLOR : "#E4E4E4",
              }}
            ></View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const Sperator: React.FC = (props) => {
    return (
      <View
        style={{
          height: 1,
          marginLeft: 20,
          marginRight: 20,
          marginVertical: 20,
          backgroundColor: colors.whiteThree,
        }}
      />
    );
  };

  const Footer: React.FC = (props) => {
    let isOmcStoc =
      selectedBasket?.basketItems.findIndex((x) => x.isOmc) !==
      -1;

    return (
      <Observer>
        {() => {
          return (
            <View style={{ paddingHorizontal: 20, paddingBottom: Platform.OS === "web" ? 0 : 70, marginBottom: Platform.OS === "web" ? 0 : 40 }}>
              <View
                style={{
                  flexDirection: "column",
                  paddingBottom: 0,
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: PerfectFontSize(14),
                    fontWeight: "normal",
                    fontStyle: "normal",
                    lineHeight: PerfectFontSize(18),
                    letterSpacing: 0,
                    textAlign: "left",
                    color: colors.darkGrey,
                  }}
                >
                  {translate("isoBasket.totalPrice")}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontFamily: "Poppins_400Regular",
                    fontSize: 24,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    lineHeight: PerfectFontSize(28),
                    letterSpacing: 0,
                    marginTop: 5,
                    color: "#FF8600",
                  }}
                >
                  {(selectedBasket?.basketItems
                    ? selectedBasket?.basketItems
                    : []
                  )
                    .reduce((a, x) => a + x.price * x.quantity, 0)
                    .toFixed(2)}{" "}
                  TL
                </Text>
              </View>
              {/* {isInRole("omc-basket-pos") && BasketService.showAddressMessage && (
                <AppText
                  style={{ marginBottom: 20, fontWeight: "700" }}
                  labelColorType={ColorType.Danger}
                >
                  {i18n.translate("isoBasket.showMssMessage")}
                </AppText>
              )} */}
              {isInRole("omc-basket-pos") &&
                selectedBasket?.basketTicketId &&
                isOmcStoc ? (
                <FloButton
                  onPress={() =>
                    checkBasketEditableState(
                      selectedBasket?.id
                    ).then((res: any) => {
                      //@ts-ignore
                      if (isOmcStoc && res) navigation.navigate("Iso", { screen: "NewAddress" });
                    })
                  }
                  title={
                    address.aliciAdi?.length > 0 &&
                      address.aliciSoyadi?.length > 0 &&
                      address.adres?.length > 0 &&
                      address.ilce &&
                      address.il &&
                      address.telefon?.length > 0 &&
                      address.addressTitle?.length > 0
                      ? translate("isoBasket.editCustomerAddress")
                      : translate("isoBasket.addCustomerAddress")
                  }
                  containerStyle={{
                    backgroundColor: isOmcStoc ? "#FF8600" : "#c3c3c3",
                    marginBottom: 20,
                    borderRadius: 40,
                  }}
                />
              ) : null}
              <View style={{ flexDirection: Platform.OS === "web" ? "row" : "column", gap: Platform.OS === "web" ? 30 : 0, justifyContent: "space-between" }}>
                {isInRole("omc-basket-pos") &&
                  selectedBasket?.basketTicketId ? (
                  <>

                    <FloButton
                      title={translate("isoBasket.paymentProcess")}
                      containerStyle={{
                        flex: 1,
                        marginBottom: 20,
                        borderRadius: 40,
                        backgroundColor:
                          address.aliciAdi?.trim().length > 0 &&
                            address.aliciSoyadi?.trim().length > 0 &&
                            address.adres?.trim().length > 10 &&
                            address.ilce &&
                            address.il &&
                            address.telefon?.length > 0 &&
                            address.telefon?.length ===
                            "9 ( 999 ) 999 99 99".length
                            ? "#FF8600"
                            : "#c3c3c3",
                      }}
                      onPress={() =>
                        isOmcStoc && isValidAddress()
                          ? sentContract()
                          : !isOmcStoc
                            ? show(i18n.t("iso.omsOmniStockError"))
                            : null
                      }
                    />
                    <FloButton
                      title={translate("iso.oneByeOneChange")}
                      disabled={selectedBasket?.basketItems?.length > 1}
                      containerStyle={{
                        marginBottom: 20,
                        borderRadius: 40,
                        backgroundColor:
                          selectedBasket?.basketItems?.length < 2 && selectedBasket?.basketItems[0]?.quantity < 2 && address.aliciAdi?.trim().length > 0 &&
                            address.aliciSoyadi?.trim().length > 0 &&
                            address.adres?.trim().length > 10 &&
                            address.ilce &&
                            address.il &&
                            address.telefon?.length > 0 &&
                            address.telefon?.length ===
                            "9 ( 999 ) 999 99 99".length
                            ? "#00b2ff"
                            : "#c3c3c3",
                        flex: 1
                      }}
                      onPress={() =>
                        isOmcStoc && isValidAddress()
                          ? navigation.navigate('Iso', {
                            screen: 'IsoReturn', params: {
                              address: address,
                              selectedBasket: selectedBasket
                            }
                          })
                          : !isOmcStoc
                            ? show(i18n.t("iso.omsOmniStockError"))
                            : null
                      }
                    />
                  </>
                ) : null}
              </View>
              {isInRole("omc-basket") &&
                !selectedBasket?.basketTicketId ? (
                <FloButton
                  title={translate("isoBasket.completeBasket")}
                  onPress={() => completeBasket()}
                />
              ) : null}
              <View style={{ marginBottom: 60 }} />
            </View>
          );
        }}
      </Observer>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <FloHeaderNew
          headerType={"standart"}
          // showLogo
          enableButtons={["back", "close", "findBarcode"]}
          headerTitle={
            selectedBasket?.basketTicketId
              ? translate("iso.basketTitle2", {
                basketNo: selectedBasket?.basketTicketId,
              })
              : translate("iso.basketTitle3", {
                basketNo: selectedBasket?.basketItems?.length
                  ? selectedBasket?.basketItems
                    ?.reduce((a, b) => a + b.quantity, 0)
                    .toString()
                  : "0",
              })
          }
          customButtonActions={[
            {
              buttonType: "close", customAction: ClearBasket,
            },
            {
              buttonType: "back", customAction: () => { navigation.goBack() },
            }
          ]}
        />

        {selectedBasket &&
          selectedBasket?.basketItems &&
          selectedBasket?.basketItems?.length > 0 ? (
          <View
            style={[
              {
                marginTop: 20,
              },
              Platform.OS === "web" && {
                height: Dimensions.get("window").height - 200,
                overflow: "scroll",
              },
            ]}
          >
            <FlatList
              data={selectedBasket?.basketItems}
              renderItem={(product) => ProductCard(product.item)}
              keyExtractor={(item: BasketItem) => item.id.toString()}
              ItemSeparatorComponent={Sperator}
              ListFooterComponent={Footer}
            />
          </View>
        ) : (
          <View
            style={[
              styles.container,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <FontAwesomeIcon
              icon={"shopping-cart"}
              size={50}
              color={"rgb(255,134,0)"}
            />
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: PerfectFontSize(16),
                lineHeight: PerfectFontSize(18),
                color: "rgb(112,112,113)",
                marginTop: 20,
              }}
            >
              {translate("basketEmpty.emptyMessage")}
            </Text>
          </View>
        )}
        {showBasketNumber ? (
          <View
            style={{
              position: "absolute",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                height: 175,
                backgroundColor: colors.white,
                width: Dimensions.get("window").width - 40,
                borderRadius: 10,
                padding: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: PerfectFontSize(16),
                  lineHeight: PerfectFontSize(30),
                  textAlign: "center",
                  color: colors.darkGrey,
                }}
              >
                {translate("isoBasket.customerCartNo")}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 24,
                  lineHeight: PerfectFontSize(30),
                  textAlign: "center",
                  color: colors.darkGrey,
                  marginBottom: 20,
                }}
              >
                2
              </Text>
              <FloButton
                onPress={() => (RootNavigation.getPathName() === "Basket" ? navigation.goBack() : null)}
                title={translate("isoBasket.ok")}
                containerStyle={{ width: 135 }}
              />
            </View>
          </View>
        ) : null}
      </View>

      {isLoading ? <FloLoading /> : null}
    </View>
  );
};
export default Basket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  productHeaderImageContainer: {
    borderColor: "#41A563",
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 14,
    borderWidth: IMAGE_CONTAINER_BORDER,
    marginRight: 20,
  },
});


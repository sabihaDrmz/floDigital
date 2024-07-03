import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActionConst } from "react-native-router-flux";

import FloCard from "../../components/FloCard";
import { FloHeader } from "../../components/Header";
import BasketService, { Basket } from "../../core/services/BasketService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";

const unique = (value: any, index: any, self: any) => {
  return self.indexOf(value) === index;
};

@observer
class IsoBasketList extends Component {
  listener: any = undefined;
  componentDidMount() {
    BasketService.getAllBaskets();
  }

  render() {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back"]}
          headerTitle={translate("iso.basketTitle1")}
        />
        <View style={styles.container}>
          <FlatList
            data={BasketService.basketList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(itr) => this.renderBasket(itr.item)}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins_700Bold",
                    fontSize: 20,
                    color: colors.darkGrey,
                  }}
                >
                  {BasketService.isLoading
                    ? translate("iso.loadingBaskets")
                    : translate("iso.noActiveBasket")}
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => this.renderItemSperator()}
            refreshControl={
              <RefreshControl
                refreshing={BasketService.isLoading}
                tintColor={colors.brightOrange}
                onRefresh={() => BasketService.getAllBaskets()}
              />
            }
          />
        </View>
      </React.Fragment>
    );
  }

  renderBasket = (basket: Basket) => {
    // console.log(basket.basketItems);k
    // debugger;
    return (
      <TouchableOpacity onPress={() => BasketService.selectBasket(basket.id)}>
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <FloCard
            key={basket.id.toString()}
            cardBodyStyle={{
              flexDirection: "column",
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 5,
              marginTop: 10,
              flexGrow: 1,
              width: Dimensions.get("window").width - 90,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Image
                style={{
                  width: 31,
                  height: 28,
                  marginRight: 20,
                  resizeMode: "stretch",
                }}
                source={require("../../../assets/cart.png")}
              />
              <View
                style={{
                  flexGrow: 1,
                  marginRight: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Poppins_500Medium",
                    color: colors.floOrange,
                  }}
                >
                  {translate("iso.order")} ({basket.basketTicketId})
                </Text>
                <Text
                  style={{
                    fontSize: PerfectFontSize(14),
                    marginTop: 8,
                    fontFamily: "Poppins_400Regular",
                    color: colors.graySubtitle,
                  }}
                >
                  {translate("iso.creator", {
                    creator: basket.creatorName || "-",
                  })}
                </Text>
              </View>
              <TouchableOpacity
                style={{ position: "absolute", right: 0 }}
                onPress={() => {
                  MessageBox.Show(
                    translate("errorMsgs.removeSelectedBasketQuestion"),
                    MessageBoxDetailType.Warning,
                    MessageBoxType.YesNo,
                    () => {
                      BasketService.removeBasket(basket.id);
                    },
                    () => {}
                  );
                }}
              >
                <Image
                  style={{
                    width: 33,
                    height: 33,
                    resizeMode: "stretch",
                  }}
                  source={require("../../../assets/trash.png")}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomColor: "rgb(228, 228, 228)",
                borderBottomWidth: 2,
                paddingVertical: 5,
                width: "100%",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {basket.basketItems
                .filter(
                  (x, i, a) =>
                    a.findIndex(
                      (y) => y.barcode == x.barcode && y.isOmc == x.isOmc
                    ) === i
                )
                .map((x, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        padding: 0,
                        margin: 0,
                        position: "relative",
                        marginRight: 10,
                      }}
                    >
                      {x.quantity > 1 && (
                        <View
                          style={{
                            backgroundColor: "rgb(163, 163, 163)",
                            height: 28,
                            width: 28,
                            borderRadius: 14,
                            zIndex: 2,
                            position: "absolute",
                            top: 8,
                            left: -8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: colors.white,
                              fontSize: PerfectFontSize(18),
                              fontFamily: "Poppins_500Medium",
                              lineHeight: PerfectFontSize(32),
                              textAlign: "center",
                            }}
                          >
                            {x.quantity - 1}
                          </Text>
                        </View>
                      )}

                      <Image
                        source={{
                          uri:
                            "https://floimages.mncdn.com/mncropresize/100/100/" +
                            x.productImage,
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          marginTop: 20,
                          resizeMode: "stretch",
                          position: "absolute",
                          top: 0,
                          left: 2,
                        }}
                      />
                      {x.isOmc ? (
                        <Image
                          style={{
                            width: 94,
                            height: 94,
                            resizeMode: "stretch",
                          }}
                          source={require("../../../assets/border-purple-orders.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            width: 94,
                            height: 94,
                            resizeMode: "stretch",
                          }}
                          source={require("../../../assets/border-green-orders.png")}
                        />
                      )}
                    </View>
                  );
                })}
            </View>
          </FloCard>
        </View>
      </TouchableOpacity>
    );
  };

  renderItemSperator = () => {
    return (
      <View
        style={{
          borderStyle: "solid",
          borderWidth: 0.5,
          borderColor: colors.whiteThree,
          marginLeft: 20,
          marginRight: 20,
        }}
      ></View>
    );
  };
}
export default IsoBasketList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 6,
  },
});

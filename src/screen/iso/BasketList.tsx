import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useBasketService } from "../../contexts/BasketService";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { translate } from "../../helper/localization/locaizationMain";
import { colors } from "../../theme/colors";
import FloCard from "../../components/FloCard";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { Basket } from "../../contexts/model/Basket";
import { useNavigation } from "@react-navigation/native";

interface BasketListProps {

}

const RenderItemSperator = () => {
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

const BasketItem = (basket: Basket) => {
  const { selectBasket, removeBasket } = useBasketService();
  const { show } = useMessageBoxService();
  return (
    <TouchableOpacity onPress={() => selectBasket(basket.id)}>
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
              source={require("../../assets/cart.png")}
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
                show(
                  translate("errorMsgs.removeSelectedBasketQuestion"),
                  {
                    type: MessageBoxType.YesNo,
                    yesButtonEvent: () => {
                      removeBasket(basket.id);
                    },
                  }
                );
              }}
            >
              <Image
                style={{
                  width: 33,
                  height: 33,
                  resizeMode: "stretch",
                }}
                source={require("../../assets/trash.png")}
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
                        source={require("../../assets/border-purple-orders.png")}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 94,
                          height: 94,
                          resizeMode: "stretch",
                        }}
                        source={require("../../assets/border-green-orders.png")}
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

const BasketList: React.FC<BasketListProps> = (props) => {
  const { getAllBaskets, basketList, isLoading } = useBasketService();
  const navigation = useNavigation();
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      getAllBaskets();
    });

    return focusListener;
  }, [navigation]);

  return (
    <React.Fragment>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={translate("iso.basketTitle1")}
      />
      <View style={styles.container}>
        <FlatList
          data={basketList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itr) => <BasketItem {...itr.item} />}
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
                {isLoading
                  ? translate("iso.loadingBaskets")
                  : translate("iso.noActiveBasket")}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <RenderItemSperator />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              tintColor={colors.brightOrange}
              onRefresh={() => getAllBaskets()}
            />
          }
        />
      </View>
    </React.Fragment>
  );
};
export default BasketList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
});

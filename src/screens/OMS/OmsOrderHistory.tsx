import BlurView from "../../components/BlurView";
import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import linq from "linq";
import { Observer } from "mobx-react";
import moment from "moment";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import OmsService from "../../core/services/OmsService";
import { translate } from "../../helper/localization/locaizationMain";
import FloInfiniteScroll from "../../components/FloInfiniteScroll";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";

const OmsOrderHistory: React.FC = (props) => {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedOrderItem, setSelectedOrderItem] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const getPercentage = (val: number) => {
    const lq = linq
      .from(OmsService.orderHistory?.HistoryCharts || [])
      .firstOrDefault((x) => x.OrderNo === selectedOrder);
    let total = (lq?.Status1 || 0) + (lq?.Status2 || 0) + (lq?.Status3 || 0);

    return (100 * val) / total;
  };

  const [loading, setLoading] = useState(false);
  const onNextPage = () => {
    if (!loading) return;
    setLoading(true);
    OmsService.loadOrderHistory("", currentPage + 1).then(() => {
      setCurrentPage(currentPage + 1);
      setLoading(false);
    });
  };

  const [isSearchable, setIsSearchable] = useState(false);
  const getSearchOrderHistory = (data: string) => {
    setIsSearchable(true);
    OmsService.loadOrderHistory(data, 1).then(() => {
      setCurrentPage(1);
    });
  };
  return (
    <>
      <View style={styles.container}>
        {
          <Observer>
            {() => (
              <View style={{ flex: 1 }}>
                {/* <FloInfiniteScroll
                  nextPage={(page) =>
                    OmsService.loadOrderHistory("", currentPage + 1).then(
                      (res) => {
                        return res?.Orders || [];
                      }
                    )
                  }
                  enableSearch
                  data={OmsService.orderHistory?.Orders || []}
                  searchPlaceholder={translate("OmsOrderHistory.search")}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      key={`itm_${index}` + item.OrderNo}
                      onPress={() => {
                        OmsService.getOrderItemByOrderNo(item.OrderNo)
                          .then((res) => {
                            setSelectedOrderItem(res);
                          })
                          .finally(() => {
                            setSelectedOrder(item.OrderNo);
                          });
                      }}
                      style={styles.card}
                    >
                      <AppText
                        selectable
                        style={{ fontFamily: "Poppins_600SemiBold" }}
                      >
                        {translate("OmsOrderHistory.orderNo")} :{item.OrderNo}
                      </AppText>
                      <AppText
                        selectable
                        style={{ fontFamily: "Poppins_500Medium" }}
                      >
                        {item.ActionByName.trimEnd()} | {item.Action}
                      </AppText>
                      <AppText
                        selectable
                        style={{ fontFamily: "Poppins_500Medium" }}
                      >
                        {translate("OmsOrderHistory.actionDate")} :{" "}
                        {moment(item.ActionDate).format("DD/MM/YYYY HH:mm")}{" "}
                        {"\n"}
                        {translate("OmsOrderHistory.cargoConsensusDate")} :{" "}
                        {moment(item.CargoRecDate).format("DD/MM/YYYY HH:mm")}
                      </AppText>
                      <AppText style={{ fontFamily: "Poppins_500Medium" }}>
                        ATF : {item.Atf}
                      </AppText>
                    </TouchableOpacity>
                  )}
                  filterProps={[
                    "CargoRecDate",
                    "ActionByName",
                    "Action",
                    "OrderNo",
                  ]}
                /> */}
                <AppTextBox
                  placeholder="Ara"
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    if (text.length > 10) {
                      getSearchOrderHistory(text);
                    }

                    if (text.length <= 10 && isSearchable) {
                      OmsService.loadOrderHistory("", currentPage).then(() => {
                        setIsSearchable(false);
                      });
                    }
                  }}
                  style={{
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    marginHorizontal: 10,
                    marginVertical: 10,
                    padding: 16,
                    borderRadius: 10,
                  }}
                />
                <FlatList
                  showsVerticalScrollIndicator={false}
                  onEndReached={onNextPage}
                  onScroll={() => setLoading(true)}
                  contentContainerStyle={{
                    ...Platform.select({
                      web: {
                        height: Dimensions.get("window").height,
                      },
                    }),
                  }}
                  onEndReachedThreshold={0.3}
                  data={OmsService.orderHistory?.Orders.filter(
                    (x) =>
                      x !== undefined &&
                      (x.ActionByName.toUpperCase().includes(
                        searchQuery.toUpperCase()
                      ) ||
                        x.Action.toUpperCase().includes(
                          searchQuery.toUpperCase()
                        ) ||
                        x.OrderNo.toUpperCase().includes(
                          searchQuery.toUpperCase()
                        ) ||
                        moment(x.CargoRecDate)
                          .format("DD/MM/YYYY HH:mm")
                          .includes(searchQuery) ||
                        moment(x.ActionDate)
                          .format("DD/MM/YYYY HH:mm")
                          .includes(searchQuery))
                  )}
                  keyExtractor={(item, index) => `itm_${index}` + item.OrderNo}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      key={`itm_${index}` + item.OrderNo}
                      onPress={() => {
                        OmsService.getOrderItemByOrderNo(item.OrderNo)
                          .then((res) => {
                            setSelectedOrderItem(res);
                          })
                          .finally(() => {
                            setSelectedOrder(item.OrderNo);
                          });
                      }}
                      style={styles.card}
                    >
                      <AppText
                        selectable
                        style={{ fontFamily: "Poppins_600SemiBold" }}
                      >
                        {translate("OmsOrderHistory.orderNo")} :{item.OrderNo}
                      </AppText>
                      <AppText
                        selectable
                        style={{ fontFamily: "Poppins_500Medium" }}
                      >
                        {item.ActionByName.trimEnd()} | {item.Action}
                      </AppText>
                      <AppText
                        selectable
                        style={{ fontFamily: "Poppins_500Medium" }}
                      >
                        {translate("OmsOrderHistory.actionDate")} :{" "}
                        {moment(item.ActionDate).format("DD/MM/YYYY HH:mm")}{" "}
                        {"\n"}
                        {translate("OmsOrderHistory.cargoConsensusDate")} :{" "}
                        {moment(item.CargoRecDate).format("DD/MM/YYYY HH:mm")}
                      </AppText>
                      <AppText style={{ fontFamily: "Poppins_500Medium" }}>
                        ATF : {item.Atf}
                      </AppText>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </Observer>
        }
      </View>
      {selectedOrder !== "" && (
        <Observer>
          {() => (
            <BlurView
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                position: "absolute",
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  ...Platform.select({
                    web: { backgroundColor: "transparent" },
                    android: {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    },
                    ios: {
                      backgroundColor: "transparent",
                    },
                    windows: {
                      backgroundColor: "transparent",
                    },
                  }),
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width - 30,
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    padding: 20,
                    maxHeight: 450,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "rgba(136,182,230,1)",
                            marginRight: 10,
                          }}
                        />
                        <AppText selectable>
                          {translate("OmsOrderHistory.inOrderStatus")} (%
                          {getPercentage(
                            linq
                              .from(
                                OmsService.orderHistory?.HistoryCharts || []
                              )
                              .firstOrDefault(
                                (x) => x.OrderNo === selectedOrder
                              )?.Status1 || 0
                          )
                            .toFixed(2)
                            .trimEnd()}
                          )
                        </AppText>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "rgba(166,216,157,1)",
                            marginRight: 10,
                          }}
                        />
                        <AppText selectable>
                          {translate("OmsOrderHistory.collectionStatus")} (%
                          {getPercentage(
                            linq
                              .from(
                                OmsService.orderHistory?.HistoryCharts || []
                              )
                              .firstOrDefault(
                                (x) => x.OrderNo === selectedOrder
                              )?.Status2 || 0
                          )
                            .toFixed(2)
                            .trimEnd()}
                          )
                        </AppText>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "rgba(228,204,144,1)",
                            marginRight: 10,
                          }}
                        />
                        <AppText selectable>
                          {translate("OmsOrderHistory.packagingStatus")} (%
                          {getPercentage(
                            linq
                              .from(
                                OmsService.orderHistory?.HistoryCharts || []
                              )
                              .firstOrDefault(
                                (x) => x.OrderNo === selectedOrder
                              )?.Status3 || 0
                          )
                            .toFixed(2)
                            .trimEnd()}
                          )
                        </AppText>
                      </View>
                    </View>
                    <AppButton
                      onPress={() => {
                        setSelectedOrder("");
                        setSelectedOrderItem([]);
                      }}
                      buttonColorType={ColorType.Success}
                      style={{ width: 50 }}
                    >
                      <AntDesign name={"close"} size={25} color={"#fff"} />
                    </AppButton>
                  </View>
                  <AppText
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      marginBottom: 10,
                    }}
                  >
                    {translate("OmsOrderHistory.timeDistribution")} :
                  </AppText>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        height: 20,
                        backgroundColor: "rgba(136,182,230,1)",
                        flex: linq
                          .from(OmsService.orderHistory?.HistoryCharts || [])
                          .firstOrDefault((x) => x.OrderNo === selectedOrder)
                          ?.Status1,
                      }}
                    ></View>
                    <View
                      style={{
                        height: 20,
                        backgroundColor: "rgba(166,216,157,1)",
                        flex: linq
                          .from(OmsService.orderHistory?.HistoryCharts || [])
                          .firstOrDefault((x) => x.OrderNo === selectedOrder)
                          ?.Status2,
                      }}
                    ></View>
                    <View
                      style={{
                        height: 20,
                        backgroundColor: "rgba(228,204,144,1)",
                        flex: linq
                          .from(OmsService.orderHistory?.HistoryCharts || [])
                          .firstOrDefault((x) => x.OrderNo === selectedOrder)
                          ?.Status3,
                      }}
                    ></View>
                  </View>
                  <View>
                    <ScrollView style={{ paddingVertical: 10, height: 120 }}>
                      {linq
                        .from(OmsService.orderHistory?.OrderStats || [])
                        .where((x) => x.OrderNo === selectedOrder)
                        .toArray()
                        .map((x, index) => {
                          return (
                            <View
                              key={`act_${index}_${x.ActionDate}`}
                              style={{
                                borderBottomColor: "rgba(0,0,0,.2)",
                                borderBottomWidth: 1,
                                marginBottom: 5,
                                paddingBottom: 5,
                              }}
                            >
                              <AppText
                                selectable
                                style={{ fontFamily: "Poppins_500Medium" }}
                              >
                                {x.Action} | {x.ActionByName.trimEnd()} {"\n"}
                                {translate(
                                  "OmsOrderHistory.transactionDate"
                                )} :{" "}
                                {moment(x.ActionDate).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </AppText>
                            </View>
                          );
                        })}
                    </ScrollView>
                  </View>
                  {selectedOrderItem !== null &&
                    selectedOrderItem.length > 0 && (
                      <View>
                        <AppText
                          style={{
                            fontFamily: "Poppins_600SemiBold",
                            marginTop: 10,
                          }}
                        >
                          {translate("crmOrderDetailScreen.title")}
                        </AppText>
                        <ScrollView
                          style={{ paddingVertical: 10, height: 135 }}
                        >
                          <FlatList
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                            onEndReachedThreshold={16}
                            data={selectedOrderItem}
                            renderItem={({ item, index }) => (
                              <View
                                style={{
                                  borderBottomColor: "rgba(0,0,0,.2)",
                                  borderBottomWidth: 1,
                                  marginBottom: 5,
                                  paddingBottom: 5,
                                }}
                              >
                                <View style={{ flexDirection: "row" }}>
                                  <AppText
                                    style={{ fontFamily: "Poppins_500Medium" }}
                                  >
                                    {translate("foundProduct.model")} :{" "}
                                  </AppText>
                                  <AppText>{item.ModelName}</AppText>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                  <AppText
                                    style={{ fontFamily: "Poppins_500Medium" }}
                                  >
                                    {translate("foundProduct.barcode")} :{" "}
                                  </AppText>
                                  <AppText>{item.BarcodeNo} </AppText>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                  <AppText
                                    style={{ fontFamily: "Poppins_500Medium" }}
                                  >
                                    {translate("foundProduct.brand")} :{" "}
                                  </AppText>
                                  <AppText>{item.Brand} </AppText>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                  <AppText
                                    style={{ fontFamily: "Poppins_500Medium" }}
                                  >
                                    {translate("foundProduct.color")} :{" "}
                                  </AppText>
                                  <AppText>{item.Color} </AppText>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                  <AppText
                                    style={{ fontFamily: "Poppins_500Medium" }}
                                  >
                                    {translate("OmsCargoConsensus.bodySize")} :{" "}
                                  </AppText>
                                  <AppText>{item.BodySize} </AppText>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                  <AppText
                                    style={{ fontFamily: "Poppins_500Medium" }}
                                  >
                                    {translate("foundProduct.quantity")} :{" "}
                                  </AppText>
                                  <AppText>{item.Quantity} </AppText>
                                </View>
                              </View>
                            )}
                          />
                        </ScrollView>
                      </View>
                    )}
                </View>
              </View>
            </BlurView>
          )}
        </Observer>
      )}
    </>
  );
};
export default OmsOrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 16,
    borderRadius: 10,
  },
});

import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import OmsTimeAlertIco from "../../Icons/OmsTimeAlertIco";
import { Observer } from "mobx-react-lite";
import OmsService from "../../core/services/OmsService";
import OmsOrderTimeCard from "./Partials/OmsOrderTimeCard";
import OmsFilterCard, { IOmsOrderFilter } from "./Partials/OmsFilterCard";
import OmsOrderCard from "./Partials/OmsOrderCard";
import { durationToString } from "../../helper/DurationParseHelper";
import { LabelType } from "@flomagazacilik/flo-digital-components";
import { OmsOrderModel } from "../../core/models/OmsOrderModel";
import { Host } from "react-native-portalize";
import { translate } from "../../helper/localization/locaizationMain";

const OmsOrders: React.FC = (props) => {
  const [isShowFilterMenu, setShowFilterMenu] = useState(false);
  const [assignSelect, setAssign] = useState(false);
  const loadAssignableEmployees = () => {
    OmsService.loadAssignableEmployee();
  };
  const [filter, setFilter] = useState<IOmsOrderFilter>({
    channels: [],
    source: "",
  });

  const [selectedAssignPerson, setSelectedAssignPerson] = useState<number>();
  const [showAssigneePopup, setShowAssignee] = useState(false);
  useEffect(() => {
    loadAssignableEmployees();
  });

  const filterPredicate = (x: OmsOrderModel) => {
    if (x.ChannelCode === "BC" && filter.channels.includes("BC")) return true;
    else if (
      x.ChannelCode !== "BGK" &&
      x.ChannelCode !== "BC" &&
      filter.channels.includes("CC")
    )
      return true;
    else if (x.ChannelCode === "BGK" && filter.channels.includes("BGK"))
      return true;
    return filter.channels && filter.channels.length === 0;
  };

  const HeaderComponent = () => {
    return (
      <View>
        <Observer>
          {() => {
            if (OmsService.omsOrders && OmsService.omsOrders.length > 0) {
              return (
                <>
                  {OmsService.omsOrders.find((x) => x.Remainder < 30) ? (
                    <ScrollView
                      style={[styles.timeLine]}
                      contentContainerStyle={{
                        height: 160,
                      }}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {OmsService.omsOrders
                        ?.filter(
                          (x) => x.Remainder < 30 // &&
                          // x.ChannelCode?.toUpperCase() === 'BC',
                        )
                        .map((x) => {
                          // if (x.Remainder < 0) return null;
                          const color =
                            x.Remainder < 15
                              ? ColorType.Danger
                              : x.Remainder < 30
                              ? ColorType.Warning
                              : ColorType.Success;
                          return (
                            <OmsOrderTimeCard
                              orderID={x.ID}
                              source={x.ChannelCode}
                              color={color}
                              timeLeft={`${x.Remainder} ${translate(
                                "OmsOrders.min"
                              )}`}
                              icon={
                                x.Remainder < 15 ? <OmsTimeAlertIco /> : null
                              }
                              assignState={assignSelect}
                              data={{
                                qty: x.ProductCount,
                                timeLeft: durationToString(x.Duration),
                                order: x,
                              }}
                            />
                          );
                        })}
                      <View style={{ width: 30, height: 10 }} />
                    </ScrollView>
                  ) : (
                    <View style={{ marginTop: 5 }} />
                  )}
                  <OmsFilterCard
                    listItemCnt={
                      OmsService.omsOrders?.filter(filterPredicate).length
                    }
                    onAssignChange={setAssign}
                    onOpenFilterMenu={setShowFilterMenu}
                    hasOpen={isShowFilterMenu}
                    onAssign={assignSelect}
                    onFilter={(filter) => setFilter(filter)}
                    onAssignStart={() => {
                      setShowAssignee(true);
                      setSelectedAssignPerson(0);
                    }}
                  />
                </>
              );
            }
            return null;
          }}
        </Observer>
      </View>
    );
  };
  return (
    <Host>
      <View>
        <Observer>
          {() => {
            if (OmsService.omsOrders && OmsService.omsOrders.length > 0) {
              return (
                <View style={[styles.container]}>
                  <FlatList
                    initialNumToRender={6}
                    ListHeaderComponent={HeaderComponent}
                    windowSize={6}
                    style={
                      {
                        // height:
                        //   Dimensions.get('window').height -
                        //   (OmsService.omsOrders.find((x) => x.Remainder < 30)
                        //     ? 520
                        //     : 290),
                      }
                    }
                    data={OmsService.omsOrders.filter(filterPredicate)}
                    keyExtractor={(item) => item.ID.toString()}
                    renderItem={({ item }) => (
                      <OmsOrderCard
                        key={item.ID.toString()}
                        assignState={assignSelect}
                        order={item}
                        color={
                          item.ChannelCode?.toUpperCase() === "BGK"
                            ? AppColor.OMS.Background.Agt
                            : item.ChannelCode?.toUpperCase() === "BC"
                            ? AppColor.OMS.Background.ComeGet
                            : AppColor.OMS.Background.DeliveryHome
                        }
                      />
                    )}
                  />
                  {showAssigneePopup && (
                    <View
                      style={{
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height - 185,
                        padding: 20,
                        backgroundColor: "rgba(0,0,0,0.3)",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 15,
                          height: "40%",
                          width: "90%",
                          padding: 10,
                        }}
                      >
                        <ScrollView>
                          {OmsService.assignableEmployee?.map((x) => {
                            return (
                              <TouchableOpacity
                                key={x.UserID}
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 10,
                                }}
                                hitSlop={{ bottom: 5, top: 5 }}
                                onPress={() =>
                                  setSelectedAssignPerson(x.UserID)
                                }
                              >
                                <View
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 13,
                                    marginRight: 10,
                                    backgroundColor: "#e4e4e4",
                                    padding: 4,
                                  }}
                                >
                                  {selectedAssignPerson === x.UserID && (
                                    <View
                                      style={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: 9,
                                        backgroundColor:
                                          AppColor.FD.Brand.Solid,
                                      }}
                                    />
                                  )}
                                </View>
                                <AppText selectable labelType={LabelType.Label}>
                                  {x.Name?.trim()}
                                </AppText>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 2, marginRight: 10 }}>
                            <AppButton
                              title={translate("OmsOrders.assignToSelected")}
                              buttonColorType={ColorType.Success}
                              onPress={() =>
                                selectedAssignPerson
                                  ? OmsService.completeAssignQueue(
                                      selectedAssignPerson
                                    ).then(() => {
                                      setShowAssignee(false);
                                    })
                                  : null
                              }
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <AppButton
                              title={translate("OmsOrders.cancel")}
                              buttonColorType={ColorType.Danger}
                              onPress={() => setShowAssignee(false)}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            } else
              return (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                  }}
                >
                  <AppText
                    style={{ fontFamily: "Poppins_400Regular" }}
                    labelType={LabelType.Label}
                    size={FontSizes.XL}
                  >
                    {translate("OmsOrders.noPendingOrders")}
                  </AppText>
                </View>
              );
          }}
        </Observer>
      </View>
    </Host>
  );
};

export default OmsOrders;

const styles = StyleSheet.create({
  container: {},

  plusButtonContainer: {
    width: 41,
    height: 41,
    backgroundColor: "#FFF",
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    top: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "absolute",
    right: 5,
    elevation: 5,
  },

  timeLine: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
});

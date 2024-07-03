import {
  AppButton,
  AppCheckBox,
  AppText,
} from "@flomagazacilik/flo-digital-components";
import {
  AppColor,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { Portal } from "react-native-portalize";
import { AntDesign } from "@expo/vector-icons";
import { isInRole } from "../../../components/RoleGroup";
import OmsService from "../../../core/services/OmsService";
import OmsFilterIco from "../../../Icons/OmsFilterIco";
import OmsRefreshIco from "../../../Icons/OmsRefreshIco";
import OmsUserIco from "../../../Icons/OmsUserIco";
import { translate } from "../../../helper/localization/locaizationMain";

const OmsFilterCard: React.FC<{
  onOpenFilterMenu: (val: boolean) => void;
  onAssignChange: (state: boolean) => void;
  listItemCnt?: number;
  onFilter: (filter: IOmsOrderFilter) => void;
  onAssignStart?: () => void;
  hasOpen: boolean;
  onAssign: boolean;
}> = (props) => {
  const [showFilter, setShowFilter] = useState(props.hasOpen);
  const [assignState, setAssignState] = useState(props.onAssign);
  const [filter, setFilter] = useState<IOmsOrderFilter>({
    channels: [],
    source: "",
  });

  const checkBoxFilter = (channel: string, state: boolean) => {
    let tempFilter = filter;
    if (state && !tempFilter.channels.includes(channel))
      tempFilter.channels.push(channel);
    else if (!state && tempFilter.channels.includes(channel)) {
      let index = tempFilter.channels.indexOf(channel);
      if (index > -1) tempFilter.channels.splice(index, 1);
    }

    setFilter(tempFilter);
  };

  const FilterButton: React.FC<{
    badge?: number;
    title: string;
    icon: React.ReactNode;
    isRtl?: boolean;
    onPress?: () => void;
    disabled?: boolean;
  }> = (props) => {
    return (
      <AppButton transparent onPress={props.onPress} disabled={props.disabled}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {props.isRtl === undefined || props.isRtl === false
            ? props.icon
            : null}
          {props.badge !== undefined && props.badge > 0 && (
            <View
              style={{
                position: "absolute",
                width: 17,
                height: 17,
                borderRadius: 8.5,
                backgroundColor: AppColor.OMS.Background.Agt,
                justifyContent: "center",
                alignItems: "center",
                top: -8,
                left: -8,
              }}
            >
              <AppText
                selectable
                labelColorType={ColorType.Light}
                size={FontSizes.XS}
                style={{ fontWeight: "bold" }}
              >
                {props.badge}
              </AppText>
            </View>
          )}
          {props.title && (
            <AppText
              selectable
              style={{ marginLeft: 10, marginRight: 10 }}
              labelColorType={ColorType.Gray}
              size={FontSizes.M}
            >
              {props.title}
            </AppText>
          )}
          {props.isRtl && props.icon}
        </View>
      </AppButton>
    );
  };

  const FilterContainer: React.FC = (prp) => {
    const [sourceComboIsOpen, setSourceComboIsOpen] = useState(false);
    return (
      <Portal>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            elevation: 1,
            backgroundColor: "rgba(0,0,0,.3)",
          }}
        >
          <View
            style={{
              padding: 25,
              top: 10,
              width: "90%",
              backgroundColor: "#fff",
              borderRadius: 15,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <FilterButton
                icon={<OmsFilterIco />}
                title={translate("OmsFilterCard.filter")}
              />
              <View>
                <AppButton
                  onPress={() => {
                    setShowFilter(false);
                    props.onOpenFilterMenu(false);
                  }}
                  style={{
                    backgroundColor: "#C6C9CC",
                    width: 40,
                    height: 40,
                  }}
                >
                  <AntDesign color={"#fff"} size={25} name={"close"} />
                </AppButton>
              </View>
            </View>
            <View>
              <View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: 20,
                    paddingTop: 0,
                  }}
                >
                  <AppCheckBox
                    checked={filter.channels.includes("BGK")}
                    onSelect={(state) => {
                      checkBoxFilter("BGK", state);
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: AppColor.OMS.Background.Agt,
                        marginHorizontal: 10,
                      }}
                    />
                    <AppText style={{ fontWeight: "500" }}>
                      {translate("OmsFilterCard.sameDayHome")}
                    </AppText>
                  </AppCheckBox>
                  <AppCheckBox
                    checked={filter.channels.includes("BC")}
                    onSelect={(state) => {
                      checkBoxFilter("BC", state);
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: AppColor.OMS.Background.ComeGet,
                        marginHorizontal: 10,
                      }}
                    />
                    <AppText style={{ fontWeight: "500" }}>
                      {translate("OmsFilterCard.sameDayCome")}
                    </AppText>
                  </AppCheckBox>
                  <AppCheckBox
                    checked={filter.channels.includes("CC")}
                    onSelect={(state) => {
                      checkBoxFilter("CC", state);
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: AppColor.OMS.Background.DeliveryHome,
                        marginHorizontal: 10,
                      }}
                    />
                    <AppText style={{ fontWeight: "500" }}>
                      {translate("OmsFilterCard.homeCargo")}
                    </AppText>
                  </AppCheckBox>
                </View>
                <AppButton
                  onPress={() => {
                    props.onFilter(filter);
                    setShowFilter(false);
                    props.onOpenFilterMenu(false);
                  }}
                  title={translate("OmsFilterCard.filter")}
                  style={{
                    marginRight: 20,
                    marginLeft: 10,
                    height: 45,
                    marginTop: -10,
                    zIndex: sourceComboIsOpen ? -1 : 0,
                    elevation: sourceComboIsOpen ? -1 : 0,
                  }}
                  buttonColorType={ColorType.Success}
                />
              </View>
            </View>
          </View>
        </View>
      </Portal>
    );
  };
  return (
    <View style={{ padding: 25, paddingTop: 0 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
          alignSelf: "stretch",
          position: "relative",
        }}
      >
        {assignState ? (
          <Observer>
            {() => {
              const checked =
                OmsService.assignTemp.length === OmsService.omsOrders?.length;

              return (
                <AppCheckBox
                  onSelect={(state) =>
                    OmsService.addAssignQueue(
                      "all",
                      state ? "check" : "uncheck",
                      0
                    )
                  }
                  checked={checked}
                  title={translate("OmsFilterCard.selectAll")}
                />
              );
            }}
          </Observer>
        ) : (
          <FilterButton
            badge={filter.channels.length + (filter.source !== "" ? 1 : 0)}
            title={translate("OmsFilterCard.filter")}
            icon={<OmsFilterIco />}
            disabled={showFilter}
            onPress={() => {
              setShowFilter(true);
              props.onOpenFilterMenu && props.onOpenFilterMenu(true);
            }}
          />
        )}
        {assignState ? (
          <>
            <AppButton
              colorType={ColorType.Success}
              style={{
                height: 40,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.25,
                shadowRadius: 1.84,

                elevation: 5,
                paddingHorizontal: 15,
              }}
              hitSlop={{ bottom: 10, top: 10 }}
              title={translate("OmsFilterCard.assignSelected")}
              onPress={props.onAssignStart}
            />
            <AppButton
              onPress={() => {
                props.onAssignChange(false);
                setAssignState(false);
              }}
              style={{
                backgroundColor: "#C6C9CC",
                width: 40,
                height: 40,
              }}
            >
              <AntDesign color={"#fff"} size={25} name={"close"} />
            </AppButton>
          </>
        ) : (
          <>
            {isInRole("omc-oms-store-chief") && (
              <FilterButton
                onPress={() => {
                  props.onAssignChange(true);
                  setAssignState(true);
                }}
                title={translate("OmsFilterCard.assignment")}
                icon={<OmsUserIco />}
                disabled={!isInRole("omc-oms-store-chief")}
              />
            )}
            <FilterButton
              onPress={() => OmsService.loadAllOrders()}
              title={translate("OmsFilterCard.refresh")}
              icon={<OmsRefreshIco />}
              isRtl
            />
          </>
        )}
      </View>
      {showFilter && <FilterContainer />}
      {props.listItemCnt !== undefined && (
        <AppText selectable style={{ textAlign: "right" }}>
          {props.listItemCnt} {translate("OmsFilterCard.orderQuantity")}
        </AppText>
      )}
    </View>
  );
};

export default OmsFilterCard;

export interface IOmsOrderFilter {
  source: string;
  channels: string[];
}

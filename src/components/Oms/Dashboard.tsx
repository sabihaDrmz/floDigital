import {
  AppColor,
  AppDonught,
  AppHalfDonught,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
  ProgressBar,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import { translate } from "../../helper/localization/locaizationMain";
import { useOmsService } from "../../contexts/OmsService";
import { useAccountService } from "../../contexts/AccountService";
import StoreChiefReport from "./partials/StoreChiefReport";
const Bullets: React.FC<{ currentPage: number }> = (props) => {
  const { currentPage } = props;
  const Account = useAccountService();
  return (
    <View
      style={{
        position: "absolute",
        height: 10,
        width: 100,
        flexDirection: "row",
        justifyContent: "center",
        bottom: 30,
        left: Dimensions.get("window").width / 2 - 50,
      }}
    >
      <View
        style={[
          {
            height: 10,
            width: 10,
            borderRadius: 5,
            marginRight: 5,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#e4e4e4",
          },
          currentPage === 0 && { backgroundColor: "#e4e4e5" },
        ]}
      />
      <View
        style={[
          {
            height: 10,
            width: 10,
            borderRadius: 5,
            marginRight: 5,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#e4e4e4",
          },
          currentPage === 1 && { backgroundColor: "#e4e4e5" },
        ]}
      />
      <View
        style={[
          {
            height: 10,
            width: 10,
            borderRadius: 5,
            marginRight: 5,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#e4e4e4",
          },
          currentPage === 2 && { backgroundColor: "#e4e4e5" },
        ]}
      />
      {Account.isInRole("omc-oms-store-chief") && (
        <View
          style={[
            {
              height: 10,
              width: 10,
              borderRadius: 5,
              marginRight: 5,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#e4e4e4",
            },
            currentPage === 3 && { backgroundColor: "#e4e4e5" },
          ]}
        />
      )}
    </View>
  );
};
const Orders: React.FC<{ data: any }> = (props) => {
  return (
    <KeyboardAwareScrollView style={styles.wrapper} bounces={false}>
      <AppText
        labelType={LabelType.Label}
        size={FontSizes.M}
        style={{ textAlign: "center" }}
        labelColorType={ColorType.Gray}
      >
        {translate("OmsDashboard.orders")}
      </AppText>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <AppHalfDonught
          radius={80}
          strokeWidth={4}
          current={props.data?.Asigned || 0}
          maxValue={props.data?.TotalOrderList || 0}
          icoType={1}
          txt1={translate("OmsDashboard.assigned")}
          txt2={translate("OmsDashboard.notAssigned")}
        />
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: AppColor.OMS.Background.Dark,
          marginLeft: 10,
          marginRight: 10,
          opacity: 0.1,
        }}
      />
      <AppText
        labelType={LabelType.Label}
        size={FontSizes.M}
        labelColorType={ColorType.Gray}
        style={{ textAlign: "center", marginTop: 15, marginBottom: 10 }}
      >
        {translate("OmsDashboard.notAssignedOrdersDistribution")}
      </AppText>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View style={{ height: 250 }}>
          <AppDonught
            collection={[
              {
                color: AppColor.OMS.Background.Agt,
                qty: props.data.UnasignedAGT,
                txtColor: "",
              },
              {
                color: AppColor.OMS.Background.ComeGet,
                qty: props.data.UnasignedBC,
                txtColor: "",
              },
              {
                color: AppColor.OMS.Background.DeliveryHome,
                qty: props.data.UnasignedCC,
                txtColor: "",
              },
            ]}
          />
        </View>

        <View
          style={{
            marginTop: 0,
            zIndex: 999,
            elevation: 999,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: AppColor.OMS.Background.Agt,
                borderRadius: 5,
                marginRight: 10,
              }}
            />
            <AppText>{translate("OmsDashboard.sameDayHomeDelivery")}</AppText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: AppColor.OMS.Background.ComeGet,
                borderRadius: 5,
                marginRight: 10,
              }}
            />
            <AppText>{translate("OmsDashboard.sameDayComeAndGet")}</AppText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: AppColor.OMS.Background.DeliveryHome,
                borderRadius: 5,
                marginRight: 10,
              }}
            />
            <AppText>{translate("OmsDashboard.homeDeliveryByCargo")}</AppText>
          </View>
        </View>
      </View>
      <View style={{ height: 80 }} />
    </KeyboardAwareScrollView>
  );
};

const Pick: React.FC<{ data: any }> = (props) => {
  return (
    <KeyboardAwareScrollView style={styles.wrapper} bounces={false}>
      <AppText
        labelType={LabelType.Label}
        size={FontSizes.M}
        style={{ textAlign: "center" }}
        labelColorType={ColorType.Gray}
      >
        {translate("OmsDashboard.myCollectionList")}
      </AppText>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <AppHalfDonught
          radius={80}
          strokeWidth={4}
          current={props.data.PickedItems}
          maxValue={props.data.TotalItemList}
          icoType={2}
          txt1={translate("OmsDashboard.collected")}
          txt2={translate("OmsDashboard.notCollected")}
        />
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: AppColor.OMS.Background.Dark,
          marginLeft: 10,
          marginRight: 10,
          opacity: 0.1,
        }}
      />
      <AppText
        labelType={LabelType.Label}
        size={FontSizes.M}
        labelColorType={ColorType.Gray}
        style={{ textAlign: "center", marginTop: 15 }}
      >
        {translate("OmsDashboard.unCollectedDeliveryOfOrders")}
      </AppText>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View style={{ height: 250 }}>
          <AppDonught
            collection={[
              {
                color: AppColor.OMS.Background.Agt,
                qty: props.data.UnPickedItemsAGT,
                txtColor: "",
              },
              {
                color: AppColor.OMS.Background.ComeGet,
                qty: props.data.UnPickedItemsBC,
                txtColor: "",
              },
              {
                color: AppColor.OMS.Background.DeliveryHome,
                qty: props.data.UnPickedItemsCC,
                txtColor: "",
              },
            ]}
          />
        </View>
        <View
          style={{
            marginTop: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: AppColor.OMS.Background.Agt,
                borderRadius: 5,
                marginRight: 10,
              }}
            />
            <AppText>{translate("OmsDashboard.sameDayHomeDelivery")}</AppText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: AppColor.OMS.Background.ComeGet,
                borderRadius: 5,
                marginRight: 10,
              }}
            />
            <AppText>{translate("OmsDashboard.sameDayComeAndGet")}</AppText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: AppColor.OMS.Background.DeliveryHome,
                borderRadius: 5,
                marginRight: 10,
              }}
            />
            <AppText>{translate("OmsDashboard.homeDeliveryByCargo")}</AppText>
          </View>
        </View>
      </View>
      <View style={{ height: 80 }} />
    </KeyboardAwareScrollView>
  );
};
const DrawProgressBar = (
  picked: number,
  unpicked: number,
  color: string,
  title: string
) => {
  if (
    (picked || 0) + (unpicked || 0) < 1 ||
    (picked || 0) + (unpicked || 0) === NaN
  )
    return null;
  return (
    <ProgressBar
      title={title}
      currentTitle={
        "{%current} / {%maxValue} " + translate("OmsDashboard.packed")
      }
      current={picked || 0}
      maxValue={(picked || 0) + (unpicked || 0)}
      color={color}
      maxWidth={Dimensions.get("window").width - 90}
    />
  );
};
const Packet: React.FC<{ data: any }> = (props) => {
  return (
    <KeyboardAwareScrollView style={styles.wrapper} bounces={false}>
      <AppText
        labelType={LabelType.Label}
        size={FontSizes.M}
        style={{ textAlign: "center" }}
        labelColorType={ColorType.Gray}
      >
        {translate("OmsDashboard.packingList")}
      </AppText>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <AppHalfDonught
          radius={81}
          strokeWidth={4}
          current={props.data.PackagedItems}
          maxValue={props.data.TotalPackageList}
          icoType={3}
          txt1={translate("OmsDashboard.packed")}
          txt2={translate("OmsDashboard.notPacked")}
        />
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: AppColor.OMS.Background.Dark,
          marginLeft: 10,
          marginRight: 10,
          opacity: 0.1,
        }}
      />
      <View style={{ paddingHorizontal: 25, paddingVertical: 10 }}>
        <AppText
          labelType={LabelType.Label}
          size={FontSizes.M}
          labelColorType={ColorType.Gray}
          style={{ textAlign: "center", marginTop: 15, marginBottom: 14 }}
        >
          {translate("OmsDashboard.unPackedScatterOfOrder")}
        </AppText>
        {DrawProgressBar(
          props.data.PackagedItemsAGT,
          props.data.UnPackagedItemsAGT,
          AppColor.OMS.Background.Agt,
          translate("OmsDashboard.sameDayHomeDelivery")
        )}
        {DrawProgressBar(
          props.data.PackagedItemsBC,
          props.data.UnPackagedItemsBC,
          AppColor.OMS.Background.ComeGet,
          translate("OmsDashboard.sameDayComeAndGet")
        )}
        {DrawProgressBar(
          props.data.PackagedItemsCC,
          props.data.UnPackagedItemsCC,
          AppColor.OMS.Background.DeliveryHome,
          translate("OmsDashboard.homeDeliveryByCargo")
        )}
      </View>
      <View style={{ height: 80 }} />
    </KeyboardAwareScrollView>
  );
};

const StoreChiefReportDashboard: React.FC<{ data: any }> = (props) => {
  const MAX_WIDTH = Dimensions.get("window").width - 90;

  const StatusCard: React.FC<any> = (subProps) => {
    return (
      <View
        style={{
          paddingHorizontal: 25,
          paddingVertical: 10,
          backgroundColor: "#fff",
          borderRadius: 10,
          marginBottom: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 1.84,
          elevation: 5,
        }}
      >
        <View style={{}}>
          <AppText style={{ fontFamily: "Poppins_500Medium" }}>
            Fatih KÖSE{" "}
          </AppText>
          <AppText style={{ marginBottom: 10 }}>
            Toplam 30 | İşlem yapılmadı : 10
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: MAX_WIDTH / 3,
                height: 10,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: "red",
              }}
            />
            <View
              style={{
                width: (MAX_WIDTH / 3) * 2,
                height: 10,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: "yellow",
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <KeyboardAwareScrollView style={styles.wrapper} bounces={false}>
      <StoreChiefReport />
      <View style={{ height: 80 }} />
    </KeyboardAwareScrollView>
  );
};
const Dashboard: React.FC = (props) => {
  const OmsService = useOmsService();
  const Account = useAccountService();
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <View style={styles.container}>
      <ScrollView
        onScroll={(evt) => {
          let page = Math.round(
            evt.nativeEvent.contentOffset.x / Dimensions.get("window").width
          );
          if (page != currentPage) setCurrentPage(page);
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={Platform.OS === "web"}
        horizontal
        bounces={false}
        pagingEnabled
        scrollEventThrottle={16}
      >
        <>
          {OmsService.loadingContent ||
            OmsService.statePageData === undefined ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: Dimensions.get("window").height - 420,
                width: Math.round(Dimensions.get("window").width),
              }}
            >
              <ActivityIndicator />
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Orders data={OmsService.statePageData} />
              <Pick data={OmsService.statePageData} />
              <Packet data={OmsService.statePageData} />
              {Account.isInRole("omc-oms-store-chief") && (
                <StoreChiefReportDashboard data={undefined} />
              )}
            </View>
          )}
        </>
      </ScrollView>
      <>
        {OmsService.loadingContent ||
          OmsService.statePageData === undefined ? null : (
          <Bullets {...{ currentPage }} />
        )}
      </>
    </View>
  );
};
export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 20,
    width:
      Platform.OS === "web" ? 350 : Math.round(Dimensions.get("window").width),
  },
});

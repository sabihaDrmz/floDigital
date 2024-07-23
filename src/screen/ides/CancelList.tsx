import {
  AppButton,
  AppCard,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { ErOrderItem } from "../../core/models/ErFindFicheItem";
import { translate } from "../../helper/localization/locaizationMain";
import moment from "moment";
import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView } from "react-native";
import Svg, { Circle, Defs, G, Path } from "react-native-svg";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
const enableStatuses = [
  "processing",
  "allocated",
  "warehouse_notified",
  "packaged",
  "hold",
];

const InformationLine: React.FC = (props) => {
  return (
    <View style={{ margin: 20 }}>
      <View
        style={{
          marginVertical: 11,
          height: 1,
          backgroundColor: "rgb(228,228,228)",
        }}
      />
      <View
        style={{
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/crmi.png")}
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <AppText style={{ width: "85%" }}>{translate("cancelList")}</AppText>
      </View>
      <View
        style={{
          marginVertical: 11,
          height: 1,
          backgroundColor: "rgb(228,228,228)",
        }}
      />
    </View>
  );
};

const FicheInfo: React.FC<{
  ficheNumber: string;
  orderNumber: string;
  storeId: string;
}> = (props) => {
  return (
    <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <AppText style={{ width: 70 }}>
            {translate("OmsOrderHistory.orderNo")}
          </AppText>
          <AppText style={{ marginLeft: 10, marginRight: 10 }}>:</AppText>
          <AppText selectable size={FontSizes.S} labelType={LabelType.Label}>
            {props.orderNumber}
          </AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: -7.5,
          }}
        >
          <Image
            source={require("../../assets/storeico.png")}
            style={{ width: 35, height: 35, marginLeft: 10 }}
          />
          <AppText selectable>{props.storeId}</AppText>
        </View>
      </View>
      <View>
        <View style={{ flexDirection: "row" }}>
          <AppText style={{ width: 70 }}>Fiş No</AppText>
          <AppText style={{ marginLeft: 10, marginRight: 10 }}>:</AppText>
          <AppText selectable labelType={LabelType.Label} size={FontSizes.S}>
            {props.ficheNumber}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const CustomerInfo: React.FC<{ name: string; lastName: string; date: Date }> = (
  props
) => {
  return (
    <View style={{ marginTop: 35, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: "row" }}>
        <AppText size={FontSizes.XS} labelType={LabelType.Label}>
          {translate("crmCrmCreateCustomerComplaint.firstName")} :{" "}
        </AppText>
        <AppText selectable>
          {"  "}
          {props.name}
        </AppText>
      </View>
      {/* <View style={{flexDirection: 'row', marginTop: 5}}>
          <AppText size={FontSizes.XS} labelType={LabelType.Label}>
            Müşteri Soyadı :{' '}
          </AppText>
          <AppText>
            {'  '}
            {props.lastName}
          </AppText>
        </View> */}
      <View style={{ flexDirection: "row", marginTop: 5 }}>
        <AppText size={FontSizes.XS} labelType={LabelType.Label}>
          {translate("easyRerturnFindFicheManual.date")} :{" "}
        </AppText>
        <AppText selectable>
          {"  "}
          {moment(props.date).format("DD/MM/yyy hh:mm")}
        </AppText>
      </View>
    </View>
  );
};

const ProductCard: React.FC<ErOrderItem> = (props) => {
  return (
    <AppCard color={AppColor.OMS.Background.OpacityOrange}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 10 }}>
            <Image
              source={{
                uri: "https://floimages.mncdn.com/" + props.productImage,
              }}
              style={{ width: 60, height: 60 }}
              resizeMode={"cover"}
            />
          </View>
          <View>
            <AppText
              selectable
              style={{ fontFamily: "Poppins_300Light_Italic", fontSize: 14 }}
            >
              {props.size} {props.color}
            </AppText>
            <AppText
              selectable
              style={{ fontFamily: "Poppins_300Light", fontSize: 19 }}
            >
              {props.title}
            </AppText>
            <AppText
              selectable
              style={{ fontFamily: "Poppins_500Medium", fontSize: 15 }}
            >
              {props.quantity} {translate("OmsPackageCard.product")}
            </AppText>
          </View>
        </View>
        <View>
          <View style={{ alignItems: "flex-end" }}>
            {props.ecomStatus === "complete" ? (
              <CompleteIco />
            ) : (
              <ProcessingIco />
            )}
          </View>
          <AppText selectable style={{ fontFamily: "Poppins_600SemiBold" }}>
            {props.ecomStatuscode}
          </AppText>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <AppText selectable style={{ fontSize: 16 }}>
          {props.barcode} / {props.sku}
        </AppText>
        <AppText
          labelColorType={ColorType.Brand}
          style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}
        >
          {translate("easyReturnSelectProduct.sellPrice")} :{" "}
          {Number(props.geniusPrice)}
        </AppText>
      </View>
    </AppCard>
  );
};

const CancelList: React.FC = (props) => {
  const { erOrder, isLoading, InitializeCancellationEvent } = useEasyReturnService();
  const fiche = erOrder[0];
  const { show } = useMessageBoxService();
  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={translate("ProductDetail.cancelOrderForStore")}
      />
      <ScrollView>
        <FicheInfo
          {...{
            storeId: fiche.store?.toString(),
            ficheNumber: fiche.ficheNumber,
            orderNumber: fiche.orderNo,
          }}
        />
        <CustomerInfo
          {...{
            name: fiche.nameSurname,
            lastName: "",
            date: fiche.orderDate,
          }}
        />
        <InformationLine />
        {fiche.basketItems.map((y) => (
          <ProductCard {...y} />
        ))}
        <View style={{ alignItems: "flex-end" }}>
          <View style={{ marginRight: 25 }}>
            <AppText>*{translate("ProductDetail.kdvAmount")}</AppText>
            <AppText
              selectable
              labelColorType={ColorType.Brand}
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              {translate("crmOrderDetailScreen.totalAmount")} :{" "}
              {fiche.basketItems
                .reduce((x, y) => x + Number(y.geniusPrice) * y.quantity, 0)
                ?.toFixed(2)}
            </AppText>
          </View>
          <View style={{ height: 40 }}></View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 20 }}>
        <AppButton
          loading={isLoading}
          buttonColorType={ColorType.Brand}
          onPress={() => {
            if (
              fiche.basketItems.filter(
                (x) => !enableStatuses.includes(x.ecomStatus)
              ).length > 0
            ) {
              show(translate("ProductDetail.productStatuNotCancel"));
              return;
            }
            InitializeCancellationEvent({
              voucherNo: "",
              orderNo: fiche?.orderNo,
              ficheNumber: fiche?.ficheNumber,
            });
          }}
          title={translate("ProductDetail.cancelOrder")}
        />
        <SafeAreaView />
      </View>
    </View>
  );
};
export default CancelList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const CompleteIco = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={64} height={66}>
      <Defs></Defs>
      <G
        id="Group_3283"
        data-name="Group 3283"
        transform="translate(-299 -153)"
      >
        <G id="Group_3119" data-name="Group 3119" transform="translate(1 -3)">
          <G
            transform="translate(298 156)"
            style={{
              filter: "url(#Ellipse_198)",
            }}
            id="Group_2949"
            data-name="Group 2949"
          >
            <G
              id="Ellipse_198-2"
              data-name="Ellipse 198"
              transform="translate(9 13)"
              style={{
                stroke: "#fd9d33",
                strokeWidth: ".5px",
                fill: "#fff",
              }}
            >
              <Circle
                cx={20.5}
                cy={20.5}
                r={20.5}
                style={{
                  stroke: "none",
                }}
              />
              <Circle
                cx={20.5}
                cy={20.5}
                r={20.25}
                style={{
                  fill: "none",
                }}
              />
            </G>
          </G>
          <G id="YCj2pX.tif" transform="translate(316.576 179.575)">
            <G id="Group_2708" data-name="Group 2708">
              <Path
                id="Path_1802"
                data-name="Path 1802"
                className="cls-2"
                d="M205.121 218.8c0-.515.006-1.029 0-1.544a.641.641 0 0 1 .44-.653c3.323-1.386 6.653-2.755 9.961-4.175a1.691 1.691 0 0 1 1.634.026c.471.258.987.435 1.482.652.068.03.179.036.184.119.006.1-.116.111-.188.141q-2.082.886-4.167 1.765-3.078 1.3-6.157 2.607a.772.772 0 0 0-.478.8v3.01c.011.2-.085.214-.238.149-.757-.323-1.513-.647-2.272-.964a.293.293 0 0 1-.2-.314c.003-.541-.001-1.081-.001-1.619z"
                transform="translate(-201.301 -210.421)"
              />
              <Path
                id="Path_1803"
                data-name="Path 1803"
                className="cls-2"
                d="M152.471 181.593q-1.278-.544-2.55-1.1a.476.476 0 0 0-.417 0c-.368.164-.741.317-1.11.478-.074.032-.194.034-.187.142.005.079.112.1.18.125.676.294 1.353.586 2.028.88.064.028.158.027.17.152-.478.2-.961.4-1.442.6q-3.443 1.431-6.884 2.866a.551.551 0 0 1-.465-.008c-.717-.306-1.439-.6-2.159-.9-.078-.032-.157-.088-.245-.054a4.642 4.642 0 0 0-.8.344.457.457 0 0 0-.211.441c.009.183.162.205.282.256.813.344 1.624.694 2.445 1.017a.424.424 0 0 1 .312.472c-.01 1.869-.006 3.739-.005 5.608v4.193c0 .327-.006.328-.314.192-.187-.083-7.992-3.773-8.855-4.174.034-2.812.144-8.334.144-9.621 0-.286.011-.293.268-.186.427.178.855.354 1.28.537.147.063.222.04.247-.129a1.3 1.3 0 0 1 .375-.717c.2-.211.2-.21-.08-.328l-.993-.419a.322.322 0 0 1 .206-.147l8.12-3.51a.547.547 0 0 1 .469 0c.337.149.679.288 1.013.443a.519.519 0 0 0 .466-.006c.351-.159.71-.3 1.063-.458.08-.035.216-.036.214-.147 0-.09-.126-.1-.2-.133-.8-.348-1.606-.691-2.406-1.043a.9.9 0 0 0-.768 0c-1.525.662-3.054 1.316-4.581 1.974-1.787.77-3.571 1.548-5.363 2.305a.86.86 0 0 0-.606.921c.028.968.008 1.938.008 2.907 0 1.02.105 7.6.1 8.623l.745.372c.5.2 9.281 4.389 9.779 4.6a.781.781 0 0 0 .625 0l10-4.2a1.182 1.182 0 0 0 .587-.435v-12.3a.86.86 0 0 0-.485-.433z"
                transform="translate(-131.106 -177.181)"
              />
            </G>
          </G>
        </G>
        <G id="Group_3285" data-name="Group 3285">
          <G
            transform="translate(299 153)"
            style={{
              filter: "url(#Path_2416)",
            }}
          >
            <Path
              id="Path_2416-2"
              data-name="Path 2416"
              d="M10 0A10 10 0 1 1 0 10 10 10 0 0 1 10 0z"
              transform="translate(35 6)"
              style={{
                fill: "#fff",
              }}
            />
          </G>
          <G
            id="icon_info"
            data-name="icon/info"
            transform="translate(331.809 156.809)"
          >
            <Path
              id="Combined_Shape"
              data-name="Combined Shape"
              d="M0 10.159a10.159 10.159 0 1 1 10.159 10.159A10.17 10.17 0 0 1 0 10.159zm1.742 0a8.417 8.417 0 1 0 8.417-8.443 8.44 8.44 0 0 0-8.417 8.443zM11 15.476a1.723 1.723 0 0 1-1.715-1.729V8.61h-.818a.871.871 0 0 1 0-1.742h1.267a1.3 1.3 0 0 1 1.293 1.3v5.566h1.24a.871.871 0 1 1 0 1.742zM8.854 4.624A1.076 1.076 0 0 1 9.928 3.55h.011a1.074 1.074 0 1 1-1.085 1.074zm1.073.667z"
              transform="translate(2.032 2.032)"
              style={{
                fill: "#848484",
              }}
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};

const ProcessingIco = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={64} height={66}>
      <Defs></Defs>
      <G
        id="Group_4461"
        data-name="Group 4461"
        transform="translate(-299 -153)"
      >
        <G id="Group_3119" data-name="Group 3119" transform="translate(1 -3)">
          <G
            transform="translate(298 156)"
            style={{
              filter: "url(#Ellipse_198)",
            }}
            id="Group_2949"
            data-name="Group 2949"
          >
            <G
              id="Ellipse_198-2"
              data-name="Ellipse 198"
              transform="translate(9 13)"
              style={{
                stroke: "#fd9d33",
                strokeWidth: ".5px",
                fill: "#fff",
              }}
            >
              <Circle
                cx={20.5}
                cy={20.5}
                r={20.5}
                style={{
                  stroke: "none",
                }}
              />
              <Circle
                cx={20.5}
                cy={20.5}
                r={20.25}
                style={{
                  fill: "none",
                }}
              />
            </G>
          </G>
          <G id="YCj2pX.tif" transform="translate(316.576 179.575)">
            <G id="Group_2708" data-name="Group 2708">
              <Path
                id="Path_1802"
                data-name="Path 1802"
                className="cls-2"
                d="M205.121 218.8c0-.515.006-1.029 0-1.544a.641.641 0 0 1 .44-.653c3.323-1.386 6.653-2.755 9.961-4.175a1.691 1.691 0 0 1 1.634.026c.471.258.987.435 1.482.652.068.03.179.036.184.119.006.1-.116.111-.188.141q-2.082.886-4.167 1.765-3.078 1.3-6.157 2.607a.772.772 0 0 0-.478.8v3.01c.011.2-.085.214-.238.149-.757-.323-1.513-.647-2.272-.964a.293.293 0 0 1-.2-.314c.003-.541-.001-1.081-.001-1.619z"
                transform="translate(-201.301 -210.421)"
              />
              <Path
                id="Path_1803"
                data-name="Path 1803"
                className="cls-2"
                d="M152.471 181.593q-1.278-.544-2.55-1.1a.476.476 0 0 0-.417 0c-.368.164-.741.317-1.11.478-.074.032-.194.034-.187.142.005.079.112.1.18.125.676.294 1.353.586 2.028.88.064.028.158.027.17.152-.478.2-.961.4-1.442.6q-3.443 1.431-6.884 2.866a.551.551 0 0 1-.465-.008c-.717-.306-1.439-.6-2.159-.9-.078-.032-.157-.088-.245-.054a4.642 4.642 0 0 0-.8.344.457.457 0 0 0-.211.441c.009.183.162.205.282.256.813.344 1.624.694 2.445 1.017a.424.424 0 0 1 .312.472c-.01 1.869-.006 3.739-.005 5.608v4.193c0 .327-.006.328-.314.192-.187-.083-7.992-3.773-8.855-4.174.034-2.812.144-8.334.144-9.621 0-.286.011-.293.268-.186.427.178.855.354 1.28.537.147.063.222.04.247-.129a1.3 1.3 0 0 1 .375-.717c.2-.211.2-.21-.08-.328l-.993-.419a.322.322 0 0 1 .206-.147l8.12-3.51a.547.547 0 0 1 .469 0c.337.149.679.288 1.013.443a.519.519 0 0 0 .466-.006c.351-.159.71-.3 1.063-.458.08-.035.216-.036.214-.147 0-.09-.126-.1-.2-.133-.8-.348-1.606-.691-2.406-1.043a.9.9 0 0 0-.768 0c-1.525.662-3.054 1.316-4.581 1.974-1.787.77-3.571 1.548-5.363 2.305a.86.86 0 0 0-.606.921c.028.968.008 1.938.008 2.907 0 1.02.105 7.6.1 8.623l.745.372c.5.2 9.281 4.389 9.779 4.6a.781.781 0 0 0 .625 0l10-4.2a1.182 1.182 0 0 0 .587-.435v-12.3a.86.86 0 0 0-.485-.433zm-1.794 7.5q-1.145 1.518-2.3 3.033c-.3.4-.6.794-.9 1.188-.065.085-.129.214-.261.158-.116-.049-.07-.181-.07-.279v-1.337c0-.337-.029-.352-.333-.225q-1.493.625-2.987 1.248c-.275.114-.276.111-.275-.193s0-.583 0-.874c0-.266.018-.533-.005-.8a.41.41 0 0 1 .318-.47c.977-.393 1.945-.811 2.923-1.2a.483.483 0 0 0 .369-.55c-.029-.461-.012-.925-.006-1.388 0-.342.155-.433.458-.286q1.48.717 2.958 1.438c.325.158.339.229.11.532z"
                transform="translate(-131.106 -177.181)"
              />
            </G>
          </G>
        </G>
        <G id="Group_3285" data-name="Group 3285">
          <G
            transform="translate(299 153)"
            style={{
              filter: "url(#Path_2416)",
            }}
          >
            <Path
              id="Path_2416-2"
              data-name="Path 2416"
              d="M10 0A10 10 0 1 1 0 10 10 10 0 0 1 10 0z"
              transform="translate(35 6)"
              style={{
                fill: "#fff",
              }}
            />
          </G>
          <G
            id="icon_info"
            data-name="icon/info"
            transform="translate(331.809 156.809)"
          >
            <Path
              id="Combined_Shape"
              data-name="Combined Shape"
              d="M0 10.159a10.159 10.159 0 1 1 10.159 10.159A10.17 10.17 0 0 1 0 10.159zm1.742 0a8.417 8.417 0 1 0 8.417-8.443 8.44 8.44 0 0 0-8.417 8.443zM11 15.476a1.723 1.723 0 0 1-1.715-1.729V8.61h-.818a.871.871 0 0 1 0-1.742h1.267a1.3 1.3 0 0 1 1.293 1.3v5.566h1.24a.871.871 0 1 1 0 1.742zM8.854 4.624A1.076 1.076 0 0 1 9.928 3.55h.011a1.074 1.074 0 1 1-1.085 1.074zm1.073.667z"
              transform="translate(2.032 2.032)"
              style={{
                fill: "#848484",
              }}
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};

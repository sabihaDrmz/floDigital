import {
  AppColor,
  LabelType,
  FontSizes,
  AppCard,
  AppText,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ProductDetail from "./ProductDetail";
import { OmsPackageModel } from "../../../core/models/OmsPackageModel";
import { OmsErrorReasonModel } from "../../../core/models/OmsErrorReasonModel";
import FsImage from "../../FSImage";
import { OmsBoxIco } from "../../../Icons/OmsBoxIco";
import { translate } from "../../../helper/localization/locaizationMain";

const PackageCard: React.FC<OmsPackageModel> = (props) => {
  const [isExpand, setExpand] = useState(false);
  const [selectedReason, setSelectedReason] =
    useState<{ orderLineId: number; reson: OmsErrorReasonModel }[]>();

  const color =
    props.Orders[0].ChannelCode === "BC"
      ? AppColor.OMS.Background.ComeGet
      : props.Orders[0].ChannelCode === "PACKUPP"
      ? AppColor.OMS.Background.Agt
      : AppColor.OMS.Background.DeliveryHome;

  return (
    <AppCard color={color}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <TouchableOpacity
            onPress={() => setExpand(!isExpand)}
            style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
          >
            <AntDesign
              name={!isExpand ? "caretright" : "caretdown"}
              size={15}
              color={AppColor.FD.Text.Ash}
            />
            <AppText selectable style={{ marginLeft: 10, fontWeight: "700" }}>
              {props.OrderNo}
            </AppText>
          </TouchableOpacity>
          {!isExpand && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {props.Orders.length > 0 && (
                <FsImage
                  style={{ width: 65, height: 65 }}
                  resizeMode={"cover"}
                  source={{ uri: props.Orders[0].ImageUrl }}
                />
              )}
              {props.Orders.length > 1 && (
                <FsImage
                  style={{ width: 65, height: 65, marginLeft: 10 }}
                  resizeMode={"cover"}
                  source={{ uri: props.Orders[1].ImageUrl }}
                />
              )}
              {props.Orders.length > 2 && (
                <View
                  style={{
                    width: 29,
                    height: 29,
                    borderRadius: 15,
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <AppText
                    selectable
                    labelType={LabelType.Label}
                    size={FontSizes.XS}
                  >
                    +{props.Orders.length - 2}
                  </AppText>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={{ justifyContent: "space-between" }}>
          <View style={{ alignItems: "flex-end" }}>
            {isExpand ? (
              <View>
                <FsImage
                  source={{ uri: props.Orders[0].ImageUrl }}
                  resizeMode={"cover"}
                  style={{ width: 65, height: 65 }}
                />
              </View>
            ) : (
              <>
                {/* <AppText
                    labelType={LabelType.Label}
                    labelColorType={ColorType.Danger}>
                    <OmsTimeAlert />
                    {'  '}0 Dk
                  </AppText> */}
                <View style={{ marginTop: 15, alignItems: "flex-end" }}>
                  <View style={{ flexDirection: "row", marginBottom: 3 }}>
                    <Image
                      style={{ width: 20, height: 20, tintColor: "#707070" }}
                      source={{ uri: OmsBoxIco }}
                    />
                    <AppText selectable>
                      {"  "}
                      {props.Orders.reduce(
                        (a, b) => a + Number(b.Quantity),
                        0
                      )}{" "}
                      {translate("OmsPackageCard.product")}
                    </AppText>
                  </View>
                  {/* <AppText>
                      <OmsClockIcon />
                      {'  '}
                      {durationToString(0)}
                    </AppText> */}
                </View>
              </>
            )}
          </View>
        </View>
      </View>
      {isExpand && (
        <View>
          {props.Orders.map((x) => (
            <ProductDetail
              key={x.ID}
              {...x}
              hiddenDate={true}
              selectedReason={selectedReason}
              SourceCode={""}
              selectReason={(reason: OmsErrorReasonModel) => {
                if (selectedReason && selectedReason.length > 0) {
                  let exsist = selectedReason?.findIndex(
                    (y) => y.orderLineId === x.ID
                  );
                  if (exsist > -1) {
                    let temps = Object.assign(selectedReason) as {
                      orderLineId: number;
                      reson: OmsErrorReasonModel;
                    }[];

                    temps[exsist].reson = reason;
                    setSelectedReason(temps);
                  }
                } else {
                  setSelectedReason([{ orderLineId: x.ID, reson: reason }]);
                }
              }}
            />
          ))}
        </View>
      )}
    </AppCard>
  );
};

export default PackageCard;

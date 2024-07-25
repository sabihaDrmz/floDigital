import {
  AppColor,
  LabelType,
  FontSizes,
  ColorType,
  AppCard,
  AppText,
  AppButton,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {
  OmsOrderDetail,
  OmsOrderModel,
} from "../../../core/models/OmsOrderModel";
import { OmsErrorReasonModel } from "../../../core/models/OmsErrorReasonModel";
import FsImage from "../../FSImage";
import OmsTimeAlert from "../../../Icons/OmsTimeAlertIco";
import { translate } from "../../../helper/localization/locaizationMain";
import { OmsBoxIco } from "../../../Icons/OmsBoxIco";
import { durationToString } from "../../../helper/DurationParseHelper";
import OmsClockIcon from "../../../Icons/OmsClockIco";
import ReaseonRadios from "./ReaseonRadios";
import { useOmsService } from "../../../contexts/OmsService";

const OrderPickCardSub: React.FC<{ orderLines: OmsOrderDetail[] }> = (
  props
) => {
  const ProductLine = (p: any) => {
    const OmsService = useOmsService();
    const [isExpand, setExpand] = useState(false);
    const [reason, setReason] = useState<OmsErrorReasonModel>();
    return (
      <View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setExpand(!isExpand)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={!isExpand ? "caretright" : "caretdown"}
              size={15}
              color={AppColor.FD.Text.Ash}
            />
            <AppText selectable style={{ marginLeft: 10 }}>
              {p.Color}
            </AppText>
          </TouchableOpacity>
          <View>
            <AppText selectable style={{ fontWeight: "600" }}>
              {p.Text}
            </AppText>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "70%",
            }}
          >
            <AppText selectable style={{ width: 110 }}>
              {p.BarcodeNo}
            </AppText>
            <AppText>|{"  "}</AppText>
            <AppText selectable style={{ fontWeight: "400", width: 30 }}>
              {p.BodySize}
            </AppText>
            <AppText>|{"  "}</AppText>
            <AppText selectable style={{ fontWeight: "400" }}>
              {p.Quantity} {translate("OmsNotFoundProducts.quantity")}
            </AppText>
          </View>
        </View>
        {isExpand && (
          <View
            style={{
              width: Dimensions.get("window").width - 140,
              marginVertical: 20,
            }}
          >
            <ReaseonRadios
              reasons={OmsService.errorReasons}
              onSave={setReason}
            />
            {reason && (
              <View style={{ marginTop: 20 }}>
                <AppButton
                  buttonColorType={ColorType.Danger}
                  title={translate("ProductDetail.cancelOrder")}
                  loading={OmsService.cancelLoading}
                  onPress={() => {
                    OmsService.cancelOrder(p.Product, reason.OmsName);
                  }}
                />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };
  return (
    <View>
      {props.orderLines.map((x, index) => {
        return (
          <>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <FsImage
                source={{ uri: x.ImageUrl }}
                resizeMode="cover"
                style={{ width: 70, height: 70 }}
              />
              <ProductLine
                Text={`${x.Brand} | ${x.ModelName}`}
                Color={x.Color}
                BodySize={x.BodySize}
                BarcodeNo={x.BarcodeNo}
                Product={x}
                Quantity={x.Quantity}
              />
            </View>
            <View
              style={{
                height: index < props.orderLines.length - 1 ? 1 : 0,
                marginHorizontal: 5,
              }}
            />
          </>
        );
      })}
    </View>
  );
};

const PickCard: React.FC<OmsOrderModel> = (props) => {
  const [isExpand, setExpand] = useState(false);
  const [selectedReason, setSelectedReason] =
    useState<{ orderLineId: number; reson: OmsErrorReasonModel }[]>();

  const ProductImageCard: React.FC = (prp) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {props.OrderItems.length >= 1 && (
        <FsImage
          style={{ width: 65, height: 65 }}
          resizeMode="cover"
          source={{ uri: props.OrderItems[0].ImageUrl }}
        />
      )}
      {props.OrderItems.length >= 2 && (
        <FsImage
          style={{ width: 65, height: 65, marginLeft: 10 }}
          resizeMode="cover"
          source={{ uri: props.OrderItems[1].ImageUrl }}
        />
      )}
      {props.OrderItems.length > 2 && (
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
          <AppText selectable labelType={LabelType.Label} size={FontSizes.XS}>
            +{props.OrderItems.length - 2}
          </AppText>
        </View>
      )}
    </View>
  );

  const TimeInfo: React.FC = (prp) => (
    <View style={{ justifyContent: "space-between" }}>
      <View style={{ alignItems: "flex-end" }}>
        <AppText
          selectable
          labelType={LabelType.Label}
          labelColorType={ColorType.Danger}
        >
          <OmsTimeAlert />
          {"  "}
          {props.Remainder} {translate("ProductPickCard.min")}
        </AppText>
        <View style={{ marginTop: 15, alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row", marginBottom: 3 }}>
            <Image
              style={{ width: 20, height: 20, tintColor: "#707070" }}
              source={{ uri: OmsBoxIco }}
            />
            <AppText selectable style={{ fontFamily: "Poppins_400Regular" }}>
              {"  "}
              {props.OrderItems.reduce(
                (a, b) => a + Number(b.Quantity),
                0
              )}{" "}
              {translate("ProductPickCard.product")}
            </AppText>
          </View>
          <AppText selectable>
            <OmsClockIcon />
            {"  "}
            {durationToString(props.Duration)}
          </AppText>
        </View>
      </View>
    </View>
  );
  return (
    <AppCard color={AppColor.OMS.Background.ComeGet}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <TouchableOpacity
            onPress={() => setExpand(!isExpand)}
            style={{ flexDirection: "row", alignItems: "flex-start", flex: 1 }}
          >
            <FontAwesomeIcon
              icon={!isExpand ? "caretright" : "caretdown"}
              size={15}
              color={AppColor.FD.Text.Ash}
            />
            <AppText
              selectable
              style={{ marginLeft: 10, fontFamily: "Poppins_400Regular" }}
            >
              {props.OrderNo}
            </AppText>
          </TouchableOpacity>
          {!isExpand && <ProductImageCard />}
        </View>
        <TimeInfo />
      </View>
      {isExpand && <OrderPickCardSub orderLines={props.OrderItems} />}
    </AppCard>
  );
  // return (
  //   <AppCard color={AppColor.OMS.Background.ComeGet}>
  //     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
  //       <View>
  //         <TouchableOpacity
  //           onPress={() => setExpand(!isExpand)}
  //           style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
  //           <AntDesign
  //             name={!isExpand ? 'caretright' : 'caretdown'}
  //             size={15}
  //             color={AppColor.FD.Text.Ash}
  //           />
  //           <AppText style={{marginLeft: 10, fontFamily: 'Poppins_400Regular'}}>
  //             {props.OrderNo}
  //           </AppText>
  //         </TouchableOpacity>
  //         {!isExpand && (
  //           <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //             {props.OrderItems.length >= 1 && (
  //               <Image
  //                 style={{width: 65, height: 65}}
  //                 source={{uri: props.OrderItems[0].ImageUrl}}
  //               />
  //             )}
  //             {props.OrderItems.length >= 2 && (
  //               <Image
  //                 style={{width: 65, height: 65, marginLeft: 10}}
  //                 source={{uri: props.OrderItems[1].ImageUrl}}
  //               />
  //             )}
  //             {props.OrderItems.length > 2 && (
  //               <View
  //                 style={{
  //                   width: 29,
  //                   height: 29,
  //                   borderRadius: 15,
  //                   backgroundColor: '#fff',
  //                   shadowColor: '#000',
  //                   shadowOffset: {
  //                     width: 0,
  //                     height: 2,
  //                   },
  //                   shadowOpacity: 0.25,
  //                   shadowRadius: 3.84,

  //                   elevation: 5,
  //                   justifyContent: 'center',
  //                   alignItems: 'center',
  //                   marginLeft: 10,
  //                 }}>
  //                 <AppText labelType={LabelType.Label} size={FontSizes.XS}>
  //                   +{props.OrderItems.length - 2}
  //                 </AppText>
  //               </View>
  //             )}
  //           </View>
  //         )}
  //       </View>
  //       <View style={{justifyContent: 'space-between'}}>
  //         <View style={{alignItems: 'flex-end'}}>
  //           {isExpand ? (
  //             <View>
  //               <Image
  //                 source={{uri: props.OrderItems[0].ImageUrl}}
  //                 style={{width: 65, height: 65}}
  //               />
  //             </View>
  //           ) : (
  //             <>
  //               <AppText
  //                 labelType={LabelType.Label}
  //                 labelColorType={ColorType.Danger}>
  //                 <OmsTimeAlert />
  //                 {'  '}
  //                 {props.Remainder} dk
  //               </AppText>
  //               <View style={{marginTop: 15, alignItems: 'flex-end'}}>
  //                 <View style={{flexDirection: 'row', marginBottom: 3}}>
  //                   <Image
  //                     style={{width: 20, height: 20, tintColor: '#707070'}}
  //                     source={{uri: OmsBoxIco}}
  //                   />
  //                   <AppText style={{fontFamily: 'Poppins_400Regular'}}>
  //                     {'  '}
  //                     {props.ProductCount} Ürün
  //                   </AppText>
  //                 </View>
  //                 <AppText>
  //                   <OmsClockIcon />
  //                   {'  '}
  //                   {durationToString(props.Duration)}
  //                 </AppText>
  //               </View>
  //             </>
  //           )}
  //         </View>
  //       </View>
  //     </View>
  //     {isExpand && (
  //       <View>
  //         {props.OrderItems.map((x) => {
  //           return (
  //             <ProductDetail
  //               {...x}
  //               selectedReason={selectedReason}
  //               SourceCode={props.SourceCode}
  //               selectReason={(reason: OmsErrorReasonModel) => {
  //                 if (selectedReason && selectedReason.length > 0) {
  //                   let exsist = selectedReason?.findIndex(
  //                     (y) => y.orderLineId === x.ID,
  //                   );
  //                   if (exsist > -1) {
  //                     let temps = Object.assign(selectedReason) as {
  //                       orderLineId: number;
  //                       reson: OmsErrorReasonModel;
  //                     }[];

  //                     temps[exsist].reson = reason;
  //                     setSelectedReason(temps);
  //                   }
  //                 } else {
  //                   setSelectedReason([{orderLineId: x.ID, reson: reason}]);
  //                 }
  //               }}
  //             />
  //           );
  //         })}
  //       </View>
  //     )}
  //   </AppCard>
  // );
};

export default PickCard;

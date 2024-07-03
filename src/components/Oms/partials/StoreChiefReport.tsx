import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useOmsService } from "../../../contexts/OmsService";
import { translate } from "../../../helper/localization/locaizationMain";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";
import { MessageBoxType } from "../../../contexts/model/MessageBoxOptions";

interface StoreChiefReportProps {
  data?: any | undefined;
}

const StoreChiefReport: React.FC<StoreChiefReportProps> = (props) => {
  const OmsService = useOmsService();
  const MessageBox = useMessageBoxService();

  const ReportItem: React.FC<{
    title: string;
    quantity: number;
    onOpenShuffle?: () => void;
  }> = (props) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          paddingVertical: 10,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        <View>
          <AppText
            selectable
            style={{
              fontFamily: "Poppins_500Medium",
            }}
          >
            {props.title}
          </AppText>
          <AppText
            selectable
            style={{ fontFamily: "Poppins_400Regular", fontSize: 11 }}
          >
            {props.quantity}{" "}
            {translate("OmsStoreChiefReport.thereIsPendingOrder")}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={props.onOpenShuffle}
          style={{
            backgroundColor: AppColor.FD.Brand.Solid,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
        >
          <AppText
            style={{
              color: AppColor.FD.Text.Pure,
              fontFamily: "Poppins_500Medium",
            }}
          >
            {translate("OmsStoreChiefReport.throwThePool")}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <React.Fragment>
        {OmsService.chiefReport === null ||
          OmsService.chiefReport === undefined ||
          (OmsService.chiefReport.length === 0 && (
            <AppText
              style={{
                fontSize: 20,
                textAlign: "center",
                fontFamily: "Poppins_500Medium",
              }}
            >
              {translate("OmsStoreChiefReport.noItemsList")}
            </AppText>
          ))}
        {OmsService.chiefReport.map((x) => {
          return (
            <ReportItem
              key={x.ActionByID.toString()}
              onOpenShuffle={() => {
                //TODO: Kullanıcının paketleme listesindeki ürünlerini havuza at
                MessageBox.show(
                  `${x.ActionByName.trimEnd()} ${translate(
                    "OmsStoreChiefReport.mboxAreUSure"
                  )}`,
                  {
                    type: MessageBoxType.YesNo,
                    yesButtonTitle: translate("OmsStoreChiefReport.ok"),
                    noButtonTitle: translate("OmsStoreChiefReport.cancel"),
                    yesButtonEvent: () =>
                      OmsService.userOrdersToPool(x.ActionByID),
                    noButtonEvent: () => { },
                  }
                );
              }}
              title={x.ActionByName.trimEnd()}
              quantity={x.TotalOrder}
            />
          );
        })}
      </React.Fragment>
    </View>
  );
};

export default StoreChiefReport;

const styles = StyleSheet.create({
  container: {},
});

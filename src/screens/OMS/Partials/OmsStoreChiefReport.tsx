import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Portal } from "react-native-portalize";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { MessageBoxType } from "../../../core/services/MessageBox";
import MessageBoxNew from "../../../core/services/MessageBoxNew";
import OmsService from "../../../core/services/OmsService";
import { translate } from "../../../helper/localization/locaizationMain";

interface OmsStoreChiefReportProps {
  data?: any | undefined;
}

const COLOR_PACKAGED = "#125B50";
const COLOR_COLLECT = "#F8B400";
const COLOR_NOT_COLLECT = "#FF6363";
const COLOR_BLANK = "#FAF5E4";
const TOTAL_WIDTH = Dimensions.get("window").width - 40;

const OmsStoreChiefReport: React.FC<OmsStoreChiefReportProps> = (props) => {
  const [onShowPopup, setOnShowPopup] = useState(false);
  return (
    <View style={styles.container}>
      <Observer>
        {() => {
          return (
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
                      MessageBoxNew.show(
                        `${x.ActionByName.trimEnd()} ${translate(
                          "OmsStoreChiefReport.mboxAreUSure"
                        )}`,
                        {
                          type: MessageBoxType.YesNo,
                          yesButtonTitle: translate("OmsStoreChiefReport.ok"),
                          noButtonTitle: translate(
                            "OmsStoreChiefReport.cancel"
                          ),
                          yesButtonEvent: () =>
                            OmsService.userOrdersToPool(x.ActionByID),
                          noButtonEvent: () => {},
                        }
                      );
                    }}
                    title={x.ActionByName.trimEnd()}
                    quantity={x.TotalOrder}
                  />
                );
              })}
            </React.Fragment>
          );
        }}
      </Observer>
    </View>
  );
};

export default OmsStoreChiefReport;

const styles = StyleSheet.create({
  container: {},
});

const Circle: React.FC<{ color: string; title: string }> = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        marginHorizontal: 3,
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: props.color,
          marginRight: 4,
        }}
      />
      <AppText selectable style={{ fontFamily: "Poppins_400Regular" }}>
        {props.title}
      </AppText>
    </View>
  );
};

const Accordion: React.FC<{ title: string; hasOpen?: boolean }> = (props) => {
  const shHeight = useSharedValue(45);
  const [hasOpen, setOpen] = useState(false);
  const onOpen = () => {
    "worklet";
    if (shHeight.value === 45) {
      shHeight.value = withTiming(160, {
        duration: 200,
        easing: Easing.circle,
      });
      setOpen(true);
    } else {
      shHeight.value = withTiming(45, { duration: 200 });
      setOpen(false);
    }
  };

  const AnimatedAccordionStyle = useAnimatedStyle(() => {
    return {
      height: shHeight.value,
    };
  });

  return (
    <View
      style={{
        shadowColor: "#0f0f0f",
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,

        elevation: 2,
      }}
    >
      <Animated.View
        style={[
          {
            overflow: "hidden",
            backgroundColor: "#fff",
            borderRadius: 8,
            marginBottom: 10,
          },
          AnimatedAccordionStyle,
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            onOpen();
          }}
          style={{
            height: 40,
            backgroundColor: "#fff",
            alignItems: "center",
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <AppText selectable style={{ fontFamily: "Poppins_500Medium" }}>
            {props.title}
          </AppText>
          <AntDesign size={20} name={hasOpen ? "upcircleo" : "downcircleo"} />
        </TouchableWithoutFeedback>
        {props.children}
      </Animated.View>
    </View>
  );
};

const AccordionSubItem: React.FC<{
  notProcessed: number;
  processed: number;
  completed: number;
}> = (props) => {
  const TOTAL = props.notProcessed + props.processed + props.completed;
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: COLOR_NOT_COLLECT,
            height: 5,
            width: (TOTAL_WIDTH / TOTAL) * props.notProcessed,
          }}
        />
        <View
          style={{
            backgroundColor: COLOR_COLLECT,
            height: 5,
            width: (TOTAL_WIDTH / TOTAL) * props.processed,
          }}
        />
        <View
          style={{
            backgroundColor: COLOR_PACKAGED,
            height: 5,
            width: (TOTAL_WIDTH / TOTAL) * props.completed,
          }}
        />
      </View>
      <View style={{ padding: 10 }}>
        <View>
          <AppText selectable style={{ fontFamily: "Poppins_400Regular" }}>
            <AppText style={{ fontFamily: "Poppins_500Medium" }}>
              {translate("OmsStoreChiefReport.collectList")} :
            </AppText>{" "}
            {props.notProcessed}
          </AppText>
          <AppText selectable style={{ fontFamily: "Poppins_400Regular" }}>
            <AppText style={{ fontFamily: "Poppins_500Medium" }}>
              {translate("OmsStoreChiefReport.packedList")} :
            </AppText>{" "}
            {props.processed}
          </AppText>
          <AppText selectable style={{ fontFamily: "Poppins_400Regular" }}>
            <AppText style={{ fontFamily: "Poppins_500Medium" }}>
              {translate("OmsStoreChiefReport.processCompleted")} :
            </AppText>{" "}
            {props.completed}
          </AppText>
          <AppText selectable style={{ fontFamily: "Poppins_400Regular" }}>
            <AppText style={{ fontFamily: "Poppins_500Medium" }}>
              {translate("OmsStoreChiefReport.total")} :
            </AppText>{" "}
            {TOTAL}
          </AppText>
        </View>
      </View>
    </View>
  );
};

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
      <TouchableWithoutFeedback
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
      </TouchableWithoutFeedback>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const ShufflePopup: React.FC<{
  cancel?: () => void;
  submit?: (selectedUserId: string) => void;
}> = (props) => {
  const [selectedUser, setSelectedUse] = useState("0");
  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: "rgba(0,0,0,.3)",
        width,
        height,
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: width - 40,
            backgroundColor: "#fff",
            borderRadius: 10,
            height: 300,
            padding: 10,
          }}
        >
          <View style={{ flex: 1, overflow: "hidden", padding: 10 }}>
            <ScrollView>
              <RadioItem
                title={"Fatih Köse"}
                selected={selectedUser === "0"}
                onSelect={() => setSelectedUse("0")}
              />
              <RadioItem
                title={"Murat Gözcü"}
                selected={selectedUser === "1"}
                onSelect={() => setSelectedUse("1")}
              />
              <RadioItem
                title={"Yasin Kızılbakır"}
                selected={selectedUser === "2"}
                onSelect={() => setSelectedUse("2")}
              />
            </ScrollView>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppButton
              title={translate("OmsStoreChiefReport.cancel")}
              buttonColorType={ColorType.Danger}
              style={{ width: width / 2 - 50 }}
              onPress={props.cancel}
            />
            <AppButton
              title="Atama"
              buttonColorType={ColorType.Success}
              style={{ width: width / 2 - 20 }}
              onPress={() => props.submit && props.submit("")}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const RadioItem: React.FC<any> = (props) => {
  return (
    <TouchableWithoutFeedback
      onPress={props.onSelect}
      style={{ marginVertical: 5 }}
      hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
    >
      <AppText
        selectable
        style={{
          fontFamily: "Poppins_400Regular",
          color: props.selected
            ? AppColor.FD.Functional.Success
            : AppColor.FD.Text.Default,
        }}
      >
        <FontAwesome
          name={props.selected ? "dot-circle-o" : "circle-o"}
          size={15}
        />{" "}
        {props.title}
      </AppText>
    </TouchableWithoutFeedback>
  );
};

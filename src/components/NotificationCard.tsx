import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import moment from "moment";
import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
//TODO: EXPO notification
// import { notificationEvent } from "../core/libraries/FcmFroground";
import { Notify } from "../contexts/model/Notify";
import { useAccountService } from "../contexts/AccountService";
import { useFcmService } from "../contexts/FcmService";
import { useNavigation, useRoute } from '@react-navigation/native';

interface NtfCardProps extends Notify {
  onTabChanged?: (tab: number) => void;
}

const NotificationCard: React.FC<NtfCardProps> = (props) => {
  const router = useNavigation();
  const account = useAccountService();
  const fcm = useFcmService();
  const getNotifyColour = () => {
    if (props.appId === "OMS" && props.dataJson) {
      try {
        var parsed = JSON.parse(props.dataJson);

        if (parsed) {
          if (parsed.channelCode === "PACKUPP")
            return AppColor.OMS.Background.Agt;
          else if (parsed.channelCode === "BC")
            return AppColor.OMS.Background.ComeGet;
          else return AppColor.OMS.Background.DeliveryHome;
        }
      } catch (err) { }
    }
    return AppColor.FD.Brand.Solid;
  };
  return (
    <TouchableOpacity
      style={{
        maxHeight: 150,
        padding: 10,
      }}
      /* onPress={() =>
     notificationEvent(
         {
           actionType: props.actionType,
           appId: props.appId,
           dataJson: props.dataJson,
           notificationId: props.id,
         },
         router,
         account,
         fcm,
         props.onTabChanged
       )

      }

       */
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ alignItems: "center" }}>
          {!props.isRead ? (
            <Entypo name="new" size={25} color={AppColor.FD.Brand.Solid} />
          ) : (
            <View style={{ width: 25 }} />
          )}
          <View
            style={{
              flex: 1,
              width: 6,
              backgroundColor: getNotifyColour(),
              marginTop: 10,
            }}
          />
        </View>
        <View style={{ marginLeft: 14 }}>
          <AppText
            style={[
              {
                fontFamily: props.isRead
                  ? "Poppins_500Medium"
                  : "Poppins_700Bold",
                marginBottom: 15,
                paddingTop: 5,
              },
              !props.isRead && { color: AppColor.FD.Text.Dark },
            ]}
          >
            {props.title}
          </AppText>
          <AppText
            selectable
            style={[
              {
                fontFamily: props.isRead
                  ? "Poppins_400Regular"
                  : "Poppins_600SemiBold",
                width: Dimensions.get("window").width - 100,
              },
              !props.isRead && { color: AppColor.FD.Text.Dark },
            ]}
          >
            {props.body}
            <AppText
              selectable
              style={{ fontSize: 10, fontFamily: "Poppins_400Regular_Italic" }}
            >
              {"  "} {moment(props.createDate).format("DD.MM.YYYY HH:mm")}
            </AppText>
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;

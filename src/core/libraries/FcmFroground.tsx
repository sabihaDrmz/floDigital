import { InteractionManager, Platform } from "react-native";
import * as exNotification from "expo-notifications";

export async function ForegoundMessageParse(
  remoteMessage: exNotification.Notification,
  fcm: any,
  account: any
) {
  if (Platform.OS === "web") return;
  const data = remoteMessage.request.content.data;
  if (Platform.OS === "android") {
    var appId = data?.appId as string;

    if (appId) {
      await exNotification.setNotificationChannelAsync(appId, {
        importance: exNotification.AndroidImportance.HIGH,
        enableVibrate: true,
        name: appId,
        showBadge: true,
        bypassDnd: true,
        lockscreenVisibility:
          exNotification.AndroidNotificationVisibility.PUBLIC,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  }

  if (fcm.showingIds === undefined) fcm.emptyShowingList();

  if (
    remoteMessage.request.identifier !== undefined &&
    fcm.showingIds.includes(remoteMessage.request.identifier)
  ) {
    return;
  } else if (remoteMessage.request.identifier !== undefined) {
    fcm.updateShowingList(remoteMessage.request.identifier);
  }
  if (data?.actionType && Number(data?.actionType) === 2) {
    account.logout();
    return;
  } else {
    await fcm.readBadgeCount();
  }
}

export async function notificationEvent(
  data: any,
  navigation: any,
  account: any,
  fcm: any,
  onHomeCallBack?: (currentTab: number) => void
) {
  try {
    if (data.actionType && Number(data.actionType) === 2) {
      account.logout();
    } else if (data.actionType && Number(data.actionType) === 1) {
      if (data.appId === "OMS") {
        InteractionManager.runAfterInteractions(() => {
          navigation.navigate('Oms', { screen: 'OmsMain', params: { tab: parseInt(JSON.parse(data.dataJson)?.currentTab ?? 0) } });
        });
      }
      if (data.appId === "OMC") {
        navigation.navigate('Home');
        if (onHomeCallBack)
          onHomeCallBack(JSON.parse(data.dataJson).currentTab);
      }
      if (data.appId === "OMC_WR") {
        navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseReqList' })
      }
      if (data.appId === "CRM") {
        navigation.navigate('Crm');
      }

      if (data.appId === "ECOM_SC") {
        navigation.navigate('SelfCheckout');
      }
    }
    await fcm.readSingle(data.notificationId);
  } catch (err) { }
}

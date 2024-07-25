import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useFcmService } from "../../contexts/FcmService";
import { useAccountService } from "../../contexts/AccountService";
import RoleGroup from "../../components/RoleGroup";
import AnnouncementsScreen from "../../components/Notification/AnnouncementsScreen";
import NotificationCard from "../../components/NotificationCard";
import { AppText } from "@flomagazacilik/flo-digital-components";
import { translate } from "../../helper/localization/locaizationMain";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloLoading from "../../components/FloLoading";
import { useAnnouncementService } from "../../contexts/AnnouncementService";
import { useRoute } from "@react-navigation/native";

const BadgeCnt: React.FC<{ badgeCnt: number; selected?: boolean }> = (
  props
) => {
  if (props.badgeCnt === 0) return null;
  return (
    <View
      style={{
        position: "absolute",
        maxWidth: 28,
        minWidth: 18,
        height: 15,
        top: props.selected ? 5 : -5,
        right: props.selected ? 55 : 35,
        borderRadius: 7.5,
        backgroundColor: "red",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: "white",
          fontSize: 10,
          paddingHorizontal: 3,
        }}
      >
        {props.badgeCnt > 99 ? "99+" : props.badgeCnt}
      </Text>
    </View>
  );
};
const NotificationMain: React.FC<any> = (props) => {
  const { getNotifications, subBadgeCount, notifications } = useFcmService();
  const { isInRole } = useAccountService();
  const { downloadingFile } = useAnnouncementService();
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoading, setHasloading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params) {
      //@ts-ignore
      const { tab } = route.params;
      if (tab && tab - 1 !== selectedTab)
        setSelectedTab(tab - 1);
    }
  }, [route.params]);

  useEffect(() => {
    refresh();
  }, [selectedTab]);

  const getAppType = () => {
    switch (selectedTab) {
      case 1:
        return "OMS";
      case 2:
        return "OMC_WR";
      case 3:
        return "CRM";
      case 4:
        return "ECOM_SC";
      default:
        return "";
    }
  };

  const refresh = () => {
    setHasloading(true);

    getNotifications(1, getAppType()).then(() => {
      setCurrentPage(1);
      setHasloading(false);
    });
  };

  const pageLoad = () => {
    let page = currentPage + 1;
    setCurrentPage(page);
    getNotifications(page, getAppType());
  };

  const selectedTabChanged = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };
  return (
    <>
      <FloHeaderNew
        headerType={"search"}
        enableButtons={["profile", "back"]}
        showLogo={false}
        ignoreKeys={[]}
        onChangeTab={selectedTabChanged}
        tabs={[
          {
            defaultItem: (
              <View
                style={{
                  width: 120,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <BellNew fill={"#fff"} /> */}
                <Image
                  source={require("../../assets/ntf2.png")}
                  style={{
                    height: 20,
                    width: 30,
                    tintColor: "#fff",
                    resizeMode: "contain",
                  }}
                />
                <BadgeCnt
                  badgeCnt={
                    subBadgeCount?.find((x) => x.appId === "OMC")
                      ?.badgeCount || 0
                  }
                />
              </View>
            ),
            selectedItem: (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 10,
                }}
              >
                <Image
                  source={require("../../assets/ntf2.png")}
                  style={{
                    tintColor: "#707070",
                    width: 30,
                    height: 20,
                    resizeMode: "contain",
                  }}
                />
                <BadgeCnt
                  selected
                  badgeCnt={
                    subBadgeCount?.find((x) => x.appId === "OMC")
                      ?.badgeCount || 0
                  }
                />
              </View>
            ),
            onPress: () => { },
          },
          {
            defaultItem: (
              <View
                style={{
                  width: 120,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <BellNew fill={"#fff"} /> */}
                <Image
                  source={require("../../assets/ntf3.png")}
                  style={{ width: 30, height: 30, tintColor: "#fff" }}
                />
                <BadgeCnt
                  badgeCnt={
                    subBadgeCount?.find((x) => x.appId === "OMS")
                      ?.badgeCount || 0
                  }
                />
              </View>
            ),
            selectedItem: (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 10,
                }}
              >
                <Image
                  source={require("../../assets/ntf3.png")}
                  style={{ width: 30, height: 30, tintColor: "#707070" }}
                />
                <BadgeCnt
                  selected
                  badgeCnt={
                    subBadgeCount?.find((x) => x.appId === "OMS")
                      ?.badgeCount || 0
                  }
                />
              </View>
            ),
            onPress: () => { },
          },
          {
            defaultItem: isInRole("omc-warehouse-request") && (
              <View
                style={{
                  width: 120,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon="warehouse" size={24} color={"#fff"} />
                <View style={{ position: "absolute", top: -10, right: -20 }}>
                  <BadgeCnt
                    selected
                    badgeCnt={
                      subBadgeCount?.find(
                        (x) => x.appId === "OMC_WR"
                      )?.badgeCount || 0
                    }
                  />
                </View>
              </View>
            ),
            selectedItem: (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 10,
                  opacity: 0.8,
                }}
              >
                <FontAwesomeIcon name="warehouse" size={24} color={"#707070"} />
                <BadgeCnt
                  selected
                  badgeCnt={
                    subBadgeCount?.find((x) => x.appId === "OMC_WR")
                      ?.badgeCount || 0
                  }
                />
              </View>
            ),
          },
          {
            defaultItem: (
              <View
                style={{
                  width: 120,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <BellNew fill={"#fff"} /> */}
                <Image
                  source={require("../../assets/ntf1.png")}
                  style={{
                    resizeMode: "contain",
                    height: 30,
                    width: 30,
                    tintColor: "#fff",
                  }}
                />
                <BadgeCnt
                  badgeCnt={
                    subBadgeCount?.find((x) => x.appId === "CRM")
                      ?.badgeCount || 0
                  }
                />
              </View>
            ),
            selectedItem: (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 10,
                }}
              >
                <Image
                  source={require("../../assets/ntf1.png")}
                  style={{
                    resizeMode: "contain",
                    width: 30,
                    height: 30,
                    tintColor: "#707070",
                  }}
                />
                <BadgeCnt
                  selected
                  badgeCnt={
                    subBadgeCount?.find((x) => x.appId === "CRM")
                      ?.badgeCount || 0
                  }
                />
              </View>
            ),
            onPress: () => { },
          },
          {
            defaultItem: isInRole("omc-self-check-out") && (
              <View
                style={{
                  width: 120,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <BellNew fill={"#fff"} /> */}
                <Image
                  source={require("../../assets/selfCheckIcon2.png")}
                  style={{
                    resizeMode: "contain",
                    height: 30,
                    width: 30,
                    tintColor: "#fff",
                  }}
                />
                <BadgeCnt
                  badgeCnt={
                    subBadgeCount?.find(
                      (x) => x.appId === "ECOM_SC"
                    )?.badgeCount || 0
                  }
                />
              </View>
            ),
            selectedItem: (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 10,
                }}
              >
                <Image
                  source={require("../../assets/selfCheckIcon2.png")}
                  style={{
                    resizeMode: "contain",
                    width: 30,
                    height: 30,
                    tintColor: "#707070",
                  }}
                />
                <BadgeCnt
                  selected
                  badgeCnt={
                    subBadgeCount?.find(
                      (x) => x.appId === "ECOM_SC"
                    )?.badgeCount || 0
                  }
                />
              </View>
            ),
            onPress: () => {
              console.log(333);
            },
          },
        ]}
        headerTitle={" "}
        currentTab={selectedTab}
      />

      <RoleGroup roleName={"omc-home"}>
        {selectedTab === 0 ? (
          <AnnouncementsScreen currentTab={0} />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            data={notifications}
            keyExtractor={(item) => `ntf_crd_${item.id}`}
            onEndReached={() => pageLoad()}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refresh} />
            }
            renderItem={({ item }) => (
              <NotificationCard
                onTabChanged={props.onTabChanged}
                key={`ntf_crd_${item.id}`}
                {...item}
                isRead={props.appType === "" ? false : true}
              />
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AppText style={{ fontSize: 15 }}>
                  {translate("announceMiddlewareAlerts.noNotification")}
                </AppText>
              </View>
            )}
          />
        )}
      </RoleGroup>
      {downloadingFile || hasLoading && (
        <View
          style={{
            position: "absolute",
            ...Dimensions.get("window"),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.4)",
          }}
        >
          <FloLoading />
        </View>
      )}
    </>
  );
};
export default NotificationMain;

const styles = StyleSheet.create({
  container: {},
});

const BellNew = (props: any) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 25.184 27.807"
      {...props}
    >
      <Path
        data-name="Shape 19"
        d="M1201.078 199.09h2.376a2.14 2.14 0 1 0 4.276 0h2.376a4.518 4.518 0 1 1-9.028 0zm17.106-3.477v.5a2.185 2.185 0 0 1-2.139 2.234h-20.906a2.187 2.187 0 0 1-2.139-2.234v-.5a3.69 3.69 0 0 1 2.851-3.648v-5.786a9.75 9.75 0 1 1 19.482 0v5.786a3.686 3.686 0 0 1 2.85 3.648zm-2.376 0a1.215 1.215 0 0 0-1.193-1.24 1.7 1.7 0 0 1-1.658-1.734v-6.459a7.372 7.372 0 1 0-14.73 0v6.459a1.7 1.7 0 0 1-1.659 1.734 1.217 1.217 0 0 0-1.192 1.24v.249h20.432z"
        transform="translate(-1193 -176)"
        fill={props.fill || "#fff"}
      />
    </Svg>
  );
};

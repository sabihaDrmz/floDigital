import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import RoleGroup, { isInRole } from "../../components/RoleGroup";
import AnnouncementsScreen from "./AnnouncementsScreen";
import Svg, { Path } from "react-native-svg";
import NotificationScreen from "./NotificationScreen";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import FcmService from "../../core/services/FcmService";
import { Observer } from "mobx-react";
import { FontAwesome5 } from "@expo/vector-icons";

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
const HomeScreen: React.FC<any> = (props) => {
  const { currentTab } = props;
  const [selectedTab, setSelectedTab] = useState(
    currentTab !== undefined ? currentTab - 1 : 0
  );

  return (
    <Observer>
      {() => (
        <>
          <FloHeaderNew
            headerType={"search"}
            enableButtons={["profile", "back"]}
            showLogo={false}
            ignoreKeys={[]}
            onChangeTab={setSelectedTab}
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
                      source={require("../../../assets/ntf2.png")}
                      style={{
                        height: 20,
                        width: 30,
                        tintColor: "#fff",
                        resizeMode: "contain",
                      }}
                    />
                    <BadgeCnt
                      badgeCnt={
                        FcmService?.subBadgeCount?.find(
                          (x) => x.appId === "OMC"
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
                      source={require("../../../assets/ntf2.png")}
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
                        FcmService?.subBadgeCount?.find(
                          (x) => x.appId === "OMC"
                        )?.badgeCount || 0
                      }
                    />
                  </View>
                ),
                onPress: () => {},
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
                      source={require("../../../assets/ntf3.png")}
                      style={{ width: 30, height: 30, tintColor: "#fff" }}
                    />
                    <BadgeCnt
                      badgeCnt={
                        FcmService?.subBadgeCount?.find(
                          (x) => x.appId === "OMS"
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
                      source={require("../../../assets/ntf3.png")}
                      style={{ width: 30, height: 30, tintColor: "#707070" }}
                    />
                    <BadgeCnt
                      selected
                      badgeCnt={
                        FcmService?.subBadgeCount?.find(
                          (x) => x.appId === "OMS"
                        )?.badgeCount || 0
                      }
                    />
                  </View>
                ),
                onPress: () => {},
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
                    <FontAwesome5 name="warehouse" size={24} color={"#fff"} />
                    <View
                      style={{ position: "absolute", top: -10, right: -20 }}
                    >
                      <BadgeCnt
                        selected
                        badgeCnt={
                          FcmService?.subBadgeCount?.find(
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
                    <FontAwesome5
                      name="warehouse"
                      size={24}
                      color={"#707070"}
                    />
                    <BadgeCnt
                      selected
                      badgeCnt={
                        FcmService?.subBadgeCount?.find(
                          (x) => x.appId === "OMC_WR"
                        )?.badgeCount || 0
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
                      source={require("../../../assets/ntf1.png")}
                      style={{
                        resizeMode: "contain",
                        height: 30,
                        width: 30,
                        tintColor: "#fff",
                      }}
                    />
                    <BadgeCnt
                      badgeCnt={
                        FcmService?.subBadgeCount?.find(
                          (x) => x.appId === "CRM"
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
                      source={require("../../../assets/ntf1.png")}
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
                        FcmService?.subBadgeCount?.find(
                          (x) => x.appId === "CRM"
                        )?.badgeCount || 0
                      }
                    />
                  </View>
                ),
                onPress: () => {},
              },
            ]}
            headerTitle={" "}
            currentTab={selectedTab}
          />
          <RoleGroup roleName={"omc-home"}>
            {selectedTab === 1 && (
              <NotificationScreen
                onTabChanged={(tab: number) => {
                  setSelectedTab(tab);
                }}
                appType={"OMS"}
              />
            )}
            {selectedTab === 0 && <AnnouncementsScreen currentTab={0} />}
            {selectedTab === 2 && isInRole("omc-warehouse-request") && (
              <NotificationScreen
                onTabChanged={(tab: number) => {
                  setSelectedTab(tab);
                }}
                appType={"OMC_WR"}
              />
            )}
            {selectedTab === 3 && (
              <NotificationScreen
                onTabChanged={(tab: number) => {
                  setSelectedTab(tab);
                }}
                appType={"CRM"}
              />
            )}
          </RoleGroup>
        </>
      )}
    </Observer>
  );
};
export default HomeScreen;

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

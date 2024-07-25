import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import {
  PerfectPixelSize,
} from "../../helper/PerfectPixel";
import { useAccountService } from "../../contexts/AccountService";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import OmsWarehouseIdentification from '../../Icons/OmsWarehouseIdentification'
import OmsWarehouseUnitIdentification from "../../Icons/OmsWarehouseUnitIdentification";
import OmsProductPlacementWarehouse from "../../Icons/OmsProductPlacementWarehouse";
import OmsWarehouseRayonIdentification from "../../Icons/OmsWarehouseRayonIdentification";
import OmsWarehouseUserAssignment from "../../Icons/OmsWarehouseUserAssignment";
import OmsWarehouseReqProduct from "../../Icons/OmsWarehouseReqProduct";
import OmsWarehouseDeleteProductIcon from '../../Icons/OmsWarehouseDeleteProductIcon';
import OmsWarehouseRapor from '../../Icons/OmsWarehouseRapor';
import OmsWarehouseInventoryIcon from "../../Icons/OmsWarehouseInventoryIcon";
import OmsWarehouseProductReport from "../../Icons/OmsWarehouseProductReport";
import { useNavigation } from "@react-navigation/native";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { translate } from "../../helper/localization/locaizationMain";

const { width, height } = Dimensions.get("window");
const PADDING_TOTAL = Platform.OS === "android" ? 50 : 50;
const BOX_WIDTH = PerfectPixelSize((width - 2) / 2) - PADDING_TOTAL;
const BOX_HEIGHT = Platform.OS === "ios" ? 130 : 100;
const BOX_PB = Platform.OS === "ios" ? 12 : 2;

const StoreWarehouseNavigationList = ({ }: any) => {
  const { isInRole, userExtensionInfo } = useAccountService();
  const navigation = useNavigation();
  const MessageBox = useMessageBoxService();

  const menuList = [
    {
      name: `${translate("storeWarehouse.warehouseIdentification")}`,
      icon: <OmsWarehouseIdentification />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseIdentification' }),
      role: "omc-store-chief",
    },
    {
      name: `${translate("storeWarehouse.warehouseUnitIdentification")}`,
      icon: <OmsWarehouseUnitIdentification />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseUnitIdentification' }),
      role: "omc-store-chief",
      isWhShow: userExtensionInfo && userExtensionInfo?.StoreReyonUser == false
    },
    {
      name: `${translate("storeWarehouse.productPlacementInTheWarehouse")}`,
      icon: <OmsProductPlacementWarehouse />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehoseProductIdentification' }),
      role: "omc-store-chief",
      isWhShow: userExtensionInfo && userExtensionInfo?.StoreReyonUser == false
    },
    {
      name: `${translate("storeWarehouse.rayonIdentification")}`,
      icon: <OmsWarehouseRayonIdentification />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreRayonIdentification' }),
      role: "omc-store-chief",
    },
    {
      name: `${translate("storeWarehouse.userAssignments")}`,
      icon: <OmsWarehouseUserAssignment />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseUserList' }),
      role: "omc-store-chief"
    },
    {
      name: `${translate("storeWarehouse.removeProductFromWarehouse")}`,
      icon: <OmsWarehouseDeleteProductIcon />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseDeleteProduct' }),
      role: "omc-store-chief",
      isWhShow: userExtensionInfo && userExtensionInfo?.StoreReyonUser == false
    },
    {
      name: `${translate("storeWarehouse.warehouseActivityReport")}`,
      icon: <OmsWarehouseInventoryIcon />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseRapor' }),
      role: "omc-store-chief",
    },//
    {
      name: `${translate("storeWarehouse.productSearch")}`,
      icon: <OmsWarehouseRapor />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehoseProductFind' }),
      role: "omc-store-chief",
    },
    {
      name: `${translate("storeWarehouse.warehouseInventoryReport")}`,
      icon: <OmsWarehouseProductReport />,
      //@ts-ignore
      navigate: () => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseInventoryReport' }),
      role: "omc-store-chief",
    },
    // {
    //   name: `${translate("storeWarehouse.aisleDeviceIdentification")}`,
    //   icon: <Octicons name="device-mobile" size={50} color="#F47721" />,
    //   navigate: '/(main)/(tabs)/(storeWarehouse)/StoreWarehouseRayonDevice',
    //   role: "omc-store-chief",
    // }
  ]

  const productReqNavigation = () => {
    const isMobile = Platform.OS === 'android' || Platform.OS === 'ios'
    if (isMobile) {
      navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseReqList' })
    } else {
      navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseReqListWeb' })
    }
  }
  return (
    <View style={styles.hardContainer}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back"]}
        headerTitle={translate("storeWarehouse.warehouseOperations")}
      />
      <ScrollView>
        <View style={styles.container}>
          {userExtensionInfo && userExtensionInfo.find(item => item.StoreReyonUser === false) &&
            <View style={{ width, alignItems: 'center', marginTop: 20 }}>
              <TouchableOpacity activeOpacity={0.9} onPress={productReqNavigation} style={styles.bigButton}>
                <OmsWarehouseReqProduct />
                <Text style={styles.bigButtonText}>{translate("storeWarehouse.productRequests")}</Text>
              </TouchableOpacity>
            </View>
          }
          {isInRole('omc-store-chief') ?
            <View style={styles.cardWrapperContainer}>
              {menuList.map((item, index) => (
                <TouchableOpacity activeOpacity={0.9} disabled={isInRole(item?.role) ? false : true} onPress={item.navigate} key={`${item.name}-${index}`} style={[styles.cardWrapper, index / 2 === 0 ? { marginLeft: 0, marginRight: 15 } : { marginLeft: 0, marginRight: 15 }]}>
                  {item.icon}
                  <Text style={styles.cardBoxText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View> :
            <View style={styles.cardWrapperContainer}>
              {menuList.map((item, index) => (
                item?.isWhShow &&
                <TouchableOpacity activeOpacity={0.9} disabled={isInRole(item?.role) ? false : true} onPress={item.navigate} key={`${item.name}-${index}`} style={[styles.cardWrapper, index / 2 === 0 ? { marginLeft: 0, marginRight: 15 } : { marginLeft: 0, marginRight: 15 }]}>
                  {item.icon}
                  <Text style={styles.cardBoxText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          }
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  hardContainer: {
    flex: 1,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cardWrapperContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  cardWrapper: {
    width: width * 0.4,
    height: 139,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  cardBoxText: {
    width: 138,
    height: 33,
    fontWeight: 'bold',
    fontSize: 15,
    fontStyle: "normal",
    lineHeight: 17.3,
    textAlign: "center",
    color: "#9a9999",
  },
  bigButton: {
    backgroundColor: '#ff7f00',
    marginBottom: 20,
    width: '85%',
    marginRight: 10,
    height: height * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  bigButtonText: {
    width: 100,
    fontWeight: 'bold',
    fontSize: 20,
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#fff"
  }
});

export default StoreWarehouseNavigationList

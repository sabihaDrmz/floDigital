import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native"
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useEffect, useState } from "react";
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import { StoreWarehouseResModel } from "contexts/model/StoreWarehouseModal";
import moment from "moment";
import { useAccountService } from "../../contexts/AccountService";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import FloLoading from "../../components/FloLoading";
import { AppButton, ColorType } from "@flomagazacilik/flo-digital-components";
import { translate } from "../../helper/localization/locaizationMain";

const screenWidth = Dimensions.get('window').width;

const StoreWarehoseReqList = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [data, setData] = useState<StoreWarehouseResModel[]>([]);
  const [allData, setAllData] = useState<StoreWarehouseResModel[]>([]);

  const [selectedItem, setSelectedItem] = useState<number>(-1)

  const { isLoading, isEdit, setStatusForStoreWarehouseReq, storeWarehouseReqList, getListForStoreWarehouseReq, deleteStoreWarehouseRequest, changeModalVisible, createStoreWarehouseRequest, updateStoreWarehouseRequest } = useStoreWarehouseService();
  const { getUserStoreWarehouseId, employeeInfo } = useAccountService();

  const tabHeader = [{
    id: 0,
    name: `${translate("storeWarehouse.warehouseIdentification")}`,
  },
  {
    id: 2,
    name: `${translate("storeWarehouse.completedWorks")}`,
  }]

  const tableHeader = [{
    id: 0,
    name: `${translate("storeWarehouse.address")}`,
  },
  { id: 1, name: `${translate("storeWarehouse.barcode")}` },
  { id: 2, name: `${translate("storeWarehouse.definition")}` },
  ]

  useEffect(() => {
    getListForStoreWarehouseReq()
  }, [])

  useEffect(() => {
    setAllData(storeWarehouseReqList)
    dataStatusFilter(selectedTab)
  }, [isLoading === false])

  useEffect(() => {
    dataStatusFilter(selectedTab)
  }, [allData])

  const dataStatusFilter = (tabStatus: number) => {
    if (tabStatus === 2) {
      const statusFilterData = allData?.filter(x => x?.status === 2 || x?.status === 3);
      const newData = statusFilterData.map(item => ({
        ...item,
        tableItem: [item.unitQr, item.barcode, item.model],
        tableItemDetail: [
          {
            tableName: `${translate("storeWarehouse.barcode")}`,
            value: item.barcode,
          },
          {
            tableName: `${translate("storeWarehouse.address")}`,
            value: item.unitQr,
          },
          {
            tableName: `${translate("storeWarehouse.definition")}`,
            value: item.model,
          },
          {
            tableName: `${translate("storeWarehouse.size")}`,
            value: item.size,
          },
          {
            tableName: `${translate("storeWarehouse.requestor")}`,
            value: item.requestPersonName
          },
          {
            tableName: `${translate("storeWarehouse.requestTime")}`,
            value: item?.createDate ? moment(item?.createDate).format("DD.MM.YYYY HH:mm") : "",
          },
          {
            tableName: `${translate("storeWarehouse.requestNote")}`,
            value: item.requestNote ? item.requestNote : '-',
          },
          {
            tableName: `${translate("storeWarehouse.demandStatus")}`,
            value: item.status,
          }]
      }));
      setData(newData);
    } else {
      const statusFilterData = allData?.filter(x => x?.status === 0 || x?.status === 1);
      const newData = statusFilterData.map(item => ({
        ...item,
        tableItem: [item.unitQr, item.barcode, item.model],
        tableItemDetail: [
          {
            tableName: `${translate("storeWarehouse.barcode")}`,
            value: item.barcode,
          },
          {
            tableName: `${translate("storeWarehouse.address")}`,
            value: item.unitQr,
          },
          {
            tableName: `${translate("storeWarehouse.definition")}`,
            value: item.model,
          },
          {
            tableName: `${translate("storeWarehouse.size")}`,
            value: item.size,
          },
          {
            tableName: `${translate("storeWarehouse.requestor")}`,
            value: item.requestPersonName
          },
          {
            tableName: `${translate("storeWarehouse.requestTime")}`,
            value: item?.createDate ? moment(item?.createDate).format("DD.MM.YYYY HH:mm") : "",
          },
          {
            tableName: `${translate("storeWarehouse.requestNote")}`,
            value: item.requestNote ? item.requestNote : '-',
          },
          {
            tableName: `${translate("storeWarehouse.demandStatus")}`,
            value: item.status,
          }]
      }));
      setData(newData);
    }
  }

  const openDetail = (index: number) => {
    if (index === selectedItem) return setSelectedItem(-1)
    else setSelectedItem(index)
  }

  const changeTab = (tabStatus: number) => {
    setSelectedItem(-1)
    setSelectedTab(tabStatus);
    if (allData) {
      if (tabStatus === 2) {
        dataStatusFilter(2)
      } else {
        dataStatusFilter(0)
      }
    }
  };

  const statusButton = (item: any, status: number) => {
    switch (status) {
      case 0:
        return (
          <TouchableOpacity onPress={() => changeStatus(item, 1)} style={{ backgroundColor: '#2c6a9e', padding: 5, width: screenWidth * 0.3, borderRadius: 18.5 }}>
            <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.putIntoProcess")}</Text>
          </TouchableOpacity>
        )
        break;
      case 1:
        return (
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity onPress={() => changeStatus(item, 2)} style={{ backgroundColor: '#00c2ff', borderRadius: 10, width: screenWidth * 0.25, height: 30, alignItems: 'center', justifyContent: 'center' }}>
              <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.confirm")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeStatus(item, 3)} style={{ marginLeft: 10, backgroundColor: '#ff0000', borderRadius: 10, width: screenWidth * 0.3, height: 30, alignItems: 'center', justifyContent: 'center' }}>
              <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.productNotFound")}</Text>
            </TouchableOpacity>
          </View>
        )
        break;
      case 2:
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity disabled style={{ backgroundColor: '#dedede', padding: 5, width: screenWidth * 0.3, borderRadius: 18.5 }}>
              <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.completed")}</Text>
            </TouchableOpacity>
          </View>
        )
        break;
      case 3:
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity disabled style={{ backgroundColor: '#dedede', padding: 5, width: screenWidth * 0.3, borderRadius: 18.5 }}>
              <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.requestUnrealized")}</Text>
            </TouchableOpacity>
          </View>
        )
        break;
      default:
        return (
          <TouchableOpacity onPress={() => changeStatus(item, 1)} style={{ backgroundColor: '#2c6a9e', padding: 5, width: screenWidth * 0.3, borderRadius: 18.5 }}>
            <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.putIntoProcess")}</Text>
          </TouchableOpacity>
        )
    }
  }

  const changeStatus = async (item: any, status: number) => {
    const model = {
      id: item.id,
      productState: item.productState,
      status: status,
      completeNote: "",
      cancelReason: "",
      completePerson: employeeInfo.EfficiencyRecord,
      completePersonName: `${employeeInfo.FirstName} ${employeeInfo.LastName}`
    }
    await setStatusForStoreWarehouseReq(model).then(res => {
      if (res === true) {
        getListForStoreWarehouseReq().then((res: StoreWarehouseResModel[]) => {
          if (res && res?.length > 0)
            setAllData(res);
        })
      }
    })

  }
  const getRefreshList = async () => {
    await getListForStoreWarehouseReq();
    dataStatusFilter(selectedTab)
  }

  return (
    <ScrollView style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back", "customLeftButton"]}
        headerTitle={translate("storeWarehouse.warehouseProductRequests")}
        customLeftButton={() => (
          <TouchableOpacity onPress={getRefreshList} activeOpacity={0.9} style={{ backgroundColor: '#41a563', marginRight: 10, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{translate("storeWarehouse.refresh")}</Text>
          </TouchableOpacity>
        )
        } />
      {isLoading ?
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: Dimensions.get("window").height - 100,
          }}
        >
          <FloLoading />
        </View> :
        <>
          <View style={styles.tabContainer}>
            {tabHeader.map((item, index) => {
              return (
                <TouchableOpacity key={`tab-header-${item?.id}`} onPress={() => changeTab(item?.id)} activeOpacity={0.9} style={[selectedTab === item?.id ? styles.tabActiveItem : styles.tabItem]}>
                  <Text style={[selectedTab === item?.id ? styles.tabActiveText : styles.tabText]}>{item.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {data && data?.length > 0 ? <View style={styles.tableContainer}>
            <View style={styles.tableHeaderContianer}>
              {tableHeader.map((item, index) => {
                return (
                  <View key={`table-header-${item?.id}`} style={styles.tableHeaderItem}>
                    <Text numberOfLines={1} style={styles.tableHeaderText}>{item?.name}</Text>
                  </View>
                )
              })}
            </View>

            {data.map((item, index) => (
              <>
                <View style={styles.tableItemContianer}>
                  {item.tableItem.map((tableItem: string, idx: number) => (
                    <TouchableOpacity activeOpacity={0.9} onPress={() => openDetail(index)} key={`table-item-${idx}`} style={styles.tableItem}>
                      <Text numberOfLines={1} style={styles.tableItemText}>{tableItem}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedItem === index && (
                  <View style={styles.itemDetailContainer}>
                    {item.tableItemDetail.map((tableDetailItem: any, idx: number) => (
                      <>
                        {tableDetailItem.tableName === 'Talep Durumu' ?
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: screenWidth * 0.25 }}>
                              <Text numberOfLines={1} style={styles.itemDetailText}>{tableDetailItem.tableName}</Text>
                            </View>
                            <View style={{ width: screenWidth * 0.05 }}>
                              <Text style={styles.itemDetailText}>:</Text>
                            </View>
                            <View style={{ width: screenWidth * 0.70 }}>
                              {statusButton(item, tableDetailItem.value)}
                            </View>
                          </View>
                          :
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: screenWidth * 0.25 }}>
                              <Text numberOfLines={1} style={styles.itemDetailText}>{tableDetailItem.tableName}</Text>
                            </View>
                            <View style={{ width: screenWidth * 0.05 }}>
                              <Text style={styles.itemDetailText}>:</Text>
                            </View>
                            <View style={{ width: screenWidth * 0.70 }}>
                              <Text style={styles.itemDetailText} numberOfLines={1}>{tableDetailItem.value}</Text>
                            </View>
                          </View>
                        }
                      </>
                    ))}
                  </View>
                )}
              </>
            ))}
          </View> :
            <View style={{ alignItems: 'center', justifyContent: 'center', height: screenWidth }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8a8a8a' }}>{selectedTab === 0 ? `${translate("storeWarehouse.noPendingWorkOrders")}` : `${translate("storeWarehouse.noWorkCompleted")}`}</Text>
            </View>
          }
        </>
      }
    </ScrollView>
  )
}

export default StoreWarehoseReqList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabItem: {
    backgroundColor: '#ffffff',
    padding: 10,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18,
  },
  tabActiveItem: {
    backgroundColor: '#414141',
    padding: 10,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18,
  },
  tabText: {
    fontSize: PerfectFontSize(16),
    fontFamily: 'Poppins_400Regular',
    color: '#8a8a8a',
    fontWeight: 'bold',
  },
  tabActiveText: {
    fontSize: PerfectFontSize(16),
    fontFamily: 'Poppins_400Regular',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  tableContainer: {
    marginTop: 25,
    marginHorizontal: 9
  },
  tableHeaderContianer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeaderItem: {
    backgroundColor: '#ff7f00',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth / 3.15,
    borderColor: '#fff',
    borderWidth: 1
  },
  tableHeaderText: {
    fontSize: PerfectFontSize(14),
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff'
  },
  tableItemContianer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tableItem: {
    backgroundColor: '#ffffff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth / 3.15,
    borderColor: '#cecece',
    borderWidth: 0.5,
    borderBottomWidth: 1,
    borderTopWidth: 0
  },
  tableItemText: {
    fontSize: PerfectFontSize(14),
    fontFamily: 'Poppins_600SemiBold',
    color: '#626262'
  },
  itemDetailContainer: {
    padding: 11,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderColor: '#cecece',
  },
  itemDetailText: {
    fontSize: PerfectFontSize(14),
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "left",
    color: "#626262",
    fontFamily: 'Poppins_600SemiBold',
  },
  itemText: {
    fontSize: PerfectFontSize(12),
    fontWeight: "bold",
    color: '#000',
    textAlign: 'center'
  },
})

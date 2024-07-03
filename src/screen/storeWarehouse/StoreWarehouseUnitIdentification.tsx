import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Platform
} from "react-native";
import React, { useEffect, useState } from "react";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import Modal from "react-native-modal";
import { TextInput } from "react-native";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import FloComboBox from "../../components/FloComobox";
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import { StoreWarehouseResModel, StoreWarehouseResUnitModel } from "../../contexts/model/StoreWarehouseModal";
import { FloButton } from "../../components";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { PrinterIcon } from "../../components/CustomIcons/MainPageIcons";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";
import linq from "linq";
import FloLoadingModal from "../../components/Modal/FloLoadingModal";
import {
  AppCheckBox,
} from "@flomagazacilik/flo-digital-components";
import { useNavigation } from "@react-navigation/native";
import { translate } from "../../helper/localization/locaizationMain";

const { width, height } = Dimensions.get("window");

const StoreWarehouseUnitIdentification = ({ }: any) => {
  const { storeWarehouseUnitList, storeWarehouseList, getListForStoreWarehouseUnit, getListForStoreWarehouse, createForStoreWarehouseUnit, updateForStoreWarehouseUnit, deleteForStoreWarehouseUnit } = useStoreWarehouseService();
  const { printQrUnit } = usePrinterConfigService();
  const navigation = useNavigation();


  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedWarehose, setSelectedWarehouse] = useState<string>('');
  const [inputValues, setInputValues] = useState({
    code: "",
  });
  const [searcText, setSearchText] = useState<string>();
  const [searchData, setSearchData] = useState();
  const [unitData, setUnitData] = useState();
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [checked, setChecked] = useState<boolean>(false);
  const [data, setData] = useState<StoreWarehouseResUnitModel[] | undefined>([]);
  const [unitList, setUnitList] = useState<StoreWarehouseResUnitModel[]>([]);

  const handleOnchange = (text: string, input: string) => {
    setInputValues((prevState) => ({ ...prevState, [input]: text }));
  };

  const setEditModal = () => {
    setInputValues({ code: unitList[0].code });
    setSelectedItemId(unitList[0].id)
    setModalVisible(true);
    setIsEdit(true);
  }

  const setCreateModal = () => {
    setModalVisible(true);
    setIsEdit(false);
  }

  const selectedCode = (item: StoreWarehouseResUnitModel) => {
    setInputValues({ code: item.code });
    setSelectedItemId(item.id)
    setModalVisible(true);
    setIsEdit(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setInputValues({ code: "" });
    setIsEdit(false);
  };

  useEffect(() => {
    setData(storeWarehouseUnitList)
  }, [storeWarehouseUnitList])

  const onChangeWarehose = (id: string) => {
    setSelectedWarehouse(id);
    getListForStoreWarehouseUnit(id);
    setData(storeWarehouseUnitList || []);
  };

  useEffect(() => {
    getStoreWarehouse()
  }, [])

  const getStoreWarehouse = () => {
    getListForStoreWarehouse();
  }

  const onSearch = (text: string) => {
    if (text) {
      const searcData = data?.filter(function (item) {
        const itemData = item.code
          ? item.code.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      setData(searcData);
    } else {
      setData(storeWarehouseUnitList)
    }
  }

  const printData = () => {
    if (unitList) {
      var idArray = linq.from(unitList).select((x) => x.code).toArray();
      printQrUnit(idArray);
    }
  }

  const onSave = () => {
    createForStoreWarehouseUnit(selectedWarehose, inputValues.code)
    setModalVisible(false);
    setInputValues({ code: "" });
    setIsEdit(false);
  };

  const onUpdate = () => {
    updateForStoreWarehouseUnit(selectedWarehose, inputValues.code, selectedItemId)
    setModalVisible(false);
    setInputValues({ code: "" });
    setIsEdit(false);
    setUnitList([])
  };

  const onDelete = () => {
    deleteForStoreWarehouseUnit(selectedWarehose, selectedItemId)
    setModalVisible(false);
    setInputValues({ code: "" });
    setIsEdit(false);
    setUnitList([])
  };

  const selectUnit = (item: StoreWarehouseResUnitModel) => {
    const unit = unitList?.filter(x => x.id === item?.id);
    if (unit && unit.length > 0) {
      setChecked(false)
      const unit = unitList?.filter(x => x.id !== item?.id);
      setUnitList(unit);
    } else {
      setUnitList([...unitList, item])
    }
  }

  const renderItem = ({ item, index }: StoreWarehouseResUnitModel[]) => {
    console.log('index:', index)
    const unit = unitList?.find(x => x.id === item?.id);
    return (
      <TouchableOpacity
        onPress={() => selectUnit(item)}
        key={`${item.id}-${item.code}`}
        style={[styles.itemContainer, unit?.id == item?.id && { backgroundColor: '#ff7f00' }, index % 2 === 0 && { marginRight: 10 }]}
      >
        <Text numberOfLines={1} style={styles.itemP}>{item.code}</Text>
      </TouchableOpacity>
    )
  }
  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back", "customLeftButton"]}
        headerTitle={translate("storeWarehouse.warehouseUnitIdentification")}
        customLeftButton={() => (
          <>
            {selectedWarehose &&
              <TouchableOpacity onPress={setCreateModal} style={{ backgroundColor: '#fff', padding: 5, right: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 19 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#808080', fontSize: 14, fontWeight: 'bold' }}>{translate("storeWarehouse.addUnit")}</Text>
                  <Text style={{ alignItems: 'center', color: '#ff7f00', fontWeight: 'bold', fontSize: 20, marginLeft: 5, marginBottom: 5 }}>+</Text>
                </View>
              </TouchableOpacity>
            }
          </>
        )}
      />
      <View style={{
        marginHorizontal: 10, backgroundColor: '#fff', marginTop: 43, padding: 12, shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}>
        <FloComboBox
          data={storeWarehouseList}
          keyProp="id"
          valueProp="code"
          selectedItem={storeWarehouseList.find(
            (x) => x.id === selectedWarehose
          )}
          onSelectItem={(item) => {
            onChangeWarehose(item ? item.id : -1);
          }}
          placeholder={translate("storeWarehouse.selectWarehouse")}
          containerStyle={{
            borderColor: "rgb(206,202,202)",
            backgroundColor: "#fff",
            marginTop: 10,
          }}
          textColor={"#7c7c7c"}
          fontSize="14"
        />
        <>
          {selectedWarehose && (
            <>
              <View
                style={{
                  borderColor: "#CECACA",
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderRadius: 8,
                  height: 60,
                  paddingLeft: 5,
                  marginTop: 10,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: 'space-between'
                }}
              >
                <FloTextBoxNew
                  placeholder={translate("storeWarehouse.search")}
                  onChangeText={onSearch}
                  value={searcText}
                  style={{
                    backgroundColor: "transparent",
                    width: width * 0.75,
                    fontFamily: "Poppins_200ExtraLight",
                    fontSize: 15,
                    color: "#707070",
                  }}
                />
                <TouchableOpacity onPress={printData} style={{
                  alignItems: 'center', justifyContent: 'center'
                  , marginRight: 15
                }}>
                  <PrinterIcon width={30} />
                </TouchableOpacity>
              </View>
              <View style={{ flexGrow: 1, height: '30%' }}>
                <FlatList
                  contentContainerStyle={{ alignItems: 'center' }}
                  numColumns={2}
                  data={data}
                  columnWrapperStyle={styles.columnWrapper}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={(item, index) => renderItem(item, index)}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppCheckBox
                    onSelect={(state) => {
                      setChecked(state)
                      if (state === true) {
                        setUnitList(data);
                      } else {
                        setUnitList([])
                      }
                    }}
                    checked={checked}
                  />
                  <Text style={{ marginLeft: 10 }}>{translate("storeWarehouse.selectAll")}</Text>
                </View>
              </View>
            </>
          )}
        </>
      </View>
      <>
        {selectedWarehose &&
          <>
            <View style={{
              position: 'absolute',
              bottom: 100,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
              left: 0,
              right: 0
            }}>
              <TouchableOpacity disabled={unitList?.length !== 1} onPress={() => setEditModal()} style={{ backgroundColor: unitList?.length === 1 ? '#4f4f4f' : '#d2d2d2', height: 50, width: '90%', borderRadius: 61, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: unitList?.length === 1 ? '#fff' : '#929292', fontWeight: 'bold', fontSize: 18 }}>{translate("storeWarehouse.edit")}</Text>
              </TouchableOpacity>
            </View>
            {Platform.OS !== 'web' &&
              <View style={{
                position: 'absolute',
                bottom: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 10,
                left: 0,
                right: 0
              }}>
                <TouchableOpacity disabled={!unitList?.length > 0} onPress={printData} style={{ backgroundColor: unitList?.length > 0 ? '#ff7f00' : '#d2d2d2', height: 50, width: '90%', borderRadius: 61, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: unitList?.length > 0 ? '#fff' : '#929292', fontWeight: 'bold', fontSize: 18 }}>{translate("storeWarehouse.qrPrinting")}</Text>
                </TouchableOpacity>
              </View>
            }
          </>
        }
      </>

      <Modal onBackdropPress={closeModal} isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalWrapper}>
            <View style={{ backgroundColor: '#ff7f00' }}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: PerfectFontSize(16),
                  fontWeight: "700",
                  fontStyle: "normal",
                  letterSpacing: 0.6,
                  color: '#fff',
                  padding: 10
                }}
              >
                {isEdit ? `${translate("storeWarehouse.edit")}` : `${translate("storeWarehouse.add")}`}
              </Text>
            </View>
            <View style={{ marginHorizontal: 12, marginVertical: 12 }}>
              <View>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: PerfectFontSize(16),
                    fontWeight: "700",
                    fontStyle: "normal",
                    letterSpacing: 0.6,
                    marginTop: 10,
                    color: '#626262'
                  }}
                >
                  {translate("storeWarehouse.unitName")}
                </Text>
                <FloTextBoxNew
                  value={inputValues.code}
                  onChangeText={(text) => handleOnchange(text, "code")}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                {isEdit ? (
                  <>
                    <TouchableOpacity
                      onPress={onDelete}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteText}>{translate("storeWarehouse.delete")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={onUpdate}
                      style={
                        inputValues.code
                          ? styles.addButton
                          : styles.addInactiveButton
                      }
                    >
                      <Text style={styles.addInactiveText}>{translate("storeWarehouse.edit")}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelText}>{translate("storeWarehouse.cancel")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={onSave}
                      style={
                        inputValues.code
                          ? styles.addButton
                          : styles.addInactiveButton
                      }
                    >
                      <Text style={styles.addInactiveText}>{translate("storeWarehouse.add")}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <>
                {isEdit && (
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.editCancelButton}
                  >
                    <Text style={styles.cancelText}>{translate("storeWarehouse.cancel")}</Text>
                  </TouchableOpacity>
                )}
              </>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StoreWarehouseUnitIdentification;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
  headerText: {
    fontSize: PerfectFontSize(18),
    fontWeight: "bold",
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    left: 0,
    right: 0
  },
  itemContainer: {
    backgroundColor: "#e2e2e2",
    padding: 10,
    width: width * 0.4,
    marginBottom: 10,
    borderRadius: 13,
    textAlign: "center"
  },
  itemWrapper: {
    width: "50%",
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  inactiveItemWrapper: {
    width: "50%",
    borderWidth: 1,
    backgroundColor: "#EEE",
  },
  itemP: {
    padding: 10,
    textAlign: "center",
    color: '#2c2c2c', fontWeight: 'bold', fontSize: 13
  },
  modalContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  modalWrapper: {
    width: "95%",
    backgroundColor: "#fff",
  },
  modalInput: { width: "100%", borderWidth: 1, padding: 10, marginTop: 10 },
  addInactiveButton: {
    backgroundColor: "#EEEEEEEE",
    padding: 10,
    borderRadius: 21,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  addInactiveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#414141",
    padding: 10,
    borderRadius: 21,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#F90000",
    padding: 10,
    borderRadius: 21,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  editCancelButton: {
    backgroundColor: "#414141",
    padding: 10,
    marginTop: 10,
    borderRadius: 21,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#00b2ff",
    padding: 10,
    borderRadius: 21,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});

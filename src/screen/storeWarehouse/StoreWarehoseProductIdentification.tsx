import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Keyboard,
  Platform
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import FloComboBox from "../../components/FloComobox";
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { FloButton } from "../../components";
import MainCamera from "../../components/MainCamera";
import { StoreWarehouseResUnitProductModel, StoreWhLabelAddProductListRequestModel } from "../../contexts/model/StoreWarehouseModal";
import FloLoadingModal from "../../components/Modal/FloLoadingModal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
//TODO: EXPO AV  expo-av  ++++++ only test
// import { Audio } from 'expo-av';
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { translate } from "../../helper/localization/locaizationMain";
import { playSound } from "../../core/Util";

const StoreWarehoseProductIdentification = ({ }: any) => {
  const { getListForStoreWarehouse, createProductForStoreWarehouseUnit, storeWarehouseList, isLoading, addProductList } = useStoreWarehouseService();
  const navigation = useNavigation();
  const [storeWhLabelCode, setStoreWhLabelCode] = useState<string>("");
  const [storeWhId, setStoreWhId] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [isUnit, setIsUnit] = useState(false)
  const [selectedWarehose, setSelectedWarehouse] = useState<string>('');
  const [productList, setProductList] = useState<StoreWarehouseResUnitProductModel[]>([]);
  const [selectedTxt, setselectedTxt] = useState("")

  const { width, height } = Dimensions.get("window");
  const [product, setProduct] = useState<StoreWarehouseResUnitProductModel>({
    storeWhLabelCode: '',
    sku: '',
    storeWhId: selectedWarehose,
    quantity: 1
  });
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [lastUnit, setLastUnit] = useState<string>('');
  const MessageBox = useMessageBoxService();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  useEffect(() => {
    getListForStoreWarehouse();
  }, [])

  const handleOnchange = (text: string, input: string, isCamera: boolean) => {
    if (input === 'storeWhLabelCode') {
      setProduct(prevProduct => ({
        ...prevProduct,
        storeWhLabelCode: text,
      }));
    } else if (input === 'storeWhId') {
      setProduct(prevProduct => ({
        ...prevProduct,
        storeWhId: text,
      }));
    } else if (input === 'sku') {
      setProduct(prevProduct => ({
        ...prevProduct,
        sku: text,
      }));
      setSku(text);

      if (isCamera) {
        // Eğer SKU kamera ile okutulduysa, burada addProduct işlemini yapabilirsiniz.
        addProduct({ ...product, sku: text });
      }
    }
  };

  const onSave = () => {
    createProductForStoreWarehouseUnit(productList)
    setSku('')
    setStoreWhLabelCode('')
    setStoreWhId('')
    setProductList([]);
    changeAcceptModal()
  };

  const changeAcceptModal = () => {
    MessageBox.show(`${translate("storeWarehouse.sureWantSaveProducts")}`, {
      type: MessageBoxType.YesNo,
      yesButtonTitle: `${translate("storeWarehouse.save")}`,
      noButtonTitle: `${translate("storeWarehouse.cancel")}`,
      yesButtonEvent: () => {
        onSave();
      },
    })
  }
  const addProduct = async (newProduct: StoreWarehouseResUnitProductModel) => {
    try {
      const existingProductIndex = productList.findIndex(
        p =>
          p.sku === newProduct.sku &&
          p.storeWhLabelCode === newProduct.storeWhLabelCode &&
          p.storeWhId === newProduct.storeWhId
      );

      if (existingProductIndex !== -1) {
        productList[existingProductIndex].quantity += 1;
        setProductList([...productList]);
      } else {
        const currentStoreWh = storeWarehouseList.find(
          x => x.id === selectedWarehose
        );

      await  playSound(require('../../assets/ping.mp3'))

        newProduct.storeWhName = currentStoreWh?.code;
        setProductList([...productList, newProduct]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = (products: StoreWarehouseResUnitProductModel) => {
    const newProductList = productList.filter(x => x.storeWhId !== products.storeWhId || x?.sku !== products?.sku || x?.storeWhLabelCode !== products?.storeWhLabelCode);
    setProductList(newProductList);
  }

  const handleBlur = () => {
    const trimmedText = product?.storeWhLabelCode?.trim()
    setProduct(prevProduct => ({
      ...prevProduct,
      storeWhLabelCode: trimmedText,
    }));
  }

  const addProductsWithTxt = async (model: StoreWhLabelAddProductListRequestModel) => {
    await addProductList(model);
    setselectedTxt("")
    setProduct(prevProduct => ({
      ...prevProduct,
      storeWhLabelCode: "",
    }));
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    const file = event.target.files[0];
    if (file.name) {
      setselectedTxt(file.name)
    }
    if (file) {
      readFile(file);
    }
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput)
      fileInput.value = '';

  }

  const readFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const content = event.target.result as string;
        const lines = content.split('\n');
        const myList: { barcode: string; storeWhLabelCode: string | undefined; }[] = [];

        lines.forEach(line => {
          const [barcode, storeWhLabelCode] = line.trim().split(/\s+/);

          if (barcode && storeWhLabelCode || product.storeWhLabelCode) {
            myList.push({ barcode, storeWhLabelCode });
          } else {
            MessageBox.show(translate("storeWarehouse.pleaseMakeSureBarcodeShelfEnteredCorrectly"));
            return;
          }
        });

        if (myList.length > 0) {
          const model: StoreWhLabelAddProductListRequestModel = {
            items: myList.map(item => ({
              barcode: item.barcode,
              storeWhLabelCode: item.storeWhLabelCode || product.storeWhLabelCode
            })),
            storeWhId: Number(selectedWarehose)
          };
          addProductsWithTxt(model);
        } else {
          MessageBox.show(translate("storeWarehouse.fileEmptyFormattedIncorrectly"));
          setselectedTxt("")
          setProduct(prevProduct => ({
            ...prevProduct,
            storeWhLabelCode: "",
          }));
        }
      }
    };

    reader.readAsText(file);
  }

  const renderItem = ({ item }: StoreWarehouseResUnitProductModel) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderRadius: 10 }}>
        <View style={{ backgroundColor: '#e2e2e2', borderRadius: 12, width: '85%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 17, marginTop: 5 }}>
            <Text style={{ color: '#2c2c2c', fontWeight: 'bold', fontSize: 13 }}>{translate("storeWarehouse.barcode")} : </Text>
            <Text numberOfLines={1} style={{ color: '#2c2c2c', fontSize: 13 }}>{item?.sku}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 17 }}>
            <Text style={{ color: '#2c2c2c', fontWeight: 'bold', fontSize: 13 }}>{translate("storeWarehouse.shelf")} : </Text>
            <Text numberOfLines={1} style={{ color: '#2c2c2c', fontSize: 13 }}>{item?.storeWhLabelCode}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 17, marginBottom: 5 }}>
            <Text style={{ color: '#2c2c2c', fontWeight: 'bold', fontSize: 13 }}>{translate("storeWarehouse.warehouse")} : </Text>
            <Text numberOfLines={1} style={{ color: '#2c2c2c', fontSize: 13 }}>{item?.storeWhName}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => deleteProduct(item)} style={{ backgroundColor: '#ff0000', height: 39, width: 39, borderRadius: 39, alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesomeIcon name="trash-2" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    )
  }

  if (isLoading) return <FloLoadingModal />
  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={translate("storeWarehouse.warehouseProductPlacement")}
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
            handleOnchange(item.id, 'storeWhId', false);
            setSelectedWarehouse(item.id)
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
          <>
            {selectedWarehose &&
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
                  onChangeText={(txt) => handleOnchange(txt, "storeWhLabelCode", false)}
                  value={product.storeWhLabelCode}
                  placeholder={'ldnaskdh'}
                  style={{
                    backgroundColor: "transparent",
                    width: width * 0.75,
                    fontFamily: "Poppins_200ExtraLight",
                    fontSize: 15,
                    color: "#707070",
                  }}
                  onBlur={handleBlur}
                />
                <TouchableOpacity onPress={() => {
                  setIsCameraShow(true);
                  setIsUnit(true);
                  Keyboard.dismiss();
                }}>
                  <Image
                    source={require("../../assets/S.png")}
                    style={{
                      width: PerfectPixelSize(50),
                      height: PerfectPixelSize(50),
                    }}
                  />
                </TouchableOpacity>
              </View>
            }
          </>
          <>
            {product.storeWhLabelCode &&
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
                  onSubmitEditing={() => addProduct(product)}
                  onChangeText={(txt) => handleOnchange(txt, "sku", false)}
                  value={product.sku}
                  style={{
                    backgroundColor: "transparent",
                    width: width * 0.75,
                    fontFamily: "Poppins_200ExtraLight",
                    fontSize: 15,
                    color: "#707070",
                  }}
                  placeholder={translate("storeWarehouse.scanEnterBarcode")}
                />
                <TouchableOpacity onPress={() => {
                  setIsCameraShow(true);
                  setIsUnit(false);
                  Keyboard.dismiss();
                }}>
                  <Image
                    source={require("../../assets/S.png")}
                    style={{
                      width: PerfectPixelSize(50),
                      height: PerfectPixelSize(50),
                    }}
                  />
                </TouchableOpacity>
              </View>
            }
          </>
        </>
        {
          Platform.OS === "web" && selectedWarehose &&
          <div style={{ backgroundColor: colors.white, margin: '20px 0px', display: 'flex', flexDirection: 'row', borderRadius: '33.5px', width: '50%', border: '1px solid #CECACA' }}>
            <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileInputChange} />
            <label htmlFor="fileInput" style={{ backgroundColor: colors.floOrange, padding: '12px 36px', borderRadius: '33.5px', border: 'none', color: colors.white, fontFamily: 'Poppins_500Medium', fontSize: PerfectFontSize(12), cursor: 'pointer' }}>{translate("storeWarehouse.selectFile")}</label>
            <div style={{ color: '#959595', fontSize: PerfectFontSize(12), alignSelf: 'center', marginLeft: 12 }}>{selectedTxt ? selectedTxt : translate("storeWarehouse.selectFile1")}</div>
          </div>
        }

        {productList && productList.length > 0 &&
          (<View style={{ flexGrow: 1, height: '30%' }}>
            <Text>{translate("storeWarehouse.totalNumberBarcodes")}: {productList.length}</Text>
            <FlatList
              data={productList}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={(item) => renderItem(item)}
            />
          </View>
          )}
      </View>

      {
        !isKeyboardVisible && productList?.length > 0 && (
          <View style={{ marginHorizontal: 10, position: 'absolute', bottom: 0, width: '95%' }}>
            <FloButton
              onPress={changeAcceptModal}
              title="Kaydet"
              containerStyle={{
                marginBottom: 40,
                marginTop: 10,
                backgroundColor: '#00b2ff',
                borderRadius: 20.5
              }}
            />
          </View>
        )
      }

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode: string) => {
          if (!isUnit) {
            if (barcode.startsWith("0"))
              barcode = barcode.substring(1, barcode.length);
            handleOnchange(barcode, "sku", true);
          } else {
            handleOnchange(barcode, "storeWhLabelCode", true);
            setIsCameraShow(false);
          }
        }}
        onHide={() => setIsCameraShow(false)}
        isSelfCheckOut={isUnit}
      />
    </View >
  );
};

export default StoreWarehoseProductIdentification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "#FF7712",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    zIndex: 9999,
    bottom: 10,
    right: 10,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 10,
    width: "45%",
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 13,
    textAlign: "center",
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
  },
  modalContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  modalWrapper: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 21,
  },
  modalInput: { width: "100%", borderWidth: 1, padding: 10, marginTop: 10 },
  addInactiveButton: {
    backgroundColor: "#EEEEEEEE",
    padding: 10,
    borderRadius: 7,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  addInactiveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 7,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#F90000",
    padding: 10,
    borderRadius: 7,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  editCancelButton: {
    backgroundColor: "#000",
    padding: 10,
    marginTop: 10,
    borderRadius: 7,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#38C14E",
    padding: 10,
    borderRadius: 7,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
});

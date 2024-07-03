import React, { useState, useEffect } from "react";
import { useCompletionOfSalesShortageService } from "../../contexts/CompletionOfSalesShortageService";
import { useIsFocused } from "@react-navigation/native";
import { View, Platform, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, TextInput, Text } from "react-native";
import { FloHeader } from "../../components/Header";
import { translate } from "../../helper/localization/locaizationMain";
import { AppText, AppColor, AppButton } from "@flomagazacilik/flo-digital-components";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import ImageViewer from "../../components/CompletionOfSalesShortage/ImageViewer";
import { MenuIconSales } from "../../components/CompletionOfSalesShortage/MenuIconSales";
import Popup from "../../components/CompletionOfSalesShortage/Popup";
import CheckBoxSales from "../../components/CompletionOfSalesShortage/CheckBoxSales";
import FloLoading from "../../components/FloLoading";
import { FontAwesome } from "@expo/vector-icons";
import MainCamera from "../../components/MainCamera";
import { SearchQR } from "../../components/CustomIcons/MainPageIcons";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useAccountService } from "../../contexts/AccountService";

const CompletionOfSalesShortage: React.FC = ({ navigation }: any) => {
  //#region Variable
  const { listData, reasonsData, getList, getReasons, updateStatus } = useCompletionOfSalesShortageService();
  const { show } = useMessageBoxService();
  const { employeeInfo, isInRole } = useAccountService();
  const isFocused = useIsFocused();
  const [products, setProducts] = useState(listData);
  const [productsTemp, setProductsTemp] = useState(listData);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [showStorePopup, setShowStorePopup] = useState(false);
  const [selectedReasonIds, setSelectedReasonIds] = useState<
    {
      index: number | undefined;
      reasonId: number | undefined;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setselectedPhoto] = useState("");

  const [isSelected, setIsSelected] = useState(false);
  const [selectedCollapseIndex, setselectedCollapseIndex] = useState(-1);
  const [isSelectedChild, setIsSelectedChild] = useState(false);
  const [selectedChildIndex, setselectedChildIndex] = useState(-1);
  const [checkedItems, setcheckedItems] = useState([]);
  const [selectedItemId, setselectedItemId] = useState(-1);
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [selectedAccessory, setSelectedAccessory] = useState(false)
  const [buttonPosition, setButtonPosition] = useState('absolute');

  useEffect(() => {
    if (!isSelected) {
      setIsSelectedChild(false)
    }
  }, [isSelected])

  //#endregion

  //#region useEffect
  //Sayfaya ilk tıklandığında seçimleri temizleyip tüm servislere istek atıyorum.
  //Ve listData her değiştiğinde products ve productsTemp state lerimi güncelliyorum.
  useEffect(() => {
    if (isFocused) {
      getReasons();
      setselectedCollapseIndex(-1);
      setBarcodeValue("");
      setIsSelected(false);
      setselectedChildIndex(-1);
      setcheckedItems([]);
      setIsSelectedChild(false);
      setSelectedReasonIds([]);
      setIsLoading(true);
      setSelectedAccessory(false)
      getList().then((res) => {
        if (res && res.length > 0) {
          var filteredData = filterAksesuar()
          setProductsTemp(filteredData);
          setProducts(listData);
        };
        setIsLoading(false);
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (listData && listData.length >= 0) {
      var filteredData = filterAksesuar()
      setProductsTemp(filteredData);
      setProducts(listData);
    };
  }, [listData]);

  useEffect(() => {
    if (barcodeValue.length === 0) {
      setFilters()
    }
    if (barcodeValue.length === 13) {
      setFilters()
    }
  }, [barcodeValue]);

  useEffect(() => {
    setFilters()
  }, [selectedAccessory]);

  const setFilters = () => {
    let filteredData = products;

    if (barcodeValue && filteredData?.length > 0) {

      var filterDataTmp = filteredData.map(function (productGroup: { productGroup: any; count: any; brands: any[]; }) {
        return {
          productGroup: productGroup.productGroup,
          count: productGroup.count,
          brands: productGroup.brands.map(function (brand: { brand: any; count: any; lackProducts: any[]; }) {
            return {
              brand: brand.brand,
              count: brand.count,
              lackProducts: brand.lackProducts.filter(function (product: { barcode: any; productMainGroup: string; }) {
                if (selectedAccessory) {
                  return product.barcode.startsWith(barcodeValue)
                }
                else if (!selectedAccessory && product.productMainGroup !== "AKSESUAR")
                  return product.barcode.startsWith(barcodeValue)
              })
            };
          }).filter(function (brand: { lackProducts: string | any[]; }) {
            return brand.lackProducts.length > 0;
          })
        };
      }).filter(function (productGroup: { brands: string | any[]; }) {
        return productGroup.brands.length > 0;
      });
      filteredData = filterDataTmp
    }
    else if (filteredData?.length > 0) {
      var filterDataTmp = filteredData.map(function (productGroup: { productGroup: any; count: any; brands: any[]; }) {
        return {
          productGroup: productGroup.productGroup,
          count: productGroup.count,
          brands: productGroup.brands.map(function (brand: { brand: any; count: any; lackProducts: any[]; }) {
            return {
              brand: brand.brand,
              count: brand.count,
              lackProducts: brand.lackProducts.filter(function (product: { barcode: any; productMainGroup: string; }) {
                if (selectedAccessory) {
                  return product
                }
                else if (!selectedAccessory && product.productMainGroup !== "AKSESUAR")
                  return product
              })
            };
          }).filter(function (brand: { lackProducts: string | any[]; }) {
            return brand.lackProducts.length > 0;
          })
        };
      }).filter(function (productGroup: { brands: string | any[]; }) {
        return productGroup.brands.length > 0;
      });
      filteredData = filterDataTmp
    }
    setProductsTemp(filteredData);
  };
  //#endregion

  const openCamera = () => {
    setIsCameraShow(true);
  };


  //#region Method to get today's data in FlatList and fix date format in data from API
  //Listede seçili olan elamanın id si ve o id ye ait bir neden seçildiyse o nedenin id sini alıyorum.
  //Reyona çıkar butonuna basınca id, varsa seçili nedenin id si yoksa null, neden seçiliyse state false seçili değilse true ve AcountService den aldığım modifiedUser parametrelerini liste şeklinde servise gönderiyorum ve bütün seçimleri temizleyip ekrana olumlu yada olumsuz mesaj basıyorum.
  const toggleItemSelection = (index: number, id: number) => {
    if (checkedItems.some((x) => x === id)) {
      var newIds = checkedItems.filter((x) => x !== id);
      setcheckedItems(newIds)
    } else {
      //@ts-ignore
      setcheckedItems([...checkedItems, id]);
    }

  };

  const onReasonSelect = (index: number, reasonId: number, itemId?: number) => {
    if (!reasonId) {
      show("Lütfen bir sebep seçiniz");
      return;
    };
    /// yeni koşul
    if (selectedReasonIds.some((x) => x.index === index)) {
      var data = selectedReasonIds;
      //@ts-ignore
      data.find((x) => x.index === index).reasonId = reasonId;
      setSelectedReasonIds(data);
    } else {
      setSelectedReasonIds([
        ...selectedReasonIds,
        {
          index,
          reasonId
        }
      ]);
    };

  };

  const onReasonRemove = () => {
    var newData = selectedReasonIds.filter((x) => x.index !== selectedItemId);
    setSelectedReasonIds(newData);
  };

  const createSales = async () => {
    var newData: {
      lackProductOrderId: number;
      state: boolean;
      reasonId: number | null;
      modifiedUser: string;
    }[] = [];
    checkedItems.forEach((x: number) => {
      var getReasonId = selectedReasonIds.find((y) => y.index === x)?.reasonId;
      newData.push({
        lackProductOrderId: x,
        state: getReasonId ? false : true,
        reasonId: getReasonId ?? null,
        modifiedUser: employeeInfo.EfficiencyRecord
      });
    });
    var res = await updateStatus(newData);
    if (res === true) {
      show(translate("warehouseRequest.operationSuccessfully"));
      setSelectedReasonIds([]);
      setcheckedItems([])
      setIsLoading(true);
      getList().then((res) => {
        if (res && res.length > 0) {
          var filteredData = filterAksesuar()
          setProductsTemp(filteredData);
          setProducts(listData);
          setBarcodeValue("")
        };
        setIsLoading(false);
      }).catch((err) => {
        setIsLoading(false);
        show("Bir hata oluştu.")
        setBarcodeValue("")
      });
    } else {
      show(translate("warehouseRequest.operationFailed"));
      setBarcodeValue("")
      setcheckedItems([]);
      setSelectedReasonIds([]);
    };
  };
  //#endregion

  const formatDateTime = (inputDate: Date): string => {
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const filterAksesuar = () => {
    var filteredData = listData.map(function (productGroup: { productGroup: any; count: any; brands: any[]; }) {
      return {
        productGroup: productGroup.productGroup,
        count: productGroup.count,
        brands: productGroup.brands.map(function (brand: { brand: any; count: any; lackProducts: any[]; }) {
          return {
            brand: brand.brand,
            count: brand.count,
            lackProducts: brand.lackProducts.filter(function (product: { barcode: any; productMainGroup: string; }) {
              if (selectedAccessory) {
                return product
              }
              else if (!selectedAccessory && product.productMainGroup !== "AKSESUAR")
                return product
            })
          };
        }).filter(function (brand: { lackProducts: string | any[]; }) {
          return brand.lackProducts.length > 0;
        })
      };
    }).filter(function (productGroup: { brands: string | any[]; }) {
      return productGroup.brands.length > 0;
    });
    return filteredData
  }

  //#region flatlist method
  const Card = (props: any) => {
    const {
      barcode,
      productName,
      category,
      productGroup,
      brand,
      gender,
      productColor,
      productSize,
      storeStock,
      createdDate
    } = props;

    const trimmedProductName = productName?.length > 24 ? productName.substring(0, 24) + "..." : productName;
    const combinedText = `${category} ${productGroup}`;
    const trimmedText = combinedText.length > 24 ? `${combinedText.substring(0, 24)}...` : combinedText;
    const combinedTextTwo = `${brand} ${gender}`;
    const trimmedTextTwo = combinedTextTwo?.length > 24 ? `${combinedTextTwo.substring(0, 24)}...` : combinedTextTwo;
    const combinedTextThree = `${translate("completionOfSalesShortageMainScreen.color")} ${productColor}  ${translate("completionOfSalesShortageMainScreen.size")} ${productSize}`;
    const trimmedTextThree = combinedTextThree?.length > 24 ? `${combinedTextThree.substring(0, 24)}...` : combinedTextThree;

    return (
      <View style={{ marginLeft: Platform.OS === "web" ? 55 : 15, justifyContent: Platform.OS === "web" ? "center" : undefined }}>
        <AppText selectable style={{ fontFamily: "Poppins_500Medium", color: AppColor.FD.Text.Ash, fontSize: PerfectFontSize(12) }}>
          {barcode}
        </AppText>
        <AppText selectable style={{ fontFamily: "Poppins_500Medium", color: AppColor.OMS.Background.Dark, fontSize: PerfectFontSize(12) }}>
          {Platform.OS === "web" ? productName : trimmedProductName}
        </AppText>
        {Platform.OS === "web" ? (
          <AppText selectable style={{ fontFamily: "Poppins_500Medium", color: AppColor.OMS.Background.Dark, fontSize: PerfectFontSize(12) }}>
            {category}{"  "}{productGroup}{"  "}{brand}{"  "}{gender}
          </AppText>
        ) : (
          <>
            <AppText selectable style={{ fontFamily: "Poppins_500Medium", color: AppColor.OMS.Background.Dark, fontSize: PerfectFontSize(12) }}>
              {trimmedText}
            </AppText>
            <AppText selectable style={{ fontFamily: "Poppins_500Medium", color: AppColor.OMS.Background.Dark, fontSize: PerfectFontSize(12) }}>
              {trimmedTextTwo}
            </AppText>
          </>
        )}
        {Platform.OS === "web" ? (
          <AppText selectable style={{ fontFamily: "Poppins_700Bold", color: AppColor.FD.Text.Ash, fontSize: PerfectFontSize(12) }}>
            {translate("completionOfSalesShortageMainScreen.color")}{" "}
            {productColor}
            {"  "}
            {translate("completionOfSalesShortageMainScreen.size")}{" "}
            {productSize}
            {"  "}
            {translate("completionOfSalesShortageMainScreen.stockQuantity")}{" "}
            {storeStock}
            {"  "}
            {translate("completionOfSalesShortageMainScreen.createDate")}{" "}
            {formatDateTime(new Date(createdDate))}
          </AppText>
        ) : (
          <View style={{ flexDirection: "column" }}>
            <AppText selectable style={{ fontFamily: "Poppins_700Bold", color: AppColor.FD.Text.Ash, fontSize: PerfectFontSize(12) }}>
              {trimmedTextThree}
            </AppText>
            <AppText selectable style={{ fontFamily: "Poppins_700Bold", color: AppColor.FD.Text.Ash, fontSize: PerfectFontSize(12) }}>
              {translate("completionOfSalesShortageMainScreen.createDate")}{" "}
              {formatDateTime(new Date(createdDate))}
            </AppText>
            <AppText selectable style={{ fontFamily: "Poppins_700Bold", color: AppColor.FD.Text.Ash, fontSize: PerfectFontSize(12) }}>
              {translate("completionOfSalesShortageMainScreen.stockQuantity")}{" "}
              {storeStock}
            </AppText>
          </View>
        )}
      </View>
    )
  };

  const renderCollapse = (item: any, index: number) => {
    return (
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                if (selectedCollapseIndex === index) {
                  setIsSelected(false);
                  setIsSelectedChild(false);
                  setselectedCollapseIndex(-1);
                  setselectedChildIndex(-1);
                }
                else {
                  setIsSelected(true);
                  setIsSelectedChild(false);
                  setselectedCollapseIndex(index);
                  setselectedChildIndex(-1);
                }
              }}
              style={styles.collapseItemFirst}
            >
              <AppText
                style={{
                  color: "grey",
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: PerfectFontSize(14),
                  marginLeft: 10,
                }}
              >
                {item.productGroup}
              </AppText>
              <FontAwesome
                name={
                  isSelected && selectedCollapseIndex == index
                    ? "chevron-down"
                    : "chevron-up"
                }
                color={"rgba(0, 0, 0, 0.3)"}
                size={18}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              borderWidth: 1,
              borderColor: AppColor.FD.Navy.Apricot,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppText
              style={{
                color: "grey",
                fontFamily: "Poppins_600SemiBold",
                fontSize: PerfectFontSize(14),
              }}
            >
              {
                item?.brands && item?.brands.reduce(function (acc: any, productGroup: { lackProducts: string | any[]; }) {
                  return acc + productGroup.lackProducts.length;
                }, 0)
              }
            </AppText>
          </View>
        </View>
        {isSelected &&
          selectedCollapseIndex == index &&
          renderDetails(item, index)}
      </View>
    );
  }

  const findReasonName = (productId: number) => {
    var selectedReasonName = "";

    if (reasonsData && reasonsData.length > 0) {
      var selected = selectedReasonIds.find((x) => x.index === productId);
      if (selected) {
        selectedReasonName = reasonsData.find(
          //@ts-ignore
          (x: any) => x.reasonId === selected.reasonId
        ).reasonName;
        return selectedReasonName;
      }
      else return ""
    }
    else return ""
  }

  const CompletionShortageRadioButton: React.FC<any> = (props) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => setSelectedAccessory((prev) => !prev)}
      >
        <View
          style={{
            width: 21,
            height: 21,
            borderRadius: 10.5,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ff8600",
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 7.5,
              backgroundColor:
                selectedAccessory === props.control ? "#ff8600" : "#fff",
            }}
          ></View>
        </View>
        <AppText selectable style={{ fontFamily: "Poppins_700Bold", color: "#fffff", marginLeft: 8, marginRight: 15, marginTop: 4 }}>
          {props.title}
        </AppText>
      </TouchableOpacity>
    );
  }

  const renderDetails = (item: any, index: any) => {
    if (item.brands) {
      return (
        <View>
          {item?.brands.map((x: any, index: any) => (
            <>
              <View
                key={index}
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedChildIndex === index) {
                        setIsSelectedChild(false);
                        setselectedChildIndex(-1);
                      } else {
                        setIsSelectedChild(true);
                        setselectedChildIndex(index);
                      }
                    }}
                    style={styles.collapseItem}
                  >
                    <AppText
                      style={{
                        color: "grey",
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: PerfectFontSize(14),
                        marginLeft: 10,
                      }}
                    >
                      {x.brand}
                    </AppText>
                    <FontAwesome
                      name={
                        isSelectedChild && selectedChildIndex === index
                          ? "chevron-down"
                          : "chevron-up"
                      }
                      color={"rgba(0, 0, 0, 0.3)"}
                      size={18}
                      style={{ marginRight: 10 }}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: "grey",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AppText
                    style={{
                      color: "grey",
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: PerfectFontSize(14),
                    }}
                  >
                    {x.lackProducts.length}
                  </AppText>
                </TouchableOpacity>
              </View>
              {isSelectedChild && selectedChildIndex === index ? (
                Platform.OS === "web" ? (
                  <>
                    {x?.lackProducts.map((y: any, index: any) => (
                      <View style={styles.flatList}>
                        <View style={{ flexDirection: "column" }}>
                          <View style={{ flexDirection: "row" }}>
                            <CheckBoxSales
                              checked={checkedItems.some((x) => x === y.id)}
                              onChangeChecked={() => {
                                toggleItemSelection(index, y.id);
                              }}
                              style={styles.flatListIconItem}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                setselectedPhoto(y.productImage);
                                setIsImageViewerVisible(true);
                              }}
                              style={styles.imageButton}
                            >
                              <Image
                                source={{ uri: y.productImage }}
                                style={styles.thumbnail}
                              />
                            </TouchableOpacity>
                            <ImageViewer
                              isVisible={isImageViewerVisible}
                              onClose={() => setIsImageViewerVisible(false)}
                              imageSource={selectedPhoto}
                            />
                            <Card
                              barcode={y.barcode}
                              productName={y.productName}
                              category={y.category}
                              productGroup={x.productGroup}
                              brand={y.brand}
                              gender={y.gender}
                              productColor={y.productColor}
                              productSize={y.productSize}
                              storeStock={y.storeStock}
                              createdDate={y.createdDate}
                            />
                          </View>
                          <View style={styles.flatListButtonView}>
                            <TouchableOpacity
                              style={styles.flatListButton}
                              onPress={() => {
                                setselectedItemId(y.id);
                                setShowStorePopup(true);
                              }}
                            >
                              <View
                                style={{
                                  flex: Platform.OS === "web" ? 1 : undefined,
                                  flexDirection: "row",
                                  paddingRight: 10,
                                }}
                              >
                                <AppText selectable style={styles.flatListText}>
                                  {findReasonName(y.id) !== ""
                                    ? findReasonName(y.id)
                                    : translate(
                                      "completionOfSalesShortageMainScreen.buttonTwo"
                                    )}
                                </AppText>
                              </View>
                              <MenuIconSales
                                color2={"#919191"}
                                color={AppColor.OMS.Background.Light}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    {x?.lackProducts.map((y: any, index: any) => (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 15,
                          }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            {y.productImage &&
                              y.productImage.includes("flo-logo.svg") ? (
                              <View style={styles.imageButton}>
                                <Image
                                  source={require("../../../assets/img/ui/flo-logo.png")}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    resizeMode: "contain",
                                  }}
                                />
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  setselectedPhoto(y.productImage);
                                  setIsImageViewerVisible(true);
                                }}
                                style={styles.imageButton}
                              >
                                <Image
                                  source={{ uri: y.productImage }}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 14,
                                    resizeMode: "contain",
                                  }}
                                />
                              </TouchableOpacity>
                            )}
                            <Card
                              barcode={y.barcode}
                              productName={y.productName}
                              category={y.category}
                              productGroup={y.productGroup}
                              brand={y.brand}
                              gender={y.gender}
                              productColor={y.productColor}
                              productSize={y.productSize}
                              storeStock={y.storeStock}
                              createdDate={y.createdDate}
                            />
                          </View>
                          <ImageViewer
                            isVisible={isImageViewerVisible}
                            onClose={() => setIsImageViewerVisible(false)}
                            imageSource={selectedPhoto}
                          />
                          <CheckBoxSales
                            checked={checkedItems.some((x) => x === y.id)}
                            onChangeChecked={() => {
                              toggleItemSelection(index, y.id);
                            }}
                            style={styles.flatListIconItem}
                          />
                        </View>
                        <View style={styles.flatListButtonView}>
                          <TouchableOpacity
                            style={styles.flatListButton}
                            onPress={() => {
                              setselectedItemId(y.id);
                              setShowStorePopup(true);
                            }}
                          >
                            <View
                              style={{
                                flex: Platform.OS === "web" ? 1 : undefined,
                                flexDirection: "row",
                                paddingRight: 10,
                              }}
                            >
                              <AppText selectable style={styles.flatListText}>
                                {findReasonName(y.id) !== ""
                                  ? findReasonName(y.id)
                                  : translate(
                                    "completionOfSalesShortageMainScreen.buttonTwo"
                                  )}
                              </AppText>
                            </View>
                            <MenuIconSales
                              color2={"#919191"}
                              color={AppColor.OMS.Background.Light}
                            />
                          </TouchableOpacity>
                        </View>
                      </>
                    ))}
                  </>
                )
              ) : (
                <></>
              )}
            </>
          ))}
        </View>
      );
    } else {
      return <></>;
    }
  };

  //#endregion

  //#region Main JSX
  return (
    <View style={styles.container} >
      <FloHeader
        headerType="standart"
        enableButtons={["back"]}
        headerTitle={translate("completionOfSalesShortageMainScreen.title")}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 15, height: 30 }}
      >
        <CompletionShortageRadioButton title={"AKSESUAR"} control={true} ></CompletionShortageRadioButton>
        {isInRole("omc-store-chief") &&
          <TouchableOpacity
            style={{ paddingVertical: 5, paddingHorizontal: 20, backgroundColor: AppColor.FD.Brand.Solid, borderRadius: 10 }}
            onPress={() => navigation.push('Completionofsalesshortage', { screen: "AlarmList" })}
          >
            <AppText style={{ color: "white", fontSize: PerfectFontSize(11) }}>
              {translate("completionOfSalesShortageAlarmScreen.menuButtonText")}
            </AppText>
          </TouchableOpacity>
        }
      </View>
      <View style={styles.input}>
        <TextInput
          placeholderTextColor={AppColor.FD.Text.Default}
          selectionColor={AppColor.FD.Brand.Solid}
          underlineColorAndroid={"transparent"}
          placeholder={translate("completionOfSalesShortageMainScreen.textInput")}
          keyboardType={"number-pad"}
          onChangeText={setBarcodeValue}
          value={barcodeValue}
          style={{ width: "100%", marginLeft: 10 }}
        />
        <AppButton
          activeOpacity={0.8}
          transparent
          onPress={() => {
            if (barcodeValue !== "") {
              setFilters()
            } else {
              openCamera()
            }
          }}
          style={styles.camera}
        >
          <View style={{ zIndex: 9999 }}>
            <SearchQR />
          </View>
          <View style={styles.qr}></View>
        </AppButton>
      </View>
      {Platform.OS === "web" ? (
        <ScrollView>
          <FlatList
            style={styles.InnerContainerWeb}
            data={productsTemp}
            renderItem={({ item, index }) =>
              renderCollapse(item, index)
            }
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => (
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <AppText style={{ color: "black", fontFamily: "Poppins_600SemiBold", fontSize: PerfectFontSize(14) }}>
                  {translate("completionOfSalesShortageMainScreen.notFound")}
                </AppText>
              </View>
            )}
          />
        </ScrollView>
      ) : (
        <ScrollView  >
          <FlatList
            style={styles.InnerContainer}
            data={productsTemp}
            renderItem={({ item, index }) =>
              renderCollapse(item, index)
            }
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => (
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <AppText style={{ color: "black", fontFamily: "Poppins_600SemiBold", fontSize: PerfectFontSize(14) }}>
                  {translate("completionOfSalesShortageMainScreen.notFound")}
                </AppText>
              </View>
            )}
          />
        </ScrollView>
      )}
      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          setBarcodeValue(barcode);
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />
      {showStorePopup && (
        <Popup
          onHide={() => setShowStorePopup(false)}
          reasonsData={reasonsData}
          selectedReasonId={
            selectedReasonIds.find((x) => x.index === selectedItemId)?.reasonId
          }
          onReasonSelect={(reasonCode) =>
            onReasonSelect(selectedItemId, reasonCode)
          }
          onRemove={onReasonRemove}
        />
      )}
      <View style={[styles.buttonView]}>
        <TouchableOpacity style={[styles.button, { height: 37, width: Platform.OS === "web" ? 350 : Dimensions.get("screen").width - 80 }]} onPress={createSales}>
          <AppText selectable style={styles.buttonText}>
            {translate("completionOfSalesShortageMainScreen.buttonOne")}
          </AppText>
        </TouchableOpacity>
      </View>
      {isLoading && <FloLoading />}
    </View >
  );
  //#endregion
};
export default CompletionOfSalesShortage;

//#region Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  InnerContainer: {
    marginHorizontal: 15,
    marginBottom: 30,
    shadowColor: AppColor.OMS.Background.Dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: AppColor.OMS.Background.Light,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  InnerContainerWeb: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    marginHorizontal: 15,
    marginBottom: 30,
    shadowColor: AppColor.OMS.Background.Dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: AppColor.OMS.Background.Light,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 15,
    marginTop: 30,
    marginBottom: 30,
    shadowColor: AppColor.OMS.Background.Dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: AppColor.OMS.Background.Light,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  comboBoxes: {
    height: 31,
    backgroundColor:
      Platform.OS === "web" ? undefined : AppColor.OMS.Background.Light,
    borderColor: AppColor.OMS.Background.Fundamental,
    borderWidth: 1,
    borderRadius: Platform.OS === "web" ? 12 : 10,
    alignItems: "center",
    justifyContent: Platform.OS === "web" ? "space-between" : "center",
    paddingHorizontal: 8,
    // marginBottom: 10,
    marginBottom: Platform.OS === "web" ? 20 : 0,
    flexDirection: "row",
    marginRight: Platform.OS === "web" ? 20 : 0,
  },
  input: {
    alignItems: Platform.OS === "web" ? "center" : undefined,
    flexDirection: Platform.OS === "web" ? "row" : undefined,
    justifyContent: Platform.OS === "web" ? "space-between" : "center",
    borderColor: "#b7b5b5",
    borderWidth: 1,
    height: 31,
    borderRadius: 10,
    marginHorizontal: Platform.OS === "web" ? 15 : 30,
    marginTop: Platform.OS === "web" ? 30 : 15,
    marginBottom: Platform.OS === "web" ? 30 : 30,
  },
  input2: {
    alignItems: Platform.OS === "web" ? "center" : undefined,
    flexDirection: Platform.OS === "web" ? "row" : undefined,
    justifyContent: Platform.OS === "web" ? "space-between" : "center",
    borderColor: "#b7b5b5",
    borderWidth: 1,
    height: 31,
    borderRadius: 10,
    paddingLeft: 20,
    marginHorizontal: Platform.OS === "web" ? undefined : 30,
    marginTop: Platform.OS === "web" ? 0 : 15,
    marginBottom: Platform.OS === "web" ? 15 : 30,
  },
  camera: {
    position: "absolute",
    right: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  qr: {
    width: Platform.OS === "web" ? 30 : 15,
    height: Platform.OS === "web" ? 30 : 15,
    position: "absolute",
    borderRadius: 30,
    backgroundColor: AppColor.OMS.Background.Light,
    shadowColor: AppColor.OMS.Background.Dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mobileView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginHorizontal: 15,
  },
  flatList: {
    justifyContent: Platform.OS === "web" ? undefined : "space-between",
    marginBottom: 20,
    marginHorizontal: 15,
    shadowColor: AppColor.OMS.Background.Dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: AppColor.OMS.Background.Light,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  flatListIconItem: {
    justifyContent: Platform.OS === "web" ? "center" : "flex-start",
    alignItems: Platform.OS === "web" ? "center" : "flex-end",
    marginLeft: Platform.OS === "web" ? 15 : 0,
    marginRight: Platform.OS === "web" ? 30 : 0,
  },
  imageButton: {
    height: Platform.OS === "web" ? 100 : 80,
    width: Platform.OS === "web" ? 100 : 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 4,
    borderColor: "#b7b5b5",
  },
  thumbnail: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  flatListButtonView: {
    alignItems: "flex-end",
    marginTop: Platform.OS === "web" ? undefined : 10,
    marginBottom: 20
  },
  flatListButton: {
    height: 31,
    width: Platform.OS === "web" ? 290 : 270,
    borderStyle: "solid",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: Platform.OS === "web" ? 15 : 10,
    borderColor: AppColor.FD.Text.Default,
    borderRadius: 12,
  },
  flatListText: {
    fontFamily: "Poppins_700Bold",
    fontSize: PerfectFontSize(12),
    textAlign: "center",
    color: AppColor.OMS.Background.Fundamental,
  },
  buttonView: {
    position: "absolute",
    bottom: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 13,
    width: "100%"
  },
  button: {
    height: 37,
    width: 310,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColor.OMS.Background.Fundamental,
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: PerfectFontSize(14),
    color: AppColor.OMS.Background.Light,
  },
  collapseItemFirst: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: AppColor.FD.Navy.Apricot,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  collapseItem: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
//#endregion

import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Platform, TouchableOpacity, FlatList, StyleSheet, Text } from "react-native";
import { FloHeader } from "../../../src/components/Header";
import { translate } from "../../../src/helper/localization/locaizationMain";
import ComboboxSales from "../../../src/components/CompletionOfSalesShortage/ComboboxSales";
import { AppText } from "@flomagazacilik/flo-digital-components";
import { PerfectFontSize } from "../../../src/helper/PerfectPixel";
import DateTimePicker from "../../../src/components/CompletionOfSalesShortage/DateTimePicker";
import CheckBoxSales from "../../../src/components/CompletionOfSalesShortage/CheckBoxSales";
import { AppColor } from "../../theme/AppColor";
import FloLoading from "../../../src/components/FloLoading";
import { useCompletionOfSalesShortageService } from "../../contexts/CompletionOfSalesShortageService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";

const CompletionOfSalesShortageExecutive: React.FC = () => {
  //#region Variable
  const { categoriesData, productGroupsData, brandsData, gendersData, getCategories, getProductGroups, getBrands, getGenders, getGeniusSales, createLackProductOrderList } = useCompletionOfSalesShortageService();
  const { show } = useMessageBoxService()
  const isFocused = useIsFocused();
  const [products, setProducts] = useState<any[]>([]);
  const [productsTemp, setProductsTemp] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);
  const [selectedGenderId, setSelectedGenderId] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | string>(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState<Date | string>(new Date().toISOString().substring(0, 10));
  const [startTime, setStartTime] = useState<Date | string>("00:00");
  const [endTime, setEndTime] = useState<Date | string>("23:59");
  const [selectedCheckItemId, setSelectedCheckItemId] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //#endregion

  //#region useEffect
  //Sayfaya ilk tıklandığında seçimleri temizleyip tüm servislere istek atıyorum.
  //getGeniusSales için ise sayfa ilk açıldığında parametresiz istek yapıp(tüm verileri çekip), onun içinden sadece bugün tarihli olanları ekrana basıyorum ve tüm liste seçili geliyor.
  useEffect(() => {
    if (isFocused) {
      setSelectedCheckItemId([]);
      setIsLoading(true)
      setStartDate(new Date().toISOString().substring(0, 10))
      setEndDate(new Date().toISOString().substring(0, 10));
      setStartTime("00:00");
      setEndTime("23:59");
      const tempStartDate = formatDateTimeToCustomFormat(new Date().toISOString().substring(0, 10), "00:00");
      const tempEndDate = formatDateTimeToCustomFormat(new Date().toISOString().substring(0, 10), "23:59");
      setSelectedCategoryId(undefined);
      setSelectedProductId(undefined);
      setSelectedBrandId(undefined);
      setSelectedGenderId(undefined);
      setProducts([]);
      setProductsTemp([]);
      getCategories();
      getProductGroups();
      getBrands();
      getGenders();
      getGeniusSales(tempStartDate, tempEndDate)
        .then((res) => {
          const initialSelectedItems = res && res.map((_: number, index: number) => index);
          setProductsTemp(res);
          setProducts(res);
          setSelectedCheckItemId(initialSelectedItems);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error fetching data:", error);
        });
    };
  }, [isFocused]);
  //#endregion

  //#region Transformed category, product group, gender methods
  //getCategories, getProductGroups, getGenders servislerinden string olarak dönen response'u ombolardan yapılan seçimi yakalamada kullanmak için değişkenlere atıyorum.
  const transformedCategories =
    categoriesData === undefined
      ? []
      : categoriesData.map((category: any, index: any) => ({
        id: index.toString(),
        categoryName: category
      }));

  const transformedProductGroups =
    productGroupsData === undefined
      ? []
      : productGroupsData.map((productGroup: any, index: any) => ({
        id: index.toString(),
        productGroupName: productGroup
      }));

  const transformedBrands =
    brandsData === undefined
      ? []
      : brandsData.map((brand: any, index: any) => ({
        id: index.toString(),
        brandName: brand
      }));

  const transformedGenders =
    gendersData === undefined
      ? []
      : gendersData.map((gender: any, index: any) => ({
        id: index.toString(),
        genderName: gender
      }));
  //#endregion

  //#region Method that captures category, product, brand selection
  //Combolardan yapılan seçime göre filtreleme yapıyp listeyi güncelliyorum. Filtreleme için yazdığım metodu, combolarda yapılan seçim her değiştiğinde çalıştırıyorum.
  useEffect(() => {
    setFilters();
  }, [selectedCategoryId, selectedBrandId, selectedGenderId, selectedProductId]);

  const onCategorySelected = (selectedCategory: any) => {
    if (selectedCategory?.categoryName) {
      setSelectedCategoryId(selectedCategory.categoryName);
    } else {
      setSelectedCategoryId(undefined);
    };
  };

  const onProductSelected = (selectedProduct: any) => {
    if (selectedProduct?.productGroupName) {
      setSelectedProductId(selectedProduct.productGroupName);
    } else {
      setSelectedProductId(undefined);
    };
  };

  const onBrandSelected = (selectedBrand: any) => {
    if (selectedBrand?.brandName) {
      setSelectedBrandId(selectedBrand.brandName);
    } else {
      setSelectedBrandId(undefined);
    };
  };

  const onGenderSelected = (selectedGender: any) => {
    if (selectedGender?.genderName) {
      setSelectedGenderId(selectedGender.genderName);
    } else {
      setSelectedGenderId(undefined);
    };
  };

  const setFilters = () => {
    setSelectedCheckItemId([]);

    let filteredData = products;

    if (selectedCategoryId) {
      filteredData = products ? products.filter((x: any) => x.category == selectedCategoryId) : []
    };
    if (selectedProductId && filteredData?.length > 0) {
      filteredData = filteredData.filter(x => x.productGroup == selectedProductId);
    };
    if (selectedBrandId && filteredData?.length > 0) {
      filteredData = filteredData.filter(x => x.brand == selectedBrandId);
    };
    if (selectedGenderId && filteredData?.length > 0) {
      filteredData = filteredData.filter(x => x.gender == selectedGenderId);
    };
    const initialSelectedItems = filteredData.map((_: number, index: number) => index);
    setSelectedCheckItemId(initialSelectedItems);
    setProductsTemp(filteredData);
  };
  //#endregion

  //#region Search button method
  //Ara butonuna basınca kullanıcının datetimepicker da seçtiği "dd-mm-yyyy" formatındaki tarih serviste "2021-12-31T07:39:40.847Z" formatında olduğu için bu formata çeviriyorum.
  //Daha sonra bütün seçimleri sıfırlayıp servise tarihe göre filtrelenmiş data için istek atıyorum.
  const stringToDate = (dateString: any) => {
    if (!dateString) return null;
    if (dateString.length === "gg.aa.yyyy".length) {
      const splitted = dateString.split(".");
      const date = new Date(`${splitted[2]}-${splitted[1]}-${splitted[0]}`);
      return date;
    };
    return null;
  };

  const formatDateToCustomFormat = (date: any) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateTimeToCustomFormat = (date: any, time: any) => {
    if (!date || !time) return "";
    const formattedDate = `${date}T${time}:00`;
    return formattedDate;
  };
  const tarihFormatiniCevir = (tarih: any) => {
    const parcalanmisTarih = tarih.split('.'); // Tarihi "." karakterine göre böler
    if (parcalanmisTarih.length === 3) {
      const [gun, ay, yil] = parcalanmisTarih;
      // Yıl, ay ve günü "-" karakteriyle birleştirir ve yeni bir tarih oluşturur
      const yeniTarih = `${yil}-${ay}-${gun}`;
      return yeniTarih;
    } else {
      return 'Geçersiz Tarih';
    }
  }

  const search = () => {
    setProducts([]);
    setProductsTemp([])
    setSelectedCheckItemId([]);
    let StartDate = ""
    let EndDate = ""
    let tempStartDate = ""
    let tempEndDate = ""
    if (Platform.OS == "web") {
      StartDate = formatDateToCustomFormat(stringToDate(startDate));
      tempStartDate = formatDateTimeToCustomFormat(StartDate, startTime);
      EndDate = formatDateToCustomFormat(stringToDate(endDate));
      tempEndDate = formatDateTimeToCustomFormat(EndDate, endTime);
    } else {
      let start = null
      let finish = null
      if (startDate.toString().includes(".")) {
        start = tarihFormatiniCevir(startDate.toString().replaceAll("-", "."))
      }
      if (endDate.toString().includes(".")) {
        finish = tarihFormatiniCevir(endDate.toString().replaceAll("-", "."))

      }
      // StartDate = formatDateToCustomFormat(stringToDate(a ? a : startDate));
      // tempStartDate = formatDateTimeToCustomFormat(StartDate, startTime);
      // EndDate = formatDateToCustomFormat(stringToDate(b ? b : endDate));
      // tempEndDate = formatDateTimeToCustomFormat(EndDate, endTime);
      tempStartDate = formatDateTimeToCustomFormat(start ?? startDate, startTime);
      tempEndDate = formatDateTimeToCustomFormat(finish ?? endDate, endTime);
    }



    setIsLoading(true);
    getGeniusSales(tempStartDate, tempEndDate)
      .then((res) => {
        // const initialSelectedItems = res && res.map((_: number, index: number) => index);
        setFiltersRes(res);
        setProducts(res);
        // setSelectedCheckItemId(initialSelectedItems);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  };
  //#endregion
  const setFiltersRes = (value: any[]) => {
    setSelectedCheckItemId([]);

    if (value && value.length > 0) {
      let filteredData = value;

      if (selectedCategoryId) {
        filteredData = value ? value.filter((x: any) => x.category == selectedCategoryId) : []
      };
      if (selectedProductId && filteredData?.length > 0) {
        filteredData = filteredData.filter(x => x.productGroup == selectedProductId);
      };
      if (selectedBrandId && filteredData?.length > 0) {
        filteredData = filteredData.filter(x => x.brand == selectedBrandId);
      };
      if (selectedGenderId && filteredData?.length > 0) {
        filteredData = filteredData.filter(x => x.gender == selectedGenderId);
      };
      const initialSelectedItems = filteredData.map((_: number, index: number) => index);
      setSelectedCheckItemId(initialSelectedItems);
      setProductsTemp(filteredData);
    }
  };

  //#region Create sales method
  //Listenin seçili olup olmama yani checkli olup olmama durumunu kontrol ediyorum.
  //Sonra seçili olan liste/listelerden bir data yaratıp liste şeklinde servise yolluyorum.
  //Dönen response'a göre seçili işlemleri boşaltıp, listeyi güncel haliyle tekrar çekip güncelliyorum. 
  const toggleItemSelection = (index: number) => {
    if (selectedCheckItemId.some((x) => x === index)) {
      var newIds = selectedCheckItemId.filter((x) => x !== index);
      setSelectedCheckItemId(newIds);
    } else {
      setSelectedCheckItemId([...selectedCheckItemId, index]);
    };
  };

  const createSales = async (data: any[]) => {
    var data = [];
    selectedCheckItemId.forEach((x) => {
      if (productsTemp?.length > 0) {
        data.push({
          storeId: productsTemp[x].storeId,
          barcode: productsTemp[x].barcode,
          gender: productsTemp[x].gender,
          productGroup: productsTemp[x].productGroup,
          category: productsTemp[x].category,
          subCategory: productsTemp[x].subCategory,
          productColor: productsTemp[x].productColor,
          productSize: productsTemp[x].productSize,
          salesDateTime: productsTemp[x].salesDateTime,
          salesId: productsTemp[x].salesId,
          productName: productsTemp[x].productName,
          brand: productsTemp[x].brand,
        });
      };
    });
    createLackProductOrderList(data);
    data.length > 0 ? show(translate("warehouseRequest.operationSuccessfully")) : show(translate("warehouseRequest.notFoundProduct"));
    setSelectedCheckItemId([]);
    const StartDate = formatDateToCustomFormat(stringToDate(startDate));
    const tempStartDate = formatDateTimeToCustomFormat(StartDate, startTime);
    const EndDate = formatDateToCustomFormat(stringToDate(endDate));
    const tempEndDate = formatDateTimeToCustomFormat(EndDate, endTime);
    setIsLoading(true);
    getGeniusSales(tempStartDate, tempEndDate)
      .then((salesData) => {
        // const initialSelectedItems = salesData.map((_: number, index: number) => index);
        setFiltersRes(salesData);
        setProducts(salesData);
        // setSelectedCheckItemId(initialSelectedItems);
        setIsLoading(false);
      });
  };
  //#endregion

  //#region flatlist method
  //servisten 2021-12-31T07:39:40.847Z fromatında gelen tarihi dd.mm.yyyy fomratına çevirip ekrana basıyorum.
  const formatTarih = (tarih: Date) => {
    const tarihObjesi = new Date(tarih);

    const gun = tarihObjesi.getDate();
    const ay = tarihObjesi.getMonth() + 1;
    const yil = tarihObjesi.getFullYear();

    const saat = tarihObjesi.getHours();
    const dakika = tarihObjesi.getMinutes();

    const gunStr = String(gun).padStart(2, "0");
    const ayStr = String(ay).padStart(2, "0");

    const saatStr = String(saat).padStart(2, "0");
    const dakikaStr = String(dakika).padStart(2, "0");

    const formatliTarih = `${gunStr}.${ayStr}.${yil} ${saatStr}:${dakikaStr}`;

    return formatliTarih;
  };

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
      salesDateTime
    } = props;

    const trimmedProductName = productName.length > 48 ? productName.substring(0, 48) + "..." : productName;

    return (
      <View style={{ marginLeft: Platform.OS === "web" ? 30 : 0 }}>
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
              {category}{" "}{productGroup}
            </AppText>
            <AppText selectable style={{ fontFamily: "Poppins_500Medium", color: AppColor.OMS.Background.Dark, fontSize: PerfectFontSize(12) }}>
              {brand}{" "}{gender}
            </AppText>
          </>
        )}
        <AppText selectable style={{ fontFamily: "Poppins_700Bold", color: AppColor.FD.Text.Ash, fontSize: PerfectFontSize(12) }}>
          {translate("completionOfSalesShortageMainScreen.color")}{" "}
          {productColor}
          {"  "}
          {translate("completionOfSalesShortageMainScreen.size")}{" "}
          {productSize}
        </AppText>
        <AppText selectable style={{ fontFamily: "Poppins_500Medium", color: AppColor.FD.Text.Ash, fontSize: PerfectFontSize(12) }}>
          {translate("completionOfSalesShortageMainScreen.date")}{" "}
          {formatTarih(salesDateTime)}
        </AppText>
      </View>
    )
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.flatList}>
      {Platform.OS === "web" ? (
        <View style={{ flexDirection: "row" }}>
          {selectedCheckItemId?.length &&
            <CheckBoxSales
              checked={selectedCheckItemId.some((x) => x === index)}
              onChangeChecked={() => toggleItemSelection(index)}
              style={styles.flatListIconItem}
            />}
          <Card barcode={item.barcode} productName={item.productName} category={item.category} productGroup={item.productGroup} brand={item.brand} gender={item.gender} productColor={item.productColor} productSize={item.productSize} salesDateTime={item.salesDateTime} />
        </View>
      ) : (
        <>
          <Card barcode={item.barcode} productName={item.productName} category={item.category} productGroup={item.productGroup} brand={item.brand} gender={item.gender} productColor={item.productColor} productSize={item.productSize} salesDateTime={item.salesDateTime} />
          <CheckBoxSales
            checked={selectedCheckItemId.some((x) => x === index)}
            onChangeChecked={() => toggleItemSelection(index)}
            style={styles.flatListIconItem}
          />
        </>
      )}
    </View>
  );
  //#endregion

  //#region Main JSX
  return (
    <View style={styles.container}>
      <FloHeader
        headerType="standart"
        enableButtons={["back"]}
        headerTitle={translate("completionOfSalesShortageMainScreen.titleTwo")}
      />
      {Platform.OS === "web" ? (
        <View style={styles.categories}>
          <ComboboxSales
            placeholder={translate("completionOfSalesShortageMainScreen.comboBoxOne")}
            data={transformedCategories}
            keyProp="id"
            valueProp="categoryName"
            textColor={AppColor.OMS.Background.Fundamental}
            containerStyle={[styles.comboBoxes, { height: 31, width: 200 }]}
            fontSize={PerfectFontSize(12)}
            onSelectItem={onCategorySelected}
            showClearButton={true}
            swipeClose={false}
            selectedItem={selectedCategoryId}
          />
          <ComboboxSales
            placeholder={translate("completionOfSalesShortageMainScreen.comboBoxTwo")}
            data={transformedProductGroups}
            keyProp="id"
            valueProp="productGroupName"
            textColor={AppColor.OMS.Background.Fundamental}
            containerStyle={[styles.comboBoxes, { height: 31, width: 200 }]}
            fontSize={PerfectFontSize(12)}
            onSelectItem={onProductSelected}
            showClearButton={true}
            swipeClose={false}
            selectedItem={selectedProductId}
          />
          <ComboboxSales
            placeholder={translate("completionOfSalesShortageMainScreen.comboBoxThree")}
            data={transformedBrands}
            keyProp="id"
            valueProp="brandName"
            textColor={AppColor.OMS.Background.Fundamental}
            containerStyle={[styles.comboBoxes, { height: 31, width: 200 }]}
            fontSize={PerfectFontSize(12)}
            onSelectItem={onBrandSelected}
            showClearButton={true}
            swipeClose={false}
            selectedItem={selectedBrandId}
          />
          <ComboboxSales
            placeholder={translate("completionOfSalesShortageMainScreen.comboBoxFour")}
            data={transformedGenders}
            keyProp="id"
            valueProp="genderName"
            textColor={AppColor.OMS.Background.Fundamental}
            containerStyle={[styles.comboBoxes, { height: 31, width: 200 }]}
            fontSize={PerfectFontSize(12)}
            onSelectItem={onGenderSelected}
            showClearButton={true}
            swipeClose={false}
            selectedItem={selectedGenderId}
          />
          <DateTimePicker
            onDateConfirm={setStartDate}
            onTimeConfirm={setStartTime}
            text={translate("completionOfSalesShortageMainScreen.start")}
            defaultDate={startDate}
            defaultTime={startTime}
          />
          <DateTimePicker
            onDateConfirm={setEndDate}
            onTimeConfirm={setEndTime}
            text={translate("completionOfSalesShortageMainScreen.end")}
            defaultDate={endDate}
            defaultTime={endTime}
          />
          <TouchableOpacity style={[styles.button, { paddingHorizontal: 100 }]} onPress={search}>
            <AppText selectable style={styles.buttonText}>
              {translate("completionOfSalesShortageMainScreen.buttonThree")}
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={[styles.mobileView, { marginVertical: 20 }]}>
            <ComboboxSales
              placeholder={translate("completionOfSalesShortageMainScreen.comboBoxOne")}
              data={transformedCategories}
              keyProp="id"
              valueProp="categoryName"
              textColor={AppColor.OMS.Background.Fundamental}
              containerStyle={styles.comboBoxes}
              fontSize={PerfectFontSize(11)}
              onSelectItem={onCategorySelected}
              showClearButton={true}
              swipeClose={false}
              selectedItem={selectedCategoryId}
              width={"48%"}
            />
            <ComboboxSales
              placeholder={translate("completionOfSalesShortageMainScreen.comboBoxTwo")}
              data={transformedProductGroups}
              keyProp="id"
              valueProp="productGroupName"
              textColor={AppColor.OMS.Background.Fundamental}
              containerStyle={styles.comboBoxes}
              fontSize={PerfectFontSize(11)}
              onSelectItem={onProductSelected}
              showClearButton={true}
              swipeClose={false}
              selectedItem={selectedProductId}
              width={"48%"}
            />
          </View>
          <View style={[styles.mobileView, { marginBottom: 20 }]}>
            <ComboboxSales
              placeholder={translate("completionOfSalesShortageMainScreen.comboBoxThree")}
              data={transformedBrands}
              keyProp="id"
              valueProp="brandName"
              textColor={AppColor.OMS.Background.Fundamental}
              containerStyle={styles.comboBoxes}
              fontSize={PerfectFontSize(11)}
              onSelectItem={onBrandSelected}
              showClearButton={true}
              swipeClose={false}
              selectedItem={selectedBrandId}
              width={"48%"}
            />
            <ComboboxSales
              placeholder={translate("completionOfSalesShortageMainScreen.comboBoxFour")}
              data={transformedGenders}
              keyProp="id"
              valueProp="genderName"
              textColor={AppColor.OMS.Background.Fundamental}
              containerStyle={styles.comboBoxes}
              fontSize={PerfectFontSize(11)}
              onSelectItem={onGenderSelected}
              showClearButton={true}
              swipeClose={false}
              selectedItem={selectedGenderId}
              width={"48%"}
            />
          </View>
          <View style={[styles.mobileView, { marginBottom: 20 }]}>
            <DateTimePicker
              onDateConfirm={setStartDate}
              onTimeConfirm={setStartTime}
              text={translate("completionOfSalesShortageMainScreen.start")}
              defaultDate={startDate}
              defaultTime={startTime}
              isStart
            />
            <DateTimePicker
              onDateConfirm={setEndDate}
              onTimeConfirm={setEndTime}
              text={translate("completionOfSalesShortageMainScreen.end")}
              defaultDate={endDate}
              defaultTime={endTime}
              isEnd
            />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 20, marginHorizontal: 15 }}>
            <TouchableOpacity style={[styles.button, { width: "100%", borderRadius: 10 }]} onPress={search}>
              <AppText selectable style={styles.buttonText}>
                {translate("completionOfSalesShortageMainScreen.buttonThree")}
              </AppText>
            </TouchableOpacity>
          </View>
        </>
      )}
      <FlatList
        data={productsTemp}
        renderItem={({ item, index }) => {
          return renderItem({ item: item, index: index });
        }}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <AppText style={{ color: "black", fontFamily: "Poppins_600SemiBold", fontSize: PerfectFontSize(14) }}>
              {translate("completionOfSalesShortageMainScreen.notFound")}
            </AppText>
          </View>
        )}

      />
      <View style={styles.buttonView}>
        <TouchableOpacity style={[styles.button, { height: 37, width: Platform.OS === "web" ? 270 : "100%" }]}
          //@ts-ignore
          onPress={createSales}
        >
          <AppText style={[styles.buttonText, { color: AppColor.OMS.Background.Light }]}>{translate("completionOfSalesShortageMainScreen.buttonFour")}</AppText>
        </TouchableOpacity>
      </View>
      {isLoading && <FloLoading />}
    </View>
  );
  //#endregion
};
export default CompletionOfSalesShortageExecutive;

//#region Style
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  categories: {
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    marginHorizontal: 15,
    marginTop: 30,
    marginBottom: 30,
    shadowColor: AppColor.OMS.Background.Dark,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: AppColor.OMS.Background.Light,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20
  },
  comboBoxes: {
    height: 31,
    backgroundColor: Platform.OS === "web" ? undefined : AppColor.OMS.Background.Light,
    borderColor: AppColor.OMS.Background.Fundamental,
    borderWidth: 1,
    borderRadius: Platform.OS === "web" ? 12 : 10,
    alignItems: "center",
    justifyContent: Platform.OS === "web" ? "space-between" : "center",
    paddingHorizontal: 8,
    marginBottom: Platform.OS === "web" ? 10 : 0,
    flexDirection: "row",
    marginRight: Platform.OS === "web" ? 20 : 0,
  },
  button: {
    height: 31,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColor.OMS.Background.Fundamental,
    borderRadius: 20,
    marginBottom: 10,

  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: PerfectFontSize(14),
    color: AppColor.OMS.Background.Light
  },
  mobileView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  flatList: {
    flexDirection: "row",
    justifyContent: Platform.OS === "web" ? undefined : "space-between",
    marginBottom: 20,
    marginHorizontal: 15,
    shadowColor: AppColor.OMS.Background.Dark,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: AppColor.OMS.Background.Light,
    paddingVertical: 12,
    paddingHorizontal: 15
  },
  flatListIconItem: {
    justifyContent: Platform.OS === "web" ? "center" : "flex-start",
    alignItems: Platform.OS === "web" ? "center" : "flex-end",
    marginLeft: Platform.OS === "web" ? 30 : 0
  },
  buttonView: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 13,
    marginHorizontal: 50
  }
});
//#endregion

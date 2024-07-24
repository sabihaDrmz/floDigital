import BlurView from "../../components/BlurView";
import {
  AppButton,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { FloHeader } from "../../components/Header";
import QrSearchBar from "../../components/IdesComponents/QrSearchBar";
import ErFicheHeader from "../../components/IdesComponents/ErFicheHeader";
import ProductCard from "../../components/IdesComponents/ProductCard";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useEasyReturnService } from "../../contexts/EasyReturnService";

const ReturnFicheProductList: React.FC = (props) => {
  const { getAllEasyReasons, allEasyReturnReasons } = useApplicationGlobalService();
  const { show } = useMessageBoxService();
  const {
    erCurrentFiche,
    erSelectedReturnProducts,
    isLoading,
    ErMakeTransaction,
  } = useEasyReturnService();
  useEffect(() => {
    getAllEasyReasons();
  });
  const [selectedCombo, setSelectedCombo] = useState<
    { barcode: string; combo: any; quantit: number }[]
  >([]),
    [showPopup, setShowPopup] = useState(false),
    [popupItem, setPopupItem] = useState(""),
    [popupType, setPopupType] = useState(1),
    [popupMaxQuantity, setMaxQuantityPopup] = useState(1),
    PushBarcode = (barcode: string, quantit: number = 1) => {
      if (
        erCurrentFiche === undefined ||
        erCurrentFiche === null ||
        erCurrentFiche.data.findIndex(
          (x) => x.barcode === barcode
        ) < 0
      ) {
        show("Lütfen geçerli bir ürün barkodu yazın.");
        return;
      }

      let tempBarcodeList = selectedCombo;

      if (
        tempBarcodeList &&
        tempBarcodeList.findIndex((x) => x.barcode === barcode) < 0
      )
        tempBarcodeList.push({ barcode, combo: "", quantit });

      setSelectedCombo(tempBarcodeList);

      //TODO: bu bir constant olduğu için bu şekilde bir setleme yapılmaz. CLI geçişinde yorum satırına aldım. ihtiyac varsa düzeltilmeli
      // erSelectedReturnProducts = tempBarcodeList;
    },
    GetQuantityPopup = (maxQuantity: number) => {
      let model: any[] = [];
      for (var i = 1; i <= maxQuantity; i++) {
        model.push(
          <AppButton
            onPress={() => {
              setShowPopup(false);
              let temp = selectedCombo;
              let index = temp.findIndex((x) => x.barcode === popupItem);

              if (index !== -1) {
                temp[index].quantit = i;
              }

              setSelectedCombo(temp);
              //TODO: bu bir constant olduğu için bu şekilde bir setleme yapılmaz. CLI geçişinde yorum satırına aldım. ihtiyac varsa düzeltilmeli
              //  erSelectedReturnProducts = temp;
            }}
            transparent
            style={{
              height: 30,
              justifyContent: "flex-start",
              paddingHorizontal: 20,
            }}
          >
            <AppText selectable>{i}</AppText>
          </AppButton>
        );
      }

      return model;
    },
    InfoMessage: React.FC = () => {
      return (
        <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
          <View
            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "rgb(228 ,228 ,228)",
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ marginRight: 10 }}>
              <Image
                source={require("../../assets/crmi.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>
            <AppText
              size={FontSizes.S}
              style={{
                width: Dimensions.get("window").width - 80,
              }}
            >
              Kullanılmamış ve etiketleri kesilmemiş ürünlerinizin değişimini
              gerçekleştirdiğinize dikkat ediniz
            </AppText>
          </View>
        </View>
      );
    };
  return (
    <View style={styles.container}>
      <FloHeader
        headerType="standart"
        headerTitle="İade Ürün Listesi"
        enableButtons={["back"]}
      />
      <ScrollView>
        <Observer>
          {() => {
            let data = erCurrentFiche;
            if (data === undefined || data === null) return null;

            return (
              <>
                <ErFicheHeader
                  {...{
                    ficheNumber: data.ficheKey,
                    storeNum: data.storeNumber,
                    customerName: data.customerName,
                    customerPhone: data.customerPhone,
                    ficheTotal: data.totalPrice,
                    createData: data.ficheDate,
                  }}
                />
                <InfoMessage />
                <QrSearchBar
                  onSearch={(barcode: string) => {
                    if (barcode) PushBarcode(barcode);
                  }}
                />
                <FlatList
                  style={{ marginTop: 20, paddingTop: 10 }}
                  data={data.data.filter((x) =>
                    erSelectedReturnProducts
                      ?.map((y) => y.barcode)
                      .includes(x.barcode)
                  )}
                  keyExtractor={(item, index) => `${index}-${item.barcode}`}
                  renderItem={({ item }) => (
                    <ProductCard
                      {...item}
                      onOpenCombo={() => {
                        setShowPopup(true);
                        setPopupItem(item.barcode);
                        setPopupType(1);
                      }}
                      onOpenQuantity={() => {
                        setPopupType(2);
                        setShowPopup(true);
                        setMaxQuantityPopup(Number(item.quantity));
                      }}
                      selectedCombo={
                        erSelectedReturnProducts.find(
                          (x) => x.barcode === item.barcode
                        )?.combo.name
                      }
                      selQuantity={
                        erSelectedReturnProducts.find(
                          (x) => x.barcode === item.barcode
                        )?.quantit
                      }
                      showCombo
                    />
                  )}
                />
                <View style={{ marginHorizontal: 20 }}>
                  <AppText
                    selectable
                    style={{
                      marginBottom: 10,
                      fontFamily: "Poppins_300Light_Italic",
                      marginLeft: 20,
                    }}
                  >
                    {erSelectedReturnProducts.reduce(
                      (x, y) => x + y.quantit,
                      0
                    )}{" "}
                    Ürün ile devam Edilecek
                  </AppText>
                  <AppButton
                    onPress={() => {
                      if (
                        !erSelectedReturnProducts ||
                        erSelectedReturnProducts.length < 1
                      ) {
                        show(
                          "İade edilecek ürünler seçilmeden bir sonraki aşamaya geçilemez."
                        );
                        return;
                      }
                      ErMakeTransaction();
                    }}
                    loading={isLoading}
                    buttonColorType={ColorType.Brand}
                    title="Devam Et"
                  />
                </View>
              </>
            );
          }}
        </Observer>
      </ScrollView>
      <SafeAreaView />
      {showPopup && (
        <BlurView
          style={{
            position: "absolute",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            <View
              style={{
                minHeight: 100,
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 10,
              }}
            >
              {popupType === 1 && (
                <FlatList
                  style={{ marginTop: 10 }}
                  data={allEasyReturnReasons.filter(
                    (x) => !x.name.includes("Arızalı ürün")
                  )}
                  renderItem={({ item }) => (
                    <AppButton
                      onPress={() => {
                        setShowPopup(false);
                        let temp = selectedCombo;
                        let index = temp.findIndex(
                          (x) => x.barcode === popupItem
                        );

                        if (index !== -1) {
                          temp[index].combo = item;
                        }

                        setSelectedCombo(temp);
                        //TODO: bu bir constant olduğu için bu şekilde bir setleme yapılmaz. CLI geçişinde yorum satırına aldım. ihtiyac varsa düzeltilmeli
                        //   erSelectedReturnProducts = temp;
                      }}
                      transparent
                      style={{
                        height: 30,
                        justifyContent: "flex-start",
                        paddingHorizontal: 20,
                      }}
                    >
                      <AppText selectable>{item.name}</AppText>
                    </AppButton>
                  )}
                  keyExtractor={(x) => x.id.toString()}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#e4e4e4",
                        marginHorizontal: 30,
                        marginBottom: 10,
                      }}
                    />
                  )}
                />
              )}
              {popupType === 2 ? (
                <ScrollView>{GetQuantityPopup(popupMaxQuantity)}</ScrollView>
              ) : null}
            </View>
          </View>
        </BlurView>
      )}
    </View>
  );
};
export default ReturnFicheProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

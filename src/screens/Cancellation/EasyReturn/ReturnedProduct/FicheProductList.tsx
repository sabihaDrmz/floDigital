import BlurView from "../../../../components/BlurView";
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
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FloHeader } from "../../../../components/Header";
import ApplicationGlobalService from "../../../../core/services/ApplicationGlobalService";
import EasyReturnService from "../../../../core/services/EasyReturnService";
import MessageBoxNew from "../../../../core/services/MessageBoxNew";
import ErFicheHeader from "../SharedElements/ErFicheHeader";
import ProductCard from "../SharedElements/ProductCard";
import QrSearchBar from "../SharedElements/QrSearchBar";

const InfoMessage: React.FC = (props) => {
  useEffect(() => {
    ApplicationGlobalService.getAllEasyReasons();
  });
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
            source={require("../../../../../assets/crmi.png")}
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
const FicheProductList: React.FC = (props) => {
  const [selectedCombo, setSelectedCombo] = useState<
    { barcode: string; combo: any; quantit: number }[]
  >([]);

  const PushBarcode = (barcode: string, quantit: number = 1) => {
    if (
      EasyReturnService.erCurrentFiche === undefined ||
      EasyReturnService.erCurrentFiche === null ||
      EasyReturnService.erCurrentFiche.data.findIndex(
        (x) => x.barcode === barcode
      ) < 0
    ) {
      MessageBoxNew.show("Lütfen geçerli bir ürün barkodu yazın.");
      return;
    }

    let tempBarcodeList = selectedCombo;

    if (
      tempBarcodeList &&
      tempBarcodeList.findIndex((x) => x.barcode === barcode) < 0
    )
      tempBarcodeList.push({ barcode, combo: "", quantit });

    setSelectedCombo(tempBarcodeList);

    EasyReturnService.erSelectedReturnProducts = tempBarcodeList;
  };

  const [showPopup, setShowPopup] = useState(false);
  const [popupItem, setPopupItem] = useState("");
  const [popupType, setPopupType] = useState(1);
  const [popupMaxQuantity, setMaxQuantityPopup] = useState(1);

  const GetQuantityPopup = (maxQuantity: number) => {
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
            EasyReturnService.erSelectedReturnProducts = temp;
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
            let data = EasyReturnService.erCurrentFiche;
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
                  onSearch={(barcode: string) => PushBarcode(barcode)}
                />
                <FlatList
                  style={{ marginTop: 20, paddingTop: 10 }}
                  data={data.data.filter((x) =>
                    EasyReturnService.erSelectedReturnProducts
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
                        EasyReturnService.erSelectedReturnProducts.find(
                          (x) => x.barcode === item.barcode
                        )?.combo.name
                      }
                      selQuantity={
                        EasyReturnService.erSelectedReturnProducts.find(
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
                    {EasyReturnService.erSelectedReturnProducts.reduce(
                      (x, y) => x + y.quantit,
                      0
                    )}{" "}
                    Ürün ile devam Edilecek
                  </AppText>
                  <AppButton
                    onPress={() => {
                      if (
                        !EasyReturnService.erSelectedReturnProducts ||
                        EasyReturnService.erSelectedReturnProducts.length < 1
                      ) {
                        MessageBoxNew.show(
                          "İade edilecek ürünler seçilmeden bir sonraki aşamaya geçilemez."
                        );
                        return;
                      }
                      EasyReturnService.ErMakeTransaction();
                    }}
                    loading={EasyReturnService.isLoading}
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
                  data={ApplicationGlobalService.allEasyReturnReasons.filter(
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
                        EasyReturnService.erSelectedReturnProducts = temp;
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
export default FicheProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

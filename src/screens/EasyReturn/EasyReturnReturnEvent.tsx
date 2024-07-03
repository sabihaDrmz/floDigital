import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import { AntDesign, FloButton, FloTextBox } from "../../components";
import { FloHeader } from "../../components/Header";
import { EasyReturnEventType } from "../../core/models/EasyReturnReason";
import AccountService from "../../core/services/AccountService";
import EasyReturnService from "../../core/services/EasyReturnService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import { toCensorText } from "../../core/Util";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import EasyReturnChangeProductInfo from "./EasyReturnChangeProductInfo";
import BrokenProductCompletePopup from "./partials/BrokenProductCompletePopup";

@observer
class EasyReturnReturnEvent extends Component {
  state = {
    currentKey: 0,
    extendedPropMap: [],
    showCompletePopup: false,
    hasEditPhone: false,
    phone: "",
  };

  componentDidMount() {
    var temp: any[] = [];
    EasyReturnService.returnSelectItemPropMap.map((item) => {
      if (item.reason?.conditionId === EasyReturnEventType.BrokenProductEvent)
        for (var i = 0; i < Number(item.item_quantity); i++) {
          temp.push(item);
        }
    });

    this.setState({ extendedPropMap: temp });
  }

  render() {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back"]}
          headerTitle={"İDES detaylandırma"}
        />
        <FlatList
          data={this.state.extendedPropMap}
          keyExtractor={(item) => item.barcode}
          style={{ padding: 20 }}
          ListFooterComponent={() => <View style={{ height: 30 }} />}
          renderItem={(itr) => {
            const { item, index } = itr;
            if (
              item.reason?.conditionId ===
                EasyReturnEventType.BrokenProductEvent &&
              this.state.currentKey === index
            ) {
              // Arızalı ürün
              return (
                <EasyReturnChangeProductInfo
                  selectedItem={item}
                  index={index}
                />
              ); //<Text>Bu kısım arızalı ürün için</Text>;
            } else if (
              item.reason?.conditionId ===
                EasyReturnEventType.ChangeProductEvent ||
              item.reason?.conditionId === EasyReturnEventType.WrongProcutEvent
            ) {
              // Değişim süreci
              return null;
            } else return null;
          }}
        />
        <View
          style={{
            padding: 20,
            paddingBottom: 30,
            borderTopWidth: 0.3,
            borderColor: "rgba(0,0,0,0.3)",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {this.state.currentKey > 0 ? (
            <FloButton
              title={"Geri"}
              containerStyle={{
                width:
                  this.state.currentKey > 0
                    ? (Dimensions.get("window").width - 50) / 2
                    : Dimensions.get("window").width - 40,
              }}
              onPress={() => {
                if (this.state.currentKey > 0)
                  this.setState({ currentKey: this.state.currentKey - 1 });
              }}
            />
          ) : null}
          <FloButton
            title={
              this.state.currentKey + 1 >= this.state.extendedPropMap.length
                ? "Tamamla"
                : "İleri"
            }
            containerStyle={{
              width:
                this.state.currentKey > 0
                  ? (Dimensions.get("window").width - 50) / 2
                  : Dimensions.get("window").width - 40,
            }}
            onPress={async () => {
              let header = await EasyReturnService.getTransactionLineDetail(
                this.state.currentKey,
                //@ts-ignore
                this.state.extendedPropMap[this.state.currentKey].barcode
              );

              if (
                header.detail.reasonId === 0 ||
                header.detail.description === "" ||
                header.detail.images === undefined ||
                header.detail.images.length <= 0
              ) {
                MessageBox.Show(
                  "Lütfen tüm alanları eksiksiz doldurun.",
                  MessageBoxDetailType.Information,
                  MessageBoxType.Standart,
                  () => {},
                  () => {}
                );
                return;
              }
              if (
                this.state.currentKey + 1 >=
                this.state.extendedPropMap.length
              ) {
                this.setState({ showCompletePopup: true });
              } else {
                this.setState({ currentKey: this.state.currentKey + 1 });
              }
            }}
          />
        </View>
        {this.state.showCompletePopup && (
          <BrokenProductCompletePopup
            onComplete={() => {
              EasyReturnService.clearTransaction();
              Actions.replace("scTbHome");
            }}
          />
        )}
      </React.Fragment>
    );
  }

  _completePopup = () => {
    return (
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            padding: 15,
            width: "90%",
          }}
        >
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              fontFamily: "Poppins_700Bold",
            }}
          >
            {EasyReturnService.transaction?.id}
          </Text>
          <Text
            style={{
              fontSize: PerfectFontSize(18),
              textAlign: "center",
              fontFamily: "Poppins_400Regular",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Takip Numarası ile İDES İnceleme Formu Oluşturulmuştur
          </Text>
          <FloButton
            title={"Tamamla"}
            onPress={() => {
              EasyReturnService.clearTransaction();
              EasyReturnService.findFicheRequest = {
                activeStore: AccountService.getUserStoreId(),
                gsm: "",
                paymentType: "",
                receiptNumber: "",
                shippingStore: "",
                shippingDate: "",
                barcode: "",
              };
              EasyReturnService.returnSelectItemPropMap = [];
              Actions.reset("mainStack");
            }}
          />
        </View>
      </View>
    );
  };
}
export default EasyReturnReturnEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

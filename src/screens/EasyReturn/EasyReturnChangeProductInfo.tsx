//TODO: EXPO expo-camera
// import { CameraCapturedPicture } from "expo-camera";
import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {} from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  AntDesign,
  FloTextBox,
  MaterialCommunityIcons,
} from "../../components";
import FloComboBox from "../../components/FloComobox";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import EasyReturnService from "../../core/services/EasyReturnService";
import { GetServiceUri, ServiceUrlType } from "../../core/Settings";
import { PerfectFontSize } from "../../helper/PerfectPixel";

// const SubReasons = [
//   {id: 1, name: 'Saya yırtılması'},
//   {id: 2, name: 'Taban yırtılması'},
//   {id: 3, name: 'Renk atması'},
// ];

@observer
class EasyReturnChangeProductInfo extends Component<any> {
  state = {
    reasonId: -1,
    description: "",
    isLoadingImage: false,
    productGroupId: -1,
    productGroupReasons: [],
  };
  async componentDidMount() {
    const { selectedItem, index } = this.props;
    let fiche = await EasyReturnService.getTransactionLineDetail(
      index,
      selectedItem.barcode
    );
  }

  render() {
    const { selectedItem, index } = this.props;
    return (
      <React.Fragment>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.2)",
              marginBottom: 20,
            }}
          >
            {/* Product Section */}
            <Image
              source={{ uri: selectedItem.picture }}
              style={{ width: 60, height: 60, marginRight: 10 }}
            />
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("window").width - 100,
                justifyContent: "space-between",
              }}
            >
              <View style={{ marginRight: 10 }}>
                <View style={styles.textLine}>
                  <Text style={styles.infoText1}>
                    {selectedItem.productName.length > 17
                      ? selectedItem.productName.substring(0, 17) + "..."
                      : selectedItem.productName}
                  </Text>
                  <Text style={[styles.infoText1, styles.infoText2]}></Text>
                </View>
                <View style={styles.textLine}>
                  <Text style={styles.infoText1}>Beden</Text>
                  <Text style={[styles.infoText1, styles.infoText2]}>
                    :{selectedItem.size}
                  </Text>
                </View>
              </View>
              <View>
                <View style={styles.textLine}>
                  <Text style={styles.infoText1}>Satış Fiyatı</Text>
                  <Text style={[styles.infoText1, styles.infoText2]}>
                    :{Number(selectedItem.price).toFixed(2)} TL
                  </Text>
                </View>
                <View style={styles.textLine}>
                  <Text style={styles.infoText1}>İade Tutarı</Text>
                  <Text style={[styles.infoText1, styles.infoText2]}>
                    :{Number(selectedItem.returnPrice).toFixed(2)} TL
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View>
            <FloComboBox
              data={ApplicationGlobalService.productReasons}
              keyProp={"id"}
              valueProp={"name"}
              placeholder={"Ürün Tipi"}
              selectedItem={ApplicationGlobalService.productReasons.find(
                (x) => x.id === this.state.productGroupId
              )}
              onSelectItem={(item) => {
                this.setState({
                  productGroupId: item.id,
                  productGroupReasons:
                    ApplicationGlobalService.productGroupReasons.filter(
                      (x) => x.id === item.id
                    ),
                });
              }}
            />
            <FloComboBox
              data={this.state.productGroupReasons}
              keyProp={"id"}
              valueProp={"description"}
              placeholder={"Lütfen İDES türünü belirtin"}
              selectedItem={this.state.productGroupReasons.find(
                (x: any) => x.id === this.state.reasonId
              )}
              onSelectItem={(item) => {
                this.setState({ reasonId: item.id }, () => {
                  EasyReturnService.updateTransactionLineDetail(
                    index,
                    selectedItem.barcode,
                    this.state.reasonId,
                    this.state.description
                  );
                });
              }}
            />
            {this.state.reasonId !== -1 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <FontAwesome5 name={"times-circle"} size={24} color={"red"} />
                <Text
                  style={{
                    fontSize: PerfectFontSize(13),
                    fontFamily: "Poppins_400Regular",
                    marginLeft: 10,
                  }}
                >
                  Ürün kontrolü için incelenmesi gerekmektedir.
                </Text>
              </View>
            )}
            <FloTextBox
              multiline
              placeholder={"Yaşanan İDES'i detaylandırın"}
              numberOfLines={10}
              inputHeight={250}
              floatingLabel
              onChangeText={(text) => this.setState({ description: text })}
              onSubmitEditing={() =>
                EasyReturnService.updateTransactionLineDetail(
                  index,
                  selectedItem.barcode,
                  this.state.reasonId,
                  this.state.description
                )
              }
              onBlur={() =>
                EasyReturnService.updateTransactionLineDetail(
                  index,
                  selectedItem.barcode,
                  this.state.reasonId,
                  this.state.description
                )
              }
            />
            <View
              style={{ marginTop: 0, flexDirection: "row", flexWrap: "wrap" }}
            >
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 160,
                  borderWidth: 1,
                  borderRadius: 9,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  marginBottom: 10,
                }}
                onPress={() => {
                  Actions["easyReturnTakePicture"]({
                    onSavePicture: (picture: any) => {
                      if (Actions.currentScene === "easyReturnTakePicture")
                        Actions.pop();

                      this.setState({ isLoadingImage: true }, () => {
                        EasyReturnService.detailAddPicture(
                          index,
                          selectedItem.barcode,
                          picture
                        ).then((x) => {
                          this.setState({ isLoadingImage: false });
                        });
                      });
                    },
                  });
                }}
              >
                <MaterialCommunityIcons
                  name={"camera-plus-outline"}
                  size={30}
                />
              </TouchableOpacity>
              {EasyReturnService.transactionLineDetails.map((x) => {
                if (x.index === index && x.barcode === selectedItem.barcode) {
                  let images = x.detail.images;
                  if (images !== undefined) {
                    return images.map((i) => {
                      return (
                        <View style={{ marginRight: 10, marginBottom: 10 }}>
                          <Image
                            source={{
                              uri: `${GetServiceUri(
                                ServiceUrlType.BASE_URL
                              )}sys/${i.image}`,
                            }}
                            style={{
                              width: 100,
                              height: 160,
                              borderWidth: 1,
                              borderRadius: 9,
                              justifyContent: "center",
                              alignItems: "center",
                              resizeMode: "cover",
                            }}
                          ></Image>
                          <TouchableOpacity
                            onPress={() =>
                              EasyReturnService.detailDeletePicture(
                                index,
                                selectedItem.barcode,
                                i.id
                              ).then(() => {
                                this.setState(this.state);
                              })
                            }
                            style={{
                              position: "absolute",
                              width: 50,
                              height: 50,
                              borderRadius: 25,
                              backgroundColor: "rgba(0,0,0,0.3)",
                              justifyContent: "center",
                              alignItems: "center",
                              left: 25,
                              top: 50,
                            }}
                          >
                            <AntDesign
                              name={"close"}
                              color={"rgba(255,255,255,0.3)"}
                              size={30}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    });
                  } else {
                    return null;
                  }
                } else return null;
              })}
              {this.state.isLoadingImage && (
                <View
                  style={{
                    marginRight: 10,
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 100,
                    height: 160,
                    borderWidth: 1,
                    borderRadius: 9,
                  }}
                >
                  <ActivityIndicator />
                </View>
              )}
            </View>
          </View>
        </View>

        <SafeAreaView />
      </React.Fragment>
    );
  }
}
export default EasyReturnChangeProductInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  textLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText1: {
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(12),
    lineHeight: PerfectFontSize(18),
    letterSpacing: -0.03,
  },
  infoText2: {
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(12),
    lineHeight: PerfectFontSize(18),
    letterSpacing: -0.03,
  },
});

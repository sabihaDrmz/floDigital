import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  NativeModules,
  Platform,
} from "react-native";
//TODO:EXPO pathFinder
//import * as Pathfinder from "@flomagazacilik/flo-pathfinder";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { MessageBoxType } from "../../core/services/MessageBox";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, FontAwesome5 } from "../../components";
import { Actions } from "react-native-router-flux";

const { width, height } = Dimensions.get("window");
const alias = [
  { alias: "Label", title: "Время года" },
  { alias: "LabelDiscount", title: "Скидка" },
];

interface PathfinderScreenProps {}

interface Resource {
  hash: string;
  fileName: string;
  uri: string;
  alias: string;
}

const PathfinderScreen: React.FC<PathfinderScreenProps> = (props) => {
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedAlias, setSelectedAlias] = useState("");
  const [loading, setLoading] = useState(true);

  const discoverDevices = async () => {
    console.log("Search device");
    try {
    //TODO:EXPO
      //  const foundDevices = await Pathfinder.discoverDevices();
      const foundDevices = [];

      if (
        foundDevices.length > 0 &&
        foundDevices[0] !== "noDevicesFoundString"
      ) {
        setDevices(foundDevices);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      const rawSaveData = await AsyncStorage.getItem("@flo_ru_printer_info");

      if (rawSaveData != null) {
        const parsedSaveData = JSON.parse(rawSaveData);

        if (parsedSaveData.alias) {
          setSelectedAlias(parsedSaveData.alias);
        }
      }
      await discoverDevices();
      setLoading(false);
    };

    load();
  }, []);

  const connectDevice = async (deviceKey: string) => {
    try {
      console.log("Connecting....");
      if (Platform.OS === "android") {
        var dev = deviceKey.split("\n");
        console.log(dev);
       /*
        const result = await NativeModules.FloPathfinder.connectDevice(

          dev[0],
          dev[1]
        );

        */
      } else {
        //await Pathfinder.connectDevice(deviceKey);
      }
    } catch (err) {
      console.log("Connection err : ", err);
    }
  };

  const setPrinterConfig = async () => {
    try {
      await connectDevice(selectedDevice);
      await AsyncStorage.setItem(
        "@flo_ru_printer_info",
        JSON.stringify({ alias: selectedAlias })
      );

      MessageBoxNew.show("Настройки сделаны", {
        type: MessageBoxType.Standart,
        yesButtonTitle: "Хорошо",
        yesButtonColorType: ColorType.Brand,
        yesButtonEvent: () => {
          Actions.pop();
        },
      });
    } catch (err) {
      MessageBoxNew.show("Не удалось выполнить настройки", {
        type: MessageBoxType.Standart,
        yesButtonTitle: "Хорошо",
        yesButtonColorType: ColorType.Brand,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"search"}
        headerTitle={"настройки принтера"}
        enableButtons={["back"]}
      />
      <FlatList
        data={devices}
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 5,
              alignItems: "center",
            }}
          >
            <AppText size={FontSizes.L} style={styles.title}>
              Принтеры этикеток:{" "}
            </AppText>
            <TouchableOpacity onPress={discoverDevices}>
              <AppText>
                Обновить{"  "}
                <FontAwesome
                  name={"refresh"}
                  size={15}
                  color={AppColor.FD.Brand.Solid}
                />
              </AppText>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedDevice(item)}
            style={styles.button}
          >
            <FontAwesome5
              name={item === selectedDevice ? "check-circle" : "circle"}
              size={20}
              color={
                item === selectedDevice
                  ? AppColor.FD.Brand.Solid
                  : AppColor.FD.Text.Ash
              }
            />
            <AppText
              style={styles.buttonText}
              labelColorType={
                item === selectedDevice ? ColorType.Brand : ColorType.Gray
              }
            >
              {item}
            </AppText>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={alias}
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 5,
              alignItems: "center",
            }}
          >
            <AppText style={styles.title}>Типы этикеток:</AppText>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedAlias(item.alias)}
            style={styles.button}
          >
            <FontAwesome5
              name={item.alias === selectedAlias ? "check-circle" : "circle"}
              size={20}
              color={
                item.alias === selectedAlias
                  ? AppColor.FD.Brand.Solid
                  : AppColor.FD.Text.Ash
              }
            />
            <AppText
              style={styles.buttonText}
              labelColorType={
                item.alias === selectedAlias ? ColorType.Brand : ColorType.Gray
              }
            >
              {item.title}
            </AppText>
          </TouchableOpacity>
        )}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <AppButton
          buttonColorType={ColorType.Brand}
          onPress={setPrinterConfig}
          title={"Полные настройки"}
        />
      </View>
      {loading && (
        <View style={{ position: "absolute", width, height }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 80,
                width: 80,
                borderRadius: 10,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size={"large"} />
            </View>
          </View>
        </View>
      )}
      <SafeAreaView />
    </View>
  );
};
export default PathfinderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  buttonText: {
    marginLeft: 10,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
  },
});

import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { SearchQR } from "../../../../components/CustomIcons/MainPageIcons";
import { translate } from "../../../../helper/localization/locaizationMain";

const QrSearchBar: React.FC<any> = (props) => {
  const [query, setQuery] = useState("");
  const openCamera = () => {
    const currentState = Actions.currentScene;
    Actions["easyReturnCamera"]({
      onReadComplete: (barcode: string) => {
        Actions.popTo(currentState);
        props.onSearch(barcode);
      },
      headerTitle: translate("OmsBarcodeSearchBar.barcodeScanning"),
    });
  };

  return (
    <View style={{ marginTop: 30, paddingHorizontal: 40 }}>
      <View>
        <View style={styles.txtContainer}>
          {/* @ts-ignore */}
          <View style={{ flex: 1 }}>
            <TextInput
              maxLength={30}
              placeholder={props.placeholder || "Barkod yazın veya taratın"}
              onChangeText={setQuery}
              value={query}
              style={{ flex: 1 }}
            />
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            top: -35,
            right: -15,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (query) props.onSearch(query);
              else openCamera();

              setQuery("");
            }}
            style={[]}
          >
            <SearchQR />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default QrSearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txtContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderColor: "#b7b5b5",
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    height: 45,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    zIndex: 5,
  },
});

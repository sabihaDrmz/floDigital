import {
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { Portal } from "react-native-portalize";
import { translate } from "../helper/localization/locaizationMain";
import AppTextBox from "../NewComponents/FormElements/AppTextBox";

interface AppComboSelectProps {
  selected: any;
  data: any[];
  disabled?: boolean;
  onSelect?: (item: any) => void;
  onRenderItem: (item: any, index: number) => void | undefined | null | any;
  title?: string;
  textField?: string;
}

const { width, height } = Dimensions.get("window");

const AppComboSelect: React.FC<AppComboSelectProps> = (props) => {
  const [hasOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleModalPressed = () => {
    setOpen(true)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: AppColor.FD.Text.Light,
          minHeight: 42,
          borderRadius: 8,
          paddingHorizontal: 13,
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <AppText
          labelColorType={ColorType.Dark}
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          {props.title}
        </AppText>
      </TouchableOpacity>
      {hasOpen && (
        <Portal>
          <TouchableOpacity
            style={{
              position: "absolute",
              width,
              height,
              backgroundColor: "rgba(0,0,0,.4)",
            }}
            onPress={() => setOpen(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Pressable
                onPress={handleModalPressed}
                style={{
                  width,
                  maxWidth: 300,
                  backgroundColor: "#fff",
                  height: height / 2.4,
                  borderRadius: 10,
                  maxHeight: 500,
                  padding: 20,
                }}
              >
                {props.textField !== undefined && (
                  <React.Fragment>
                    <AppTextBox
                      placeholder={
                        translate("OmsNotFoundProducts.search") + "..."
                      }
                      value={query}
                      onChangeText={setQuery}
                    />
                    <View style={{ height: 20 }} />
                  </React.Fragment>
                )}
                <FlatList
                  data={
                    props.textField && query !== ""
                      ? props.data.filter((x) =>
                        // @ts-ignore
                        x[props.textField]
                          .toUpperCase()
                          .includes(query.toUpperCase())
                      )
                      : query !== ""
                        ? props.data.filter((x) =>
                          x.name.toUpperCase().includes(query.toUpperCase())
                        )
                        : props.data
                  }
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setOpen(false);
                        props.onSelect && props.onSelect(item);
                      }}
                    >
                      {props.onRenderItem(item, index)}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        marginVertical: 8,
                        backgroundColor: AppColor.FD.Text.Light,
                      }}
                    />
                  )}
                />
              </Pressable>
            </View>
          </TouchableOpacity>
        </Portal>
      )}
    </View>
  );
};
export default AppComboSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

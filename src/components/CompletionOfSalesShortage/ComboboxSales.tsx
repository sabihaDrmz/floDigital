import React, { ReactNode, useState, useEffect } from "react";
import FloAutoComplete, { AutoCompleteItem, FloAutoCompleteSoftProps } from "../FloAutoComplete";
import { useIsFocused } from "@react-navigation/native";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import Modal from "react-native-modal";

interface ComboboxSalesProps extends FloAutoCompleteSoftProps {
  valueProp: string;
  isReadOnly?: boolean;
  containerStyle: any;
  width?: any;
  textColor?: string;
  fontSize?: any;
  selectedItem?: any;
  placeholder: any;
  swipeClose?: boolean;
  showClearButton?: boolean;
  itemRender?: (item: AutoCompleteItem) => ReactNode;
  keyProp: string;
  hideIcon?: boolean;
};

const ComboboxSales = (props: ComboboxSalesProps) => {
  const isFocused = useIsFocused();
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(props.selectedItem);

  useEffect(() => {
    if (isFocused) {
      setSelectedItem(undefined);
    };
  }, [isFocused]);

  const _renderComplateItem = (item: AutoCompleteItem) => {
    return (
      <View style={styles.container}>
        <Text>{item.data[props.valueProp]}</Text>
      </View>
    );
  };

  return (
    <View style={{ width: props.width }}>
      <TouchableOpacity
        onPress={() => (props.isReadOnly ? null : setIsVisibleInfo(true))}
        style={props.containerStyle}>
        <Text style={{
          flex: 1,
          color: props.textColor ? props.textColor : colors.darkGrey,
          fontSize: props.fontSize ? PerfectFontSize(Number(props.fontSize)) : PerfectFontSize(16),
          fontFamily: "Poppins_500Medium",
        }}
        >
          {props.selectedItem === undefined ? props.placeholder : props.selectedItem}
        </Text>
        {!props.hideIcon && <FontAwesomeIcon
          icon={"caret-down-outline"}
          size={Platform.OS === "web" ? 20 : 18}
          color={colors.lightGrayText}
        />}
      </TouchableOpacity>
      <Modal
        isVisible={isVisibleInfo}
        style={styles.modal}
        onSwipeCancel={() => setIsVisibleInfo(true)}
        onSwipeComplete={() => setIsVisibleInfo(false)}
        swipeDirection={!props.swipeClose ? undefined : "down"}
      >
        <View style={styles.modalView}>
          {!props.swipeClose ? (
            <View style={styles.maodalIconsView}>
              {props.showClearButton && (
                <TouchableOpacity
                  onPress={() => {
                    if (props.onSelectItem) props.onSelectItem(undefined);
                    setIsVisibleInfo(false);
                    setSelectedItem(undefined);
                  }}
                  style={styles.iconOne}
                >
                  <FontAwesomeIcon icon={"trash"} size={20} color={colors.white} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setIsVisibleInfo(false)} style={styles.iconTwo}>
                <FontAwesomeIcon icon={"close"} size={24} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 15 }}>
              <View style={{ backgroundColor: colors.warm_grey_three, height: 8, borderRadius: 4, width: 70 }}></View>
            </View>
          )}
          <FloAutoComplete
            dynamicHeight
            data={props.data}
            itemRender={(item: AutoCompleteItem) =>
              props.itemRender
                ? props.itemRender(item)
                : _renderComplateItem(item)
            }
            keyProp={props.keyProp}
            placeholder={props.placeholder}
            onSelectItem={(item) => {
              if (props.onSelectItem) props.onSelectItem(item);
              setIsVisibleInfo(false);
              setSelectedItem(item);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};
export default ComboboxSales;

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: "center"
  },
  modal: {
    margin: 0,
    marginTop: 150,
    justifyContent: "flex-end"
  },
  modalView: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  maodalIconsView: {
    justifyContent: "flex-end",
    marginBottom: 20,
    flexDirection: "row"
  },
  iconOne: {
    backgroundColor: colors.floOrange,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginRight: 10
  },
  iconTwo: {
    backgroundColor: colors.warm_grey_three,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15
  }
});

import React, { Component, ReactNode, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import FloAutoComplete, {
  AutoCompleteItem,
  FloAutoCompleteSoftProps,
} from "./FloAutoComplete";
import Modal from "react-native-modal";
import { colors } from "../theme/colors";
import { paddings } from "../theme/paddingConst";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { PerfectFontSize } from "../helper/PerfectPixel";

interface FloComboBoxProps extends FloAutoCompleteSoftProps {
  valueProp: string;
  selectedItem?: any;
  isReadOnly?: boolean;
  itemRender?: (item: AutoCompleteItem) => ReactNode;
  swipeClose?: boolean;
  showClearButton?: boolean;
  textColor?: string;
  fontSize?: string;
}

const FloComboBox: React.FC<FloComboBoxProps> = (props) => {
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(props.selectedItem);

  useEffect(() => {
    setSelectedItem(props.selectedItem)
  }, [props.selectedItem])

  const _renderComplateItem = (item: AutoCompleteItem) => {
    return (
      <View
        style={{
          height: 50,
          justifyContent: "center",
        }}
      >
        <Text>{item.data[props.valueProp]}</Text>
      </View>
    );
  };
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => (props.isReadOnly ? null : setIsVisibleInfo(true))}
        style={[
          {
            height: 56,
            borderColor: colors.warmGrey,
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: "center",
            marginBottom: 20,
          },
          props.containerStyle,
        ]}
      >
        <Text
          style={{
            color: props.textColor ? props.textColor : colors.darkGrey,
            lineHeight: PerfectFontSize(21),
            fontSize: props.fontSize
              ? PerfectFontSize(Number(props.fontSize))
              : PerfectFontSize(16),
            fontFamily: "Poppins_500Medium",
            padding: paddings.textInputPadding,
          }}
        >
          {selectedItem ? selectedItem[props.valueProp] : props.placeholder}
        </Text>
        <FontAwesomeIcon
          icon={"chevron-down"}
          size={25}
          style={{ position: "absolute", right: 16, top: 13 }}
          color={props.textColor ? props.textColor : colors.darkGrey}
        />
      </TouchableOpacity>

      <Modal
        isVisible={isVisibleInfo}
        style={{
          margin: 0,
          marginTop: 150,
        }}
        onSwipeCancel={() => setIsVisibleInfo(true)}
        onSwipeComplete={() => setIsVisibleInfo(false)}
        swipeDirection={!props.swipeClose ? undefined : "down"}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          {!props.swipeClose ? (
            <View
              style={{
                justifyContent: "flex-end",
                marginBottom: 20,
                flexDirection: "row",
              }}
            >
              {props.showClearButton && (
                <TouchableOpacity
                  onPress={() => {
                    if (props.onSelectItem) props.onSelectItem({});
                    setIsVisibleInfo(false);
                    setSelectedItem(undefined);
                  }}
                  style={{
                    backgroundColor: "rgba(255,50,0,1)",
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,
                    marginRight: 10,
                  }}
                >
                  <FontAwesomeIcon icon={"trash"} size={20} color={"white"} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setIsVisibleInfo(false)}
                style={{
                  backgroundColor: colors.warm_grey_three,
                  width: 30,
                  height: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 15,
                }}
              >
                <FontAwesomeIcon icon={"close"} size={24} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.warm_grey_three,
                  height: 8,
                  borderRadius: 4,
                  width: 70,
                }}
              ></View>
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
          <SafeAreaView />
        </View>
      </Modal>
    </View>
  );
};
export default FloComboBox;

const styles = StyleSheet.create({
  container: {},
});

import React, { Component, ReactNode } from "react";
import {
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
  FlatList,
  TextInput,
  Platform,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { translate } from "../helper/localization/locaizationMain";
import { colors } from "../theme/colors";

export interface FloAutoCompleteSoftProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle> | undefined;
  data: any[];
  keyProp: string;
  initNumber?: number;
  dynamicHeight?: boolean;
  onSelectItem?: (item: any) => void;
}

export interface FloAutoCompleteProps extends FloAutoCompleteSoftProps {
  onSelectItem?: (item: any) => void;
  itemRender: (prop: { data: any; index: number }) => void;
}

export type AutoCompleteItem = {
  data: any;
  index: number;
};

class FloAutoComplete extends Component<FloAutoCompleteProps> {
  state = { filteredData: [], selectedData: undefined };

  componentDidMount() {
    this.setState({ filteredData: this.props.data });
  }
  _selectElement = (item: any) => {
    if (this.props.onSelectItem) this.props.onSelectItem(item);
  };

  _onChangeText = (query: string) => {
    var filteredData = this.props.data.filter((item) => {
      var keys = Object.keys(item);

      var foundIt = false;

      keys.map((key) => {
        if (item[key]?.toString().toLowerCase().includes(query.toLowerCase()))
          foundIt = true;
      });

      return foundIt;
    });

    this.setState({ filteredData: filteredData });
  };

  shouldComponentUpdate(props: FloAutoCompleteProps, state: any) {
    return true;
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.textInputContainer}>
          <View style={styles.searchIcon}>
            <FontAwesomeIcon icon="search" color={colors.black} size={28} />
            <View
              style={{
                width: 1,
                height: 30,
                marginLeft: 10,
                backgroundColor: colors.darkGrey,
                borderRadius: 0.5,
              }}
            />
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={(str) => this._onChangeText(str)}
            placeholderTextColor={"rgba(0,0,0,0.2)"}
            underlineColorAndroid={"transparent"}
            placeholder={
              this.props.placeholder
                ? this.props.placeholder
                : translate("floAutoComplete.defaultPlaceholde")
            }
          />
        </View>

        <View
          style={
            !this.props.dynamicHeight
              ? { height: 300 }
              : { height: Dimensions.get("window").height - 350 }
          }
        >
          <FlatList
            windowSize={5}
            nestedScrollEnabled
            initialNumToRender={this.props.initNumber}
            data={this.state.filteredData}
            ListFooterComponent={
              !this.props.dynamicHeight ? (
                <View style={{ height: 500 }} />
              ) : null
            }
            renderItem={(itr) => (
              <TouchableOpacity
                onPress={() => this._selectElement(itr.item)}
                key={itr.item[this.props.keyProp]}
              >
                {/* @ts-expect-error */}
                {this.props.itemRender
                  ? this.props.itemRender({ data: itr.item, index: itr.index })
                  : null}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: "#dedede",
                  marginBottom: 16,
                  marginTop: 16,
                }}
              />
            )}
            keyExtractor={(itr) => itr[this.props.keyProp]}
          />
          <SafeAreaView />
        </View>
      </View>
    );
  }
}
export default FloAutoComplete;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderColor: "#dedede",
    borderWidth: 1,
    padding: 16,
  },
  textInputContainer: {
    borderRadius: 7,
    backgroundColor: colors.gray,
    marginBottom: 16,
  },
  textInput: {
    paddingLeft: 60,
    borderWidth: 0,
    height: 50,
  },
  searchIcon: { position: "absolute", top: 10, left: 12, flexDirection: "row" },
});

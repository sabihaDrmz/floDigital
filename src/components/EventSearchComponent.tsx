import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Platform,
  FlatList
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { NavigationTree } from "../constant/NavigationTree";
import { removeDuplicates } from "../helper/ArrayHelper";
import { translate } from "../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../helper/PerfectPixel";

const { width, height } = Dimensions.get("window");

const EventsearchComponent = (props: any) => {
  const searchResultHeight = useSharedValue(0);
  const [routeList, setRouteList] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [query, setQuery] = useState("");
  const navigation = useNavigation();
  const onSearch = (query: string) => {
    if (query.trimEnd().trimStart().length >= 3) {
      setIsLoadingData(true);

      let keywords = query.split(" ");

      let routes: any[] = [];
      let result = keywords
        .map((x) => {
          return NavigationTree.filter((y) =>
            y.keywords.find(
              (t) =>
                x &&
                x !== " " &&
                x.length >= 2 &&
                t.includes(x?.toLocaleLowerCase())
            )
          );
        })
        .map((x) => {
          x.map((y) => {
            routes.push({
              title: y.title,
              path: y.path,
              screen: y.screen,
              props: y.params,
            });
          });
        });

      if (routes) {
        routes = removeDuplicates(routes);
        setRouteList(routes);
      }
      setIsLoadingData(false);

      if (routes.filter((x) => x.path !== undefined).length > 0)
        searchResultHeight.value = withTiming(100);
    } else searchResultHeight.value = withTiming(0);
  };

  const navigateTo = (path: string, screen: string, props: {}) => {
    searchResultHeight.value = withTiming(0);
    setQuery("");
    navigation.navigate(path, { screen: screen });
  };

  const searchResultStyle = useAnimatedStyle(() => {
    return {
      height: searchResultHeight.value,
      zIndex: 999,
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const radius = interpolate(searchResultHeight.value, [0, 100], [8, 8]);
    const radius2 = interpolate(searchResultHeight.value, [0, 100], [8, 20]);
    return {
      borderTopLeftRadius: radius,
      borderBottomRightRadius: radius,
      borderTopRightRadius: radius2,
      borderBottomLeftRadius: radius2,
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon icon={faSearch} size={27} color={"rgba(191,191,191,1)"} />
        <TextInput
          onChangeText={(txt) => {
            onSearch(txt);
            setQuery(txt);
          }}
          placeholderTextColor={"rgba(0,0,0,0.3)"}
          value={query}
          style={styles.inputStyle}
          placeholder={translate("mainScreen.find")}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        />
      </View>
      <Animated.View
        style={[searchResultStyle, { backgroundColor: "#fff", zIndex: 1 }]}
      >
        {isLoadingData ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <FlatList
            style={{ marginTop: 10 }}
            data={routeList}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderBottomWidth: 0.2,
                  borderColor: "rgba(0,0,0,0.3)",
                }}
              />
            )}
            renderItem={({ item }) => {
              return item.title === undefined ? (
                <View />
              ) : (
                <TouchableOpacity
                  style={{ marginTop: 10, marginBottom: 10 }}
                  onPress={() => {
                    navigateTo(item.path, item.screen, item.props);
                  }}
                >
                  <Text
                    style={{
                      fontSize: PerfectFontSize(12),
                      color: "rgba(0,0,0,0.7)",
                    }}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => "*" + index.toString()}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};
export default EventsearchComponent;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 31,
    borderColor: "rgba(191,191,191,1)",
    borderWidth: 1,
    padding: 10,
    // top: PerfectPixelSize(250),
    backgroundColor: "#fff",
    zIndex: 99,
    width: width - 90,
  },
  inputStyle: {
    fontSize: PerfectFontSize(15),
    marginLeft: 4,
    width: width - 70 - 30,
    ...(Platform.OS === "android" && { padding: 0 }),
  },
});

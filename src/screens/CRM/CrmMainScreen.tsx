import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { Actions } from "react-native-router-flux";
import CrmCaseCard from "../../components/Crm/CrmCaseCard";
import { FloHeader } from "../../components/Header";
import CrmService from "../../core/services/CrmService";
import { translate } from "../../helper/localization/locaizationMain";
import { colors } from "../../theme/colors";

const PER_PAGE = 20;
const CrmMainScreen: React.FC = observer((props) => {
  let currentPage = 1;
  let oldGetPage = 0;
  const [onLoad, setOnload] = useState(false);

  useEffect(() => {
    if (!onLoad) {
      _loadMore(true);
      setOnload(true);
    }
  });

  const _loadMore = (resetPages: boolean = false) => {
    let tempPage = currentPage;

    if (CrmService.cases.length === 0 && !resetPages) return;
    if (resetPages) {
      tempPage = 1;
      oldGetPage = 0;
    } else tempPage = tempPage + 1;

    if (oldGetPage === tempPage) return;
    oldGetPage = tempPage;

    CrmService.getCases(tempPage, PER_PAGE);
    currentPage = tempPage;
  };

  return (
    <View style={styles.container}>
      <FloHeader
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={translate("crm.caseManagement")}
      />
      <FlatList
        data={CrmService.cases}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, backgroundColor: "#e4e4e4", marginRight: 33 }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={CrmService.isLoading}
            tintColor={"#ff8600"}
            onRefresh={() => _loadMore(true)}
          />
        }
        onEndReached={() =>
          CrmService.cases && CrmService.cases.length >= currentPage * PER_PAGE
            ? _loadMore(false)
            : null
        }
        ListEmptyComponent={() => {
          var animVal = new Animated.Value(80);
          var animVal2 = new Animated.Value(40);

          Animated.loop(
            Animated.timing(animVal, {
              toValue: 120,
              duration: 900,
              useNativeDriver: false,
            })
          ).start();

          const radiusAnim = animVal.interpolate({
            inputRange: [80, 120],
            outputRange: [40, 60],
            extrapolate: "clamp",
          });
          return CrmService.isLoading ? (
            <View
              style={{
                ...Dimensions.get("window"),
                height: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Animated.View
                style={{
                  width: animVal,
                  height: animVal,
                  borderRadius: radiusAnim,
                  backgroundColor: "rgba(255, 103, 28, 0.4)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.View
                  style={{
                    width: animVal2,
                    height: animVal2,
                    borderRadius: animVal2,
                    backgroundColor: "rgba(255, 103, 28, 0.6)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: colors.brightOrange,
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: 20,
                        color: colors.white,
                      }}
                    >
                      FLO
                    </Text>
                    {/* <ActivityIndicator size={'large'} color={colors.brightOrange} /> */}
                  </View>
                </Animated.View>
              </Animated.View>
            </View>
          ) : (
            <Text>{translate("crm.caseNotFound")}</Text>
          );
        }}
        renderItem={({ item }) => (
          <CrmCaseCard
            {...item}
            onSelect={() => {
              Actions["CrmCaseDetail"]({ item: item });
            }}
          />
        )}
      />
    </View>
  );
});
export default CrmMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

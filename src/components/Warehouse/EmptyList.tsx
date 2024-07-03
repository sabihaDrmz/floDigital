import { AppText } from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { translate } from "../../helper/localization/locaizationMain";

interface EmptyListProps {}

const EmptyList: React.FC<EmptyListProps> = (props) => (
  <View style={styles.container}>
    <AppText
      style={{
        fontSize: 20,
        fontWeight: "600",
        fontFamily: "Poppins_600SemiBold",
      }}
    >
      {translate("warehouseRequest.noRecordsList")}
    </AppText>
  </View>
);
export default EmptyList;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

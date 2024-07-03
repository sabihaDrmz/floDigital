import AndroidPrinterConfig from "../../components/Printer/AndroidPrinterConfig";
import IosPrinterConfig from "../../components/Printer/IosPrinterConfig";
import MertechPrinterConfig from "../../components/Printer/MertechPrinterConfig";

import PathfinderScreen from "../../components/Printer/PathfinderScreen";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useAccountService } from "../../contexts/AccountService";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useRoute } from "@react-navigation/native";
import { PrinterType } from "screen/home";

interface PrinterScreenProps { }

const PrinterScreen: React.FC<PrinterScreenProps> = (props) => {
  const { getUserStoreId } = useAccountService();
  const { allStore } = useApplicationGlobalService();
  const store = allStore.find(
    (x) => x.werks === getUserStoreId()
  );
  const route = useRoute();
  const [selectedPage, setselectedPage] = useState(-1)  
  useEffect(() => {
    if (route.params) {
      //@ts-ignore
      const { page } = route.params;
      setselectedPage(page);
    }
  }, [route.params])
  if (Platform.OS === "web") return null;
  return (
    <View style={styles.container}>
      {getUserStoreId() === "8801" || store?.country === "RU" ? 
      selectedPage === PrinterType.MERTECH ? 
      (<MertechPrinterConfig />) : 
      (<PathfinderScreen/>) : 
      Platform.OS === "ios" ? (
        <IosPrinterConfig />
      ) : (
        <AndroidPrinterConfig />
      )}
    </View>
  );
};
export default PrinterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

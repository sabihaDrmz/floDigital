import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Octicons } from "../../components";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";

const DevicePicker: React.FC<{
  devices: any[];
  onSelectDevice: (device: any) => void;
  selectedDevice?: any;
}> = (props) => {
  const PrinterConfigService = usePrinterConfigService();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(props.selectedDevice);
  const devicelist = [...props.devices];

  if (
    PrinterConfigService.selectedPrinter &&
    devicelist.includes(
      (x: any) => x.name === PrinterConfigService.selectedPrinter.name
    )
  )
    devicelist.push(PrinterConfigService.selectedPrinter);

  if (selectedDevice !== props.selectedDevice)
    setSelectedDevice(props.selectedDevice);
  return (
    <View style={{ backgroundColor: "#fff", height: !showDropdown ? 52 : 152 }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <View style={styles.container}>
          <Text style={styles.deviceTitle}>
            {selectedDevice === null ||
              (selectedDevice === undefined
                ? translate("printerConfig.pleaseSelectDevice")
                : selectedDevice?.name)}
          </Text>
          <View style={styles.dropdownIco}>
            <Octicons
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={30}
              color={"#fff"}
            />
          </View>
        </View>
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.dropdown}>
          {props.devices.length <= 0 && (
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: PerfectFontSize(18),
                color: "#6f7070",
              }}
            >
              Kullanılabilir cihaz yok
            </Text>
          )}
          <ScrollView bounces={false}>
            {devicelist.map((x, index) => {
              return (
                <View key={index.toString()}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDevice(x);
                      setShowDropdown(false);
                      props.onSelectDevice(x);
                    }}
                    hitSlop={{ bottom: 15 }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: PerfectFontSize(18),
                        fontWeight: "bold",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#6f7070",
                        marginTop: 15,
                      }}
                    >
                      {x?.name}
                    </Text>
                  </TouchableOpacity>
                  {props.devices.length - 1 < index && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#e4e4e4",
                        marginTop: 15,
                      }}
                    />
                  )}
                </View>
              );
            })}
            <View style={{ height: 200 }} />
          </ScrollView>
        </View>
      )}
    </View>
  );
};
export default DevicePicker;

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#c1bdbd",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dropdownIco: {
    width: 53,
    height: 52,
    borderRadius: 4,
    backgroundColor: "rgba(168, 168, 168,1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  deviceTitle: {
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(14),
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  dropdown: {
    borderRadius: 11,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.16)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    padding: 20,
    height: 150,
  },
});

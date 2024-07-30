/* eslint-disable no-bitwise */
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import Characteristic from '../Characteristic';
import StickerAccordion from './StickerAccordion';
import { DiscountIcon, NewIcon } from '../CustomIcons/MainPageIcons';
import { FloButton } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { AppColor } from '../../theme/AppColor';
import StickerCard from './StickerCard';
import { PrinterConfigProp } from '../../contexts/model/PrinterConfigGroupModel';
import { usePrinterConfigService } from '../../contexts/PrinterConfigService';
import { translate } from '../../helper/localization/locaizationMain';
import FloHeaderNew from '../Header/FloHeaderNew';
'../../components/PrinterHeader'
import PrinterHeader from '../../components/PrinterHeader'
import DevicePicker from './DevicePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

//@ts-ignore
import { useBluetoothModuleService } from '../../contexts/BluetoothModuleService';

import PrinterImagePopup from "./PrinterImagePopup";
import { useMessageBoxService } from '../../contexts/MessageBoxService';
import { MessageBoxType } from '../../contexts/model/MessageBoxOptions';

const MertechPrinterConfig = () => {
  const { printerConfigList, loadAllPrinterConfigs, selectedPrinter, setPrintConfig } = usePrinterConfigService();
  const [isConnected, setIsConnected] = useState(false);
  const [scaning, setScaning] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [connectingId, setConnectingId] = useState('');
  const [writeData, setWriteData] = useState('');
  const [receiveData, setReceiveData] = useState('');
  const [readData, setReadData] = useState('');
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const bleReceiveData = useRef([]);
  const { show } = useMessageBoxService();


  const { bleManager, stopScan, peripheralId, nofityServiceUUID, nofityCharacteristicUUID, connectDevice, disconnectDevice, requestPermissions } = useBluetoothModuleService();

  const deviceMap = useRef(new Map());
  const scanTimer = useRef();
  const disconnectListener = useRef();
  const monitorListener = useRef();

  const [config, setConfig] = useState<PrinterConfigProp>({
    id: 0,
    alias: "",
    title: "",
    contents: "",
    image: "",
    siteId: 0,
    config: "",
    twiceGroup: null,
  });
  const [image, setImage] = useState<any>();
  const [showImageModal, setShowImageModal] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState<any>([]);
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const stateChangeListener = bleManager.onStateChange(state => {
      console.log('onStateChange: ', state);

    });
    return () => {
      var _a, _b;
      stateChangeListener === null || stateChangeListener === void 0 ? void 0 : stateChangeListener.remove();
      (_a = disconnectListener.current) === null || _a === void 0 ? void 0 : _a.remove();
      (_b = monitorListener.current) === null || _b === void 0 ? void 0 : _b.remove();
    };
  }, []);
  useEffect(() => {
    requestPermissions()
  }, [isConnected])

  useEffect(() => {
    if (!isLoading) {
      loadAllPrinterConfigs();

      if (
        selectedPrinter &&
        selectedPrinter !== selectedDevice
      ) {
        setSelectedDevice(selectedPrinter);
        setDevices([selectedPrinter])
        setIsConnected(true)
      }

      setIsLoading(true);
    }
    return () => {
    };
  }, []);


  const scan = async () => {
    try {

      scanDevice()

    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  const saveSettings = async () => {
    bleManager.stopDeviceScan();
    await AsyncStorage.setItem(
      "@flo_ru_printer_info",
      JSON.stringify({ alias: "Label" })
    );
    //@ts-ignore
    if (selectedDevice?.id)
      //@ts-ignore
      await connectDevice(selectedDevice?.id)
    setPrintConfig(selectedDevice, config);
  };

  async function findDevices() {

  };

  const scanDevice = async () => {
    setScaning(true);
    deviceMap.current.clear();
    await bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("error", error)

        setScaning(false);
      }
      else if (device) {
        if (device.name != null) {
          deviceMap.current.set(device.id, device);
          setData([...deviceMap.current.values()]);
        }
        if (
          !error &&
          device &&
          device.name &&
          device.serviceUUIDs &&
          device.serviceUUIDs.length > 0
        ) {

          setDevices((prevDevices: any) => {
            if (
              prevDevices.some(
                (prevDevice: any) => prevDevice.id === device.id
              )
            )
              return prevDevices;

            return [
              ...prevDevices,
              {
                id: device.id,
                //@ts-ignore
                deviceUUID: device.serviceUUIDs[0],
                name: device.name,
                localName: device.localName,
              },
            ];
          });
        }
      }
    });
    scanTimer.current && clearTimeout(scanTimer.current);
    //@ts-ignore
    scanTimer.current = setTimeout(() => {
      stopScan();
      setScaning(false);
    }, 8000);
  }
  function enableBluetooth() {
    if (Platform.OS === 'ios') {
      show(translate("mertechPrinter.bluetoothEnable"))
    }
    else {
      show(
        translate("mertechPrinter.bluetoothEnable"),
       {
        type: MessageBoxType.YesNo,
        yesButtonTitle: translate("mertechPrinter.open"),
        noButtonTitle: translate("mertechPrinter.cancel"),
        yesButtonEvent: () => {
          bleManager.enable();
        },
        noButtonEvent: () => {
        }
       }
      )
    }
  }
  function monitor(index) {
    monitorListener.current = bleManager.monitorCharacteristicForDevice(peripheralId, nofityServiceUUID[index], nofityCharacteristicUUID[index], (error, characteristic) => {
      if (error) {
        setIsMonitoring(false);
        console.log('monitor fail:', error);
        Alert.alert('monitor fail: ' + error.reason);
      }
      else {
        setIsMonitoring(false);
        bleReceiveData.current.push(characteristic.value); //数据量多的话会分多次接收
        setReceiveData(bleReceiveData.current.join(''));
        console.log('monitor success', characteristic.value);
      }
    });
  }
  /** 监听蓝牙断开 */
  function onDisconnect() {
    disconnectListener.current = bleManager.onDeviceDisconnected(peripheralId, (error, device) => {
      var _a;
      if (error) {
        // 蓝牙遇到错误自动断开
        console.log('device disconnect', error);
        initData();
      }
      else {
        (_a = disconnectListener.current) === null || _a === void 0 ? void 0 : _a.remove();
        console.log('device disconnect', device?.id, device?.name);
      }
    });
  }
  /** 断开蓝牙连接 */
  function disconnect() {
    disconnectDevice();
    initData();
  }
  function initData() {
    // 断开连接后清空UUID
    // bleModule.initUUID();
    // 断开后显示上次的扫描结果
    setData([...deviceMap.current.values()]);
    setIsConnected(false);
    setWriteData('');
    setReadData('');
    setReceiveData('');
    setInputText('');
  }
  function renderItem(item) {
    const data = item.item;
    const disabled = !!connectingId && connectingId !== data.id;
    return (React.createElement(TouchableOpacity, {
      activeOpacity: 0.7, disabled: disabled || isConnected, onPress: () => {
        // connect(data);

        if (scaning) {
          stopScan();
          setScaning(false);
        }
        setConnectingId(data.id);
        setData([data]);
        setSelectedDevice(data)
        setDevices([data])
        setIsConnected(true);
        // 正在连接中
        setConnectingId(data.id);
        setTimeout(() => {
          setConnectingId('')
        }, 1000);
      }, style: [styles.item, { opacity: disabled ? 0.5 : 1}]
    },
      React.createElement(View, { style: { flexDirection: 'row' } },
        React.createElement(Text, { style: { color: 'black' } }, data.name ? data.name : 'İsimsiz Cİhaz'),
        React.createElement(Text, { style: { marginLeft: 50, color: 'red' } }, connectingId === data.id ? 'Bağlanıyor...' : '')),
      React.createElement(Text, null, data.id)));
  }
  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        headerTitle={translate("moreScreen.printerConfig")}
        enableButtons={["back"]}
      />
      <PrinterHeader isConnected={isConnected} scaning={scaning} disabled={scaning || !!connectingId} onPress={isConnected ? disconnect : scan}></PrinterHeader>
      <FlatList
        keyExtractor={item => item.id}
        data={devices}
        renderItem={renderItem}
        extraData={connectingId}
        style={{ maxHeight: Dimensions.get("window").height / 4 }}

      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: Dimensions.get("window").height / 3,paddingHorizontal:20}}
      >
        {printerConfigList.map((x) => {
          const uniqueTwiceGroups = {};
          const filteredPrinterConfigProps = [];
          for (const printerConfigProp of x.ptcConfigs) {
            const { twiceGroup } = printerConfigProp;
            if (twiceGroup) {
              if (!uniqueTwiceGroups[twiceGroup]) {
                uniqueTwiceGroups[twiceGroup] = true;
                //@ts-ignore
                filteredPrinterConfigProps.push(printerConfigProp);
              }
            } else {
              //@ts-ignore
              filteredPrinterConfigProps.push(printerConfigProp);
            }
          }
          return (
            <StickerAccordion
              title={x.name}
              items={filteredPrinterConfigProps}
              icon={
                x.icon === "discount" ? (
                  <DiscountIcon />
                ) : x.icon === "season" ? (
                  <NewIcon />
                ) : (
                  <FontAwesomeIcon
                    icon={"indent-more"}
                    size={30}
                    color={AppColor.FD.Brand.Solid}
                  />
                )
              }
              renderItem={(item, index) => {
                return (
                  <StickerCard
                    //@ts-ignore
                    selectedTag={config?.id}
                    onSelect={() => {
                      setConfig(item);
                    }}
                    sticker={item}
                    onImageClick={() => {
                      setImage({
                        uri: item.image,
                      });
                      setShowImageModal(true);
                    }}
                  />
                );
              }}
            />
          );
        })}
      </ScrollView>
      {showImageModal && (
        <PrinterImagePopup
          onClose={() => setShowImageModal(false)}
          image={image}
        />
      )}
      <View
        style={{
          marginLeft: 20,
          marginRight: 20,
          ...Platform.select({ android: { marginBottom: 10 } }),
        }}
      >
        <FloButton
          onPress={saveSettings}
          activeOpacity={0.8}
          title={translate("printerConfig.setSetingsAndPrintBarcode")}
        />
      </View>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'column',
    borderColor: 'rgb(235,235,235)',
    borderStyle: 'solid',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    paddingVertical: 8,
  },
});
export default MertechPrinterConfig;


import {  Platform } from "react-native";
import { create } from 'zustand';
//@ts-ignore
import { usePrinterConfigService } from "./PrinterConfigService";
import { Buffer } from 'buffer';
//TODO: EXPO Device
//import * as ExpoDevice from "expo-device"
import DeviceInfo from 'react-native-device-info';



interface BluetoothModuleServiceModel {
    bleManager: null;
    readServiceUUID: any[];
    readCharacteristicUUID: any[],
    writeWithResponseServiceUUID: any[],
    writeWithResponseCharacteristicUUID: any[],
    writeWithoutResponseServiceUUID: any[],
    writeWithoutResponseCharacteristicUUID: any[],
    nofityServiceUUID: any[];
    nofityCharacteristicUUID: any[];
    peripheralId: string | undefined;
    fetchServicesAndCharacteristicsForDevice: (device:any) => Promise<any>;
    getUUID: (services:any[]) => any;
    connectDevice: (id: any) => Promise<any>;
    write: (value:any, index:number) => void;
    writeBLECharacteristicValue: (peripheralId: string | undefined, writeWithResponseServiceUUID: any, writeWithResponseCharacteristicUUID: any, data: string) => Promise<any>;
    requestAndroid31Permissions: () => Promise<any>;
    scanForPeriphals: () => void;
    stopScan: () => void;
    disconnectDevice: () => Promise<void>;
    requestPermissions: () => Promise<boolean>;
}

export const useBluetoothModuleService = create<BluetoothModuleServiceModel>((set, get) => ({
    bleManager: null,
    readServiceUUID: [],
    readCharacteristicUUID: [],
    writeWithResponseServiceUUID: [],
    writeWithResponseCharacteristicUUID: [],
    writeWithoutResponseServiceUUID: [],
    writeWithoutResponseCharacteristicUUID: [],
    nofityServiceUUID: [],
    nofityCharacteristicUUID: [],
    peripheralId: undefined,
    fetchServicesAndCharacteristicsForDevice: async (device: any) => {
        var servicesMap = {};
    var services = await device.services();
    for (let service of services) {
        var characteristicsMap = {};
        var characteristics = await service.characteristics();
        const a = characteristics.filter((item: { isWritableWithoutResponse: any; }) => item.isWritableWithoutResponse )
        for (let characteristic of a) {
            if(characteristic.isWritableWithResponse){
                //@ts-ignore
                characteristicsMap[characteristic.uuid] = {
                    uuid: characteristic.uuid,
                    isReadable: characteristic.isReadable,
                    isWritableWithResponse: characteristic.isWritableWithResponse,
                    isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
                    isNotifiable: characteristic.isNotifiable,
                    isNotifying: characteristic.isNotifying,
                    value: characteristic.value,
                };
            }
        }
        //@ts-ignore
        servicesMap[service.uuid] = {
            uuid: service.uuid,
            isPrimary: service.isPrimary,
            characteristicsCount: characteristics.length,
            characteristics: characteristicsMap,
        };
    }
    return servicesMap;
    },
    getUUID: (services:any[]) => {
        for (let i in services) {
            let charchteristic = services[i].characteristics;
            console.log("charchteristic",charchteristic)
            for (let j in charchteristic) {
                if (charchteristic[j].isReadable) {
                    set((state) => ({
                        ...state,
                        readServiceUUID: [...state.readServiceUUID,services[i].uuid],
                        readCharacteristicUUID: [...state.readCharacteristicUUID,charchteristic[j].uuid]
                    }));
                }
                if (charchteristic[j].isWritableWithResponse) {
                    set((state) => ({
                        ...state,
                        writeWithResponseServiceUUID: [...state.writeWithResponseServiceUUID,services[i].uuid],
                        writeWithResponseCharacteristicUUID: [...state.writeWithResponseCharacteristicUUID,charchteristic[j].uuid]
                    }));
                }
                if (charchteristic[j].isWritableWithoutResponse) {
                    set((state) => ({
                        ...state,
                        writeWithoutResponseServiceUUID: [...state.writeWithoutResponseServiceUUID,services[i].uuid],
                        writeWithoutResponseCharacteristicUUID: [...state.writeWithoutResponseCharacteristicUUID,charchteristic[j].uuid]
                    }));
                }
                if (charchteristic[j].isNotifiable) {
                    set((state) => ({
                        ...state,
                        nofityServiceUUID: [...state.nofityServiceUUID,services[i].uuid],
                        nofityCharacteristicUUID: [...state.nofityCharacteristicUUID,charchteristic[j].uuid]
                    }));
                }
            }
        }
    },
   connectDevice: async (id:any) => {
    const { bleManager,fetchServicesAndCharacteristicsForDevice,getUUID } = get();
        return new Promise((resolve, reject) => {
            //@ts-ignore
            bleManager
                .connectToDevice(id)
                .then(device => {
                console.log('connect success:', device);
                set((state) => ({
                    ...state,
                    peripheralId: device.id
                }));
                return device.discoverAllServicesAndCharacteristics();
            })
                .then(device => {
                console.log('charestristic success:', device);

                return fetchServicesAndCharacteristicsForDevice(device);
            })
                .then(services => {
                console.log('fetchServicesAndCharacteristicsForDevice', services);
                //@ts-ignore
                getUUID(services);
                //@ts-ignore
                resolve();
            })
                .catch(err => {
                console.log('connect fail: ', err);
                reject(err);
            });
        });
    },
    stopScan: () => {
        const { bleManager } = get();
            //@ts-ignore
        bleManager.stopDeviceScan();
    },
    disconnectDevice: async () => {
        const { bleManager,peripheralId } = get();
        if(peripheralId){
            //@ts-ignore
            bleManager
            .cancelDeviceConnection(peripheralId ?? "0")
            .then(res => {
            console.log('disconnect success', res);
        })
            .catch(err => {
            console.log('disconnect fail', err);
        });
        }

    },
    write: (value:any, index:number) =>  {
        const { bleManager,peripheralId,writeBLECharacteristicValue,writeWithResponseServiceUUID,writeWithResponseCharacteristicUUID } = get();

        let formatValue = null;
        if (value === '0D0A') {
            //直接发送小票打印机的结束标志
            formatValue = value;
        }
        else {
            //Zpl
            // PrinterZpl.data = ' ~SD15  ^XA ^MMT ^PW320^LL0480 ^LS-5 ^LT-15 ^FT285,390^A@I,13,16,E:HELV65.TTF^FH^FDPesin Fiyat^FS ^FO255,300^GFA,00512,00512,00008,:Z64: eJxjYBjugJG9AcKQg9IWUDoBSh+E0gfQ6IYZUAM+QGjmDqg5PyC08QEILQ9VbwClGVBpRkYYfzACADsXDe4=:B723 ^FO155,240^GFA,00512,00512,00008,:Z64: eJxjYBi5oAZK/4FQjD0QmpkHQrOh0SxoNA9/A4QhBzWnFsJnPA/l20DNfQOlofoYcNEDAQDgYwY5:576D ^FO255,190^GFA,00256,00256,00008,:Z64:eJxjYKA54G+A0LJQ2hBKJ0Lpg2h0I4RmbJwA4TM/gNDsUL7tBwitDlUvj2YuIw4aKwAAGOgNdQ==:31D5 ^FO95,155^GFA,00512,00512,00008,:Z64:eJxjYBj6wA5Kl0HpYxCKsQ1CM7Oh0kxQmo3NAcLgb4DQclD+9wMQeh7UvDpUcxnYcNBDEQAA7D0HAA==:E5D1 ^FO180,305^A0I,80,60^FH^FD899.^FS^FT190,345^A0I,50,40^FH^FD99^FS ^FO60,250^A0I,80,70^FH^FD899.^FS ^FT70,290^A0I,50,40^FH^FD99^FS ^FO25,260^GB260,1,1^FS ^FO190,190^A0I,45,45^FH^FD998.^FS ^FT200,210^A0I,30,30^FH^FD99^FS ^FO50,170^A0I,45,45^FH^FD998.^FS ^FT60,190^A0I,30,30^FH^FD99^FS  ^FO25,175^GB260,1,1^FS ^FT285,160^A@I,13,14,E:HELV65.TTF^FH^FDFiyat Olusturma Tarihi :^FS ^FT120,160^A@I,14,15,E:HELV65.TTF^FH^FD29.02.2024^FS ^FT285,145^A@I,14,14,E:HELV65.TTF^FH^FD8P VOTEN W,SIYAH/K GRI, 38 NUMARA^FS  ^FT285,130^A@I,14,14,E:HELV65.TTF^FH^FDFiyatlarimiza KDV Dahildir.^FS  ^FT285,115^A@I,14,14,E:HELV65.TTF^FH^FDUretim Yeri :^FS ^FT200,115^A@I,14,14,E:HELV65.TTF^FH^FD^FS ^FT285,100^A@I,14,14,E:HELV65.TTF^FH^FD100232645003^FS ^FO26,100^FD^FS ^FT285,245^A@I,13,16,E:HELV65.TTF^FH^FDTaksitli Fiyat^FS ^LRN  ^FO140,330^GD119,46,14,,R^FS^FO140,330^GD119,46,14,,L^FS ^FO155,190^GD110,46,10,,R^FS^FO155,190^GD110,46,10,,L^FS ^BY2,3,38^FT275,57 ^BEI,,Y,N  ^FD8680733650189^FS             ^LRY  ^FO30,50^GB10,10,45^FS ^FO35,55^AC^A@I,30,20^FD38^FS ^PQ1,0,1,Y^XZ'
            // PrinterZpl.data = '^XA     ^MMT     ^PW400     ^LL0240     ^LS0     ^FT330,260^A0I,22,14^FH^FDUretim Yeri: Turkiye^FS     ^FT330,240^A0I,22,14^FH^FD<NIKE LEGEND ESSENTIAL 2>^FS     ^FT330,220^A0I,22,14^FH^FD Kırmızı - 35^FS           ^BY2,3,85^FT325,100     ^barcodeTypeI,,Y,N     ^FD1234567890123^FS        ^PQ1,0,1,Y^XZ'


            let printData = value;


        }
    },
    writeBLECharacteristicValue: async (peripheralId: string | undefined, writeWithResponseServiceUUID: any, writeWithResponseCharacteristicUUID: any, data: string) => {
        const { bleManager } = get();
        const id = usePrinterConfigService.getState().selectedPrinter.id
        const deviceUUID = usePrinterConfigService.getState().selectedPrinter.deviceUUID

        // console.log("uuid",writeWithResponseServiceUUID,writeWithResponseCharacteristicUUID,peripheralId,id)
         console.log("uuid2",writeWithResponseServiceUUID,writeWithResponseCharacteristicUUID,peripheralId,id,deviceUUID)
         let deviceId:any;
            //@ts-ignore
        await bleManager.connectedDevices([deviceUUID]).then(device => {
            deviceId = device[0].id
        })
      return new Promise((resolve, reject) => {
            //@ts-ignore
            bleManager
                .writeCharacteristicWithResponseForDevice(deviceId ?? "0",  "0000ff00-0000-1000-8000-00805f9b34fb", "0000ff02-0000-1000-8000-00805f9b34fb", data)
                .then(characteristic => {
                    resolve(characteristic);
            }, error => {
                reject(error);
            });
        });
    },
    requestAndroid31Permissions: async () => {
        return null;
    },
    requestPermissions: async () => {
            return null;
    },
    scanForPeriphals: () => {
    const { bleManager } = get();
         //@ts-ignore
        bleManager.startDeviceScan(null,null, (error,device) => {
            if(error) console.log("ble error",error)
            if(device) console.log("device with hook",device);
        })
    }


}));

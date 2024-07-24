import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { Host } from "react-native-portalize";
import { MediaSelectorProvider } from "./components/MediaSelector/MediaSelector";
import { navigationRef } from './core/RootNavigation';
import MessageBox from "./screen/messagebox/MessageBox";
import { ActivityIndicator,View, NativeEventEmitter, NativeModules, Platform } from "react-native";
import { SystemApi, useAccountService } from "./contexts/AccountService";
//TODO: EXPO pathfinder
// import * as Pathfinder from "@flomagazacilik/flo-pathfinder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useMessageBoxService } from "./contexts/MessageBoxService";
import { translate } from "./helper/localization/locaizationMain";
import VersionErrorModal from "./components/Modal/VersionErrorModal";

const App = () => {
  const [onLoadComplete, setOnloadComplete] = useState(false);
  //TODO: EXPO fcm
  // const FcmService = useFcmService.getState();
  const AccountService = useAccountService.getState();
  const MessageBoxService = useMessageBoxService.getState();
  try {
    const headTag = document.querySelector("head");
    const icon = document.createElement("link");
    const attributeRel = document.createAttribute("rel");
    attributeRel.value = "shortcut icon";

    const attributeType = document.createAttribute("type");
    attributeType.value = "image/png";

    const attributeHref = document.createAttribute("href");
    attributeHref.value = "./web-logo.png";

    icon.setAttributeNode(attributeRel);
    icon.setAttributeNode(attributeType);
    icon.setAttributeNode(attributeHref);
    headTag.appendChild(icon);
  } catch (e) {
  }

  useEffect(() => {

    const loadPathfinderAssets = async () => { };


    if (!onLoadComplete) {
      //loadPathfinderAssets().then(() => {
      setOnloadComplete(true);
      //});
    }

  });


  //TODO: EXPO notification
  /*exNotification.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  exNotification.addNotificationReceivedListener((data) => ForegoundMessageParse(data, FcmService, AccountService));
  exNotification.addNotificationResponseReceivedListener((evt) => {
    notificationEvent(evt.notification.request.content.data, navigationRef, AccountService, FcmService);

  });

   */



  useEffect(() => {
    /*
        const listener = Platform.select({
          android: () => undefined,
          ios: () =>
            Pathfinder.onReceive((resBarcode: any) => {
              if (resBarcode.barcode === "N") return;

              const barcode = resBarcode.barcode + checkdigit(resBarcode.barcode);
              SystemApi.post("label", {
                barcode: barcode,
                date: new Date(),
                storeCode: AccountService.getUserStoreId(),
              })
                .then(({ data }) => {
                  if (!data) return;
                  AsyncStorage.getItem("@flo_ru_printer_info").then((rawSaveData) => {
                    if (rawSaveData != null) {
                      const parsedSaveData = JSON.parse(rawSaveData);
                      const d = moment();
                      var printData = `${data.price};${d.format("YYYY")}-${d.format(
                        "MM"
                      )}-${d.format("DD")};${maxLengthCheck(
                        data.landx,
                        14
                      )};${maxLengthCheck(data.matkl, 14)};${data.size
                      };${maxLengthCheck(data.ztaban, 14)};${maxLengthCheck(
                        data.zicastar,
                        14
                      )};${maxLengthCheck(data.fiberCode, 14)};${Number(
                        data.matnr
                      )};${barcode}`;

                      if (parsedSaveData.alias === "LabelDiscount") {
                        printData = `${data.price};${data.oldPrice};${d.format(
                          "YYYY"
                        )}-${d.format("MM")}-${d.format("DD")};${maxLengthCheck(
                          data.landx,
                          14
                        )};${maxLengthCheck(data.matkl, 14)};${data.size
                        };${maxLengthCheck(data.ztaban, 14)};${maxLengthCheck(
                          data.zicastar,
                          14
                        )};${maxLengthCheck(data.fiberCode, 14)};${Number(
                          data.matnr
                        )};${barcode}`;
                      }

                      Pathfinder.print(
                        printData,
                        //"STD;22.11.2022;5999;Турция;3999;BX;СИНТЕТИЧЕСКИЙ ТЕКСТИЛЬ;FiberPart2;FiberPart1;100000268;ЛЕГГИНСЫ;8683121136074",
                        parsedSaveData.alias,
                        1
                      );
                    }
                  });
                })
                .catch((err: any) => console.log(err));
            }),

        });

        listener && listener();
    */
    const printerErrorLister = Platform.select({
      ios: () => {
        /*
          const emitter = new NativeEventEmitter(NativeModules.FloPathfinder);

          emitter.addListener("addErrorListener", (evt) => {
            if (evt.errorType === "1") {
              MessageBoxService.show(translate("errorMsgs.printerConnectionLost"));
            } else if (evt.errorType === "2") {
              MessageBoxService.show(translate("errorMsgs.printerUnexceptedError"));
            } else if (evt.errorType === "3") {
              MessageBoxService.show(translate("errorMsgs.printerUnexceptedError"));
            }
          });
          */
      },
    });

    printerErrorLister && printerErrorLister();
  }, [])

  function checkdigit(input: string) {
    let array = input.split("").reverse();

    let total = 0;
    let i = 1;
    array.forEach((number: any) => {
      number = parseInt(number);
      if (i % 2 === 0) {
        total = total + number;
      } else {
        total = total + number * 3;
      }
      i++;
    });

    return Math.ceil(total / 10) * 10 - total;
  }

  function maxLengthCheck(str: string, maxLength: number = 30) {
    if (str && str.length > maxLength) return str.substring(0, maxLength);

    return str;
  }

  if (onLoadComplete )
    return (
      <NavigationContainer ref={navigationRef}>
        <Host>
          <MediaSelectorProvider>
            <StackNavigator />
          </MediaSelectorProvider>
          <MessageBox />
          <VersionErrorModal />
        </Host>
      </NavigationContainer>
    );
  else return (
    <View style={{flex:1, justifyContent:'center'}}>
      <ActivityIndicator
        color={'#ff9100'}
        size={"large"}
      />
    </View>
  );
}

export default App


import React, { createContext, useContext, useState } from "react";
import { MessageBoxOptions, MessageBoxType } from "./model/MessageBoxOptions";
import BlurView from "../components/BlurView";
import { View, useWindowDimensions } from "react-native";
import ErOrderNotFound from "../components/Modal/MessageBoxs/ErOrderNotFound";
import ErNotComplete from "../components/Modal/MessageBoxs/ErNotComplete";
import ErNotValidStatus from "../components/Modal/MessageBoxs/ErNotValidStatus";
import ErQty from "../components/Modal/MessageBoxs/ErQty";
import ErSuccess from "../components/Modal/MessageBoxs/ErSuccess";
import ErVirement from "../components/Modal/MessageBoxs/ErVirement";
import MbStandart from "../components/Modal/MessageBoxs/MbStandart";
import MbBasketNumber from "../components/Modal/MessageBoxs/MbBasketNumber";
import MbYesNo from "../components/Modal/MessageBoxs/MbYesNo";
import MbSmsValidation from "../components/Modal/MessageBoxs/MbSmsValidation";
import MbOmsComplete from "../components/Modal/MessageBoxs/MbOmsComplete";
import MbStockOutValidation from "../components/Modal/MessageBoxs/MbStockOutValidation";
import { create } from "zustand";
interface MessageBoxServiceModel {
    isShow: boolean;
    message: string;
    options?: MessageBoxOptions;
    smsValidationCode: number;
    show: (message: string, options?: MessageBoxOptions) => void;
    hide: () => void;
}

export const useMessageBoxService = create<MessageBoxServiceModel>((set, get) => ({
    isShow: false,
    message: "",
    options: undefined,
    smsValidationCode: 0,
    show: (message: string, options?: MessageBoxOptions) => {
        set((state) => ({
            ...state,
            isShow: true,
            message: message,
            options: options
        }));
    },
    hide: () => {
        const { options } = get();
        set((state) => ({
            ...state,
            isShow: false,
            message: "",
        }));

        if (options !== undefined && options.onHide !== undefined) {
            setTimeout(options.onHide, 200);
        }
        set((state) => ({
            ...state,
            options: undefined,
        }));
    },
}));

// const { width, height } = useWindowDimensions();

// {isShow && (
//     <BlurView
//         style={{
//             position: "absolute",
//             width,
//             height,
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 9999,
//         }}
//     >
//         {options &&
//             options.type !== undefined &&
//             options.type === MessageBoxType.Standart && (
//                 <MbStandart options={options} message={message} />
//             )}
//         {options &&
//             options.type !== undefined &&
//             options.type === MessageBoxType.YesNo && (
//                 <MbYesNo options={options} message={message} />
//             )}
//         {options &&
//             options.type !== undefined &&
//             options.type === MessageBoxType.OrderNotFound && (
//                 <View>
//                     {(options?.customParameters?.type === undefined ||
//                         options?.customParameters?.type === "1") && (
//                             <ErOrderNotFound />
//                         )}
//                     {options?.customParameters?.type !== undefined &&
//                         options?.customParameters?.type === "2" && <ErVirement />}
//                     {options?.customParameters?.type !== undefined &&
//                         options?.customParameters?.type === "3" && (
//                             <ErNotValidStatus />
//                         )}
//                     {options?.customParameters?.type !== undefined &&
//                         options?.customParameters?.type === "4" && <ErQty />}
//                     {options?.customParameters?.type !== undefined &&
//                         options?.customParameters?.type === "10" && <ErNotComplete />}
//                     {options?.customParameters?.type !== undefined &&
//                         options?.customParameters?.type === "11" && <ErSuccess />}
//                 </View>
//             )}

//         {options &&
//             options.type !== undefined &&
//             options.type === MessageBoxType.SmsValidation && (
//                 <MbSmsValidation />
//             )}
//         {/* Eğer messagebox ayarı yapılmadıysa */}
//         {(options === undefined || options.type === undefined) && (
//             <MbStandart options={options} message={message} />
//         )}

//         {options &&
//             options.type !== undefined &&
//             options.type === MessageBoxType.BasketNumber && (
//                 <MbBasketNumber options={options} message={message} />
//             )}

//         {options &&
//             options.type !== undefined &&
//             options.type === MessageBoxType.OmsComplete && (
//                 <MbOmsComplete options={options} message={message} />
//             )}

//         {options &&
//             options.type !== undefined &&
//             options.type === MessageBoxType.StockOutValidation && (
//                 <MbStockOutValidation options={options} message={message} />
//             )}
//     </BlurView>
// )}

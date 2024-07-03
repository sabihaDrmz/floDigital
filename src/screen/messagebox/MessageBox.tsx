import MbIsoReturn from "components/Modal/MessageBoxs/MbIsoReturn";
import { BlurView } from "expo-blur";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    useWindowDimensions
} from "react-native";
import ErNotComplete from "../../components/Modal/MessageBoxs/ErNotComplete";
import ErNotValidStatus from "../../components/Modal/MessageBoxs/ErNotValidStatus";
import ErOrderNotFound from "../../components/Modal/MessageBoxs/ErOrderNotFound";
import ErQty from "../../components/Modal/MessageBoxs/ErQty";
import ErSuccess from "../../components/Modal/MessageBoxs/ErSuccess";
import ErVirement from "../../components/Modal/MessageBoxs/ErVirement";
import MbBasketNumber from "../../components/Modal/MessageBoxs/MbBasketNumber";
import MbOmsComplete from "../../components/Modal/MessageBoxs/MbOmsComplete";
import MbSmsValidation from "../../components/Modal/MessageBoxs/MbSmsValidation";
import MbStandart from "../../components/Modal/MessageBoxs/MbStandart";
import MbStockOutValidation from "../../components/Modal/MessageBoxs/MbStockOutValidation";
import MbYesNo from "../../components/Modal/MessageBoxs/MbYesNo";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";

interface MessageBoxProps {

}

const MessageBox: React.FC<MessageBoxProps> = (props) => {
    const { isShow, options, message } = useMessageBoxService();
    const { width, height } = useWindowDimensions();
    return (
        isShow ? (
            <BlurView
                style={{
                    position: "absolute",
                    width,
                    height,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                }}
            >
                {options &&
                    options.type !== undefined &&
                    options.type === MessageBoxType.Standart && (
                        <MbStandart options={options} message={message} />
                    )}
                {options &&
                    options.type !== undefined &&
                    options.type === MessageBoxType.YesNo && (
                        <MbYesNo options={options} message={message} />
                    )}
                {options &&
                    options.type !== undefined &&
                    options.type === MessageBoxType.OrderNotFound && (
                        <View>
                            {(options?.customParameters?.type === undefined ||
                                options?.customParameters?.type === "1") && (
                                    <ErOrderNotFound />
                                )}
                            {options?.customParameters?.type !== undefined &&
                                options?.customParameters?.type === "2" && <ErVirement />}
                            {options?.customParameters?.type !== undefined &&
                                options?.customParameters?.type === "3" && (
                                    <ErNotValidStatus />
                                )}
                            {options?.customParameters?.type !== undefined &&
                                options?.customParameters?.type === "4" && <ErQty />}
                            {options?.customParameters?.type !== undefined &&
                                options?.customParameters?.type === "10" && <ErNotComplete />}
                            {options?.customParameters?.type !== undefined &&
                                options?.customParameters?.type === "11" && <ErSuccess />}
                        </View>
                    )}

                {options &&
                    options.type !== undefined &&
                    options.type === MessageBoxType.SmsValidation && (
                        <MbSmsValidation />
                    )}
                {/* Eğer messagebox ayarı yapılmadıysa */}
                {(options === undefined || options.type === undefined) && (
                    <MbStandart options={options} message={message} />
                )}

                {options &&
                    options.type !== undefined &&
                    options.type === MessageBoxType.BasketNumber && (
                        <MbBasketNumber options={options} message={message} />
                    )}

                {options &&
                    options.type !== undefined &&
                    options.type === MessageBoxType.OmsComplete && (
                        <MbOmsComplete options={options} message={message} />
                    )}

                {options &&
                    options.type !== undefined &&
                    options.type === MessageBoxType.StockOutValidation && (
                        <MbStockOutValidation options={options} message={message} />
                    )}
                
                {options &&
                    options.type !== undefined &&
                    options.type === MessageBoxType.IsoReturnCode && (
                        <MbIsoReturn options={options} message={message} />
                    )}
            </BlurView>
        ) : null
    )
}
export default MessageBox;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
import {
    AppButton,
    AppColor,
    AppText,
    ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";
import { MessageBoxOptions } from "../../../contexts/model/MessageBoxOptions";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import * as Clipboard from 'expo-clipboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MbIsoReturn: React.FC<{
    message: string;
    options?: MessageBoxOptions;
}> = (props) => {
    const { hide } = useMessageBoxService();
    const { basketTicketId, message } = JSON.parse(props.message);
    const [copyCode, setCopyCode] = useState<boolean>(false)
    const [textColor, setTextColor] = useState<string>("#000");
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(basketTicketId);
        setCopyCode(true)
        setTextColor("#00FF00");
        setTimeout(() => {
            setTextColor("#000");
            setCopyCode(false)
        }, 3000);
    };
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <AppText
                    style={{
                        fontFamily: "Poppins_600SemiBold",
                    }}
                >
                    {message}
                </AppText>
                <AppText
                    style={{
                        fontFamily: "Poppins_600SemiBold",
                    }}
                >
                    Sipariş No
                </AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AppText
                        onPress={copyToClipboard}
                        style={{
                            fontFamily: "Poppins_700Bold",
                            fontSize: 20,
                            color: textColor,
                        }}
                    >
                        {basketTicketId}
                    </AppText>
                    <MaterialCommunityIcons style={{ marginLeft: 5 }} onPress={copyToClipboard} name={copyCode ? "check-circle" : "clipboard-multiple-outline"} size={24} color={textColor} />
                </View>
                <View style={styles.buttonContainer}>
                    <AppButton
                        title={
                            props.options !== undefined &&
                                props.options.yesButtonTitle !== undefined
                                ? props.options.yesButtonTitle
                                : "Tamam"
                        }
                        buttonColorType={
                            props.options !== undefined &&
                                props.options.yesButtonColorType !== undefined
                                ? props.options.yesButtonColorType
                                : ColorType.Brand
                        }
                        onPress={() => {
                            if (props.options && props.options.yesButtonEvent)
                                props.options.yesButtonEvent();

                            hide();
                        }}
                        style={{ width: Dimensions.get("window").width / 2, maxWidth: 350 }}
                    />
                </View>
            </View>
        </View>
    );
};
export default MbIsoReturn;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        flex: 1,
        padding: 20,
        ...Platform.select({
            android: {
                backgroundColor: "rgba(0,0,0,0.5)",
            }
        })
    },
    card: {
        width: Dimensions.get("window").width - 40,
        backgroundColor: "#fff",
        padding: 40,
        borderRadius: 10,
        maxWidth: 400,
        alignItems: "center",
    },
    title: {
        fontSize: PerfectFontSize(16),
        fontFamily: "Poppins_600SemiBold",
        letterSpacing: 0.3,
        color: "#000",
    },
    message: {
        fontSize: PerfectFontSize(20),
        fontFamily: "Poppins_700Bold",
        letterSpacing: 0.3,
        color: "#000",
    },
    description: {
        fontFamily: "Poppins_500Medium",
        letterSpacing: 0.3,
        fontSize: PerfectFontSize(15),
        marginTop: 9,
        textAlign: "center",
        color: AppColor.FD.Text.Ash,
    },
    buttonContainer: {
        marginTop: 10,
    },
});

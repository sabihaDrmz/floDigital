import {
    AppButton,
    AppText,
    ColorType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";


const ErOrderNotFound: React.FC = (props) => {
    const { options, message, hide } = useMessageBoxService();
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {options?.customParameters?.orderNumber !== undefined &&
                    options?.customParameters?.orderNumber !== null &&
                    options?.customParameters?.orderNumber !== "" && (
                        <AppText
                            selectable
                            style={[
                                styles.description,
                                { fontFamily: "Poppins_300Light_Italic" },
                            ]}
                        >
                            #{options?.customParameters?.orderNumber}
                        </AppText>
                    )}
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 20,
                    }}
                >
                    <NotFoundIcon />
                </View>
                <AppText
                    selectable
                    style={[styles.description, { fontSize: 18, marginVertical: 10 }]}
                >
                    {message}
                </AppText>
                <AppText selectable style={{ textAlign: "center" }}>
                    {options?.customParameters?.description}
                </AppText>
                <View
                    style={{
                        marginTop: 20,
                        alignItems: "center",
                    }}
                >
                    <AppButton
                        title={
                            options?.yesButtonTitle &&
                                options?.yesButtonTitle !== ""
                                ? options?.yesButtonTitle
                                : translate("messageBox.ok")
                        }
                        style={{
                            width: Dimensions.get("window").width / 5,
                            marginBottom: 10,
                            height: 60,
                        }}
                        onPress={() => {
                            options && options.yesButtonEvent
                                ? options.yesButtonEvent()
                                : undefined;
                            hide();
                        }}
                        buttonColorType={
                            options && options.yesButtonColorType
                                ? options.yesButtonColorType
                                : ColorType.Brand
                        }
                    />
                </View>
            </View>
        </View>
    )
}
export default ErOrderNotFound;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        flex: 1,
        padding: 20,
    },
    card: {
        width: Dimensions.get("window").width - 40,
        backgroundColor: "#fff",
        padding: 16,
        maxWidth: 400,
        borderRadius: 10,
    },
    title: {
        fontFamily: "Poppins_700Bold",
        letterSpacing: 0.3,
    },
    description: {
        fontFamily: "Poppins_700Bold",
        letterSpacing: 0.3,
        fontSize: PerfectFontSize(15),
        marginTop: 9,
        textAlign: "center",
    },
});

const NotFoundIcon: React.FC = (props) => {
    return (
        <Image
            style={{ width: 72, height: 83 }}
            source={require("../../../assets/notfoundorder.png")}
        />
    );
};

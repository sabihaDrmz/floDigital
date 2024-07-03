import {
    AppButton,
    AppText,
    ColorType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";
import { useEasyReturnService } from "../../../contexts/EasyReturnService";


const ErNotComplete: React.FC = (props) => {
    const { options, message, hide } = useMessageBoxService();
    const EasyReturnService = useEasyReturnService();
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 20,
                    }}
                >
                    <Ico />
                </View>
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
                <AppText
                    selectable
                    style={{ textAlign: "center", fontFamily: "Poppins_300Light_Italic" }}
                >
                    {message}
                </AppText>
                <AppText
                    selectable
                    style={[styles.description, { fontSize: 14, marginVertical: 10 }]}
                >
                    {options?.customParameters?.description}
                </AppText>

                <View
                    style={{
                        marginTop: 20,
                        alignItems: "center",
                    }}
                >
                    <AppButton
                        title={"Tümünü Okut"}
                        style={{
                            width: Dimensions.get("window").width / 5,
                            marginBottom: 10,
                            height: 60,
                        }}
                        onPress={() => {
                            EasyReturnService.isLoading = false;
                            EasyReturnService.isRejectCargoLoading = false;
                            hide();
                        }}
                        buttonColorType={
                            options && options.yesButtonColorType
                                ? options.yesButtonColorType
                                : ColorType.Brand
                        }
                    />
                    <AppButton
                        title={"İadeyi Tamamla"}
                        style={{
                            width: Dimensions.get("window").width - 150,
                            marginBottom: 10,
                            height: 60,
                            borderWidth: 1,
                            borderColor: "rgb(112,112,112)",
                        }}
                        textStyle={{
                            color: "rgb(112,112,112)",
                        }}
                        transparent
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
export default ErNotComplete;

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

const Ico = () => {
    return (
        <Svg width={72} height={72}>
            <G data-name="Group 4462">
                <G data-name="Ellipse 262" stroke={"#ff8600"} fill="none">
                    <Circle cx={36} cy={36} r={36} stroke="none" />
                    <Circle cx={36} cy={36} r={35.5} fill="none" />
                </G>
                <Path
                    data-name="Path 4326"
                    d="M-832.881-6.885c-2.081-1.147-4.164-2.29-6.239-3.446a.858.858 0 0 0-.932-.014c-1.444.787-2.9 1.543-4.36 2.309-.293.154-.588.3-.877.451a10.933 10.933 0 0 0-12.146-4.227 10.466 10.466 0 0 0-7.612 9.371c-.326 5.734 2.577 9.458 7.869 11.489l-.554 2.546c-.662-.14-1.283-.281-1.909-.4-.578-.109-.85.067-.96.62-.584 2.927-1.173 5.853-1.739 8.784a3.437 3.437 0 0 0 2.116 3.923c.227.084.462.145.694.217h1.19a.716.716 0 0 1 .151-.086 3.359 3.359 0 0 0 2.536-2.715c.222-1.043.438-2.086.656-3.13.377-1.8.756-3.607 1.127-5.412.142-.691-.043-.971-.709-1.119l-1.793-.4.558-2.609.776.1c0 .407.016.787 0 1.166a.977.977 0 0 0 .528.969q7.084 4.447 14.143 8.935a1.259 1.259 0 0 0 1.46.041q6.985-3.747 14-7.444a1.055 1.055 0 0 0 .628-1.053c-.015-3.05-.1-11.192-.16-14.241m-8.241-4.942 1.137 2.642 5 2.667L-829.32-.2a.893.893 0 0 1-1.166.107c-4.051-2.238-8.12-4.445-12.182-6.662-.172-.094-.342-.194-.563-.321 1.186-.629 2.324-1.239 3.471-1.831a.486.486 0 0 1 .375.057q3.871 2.107 7.734 4.232m-10.879-.443q5.689 3.109 11.381 6.213a.649.649 0 0 1 .4.67c-.022 1.082.006 2.164-.022 3.246a.747.747 0 0 1-.3.525c-.561.358-1.153.666-1.816 1.04 0-1.194-.029-2.292.012-3.386a1.077 1.077 0 0 0-.66-1.116c-3.219-1.725-6.425-3.475-9.644-5.2a1 1 0 0 1-.524-.718c-.2-.757-.465-1.5-.72-2.3.648.351 1.271.687 1.892 1.025zm-12.787 18.58-1.143 5.54c-.182.88-.351 1.762-.548 2.638a2.034 2.034 0 0 1-1.97 1.661 1.924 1.924 0 0 1-1.943-1.431 2.582 2.582 0 0 1-.045-1.126c.528-2.658 1.088-5.309 1.639-7.963a.816.816 0 0 1 .083-.157zm-8.353-14.986a9.327 9.327 0 0 1 9.335-9.38 9.648 9.648 0 0 1 9.58 9.5 9.333 9.333 0 0 1-9.316 9.409 9.65 9.65 0 0 1-9.6-9.53zm23.34 19.934a1.835 1.835 0 0 1-.035.212c-.619-.385-1.186-.736-1.752-1.089l-11.053-6.89a1.077 1.077 0 0 1-.348-1.184.363.363 0 0 1 .255-.136 10.457 10.457 0 0 0 8.315-5.185c.015-.024.047-.037.11-.086.2.113.425.236.646.36 1.182.664 2.368 1.319 3.54 2a.674.674 0 0 1 .309.471c.017 3.84.013 7.683.012 11.526zm.533-13.153c-1.475-.818-2.938-1.66-4.308-2.441l.859-4.4 8.194 4.445c-.131.09-.218.162-.317.216-1.312.708-2.623 1.418-3.943 2.113a.622.622 0 0 1-.488.066zm14.148-1.438v7.467c0 .237-.012.421-.273.558q-6.385 3.363-12.759 6.746a2 2 0 0 1-.246.08v-.511c0-3.7.006-7.41-.009-11.115a.675.675 0 0 1 .423-.7c1.28-.674 2.544-1.378 3.814-2.069.129-.07.263-.129.462-.226 0 1.071.048 2.076-.013 3.074-.067 1.11.392 1.751 1.62.939a27.615 27.615 0 0 1 2.668-1.5 1.2 1.2 0 0 0 .715-1.243c-.033-1.143-.009-2.287-.01-3.43a1.868 1.868 0 0 1 1.14-1.739L-825.648-1"
                    transform="translate(881.072 33.283)"
                    fill={"none"}
                />
            </G>
        </Svg>
    );
};
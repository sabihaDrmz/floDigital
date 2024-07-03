import {
    AppButton,
    AppText,
    ColorType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Defs, G, Path, TSpan } from "react-native-svg";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";

const ErNotValidStatus: React.FC = (props) => {

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
                    <Ico />
                </View>
                <AppText
                    selectable
                    style={[styles.description, { fontSize: 14, marginVertical: 10 }]}
                >
                    {message}
                </AppText>
                <AppText
                    selectable
                    style={{ textAlign: "center", fontFamily: "Poppins_300Light_Italic" }}
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
export default ErNotValidStatus;

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
        <Svg width={72} height={83}>
            <Defs></Defs>
            <G
                id="Group_4696"
                data-name="Group 4696"
                transform="translate(-157 -297.5)"
            >
                <G
                    id="Group_4695"
                    data-name="Group 4695"
                    transform="translate(-137.369 150)"
                >
                    <G
                        id="Group_3119"
                        data-name="Group 3119"
                        transform="translate(314.971 186.072)"
                    >
                        <G id="_7AVtBG" data-name="7AVtBG">
                            <G id="Group_3113" data-name="Group 3113">
                                <Path
                                    id="Path_2231"
                                    data-name="Path 2231"
                                    className="cls-1"
                                    d="M-2901.988-1155.382v-.361c-.005-.892.013-1.784-.028-2.675a3.15 3.15 0 0 0-.259-1.058 1.975 1.975 0 0 0-1.873-1.263h-19.75a3.731 3.731 0 0 0-.623.032 1.925 1.925 0 0 0-1.639 1.974c-.02.241-.025.483-.025.724v17.054a2.708 2.708 0 0 0 .062.619 1.22 1.22 0 0 0 1.29 1.022h4.328a9.683 9.683 0 0 0 .489 1.029 4.047 4.047 0 0 0 4.1 2.042 4.039 4.039 0 0 0 3.518-2.791.37.37 0 0 1 .42-.289q5.051.009 10.1 0c.161 0 .244.03.3.2a4.191 4.191 0 0 0 4.029 2.913 4.21 4.21 0 0 0 4.014-2.937c.018-.054.039-.107.065-.178h2.975a1.251 1.251 0 0 0 1.425-1.319 36.414 36.414 0 0 0-.058-5.171 23.724 23.724 0 0 0-.776-4.625 9.706 9.706 0 0 0-1.434-3.142 4.1 4.1 0 0 0-3.541-1.8c-2.258.027-4.518.007-6.776.007zm2.084 2.042h.281c1.517 0 3.034.006 4.551 0a2.383 2.383 0 0 1 1.749.726 4.526 4.526 0 0 1 .971 1.473 16.54 16.54 0 0 1 1.143 6c.009.241-.118.366-.358.34a1.54 1.54 0 0 1-.595-.164c-.46-.267-.909-.554-1.344-.861-.8-.567-1.578-1.174-2.391-1.725a10.12 10.12 0 0 0-3.841-1.678c-.161-.03-.168-.118-.168-.246v-2.35zm2.349 10.555a2.348 2.348 0 0 1 2.344 2.355 2.358 2.358 0 0 1-2.378 2.351 2.353 2.353 0 0 1-2.328-2.373 2.341 2.341 0 0 1 2.361-2.334zm-21.186 2.383a2.348 2.348 0 0 1 2.291-2.382 2.356 2.356 0 0 1 2.422 2.306 2.369 2.369 0 0 1-2.307 2.4 2.357 2.357 0 0 1-2.406-2.322z"
                                    transform="translate(2926.191 1160.742)"
                                />
                            </G>
                        </G>
                    </G>
                    <G
                        id="Group_3286"
                        data-name="Group 3286"
                        transform="translate(308.585 176.819)"
                    >
                        <G
                            transform="translate(-14.22 -29.32)"
                            style={{
                                filter: "url(#Path_2416)",
                            }}
                        >
                            <Path
                                id="Path_2416-2"
                                data-name="Path 2416"
                                d="M9.151 0A9.151 9.151 0 1 1 0 9.151 9.151 9.151 0 0 1 9.151 0z"
                                transform="translate(14.34 29.44)"
                                style={{
                                    fill: "#fff",
                                }}
                            />
                        </G>
                        <G id="icon_info" data-name="icon/info">
                            <Path
                                id="Combined_Shape"
                                data-name="Combined Shape"
                                className="cls-1"
                                d="M0 9.273a9.273 9.273 0 1 1 9.273 9.273A9.283 9.283 0 0 1 0 9.273zm1.59 0a7.683 7.683 0 1 0 7.683-7.707A7.7 7.7 0 0 0 1.59 9.273zm8.451 4.853a1.573 1.573 0 0 1-1.566-1.578V7.859h-.747a.795.795 0 0 1 0-1.59h1.157a1.184 1.184 0 0 1 1.18 1.187v5.08H11.2a.795.795 0 1 1 0 1.59zM8.082 4.22a.982.982 0 0 1 .98-.98h.01a.98.98 0 1 1-.99.98zm.98.609z"
                            />
                        </G>
                    </G>
                </G>
                <G id="siparisbulunamad\u0131error" transform="translate(-2 12.5)">
                    <G id="Group_4462" data-name="Group 4462">
                        <G
                            id="Ellipse_262"
                            data-name="Ellipse 262"
                            transform="translate(159 296)"
                            style={{
                                stroke: "#ff2424",
                                fill: "none",
                            }}
                        >
                            <Circle
                                cx={36}
                                cy={36}
                                r={36}
                                style={{
                                    stroke: "none",
                                }}
                            />
                            <Circle
                                cx={36}
                                cy={36}
                                r={35.5}
                                style={{
                                    fill: "none",
                                }}
                            />
                        </G>
                    </G>
                    <G id="Group_4463" data-name="Group 4463">
                        <Circle
                            id="Ellipse_261"
                            data-name="Ellipse 261"
                            cx={15}
                            cy={15}
                            r={15}
                            transform="translate(200 287)"
                            style={{
                                fill: "#ff2424",
                            }}
                        />
                        <Text
                            id="x"
                            transform="translate(210 309)"
                            style={{
                                fontSize: 23,
                                fontFamily: "Poppins_500Medium",
                                fontWeight: 500,
                                fill: "#fff",
                            }}
                        >
                            <TSpan x={0} y={0}>
                                {"x"}
                            </TSpan>
                        </Text>
                    </G>
                </G>
            </G>
        </Svg>
    );
};
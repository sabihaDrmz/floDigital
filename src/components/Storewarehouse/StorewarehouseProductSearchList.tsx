import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { PrinterConfigProp } from "../../contexts/model/PrinterConfigGroupModel";

interface StickerAccordionProps {
    title?: string;
    data: []
    items?: PrinterConfigProp[];
    renderItem?: (x: PrinterConfigProp, index: number) => void;
}

const DEFAULT_HEIGHT = 50;
const PADDINT_DEFAULT = 20;
const HEIGHT_OF_HEAD = 70;
const StorewarehouseProductSearchList: React.FC<StickerAccordionProps> = (props) => {
    const [hasOpen, setHasOpen] = useState(false);
    const [openStates, setOpenStates] = useState<boolean[]>(props?.data?.map(() => false));
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const hasOpensv = useSharedValue(DEFAULT_HEIGHT);
    const icoRotation = useSharedValue(180);

    const handleOpen = (index: number, items: []) => {
        hasOpensv.value = withTiming(index === openIndex ? DEFAULT_HEIGHT : 50 * items?.length + HEIGHT_OF_HEAD);
        icoRotation.value = withTiming(index === openIndex ? 180 : 0);
        setOpenIndex(index === openIndex ? null : index);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: hasOpensv.value,
            overflow: "hidden",
        };
    });

    const animatedRoute = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateZ: `${icoRotation.value}deg`,
                },
            ],
        };
    });

    const RenderItem = ({ item }) => {
        return (
            <View
                key={item.depoAdi}
                style={{
                    marginTop: 20, marginHorizontal: 15, backgroundColor: '#fff', padding: 20, borderRadius: 14, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}>
                <AppText style={{ color: item.totalCount === 0 ? '#656565' : '#ff8600', fontSize: 16, fontWeight: 'bold' }}>{item.depoAdi}</AppText>
                {item.product.map((items, index) => (
                    <AppText style={{ color: item.totalCount === 0 ? '#000' : '#000', fontSize: 16, fontWeight: 'bold' }}>{items.unitLabel}</AppText>
                ))}
            </View>
        )
    }
    return (
        //@ts-ignore
        <View style={{ flex: 1 }}>
            <FlatList
                showsVerticalScrollIndicator
                data={props.data}
                renderItem={({ item }) => <RenderItem item={item} />}
            />
        </View>

    );
};
export default StorewarehouseProductSearchList;

const styles = StyleSheet.create({
    container: {
        overflow: "scroll",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
    },
    title: {
        fontSize: 18,
        color: AppColor.FD.Text.Dark,
        fontFamily: "Poppins_500Medium",
        marginLeft: 10,
        marginVertical: 10,
        flex: 1,
    },
});

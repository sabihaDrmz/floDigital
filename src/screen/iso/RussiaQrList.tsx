import React, {  useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { useProductService } from "../../contexts/ProductService";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";
import {
    PerfectFontSize,
} from "../../helper/PerfectPixel";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useMessageBoxService, } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";

import { colors } from "../../theme/colors";
import FloButton from "../../components/FloButton";
import { QrCodeResponse, QrResponse } from "../../contexts/model/RussiaQrResponseList";

const RussiaQr: React.FC<any> = (props) => {
    const { russiaQrlist, approveRussiaQrCode } = useProductService();
    const { selectedPrinter, printerConfig, printRussiankQrCode } = usePrinterConfigService();
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
    const [allSelected, setAllSelected] = useState(false);

    const { show } = useMessageBoxService();

    const ProductDatamatrix: React.FC<{ item: QrResponse, index: number }> = (props) => {
        const item = props.item
        return (
            <TouchableOpacity
                style={{ height: 84, marginHorizontal: 20, backgroundColor: selectedIndexes.includes(props.index) ? colors.floOrange : colors.white, borderRadius: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}
                onPress={() => {
                    if(allSelected){
                        setAllSelected(false);
                        setSelectedIndexes([props.index])
                    }else {
                        setSelectedIndexes(prevSelectedIndexes => {
                            if (prevSelectedIndexes.includes(props.index)) {
                                // Eğer index listede varsa, çıkar
                                return prevSelectedIndexes.filter(item => item !== props.index);
                            } else {
                                // Eğer index listede yoksa, ekle
                                return [...prevSelectedIndexes, props.index];
                            }
                        });
                    }
                }}
            >
                <Text style={{ fontSize: PerfectFontSize(16), fontFamily: "Poppins_700Bold", marginLeft: 20, color: selectedIndexes.includes(props.index) ? colors.white : colors.black }}>{item.gtin}</Text>
                <FontAwesomeIcon style={{ marginRight: 20 }} icon="qr-code-2" size={70} color={selectedIndexes.includes(props.index) ? colors.white : colors.floOrange} />

            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.container}>
            <FloHeaderNew
                headerType={"standart"}
                enableButtons={["back"]}
                headerTitle={" "}
                showLogo
            />
            <FlatList
                data={russiaQrlist?.qrResponseList}
                renderItem={({ item, index }) => (
                    <ProductDatamatrix item={item} index={index} />
                )}
                style={{ paddingTop: 20 }}
                ListFooterComponent={
                    <TouchableOpacity onPress={() => {
                        if(allSelected){
                            setAllSelected(false)
                            setSelectedIndexes([]);
                        } else {
                            const indices = russiaQrlist?.qrResponseList.map((_, index) => index);
                            if(indices) setSelectedIndexes(indices);
                            setAllSelected(true)
                        }

                    }}
                    style={{justifyContent:"flex-start",flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <FontAwesomeIcon
                            icon={
                                allSelected ? "checkbox-intermediate" : "checkbox-blank-outline"
                            }
                            size={28}
                            color={allSelected ? colors.floOrange : colors.black}
                        />
                        <Text style={{ fontSize: PerfectFontSize(16), fontFamily: "Poppins_700Bold", marginLeft: 10, color:colors.black }}>Tümünü Seç</Text>

                    </TouchableOpacity>
                }

            />
            <View style={{ width: "100%", position: "absolute", bottom: 40 }}>
                <FloButton
                    title={"QR Пресс"}
                    onPress={async() => {
                        let printer = selectedPrinter;
                        let printerConfigData = printerConfig;
                        if (
                            printer === undefined ||
                            printerConfigData === undefined ||
                            Object.keys(printer).length == 0 ||
                            Object.keys(printerConfigData).length == 0
                        ) {
                            show("Пожалуйста, выберите конфигурацию тега", {
                                type: MessageBoxType.Standart,
                                yesButtonTitle: "Жақсы",
                                yesButtonEvent: () => { },
                            });
                            return;
                        }
                        approveRussiaQrCode(selectedIndexes).then(async (res: QrCodeResponse[] | number) => {
                            if (typeof res !== 'number') {
                               const resFiltered =  res.filter(x => x.isSucces === true)
                               if(resFiltered.length > 0) {
                                show("QR-теги сохранены.", {
                                    type: MessageBoxType.Standart,
                                    yesButtonTitle: "Жақсы",
                                    yesButtonEvent: () => {
                                        //   closePopup();
                                    },

                                });
                                // burda çektiğim Qr listesi ile Approvedan dönen listeyi karşılaştırıp baskı alınabilir olanları buldum
                                const filteredItems = russiaQrlist?.qrResponseList.filter(item =>
                                    res.some(qr => qr.barcodeOrEan === item.gtin && qr.qrCodeId !== 0)
                                );

                                // burda da eşleşenlerden baskıya ekliceğim id leri buldum.
                                const qrCodeIds = res
                                    .filter(qr => russiaQrlist?.qrResponseList.some(item => item.gtin === qr.barcodeOrEan) && qr.qrCodeId !== 0)
                                    .map(qr => qr.qrCodeId);

                                if (filteredItems) {
                                    for (let index = 0; index < qrCodeIds.length; index++) {
                                        await printRussiankQrCode(qrCodeIds[index], filteredItems[index])
                                    }
                                }
                               } else {
                                show("Произошла ошибка при сохранении", {
                                    type: MessageBoxType.Standart,
                                    yesButtonTitle: "Жақсы",
                                    yesButtonEvent: () => {
                                        //   closePopup();
                                    },

                                });
                               }

                            }
                        });
                    }}
                    containerStyle={{
                        marginVertical: 10,
                        marginHorizontal: 20,
                        borderRadius: 100,
                        backgroundColor: selectedIndexes.length > 0 ? colors.floOrange : colors.lightGrayText
                    }}
                    disabled={selectedIndexes.length > 0 ? false : true}
                />
            </View>
        </View>
    );
};
export default RussiaQr;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

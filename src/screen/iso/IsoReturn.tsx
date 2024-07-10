import { FloButton } from "../../components";
import { translate } from "../../helper/localization/locaizationMain";
import { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native"
import FloComboBox from '../../components/FloComobox';
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import MainCamera from "../../components/MainCamera";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { useRoute } from "@react-navigation/native";
import { useBasketService } from "../../contexts/BasketService";
import FloLoading from "../../components/FloLoading";
import {
    FloResultCode,
} from "../../core/models/ServiceResponseBase";
import { toOrganization } from "../../core/Util";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useAccountService } from "../../contexts/AccountService";
const IsoReturn = () => {
    const route = useRoute();

    const [selectedCheck, setSelectedCheck] = useState<string>("")
    const [isCameraShow, setIsCameraShow] = useState(false);
    const MessageBox = useMessageBoxService();
    const BasketService = useBasketService();
    const { width, height } = Dimensions.get("window");
    const [guidId, setGuidId] = useState()
    //@ts-ignore
    const { selectedBasket, address } = route?.params

    const AccountService = useAccountService();
    const ApplicationGlobalService = useApplicationGlobalService();
    const approve = async () => {

        const storeId = AccountService.getUserStoreId();
        var store = ApplicationGlobalService.allStore.find((x) => x.werks === storeId);
        const model = {
            barcode: selectedBasket?.basketItems[0]?.barcode,
            basketId: selectedBasket?.id,
            order: {
                telefon: address?.telefon,
                aliciAdi: address?.aliciAdi,
                aliciSoyadi: address?.aliciSoyadi,
                faturaAdres: address?.adres,
                adres: address?.adres,
                ePosta: address?.ePosta,
                postakodu: address?.mahalle?.code,
            },
            checkNumber: selectedCheck,
            vkorg: toOrganization(AccountService.employeeInfo.ExpenseLocationCode, store)
        }
        const res = await BasketService.isoCheckControl(model)
        await setGuidId(res?.model?.agreementGuid)
        if (res?.model?.agreementGuid && res?.model?.otpMust) {
            const isMessagge = false
            sendVerifyMessage(isMessagge, res?.model?.agreementGuid)
        } else if (res?.model?.agreementGuid && !res?.model?.otpMust) {
            sendVerify('', res?.model?.agreementGuid)
        }
    }

    const sendVerify = (validationCode: string, guidId: any) => {
        const model = {
            guidId: guidId,
            approveCode: validationCode,
            order: {
                adres: address?.adres,
                aliciAdi: address?.aliciAdi,
                aliciSoyadi: address?.aliciSoyadi,
                dukkanId: selectedBasket?.storeId,
                ePosta: address?.ePosta,
                il: address?.il?.name,
                ilce: address?.ilce?.name,
                isCreateCustomer: true,
                mahalle: address?.mahalle?.name,
                newCustomer: true,
                sepetId: selectedBasket?.id,
                telefon: address?.telefon,
                postakodu: address?.mahalle?.code,
                deliveredStore: ApplicationGlobalService.selectedStoreId
            },
        }
        BasketService.isoOrderExchange(model).then((res) => {
            console.log('res:', res);
            if (res.state !== FloResultCode.Successfully && res?.model?.otpMust) {
                const isMessagge = true
                sendVerifyMessage(isMessagge, guidId, res.message)
            } else if (res.state !== FloResultCode.Successfully && !res?.model?.otpMust) {
                MessageBox.show(res.message);
            }
        })
    }

    const sendVerifyMessage = (isMessagge: boolean, guidId: any, message?: string) => {
        MessageBox.show(isMessagge ? `${message}` : '', {
            type: MessageBoxType.SmsValidation,
            onValidate(validCode) {
                sendVerify(validCode, guidId);
            },
            reSendSms: () => {
                MessageBox.hide();
                console.log('resendSms');
            },
        });
    }

    const handleChange = (text) => {
        // Allow only numbers
        const numericValue = text.replace(/[^0-9]/g, "");
        setSelectedCheck(numericValue);
    };

    return (
        <View style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("iso.oneByeOneChange")}
            />
            <View style={styles.wrapper}>
                <View style={styles.comboBoxContainer}>
                    <FloTextBoxNew
                        onChangeText={handleChange}
                        value={selectedCheck}
                        placeholder="İade Çekini Okutunuz / Yazınız"
                        style={{
                            backgroundColor: "transparent",
                            width: width * 0.75,
                            fontFamily: "Poppins_200ExtraLight",
                            fontSize: 15,
                            color: "#707070",
                        }}
                        maxLength={28}
                    />
                    <TouchableOpacity onPress={() => {
                        setIsCameraShow(true);

                    }}>
                        <Image
                            source={require("../../../assets/S.png")}
                            style={{
                                width: PerfectPixelSize(50),
                                height: PerfectPixelSize(50),
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'flex-end', paddingBottom: 10 }}>
                    <FloButton
                        title={translate('completeBasketScreen.apply')}
                        disabled={selectedCheck === ""}
                        containerStyle={{ backgroundColor: selectedCheck === "" ? "#c3c3c3" : "#FF8600", }}
                        onPress={approve}
                    />
                </View>
            </View>

            <MainCamera
                isShow={isCameraShow}
                onReadComplete={(barcode: string) => {
                    setSelectedCheck(barcode)
                    setIsCameraShow(false)
                }}
                onHide={() => setIsCameraShow(false)}
            />
            {BasketService.isoLoading ? <FloLoading /> : null}
        </View>
    )
}

export default IsoReturn

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    comboBoxContainer: {
        borderColor: "#CECACA",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 8,
        height: 60,
        paddingLeft: 5,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },
    wrapper: {
        marginHorizontal: 20
    }
})

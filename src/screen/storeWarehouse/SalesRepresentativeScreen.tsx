import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList
} from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import SalesRepresentativeCollapse from "../../components/Storewarehouse/SalesRepresentativeCollapse";
import { WarehouseRequestGroupReponseModel } from "../../contexts/model/WarehouseRequestGroupReponseModel";
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import { useAccountService } from "../../contexts/AccountService";
import FloLoading from "../../components/FloLoading";
import { AppButton, AppText, ColorType } from "@flomagazacilik/flo-digital-components";
import FullScreenImage from "../../components/FullScreenImage";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import { translate } from "../../helper/localization/locaizationMain";

interface SalesRepresentativeScreenProps {

}

const SalesRepresentativeScreen: React.FC<SalesRepresentativeScreenProps> = (props) => {
    const StoreWarehouseService = useStoreWarehouseService();
    const UserService = useAccountService();
    const [list, setList] = useState<WarehouseRequestGroupReponseModel[]>([]);
    const [searchQuery, setSearchQuery] = useState("")

    var getDataAsync = async () => {
        var res = await StoreWarehouseService.getAllWarehouseRequestGroupWithBasketKey(UserService.getUserStoreId());
        setList(res);
    }

    useEffect(() => {
        getDataAsync();
    }, [])

    return (
        <View style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle=""
            />

            {StoreWarehouseService.isLoading ?
                <FloLoading />
                :
                <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, marginVertical: 10 }}>
                        <View
                            style={{ backgroundColor: "#fff", borderRadius: 10, width: Dimensions.get("screen").width - 200 }}
                        >
                            <AppTextBox
                                placeholder={translate("OmsNotFoundProducts.search")}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={{ paddingTop: 5, fontSize: PerfectFontSize(18) }}
                            />
                        </View>
                        <AppButton title={translate("OmsFilterCard.refresh")} colorType={ColorType.Light} buttonColorType={ColorType.Brand} style={{ width: 100, marginTop: 5 }} onPress={getDataAsync} />
                    </View>

                    <FlatList
                        data={list.filter(x => x.basketKey.toLowerCase().includes(searchQuery.toLowerCase()))}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <SalesRepresentativeCollapse item={item} />
                        }
                        contentContainerStyle={{ paddingVertical: 10 }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        ListEmptyComponent={() => <View style={{ flex: 1, alignItems: "center" }}><AppText style={{ fontSize: PerfectFontSize(18) }}>{translate("OmsFilterCard.recordNotFound")}</AppText></View>}
                    />
                </>
            }
            <FullScreenImage />
        </View>
    )
}
export default SalesRepresentativeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

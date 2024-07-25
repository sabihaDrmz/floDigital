import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import AppClosePopup from "../../components/AppClosePopup";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { useAccountService } from "../../contexts/AccountService";
import { useWarehouseService } from "../../contexts/WarehouseService";
import { translate } from "../../helper/localization/locaizationMain";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import EmptyList from "./EmptyList";
import RequestCard from "./RequestCard";

interface WaitingListProps { }

const WaitingList: React.FC<WaitingListProps> = (props) => {
  const Account = useAccountService();
  const WarehouseService = useWarehouseService();
  const ApplicationGlobalService = useApplicationGlobalService();
  const MessageBox = useMessageBoxService();
  const [showProcess, setShowProcess] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  let [selectedItemId, setSelectedItemId] = useState(0);
  const [note, setNote] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [openReasons, setOpenReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [message, setMessage] = useState("");
  const insets = useSafeAreaInsets();
  const employeeId = Account.employeeInfo.EfficiencyRecord;
  useEffect(() => {
    if (loading) {
      setLoading(true);
      _resetPage();
    }
  }, [loading]);

  const _resetPage = () => {
    if (selectedItemId > 0) return;
    setPage(1);
    WarehouseService.getListForWarehouse(1, 20, 0);
  };
  const _nextPage = async () => {
    if (selectedItemId > 0 || loading) return;
    if (WarehouseService.warehouseList.length % 20 > 0) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setRefreshing(true);
    WarehouseService.getListForWarehouse(nextPage, 20, 0).then(() =>
      setRefreshing(false)
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_nextPage} />
          }
          onEndReached={_nextPage}
          data={WarehouseService.warehouseList}
          ListEmptyComponent={() => <EmptyList />}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={<View style={{ height: 100 }} />}
          renderItem={({ item }) => (
            <RequestCard
              onProcessButtonPress={
                employeeId === item.completePerson
                  ? () => {
                    setSelectedItemId(item.id);
                    setShowProcess(true);
                  }
                  : undefined
              }
              {...item}
              waitingList
            />
          )}
        />
        {showProcess && (
          //@ts-ignore
          <AppClosePopup
            autoClose={false}
            onClose={() => setShowProcess(false)}
          >
            {/* <TouchableWithoutFeedback
                    onPress={() => {
                      Keyboard?.dismiss();
                    }}
                  > */}
            {message !== "" ? (
              <View style={{ padding: 20 }}>
                <AppText selectable size={FontSizes.L}>
                  {message}
                </AppText>
                <View style={{ height: 10 }} />
                <AppButton
                  buttonColorType={ColorType.Brand}
                  title={translate("warehouseRequest.iso.ok")}
                  onPress={() => setMessage("")}
                />
              </View>
            ) : openReasons ? (
              <View style={{ padding: 20 }}>
                <FlatList
                  data={ApplicationGlobalService.wrCancelReasons}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={{
                          marginBottom: 10,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setSelectedReason(item.description);
                        }}
                      >
                        <View>
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              backgroundColor:
                                selectedReason === item.description
                                  ? AppColor.FD.Brand.Solid
                                  : "#fff",
                              borderColor: AppColor.FD.Brand.Solid,
                              borderRadius: 15,
                              marginRight: 10,
                              borderWidth: 1.4,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {selectedReason === item.description && (
                              <FontAwesomeIcon
                                icon="check"
                                size={20}
                                color={"white"}
                              />
                            )}
                          </View>
                        </View>
                        <AppText
                          selectable
                          style={{ fontSize: 15, fontWeight: "bold" }}
                        >
                          {item.description.toUpperCase()}
                        </AppText>
                      </TouchableOpacity>
                    );
                  }}
                />
                <AppButton
                  buttonColorType={ColorType.Brand}
                  title={translate("warehouseRequest.iso.ok")}
                  onPress={() => {
                    if (selectedReason === "") {
                      setMessage(
                        translate("warehouseRequest.aReasonMustBeChosen")
                      );
                      return;
                    }
                    setShowProcess(false);
                    MessageBox.show(
                      translate("warehouseRequest.requestCancelledMessage"),
                      {
                        type: MessageBoxType.YesNo,
                        yesButtonTitle: translate("warehouseRequest.yes"),
                        noButtonTitle: translate("warehouseRequest.cancel"),
                        yesButtonEvent: () => {
                          WarehouseService.updateRequestState(
                            selectedItemId,
                            0,
                            note,
                            selectedReason
                          );
                          setOpenReasons(false);
                          setSelectedReason("");
                        },
                        noButtonEvent: () => {
                          setOpenReasons(false);
                          setSelectedReason("");
                        },
                      }
                    );
                  }}
                />
                <AppButton
                  buttonColorType={ColorType.Danger}
                  title={translate("messageBox.cancel")}
                  onPress={() => {
                    setOpenReasons(false);
                    setSelectedReason("");
                  }}
                />
              </View>
            ) : (
              <View style={{ padding: 20, paddingBottom: insets.bottom + 20 }}>
                <AppTextBox
                  style={{ height: 100 }}
                  placeholder={translate("warehouseRequest.iso.enterNote")}
                  multiline
                  value={note}
                  onChangeText={setNote}
                  keyboardType="default"
                  returnKeyType="done"
                  blurOnSubmit
                />
                <View style={{ height: 10 }} />
                <View style={{ height: 20 }} />
                <AppButton
                  title={translate("warehouseRequest.productDelivered")}
                  disabled={selectedReason !== ""}
                  buttonColorType={
                    selectedReason !== "" ? ColorType.Gray : ColorType.Brand
                  }
                  onPress={() => {
                    setShowProcess(false);
                    WarehouseService.updateRequestState(
                      selectedItemId,
                      1,
                      note,
                      ""
                    );
                  }}
                />
                <AppButton
                  title={translate("warehouseRequest.notFoundProduct")}
                  buttonColorType={ColorType.Danger}
                  onPress={() => {
                    setOpenReasons(true);
                    return;
                    /* returndan sonraki kodlara hiç giremeyecegi için yorum satırına aldım duruma gore silinebilir.
                    if (selectedReason === "") {
                      setMessage(
                        translate("warehouseRequest.aReasonMustBeChosen")
                      );
                      return;
                    }
                    setShowProcess(false);
                    MessageBox.show(
                      translate("warehouseRequest.requestCancelledMessage"),
                      {
                        type: MessageBoxType.YesNo,
                        yesButtonTitle: translate("warehouseRequest.yes"),
                        noButtonTitle: translate("warehouseRequest.cancel"),
                        yesButtonEvent: () => {
                          WarehouseService.updateRequestState(
                            selectedItemId,
                            0,
                            note,
                            selectedReason
                          );
                        },
                      }
                    );

                     */
                  }}
                />
              </View>
            )}
            {/* </TouchableWithoutFeedback> */}
          </AppClosePopup>
        )}
      </View>
    </View>
  );
};
export default WaitingList;

const styles = StyleSheet.create({
  container: {},
});

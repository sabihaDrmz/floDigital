import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import AccountService from "../../../core/services/AccountService";
import WarehouseService, {
  EmployeeModel,
} from "../../../core/services/WarehouseService";
import AppTextBox from "../../../NewComponents/FormElements/AppTextBox";
import { Ionicons } from "@expo/vector-icons";
import { ProductModel } from "../../../core/services/ProductService";
import MessageBoxNew from "../../../core/services/MessageBoxNew";
import { Observer } from "mobx-react";
import I18n from "i18n-js";
import AppClosePopup from "../../../components/AppClosePopup";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { warehouseSelectedEmployeeKey } from "../../../core/StorageKeys";
import moment from "moment";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { colors } from "../../../theme/colors";
import { translate } from "../../../helper/localization/locaizationMain";

interface WarehouseRequestPopupProps {
  product: ProductModel;
}

const WarehouseRequestPopup: React.FC<WarehouseRequestPopupProps> = (props) => {
  const [showWarehousePoppup, setShowWarehousePoppup] = useState(false);
  const [note, setNote] = useState("");
  const [isInitialize, setInitialize] = useState(false);
  const [employees, setEmployees] = useState<EmployeeModel[]>([]);
  const [tmpEmployees, setTempEmployees] = useState<EmployeeModel[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showEmployeePopup, setEmployeePopup] = useState(false);
  useEffect(() => {
    if (!isInitialize) {
      setInitialize(true);
      WarehouseService.getStoreEmployee(AccountService.getUserStoreId()).then(
        (res) => {
          setEmployees(res);
          setTempEmployees(res);
        }
      );
    }
  });

  const _cleanAndClose = () => {
    setShowWarehousePoppup(false);
    setNote("");
    setSelectedEmployee("");
  };

  const setStorageEmployee = async (employeeId: string) => {
    await AsyncStorage.setItem(
      warehouseSelectedEmployeeKey,
      JSON.stringify({
        employeeId: employeeId,
        date: moment(new Date()).format("DD/MM/yyyy"),
      })
    );
  };

  const getStorageEmployee = async () => {
    var employee = await AsyncStorage.getItem(warehouseSelectedEmployeeKey);
    if (employee) {
      let parsedItems = JSON.parse(employee);
      if (parsedItems.date === moment(new Date()).format("DD/MM/yyyy")) {
        setSelectedEmployee(parsedItems.employeeId);
      } else {
        setSelectedEmployee("");
      }
    }
  };

  const showError = (msg: string, showAgain?: boolean) => {
    setShowWarehousePoppup(false);
    setEmployeePopup(false);
    MessageBoxNew.show(msg, {
      yesButtonEvent: () => {
        if (showAgain) setShowWarehousePoppup(true);
      },
    });
  };

  const onSearch = (text: string) => {
    if (text.trimEnd().trimStart().length >= 0) {
      let fullText = text.replace(" ", "");
      let result = tmpEmployees.filter((x) => {
        return x.employeeName
          .toLowerCase()
          .includes(fullText.toLocaleLowerCase());
      });
      setEmployees(result);
    } else {
      setEmployees(employees);
    }
  };
  return (
    <Observer>
      {() => (
        <View>
          <View style={styles.container}>
            <AppButton
              onPress={() => {
                setShowWarehousePoppup(true);
                getStorageEmployee();
              }}
              title={I18n.t("warehouseRequest.iso.requstButtonTitle")}
              buttonColorType={ColorType.Brand}
            />
          </View>
          {showWarehousePoppup && (
            <AppClosePopup autoClose onClose={_cleanAndClose}>
              <View style={{ padding: 20 }}>
                <AppTextBox
                  value={note}
                  onChangeText={setNote}
                  placeholder={I18n.t("warehouseRequest.iso.enterNote")}
                  multiline
                  style={{ height: 100 }}
                  keyboardType="default"
                  returnKeyType="done"
                  blurOnSubmit
                />
                <View style={{ height: 10 }} />
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    borderColor: AppColor.FD.Text.Light,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  onPress={() =>
                    employees && employees.length > 0
                      ? setEmployeePopup(true)
                      : showError(
                          I18n.t("warehouseRequest.iso.assignPersonNotFound"),
                          false
                        )
                  }
                >
                  <AppText selectable>
                    {selectedEmployee === ""
                      ? I18n.t("warehouseRequest.iso.selectAssignPerson")
                      : employees.find((x) => x.employeeId === selectedEmployee)
                          ?.employeeName}
                  </AppText>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={"rgba(0,0,0,.4)"}
                  />
                </TouchableOpacity>
                <View style={{ height: 20 }} />
                <AppButton
                  buttonColorType={ColorType.Brand}
                  onPress={() => {
                    if (
                      selectedEmployee !== undefined &&
                      selectedEmployee !== null &&
                      selectedEmployee !== ""
                    ) {
                      WarehouseService.createWarehouseRequest(
                        props.product,
                        note,
                        {
                          employeeId:
                            AccountService.tokenizeHeader().employeeId,
                          employeeName:
                            AccountService.employeeInfo.FirstName +
                            " " +
                            AccountService.employeeInfo.LastName,
                        },
                        //@ts-ignore
                        employees.find((x) => x.employeeId === selectedEmployee)
                      ).then((res) => {
                        setStorageEmployee(selectedEmployee);
                        _cleanAndClose();
                        if (res) {
                          showError(
                            I18n.t(
                              "warehouseRequest.iso.warehouseRequestCreatedMessage"
                            ),
                            false
                          );
                        } else {
                          showError(
                            I18n.t(
                              "warehouseRequest.iso.warehouseRequestCreatedError"
                            ),
                            false
                          );
                        }
                      });
                    } else {
                      showError(
                        I18n.t(
                          "warehouseRequest.iso.warehouseRequestCreatedSelectPersonMessage"
                        ),
                        true
                      );
                    }
                  }}
                  title={I18n.t("warehouseRequest.iso.completeButtonText")}
                />
                <AppButton
                  title={I18n.t("warehouseRequest.iso.cancel")}
                  buttonColorType={ColorType.Danger}
                  onPress={_cleanAndClose}
                />
                <SafeAreaView />
              </View>
            </AppClosePopup>
          )}
          {showEmployeePopup && (
            <AppClosePopup onClose={() => setEmployeePopup(false)}>
              <View
                style={{
                  margin: 10,
                  backgroundColor: colors.whiteThree,
                  borderRadius: 7,
                  paddingLeft: 10,
                  height: 40,
                }}
              >
                <AntDesign
                  name={"search1"}
                  style={{ position: "absolute", left: 10, top: 12 }}
                  size={15}
                  color={colors.darkGrey}
                />
                <TextInput
                  placeholder={translate("OmsCargoConsensus.search") + "..."}
                  style={{
                    paddingLeft: 31,
                    color: colors.darkGrey,
                    fontFamily: "Poppins_400Regular",
                    fontSize: PerfectFontSize(14),
                    lineHeight: PerfectFontSize(17),
                    borderWidth: 0,
                    top: 12,
                  }}
                  placeholderTextColor={colors.darkGrey}
                  underlineColorAndroid={"transparent"}
                  onChangeText={(txt) => {
                    onSearch(txt);
                  }}
                />
              </View>
              <ScrollView style={{ paddingHorizontal: 15, height: 170 }}>
                {employees.map((e) => (
                  <React.Fragment>
                    <TouchableOpacity
                      onPress={() => setSelectedEmployee(e.employeeId)}
                      style={{
                        height: 40,
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Ionicons
                        name={
                          e.employeeId === selectedEmployee
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={24}
                        color={AppColor.FD.Brand.Solid}
                      />
                      <AppText selectable> {e.employeeName}</AppText>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </ScrollView>
              <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <AppButton
                  onPress={() => setEmployeePopup(false)}
                  buttonColorType={ColorType.Brand}
                  title={I18n.t("warehouseRequest.iso.ok")}
                />
                <AppButton
                  onPress={() => {
                    setEmployeePopup(false);
                    setSelectedEmployee("");
                  }}
                  buttonColorType={ColorType.Danger}
                  title={I18n.t("warehouseRequest.iso.cancel")}
                />
              </View>
            </AppClosePopup>
          )}
        </View>
      )}
    </Observer>
  );
};
export default WarehouseRequestPopup;

const styles = StyleSheet.create({
  container: {},
});

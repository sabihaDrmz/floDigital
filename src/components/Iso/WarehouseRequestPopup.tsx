import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { ProductModel } from "contexts/model/ProductModel";
import { EmployeeModel } from "contexts/model/EmployeeModel";
import { UserContextValue } from "contexts/UserContext";
import { WarehouseContextValue } from "contexts/WarehouseContext";
import { warehouseSelectedEmployeeKey } from "core/StorageKeys";
import { useMessageBox } from "contexts/MessageBoxContext";
import { translate } from "../../helper/localization/locaizationMain";
import AppClosePopup from "../../components/AppClosePopup";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import { colors } from "../../theme/colors";
import { PerfectFontSize } from "../../helper/PerfectPixel";

interface WarehouseRequestPopupProps {
  product: ProductModel;
  service: WarehouseContextValue;
  userService: UserContextValue;
  showError: (msg: string, showAgain?: boolean, callback?: () => void) => void;
}

const WarehouseRequestPopup: React.FC<WarehouseRequestPopupProps> = (props) => {
  const [showWarehousePoppup, setShowWarehousePoppup] = useState(false);
  const [note, setNote] = useState("");
  const [isInitialize, setInitialize] = useState(false);
  const [employees, setEmployees] = useState<EmployeeModel[]>([]);
  const [tmpEmployees, setTempEmployees] = useState<EmployeeModel[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showEmployeePopup, setEmployeePopup] = useState(false);
  const WarehouseService = props.service;
  const AccountService = props.userService;
  const MessageBox = useMessageBox();
  useEffect(() => {
    if (!isInitialize) {
      setInitialize(true);
      WarehouseService.getStoreEmployee(AccountService.getUserStoreId()).then(
        (res) => {
          if (!res) return;
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
    props.showError(translate(msg), showAgain, () =>
      setShowWarehousePoppup(true)
    );
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
    <View>
      <View>
        <AppButton
          onPress={() => {
            setShowWarehousePoppup(true);
            getStorageEmployee();
          }}
          title={translate("warehouseRequest.iso.requstButtonTitle")}
          buttonColorType={ColorType.Brand}
        />
      </View>
      {showWarehousePoppup && (
        // @ts-ignore
        <AppClosePopup autoClose onClose={_cleanAndClose}>
          <View style={{ padding: 20 }}>
            <AppTextBox
              onChangeText={setNote}
              placeholder={translate("warehouseRequest.iso.enterNote")}
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
                      "warehouseRequest.iso.assignPersonNotFound",
                      false
                    )
              }
            >
              <AppText selectable>
                {selectedEmployee === ""
                  ? translate("warehouseRequest.iso.selectAssignPerson")
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
                      employeeId: AccountService.employeeInfo.EfficiencyRecord,
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
                    if (res)
                      showError(
                        "warehouseRequest.iso.warehouseRequestCreatedMessage",
                        false
                      );
                    else
                      showError(
                        "warehouseRequest.iso.warehouseRequestCreatedError",
                        false
                      );
                  });
                } else
                  showError(
                    "warehouseRequest.iso.warehouseRequestCreatedSelectPersonMessage",
                    true
                  );
              }}
              title={translate("warehouseRequest.iso.completeButtonText")}
            />
            <AppButton
              title={translate("warehouseRequest.iso.cancel")}
              buttonColorType={ColorType.Danger}
              onPress={_cleanAndClose}
            />
            <SafeAreaView />
          </View>
        </AppClosePopup>
      )}
      {showEmployeePopup && (
        //@ts-ignore
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
              title={translate("warehouseRequest.iso.ok")}
            />
            <AppButton
              onPress={() => {
                setEmployeePopup(false);
                setSelectedEmployee("");
              }}
              buttonColorType={ColorType.Danger}
              title={translate("warehouseRequest.iso.cancel")}
            />
          </View>
        </AppClosePopup>
      )}
    </View>
  );
};
export default WarehouseRequestPopup;

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
  Text
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { ProductModel } from "../../contexts/model/ProductModel";
import { useAccountService } from "../../contexts/AccountService";
import { useWarehouseService } from "../../contexts/WarehouseService";
import { warehouseSelectedEmployeeKey } from "../../core/StorageKeys";
import { translate } from "../../helper/localization/locaizationMain";
import AppClosePopup from "../../components/AppClosePopup";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { WarehouseGetProduct } from "../../contexts/model/WarehouseResModel";

interface NewWarehouseRequestPopupProps {
  product: ProductModel;
  showError: (msg: string, showAgain?: boolean, callback?: () => void) => void;
}

const NewWarehouseRequestPopup: React.FC<NewWarehouseRequestPopupProps> = (
  props
) => {
  const [showWarehousePoppup, setShowWarehousePoppup] = useState(false);
  const [note, setNote] = useState("");
  const [isInitialize, setInitialize] = useState(false);
  const [employees, setEmployees] = useState<WarehouseGetProduct[]>([]);
  const [tmpEmployees, setTempEmployees] = useState<WarehouseGetProduct[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showEmployeePopup, setEmployeePopup] = useState(false);
  const WarehouseService = useWarehouseService.getState();
  const AccountService = useAccountService.getState();
  const product = props.product
  useEffect(() => {
    if (!isInitialize) {
      setInitialize(true);
      WarehouseService.getStoreWarehouseProduct(product?.barcode).then(
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
        setSelectedEmployee(parsedItems.id);
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
        return x.name
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
          <View>
            <View style={{ backgroundColor: '#ff7f00' }}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: PerfectFontSize(16),
                  fontWeight: "700",
                  fontStyle: "normal",
                  letterSpacing: 0.6,
                  color: '#fff',
                  padding: 10
                }}
              >
                {translate("warehouseRequest.iso.requstButtonTitle")}
              </Text>
            </View>
            <View style={{ marginHorizontal: 15, marginTop: 20 }}>
              {employees.length > 0 ?
                employees.map((e) => (
                  <React.Fragment>
                    <TouchableOpacity
                      onPress={() => setSelectedEmployee(e.id)}
                      style={{
                        height: 40,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: 'space-between'
                      }}
                    >
                      <AppText style={{ color: '#626262' }} selectable> {e.code} - {e?.unitQr}</AppText>
                      <Ionicons
                        name={
                          e.id === selectedEmployee
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={24}
                        color={AppColor.FD.Brand.Solid}
                      />

                    </TouchableOpacity>
                  </React.Fragment>
                ))
                :
                <AppText>{translate("warehouseRequest.iso.warehouseRequestNoProduct")}</AppText>
              }
              <View style={{ marginTop: 20 }} />
              <AppTextBox
                onChangeText={setNote}
                placeholder={translate("warehouseRequest.iso.enterNote")}
                multiline
                style={{ height: 30 }}
                keyboardType="default"
                returnKeyType="done"
                blurOnSubmit
              />

              <View style={{ height: 20 }} />
              <AppButton
                buttonColorType={employees.length === 0 || selectedEmployee === "" ? ColorType.Gray : ColorType.Brand}
                disabled={employees.length === 0 || selectedEmployee === ""}
                onPress={() => {
                  if (
                    selectedEmployee !== undefined &&
                    selectedEmployee !== null &&
                    selectedEmployee !== ""
                  ) {
                    const selectedEmp = employees.filter(x => x.id === selectedEmployee);
                    WarehouseService.createStoreWarehouseRequest(
                      props.product,
                      selectedEmployee,
                      AccountService.employeeInfo,
                      note,
                      selectedEmp[0]?.code
                    ).then((res) => {
                      _cleanAndClose();
                      if (res)
                        showError(
                          "warehouseRequest.iso.warehouseRequestCreatedMessage",
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
          </View>
        </AppClosePopup>
      )}
    </View>
  );
};
export default NewWarehouseRequestPopup;

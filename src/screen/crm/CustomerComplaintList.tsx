import {
  AppButton,
  AppColor,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import CrmCaseCard from "../../components/Crm/CrmCaseCard";
import FloComboBox from "../../components/FloComobox";
import FloLoading from "../../components/FloLoading";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { translate } from "../../helper/localization/locaizationMain";
import { ParagraphText, ParagraphTextType } from "../../NewComponents";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import { useCrmService } from "../../contexts/CrmService";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const CustomerComplaintList: React.FC = (props) => {
  const { getCustomerComplaintList, complaints, isLoading } = useCrmService();
  const navigation = useNavigation();
  const filterData = [
    { text: translate("crmCustomerComplaintList.active"), id: "0" },
    { text: translate("crmCustomerComplaintList.solved"), id: "1" },
    { text: translate("crmCustomerComplaintList.cancelled"), id: "2" },
  ];

  useEffect(() => {
    if (complaints?.length === 0)
      getCustomerComplaintList(1);
  }, []);

  let [currentPage, setCurrentPage] = useState(1);
  let [oldGetPage, setOldGetPage] = useState(0);
  let [statusFilter, setStatusFilter] = useState<string | undefined>("0");
  let [filter, setFilter] = useState<any | undefined>({
    text: translate("crmCustomerComplaintList.active"),
    id: "0",
  });

  const EmptyListComponent: React.FC = (props) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../../../assets/crmcustomercomplaintcreate.png")}
        />
        <CreateButton />
      </View>
    );
  };

  const CreateButton: React.FC<any> = (props) => (
    <AppButton
      style={{
        marginTop: 80,
        width: Dimensions.get("window").width - 55,
        height: 62,
      }}
      buttonColorType={ColorType.Brand}
      title={translate("crmCustomerComplaintList.newRecord")}
      onPress={() => navigation.navigate("Crm", { screen: "CreateCustomerComplaint" })}
      {...props}
    />
  );

  const _loadMore = (resetPages: boolean = false) => {
    let tempPage = currentPage;
    if (complaints?.length === 0 && !resetPages) return;
    if (resetPages) {
      tempPage = 1;
      oldGetPage = 0;
    } else tempPage = tempPage + 1;

    if (currentPage === tempPage) return;
    setOldGetPage(currentPage);

    getCustomerComplaintList(tempPage);
    setCurrentPage(tempPage);
  };

  const [filterQuery, setFilterQuery] = useState("");

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        headerTitle={translate("crmCustomerComplaintList.title")}
        enableButtons={["back"]}
      />

      {complaints?.length === 0 ? (
        <EmptyListComponent />
      ) : (
        <React.Fragment>
          <CreateButton
            style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
          />
          <View style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
            <FloComboBox
              placeholder={translate("crmCustomerComplaintList.demandFilter")}
              data={filterData}
              keyProp={"id"}
              valueProp={"text"}
              selectedItem={filter}
              onSelectItem={(item) => {
                if (item.id === undefined) setFilter(undefined);
                else setFilter(item);

                setStatusFilter(item?.id);
              }}
            />
          </View>
          <View style={{ marginHorizontal: 15 }}>
            <FloTextBoxNew
              placeholder={translate("crmCustomerComplaintList.enterPhone")}
              value={filterQuery}
              onChangeText={setFilterQuery}
            />
          </View>
          <FlatList
            data={
              statusFilter !== undefined
                ? complaints
                  ?.filter(
                    (x: any) => x.stateCode.toString() === statusFilter
                  )
                  .filter(
                    (x: any) =>
                      filterQuery === "" ||
                      (filterQuery !== "" &&
                        x.incidentContact.mobilePhone.includes(filterQuery))
                  )
                : complaints.filter(
                  (x: any) =>
                    filterQuery === "" ||
                    (filterQuery !== "" &&
                      x.incidentContact.mobilePhone.includes(filterQuery))
                )
            }
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                tintColor={"#ff8600"}
                onRefresh={() => _loadMore(true)}
              />
            }
            onEndReached={() => {
              if (
                complaints &&
                complaints.length >= currentPage * 20
              )
                _loadMore(false);
            }}
            renderItem={({ item }) => {
              return (
                <CrmCaseCard
                  {...{
                    createdon: item.createdOn,
                    subject: item.title,
                    description: item.description,
                    fisrtname: item.incidentContact.fisrtName,
                    lastname: item.incidentContact.lastName,
                    phone: item.incidentContact.mobilePhone,
                    ticketNumber: item.ticketNumber,
                    timeToClosingDate: item.timeToClosingDate,
                    onSelect: () => {
                      navigation.navigate("Crm", {
                        screen: "CreateCustomerComplaint",
                        params: { taskId: item.crmId }
                      });
                    },
                  }}
                />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ParagraphText
                    style={{
                      marginTop: 30,
                    }}
                    type={ParagraphTextType.XL}
                  >
                    {translate("crmCustomerComplaintList.noRecord")}
                  </ParagraphText>
                </View>
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: AppColor.FD.Text.Light,
                }}
              />
            )}
          />
        </React.Fragment>
      )}

      {isLoading && (
        <View
          style={{
            position: "absolute",
            width,
            height,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FloLoading />
        </View>
      )}
    </View>
  );
};
export default CustomerComplaintList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

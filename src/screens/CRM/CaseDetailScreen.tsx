import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from "react-native";
import { translate } from "../../helper/localization/locaizationMain";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { CRMCaseModel } from "../../core/models/CrmCaseModel";
import { Image } from "react-native";
import moment from "moment";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import CrmService from "../../core/services/CrmService";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { FloButton } from "../../components";
import { Observer } from "mobx-react-lite";
//TODO:EXPO expo-image-picker
// import * as exImp from "expo-image-picker";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
//TODO: EXPO
// import { MediaTypeOptions } from "expo-image-picker";
//TODO: EXPO expo-image-picker
// import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import FloComboBox from "../../components/FloComobox";
import {
  CrmTaskStateArray,
  GetCrmStateText,
  ReasonForHolding,
  TaskState,
} from "../../constant/CrmDefinations";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useMediaSelector } from "../../components/MediaSelector/MediaSelector";
import MediaSelectorPopup from "../../components/MediaSelector/MediaSelectorPopup";
import MessageBoxNew from "../../core/services/MessageBoxNew";

//#region  Common
//#region  Tabs
const TabDetail: React.FC<{ title: string; isSelected?: boolean }> = (
  props
) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get("window").width / 2.1,
      }}
    >
      <Text
        style={{
          fontSize: PerfectFontSize(15),
          fontWeight: "600",
          fontStyle: "normal",
          lineHeight: PerfectFontSize(40),
          letterSpacing: 0.75,
          textAlign: "left",
          color: props.isSelected ? "#707070" : "#fff",
          fontFamily: "Poppins_600SemiBold",
        }}
      >
        {props.title}
      </Text>
    </View>
  );
};

const Tabs = () => {
  return [
    {
      defaultItem: <TabDetail title={translate("crmCaseDetailScreen.task")} />,
      selectedItem: (
        <TabDetail title={translate("crmCaseDetailScreen.task")} isSelected />
      ),
    },
    {
      defaultItem: (
        <TabDetail title={translate("crmCaseDetailScreen.taskDetails")} />
      ),
      selectedItem: (
        <TabDetail
          title={translate("crmCaseDetailScreen.taskDetails")}
          isSelected
        />
      ),
    },
  ];
};

//#endregion

//#region  Sperator
const Sperator: React.FC = (props) => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#e4e4e4",
        marginLeft: 24,
        marginRight: 24,
        marginTop: 7.5,
        marginBottom: 7.5,
      }}
    />
  );
};

//#endregion

//#region Task Detail

const TitleValue: React.FC<{ title: string; info: string }> = (props) => {
  return (
    <React.Fragment>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <View style={{ width: 29 }} />
        <View style={{ width: Dimensions.get("window").width - 80 }}>
          <Text style={styles.detailTitle}>{props.title}</Text>
          <Text selectable style={styles.detailInfo}>
            {props.info}
          </Text>
        </View>
      </View>
      <Sperator />
    </React.Fragment>
  );
};

const TaskDetail: React.FC<{ case: CRMCaseModel }> = (props) => {
  return (
    <ScrollView bounces={false} bouncesZoom={true}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.line} />
        <Text style={styles.taskDetailBreadCrump} numberOfLines={1}>
          {props.case.incident.layer1.name} / {props.case.incident.layer2.name}
        </Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <Image
          source={require("../../../assets/crmfileicon.png")}
          style={{ width: 12, height: 15, marginRight: 14 }}
        />
        <Text style={styles.layer3}>{props.case.incident.layer3.name}</Text>
      </View>
      <Sperator />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <Image
          source={require("../../../assets/crmcalendaricon.png")}
          style={{
            width: 15,
            height: 15,
            marginRight: 14,
            resizeMode: "contain",
          }}
        />
        <Text style={styles.createOnDetail}>
          {translate("crm.createdDate", {
            createDate: moment(props.case.incident.createdOn)
              .tz("Europe/Istanbul")
              .format("DD/MM/YYYY HH:mm"),
          })}
        </Text>
      </View>
      <Sperator />
      <TitleValue
        title={translate("crm.serviceRequesNum")}
        info={props.case.incident.ticketNumber}
      />
      <TitleValue
        title={"Aktif Görev Durumu"}
        //@ts-ignore
        info={
          props.case.statusCode ? GetCrmStateText(props.case.statusCode) : "-"
        }
      />
      <TitleValue
        title={translate("crm.orderNum")}
        info={
          props.case.incident.orderNumber &&
          props.case.incident.orderNumber.length > 0
            ? props.case.incident.orderNumber
            : "-"
        }
      />
      <TitleValue
        title={translate("crm.shipmentNum")}
        info={
          props.case.incident.shipmentNumber &&
          props.case.incident.shipmentNumber.length > 0
            ? props.case.incident.shipmentNumber
            : "-"
        }
      />
      <TitleValue
        title={translate("crm.productNum")}
        info={
          props.case.incident.productID ? props.case.incident.productID : "-"
        }
      />
      <TitleValue
        title={translate("crm.uibNum")}
        info={props.case.incident.uibNo ? props.case.incident.uibNo : "-"}
      />
      <TitleValue
        title={translate("crmCaseCard.remainingTime")}
        info={props.case.timeToClosingDate ? props.case.timeToClosingDate : "-"}
      />
    </ScrollView>
  );
};

//#endregion

//#region Task

const Task: React.FC<{
  case: CRMCaseModel;
  images: any;
  crmTeamId?: string;
  crmTaskState?: number;
  reasonForHoldingID?: number;
  onSelectImage: (images: any) => void;
  onSolvedTextChange: (text: string) => void;
  onChangeTaskStateId: (state: number) => void;
  onChangeCrmTeamId: (state: string) => void;
  onChangeReasonForHolding: (state: number) => void;
}> = (props) => {
  const PickImage = async () => {
   /* let permState = await exImp.getMediaLibraryPermissionsAsync();

    if (!permState.granted && permState.canAskAgain) {
      await exImp.requestMediaLibraryPermissionsAsync();
      permState = await exImp.getMediaLibraryPermissionsAsync();
    }



    if (!permState.granted) {
      MessageBox.Show(
        translate("errorMsgs.filePermissionError"),
        MessageBoxDetailType.Warning,
        MessageBoxType.YesNo,
        () => {
          Linking.openSettings();
        },
        () => {}
      );
      return;
    }

    exImp
      .launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [18, 9],
      })
      .then((pickImageResult) => {
        if (pickImageResult.cancelled) return;
        let image: any = {
          ...pickImageResult,
        };
        props.onSelectImage([...props.images, image]);
      });

    */
  };

  const RemovePicture = async (uri: string) => {
    props.onSelectImage(props.images.filter((x) => x.uri !== uri));
  };

  return (
    <View style={{ paddingBottom: 60 }}>
      <TitleValue title={translate("crm.title")} info={props.case.subject} />
      <TitleValue
        title={translate("crm.assigneeTeam")}
        info={
          CrmService.crmTeams.find(
            (x) => x.teamId === CrmService.crmAccountInfo.teamId
          )?.name
        }
      />
      <TitleValue
        title={`${translate("crm.detail")} : `}
        info={props.case.description}
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <View style={{ width: 29 }} />
        <View style={{ width: Dimensions.get("window").width - 90 }}>
          <Text style={styles.detailTitle}>Çözüm</Text>
          <TextInput
            placeholder={"Çözüm Açıklaması Giriniz"}
            multiline
            numberOfLines={10}
            maxLength={400}
            onChangeText={props.onSolvedTextChange}
            underlineColorAndroid={"transparent"}
            style={{
              borderWidth: 1,
              borderColor: "rgb(206,202,202)",
              padding: 10,
              borderRadius: 8,
              fontFamily: "Poppins_400Regular",
              fontSize: PerfectFontSize(15),
              color: "#3a3a3b",
              maxHeight: 160,
              minHeight: 50,
            }}
          />
        </View>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <View style={{ width: 29 }} />
        <View style={{ width: Dimensions.get("window").width - 90 }}>
          <Text style={styles.detailTitle}>Görev Durumu</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 30 }}>
        <FloComboBox
          isReadOnly={props.case.gorevDurumu != -1}
          data={CrmTaskStateArray}
          keyProp="id"
          valueProp="text"
          selectedItem={CrmTaskStateArray.find(
            (x) => x.id === props.crmTaskState
          )}
          onSelectItem={(item) => {
            props.onChangeTaskStateId(item ? item.id : -1);
          }}
          placeholder={translate("crmTaskView.searchJobStatus")}
          containerStyle={{ borderColor: "rgb(206,202,202)", marginBottom: 0 }}
          textColor={"#7c7c7c"}
        />
      </View>
      {props.crmTaskState === TaskState.GorevIadeHataliAtama && (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <View style={{ width: 29 }} />
            <View style={{ width: Dimensions.get("window").width - 90 }}>
              <Text style={styles.detailTitle}>Dosya Ekleri</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 30 }}>
            <FloComboBox
              isReadOnly={props.case.gorevDurumu != -1}
              data={CrmService.crmTeams}
              keyProp="teamId"
              valueProp="name"
              selectedItem={CrmService.crmTeams.find(
                (x) => x.teamId === props.crmTeamId
              )}
              onSelectItem={(item) => {
                props.onChangeCrmTeamId(item.teamId);
              }}
              placeholder={translate("crmTaskView.chooseTheRightTeam")}
              containerStyle={{ borderColor: "rgb(206,202,202)" }}
              textColor={"#7c7c7c"}
            />
          </View>
        </View>
      )}
      {props.crmTaskState === TaskState.BeklemeyeAlindi && (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <View style={{ width: 29 }} />
            <View
              style={{
                width: Dimensions.get("window").width - 90,
                flexDirection: "row",
              }}
            >
              <Text style={styles.detailTitle}>Beklemeye Alma Nedeni</Text>
              <Text style={{ color: "red", marginHorizontal: 2 }}>*</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 30 }}>
            <FloComboBox
              data={ReasonForHolding}
              keyProp="id"
              valueProp="text"
              selectedItem={ReasonForHolding.find(
                (x) => x.id === props.reasonForHoldingID
              )}
              onSelectItem={(item) => {
                props.onChangeReasonForHolding(item.id);
              }}
              placeholder={"Beklemeye Alma Nedeni Seçiniz"}
              containerStyle={{ borderColor: "rgb(206,202,202)" }}
              textColor={"#7c7c7c"}
            />
          </View>
        </View>
      )}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <View style={{ width: 29 }} />
        <View style={{ width: Dimensions.get("window").width - 90 }}>
          <Text style={styles.detailTitle}>Dosya Ekleri</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
        }}
      >
        <MediaSelectorPopup settings={{ canEditable: true }} />
      </View>
    </View>
  );
};
//#endregion

//#endregion

const CaseDetailScreen: React.FC<{ item: CRMCaseModel }> = (props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [solveText, setSolveText] = useState("");
  const { medias, setMedias } = useMediaSelector();

  const [crmTaskStateId, setCrmTaskStateId] = useState(-1);
  const [crmTeamId, setCrmTeamId] = useState(
    "00000000-0000-0000-0000-000000000000"
  );
  const [reasonForHolding, setReasonForHolding] = useState(-1);

  useEffect(() => {
    if (selectedImages === undefined) setSelectedImages([]);
    setMedias([]);
  }, []);

  const { item } = props;
  return (
    <Observer>
      {() => (
        <View style={styles.container}>
          <FloHeaderNew
            headerType={"standart"}
            enableButtons={["back"]}
            headerTitle={translate("crm.caseDetail")}
            tabs={Tabs()}
            onChangeTab={setSelectedTab}
          />
          <KeyboardAwareScrollView style={styles.wrapper}>
            {selectedTab === 0 && (
              <Task
                onSelectImage={setSelectedImages}
                images={selectedImages}
                case={item}
                onSolvedTextChange={setSolveText}
                onChangeCrmTeamId={setCrmTeamId}
                onChangeTaskStateId={setCrmTaskStateId}
                crmTaskState={crmTaskStateId}
                crmTeamId={crmTeamId}
                onChangeReasonForHolding={setReasonForHolding}
                reasonForHoldingID={reasonForHolding}
              />
            )}
            {selectedTab === 1 && <TaskDetail case={item} />}
          </KeyboardAwareScrollView>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderTopWidth: 0.5,
              borderColor: "#7c7c7c",
            }}
          >
            <FloButton
              title={translate("crm.save")}
              isLoading={CrmService.isLoading}
              onPress={() => {
                if (crmTaskStateId === 7 && reasonForHolding === -1) {
                  MessageBoxNew.show("Lütfen Beklemeye Alma Nedeni Seçiniz");
                  return;
                }

                CrmService.updateCase({
                  activityId: item.activityid,
                  crmTaskStateId: crmTaskStateId,
                  crmTeamId: crmTeamId,
                  pickImages: medias,
                  inputText: solveText,
                  reasonForHolding: reasonForHolding,
                });
              }}
            />
          </View>
          <SafeAreaView />
        </View>
      )}
    </Observer>
  );
};
export default CaseDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 20,
    paddingTop: 0,
    marginTop: 20,
  },
  taskDetailBreadCrump: {
    fontSize: PerfectFontSize(12),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 1.08,
    textAlign: "left",
    color: "#7c7c7c",
    fontFamily: "Poppins_300Light",
    backgroundColor: "#fff",
  },
  line: {
    height: 1,
    width: Dimensions.get("window").width - 80,
    backgroundColor: "#e4e4e4",
    top: 9,
    position: "absolute",
    left: 20,
  },
  layer3: {
    fontSize: PerfectFontSize(15),
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0.75,
    textAlign: "left",
    color: "#ff8600",
    fontFamily: "Poppins_400Regular",
  },
  createOnDetail: {
    fontSize: PerfectFontSize(12),
    fontWeight: "200",
    fontStyle: "italic",
    letterSpacing: 0.6,
    textAlign: "left",
    color: "#7c7c7c",
    fontFamily: "Poppins_200ExtraLight_Italic",
  },
  detailTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(12),
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0.6,
    textAlign: "left",
    color: "#3a3a3b",
    marginBottom: 8,
  },
  detailInfo: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(15),
    fontStyle: "normal",
    letterSpacing: 0.75,
    color: "#7c7c7c",
  },
});

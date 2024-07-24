import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  SafeAreaView,
  Dimensions,
} from "react-native";
import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
//import * as exImp from "expo-image-picker";
//import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import {
  Media,
  useMediaSelector,
} from "../../components/MediaSelector/MediaSelector";
import AppTextBox, {
  TextManipulator,
} from "../../NewComponents/FormElements/AppTextBox";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { translate } from "../../helper/localization/locaizationMain";
import { LabelText, ParagraphText, ParagraphTextType } from "../../NewComponents";
import {
  AppButton,
  AppColor,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import MediaSelectorPopup from "../../components/MediaSelector/MediaSelectorPopup";
import FloLoading from "../../components/FloLoading";
import RadioButtonList from "../../NewComponents/FormElements/RadioButtonList";
import ImageViewer from "../../components/ImageViewer";
import { useCrmService } from "../../contexts/CrmService";

export const clearHtmlText = (txt: string) => {
  if (txt === undefined) return txt;
  let des = txt?.replace(/<[^>]+>/g, "").trim();
  des = des.replace(/\xA0/g, " ");
  while (des.includes("&nbsp;")) des = des.replace("&nbsp;", " ");

  return des;
};
const { width, height } = Dimensions.get("window");
const Spacer: React.FC = (props) => <View style={{ height: 15 }} />;
const CrmCreateCustomerComplatint: React.FC<any> = ({ route }) => {
  const { getCustomerComplaintDetail, updateCustomerComplaintDetail, setsateCustomerComplaint, isLoading } = useCrmService();
  const SearchParams = route?.params;
  const [phone, setPhone] = useState("");
  const [complaintType, setComplaintType] = useState("3");
  const [title, setTitle] = useState("Müşteri Şikayeti Destek Talebi");
  const [orderNumber, setOrderNumber] = useState("");
  const [fisrtName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<any>([]);
  const [remoteImages, setRemoteImages] = useState<string[]>([]);
  const [stateCode, setStateCode] = useState(0);
  const [taskId, setTaskId] = useState("");
  const [resulution, setResolition] = useState("");
  const [assignedteamName, setAssignedteamName] = useState("");
  const [crmId, setCrmId] = useState("");
  const { medias, setMediasData } = useMediaSelector();
  const [defaultMedias, setDefaultMedias] = useState([]);
  useEffect(() => {
    const taskId = SearchParams?.taskId as string;
    if (taskId) {
      setTaskId(taskId);

      getCustomerComplaintDetail(taskId).then((result: any) => {
        if (
          result &&
          result.incidentContact &&
          result.incidentContact.mobilePhone !== null &&
          result.incidentContact.mobilePhone !== undefined &&
          result.incidentContact.mobilePhone !== ""
        ) {
          setPhone(
            TextManipulator(result.incidentContact?.mobilePhone, "phone")
          );
        }
        setTitle(result.title);
        setDescription(clearHtmlText(result.description));
        setFirstName(result.incidentContact?.fisrtName);
        setLastName(result.incidentContact?.lastName);
        setOrderNumber(result.orderNumber);
        setComplaintType(result.storeTypePicklist?.toString());
        setStateCode(result.stateCode);
        setResolition(result.resolutionDescription);
        setAssignedteamName(result.assignedteamName);
        setRemoteImages(result.attechmant);
        setDefaultMedias(result.attechmant.map((x: any) => {
          let item: Media = {
            Url: `data:image/jpg;base64,${x.documentBody}`,
            MediaType: "picture",
          };
          return item;
        }))
        setMediasData(
          result.attechmant.map((x: any) => {
            let item: Media = {
              Url: `data:image/jpg;base64,${x.documentBody}`,
              MediaType: "picture",
            };
            return item;
          })
        );
        setCrmId(taskId);
      });
    } else {
      setMediasData([]);
    }
  }, [SearchParams?.taskId]);

  const onSave = () => {
    const diffirent = medias.filter(itemB => !defaultMedias.some(itemA => itemB.Url === itemA.Url));
    const newMedias = defaultMedias.length > 0 ? diffirent : medias
    let model = {
      phone,
      complaintType,
      title,
      orderNumber,
      fisrtName,
      lastName,
      description,
      medias: newMedias,
      taskId,
    };
    updateCustomerComplaintDetail(model);
  };

  const complaintCancel = () => {
    let model = {
      crmId,
      stateCode,
    };
    setsateCustomerComplaint(model);
  };

  const [showImagePopup, setShowImagePopup] = useState(false);

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        headerTitle={
          taskId === ""
            ? translate("crmCrmCreateCustomerComplaint.newCustomerComplaint")
            : stateCode === 2
              ? translate("crmCrmCreateCustomerComplaint.cancelCustomerComplaint")
              : translate("crmCrmCreateCustomerComplaint.customerComplaint")
        }
        enableButtons={["back"]}
      />
      <View style={styles.wrapper}>
        <KeyboardAwareScrollView
          enableAutomaticScroll
          extraHeight={100}
          extraScrollHeight={100}
          enableOnAndroid
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 1 }}
        >
          <LabelText
            style={{ color: AppColor.FD.Brand.Solid, marginBottom: 15 }}
          >
            {translate("crmCrmCreateCustomerComplaint.requestType")}
          </LabelText>
          <RadioButtonList
            containerStyle={{ marginBottom: 20 }}
            horizontal
            selectedValue={complaintType}
            onSelect={(type) => {
              if (stateCode === 0) setComplaintType(type);
            }}
            values={[
              {
                value: "3",
                text: translate("crmCrmCreateCustomerComplaint.store"),
                customColor: AppColor.FD.Navy.Greenish,
              },
              {
                value: "1",
                text: translate("crmCrmCreateCustomerComplaint.eCommerce"),
                customColor: AppColor.FD.Navy.Purple,
              },
            ]}
          />

          <AppTextBox
            label={translate("crmCrmCreateCustomerComplaint.complaintTitle")}
            editable={false}
            value={title}
            onChangeText={setTitle}
            labelStyle={{ color: AppColor.FD.Brand.Solid }}
            backgroundColor={{ backgroundColor: "#fff" }}
          />
          <Spacer />
          {complaintType === "1" && (
            <>
              <AppTextBox
                editable={stateCode === 0}
                label={translate("crmCrmCreateCustomerComplaint.orderNum")}
                value={orderNumber}
                maxLength={16}
                onChangeText={setOrderNumber}
                labelStyle={{ color: AppColor.FD.Brand.Solid }}
                backgroundColor={{ backgroundColor: "#fff" }}
              />
              <Spacer />
            </>
          )}
          <AppTextBox
            editable={stateCode === 0}
            label={translate("crmCrmCreateCustomerComplaint.firstName")}
            labelStyle={{ color: AppColor.FD.Brand.Solid }}
            backgroundColor={{ backgroundColor: "#fff" }}
            value={fisrtName}
            onChangeText={setFirstName}
          />
          <Spacer />
          <AppTextBox
            editable={stateCode === 0}
            label={translate("crmCrmCreateCustomerComplaint.lastName")}
            value={lastName}
            onChangeText={setLastName}
            labelStyle={{ color: AppColor.FD.Brand.Solid }}
            backgroundColor={{ backgroundColor: "#fff" }}
          />
          <Spacer />
          <AppTextBox
            editable={stateCode === 0}
            label={translate("crmCrmCreateCustomerComplaint.CustomerPhone")}
            value={phone}
            onChangeText={setPhone}
            format={"phone"}
            maxLength={19}
            labelStyle={{ color: AppColor.FD.Brand.Solid }}
            backgroundColor={{ backgroundColor: "#fff" }}
          />
          <Spacer />
          <AppTextBox
            editable={stateCode === 0}
            label={translate("crmCrmCreateCustomerComplaint.description")}
            multiline
            value={description}
            onChangeText={setDescription}
            labelStyle={{ color: AppColor.FD.Brand.Solid }}
            backgroundColor={{ backgroundColor: "#fff" }}
          />

          {resulution !== null &&
            resulution !== "" &&
            resulution.length > 0 && (
              <View>
                <Spacer />
                <ParagraphText
                  style={{
                    marginLeft: 10,
                    borderColor: AppColor.FD.Text.Ash,
                    marginBottom: 4,
                  }}
                  type={ParagraphTextType.L}
                >
                  {translate(
                    "crmCrmCreateCustomerComplaint.solveTextPlaceholder"
                  )}
                </ParagraphText>
                <ParagraphText
                  selectable
                  style={{ color: AppColor.FD.Text.Ash }}
                >
                  {resulution}
                </ParagraphText>
              </View>
            )}
          {assignedteamName !== null && assignedteamName !== "" && (
            <View>
              <Spacer />
              <ParagraphText
                style={{
                  marginLeft: 10,
                  borderColor: AppColor.FD.Text.Ash,
                  marginBottom: 4,
                }}
                type={ParagraphTextType.L}
              >
                {translate("crmCrmCreateCustomerComplaint.assigneeTeam")}
              </ParagraphText>
              <ParagraphText selectable style={{ color: AppColor.FD.Text.Ash }}>
                {assignedteamName}
              </ParagraphText>
            </View>
          )}

          <View style={{ marginTop: 10 }}>
            <MediaSelectorPopup
              alertMessage={translate(
                "crmCrmCreateCustomerComplaint.photoWarning"
              )}
              settings={{ canEditable: taskId === "", limitCount: 2 }}
            />
          </View>
          {stateCode === 0 && (
            <AppButton
              style={{ marginTop: 15 }}
              title={
                taskId
                  ? translate("crmCrmCreateCustomerComplaint.update")
                  : translate("crmCrmCreateCustomerComplaint.save")
              }
              onPress={onSave}
              buttonColorType={ColorType.Brand}
            />
          )}
          <Spacer />
          {stateCode === 0 && taskId !== "" && (
            <AppButton
              title={translate("crmCrmCreateCustomerComplaint.cancelRequest")}
              onPress={complaintCancel}
              buttonColorType={ColorType.Brand}
            />
          )}
        </KeyboardAwareScrollView>
      </View>
      <SafeAreaView />
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
      {showImagePopup && (
        <ImageViewer
          onCloseImageModal={() => setShowImagePopup(false)}
          imageUrls={[...remoteImages.map((x: any) => x.documentBody[0])]}
        />
      )}
    </View>
  );
};
export default CrmCreateCustomerComplatint;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingVertical: 33,
    paddingHorizontal: 30,
    flex: 1,
  },
});

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Linking,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Text,
} from "react-native";
import { FloHeader } from "../../components/Header";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import RadioButtonList from "../../NewComponents/FormElements/RadioButtonList";
import { AppColor } from "../../theme/AppColor";
import AppTextBox, {
  TextManipulator,
} from "../../NewComponents/FormElements/AppTextBox";
import {
  PinchGestureHandler,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
//TODO: EXPO expo-image-picker
// import * as exImp from "expo-image-picker";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import { translate } from "../../helper/localization/locaizationMain";
//TODO: EXPO expo-image-picker
// import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import AppButton from "../../NewComponents/FormElements/AppButton";
import AppComboBox from "../../NewComponents/FormElements/AppComboBox";
import {
  HeadingText,
  LabelText,
  ParagraphText,
  ParagraphTextType,
} from "../../NewComponents";
import CrmService from "../../core/services/CrmService";
import { Observer } from "mobx-react-lite";
import FloLoading from "../../NewComponents/Animations/FloLoading";
import { FloTextBox } from "../../components";
import CrmImageViewer from "./CrmImageViewer";
import MediaSelectorPopup from "../../components/MediaSelector/MediaSelectorPopup";
import {
  Media,
  useMediaSelector,
} from "../../components/MediaSelector/MediaSelector";

export const clearHtmlText = (txt: string) => {
  if (txt === undefined) return txt;
  let des = txt?.replace(/<[^>]+>/g, "").trim();
  des = des.replace(/\xA0/g, " ");
  while (des.includes("&nbsp;")) des = des.replace("&nbsp;", " ");

  return des;
};
const { width, height } = Dimensions.get("window");
const Spacer: React.FC = (props) => <View style={{ height: 15 }} />;
const CrmCreateCustomerComplatint: React.FC<any> = (props) => {
  const [onLoadingComplate, setOnLoadingComplate] = useState(false);
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
  const { medias, setMedias } = useMediaSelector();

  useEffect(() => {
    if (!onLoadingComplate) {
      const { taskId } = props.navigation.state.params;
      if (taskId) {
        setOnLoadingComplate(true);

        setTaskId(taskId);
        // if (!CrmService.isLoading)
        CrmService.getCustomerComplaintDetail(taskId).then((result) => {
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
          setMedias(
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
        setMedias([]);
      }
    }
  }, []);

  const PickImage = async () => {
 /*   let permState = await exImp.getMediaLibraryPermissionsAsync();

    if (!permState.granted && permState.canAskAgain) {
      await exImp.requestMediaLibraryPermissionsAsync();
      permState = await exImp.getMediaLibraryPermissionsAsync();
    }

    if (!permState.granted) {
      MessageBox.noButton = translate("crmCrmCreateCustomerComplaint.cancel");
      MessageBox.yesButton = translate(
        "crmCrmCreateCustomerComplaint.settings"
      );
      MessageBox.Show(
        translate("errorMsgs.filePermissionError"),
        MessageBoxDetailType.Warning,
        MessageBoxType.YesNo,
        () => {},
        () => {
          Linking.openSettings();
        }
      );
      return;
    }

    exImp
      .launchImageLibraryAsync({
        mediaTypes: exImp.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [18, 9],
        quality: 0.5,
      })
      .then((pickImageResult) => {
        if (pickImageResult.cancelled) return;
        let image: any = {
          ...pickImageResult,
        };
        setImages([...images, image]);
      });

  */
  };

  const removePicture = (uri: string) => {
    setImages(images.filter((x) => x.uri !== uri));
  };

  const onSave = () => {
    let model = {
      phone,
      complaintType,
      title,
      orderNumber,
      fisrtName,
      lastName,
      description,
      medias,
      taskId,
    };

    CrmService.updateCustomerComplaintDetail(model);
  };

  const awareRef = useRef(null);

  const complaintCancel = () => {
    let model = {
      crmId,
      stateCode,
    };
    CrmService.setsateCustomerComplaint(model);
  };

  const [showImagePopup, setShowImagePopup] = useState(false);

  return (
    <View style={styles.container}>
      <FloHeader
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
          <LabelText style={{ color: AppColor.FD.Text.Ash, marginBottom: 15 }}>
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
              />
              <Spacer />
            </>
          )}
          <AppTextBox
            editable={stateCode === 0}
            label={translate("crmCrmCreateCustomerComplaint.firstName")}
            value={fisrtName}
            onChangeText={setFirstName}
          />
          <Spacer />
          <AppTextBox
            editable={stateCode === 0}
            label={translate("crmCrmCreateCustomerComplaint.lastName")}
            value={lastName}
            onChangeText={setLastName}
          />
          <Spacer />
          <AppTextBox
            editable={stateCode === 0}
            label={translate("crmCrmCreateCustomerComplaint.CustomerPhone")}
            value={phone}
            onChangeText={setPhone}
            format={"phone"}
            maxLength={19}
          />
          <Spacer />
          <AppTextBox
            editable={stateCode === 0}
            label={translate("crmCrmCreateCustomerComplaint.description")}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {resulution !== null && resulution !== "" && resulution.length > 0 && (
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
              <ParagraphText selectable style={{ color: AppColor.FD.Text.Ash }}>
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
            <Observer>
              {() => (
                <AppButton
                  style={{ marginTop: 15 }}
                  label={
                    taskId
                      ? translate("crmCrmCreateCustomerComplaint.update")
                      : translate("crmCrmCreateCustomerComplaint.save")
                  }
                  onPress={onSave}
                />
              )}
            </Observer>
          )}
          <Spacer />
          {stateCode === 0 && taskId !== "" && (
            <AppButton
              label={translate("crmCrmCreateCustomerComplaint.cancelRequest")}
              onPress={complaintCancel}
            />
          )}
        </KeyboardAwareScrollView>
      </View>
      <SafeAreaView />
      <Observer>
        {() => {
          if (CrmService.isLoading)
            return (
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
            );
          return null;
        }}
      </Observer>
      {showImagePopup && (
        <CrmImageViewer
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

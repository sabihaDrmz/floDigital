import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput
} from "react-native";
import { Image } from "react-native";
import moment from "moment";
import { AppColor } from "@flomagazacilik/flo-digital-components";
import { PerfectFontSize } from "../../../src/helper/PerfectPixel";
import { CRMCaseModel } from "../../../src/core/models/CrmCaseModel";
import { translate } from "../../../src/helper/localization/locaizationMain";
import {
  CrmTaskStateArray,
  GetCrmStateText,
  ReasonForHolding,
  TaskState,
} from "../../../src/constant/CrmDefinations";
import { useMediaSelector } from "../../../src/components/MediaSelector/MediaSelector";
import { colors } from "../../../src/theme/colors";
import FloComboBox from "../../../src/components/FloComobox";
import FloHeaderNew from "../../../src/components/Header/FloHeaderNew";
import MediaSelectorPopup from "../../../src/components/MediaSelector/MediaSelectorPopup";
import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import { FloButton } from "../../../src/components";
import FloLoading from "../../components/FloLoading";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import RNFetchBlob from 'react-native-blob-util';
import { Portal } from "react-native-portalize";
import { useCrmService } from "../../contexts/CrmService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";

const CaseDetailScreen: React.FC = (props) => {
  const { show } = useMessageBoxService();
  const { selectedCase, updateCase, crmTeams, crmAccountInfo, getAttachmentById, isLoading } = useCrmService();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [solveText, setSolveText] = useState(
    selectedCase?.taskResolutionDescription ?? ""
  );
  const { medias, setMediasData } = useMediaSelector();
  const [crmTaskStateId, setCrmTaskStateId] = useState(-1);
  const [crmTeamId, setCrmTeamId] = useState(
    "00000000-0000-0000-0000-000000000000"
  );
  const [reasonForHolding, setReasonForHolding] = useState(-1);
  const [selectedPhoto, setselectedPhoto] = useState("");

  const ApplicationGlobalService = useApplicationGlobalService();

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    if (selectedImages === undefined) setSelectedImages([]);
    setMediasData([]);
  }, []);

  useEffect(() => {
    if (selectedPhoto) {
      ApplicationGlobalService.showFullScreenImage(
        `data:image/png;base64,${selectedPhoto}`
      );
    }
  }, [selectedPhoto]);

  useEffect(() => {
    if (ApplicationGlobalService.isShowFullScreenImage === false) {
      setselectedPhoto("");
    }
  }, [ApplicationGlobalService.isShowFullScreenImage]);

  const compressionQuality=(size:number):number=>{
    let fileSizeInMB = size / (1024 * 1024);
    console.log(fileSizeInMB)
    if(fileSizeInMB > 0.5 && fileSizeInMB < 1){
      return 0.8
    }else if(fileSizeInMB > 1 && fileSizeInMB < 2){
      return 0.7
    }  else if (fileSizeInMB > 2) {
     return 0.5
    }
    return 1
  }

  const updateCaseProcess = async () => {
    let tmpMedias = [];
    // Fotoğrafları küçültmek için döngü
   
    for (let index = 0; index < medias.length; index++) {
      // Webde farklı bir şekilde çalışıyor

        // web üzerinde herhani bir fotoğraf eklemek isterse

        // TODO web image manipulastion
      /*
        let base64Data = medias[index].Url;
        const manipResult = await ImageManipulator.manipulateAsync(
          base64Data,
          [{ resize: { width: 720, height: 1280 } }],
          { compress: 0.3 }
        );
        medias[index].Url = manipResult.uri;
        tmpMedias.push(medias[index]);
        */
      
    }

    updateCase({
      activityId: selectedCase?.activityid,
      crmTaskStateId: crmTaskStateId,
      crmTeamId: crmTeamId,
      pickImages: tmpMedias,
      inputText: solveText,
      reasonForHolding: reasonForHolding,
      onHoldBefore: selectedCase?.onHoldBefore,
    });
  };

  const Sperator: React.FC = (props) => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#e4e4e4",
          marginHorizontal: 12,
          marginVertical: 7.5,
        }}
      />
    );
  };

  const TitleValue: React.FC<{ title: string; info: string }> = (props) => {
    return (
      <React.Fragment>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width - 60,
              backgroundColor: AppColor.FD.Brand.Solid,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <Text style={styles.detailTitle}>{props.title}</Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
              <Text selectable style={styles.detailInfo}>
                {props.info}
              </Text>
            </View>
          </View>
        </View>
      </React.Fragment>
    );
  };

  const TitleDetailValue: React.FC<{ title: string; info: string }> = (
    props
  ) => {
    return (
      <React.Fragment>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: PerfectFontSize(16),
                fontStyle: "normal",
                letterSpacing: 0.6,
                textAlign: "left",
                color: AppColor.FD.Brand.Solid,
                paddingHorizontal: 15,
              }}
            >
              {props.title}
            </Text>
            <Text
              selectable
              style={{
                paddingHorizontal: 15,
                fontFamily: "Poppins_500Medium",
                fontSize: PerfectFontSize(16),
                color: "#7c7c7c",
              }}
            >
              {props.info}
            </Text>
            <Sperator />
          </View>
        </View>
      </React.Fragment>
    );
  };

  const TaskDetail: React.FC<{ case: CRMCaseModel }> = (props) => {
    return (
      <ScrollView bounces={false} bouncesZoom={true}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.line} />
          <Text style={styles.taskDetailBreadCrump} numberOfLines={1}>
            {props.case.incident.layer1.name} /{" "}
            {props.case.incident.layer2.name}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
        >
          <Image
            source={require("../../assets/crmfileicon.png")}
            style={{ width: 12, height: 15, marginRight: 14 }}
          />
          <Text style={styles.layer3}>{props.case.incident.layer3.name}</Text>
        </View>
        <Sperator />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: AppColor.FD.Brand.Solid,
              width: "100%",
              padding: 5,
            }}
          >
            <Image
              source={require("../../assets/crmcalendaricon.png")}
              style={{
                width: 15,
                height: 15,
                margin: 5,
                resizeMode: "contain",
                backgroundColor: "#fff",
              }}
            />
            <Text style={styles.createOnDetail}>
              {translate("crm.createdDate", {
                createDate: moment(props.case.incident.createdOn).format(
                  "DD/MM/YYYY HH:mm"
                ),
              })}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              width: "100%",
              paddingBottom: 20,
            }}
          >
            <TitleDetailValue
              title={translate("crm.serviceRequesNum")}
              info={props.case.incident.ticketNumber}
            />
            <TitleDetailValue
              title={"Aktif Görev Durumu"}
              //@ts-ignore
              info={
                props.case.statusCode === 3
                  ? "Devam ediyor"
                  : GetCrmStateText(props.case?.statusCode)
              }
            />
            <TitleDetailValue
              title={translate("crm.orderNum")}
              info={
                props.case.incident.orderNumber &&
                  props.case.incident.orderNumber.length > 0
                  ? props.case.incident.orderNumber
                  : "-"
              }
            />
            <TitleDetailValue
              title={translate("crm.shipmentNum")}
              info={
                props.case.incident.shipmentNumber &&
                  props.case.incident.shipmentNumber.length > 0
                  ? props.case.incident.shipmentNumber
                  : "-"
              }
            />
            <TitleDetailValue
              title={translate("crm.productNum")}
              info={
                props.case.incident.productID
                  ? props.case.incident.productID
                  : "-"
              }
            />
            <TitleDetailValue
              title={translate("crm.uibNum")}
              info={props.case.incident.uibNo ? props.case.incident.uibNo : "-"}
            />
            <TitleDetailValue
              title={translate("crmCaseCard.remainingTime")}
              info={
                props.case.timeToClosingDate
                  ? props.case.timeToClosingDate
                  : "-"
              }
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  const Task: React.FC<{
    case: CRMCaseModel;
    images: any;
    crmTeamId?: string;
    crmTaskState?: number;
    reasonForHoldingID?: number;
    onSelectImage: (images: any) => void;
    onChangeTaskStateId: (state: number) => void;
    onChangeCrmTeamId: (state: string) => void;
    onChangeReasonForHolding: (state: number) => void;
  }> = (props) => {
    return (
      <>
        <TitleValue title={translate("crm.title")} info={props.case?.subject} />
        <TitleValue
          title={translate("crm.assigneeTeam")}
          info={
            crmTeams.find(
              (x) => x.teamId === crmAccountInfo.teamId
            )?.name
          }
        />
        <TitleValue
          title={translate("crm.detail")}
          info={props.case?.description}
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width - 60,
              backgroundColor: AppColor.FD.Brand.Solid,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              paddingBottom: 14,
            }}
          >
            <Text style={styles.detailTitle}>Görev Durumu</Text>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 10,
            marginTop: -14,
          }}
        >
          <FloComboBox
            isReadOnly={false}
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
            containerStyle={{
              borderColor: "rgb(206,202,202)",
              backgroundColor: "#fff",
            }}
            textColor={"#7c7c7c"}
            fontSize="14"
          />
        </View>
        {props.crmTaskState === TaskState.GorevIadeHataliAtama && (
          <>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width - 60,
                  backgroundColor: AppColor.FD.Brand.Solid,
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  paddingBottom: 14,
                }}
              >
                <Text style={styles.detailTitle}>Doğru Takım</Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 10, marginTop: -14 }}>
              <FloComboBox
                isReadOnly={props.case.gorevDurumu != -1}
                data={crmTeams}
                keyProp="teamId"
                valueProp="name"
                selectedItem={crmTeams.find(
                  (x) => x.teamId === props.crmTeamId
                )}
                onSelectItem={(item) => {
                  props.onChangeCrmTeamId(item.teamId);
                }}
                placeholder={translate("crmTaskView.chooseTheRightTeam")}
                containerStyle={{
                  borderColor: "rgb(206,202,202)",
                  backgroundColor: "#fff",
                }}
                textColor={"#7c7c7c"}
                fontSize="14"
              />
            </View>
          </>
        )}
        {props.crmTaskState === TaskState.BeklemeyeAlindi && (
          <>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width - 60,
                  backgroundColor: AppColor.FD.Brand.Solid,
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 14,
                }}
              >
                <Text style={styles.detailTitle}>Beklemeye Alma Nedeni</Text>
                <Text style={{ color: "red", marginHorizontal: 2 }}>*</Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 10, marginTop: -14 }}>
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
                containerStyle={{
                  borderColor: "rgb(206,202,202)",
                  backgroundColor: "#fff",
                }}
                textColor={"#7c7c7c"}
                fontSize="14"
              />
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={translate("crm.caseDetail")}
        tabs={[
          {
            defaultItem: (
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: Dimensions.get("window").width / 2,
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
                    color: "#fff",
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  {translate("crmCaseDetailScreen.task")}
                </Text>
                <View
                  style={{
                    backgroundColor:
                      selectedTab === 0 ? "#fff" : AppColor.FD.Brand.Solid,
                    height: 5,
                    width: Dimensions.get("window").width / 2,
                  }}
                ></View>
              </View>
            ),
          },
          {
            defaultItem: (
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: Dimensions.get("window").width / 2,
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
                    color: "#fff",
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  {translate("crmCaseDetailScreen.taskDetails")}
                </Text>
                <View
                  style={{
                    backgroundColor:
                      selectedTab === 1 ? "#fff" : AppColor.FD.Brand.Solid,
                    height: 5,
                    width: Dimensions.get("window").width / 2,
                  }}
                ></View>
              </View>
            ),
          },
        ]}
        onChangeTab={setSelectedTab}
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
          {selectedTab === 0 && (
            <>
              <Task
                onSelectImage={setSelectedImages}
                images={selectedImages}
                case={selectedCase}
                onChangeCrmTeamId={setCrmTeamId}
                onChangeTaskStateId={setCrmTaskStateId}
                crmTaskState={
                  crmTaskStateId !== -1 ||
                    selectedCase?.statusCode === 3
                    ? crmTaskStateId
                    : selectedCase?.statusCode
                }
                crmTeamId={crmTeamId}
                onChangeReasonForHolding={setReasonForHolding}
                reasonForHoldingID={
                  reasonForHolding !== -1
                    ? reasonForHolding
                    : selectedCase?.reasonForHolding
                }
              />
              <View style={{ paddingBottom: 30 }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width - 60,
                      backgroundColor: AppColor.FD.Brand.Solid,
                      borderRadius: 10,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                  >
                    <Text style={styles.detailTitle}>Çözüm</Text>
                    <TextInput
                      placeholder={"Çözüm Açıklaması Giriniz"}
                      multiline
                      numberOfLines={10}
                      maxLength={400}
                      value={solveText}
                      onChangeText={setSolveText}
                      underlineColorAndroid={"transparent"}
                      style={{
                        borderWidth: 1,
                        borderColor: "rgb(206,202,202)",
                        paddingHorizontal: 10,
                        paddingTop: 16,
                        lineHeight: 21,
                        borderRadius: 8,
                        fontFamily: "Poppins_400Regular",
                        fontSize: PerfectFontSize(14),
                        color: colors.darkGrey,
                        maxHeight: 160,
                        minHeight: 56,
                        backgroundColor: "#fff",
                      }}
                      placeholderTextColor={colors.darkGrey}
                    />
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width - 60,
                      backgroundColor: AppColor.FD.Brand.Solid,
                      borderRadius: 10,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                  >
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
                <View
                  style={{
                    marginTop: 10,
                    flex: 1,
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.extra}>Ekler</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {selectedCase.attachmentIdList.length > 0 &&
                      selectedCase.attachmentIdList.map(
                        (val, index) => (
                          <TouchableOpacity
                            style={{
                              borderRadius: 10,
                              backgroundColor: AppColor.FD.Brand.Solid,
                              marginRight: 5,
                              marginTop: 5,
                              width: 80,
                            }}
                            onPress={async () => {
                              const res = await getAttachmentById(
                                val
                              );
                              if (res.data.model) {
                                setselectedPhoto(res.data.model);
                                ApplicationGlobalService.showFullScreenImage(
                                  `data:image/png;base64,${res.data.model}`
                                );
                              }
                            }}
                          >
                            <Text
                              style={{
                                paddingHorizontal: 10,
                                paddingTop: 16,
                                lineHeight: 21,
                                borderRadius: 30,
                                fontFamily: "Poppins_400Regular",
                                fontSize: PerfectFontSize(14),
                                maxHeight: 160,
                                minHeight: 56,
                                marginRight: 5,
                                color: "#fff",
                                textAlign: "center",
                              }}
                            >
                              Ek - {index + 1}
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                  </View>
                </View>
              </View>
            </>
          )}
          {selectedTab === 1 && <TaskDetail case={selectedCase} />}
        </KeyboardAwareScrollView>
      </View>
      <View
        style={{
          padding: 20,
          borderTopWidth: 0.5,
          borderColor: "#7c7c7c",
          backgroundColor: "#fff",
        }}
      >
        <FloButton
          title={translate("crm.save")}
          isLoading={isLoading}
          onPress={() => {
            if (crmTaskStateId === 7 && reasonForHolding === -1) {
              show("Lütfen Beklemeye Alma Nedeni Seçiniz");
              return;
            }

            if (crmTaskStateId === -1) {
              show("Lütfen Görev Durumu Seçiniz");
              return;
            }

            if (
              solveText === undefined ||
              solveText === null ||
              solveText === ""
            ) {
              show("Lütfen Çözüm Açıklaması Giriniz");
              return;
            }

            updateCaseProcess();
          }}
          disabled={isLoading}
        />
      </View>
      <SafeAreaView />
      {isLoading && (
        <Portal>
          <View
            style={{
              position: "absolute",
              width,
              height: height,
              backgroundColor: "rgba(0,0,0,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FloLoading />
          </View>
        </Portal>
      )}
    </ScrollView>
  );
};
export default CaseDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  taskDetailBreadCrump: {
    fontSize: PerfectFontSize(12),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 1.08,
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
    fontSize: PerfectFontSize(16),
    fontWeight: "400",
    letterSpacing: 0.6,
    color: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  detailTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(15),
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0.6,
    textAlign: "left",
    color: "#fff",
    padding: 5,
  },
  extra: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(20),
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0.6,
    textAlign: "center",
    color: "orange",
    padding: 5,
  },
  detailInfo: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    fontStyle: "normal",
    letterSpacing: 0.75,
    color: "#7c7c7c",
    padding: 7,
  },
});
